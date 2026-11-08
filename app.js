// =========================================================================
// BIXTONE ULTIMATE PRO - MASTER APP.JS (DISEMPURNAKAN)
// =========================================================================

function generateExactList(brands, count, prefix) {
  let result = [];
  for (let i = 0; i < count; i++) {
    let name = brands[i % brands.length];
    result.push(`${prefix} ${name} (Series Edition #${i + 1})`);
  }
  return result;
}

// Inisialisasi Kategori Sesuai Target Spesifikasi
const voices = generateExactList(["Melisma", "Falsetto", "Belting", "Vibrato", "Fry Vocal", "Screaming", "Growl", "Operatic", "Husky", "Cengkok Dangdut"], 50, "Style Reference:");
const moods = generateExactList(["Sad", "Happy", "Lonely", "Romantic", "Energetic", "Melancholic", "Aggressive", "Calm", "Epic", "Nostalgic"], 50, "Mood Profile:");
const vocalEffects = generateExactList(["Auto-Tune Pro", "Melodyne 5", "VoiceLive Touch", "Vocal Rider", "H3000 Harmonizer", "PCM96 Reverb", "UA 1176LN", "CL 1B Opto", "Neve 1073", "SSL Vocal Strip"], 30, "Inspired by");
const genres = generateExactList(["Dangdut Modern", "Campursari Modern", "Punk", "Ska", "Grunge", "Symphonic Metal", "Gothic Metal", "Dangdut Koplo", "Pop Jawa", "Synthwave"], 150, "Genre Style:");
const mics = generateExactList(["Neumann U87", "AKG C414", "Shure SM7B", "Sony C-800G", "Sennheiser MD421", "Royer R-121", "Telefunken U47", "Manley Ref", "Blue Bottle", "Rode NT1"], 30, "Inspired by");
const amps = generateExactList(["Marshall JCM800", "Mesa Boogie Dual Rec", "Fender Twin Reverb", "Vox AC30 Top Boost", "Orange Rockerverb", "EVH 5150III", "Bogner Ecstasy", "Soldano SLO-100", "Peavey 6505+", "Engl Powerball"], 100, "Style Reference:");
const cabs = generateExactList(["Marshall 1960A", "Mesa Boogie 4x12", "Fender 2x12 Open", "Orange PPC412", "EVH 5150III 4x12", "Bogner 212CB", "Engl Pro 4x12", "Diezel 4x12", "Vox V212C", "Custom Birch Cab"], 100, "Inspired by");
const guitarsElec = generateExactList(["Fender Stratocaster", "Gibson Les Paul", "Ibanez RG", "PRS Custom 24", "ESP Horizon", "Schecter Hellraiser", "Music Man Majesty", "Jackson Soloist", "Fender Telecaster", "Gibson SG"], 50, "Inspired by");
const guitarsAcou = generateExactList(["Martin D-28", "Taylor 814ce", "Gibson J-45", "Takamine Pro", "Guild D-55", "Yamaha LL36", "Ovation Legend", "Seagull S6", "Maton EBG", "Fender Paramount"], 50, "Style Reference:");
const basses = generateExactList(["Fender Precision", "Fender Jazz", "Music Man StingRay", "Gibson Thunderbird", "Rickenbacker 4003", "Spector NS-2", "Warwick Thumb", "Fodera Emperor", "Ibanez SR5000", "Yamaha TRBX"], 500, "Style Reference:");
const snares = generateExactList(["Ludwig Supraphonic", "Ludwig Black Beauty", "DW Collector's", "Tama Bell Brass", "Pearl Reference", "Sonor SQ2", "Yamaha Aluminum", "Gretsch Bronze", "Mapex Sledgehammer", "Canopus Zelkova"], 50, "Inspired by");
const cymbals = generateExactList(["Zildjian K Custom", "Sabian HHX", "Meinl Byzance", "Paiste 2002", "Istanbul Agop", "Bosphorus Master", "Turkish Classic", "Masterwork", "Soultone", "TRX Icon"], 30, "Style Reference:");
const mixers = generateExactList(["SSL 4000E", "Neve 88RS", "API 1608", "Studer A800", "Rupert Neve 5088", "Harrison 32C", "Trident 80B", "SSL 9000J", "EMI REDD.51", "Helios Type 69"], 30, "Style Reference:");
const masterings = generateExactList(["Abbey Road Chain", "iZotope Ozone", "TC System 6000", "Manley Massive Passive", "Weiss DS1", "Dangerous Mastering", "Shadow Hills", "Tube-Tech CL1B", "GML 8200", "SSL Bus Comp"], 30, "Inspired by");
const fxGuitars = generateExactList(["Ibanez TS9", "Klon Centaur", "BOSS DS-1", "Big Muff Pi", "Strymon Timeline", "Strymon BigSky", "MXR Phase 90", "Cry Baby Wah", "Whammy V", "Hall of Fame"], 200, "Inspired by");
const fxBasses = generateExactList(["Darkglass B7K", "SansAmp Bass Driver", "MXR M87", "Bass Big Muff", "BOSS GEB-7", "Aguilar Tone Hammer", "EBS Multicomp", "Source Audio C4", "Cali76 Bass", "Envelope Filter"], 100, "Style Reference:");
const worldInst = generateExactList(["Erhu", "Grand Piano", "Saxophone", "Cello", "Violin", "Harp", "Kendang", "Oud", "Kora", "Bandoneon", "Bagpipe", "Gamelan", "Angklung", "Sapeh", "Sitar"], 150, "World Instrument:");

