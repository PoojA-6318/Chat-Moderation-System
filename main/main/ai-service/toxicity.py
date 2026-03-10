"""
Layer 3 — Toxicity Checker
Uses a locally trained RoBERTa model (trained-toxic-roberta) for toxicity detection.
Blocks if the 'toxic' (or equivalent) class probability > THRESHOLD.
"""
import os
import pathlib

# Resolve the model path relative to this file's location
_BASE_DIR   = pathlib.Path(__file__).resolve().parent.parent   # project root
_MODEL_PATH = str(_BASE_DIR / "Models" / "trained-toxic-roberta")

THRESHOLD = 0.7

_pipeline = None


def _get_pipeline():
    global _pipeline
    if _pipeline is None:
        try:
            from transformers import pipeline as hf_pipeline
            print(f"[TOXICITY] Loading trained-toxic-roberta from {_MODEL_PATH} ...")
            _pipeline = hf_pipeline(
                "text-classification",
                model=_MODEL_PATH,
                tokenizer=_MODEL_PATH,
                truncation=True,
                max_length=512,
                top_k=None,           # return all labels
            )
            print("[TOXICITY] ✅ trained-toxic-roberta loaded")
        except Exception as e:
            print(f"[TOXICITY] ⚠️ Could not load trained-toxic-roberta: {e}")
            _pipeline = None
    return _pipeline


# Labels that indicate toxic content (adjust to match your model's label names)
_TOXIC_LABELS = {"toxic", "LABEL_1", "1"}


def check(message: str) -> dict:
    """
    Run toxicity detection on the message.
    Returns { blocked: bool, score: float, feedback: str }
    """
    pipe = _get_pipeline()

    # If model failed to load, fail open (allow message)
    if pipe is None:
        return {"blocked": False, "score": 0.0, "feedback": None}

    try:
        results = pipe(message)[0]   # list of {label, score} dicts

        # Find the highest score among toxic labels
        max_score    = 0.0
        for item in results:
            label = item.get("label", "").lower()
            score = float(item.get("score", 0))
            if label in {l.lower() for l in _TOXIC_LABELS}:
                if score > max_score:
                    max_score = score

        if max_score >= THRESHOLD:
            return {
                "blocked":  True,
                "score":    round(max_score, 3),
                "category": "toxicity",
                "feedback": "😊 Let's keep this space respectful and professional! Please rephrase your message in a constructive way."
            }

        return {"blocked": False, "score": round(max_score, 3), "feedback": None}

    except Exception as e:
        print(f"[TOXICITY] Prediction error: {e}")
        return {"blocked": False, "score": 0.0, "feedback": None}
