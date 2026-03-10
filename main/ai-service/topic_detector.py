"""
Layer 4 — Topic Similarity Detector
Uses SBERT (all-MiniLM-L6-v2) cosine similarity to detect off-topic messages.
Compares message embedding against each blocked_topic in the room.
Blocks if similarity > SIMILARITY_THRESHOLD (default 0.65)
"""
import os
import numpy as np
from sentence_transformers import util
import db_client
from models import sbert_model  # shared singleton

SIMILARITY_THRESHOLD = float(os.getenv("SIMILARITY_THRESHOLD", "0.65"))


def check(message: str, room_id: str) -> dict:
    """
    Check if message is semantically off-topic for the room.
    Returns { blocked: bool, matched_topic: str|None, feedback: str|None }
    """
    try:
        room = db_client.get_room(room_id)
        if not room:
            return {"blocked": False, "matched_topic": None, "feedback": None}

        blocked_topics = room.get("blocked_topics", [])
        room_topic     = room.get("topic", "this room")

        if not blocked_topics:
            return {"blocked": False, "matched_topic": None, "feedback": None}

        # Encode message + all blocked topics in one batch
        all_texts      = [message] + blocked_topics
        embeddings     = sbert_model.encode(all_texts, convert_to_tensor=True)
        msg_embedding  = embeddings[0]
        topic_embeddings = embeddings[1:]

        # Compute cosine similarities
        similarities  = util.cos_sim(msg_embedding, topic_embeddings)[0]
        max_sim       = float(similarities.max())
        best_idx      = int(similarities.argmax())
        matched_topic = blocked_topics[best_idx]

        if max_sim >= SIMILARITY_THRESHOLD:
            return {
                "blocked":       True,
                "category":      "off-topic",
                "matched_topic": matched_topic,
                "feedback":      (
                    f"🎯 This message seems outside the scope of this group! "
                    f"This room focuses on **{room_topic}**. "
                    f"Your message appears to be about '{matched_topic}'. "
                    f"Try the room that covers that topic, or adjust your question!"
                )
            }

        return {"blocked": False, "matched_topic": None, "feedback": None}

    except Exception as e:
        print(f"[TOPIC] Error: {e}")
        return {"blocked": False, "matched_topic": None, "feedback": None}
