/**
 * BIXTONE ULTIMATE PRO - BRAIN ENGINE
 * Developed by Bixlabs, Boyolali, Central Java, Indonesia
 * Core Processor for bixtone_knowledge_base.json
 */

export class BixtoneBrainEngine {
    constructor() {
        this.database = null;
        this.isLoaded = false;
    }

    // 1. Memuat Database JSON ke Memori Otak Engine
    async init(jsonPath = "bixtone_knowledge_base.json") {
        try {
            const response = await fetch(jsonPath);
            if (!response.ok) throw new Error("Gagal mengambil database BIXTONE.");
            this.database = await response.json();
            this.isLoaded = true;
            console.log("🧠 BIXTONE Brain Engine Active! Version:", this.database.version);
            return true;
        } catch (error) {
            console.error("❌ Brain Engine Initialization Failed:", error);
            this.isLoaded = false;
            return false;
        }
    }

    // 2. Mengambil Karakter Suara Brand (Random / Matched)
    getHardwareDNA() {
        if (!this.isLoaded || !this.database.real_hardware_sonic_profiles) return "";

        const hw = this.database.real_hardware_sonic_profiles;
        
        // Pilih sampel hardware acak jika tidak ditentukan untuk memperkaya variasi audio
        const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

        const selectedGuitar = getRandom(hw.guitars || []);
        const selectedBass = getRandom(hw.basses || []);
        const selectedAmp = getRandom(hw.amplifiers || []);
        const selectedSnare = getRandom(hw.drums_and_snares || []);
        const selectedConsole = getRandom(hw.mixers_and_consoles || []);
        const selectedMaster = getRandom(hw.mastering_hardware || []);

        return [
            `Guitar DNA: ${selectedGuitar.brand} (${selectedGuitar.sonic_character})`,
            `Bass DNA: ${selectedBass.brand} (${selectedBass.sonic_character})`,
            `Amplifier: ${selectedAmp.brand} (${selectedAmp.sonic_character})`,
            `Snare & Shell: ${selectedSnare.brand} (${selectedSnare.sonic_character})`,
            `Console: ${selectedConsole.brand} (${selectedConsole.sonic_character})`,
            `Mastering: ${selectedMaster.brand} (${selectedMaster.sonic_character})`
        ].join(" | ");
    }

    // 3. Mengambil Modul Bahasa & Akses Vokal Murni (Tanpa "Inspired by")
    getVocalAndLanguageDNA(preferredLang = "javanese") {
        if (!this.isLoaded) return "";

        const langData = this.database.languages_and_dialects;
        const vocalData = this.database.vocal_techniques || [];

        // Pilih dialek bahasa (Jawa Mataraman/Boyolali atau Indonesia)
        let langInfo = "";
        if (preferredLang === "javanese" && langData.javanese) {
            langInfo = `Phonetics: ${langData.javanese.phonetics}. Dialect Accent: ${langData.javanese.regional_dialects[3] || langData.javanese.regional_dialects[0]}. Style: ${langData.javanese.vocal_styles[0]}.`;
        } else {
            langInfo = `Phonetics: ${langData.indonesian.standard_phonetics}. Style: ${langData.indonesian.vocal_styles[0]}.`;
        }

        // Ambil sampel teknik vokal murni
        const vocalTechs = vocalData.slice(0, 4).join(", ");

        return `Vocal Techniques & Delivery: ${vocalTechs}. Language Profile: ${langInfo}`;
    }

    // 4. MENGHUBUNGKAN SELURUH DATABASE MENJADI PROMPT UTAMA ENGINE (THE BRAIN)
    synthesizeMasterPrompt(userUserInput, bpm = "120 BPM", language = "javanese") {
        const hardwareProfile = this.getHardwareDNA();
        const vocalLangProfile = this.getVocalAndLanguageDNA(language);

        // Penggabungan tingkat tinggi untuk instruksi Generative Audio AI
        const masterPrompt = `[BIXTONE ULTIMATE ENGINE - Bixlabs Boyolali] ` +
            `User Concept: ${userUserInput}. ` +
            `Tempo & Rhythm: ${bpm}. ` +
            `${vocalLangProfile} ` +
            `Hardware & Sonic Rig: ${hardwareProfile}. ` +
            `Production Quality: Professional high-fidelity studio mix, clean mastering, zero phase distortion.`;

        return masterPrompt;
    }
}
