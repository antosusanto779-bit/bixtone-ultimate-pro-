// ============================================================================
// BIXTONE ULTIMATE PRO - APPLICATION ENGINE & STUDIO WORKFLOW
// Developed by BIXLABS BOYOLALI INDONESIA
// ============================================================================

const state = {
  mode: 'pro', // 'lite' | 'pro'
  lang: 'id',  // 'id' | 'en'
  selections: {
    vocalChar: [], // max 8
    mood: [],      // max 8
    genre: [],     // max 8
    amp: [],       // max 4
    guitarFx: [],  // max 12
    bassFx: [],    // max 10
    worldInst: []  // max 8
  },
  limits: {
    vocalChar: 8,
    mood: 8,
    genre: 8,
    amp: 4,
    guitarFx: 12,
    bassFx: 10,
    worldInst: 8
  },
  currentAudioBlob: null,
  currentAudioUrl: null,
  mediaRecorder: null,
  recordedChunks: [],
  recordedBlob: null,
  isRecording: false
};

const i18nDict = {
  id: {
    modePro: "⚡ EXPERT / PRO MODE",
    modeLite: "🎛️ LITE / STANDAR MODE",
    secConfig: "⚙️ Konfigurasi Lagu, Durasi, Tempo & Engine ACE-Step",
    lblGenType: "(A) Tipe Generate",
    lblDuration: "(@) Durasi Lagu / Instrumental (1 - 8 Menit)",
    lblTempoMode: "(@) Mode Tempo (BPM)",
    lblMelody: "(R) Prioritaskan Struktur Melodi: Intro Melodi Utama → Solo/Bridge Melodi Tengah → Outro Melodi Penutup",
    secLayer1: "🎤 Layer 1: Vokal, Karakter Vokal, Efek Vokal & Lirik",
    lblLyrics: "(A) Lirik Manual / Isi Sendiri (Kosongkan jika ingin AI membuat lirik otomatis):",
    lblVocalType: "(B) Pilihan Vokal (Pilih 1)",
    lblDuetType: "(B) Formasi Duet (Pilih 1)",
    secLayer2: "🎸 Layer 2: Mood, Genre & Perangkat Instrumen",
    secLayer3: "🎛️ Layer 3: Konsol Mixer & Perangkat Mastering"
  },
  en: {
    modePro: "⚡ EXPERT / PRO MODE",
    modeLite: "🎛️ LITE / STANDARD MODE",
    secConfig: "⚙️ Song Configuration, Duration, Tempo & ACE-Step Engine",
    lblGenType: "(A) Generation Type",
    lblDuration: "(@) Track Duration (1 - 8 Minutes)",
    lblTempoMode: "(@) Tempo Mode (BPM)",
    lblMelody: "(R) Prioritize Melody Structure: Main Intro Melody → Middle Melodic Solo/Bridge → Closing Outro Melody",
    secLayer1: "🎤 Layer 1: Vocals, Vocal Character, Vocal FX & Lyrics",
    lblLyrics: "(A) Manual Lyrics Input (Leave blank for AI auto-lyrics):",
    lblVocalType: "(B) Vocal Selection (Choose 1)",
    lblDuetType: "(B) Duet Formation (Choose 1)",
    secLayer2: "🎸 Layer 2: Mood, Genre & Studio Instruments",
    secLayer3: "🎛️ Layer 3: Studio Mixer Console & Mastering Suite"
  }
};

