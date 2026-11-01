from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Bixtone Music AI")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {"status": "Bixtone Backend LIVE di Vercel!", "endpoints": ["/api/generate", "/docs"]}

@app.post("/api/generate")
def generate_music(payload: dict):
    return {
        "status": "done",
        "mp3_url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
        "title": payload.get("title", "Akhir cerito iki"),
        "lyrics": payload.get("lyrics", "")
    }

@app.get("/api/generate")
def generate_get():
    return {
        "status": "done",
        "mp3_url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
    }
