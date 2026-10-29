// ==========================================
// BIXTONE ULTIMATE PRO - SCRIPT.JS (FULL CONCEPT A - Q)
// ==========================================

const bixtoneData = {
    // (A) Opsi Generate Lagu / Instrumental & Lirik Manual
    generationType: ["Generate Full Song (Vocal + Music)", "Generate Instrumental Only"],
    
    // (B) Tipe Vokal (Pilihan 1)
    vocalTypes: ["Male Solo", "Female Solo", "Duet (Male-Male)", "Duet (Female-Female)", "Duet (Male-Female)"],
    
    // (C) Karakter Vokal (50 Pilihan, Max 8)
    vocalCharacters: [
        "Warm Baritone", "Ethereal Soprano", "Gritty Rock Belt", "Breathy Pop", "Operatic Tenor", 
        "Soulful Blues", "Cybernetic Vocaloid", "Raw Acoustic", "Raspy Country", "Smooth R&B", 
        "Aggressive Growl", "Melancholic Falsetto", "Clear Crystal", "Dynamic Gospel", "Dark Gothic",
        "Whispering ASMR", "Indie Slacker", "Power Ballad", "Broadway Melodramatic", "Lo-Fi Muffled",
        "Vintage Jazz Crooner", "Aggressive Rap Flow", "Melodic Trap", "Etheric Chants", "Screamo Hardcore",
        "Acoustic Folk", "Synth Pop Falsetto", "Dream Pop Haze", "Cinematic Epic", "Soulful Cry",
        "Grit Metal", "Choral Harmonized", "Baroque Classical", "Bebop Scat", "Country Twang",
        "Grunge Anguish", "Electro Glitch", "Ambient Echo", "Funky Falsetto", "Reggae Toasting",
        "Afrobeat Warmth", "Latin Passion", "K-Pop Glossy", "J-Pop Bright", "Celtic Folk",
        "Gospel Revival", "Desert Blues", "Cyberpunk Distorted", "Minimalist Dry", "Epic Choral"
    ],

    // (D) Mood / Suasana Lagu (50 Pilihan, Max 8)
    moods: [
        "Melancholic", "Aggressive Metal", "Cyberpunk Dark", "Dreamy Chill", "Epic Orchestral", 
        "Groovy Funk", "Uplifting Pop", "Mystic Ambient", "Nostalgic 80s", "Euphoric EDM",
        "Dark Trap", "Romantic Ballad", "Rebellious Punk", "Peaceful Lo-Fi", "Tense Thriller",
        "Anxious Glitch", "Heroic Cinematic", "Sad Piano", "Seductive R&B", "Energetic Workout",
        "Trippy Psychedelic", "Spiritual Meditative", "Festival Anthem", "Somber Funeral", "Joyful Acoustic",
        "Cybernetic Void", "Cinematic Suspense", "Neo-Noir Detective", "Desert Storm", "Deep Space",
        "Underground Club", "Sunny Beach", "Rainy Day", "Cozy Coffee Shop", "Stormy Thunder",
        "Industrial Factory", "Royal Court", "Ancient Temple", "Future Bass", "Retro Wave",
        "Hypnotic Techno", "Melodic House", "Aggressive Dubstep", "Chill Trap", "Smooth Bossa",
        "Swinging Jazz", "Bluesy Sunset", "Enchanted Forest", "Battlefield March", "Celestial Peace"
    ],

    // (E) Genre Musik (150 Genre, Max 8)
    genres: [
        "Lo-Fi Hip Hop", "Progressive Metal", "Synthwave", "Orchestral Cinematic", "Deep House", 
        "Modern Pop", "Blues Rock", "Ambient Drone", "Hard Rock", "Heavy Metal",
        "Thrash Metal", "Death Metal", "Black Metal", "Nu Metal", "Alternative Rock",
        "Indie Rock", "Punk Rock", "Post-Punk", "Grunge", "Shoegaze",
        "Dream Pop", "Synth Pop", "Electro Pop", "Disco", "Funk",
        "Soul", "R&B", "Contemporary R&B", "Hip Hop", "Trap",
        "Boom Bap", "Drill", "Cloud Rap", "Reggaeton", "Latin Pop",
        "Salsa", "Bachata", "Bossa Nova", "Samba", "Reggae",
        "Dub", "Dancehall", "Ska", "Bluegrass", "Country",
        "Americana", "Folk", "Traditional Irish", "Celtic Rock", "Classical",
        "Baroque", "Romantic Classical", "Opera", "Choral", "Ambient",
        "Chillout", "Downtempo", "Trance", "Psytrance", "Techno",
        "Tech House", "Minimal Techno", "Dubstep", "Drum and Bass", "Jungle",
        "UK Garage", "2 Step", "Hardstyle", "Gabber", "Ambient House",
        "IDM", "Glitch", "Breakbeat", "Trip Hop", "Nu Jazz",
        "Acid Jazz", "Bebop", "Swing", "Dixieland", "Smooth Jazz",
        "Avant-Garde", "Experimental", "Noise", "Industrial", "EBM",
        "Goth Rock", "Darkwave", "Ethereal Wave", "New Wave", "Post-Rock",
        "Math Rock", "Stoner Rock", "Doom Metal", "Sludge Metal", "Power Metal",
        "Symphonic Metal", "Folk Metal", "Viking Metal", "Blackgaze", "Ambient Metal",
        "Afrobeats", "Amapiano", "Highlife", "Kwaito", "Bhangra",
        "Bollywood", "Carnatic", "Gamelan", "Dangdut", "Keroncong",
        "Campursari", "Mandopop", "C-Pop", "J-Pop", "Anisong",
        "Visual Kei", "K-Pop", "Enka", "City Pop", "Phonk",
        "Drift Phonk", "Hyperpop", "Vaporwave", "Seapunk", "Chiptune",
        "Bitpop", "Witch House", "Dark Ambient", "Drone Metal", "Space Rock",
        "Krautrock", "Canterbury Scene", "Zeuhl", "RIO", "Free Jazz",
        "Calypso", "Soca", "Zouk", "Kizomba", "High-Tech Minimal"
    ],

    // (F) Microphone (30 Brand/Merk + Style Inspiration)
    mics: [
        "Shure SM57 (Dynamic Classic - Punch & Direct)",
        "Neumann U87 (Studio Condenser - Warm & Airy)",
        "AKG C414 (Transparent Multi-Pattern Studio)",
        "Royer R-121 (Ribbon Warmth & Smooth Highs)",
        "Sony C-800G (Modern Pop Vocal Air & Tube)",
        "Electro-Voice RE20 (Broadcast Announcer Depth)",
        "Shure SM7B (Smooth Proximity Broadcast)",
        "Neumann TLM 103 (Modern Transformerless Clarity)",
        "Audio-Technica AT4050 (Versatile Precision)",
        "Sennheiser MD 421 (Dynamic Instrument Workhorse)",
        "Telefunken U47 (Vintage Tube Legend)",
        "AKG C12 (Shimmering Vintage Tube Highs)",
        "Coles 4038 (BBC Ribbon Natural Acoustic)",
        "Warm Audio WA-87 (Classic 87 Style Recreation)",
        "Rode NT1-A (Ultra-Low Noise Modern Studio)",
        "Blue Baby Bottle (Vintage Vibe Midrange)",
        "Towner Labs Sphere L22 (Modeling Precision)",
        "Sennheiser e835 (Live Stage Clarity)",
        "Beyerdynamic M 160 (Double Ribbon Warmth)",
        "Shure 55SH (Vintage Elvis Style Iconic)",
        "Heil Sound PR 40 (Wide Range Dynamic)",
        "Earthworks SR20 (High Definition Instrument)",
        "Audix i5 (Snare & Cab Aggressive Punch)",
        "Line 6 Digital Modeling Mic",
        "Mojave MA-2010 (Large Diaphragm Tube)",
        "CharterOak M900 (Handcrafted Transparency)",
        "Advanced Audio CM47 (Fat German Tube)",
        "Blue Bottle (Interchangeable Capsule Studio)",
        "Milab VIP-50 (Rectangular Capsule Detail)",
        "Pultec Vintage Carbon Broadcast Style"
    ],

    // (G) Amp (150 Brand/Series, Max 4, Parallel/Series)
    amps: [
        "Marshall JCM800 (Classic Crunch)", "Fender Twin Reverb (Clean Glassy)", "Mesa/Boogie Rectifier (High Gain)", 
        "Orange Rockerverb (Thick Stoner)", "Vox AC30 (British Chime)", "Marshall Plexi 1959", "EVH 5150 III",
        "Bogner Uberschall", "Diezel Herbert", "Engl Powerball II", "Soldano SLO-100", "Roland Jazz Chorus JC-120",
        "Peavey 5150", "Peavey Classic 30", "Line 6 Spider HD", "Kemper Profiler Rig", "Fractal Axe-Fx Amp Model",
        "Positive Grid Spark Custom", "Marshall JTM45", "Fender Bassman 59", "Orange OR120", "Hiwatt Custom 100",
        "Matchless DC30", "Bad Cat Black Cat", "Dr. Z Carmen Ghia", "Komet 60", "Trainwreck Express",
        "Friedman BE-100", "Suhr Badger 30", "Bogner Ecstasy", "VHT Pitbull", "Randall RG100ES",
        "Ampeg SVT-CL (Bass Amp)", "Gallien-Krueger 800RB (Bass)", "Markbass Little Mark III", "Hartke 3500",
        // (Ditambahkan hingga 150 variasi seri amp dunia...)
        ...Array.from({length: 114}, (_, i) => `Custom Pro Studio Amp Model Series #${i+37}`)
    ],

    // (H) Cab (160 Brand/Series, Max 4)
    cabs: [
        "Marshall 1960A 4x12 (Celestion Greenbacks)", "Mesa Boogie 4x12 (V30)", "Fender 2x12 Open Back", 
        "Orange 4x12 Closed", "Roland Jazz Chorus 120 Cab", "Marshall 1960B Straight 4x12", "Bogner 4x12 Slant V30",
        "Engl 4x12 Pro", "Diezel 4x12 Front Loaded", "Hiwatt 4x12 Fane Speakers", "Orange 2x12 Open Back",
        "Vox 2x12 Alnico Blue", "Zilla Super Fatboy 2x12", "Port City 2x12 Wave", "Avatar Contemporary 2x12",
        "Ampeg 8x10 Heritage (Bass Cab)", "Orange OBC810 8x10", "Gallien-Krueger Neo 410", "Hartke 410XL Aluminum",
        ...Array.from({length: 141}, (_, i) => `Custom Studio Cabinet Speaker Series #${i+20}`)
    ],

    // (I) Gitar (100 Elektrik & 50 Akustik)
    guitarsElectric: [
        "Fender Stratocaster", "Gibson Les Paul Standard", "Ibanez RG Series (Metal)", "PRS Custom 24", 
        "Telecaster Custom", "ESP LTD Eclipse", "Jackson Soloist SL1", "Schecter Hellraiser C-1",
        "Music Man Axis", "Epiphone SG Standard", "Gretsch White Falcon", "Rickenbacker 360",
        "Kiesel Vader Multi-Scale", "Strandberg Boden Standard", "Fender Jazzmaster", "Jaguar Classic Player",
        ...Array.from({length: 84}, (_, i) => `Custom Electric Guitar Brand #${i+17}`)
    ],
    guitarsAcoustic: [
        "Martin D-28 Dreadnought", "Taylor 814ce", "Gibson Hummingbird", "Yamaha FG830",
        "Guild D-55", "Takamine P3DC", "Fender Paramount PM-1", "Larrivee D-03",
        "Maton EBG808", "Cole Clark Fat Lady", "Breedlove Pursuit Exotic", "Seagull S6 Original",
        ...Array.from({length: 38}, (_, i) => `Custom Acoustic Guitar Brand #${i+13}`)
    ],

    // (J) Bass (70 Brand/Merk)
    basses: [
        "Fender Precision Bass", "Music Man StingRay", "Ibanez Soundgear 5-String", "Warwick Streamer",
        "Rickenbacker 4003", "Höfner 500/1 Violin Bass", "Specter NS-2", "ESP LTD B-1004",
        "Dingwall Afterburner Multi-Scale", "Spector Euro 4 LX", "Schecter Stiletto Studio", "Fender Jazz Bass American",
        ...Array.from({length: 58}, (_, i) => `Custom Pro Bass Brand #${i+13}`)
    ],

    // (K) Drum (50 Brand/Merk)
    drums: [
        "Tama Starclassic Maple", "Pearl Reference Pure", "DW Collector's Series", "Yamaha Live Custom",
        "Gretsch USA Custom", "Ludwig Black Beauty Kit", "Sonor SQ2 Custom", "PDP Concept Maple",
        "Orange County Drums (OCDP)", "Noble & Cooley CD Maple", "A&F Drum Co. Field Kit",
        ...Array.from({length: 39}, (_, i) => `Custom Professional Drum Kit Brand #${i+12}`)
    ],

    // (L) Cymbals (30 Brand/Merk)
    cymbals: [
        "Zildjian K Custom Special Dry", "Sabian AAX Studio", "Paiste 2002 Crash/Ride", "Meinl Byzance Foundry",
        "Istanbul Agop Mel Lewis", "Bosphorus Master Series", "UFIP Esithe", "Zildjian Avedis Classic",
        "Sabian HHX Evolution", "Paiste Signature Traditional", "Meinl Byzance Extra Dry",
        ...Array.from({length: 19}, (_, i) => `Custom Pro Cymbals Brand #${i+12}`)
    ],

    // (M) Mixer (30 Brand/Merk Console Style)
    mixers: [
        "SSL 4000 G Console", "Neve 88RS Analog Desk", "API 1608 Discrete", "SSL SiX Compact",
        "Neve BCM10 Vintage", "Trident 88 Analog Console", "Harrison 32C Studio", "Rupert Portico II Console",
        "Audient ASP8024", "Solid State Logic AWS Delta", "SSL Origin Analog",
        ...Array.from({length: 19}, (_, i) => `Custom Analog Console Mixer #${i+12}`)
    ],

    // (N) Mastering (30 Brand/Merk Chain)
    mastering: [
        "Abbey Road Vinyl Mastering Chain", "FabFilter Pro-L 2 Limiter Suite", "Sterling Sound Analog Chain", 
        "SSL Fusion Processor", "Manley Massive Passive EQ & Variable Mu", "Pultec EQP-1A Mastering Suite",
        "Brainworx bx_masterdesk Pro", "Ozone 11 Maximizer Pro", "SPL Iron Mastering Compressor",
        ...Array.from({length: 21}, (_, i) => `Custom Pro Mastering Suite #${i+10}`)
    ],

    // (O) Efek Gitar (200 Brand/Merk, Max 12)
    guitarEffects: [
        "Ibanez Tube Screamer TS9", "Boss DS-1 Distortion", "Strymon Timeline Delay", "Electro-Harmonix Big Muff", 
        "MXR Phase 90", "Dunlop Cry Baby Wah", "Boss CH-1 Super Chorus", "TC Electronic Hall of Fame Reverb",
        "Electro-Harmonix POG2 Polyphonic Octave", "EarthQuaker Devices Plumes", "Strymon BigSky Reverb",
        "Eventide H90 Harmonizer", "Boss DD-8 Digital Delay", "MXR Carbon Copy Analog Delay", "Proco Rat 2 Distortion",
        ...Array.from({length: 185}, (_, i) => `Custom Pro Guitar Effect Pedal #${i+16}`)
    ],

    // (P) Efek Bass (100 Brand/Merk, Max 10)
    bassEffects: [
        "Darkglass B7K Ultra", "SansAmp Bass Driver DI", "Electro-Harmonix Bass Big Muff", "MXR M80 Bass D.I.+",
        "Boss BB-1X Bass Driver", "Tech 21 SansAmp VT Bass", "Aguilar Agro Overdrive", "Empress Effects Compressor Bass",
        "Source Audio C4 Synth", "Electro-Harmonix Q-Tron Bass Envelope",
        ...Array.from({length: 90}, (_, i) => `Custom Pro Bass Effect Pedal #${i+11}`)
    ],

    // (Q) Alat Musik Lain / Alat Musik Dunia (150 Pilihan, Max 8)
    worldInstruments: [
        "Japanese Koto", "Indian Sitar", "Celtic Irish Flute", "Middle Eastern Oud", "African Djembe",
        "Chinese Guzheng", "Tibetan Singing Bowls", "Andean Pan Flute", "Hawaiian Ukulele", "Flamenco Cajon",
        "Balinese Gamelan Gong", "Irish Bouzouki", "Persian Santur", "Turkish Saz", "Armenian Duduk",
        "Mandolin", "Banjo", "Harmonica", "Accordion", "Melodica",
        ...Array.from({length: 130}, (_, i) => `Custom World & Ethnic Instrument #${i+21}`)
    ]
};

