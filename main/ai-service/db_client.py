import os
import psycopg2
from psycopg2.extras import RealDictCursor
from dotenv import load_dotenv
from typing import List, Dict, Optional

load_dotenv()

# ── Singleton DB connection ───────────────────────────────────────────────────
_connection = None

def get_connection():
    global _connection
    if _connection is None or _connection.closed:
        _connection = psycopg2.connect(os.getenv("DATABASE_URL"))
    return _connection


def get_room(room_id: str) -> Optional[Dict]:
    """
    Fetch a room by its UUID string.
    Returns dict with keys: topic, blocked_topics
    """
    try:
        conn = get_connection()
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            cur.execute('SELECT topic, blocked_topics FROM rooms WHERE id = %s', (room_id,))
            room = cur.fetchone()
            if not room:
                return None
            return {
                "topic": room["topic"] or "",
                "blocked_topics": room["blocked_topics"] or []
            }
    except Exception as e:
        print(f"[PG] get_room error: {e}")
        return None


def get_enabled_boundaries() -> List[Dict]:
    try:
        conn = get_connection()
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            cur.execute('SELECT category, keywords, patterns, feedback_msg FROM boundaries')
            rows = cur.fetchall()
            return [
                {
                    "category": r["category"] or "",
                    "keywords": r["keywords"] or [],
                    "patterns": r["patterns"] or [],
                    "feedback_msg": r["feedback_msg"] or "Please keep your message respectful."
                }
                for r in rows
            ]
    except Exception as e:
        print(f"[PG] get_enabled_boundaries error: {e}")
        return []


def get_active_rooms() -> List[Dict]:
    try:
        conn = get_connection()
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            cur.execute('SELECT id as _id, name, topic, description FROM rooms WHERE is_active = true')
            return list(cur.fetchall())
    except Exception as e:
        print(f"[PG] get_active_rooms error: {e}")
        return []