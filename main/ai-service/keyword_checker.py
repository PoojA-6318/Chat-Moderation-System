import os
import re
import json
import redis as redis_lib
import db_client
from dotenv import load_dotenv
from typing import List, Dict

load_dotenv()

CACHE_KEY = "wele:boundaries"
CACHE_TTL = 300

_redis = None

def get_redis():
    global _redis
    if _redis is None:
        url = os.getenv("REDIS_URL", "redis://localhost:6379")
        _redis = redis_lib.from_url(url, decode_responses=True, ssl_cert_reqs=None)
    return _redis


# ✅ FIXED HERE
def _load_boundaries() -> List[Dict]:
    r = get_redis()
    try:
        cached = r.get(CACHE_KEY)
        if cached:
            return json.loads(cached)
    except Exception as e:
        print(f"[KW] Redis read error: {e}")

    boundaries = db_client.get_enabled_boundaries()

    try:
        r.setex(CACHE_KEY, CACHE_TTL, json.dumps(boundaries))
    except Exception as e:
        print(f"[KW] Redis write error: {e}")

    return boundaries


def invalidate_cache():
    try:
        get_redis().delete(CACHE_KEY)
        print("[KW] Boundary cache invalidated ✅")
    except Exception as e:
        print(f"[KW] Cache invalidation error: {e}")


def check(message: str) -> Dict:
    text = message.lower().strip()
    boundaries = _load_boundaries()

    for b in boundaries:
        for kw in b.get("keywords", []):
            if kw.lower() in text:
                return {
                    "blocked": True,
                    "category": b["category"],
                    "feedback": b.get("feedback_msg", "Your message was flagged.")
                }

        for pattern_str in b.get("patterns", []):
            try:
                if re.search(pattern_str, message, re.IGNORECASE):
                    return {
                        "blocked": True,
                        "category": b["category"],
                        "feedback": b.get("feedback_msg", "Your message was flagged.")
                    }
            except re.error:
                pass

    return {"blocked": False, "category": None, "feedback": None}