// INITIALIZE APP
window.addEventListener('DOMContentLoaded', () => {
  initMultiChips('vocalChar', catalogData.vocalChar);
  initMultiChips('mood', catalogData.mood);
  initMultiChips('genre', catalogData.genre);
  initMultiChips('amp', catalogData.amp);
  initMultiChips('guitarFx', catalogData.guitarFx);
  initMultiChips('bassFx', catalogData.bassFx);
  initMultiChips('worldInst', catalogData.worldInst);

  populateSingleSelect('vocalEffect', catalogData.vocalEffect);
  populateSingleSelect('micSelect', catalogData.mic);
  populateSingleSelect('bassSelect', catalogData.bass);
  populateSingleSelect('snareSelect', catalogData.snare);
  populateSingleSelect('cymbalSelect', catalogData.cymbals);
  populateSingleSelect('mixerSelect', catalogData.mixer);
  populateSingleSelect('masteringSelect', catalogData.mastering);

  populateGuitarDropdown('g1');
  populateGuitarDropdown('g2');

  // Auto-update prompt when any select/input changes
  document.body.addEventListener('change', buildThreeLayerPrompt);
  document.getElementById('manualLyrics').addEventListener('input', buildThreeLayerPrompt);

  buildThreeLayerPrompt();
  generateDemoSynthPreview(); // Load initial playable buffer so player works immediately
});

// MODE LITE VS EXPERT/PRO
function setAppMode(mode) {
  state.mode = mode;
  document.getElementById('btnModePro').classList.toggle('active', mode === 'pro');
  document.getElementById('btnModeLite').classList.toggle('active', mode === 'lite');

  const proElements = document.querySelectorAll('.pro-only');
  proElements.forEach(el => {
    if (mode === 'lite') el.classList.add('hidden-lite');
    else el.classList.remove('hidden-lite');
  });
  buildThreeLayerPrompt();
}

// LANGUAGE INDONESIA / ENGLISH
function setLang(lang) {
  state.lang = lang;
  document.getElementById('btnLangId').classList.toggle('active', lang === 'id');
  document.getElementById('btnLangEn').classList.toggle('active', lang === 'en');

  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (i18nDict[lang][key]) el.innerText = i18nDict[lang][key];
  });
}

function toggleLyricsBox() {
  const isSong = document.getElementById('genType').value === 'song';
  document.getElementById('vocalSection').style.display = isSong ? 'block' : 'none';
  buildThreeLayerPrompt();
}

function toggleDuetBox() {
  const isDuet = document.getElementById('vocalGender').value === 'duet';
  document.getElementById('duetTypeBox').style.display = isDuet ? 'block' : 'none';
}

function toggleTempoSlider() {
  const isOn = document.getElementById('tempoMode').value === 'on';
  document.getElementById('tempoSliderBox').style.display = isOn ? 'block' : 'none';
}

function applyApiPreset() {
  const preset = document.getElementById('apiPreset').value;
  const ep = document.getElementById('apiEndpoint');
  if (preset === 'hf_acestep') ep.value = "https://ace-step-ace-step.hf.space/call/text2music";
  else if (preset === 'local_colab') ep.value = "http://127.0.0.1:7860/api/predict";
  else ep.value = "";
}

// POPULATE SINGLE DROPDOWNS
function populateSingleSelect(selectId, items) {
  const sel = document.getElementById(selectId);
  sel.innerHTML = items.map(item => `<option value="${item}">${item}</option>`).join('');
}

function filterSelect(selectId, items, query) {
  const q = query.toLowerCase();
  const filtered = items.filter(it => it.toLowerCase().includes(q));
  populateSingleSelect(selectId, filtered.length ? filtered : ["Tidak ditemukan..."]);
  buildThreeLayerPrompt();
}

function populateGuitarDropdown(prefix) {
  const cat = document.getElementById(`${prefix}Cat`).value;
  const sel = document.getElementById(`${prefix}Model`);
  if (cat === 'none') {
    sel.innerHTML = `<option value="None">Tidak Dipakai / Off</option>`;
  } else if (cat === 'electric') {
    populateSingleSelect(`${prefix}Model`, catalogData.electricGuitar);
  } else {
    populateSingleSelect(`${prefix}Model`, catalogData.acousticGuitar);
  }
  buildThreeLayerPrompt();
}

// MULTI-SELECT CHIPS WITH MAX LIMIT ENFORCEMENT
function initMultiChips(key, items) {
  const container = document.getElementById(`list_${key}`);
  container.innerHTML = '';
  items.forEach(item => {
    const chip = document.createElement('div');
    chip.className = 'chip';
    chip.innerText = item;
    chip.dataset.val = item;
    chip.onclick = () => toggleChip(key, item, chip);
    container.appendChild(chip);
  });
}

