"""
Layer 2 — Keyword & Boundary Checker
Loads boundary rules from MongoDB, caches in Redis (TTL 300s).
Admin boundary changes call /invalidate-cache which deletes the Redis key,
forcing a fresh load on the next message.
"""
import os
import re
import json
import redis as redis_lib
import db_client
from dotenv import load_dotenv

load_dotenv()

CACHE_KEY = "wele:boundaries"
CACHE_TTL = 300  # 5 minutes

# ── Redis singleton ────────────────────────────────────────────────────────────
_redis = None

def get_redis():
    global _redis
    if _redis is None:
        url = os.getenv("REDIS_URL", "redis://localhost:6379")
        _redis = redis_lib.from_url(url, decode_responses=True, ssl_cert_reqs=None)
    return _redis


def _load_boundaries() -> list[dict]:
    """Load from Redis or fetch fresh from MongoDB."""
    r = get_redis()
    try:
        cached = r.get(CACHE_KEY)
        if cached:
            return json.loads(cached)
    except Exception as e:
        print(f"[KW] Redis read error: {e}")

    # Redis miss — fetch from DB
    boundaries = db_client.get_enabled_boundaries()
    try:
        r.setex(CACHE_KEY, CACHE_TTL, json.dumps(boundaries))
    except Exception as e:
        print(f"[KW] Redis write error: {e}")
    return boundaries


def invalidate_cache():
    """Called when admin updates any boundary rule."""
    try:
        get_redis().delete(CACHE_KEY)
        print("[KW] Boundary cache invalidated ✅")
    except Exception as e:
        print(f"[KW] Cache invalidation error: {e}")


def check(message: str) -> dict:
    """
    Check message against all enabled boundary keywords and patterns.
    Returns { blocked: bool, category: str, feedback: str }
    """
    text = message.lower().strip()
    boundaries = _load_boundaries()

    for b in boundaries:
        # Keyword match
        for kw in b.get("keywords", []):
            if kw.lower() in text:
                return {
                    "blocked":  True,
                    "category": b["category"],
                    "feedback": b.get("feedback_msg", "Your message was flagged by our content policy.")
                }
        # Regex pattern match
        for pattern_str in b.get("patterns", []):
            try:
                if re.search(pattern_str, message, re.IGNORECASE):
                    return {
                        "blocked":  True,
                        "category": b["category"],
                        "feedback": b.get("feedback_msg", "Your message was flagged by our content policy.")
                    }
            except re.error:
                pass  # skip invalid patterns

    return {"blocked": False, "category": None, "feedback": None}
