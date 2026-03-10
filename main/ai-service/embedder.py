"""
Lightweight Vector Store (replaces ChromaDB)
Uses SBERT embeddings stored as numpy arrays + JSON metadata on disk.
No pydantic conflicts. Same cosine similarity retrieval as ChromaDB.
Each room gets its own files: vector_store/room_{room_id}.npy + .json
"""
import os
import json
import numpy as np
from models import sbert_model

# ── Storage path ───────────────────────────────────────────────────────────────
STORE_DIR = os.path.join(os.path.dirname(__file__), "vector_store")
os.makedirs(STORE_DIR, exist_ok=True)


def _paths(room_id: str):
    base = os.path.join(STORE_DIR, f"room_{room_id}")
    return f"{base}.npy", f"{base}.json"


def _chunk_text(text: str, chunk_size: int = 500, overlap: int = 50) -> list[str]:
    """Split text into overlapping chunks for better context retrieval."""
    chunks = []
    start  = 0
    text   = text.strip()
    while start < len(text):
        chunk = text[start : start + chunk_size].strip()
        if chunk:
            chunks.append(chunk)
        start += chunk_size - overlap
    return chunks


def embed_room_knowledge(room_id: str, content: str) -> dict:
    """
    Chunk + embed + store knowledge for a room.
    Saves two files:
      vector_store/room_{id}.npy  — numpy array of shape (N, 384)
      vector_store/room_{id}.json — list of text chunks
    """
    try:
        chunks = _chunk_text(content)
        if not chunks:
            return {"success": False, "chunks_stored": 0, "error": "Content is empty"}

        # Encode all chunks in one batch
        embeddings = sbert_model.encode(chunks, convert_to_numpy=True)   # shape: (N, 384)

        npy_path, json_path = _paths(room_id)
        np.save(npy_path, embeddings)
        with open(json_path, "w", encoding="utf-8") as f:
            json.dump(chunks, f, ensure_ascii=False)

        print(f"[EMBEDDER] ✅ Room {room_id}: {len(chunks)} chunks saved")
        return {"success": True, "chunks_stored": len(chunks)}

    except Exception as e:
        print(f"[EMBEDDER] Error: {e}")
        return {"success": False, "chunks_stored": 0, "error": str(e)}


def query_room_knowledge(room_id: str, query: str, top_k: int = 3) -> list[str]:
    """
    Retrieve top_k most relevant chunks using cosine similarity.
    Returns [] if no knowledge is embedded for the room.
    """
    try:
        npy_path, json_path = _paths(room_id)

        if not os.path.exists(npy_path) or not os.path.exists(json_path):
            return []

        embeddings = np.load(npy_path)                # (N, 384)
        with open(json_path, encoding="utf-8") as f:
            chunks = json.load(f)

        query_vec = sbert_model.encode([query], convert_to_numpy=True)   # (1, 384)

        # Cosine similarity = dot product of normalised vectors
        emb_norm = embeddings / (np.linalg.norm(embeddings, axis=1, keepdims=True) + 1e-10)
        q_norm   = query_vec   / (np.linalg.norm(query_vec,   axis=1, keepdims=True) + 1e-10)
        scores   = (emb_norm @ q_norm.T).flatten()   # (N,)

        top_indices = np.argsort(scores)[::-1][:top_k]
        return [chunks[i] for i in top_indices if scores[i] > 0.3]

    except Exception as e:
        print(f"[EMBEDDER] Query error for room {room_id}: {e}")
        return []