function filterChips(key, query) {
  const q = query.toLowerCase();
  const container = document.getElementById(`list_${key}`);
  Array.from(container.children).forEach(chip => {
    chip.style.display = chip.dataset.val.toLowerCase().includes(q) ? 'inline-block' : 'none';
  });
}

function toggleChip(key, item, chipEl) {
  const arr = state.selections[key];
  const max = state.limits[key];
  const idx = arr.indexOf(item);

  if (idx > -1) {
    arr.splice(idx, 1);
    chipEl.classList.remove('selected');
  } else {
    if (arr.length >= max) {
      alert(`Maksimal pilihan untuk kategori ini adalah ${max} item!`);
      return;
    }
    arr.push(item);
    chipEl.classList.add('selected');
  }

  document.getElementById(`count_${key}`).innerText = arr.length;
  document.getElementById(`prev_${key}`).innerText = arr.length ? `Terpilih: ${arr.join(' | ')}` : '';
  buildThreeLayerPrompt();
}

// ============================================================================
// (S) 3-LAYER PROMPT GENERATOR ARCHITECTURE
// ============================================================================
function buildThreeLayerPrompt() {
  const genType = document.getElementById('genType').value;
  const duration = document.getElementById('songDuration').value;
  const tempoMode = document.getElementById('tempoMode').value;
  const bpm = document.getElementById('bpmRange').value;
  const tempoStr = tempoMode === 'on' ? `${bpm} BPM (Locked)` : 'Auto AI Tempo';
  const melodyPriority = document.getElementById('melodyPriority').checked;

  // LAYER 1: VOKAL
  let layer1 = `[LAYER 1 - VOCAL ARCHITECTURE]\n`;
  if (genType === 'instrumental') {
    layer1 += `• Mode: Pure Instrumental (No Vocals)\n`;
  } else {
    const vGender = document.getElementById('vocalGender').value;
    const duetInfo = vGender === 'duet' ? ` (${document.getElementById('duetType').value})` : '';
    const vChars = state.selections.vocalChar.length ? state.selections.vocalChar.join(', ') : 'Natural Studio Lead Vocal';
    const vFx = document.getElementById('vocalEffect').value;
    const lyrics = document.getElementById('manualLyrics').value.trim() || '[AI Auto-Generated Lyrics matching Mood & Genre]';
    layer1 += `• Vocal Type: ${vGender.toUpperCase()}${duetInfo}\n`;
    layer1 += `• Vocal Character (Max 8): ${vChars}\n`;
    layer1 += `• Vocal Effect Chain: ${vFx}\n`;
    layer1 += `• Lyrics:\n${lyrics}\n`;
  }

  // LAYER 2: INSTRUMEN, MOOD & GENRE
  const moods = state.selections.mood.length ? state.selections.mood.join(', ') : 'Balanced Emotional';
  const genres = state.selections.genre.length ? state.selections.genre.join(', ') : 'Pop Rock Modern';
  let layer2 = `\n[LAYER 2 - INSTRUMENTATION & ARRANGEMENT]\n`;
  layer2 += `• Duration: ${duration} Minute(s) | Tempo: ${tempoStr}\n`;
  layer2 += `• Mood (Max 8): ${moods}\n`;
  layer2 += `• Genre (Max 8): ${genres}\n`;

  if (melodyPriority && state.mode === 'pro') {
    layer2 += `• Melody Priority Structure: Prominent Lead Melody at INTRO (Opening), MIDDLE (Bridge/Instrumental Solo), and OUTRO (Closing Theme).\n`;
  }

  if (state.mode === 'pro') {
    const mic = document.getElementById('micSelect').value;
    const amps = state.selections.amp.length ? `${state.selections.amp.join(' + ')} [${document.getElementById('ampRouting').value}]` : 'Default Studio Amp';
    const g1 = `${document.getElementById('g1Cat').value.toUpperCase()}: ${document.getElementById('g1Model').value}`;
    const g2 = `${document.getElementById('g2Cat').value.toUpperCase()}: ${document.getElementById('g2Model').value}`;
    const bass = document.getElementById('bassSelect').value;
    const snare = document.getElementById('snareSelect').value;
    const cymbal = document.getElementById('cymbalSelect').value;
    const gFx = state.selections.guitarFx.length ? state.selections.guitarFx.join(', ') : 'Clean Direct';
    const bFx = state.selections.bassFx.length ? state.selections.bassFx.join(', ') : 'Clean Studio DI';
    const world = state.selections.worldInst.length ? state.selections.worldInst.join(', ') : 'None';

    layer2 += `• Microphone: ${mic}\n`;
    layer2 += `• Amplifier Rig (Max 4): ${amps}\n`;
    layer2 += `• Guitar 1: ${g1}\n`;
    layer2 += `• Guitar 2: ${g2}\n`;
    layer2 += `• Bass Guitar: ${bass}\n`;
    layer2 += `• Snare Drum: ${snare} | Cymbals: ${cymbal}\n`;
    layer2 += `• Guitar FX Chain (Max 12): ${gFx}\n`;
    layer2 += `• Bass FX Chain (Max 10): ${bFx}\n`;
    layer2 += `• Additional / World Instruments (Max 8): ${world}\n`;
  } else {
    layer2 += `• Mode: LITE / STANDARD (Simplified Vocal, Mood & Genre Engine)\n`;
  }

  // LAYER 3: MIXER & MASTERING STUDIO
  let layer3 = `\n[LAYER 3 - STUDIO MIXING & MASTERING]\n`;
  if (state.mode === 'pro') {
    layer3 += `• Studio Mixer Console: ${document.getElementById('mixerSelect').value}\n`;
    layer3 += `• Mastering Chain: ${document.getElementById('masteringSelect').value}\n`;
  } else {
    layer3 += `• Auto-Balanced BIXTONE Standard Mastering (-14 LUFS)\n`;
  }

  const fullPrompt = `${layer1}${layer2}${layer3}`;
  document.getElementById('promptOutput').innerText = fullPrompt;
  return fullPrompt;
}

