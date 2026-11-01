from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os

app = FastAPI(
    title="Bixtone Music AI API",
    description="Backend API untuk aplikasi Android Music AI Generator",
    version="1.0"
)

# Konfigurasi CORS agar bisa diakses dari APK Android / browser
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class MusicRequest(BaseModel):
    prompt: str
    genre: str = "Modern Trap"
    duration: int = 30

@app.get("/")
def read_root():
    return {"status": "online", "message": "Bixtone Music AI API siap digunakan!"}

@app.post("/api/generate-music")
async def generate_music(data: MusicRequest):
    try:
        # Tempat integrasi model AI (MusicGen/AudioCraft) nantinya
        print(f"Menerima prompt: {data.prompt} | Genre: {data.genre}")
        
        # Contoh link hasil simulasi audio
        audio_url = "https://your-supabase-storage-bucket-url/output_song.mp3"
        
        return {
            "status": "success",
            "message": "Musik berhasil digenerate!",
            "data": {
                "prompt": data.prompt,
                "genre": data.genre,
                "duration": data.duration,
                "audio_url": audio_url
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
