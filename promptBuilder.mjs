// promptBuilder.mjs
// BIXTONE ULTIMATE PRO - BIXLABS BOYOLALI
// 3 LAYER SEBAGAI PROMPT - FINAL PROMPT = [L1] + [L2] + [L3]
// Semua brand wajib style/inspire by

const formatBrand = (item) => {
  if (!item) return null;
  if (typeof item === 'string') return item;
  const name = item.name || item.brand || '';
  const style = item.inspire_by || item.style || 'generic descriptor';
  return `${name} style/inspire by ${style}`;
};

const sliceMax = (arr, max) => Array.isArray(arr) ? arr.slice(0, max).map(formatBrand) : [];

export function buildBixtonePrompt(layer1, layer2, layer3) {
  const duration = Math.min(480, Math.max(60, layer1?.durationSeconds || 180));
  const tempoEnabled = !!layer1?.tempoEnabled;
  const tempoBpm = tempoEnabled ? Math.min(200, Math.max(50, layer1?.tempoBpm || 120)) : null;

  return {
    layer1_voice: {
      generate_type: layer1?.generateType || 'song',
      durationSeconds: duration,
      tempoEnabled: tempoEnabled,
      tempoBpm: tempoBpm,
      vocal_gender: layer1?.vocalGender || 'female',
      duet_config: layer1?.duetConfig || null,
      voice_character: sliceMax(layer1?.voiceCharacter, 8),
      mood: sliceMax(layer1?.mood, 8),
      microphone: formatBrand(layer1?.micBrand),
      lyrics_manual: layer1?.lyrics || '',
      referencePolicyAccepted: true
    },
    layer2_instrument: {
      genre: sliceMax(layer2?.genre, 8),
      amp: sliceMax(layer2?.amp, 4),
      cab: sliceMax(layer2?.cab, 4),
      electric_guitar: sliceMax(layer2?.electricGuitar, 4),
      acoustic_guitar: sliceMax(layer2?.acousticGuitar, 4),
      bass: formatBrand(layer2?.bassBrand),
      snare: formatBrand(layer2?.snareBrand),
      cymbals: formatBrand(layer2?.cymbalsBrand),
      guitar_fx: sliceMax(layer2?.guitarFx, 12),
      bass_fx: sliceMax(layer2?.bassFx, 10),
      world_instruments: sliceMax(layer2?.worldInstruments, 8),
      structure_melody: layer2?.structure || ['intro', 'chorus', 'outro'],
      outputProfile: layer2?.outputProfile || 'standard'
    },
    layer3_studio: {
      mixer: formatBrand(layer3?.mixerBrand),
      mastering: formatBrand(layer3?.masteringBrand)
    }
  };
}

export const examplePrompt = buildBixtonePrompt(
  {
    generateType: 'song',
    durationSeconds: 210,
    tempoEnabled: true,
    tempoBpm: 120,
    vocalGender: 'female',
    voiceCharacter: ['Warm Soprano style/inspire by smooth female vocal'],
    mood: ['Romantic style/inspire by love song'],
    micBrand: { name: 'Neumann U87', inspire_by: 'Classic German condenser' },
    lyrics: 'Wujudkan mimpimu'
  },
  {
    genre: ['Pop Rock style/inspire by Indonesian pop'],
    amp: [{ name: 'Marshall JCM800', inspire_by: 'British rock stack' }],
    electricGuitar: [{ name: 'Fender Stratocaster', inspire_by: 'American vintage' }],
    acousticGuitar: [{ name: 'Yamaha FG800', inspire_by: 'Bright acoustic' }]
  },
  {
    mixerBrand: { name: 'SSL G-Series', inspire_by: 'Analog console warmth' },
    masteringBrand: { name: 'Ozone 11', inspire_by: 'Modern loudness' }
  }
);

export function toGenerateRequest(prompt, seed = 0) {
  return {
    prompt: prompt,
    seed: seed,
    modelId: 'bixtone-v1',
    outputProfile: prompt.layer2_instrument.outputProfile,
    durationSeconds: prompt.layer1_voice.durationSeconds,
    referencePolicyAccepted: true
  };
}
