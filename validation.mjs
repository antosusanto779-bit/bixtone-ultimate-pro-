export const SELECTION_LIMITS = Object.freeze({
  voiceCharacter: 8,
  mood: 8,
  genre: 8,
  microphone: 1,
  amp: 4,
  cab: 4,
  guitarTotal: 2,
  bass: 1,
  drum: 1,
  snare: 1,
  cymbals: 1,
  mixer: 1,
  mastering: 1,
  guitarEffect: 12,
  bassEffect: 10,
  worldInstrument: 8
});

export const GENERATION_CONSTRAINTS = Object.freeze({
  minDurationSeconds: 60,
  maxDurationSeconds: 480,
  minTempoBpm: 50,
  maxTempoBpm: 200
});

const asArray = (value) => Array.isArray(value) ? value.filter(Boolean) : [];
const unique = (value) => [...new Set(asArray(value))];
const count = (value) => unique(value).length;

function addLimitError(errors, field, values, max) {
  const total = count(values);
  if (total > max) errors.push({ field, code: 'MAX_SELECTION_EXCEEDED', max, actual: total });
}

function addSingleError(errors, field, value) {
  if (Array.isArray(value) && value.length > 1) {
    errors.push({ field, code: 'SINGLE_SELECTION_ONLY', max: 1, actual: value.length });
  }
}

/**
 * Validate a structured BIXTONE generation request before sending it to the API.
 * This function is intentionally independent of any UI framework.
 */
export function validateProject(project = {}) {
  const errors = [];
  const warnings = [];
  const vocal = project.vocal ?? {};
  const instruments = project.instruments ?? {};
  const mix = project.mixMaster ?? {};
  const melodyPriority = project.melodyPriority ?? {};

  if (project.durationSeconds == null) {
    errors.push({ field: 'durationSeconds', code: 'DURATION_REQUIRED', min: GENERATION_CONSTRAINTS.minDurationSeconds, max: GENERATION_CONSTRAINTS.maxDurationSeconds });
  } else if (!Number.isInteger(project.durationSeconds) || project.durationSeconds < GENERATION_CONSTRAINTS.minDurationSeconds || project.durationSeconds > GENERATION_CONSTRAINTS.maxDurationSeconds) {
    errors.push({ field: 'durationSeconds', code: 'INVALID_DURATION', min: GENERATION_CONSTRAINTS.minDurationSeconds, max: GENERATION_CONSTRAINTS.maxDurationSeconds, actual: project.durationSeconds });
  }

  const tempoEnabled = project.tempoEnabled === true;
  if (tempoEnabled) {
    if (!Number.isInteger(project.tempoBpm) || project.tempoBpm < GENERATION_CONSTRAINTS.minTempoBpm || project.tempoBpm > GENERATION_CONSTRAINTS.maxTempoBpm) {
      errors.push({ field: 'tempoBpm', code: 'INVALID_TEMPO', min: GENERATION_CONSTRAINTS.minTempoBpm, max: GENERATION_CONSTRAINTS.maxTempoBpm, actual: project.tempoBpm });
    }
  } else if (project.tempoBpm != null) {
    warnings.push({ field: 'tempoBpm', code: 'TEMPO_IGNORED_WHEN_DISABLED' });
  }

  addLimitError(errors, 'vocal.characterIds', vocal.characterIds, SELECTION_LIMITS.voiceCharacter);
  addLimitError(errors, 'moodIds', project.moodIds, SELECTION_LIMITS.mood);
  addLimitError(errors, 'genreIds', project.genreIds, SELECTION_LIMITS.genre);
  addLimitError(errors, 'instruments.ampIds', instruments.ampIds, SELECTION_LIMITS.amp);
  addLimitError(errors, 'instruments.cabIds', instruments.cabIds, SELECTION_LIMITS.cab);
  addLimitError(errors, 'instruments.guitarEffectIds', instruments.guitarEffectIds, SELECTION_LIMITS.guitarEffect);
  addLimitError(errors, 'instruments.bassEffectIds', instruments.bassEffectIds, SELECTION_LIMITS.bassEffect);
  addLimitError(errors, 'instruments.worldInstrumentIds', instruments.worldInstrumentIds, SELECTION_LIMITS.worldInstrument);

  addLimitError(errors, 'instruments.guitarIds', [
    ...asArray(instruments.electricGuitarIds),
    ...asArray(instruments.acousticGuitarIds)
  ], SELECTION_LIMITS.guitarTotal);

  addSingleError(errors, 'microphoneId', project.microphoneId);
  addSingleError(errors, 'instruments.bassId', instruments.bassId);
  addSingleError(errors, 'instruments.drumId', instruments.drumId);
  addSingleError(errors, 'instruments.snareId', instruments.snareId);
  addSingleError(errors, 'instruments.cymbalsId', instruments.cymbalsId);
  addSingleError(errors, 'mixMaster.mixerId', mix.mixerId);
  addSingleError(errors, 'mixMaster.masteringId', mix.masteringId);

  if (!['male', 'female', 'duet'].includes(vocal.type)) {
    errors.push({ field: 'vocal.type', code: 'INVALID_VOCAL_TYPE' });
  }
  if (vocal.type === 'duet' && !['male-male', 'female-female', 'male-female'].includes(vocal.duetPairing)) {
    errors.push({ field: 'vocal.duetPairing', code: 'DUET_PAIRING_REQUIRED' });
  }
  if (vocal.type !== 'duet' && vocal.duetPairing) {
    errors.push({ field: 'vocal.duetPairing', code: 'DUET_PAIRING_NOT_ALLOWED' });
  }

  if (project.mode === 'song' && !String(project.lyrics ?? '').trim()) {
    warnings.push({ field: 'lyrics', code: 'LYRICS_EMPTY_FOR_SONG' });
  }
  if (project.mode === 'instrumental' && String(project.lyrics ?? '').trim()) {
    warnings.push({ field: 'lyrics', code: 'LYRICS_IGNORED_IN_INSTRUMENTAL' });
  }

  for (const [section, key] of [['intro', 'intro'], ['middle', 'middle'], ['outro', 'outro']]) {
    if (!String(melodyPriority[key] ?? '').trim()) {
      errors.push({ field: `melodyPriority.${section}`, code: 'MELODY_PRIORITY_REQUIRED' });
    }
  }

  if (project.referencePolicyAccepted !== true) {
    errors.push({ field: 'referencePolicyAccepted', code: 'REFERENCE_POLICY_MUST_BE_ACCEPTED' });
  }

  return { valid: errors.length === 0, errors, warnings };
}

export function selectionSummary(project = {}) {
  const vocal = project.vocal ?? {};
  const instruments = project.instruments ?? {};
  return {
    voiceCharacter: `${count(vocal.characterIds)}/${SELECTION_LIMITS.voiceCharacter}`,
    mood: `${count(project.moodIds)}/${SELECTION_LIMITS.mood}`,
    genre: `${count(project.genreIds)}/${SELECTION_LIMITS.genre}`,
    guitar: `${count([...asArray(instruments.electricGuitarIds), ...asArray(instruments.acousticGuitarIds)])}/${SELECTION_LIMITS.guitarTotal}`,
    guitarEffect: `${count(instruments.guitarEffectIds)}/${SELECTION_LIMITS.guitarEffect}`,
    bassEffect: `${count(instruments.bassEffectIds)}/${SELECTION_LIMITS.bassEffect}`,
    worldInstrument: `${count(instruments.worldInstrumentIds)}/${SELECTION_LIMITS.worldInstrument}`
  };
}