function popSel(id, items) { 
  const el = document.getElementById(id);
  if(el) el.innerHTML = items.map(x => `<option value="${x}">${x}</option>`).join(''); 
}

function popChips(id, items, max) { 
  const el = document.getElementById(id);
  if(el) el.innerHTML = items.map(x => `<div class="chip" onclick="toggleChip(this, ${max})">${x}</div>`).join(''); 
}

function toggleChip(el, max) {
  if (!el.classList.contains('selected') && el.parentElement.querySelectorAll('.chip.selected').length >= max) {
    alert(`Maksimal pilihan kategori ini adalah ${max}`); 
    return;
  }
  el.classList.toggle('selected'); 
  updatePromptPreview();
}

function setMode(mode) {
  document.body.className = mode === 'lite' ? 'mode-lite' : '';
  document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
  if(event && event.target) event.target.classList.add('active');
}

function toggleBPM(chk) { 
  const bpmInput = document.getElementById('bpm-input');
  if(bpmInput) bpmInput.disabled = !chk.checked; 
}

function updatePromptPreview() {
  const l1El = document.getElementById('prompt-layer-1');
  const l2El = document.getElementById('prompt-layer-2');
  const l3El = document.getElementById('prompt-layer-3');

  if(l1El) l1El.innerText = `Vocal: ${document.getElementById('vocal-type')?.value} | FX: ${document.getElementById('vocal-effect')?.value}`;
  if(l2El) l2El.innerText = `Mic: ${document.getElementById('mic-select')?.value} | Snare: ${document.getElementById('snare-select')?.value}`;
  if(l3El) l3El.innerText = `Mixer: ${document.getElementById('mixer-select')?.value} | Mastering: ${document.getElementById('mastering-select')?.value}`;
}

function togglePlay() { alert("▶ BIXTONE Audio Player: Memutar simulasi hasil generate lagu."); }
function generateMusic() { alert("⚡ Memproses Arsitektur 3-Layer Prompt BIXTONE ULTIMATE PRO..."); }
function applyPerfection() { alert("✨ Perfection Engine aktif."); }
function processStem(t) { alert(`✂ Stem Processing: ${t}`); }
function recordOverdub(t) { alert(`🎙 Recording Overdub: ${t}`); }
function downloadAudio() { alert("💾 Mengunduh file master audio..."); }
function sharePlatform() {
  if (navigator.share) { 
    navigator.share({ title: 'BIXTONE', text: 'Cek lagu AI saya!', url: location.href }); 
  } else { 
    navigator.clipboard.writeText(location.href); 
    alert("🌐 Link berhasil disalin!"); 
  }
}

window.onload = function() {
  popChips('genre-chips', genres, 8);
  popChips('mood-chips', moods, 8);
  popChips('voice-chips', voices, 8);
  popChips('fx-guitar-chips', fxGuitars, 12);
  popChips('fx-bass-chips', fxBasses, 10);
  popChips('world-inst-chips', worldInst, 8);

  popSel('vocal-effect', vocalEffects);
  popSel('mic-select', mics);
  popSel('snare-select', snares);
  popSel('cymbal-select', cymbals);
  popSel('bass-select', basses);
  popSel('amp-select', amps);
  popSel('cab-select', cabs);
  popSel('guitar-elec-select', guitarsElec);
  popSel('guitar-acou-select', guitarsAcou);
  popSel('mixer-select', mixers);
  popSel('mastering-select', masterings);
  updatePromptPreview();
};
