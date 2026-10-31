# BIXTONE ULTIMATE PRO
### Music AI Generator - BIXLABS BOYOLALI INDONESIA
> Wujudkan Mimpimu, Ciptakan Musik Tanpa Batas
> 3 Layer Difungsikan Sebagai Prompt

## KONSEP INTI: 3 LAYER SEBAGAI PROMPT
FINAL PROMPT = [LAYER 1 VOICE] + [LAYER 2 INSTRUMENT] + [LAYER 3 STUDIO]

File inti: `src/prompt-builder.mjs` -> JSON payload from src/prompt-builder.mjs

### LAYER 1 - VOICE TAB (TAB 1)
- Generate Type: song / instrumental
- Duration: 1-8 Menit (60-480 detik, default 180)
- Tempo: ON/OFF, 50-200 BPM (OFF = engine pilih otomatis koheren)
- Vocal Gender: male / female / duet
- Duet Config: male-male, female-female, male-female
- Voice Character: 50 pilihan, max 8
- Mood: 50 pilihan, max 8
- Microphone: 30 brand style/inspire by
- Record: RECORD + APPLY TO TRACK (Fitur W)

### LAYER 2 - INSTRUMENT TAB (TAB 2)
- Genre: 150 pilihan, max 8
- Amp: 150 brand style/inspire by, max 4, series/parallel mode
- Cab: 150 brand style/inspire by, max 4, series/parallel mode
- Electric Guitar: 50 brand style/inspire by (PISAH)
- Acoustic Guitar: 30 brand style/inspire by (PISAH)
- Bass: 30 brand style/inspire by,Snare: 50 brand style/inspire by,Cymbals: 30 brand   style/inspire by 
- Guitar FX style/inspire by: 200 brand, max 12
- Bass FX style/inspire bu: 100 brand, max 10
- World Instruments: 150 dunia, max 8
- Structure: melody awal-tengah-akhir (intro, chorus, outro)

### LAYER 3 - STUDIO TAB (TAB 3)
- Mixer: 30 brand inspire by
- Mastering: 30 brand inspire by

## FITUR A-Z (openapi.yaml)
- T: Duration 1-8 menit + Tempo ON/OFF 50-200
- U: Correction/Perfection -> POST /v1/projects/{id}/corrections
- V: Remove+Generate -> POST /v1/projects/{id}/remove-generate
- W: Remake+Record+Generate -> POST /v1/projects/{id}/remake-record-generate
- X: Download WAV, FLAC, MP3, AAC, M4A, OGG, STEMS_ZIP -> POST /v1/exports
- X2: Share revocable expiring -> POST /v1/share-links
- Y: Player + Playlist
- Z: Disclaimer inspire by + approved review -> GET /v1/catalog

