import test from 'node:test';
import assert from 'node:assert/strict';
import { validateProject, selectionSummary } from '../src/validation.mjs';
import { buildPromptPayload, buildPromptText } from '../src/prompt-builder.mjs';

const baseProject = {
  title: 'Langit di Atas Kota',
  mode: 'song',
  language: 'id',
  tempoBpm: 96,
  tempoEnabled: true,
  key: 'A minor',
  durationSeconds: 180,
  lyrics: '[Verse]\nKita berjalan',
  vocal: {
    type: 'duet',
    duetPairing: 'male-female',
    characterIds: ['warm-tenor', 'airy-alto'],
    lyrics: '[Verse]\nKita berjalan',
    delivery: ['intimate', 'clear']
  },
  moodIds: ['hopeful', 'nostalgic'],
  genreIds: ['indie-pop'],
  microphoneId: 'mic-01',
  instruments: {
    ampIds: ['amp-01'],
    cabIds: ['cab-01'],
    electricGuitarIds: ['eg-01'],
    acousticGuitarIds: ['ag-01'],
    bassId: 'bass-01',
    drumId: 'drum-01',
    snareId: 'snare-01',
    cymbalsId: 'cymbal-01',
    guitarEffectIds: ['ge-01'],
    bassEffectIds: ['be-01'],
    worldInstrumentIds: ['world-01'],
    ampRouting: 'serial',
    cabRouting: 'parallel',
    effectRouting: 'serial'
  },
  mixMaster: {
    mixerId: 'mixer-01',
    masteringId: 'master-01',
    loudnessProfile: 'streaming-safe',
    stereoProfile: 'wide-but-compatible',
    mixPriorities: ['vocal-clarity', 'melody-forward']
  },
  melodyPriority: {
    intro: 'state-main-motif',
    middle: 'restate-and-develop-main-motif',
    outro: 'resolve-main-motif'
  },
  referencePolicyAccepted: true
};

test('accepts a valid duet project with two guitars', () => {
  const result = validateProject(baseProject);
  assert.equal(result.valid, true);
  assert.deepEqual(result.errors, []);
});

test('rejects duet without a valid pairing', () => {
  const project = structuredClone(baseProject);
  project.vocal.duetPairing = null;
  const result = validateProject(project);
  assert.equal(result.valid, false);
  assert.ok(result.errors.some((error) => error.code === 'DUET_PAIRING_REQUIRED'));
});

test('rejects more than two guitars across electric and acoustic tabs', () => {
  const project = structuredClone(baseProject);
  project.instruments.electricGuitarIds = ['eg-01', 'eg-02'];
  project.instruments.acousticGuitarIds = ['ag-01'];
  const result = validateProject(project);
  assert.ok(result.errors.some((error) => error.field === 'instruments.guitarIds'));
});

test('rejects over-limit effects and missing reference consent', () => {
  const project = structuredClone(baseProject);
  project.instruments.guitarEffectIds = Array.from({ length: 13 }, (_, i) => `ge-${i}`);
  project.instruments.bassEffectIds = Array.from({ length: 11 }, (_, i) => `be-${i}`);
  project.referencePolicyAccepted = false;
  const result = validateProject(project);
  assert.ok(result.errors.some((error) => error.code === 'MAX_SELECTION_EXCEEDED' && error.field === 'instruments.guitarEffectIds'));
  assert.ok(result.errors.some((error) => error.code === 'MAX_SELECTION_EXCEEDED' && error.field === 'instruments.bassEffectIds'));
  assert.ok(result.errors.some((error) => error.code === 'REFERENCE_POLICY_MUST_BE_ACCEPTED'));
});

test('allows instrumental mode without lyrics and warns when lyrics are supplied', () => {
  const project = structuredClone(baseProject);
  project.mode = 'instrumental';
  project.lyrics = '';
  project.vocal.lyrics = '';
  const result = validateProject(project);
  assert.equal(result.valid, true);
  assert.equal(result.warnings.length, 0);

  project.lyrics = 'ignored lyric';
  const warned = validateProject(project);
  assert.ok(warned.warnings.some((warning) => warning.code === 'LYRICS_IGNORED_IN_INSTRUMENTAL'));
});

test('rejects duration outside 1–8 minutes and tempo outside 50–200 BPM', () => {
  const durationTooShort = structuredClone(baseProject);
  durationTooShort.durationSeconds = 59;
  const shortResult = validateProject(durationTooShort);
  assert.ok(shortResult.errors.some((error) => error.code === 'INVALID_DURATION'));

  const tempoTooHigh = structuredClone(baseProject);
  tempoTooHigh.tempoBpm = 201;
  const fastResult = validateProject(tempoTooHigh);
  assert.ok(fastResult.errors.some((error) => error.code === 'INVALID_TEMPO'));
});

test('allows tempo Off and removes numeric tempo from the prompt payload', () => {
  const project = structuredClone(baseProject);
  project.tempoEnabled = false;
  project.tempoBpm = 128;
  const result = validateProject(project);
  assert.equal(result.valid, true);
  assert.ok(result.warnings.some((warning) => warning.code === 'TEMPO_IGNORED_WHEN_DISABLED'));

  const payload = buildPromptPayload(project);
  assert.equal(payload.project.tempoEnabled, false);
  assert.equal(payload.project.tempoBpm, null);
  assert.match(buildPromptText(project), /tempo auto/);
});

test('builds separated three-layer payload and policy guard', () => {
  const payload = buildPromptPayload(baseProject);
  assert.equal(payload.schemaVersion, 'bixtone.prompt.v1');
  assert.equal(payload.layer1Vocal.duetPairing, 'male-female');
  assert.deepEqual(payload.layer2Instrument.electricGuitarIds, ['eg-01']);
  assert.equal(payload.layer3MixMaster.masteringId, 'master-01');
  assert.equal(payload.melodyPriority.intro, 'state-main-motif');
  assert.equal(payload.policy.doNotImitateIdentifiableArtistOrProduct, true);

  const text = buildPromptText(baseProject);
  assert.match(text, /LAYER 1 — VOCAL/);
  assert.match(text, /LAYER 2 — INSTRUMENT/);
  assert.match(text, /LAYER 3 — MIX \/ MASTER/);
  assert.match(text, /Brand\/product references are descriptive only/);
});

test('deduplicates selections in the summary', () => {
  const project = structuredClone(baseProject);
  project.vocal.characterIds = ['a', 'a', 'b'];
  project.moodIds = ['m1', 'm1'];
  assert.deepEqual(selectionSummary(project), {
    voiceCharacter: '2/8',
    mood: '1/8',
    genre: '1/8',
    guitar: '2/2',
    guitarEffect: '1/12',
    bassEffect: '1/10',
    worldInstrument: '1/8'
  });
});
