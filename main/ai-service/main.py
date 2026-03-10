"""
WeLe AI Service — FastAPI Entry Point
Endpoints:
  POST /validate          — 5-layer message moderation
  POST /chatbot           — RAG room bot + personal assistant
  POST /embed-knowledge   — Embed room knowledge into ChromaDB
  GET  /invalidate-cache  — Clear Redis boundary cache
  GET  /health            — Health check
"""
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import uvicorn
import os
from dotenv import load_dotenv

load_dotenv()

# ── App setup ─────────────────────────────────────────────────────────────────
app = FastAPI(
    title="WeLe AI Moderation Service",
    description="5-layer AI message moderation + RAG chatbot + knowledge embedding",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Import modules (models load at import time) ───────────────────────────────
import moderation_engine as me
import keyword_checker
import db_client

# Singleton engine
engine = me.ModerationEngine()


# ── Request / Response schemas ────────────────────────────────────────────────
class ValidateRequest(BaseModel):
    message:  str
    room_id:  str
    user_id:  str

class ChatbotRequest(BaseModel):
    message:            str
    room_id:  Optional[str] = None
    mode:               str  = "personal"   # "room" | "personal"
    room_topic: Optional[str] = None

class EmbedRequest(BaseModel):
    room_id: str
    text:    str


# ── Routes ────────────────────────────────────────────────────────────────────

@app.get("/health")
async def health():
    return {"status": "ok", "service": "wele-ai"}


@app.post("/validate")
async def validate(req: ValidateRequest):
    """
    Core moderation endpoint — called by Node.js chat server on every message.
    Returns { status, reason, feedback, suggestion, topic_tag, layer_triggered }
    """
    result = await engine.validate(req.message, req.room_id, req.user_id)
    return result


@app.get("/invalidate-cache")
async def invalidate_cache():
    """
    Called by Node.js chat server after any boundary rule change.
    Clears Redis boundary cache so next message uses fresh rules.
    """
    keyword_checker.invalidate_cache()
    return {"message": "Boundary cache cleared ✅"}


@app.post("/embed-knowledge")
async def embed_knowledge(req: EmbedRequest):
    """
    Admin embeds room knowledge into ChromaDB.
    Called after room creation if knowledge text is provided.
    Phase 3 fully implements this — stub for Phase 2.
    """
    try:
        import embedder
        result = embedder.embed_room_knowledge(req.room_id, req.text)
        return result
    except ImportError:
        return {"success": True, "chunks_stored": 0, "message": "Embedder not yet implemented (Phase 3)"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/chatbot")
async def chatbot(req: ChatbotRequest):
    """
    Dual chatbot endpoint:
    - mode="room": RAG-powered room knowledge bot
    - mode="personal": personal learning guide assistant
    Phase 3 fully implements this — returns fallback for now.
    """
    try:
        import chatbot as cb
        if req.mode == "room" and req.room_id:
            room    = db_client.get_room(req.room_id) or {}
            topic   = req.room_topic or room.get("topic", "this topic")
            response = cb.room_chatbot(req.message, req.room_id, topic)
        else:
            rooms   = db_client.get_active_rooms()
            for r in rooms:
                r["_id"] = str(r["_id"])
            response = cb.personal_assistant(req.message, rooms)
        return {"response": response}
    except ImportError:
        return {"response": "🤖 Chatbot is being set up! Check back after Phase 3."}
    except Exception as e:
        return {"response": f"Sorry, I encountered an error. Please try again!"}


if __name__ == "__main__":
    port = int(os.getenv("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port)
