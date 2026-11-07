import { Client } from "https://cdn.jsdelivr.net/npm/@gradio/client@0.1.4/dist/index.min.js";

const generateBtn = document.getElementById("generateBtn");
const promptInput = document.getElementById("promptInput");
const bpmSelect = document.getElementById("bpmSelect");
const statusBox = document.getElementById("statusBox");
const statusText = document.getElementById("statusText");
const playerCard = document.getElementById("playerCard");
const audioPlayer = document.getElementById("audioPlayer");

// Event Listener Preset Buttons
document.querySelectorAll(".preset-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelectorAll(".preset-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        promptInput.value = btn.dataset.prompt;
    });
});

// Event Listener Main Generation
generateBtn.addEventListener("click", async () => {
    let userPrompt = promptInput.value.trim();
    if (!userPrompt) {
        alert("Silakan isi prompt atau pilih preset instrumen terlebih dahulu!");
        return;
    }

    // Gabungkan dengan setting mastering & BPM
    const finalPrompt = `${userPrompt}, tempo ${bpmSelect.value}, professional studio mastering, high fidelity audio quality`;

    try {
        generateBtn.disabled = true;
        generateBtn.style.opacity = "0.6";
        statusBox.classList.remove("hidden");
        playerCard.classList.add("hidden");
        statusText.innerText = "Menghubungkan ke BIXTONE AI Audio Engine...";

        // Menghubungkan ke Hugging Face Space publik (MusicGen) secara gratis & tanpa limit token aplikasi
        const client = await Client.connect("facebook/MusicGen");

        statusText.innerText = "Merender lagu AI (Proses memakan waktu 15-30 detik)...";

        // Mengirim prompt ke server AI
        const result = await client.predict("/predict", [
            finalPrompt,
            null
        ]);

        if (result && result.data && result.data[0]) {
            const audioUrl = result.data[0].url;
            audioPlayer.src = audioUrl;
            statusBox.classList.add("hidden");
            playerCard.classList.remove("hidden");
        } else {
            throw new Error("Format output audio tidak valid.");
        }

    } catch (error) {
        console.error("Audio Generation Error:", error);
        statusText.innerText = "Gagal merender audio. Pastikan koneksi internet stabil dan coba kembali.";
    } finally {
        generateBtn.disabled = false;
        generateBtn.style.opacity = "1";
    }
});