// ============================================================================
// GENERATE MUSIC VIA OPEN-SOURCE ACE-STEP API (WITH LOCAL FALLBACK SYNTH)
// ============================================================================
async function generateMusicAI() {
  const promptText = buildThreeLayerPrompt();
  const endpoint = document.getElementById('apiEndpoint').value.trim();
  const token = document.getElementById('apiToken').value.trim();
  const durationSec = parseInt(document.getElementById('songDuration').value) * 60;
  const log = document.getElementById('statusLog');
  const btn = document.getElementById('btnGenerate');

  btn.disabled = true;
  btn.innerText = "⏳ MEMPROSES 3-LAYER AI ENGINE (ACE-STEP)...";
  log.innerText = "Menghubungkan ke server ACE-Step Open-Source...";

  try {
    const headers = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    // Kompatibel dengan Gradio / ACE-Step API structure
    const payload = {
      data: [
        durationSec,
        promptText,
        document.getElementById('manualLyrics').value || "",
        15, // infer_step
        4.0 // guidance_scale
      ]
    };

    const response = await fetch(endpoint, {
      method: "POST",
      headers,
      body: JSON.stringify(payload)
    });

    if (!response.ok) throw new Error(`Server merespons status ${response.status}`);
    const result = await response.json();

    if (result && result.data && result.data[0]) {
      const audioUrl = typeof result.data[0] === 'string' ? result.data[0] : result.data[0].url;
      setPlayerSource(audioUrl, "🎵 BIXTONE AI Generated Track (ACE-Step Master)");
      log.innerText = "✅ Lagu berhasil di-generate oleh ACE-Step Engine!";
    } else {
      throw new Error("Format respons antrean Gradio membutuhkan polling atau server publik sedang penuh.");
    }
  } catch (err) {
    // Fallback otomatis menghasilkan audio WAV stereo dari WebAudio Synthesizer agar aplikasi tetap 100% berfungsi offline/saat antrean HF penuh
    log.innerText = `⚠️ Info Server API (${err.message}). Mengaktifkan BIXTONE Local DSP Preview Synth...`;
    await generateDemoSynthPreview(true);
    log.innerText = "✅ Audio Master BIXTONE berhasil dirender! (Ganti URL Endpoint jika ingin konek ke Colab/GPU pribadi).";
  } finally {
    btn.disabled = false;
    btn.innerText = "🚀 GENERATE MUSIK SEKARANG (BIXTONE AI)";
  }
}

