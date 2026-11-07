const arrayOrEmpty = (value) => Array.isArray(value) ? value.filter(Boolean) : [];
const joinOr = (value, fallback) => arrayOrEmpty(value).join(', ') || fallback;

/**
 * Convert the UI state into a reproducible three-layer generation payload.
 * Catalog ids are deliberately preserved; the backend resolves display metadata.
 */
export function buildPromptPayload(project = {}) {
  const vocal = project.vocal ?? {};
  const instruments = project.instruments ?? {};
  const mixMaster = project.mixMaster ?? {};

  return {
    schemaVersion: 'bixtone.prompt.v1',
    project: {
      title: project.title || 'Untitled BIXTONE Project',
      mode: project.mode || 'song',
      language: project.language || 'id',
      tempoEnabled: project.tempoEnabled === true,
      tempoBpm: project.tempoEnabled === true ? (project.tempoBpm ?? null) : null,
      key: project.key || 'auto',
      durationSeconds: project.durationSeconds ?? 180,
      structure: arrayOrEmpty(project.structure).length
        ? project.structure
        : ['intro', 'verse', 'pre_chorus', 'chorus', 'verse', 'bridge', 'chorus', 'outro']
    },
    layer1Vocal: {
      type: vocal.type || 'male',
      duetPairing: vocal.type === 'duet' ? vocal.duetPairing || null : null,
      characterIds: arrayOrEmpty(vocal.characterIds),
      lyricSource: project.mode === 'instrumental' ? 'none' : (vocal.lyrics ? 'manual' : 'empty'),
      lyrics: project.mode === 'instrumental' ? '' : (vocal.lyrics || ''),
      delivery: arrayOrEmpty(vocal.delivery),
      priority: ['lyric-clarity', 'hook-recall']
    },
    layer2Instrument: {
      moodIds: arrayOrEmpty(project.moodIds),
      genreIds: arrayOrEmpty(project.genreIds),
      microphoneId: project.microphoneId || null,
      ampIds: arrayOrEmpty(instruments.ampIds),
      cabIds: arrayOrEmpty(instruments.cabIds),
      electricGuitarIds: arrayOrEmpty(instruments.electricGuitarIds),
      acousticGuitarIds: arrayOrEmpty(instruments.acousticGuitarIds),
      bassId: instruments.bassId || null,
      drumId: instruments.drumId || null,
      snareId: instruments.snareId || null,
      cymbalsId: instruments.cymbalsId || null,
      guitarEffectIds: arrayOrEmpty(instruments.guitarEffectIds),
      bassEffectIds: arrayOrEmpty(instruments.bassEffectIds),
      worldInstrumentIds: arrayOrEmpty(instruments.worldInstrumentIds),
      routing: {
        amp: instruments.ampRouting || 'serial',
        cab: instruments.cabRouting || 'serial',
        effects: instruments.effectRouting || 'serial'
      }
    },
    layer3MixMaster: {
      mixerId: mixMaster.mixerId || null,
      masteringId: mixMaster.masteringId || null,
      loudnessProfile: mixMaster.loudnessProfile || 'streaming-safe',
      stereoProfile: mixMaster.stereoProfile || 'wide-but-compatible',
      mixPriorities: arrayOrEmpty(mixMaster.mixPriorities).length
        ? mixMaster.mixPriorities
        : ['vocal-clarity', 'melody-forward', 'controlled-low-end']
    },
    melodyPriority: {
      intro: project.melodyPriority?.intro || 'state-main-motif',
      middle: project.melodyPriority?.middle || 'restate-and-develop-main-motif',
      outro: project.melodyPriority?.outro || 'resolve-or-echo-main-motif'
    },
    policy: {
      referencePolicyAccepted: project.referencePolicyAccepted === true,
      doNotImitateIdentifiableArtistOrProduct: true,
      catalogReferenceMode: 'descriptive-only'
    }
  };
}

/** Build a human-readable prompt while keeping the JSON payload as source of truth. */
export function buildPromptText(project = {}) {
  const payload = buildPromptPayload(project);
  const p = payload.project;
  const v = payload.layer1Vocal;
  const i = payload.layer2Instrument;
  const m = payload.layer3MixMaster;
  const melody = payload.melodyPriority;

  const vocalLine = p.mode === 'instrumental'
    ? 'Instrumental mode; no lead vocal. Let the main motif lead the arrangement.'
    : `Use ${v.type}${v.duetPairing ? ` (${v.duetPairing})` : ''} vocal traits: ${joinOr(v.characterIds, 'neutral synthetic vocal')}. Preserve the supplied lyrics with clear diction.`;

  return [
    '[PROJECT]',
    `Create “${p.title}” in ${p.language}, ${p.tempoEnabled ? `${p.tempoBpm} BPM` : 'tempo auto'}, key ${p.key}, target ${p.durationSeconds}s.`,
    `Structure: ${p.structure.join(' → ')}.`,
    '',
    '[LAYER 1 — VOCAL]',
    vocalLine,
    'Do not imitate an identifiable real singer.',
    '',
    '[LAYER 2 — INSTRUMENT]',
    `Blend moods: ${joinOr(i.moodIds, 'balanced')}. Genres: ${joinOr(i.genreIds, 'coherent contemporary genre')}.`,
    `Use selected instrument and gear ids as descriptive tonal references only: ${joinOr([...i.ampIds, ...i.cabIds, ...i.electricGuitarIds, ...i.acousticGuitarIds, ...i.guitarEffectIds], 'clean studio palette')}.`,
    '',
    '[LAYER 3 — MIX / MASTER]',
    `Use ${m.mixerId || 'a clean console profile'} and ${m.masteringId || 'a transparent mastering profile'}; ${m.loudnessProfile}, ${m.stereoProfile}.`,
    `Priorities: ${m.mixPriorities.join(', ')}.`,
    '',
    '[MELODY PRIORITY]',
    `Intro: ${melody.intro}. Middle: ${melody.middle}. Outro: ${melody.outro}.`,
    '',
    '[REFERENCE POLICY]',
    'Brand/product references are descriptive only; not official, affiliated, endorsed, or exact emulations.'
  ].join('\n');
}
