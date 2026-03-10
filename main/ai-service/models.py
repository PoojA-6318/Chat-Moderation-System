"""
Shared model singletons — load ONCE at startup, import everywhere.
Loading each model takes 2-5 seconds and ~200MB RAM.
Never import these inside request handlers.
"""
import pathlib
from sentence_transformers import SentenceTransformer

# Resolve model path relative to project root (one level up from ai-service/)
_BASE_DIR   = pathlib.Path(__file__).resolve().parent.parent
_MODEL_PATH = str(_BASE_DIR / "Models" / "trained_sentence_model")

print(f"[MODELS] Loading SentenceTransformer from {_MODEL_PATH} ...")
sbert_model = SentenceTransformer(_MODEL_PATH)
print("[MODELS] ✅ SentenceTransformer (trained_sentence_model) loaded")