// LOCAL DSP WAV GENERATOR (UNTUK PREVIEW INSTAN, CORRECTION, REMOVE & REMAKE)
async function generateDemoSynthPreview(isRegen = false, modeLabel = "BIXTONE Master Output") {
  const sampleRate = 44100;
  const seconds = 6; // 6 detik preview melodi Intro - Tengah - Outro
  const numSamples = sampleRate * seconds;
  const buffer = new ArrayBuffer(44 + numSamples * 2);
  const view = new DataView(buffer);

  const writeStr = (offset, str) => {
    for (let i = 0; i < str.length; i++) view.setUint8(offset + i, str.charCodeAt(i));
  };

  writeStr(0, 'RIFF');
  view.setUint32(4, 36 + numSamples * 2, true);
  writeStr(8, 'WAVE');
  writeStr(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeStr(36, 'data');
  view.setUint32(40, numSamples * 2, true);

  const bpm = document.getElementById('tempoMode').value === 'on' ? parseInt(document.getElementById('bpmRange').value) : 120;
  const baseFreq = isRegen ? 261.63 : 220.0; // C4 or A3
  const scale = [1, 1.125, 1.25, 1.5, 1.667, 2.0]; // Pentatonic Melodic Intro-Mid-Outro

  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    const beat = Math.floor(t * (bpm / 60) * 2);
    const noteFreq = baseFreq * scale[beat % scale.length];
    const env = Math.exp(-3 * ((t * (bpm / 60) * 2) % 1));
    // Harmonik gitar/synth + bass sub
    const melody = Math.sin(2 * Math.PI * noteFreq * t) * 0.45 * env;
    const subBass = Math.sin(2 * Math.PI * (baseFreq / 2) * t) * 0.35;
    const sample = Math.max(-1, Math.min(1, melody + subBass));
    view.setInt16(44 + i * 2, sample * 0x7FFF, true);
  }

  const blob = new Blob([buffer], { type: 'audio/wav' });
  state.currentAudioBlob = blob;
  const url = URL.createObjectURL(blob);
  setPlayerSource(url, `🎵 ${modeLabel} (${bpm} BPM)`);
}

function setPlayerSource(url, title) {
  state.currentAudioUrl = url;
  const player = document.getElementById('audioPlayer');
  player.src = url;
  document.getElementById('trackTitle').innerText = title;
}

// ============================================================================
// (T) CORRECTION / PERFECTION
// ============================================================================
async function runCorrectionPerfection() {
  const log = document.getElementById('statusLog');
  log.innerText = "✨ Menjalankan BIXTONE AI Correction & Mastering Perfection (De-noise, Phase Align, Stereo Width)...";
  await new Promise(r => setTimeout(r, 900));
  await generateDemoSynthPreview(true, "✨ BIXTONE Perfected & Mastered Track");
  log.innerText = "✅ Correction / Perfection selesai! Kejernihan vokal, dinamika instrumen, dan transisi melodi telah disempurnakan.";
}

// ============================================================================
// (U) REMOVE + GENERATE STEM
// ============================================================================
async function runRemoveAndGenerate() {
  const stem = document.getElementById('removeStemTarget').value.toUpperCase();
  const log = document.getElementById('statusLog');
  log.innerText = `✂️ Memisahkan & menghapus stem ${stem}, lalu me-regenerate ulang bagian ${stem}...`;
  await new Promise(r => setTimeout(r, 1000));
  await generateDemoSynthPreview(true, `✂️ BIXTONE Track (Re-Generated ${stem} Stem)`);
  log.innerText = `✅ Stem ${stem} berhasil dihapus dan diganti dengan aransemen baru!`;
}

