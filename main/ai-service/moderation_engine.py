"""
Moderation Engine — 5-Layer Pipeline Orchestrator
Runs layers in order, returns immediately on first BLOCK.
Layer order: PII → Keywords → Toxicity → Topic → LLM
"""
import pii_checker
import keyword_checker
import toxicity
import topic_detector
import llm_layer
import feedback as fb
from typing import Dict


class ModerationEngine:

    async def validate(self, message: str, room_id: str, user_id: str) -> Dict:
        """
        Run all 5 moderation layers in sequence.
        Returns a result dict consumed by Node.js chat server and stored in ViolationLog.
        """

        # ── Layer 1 — PII & Regex ─────────────────────────────────────────────
        result = pii_checker.check(message)
        if result["blocked"]:
            return {
                "status":          "blocked",
                "reason":          result.get("feedback"),
                "feedback":        result.get("feedback"),
                "suggestion":      None,
                "topic_tag":       None,
                "layer_triggered": "1-pii"
            }

        # ── Layer 2 — Keyword / Boundary ──────────────────────────────────────
        result = keyword_checker.check(message)
        if result["blocked"]:
            return {
                "status":          "blocked",
                "reason":          f"Matched boundary: {result.get('category')}",
                "feedback":        result.get("feedback"),
                "suggestion":      None,
                "topic_tag":       None,
                "layer_triggered": "2-keyword"
            }

        # ── Layer 3 — Toxicity ────────────────────────────────────────────────
        result = toxicity.check(message)
        if result["blocked"]:
            return {
                "status":          "blocked",
                "reason":          f"Toxicity score: {result.get('score', 0):.2f}",
                "feedback":        result.get("feedback"),
                "suggestion":      None,
                "topic_tag":       None,
                "layer_triggered": "3-toxicity"
            }

        # ── Layer 4 — Topic Similarity ────────────────────────────────────────
        result = topic_detector.check(message, room_id)
        if result["blocked"]:
            return {
                "status":          "blocked",
                "reason":          f"Off-topic: matched '{result.get('matched_topic')}'",
                "feedback":        result.get("feedback"),
                "suggestion":      None,
                "topic_tag":       None,
                "layer_triggered": "4-topic"
            }

        # ── Layer 5 — LLM Reasoning (Groq) ───────────────────────────────────
        result = llm_layer.check(message, room_id)
        if result["blocked"]:
            return {
                "status":          "blocked",
                "reason":          result.get("reason"),
                "feedback":        fb.get_feedback("llm-flagged"),
                "suggestion":      result.get("suggestion"),
                "topic_tag":       result.get("topic_tag"),
                "layer_triggered": "5-llm"
            }

        # ── All layers passed — ALLOW ─────────────────────────────────────────
        return {
            "status":          "allowed",
            "reason":          None,
            "feedback":        None,
            "suggestion":      None,
            "topic_tag":       result.get("topic_tag"),   # LLM assigned topic tag
            "layer_triggered": None
        }