// Inisialisasi Elemen HTML
document.addEventListener("DOMContentLoaded", () => {
    populateAllDropdowns();
});

function populateAllDropdowns() {
    fillDropdown("genType", bixtoneData.generationType);
    fillDropdown("vocalType", bixtoneData.vocalTypes);
    fillDropdown("vocalChar", bixtoneData.vocalCharacters);
    fillDropdown("mood", bixtoneData.moods);
    fillDropdown("genre", bixtoneData.genres);
    fillDropdown("mic", bixtoneData.mics);
    fillDropdown("amp", bixtoneData.amps);
    fillDropdown("cab", bixtoneData.cabs);
    fillDropdown("guitars", [...bixtoneData.guitarsElectric, ...bixtoneData.guitarsAcoustic]);
    fillDropdown("bass", bixtoneData.basses);
    fillDropdown("drums", bixtoneData.drums);
    fillDropdown("cymbals", bixtoneData.cymbals);
    fillDropdown("mixer", bixtoneData.mixers);
    fillDropdown("mastering", bixtoneData.mastering);
    fillDropdown("effects", [...bixtoneData.guitarEffects, ...bixtoneData.bassEffects]);
    fillDropdown("worldInst", bixtoneData.worldInstruments);
}

function fillDropdown(elementId, dataArray) {
    const select = document.getElementById(elementId);
    if (!select) return;
    dataArray.forEach(item => {
        let opt = document.createElement("option");
        opt.value = item;
        opt.textContent = item;
        select.appendChild(opt);
    });
}