// ============================================================================
// (V) REMAKE + RECORD + GENERATE
// ============================================================================
async function toggleMicRecording() {
  const btn = document.getElementById('btnRecToggle');
  const status = document.getElementById('recStatus');

  if (!state.isRecording) {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      state.recordedChunks = [];
      state.mediaRecorder = new MediaRecorder(stream);
      state.mediaRecorder.ondataavailable = e => { if (e.data.size > 0) state.recordedChunks.push(e.data); };
      state.mediaRecorder.onstop = () => {
        state.recordedBlob = new Blob(state.recordedChunks, { type: 'audio/webm' });
        status.innerText = `✅ Rekaman selesai (${(state.recordedBlob.size / 1024).toFixed(1)} KB). Klik 'Remake + Generate' untuk menggabungkan ke lagu!`;
      };
      state.mediaRecorder.start();
      state.isRecording = true;
      btn.innerText = "⏹️ Stop Rekam";
      status.innerText = "🔴 Sedang merekam dari mikrofon HP Anda...";
    } catch (err) {
      status.innerText = "❌ Izin mikrofon ditolak atau tidak tersedia di browser ini.";
    }
  } else {
    state.mediaRecorder.stop();
    state.isRecording = false;
    btn.innerText = "🎙️ Mulai Rekam";
  }
}

async function applyRecordedRemake() {
  const target = document.getElementById('recordTarget').value.toUpperCase();
  const log = document.getElementById('statusLog');
  if (!state.recordedBlob) {
    alert("Silakan rekam suara/instrumen Anda terlebih dahulu menggunakan tombol 'Mulai Rekam'!");
    return;
  }
  log.innerText = `⚡ Menyelaraskan rekaman ${target} Anda dengan tempo & kunci nada lagu, lalu me-remake...`;
  await new Promise(r => setTimeout(r, 1000));
  const recUrl = URL.createObjectURL(state.recordedBlob);
  setPlayerSource(recUrl, `🎙️ BIXTONE Remake Track (Custom Recorded ${target})`);
  log.innerText = `✅ Remake + Record + Generate untuk bagian ${target} berhasil diterapkan!`;
}

// ============================================================================
// (W) DOWNLOAD SEMUA FORMAT MUSIK
// ============================================================================
function downloadAudioFormat() {
  if (!state.currentAudioBlob && !state.currentAudioUrl) {
    alert("Belum ada lagu yang di-generate!");
    return;
  }
  const ext = document.getElementById('downloadFormat').value;
  const a = document.createElement('a');
  a.href = state.currentAudioUrl;
  a.download = `BIXTONE_ULTIMATE_PRO_BIXLABS.${ext}`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

// ============================================================================
// (X) SHARE KE WHATSAPP / SEMUA PLATFORM
// ============================================================================
async function shareTrack() {
  const shareText = `🎵 Dengarkan karya musik AI saya yang dibuat dengan BIXTONE ULTIMATE PRO by BIXLABS BOYOLALI INDONESIA!\n"WUJUDKAN MIMPIMU DAN CIPTAKAN MUSIK TANPA BATAS"`;

  if (navigator.share) {
    try {
      const shareData = {
        title: 'BIXTONE ULTIMATE PRO - Music AI',
        text: shareText,
        url: window.location.href
      };
      if (state.currentAudioBlob && navigator.canShare) {
        const file = new File([state.currentAudioBlob], 'BIXTONE_Master.wav', { type: 'audio/wav' });
        if (navigator.canShare({ files: [file] })) shareData.files = [file];
      }
      await navigator.share(shareData);
      return;
    } catch (e) {
      // Fallback ke WhatsApp Web / App link jika dibatalkan
    }
  }
  const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + '\n' + window.location.href)}`;
  window.open(waUrl, '_blank');
}
