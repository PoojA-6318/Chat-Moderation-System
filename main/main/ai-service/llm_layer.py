"""
Layer 5 — LLM Reasoning via Groq
Uses llama-3.1-8b-instant to reason about ambiguous messages.
Returns ALLOW/BLOCK + reason + improved suggestion.
Fail-open: if Groq is down, message is allowed.
"""
import os
import json
import re as re_module
from groq import Groq
import db_client
from dotenv import load_dotenv

load_dotenv()

# ── Groq singleton ─────────────────────────────────────────────────────────────
_client = None

def get_groq():
    global _client
    if _client is None:
        _client = Groq(api_key=os.getenv("GROQ_API_KEY"))
    return _client


def check(message: str, room_id: str) -> dict:
    """
    Use Groq LLM to reason about borderline messages.
    Returns { blocked: bool, reason: str, suggestion: str|None, topic_tag: str|None }
    """
    try:
        room         = db_client.get_room(room_id) or {}
        topic        = room.get("topic", "general learning")
        blocked_list = ", ".join(room.get("blocked_topics", [])) or "none"

        system_prompt = f"""You are an AI content moderator for WeLe — a structured learning community chat platform.

Room topic: {topic}
Topics NOT allowed in this room: {blocked_list}

General platform rules (always apply):
- No politics, elections, or government discussions
- No personal abuse, insults, or hate speech
- No spam or self-promotion
- No sharing personal information (phone, email, address)
- No entertainment gossip, social media, or off-topic chatter
- Messages should relate to learning and professional growth

Analyze the user message and respond with ONLY valid JSON (no markdown, no explanation outside the JSON):
{{
  "status": "ALLOW" or "BLOCK",
  "reason": "one concise sentence explaining your decision",
  "suggestion": "an improved version of the message if BLOCK, otherwise null",
  "topic_tag": "a 2-4 word topic label for the message (e.g. java-streams, debugging, career-advice)"
}}"""

        response = get_groq().chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user",   "content": f"Message to check: {message}"}
            ],
            max_tokens=300,
            temperature=0.1
        )

        raw = response.choices[0].message.content.strip()

        # Strip markdown code fences if present
        raw = re_module.sub(r"```(?:json)?", "", raw).strip()

        data = json.loads(raw)

        blocked = data.get("status", "ALLOW").upper() == "BLOCK"
        return {
            "blocked":    blocked,
            "category":   "llm-flagged" if blocked else None,
            "reason":     data.get("reason"),
            "suggestion": data.get("suggestion"),
            "topic_tag":  data.get("topic_tag")
        }

    except json.JSONDecodeError as e:
        print(f"[LLM] JSON parse error: {e}")
        return {"blocked": False, "reason": None, "suggestion": None, "topic_tag": None}
    except Exception as e:
        print(f"[LLM] Groq error (failing open): {e}")
        return {"blocked": False, "reason": None, "suggestion": None, "topic_tag": None}
