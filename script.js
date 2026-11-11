import { BixtoneBrainEngine } from "./engine.js";

// === 1. PASANG TOKEN NENG KENE, MAS! ===
// Tempel token hf_... sing mau Mas Copy, neng njero tanda petik iki:
const HF_TOKEN = "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";

// === 2. OTAK BIXTONE ===
const brain = new BixtoneBrainEngine();
brain.init("bixtone_knowledge_base.json");

const generateBtn = document.getElementById("generateBtn");
const promptInput = document.getElementById("promptInput");
const bpmSelect = document.getElementById("bpmSelect");
const statusBox = document.getElementById("statusBox");
const statusText = document.getElementById("statusText");
const playerCard = document.getElementById("playerCard");
const audioPlayer = document.getElementById("audioPlayer");

// === 3. TOMBOL PRESET (Ben tombol instrumen iso dipencet) ===
document.querySelectorAll(".preset-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelectorAll(".preset-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        promptInput.value = btn.dataset.prompt;
    });
});

// === 4. TOMBOL GENERATE - MUNG 1 TOK, ORA DOBEL MANEH! ===
generateBtn.addEventListener("click", async () => {
    const rawPrompt = promptInput.value.trim();
    if (!rawPrompt) {
        alert("Isi konsep musik dulu Mas!");
        return;
    }

    if (!HF_TOKEN || HF_TOKEN.includes("TEMPEL_TOKEN")) {
        alert("Token HF urung dipasang Mas! Tempel token neng script.js disik!");
        return;
    }

    // OTAK KERJA: Rakit prompt Metal Jawa + Hardware + Vokal
    const finalPrompt = brain.synthesizeMasterPrompt(rawPrompt, bpmSelect.value, "javanese");
    console.log("PROMPT BIXTONE:", finalPrompt);

    try {
        generateBtn.disabled = true;
        generateBtn.style.opacity = "0.6";
        statusBox.classList.remove("hidden");
        playerCard.classList.add("hidden");
        statusText.innerText = "Otak BIXTONE ngirim prompt neng AI... tunggu 20-40 detik...";

        const res = await fetch("https://router.huggingface.co/hf-inference/models/facebook/musicgen-small", {
            method: "POST",
            headers: {
                "Authorization": "Bearer " + HF_TOKEN,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ inputs: finalPrompt })
        });

        if (!res.ok) throw new Error("Server AI sibuk / Token salah: " + res.status);

        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        audioPlayer.src = url;
        audioPlayer.play();

        statusBox.classList.add("hidden");
        playerCard.classList.remove("hidden");
        statusText.innerText = "Dadi Mas! Lagu-e wis metu!";

    } catch (error) {
        console.error("Engine Error:", error);
        // BEN ORA SIA-SIA: Prompt langsung di-copy, iso paste neng Suno / Mureka
        statusText.innerText = "AI sibuk. Prompt-e wis tak copy, tinggal paste neng Suno / Mureka!";
        try { await navigator.clipboard.writeText(finalPrompt); } catch(e){}
        alert("BIXTONE PROMPT (wis ke-copy):\n\n" + finalPrompt);
    } finally {
        generateBtn.disabled = false;
        generateBtn.style.opacity = "1";
    }
});
