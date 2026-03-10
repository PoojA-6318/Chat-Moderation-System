"""
Layer 1 — PII & Regex Checker
Blocks: Indian phone numbers, emails, URLs, Aadhaar, PAN, password hints
Primary defence: compiled regex (~5ms).
Secondary defence: trained-pii-roberta (HuggingFace token-classification pipeline)
  acts as a fallback NER layer, replacing the old spaCy en_core_web_sm approach.
"""
import re
import pathlib

# ── Resolve local model path ──────────────────────────────────────────────────
_BASE_DIR   = pathlib.Path(__file__).resolve().parent.parent
_PII_MODEL  = str(_BASE_DIR / "Models" / "trained-pii-roberta")

# ── Lazy-loaded RoBERTa NER pipeline ─────────────────────────────────────────
_ner_pipeline  = None
_ner_tried     = False

def _get_ner_pipeline():
    global _ner_pipeline, _ner_tried
    if not _ner_tried:
        _ner_tried = True
        try:
            from transformers import pipeline as hf_pipeline
            print(f"[PII] Loading trained-pii-roberta from {_PII_MODEL} ...")
            _ner_pipeline = hf_pipeline(
                "token-classification",
                model=_PII_MODEL,
                tokenizer=_PII_MODEL,
                aggregation_strategy="simple",
                truncation=True,
                max_length=512,
            )
            print("[PII] ✅ trained-pii-roberta loaded")
        except Exception as e:
            print(f"[PII] ⚠️ Could not load trained-pii-roberta: {e}")
            _ner_pipeline = None
    return _ner_pipeline

# ── Compile all patterns at module load (once) ────────────────────────────────
_PATTERNS = {
    "phone":    re.compile(r'\b[6-9]\d{9}\b'),
    "email":    re.compile(r'[\w\.\-]+@[\w\.\-]+\.\w+'),
    "url":      re.compile(r'https?://\S+|www\.\S+', re.IGNORECASE),
    "aadhaar":  re.compile(r'\b\d{4}\s?\d{4}\s?\d{4}\b'),
    "pan":      re.compile(r'\b[A-Z]{5}[0-9]{4}[A-Z]\b'),
    "password": re.compile(r'(?i)(password|passwd|pwd)\s*[:=]\s*\S+'),
}

_FEEDBACK = {
    "phone":    "🔒 Please do not share phone numbers in the chat. Keep your personal information private!",
    "email":    "🔒 Please avoid sharing email addresses here. Use the platform's messaging features instead.",
    "url":      "🔗 External links are not allowed in this learning community. Please describe the resource instead.",
    "aadhaar":  "🔒 Never share your Aadhaar number online! This is sensitive personal information.",
    "pan":      "🔒 Please do not share your PAN card details in public chat.",
    "password": "🔒 Never share passwords in chat — not even as examples!",
    "pii":      "🔒 Please do not share personal information in the chat.",
}

# Entity types our RoBERTa model may emit that we consider PII
_PII_ENTITY_GROUPS = {"PER", "PERSON", "ORG", "LOC", "GPE", "EMAIL", "PHONE", "ID"}

# Contact-sharing trigger words (used with short messages containing a named entity)
_CONTACT_TRIGGERS = ["contact", "call me", "reach me", "whatsapp", "dm me", "message me"]


def check(message: str) -> dict:
    """
    Check message for PII patterns.
    Returns { blocked: bool, category: str, feedback: str }
    """
    text = message.strip()

    # 1. Fast regex pass
    for name, pattern in _PATTERNS.items():
        if pattern.search(text):
            return {
                "blocked":  True,
                "category": "pii",
                "feedback": _FEEDBACK.get(name, _FEEDBACK["pii"])
            }

    # 2. RoBERTa NER — trained-pii-roberta
    try:
        nlp = _get_ner_pipeline()
        if nlp is None:
            return {"blocked": False, "category": None, "feedback": None}

        entities = nlp(text[:500])   # limit to 500 chars for speed

        for ent in entities:
            group = (ent.get("entity_group") or ent.get("entity", "")).upper()
            score = float(ent.get("score", 0))

            # High-confidence PII entity
            if group in _PII_ENTITY_GROUPS and score >= 0.80:
                # For PERSON/ORG/LOC, only flag if short message with contact trigger
                if group in {"PER", "PERSON", "ORG", "LOC", "GPE"}:
                    lower = text.lower()
                    if len(text) < 120 and any(t in lower for t in _CONTACT_TRIGGERS):
                        return {
                            "blocked":  True,
                            "category": "pii",
                            "feedback": "🔒 Please avoid sharing personal contact information in the chat."
                        }
                else:
                    # Direct PII entity (EMAIL, PHONE, ID) → block regardless of context
                    return {
                        "blocked":  True,
                        "category": "pii",
                        "feedback": _FEEDBACK["pii"]
                    }

    except Exception as e:
        print(f"[PII] RoBERTa error (non-critical): {e}")

    return {"blocked": False, "category": None, "feedback": None}