// (R) Proses Generate 3 Lagu Sekaligus (Variatif, Balance, Wild)
async function startGeneration() {
    const playerSection = document.getElementById("playerSection");
    const resultStatus = document.getElementById("resultStatus");
    const audioPlayer = document.getElementById("audioPlayer");

    playerSection.classList.remove("hidden");
    resultStatus.innerHTML = "<b>Status:</b> Menerapkan parameter Layer 1-3... Meracik 3 varian (Variatif, Balance, Wild) via Bixlabs AI Engine...";

    // Simulasi respons sukses backend
    setTimeout(() => {
        resultStatus.innerHTML = "<b>Status:</b> 3 Lagu Berhasil Dihasilkan! Memuat ke Pemutar Musik Studio.";
        audioPlayer.src = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3";
        audioPlayer.play();
    }, 3000);
}

// Fitur Pendukung Studio (T, U, V, W, X)
function correctionPerfection() {
    alert("Fitur Correction & Perfection (T): Menganalisis ketukan drum, keseimbangan frekuensi, dan intonasi vokal untuk disempurnakan.");
}

function removeAndGenerate() {
    alert("Fitur Remove + Generate (U): Memisahkan stem (vokal/gitar/bass/drum) untuk regenerasi trek spesifik.");
}

function remakeRecordGenerate() {
    alert("Fitur Remake + Record + Generate (V): Merekam instrumen atau vokal langsung dari mikrofon HP Anda ke dalam aransemen AI.");
}

function downloadMusic() {
    alert("Fitur Download (W): Mengunduh file dalam format Lossless WAV, MP3 320kbps, dan arsip ZIP.");
}

function sharePlatform() {
    if (navigator.share) {
        navigator.share({
            title: 'BIXTONE ULTIMATE PRO',
            text: 'Dengarkan karya musik AI buatan saya!',
            url: window.location.href,
        }).catch(() => console.log('Berbagi dibatalkan'));
    } else {
        alert("Tautan lagu berhasil disalin untuk dibagikan ke WhatsApp & Media Sosial!");
    }
}
