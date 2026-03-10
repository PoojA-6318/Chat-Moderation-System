"""
Friendly feedback message mapper.
Used when a layer blocks a message but doesn't have a specific feedback string.
"""

_FEEDBACK_MAP = {
    "pii":          "🔒 Please do not share personal information (phone numbers, emails, IDs) in the chat.",
    "abuse":        "😊 Let's keep this space respectful! Please rephrase your message constructively.",
    "politics":     "🎓 This is a learning community — please keep discussions focused on technical and professional topics.",
    "spam":         "🚫 Promotional or spam content isn't allowed here. Keep posts relevant to learning!",
    "social_media": "📵 Please avoid sharing social media links or handles. Stay focused on the topic!",
    "toxicity":     "😊 Let's keep this space respectful and professional. Please rephrase your message.",
    "off-topic":    "🎯 Your message seems outside this room's scope. Please align your question with the room's topic.",
    "llm-flagged":  "💡 Your message was reviewed by our AI and doesn't meet our community guidelines. Please revise it.",
    "default":      "⚠️ Your message was flagged by our content policy. Please revise and try again."
}


def get_feedback(category: str, matched_topic: str = None, room_topic: str = None) -> str:
    """
    Return a friendly feedback message for the given violation category.
    """
    if category == "off-topic" and room_topic:
        return (
            f"🎯 This message seems outside the scope of this group! "
            f"This room focuses on **{room_topic}**. "
            f"{'Your message appears to be about ' + matched_topic + '. ' if matched_topic else ''}"
            f"Try adjusting your question to match the room's topic!"
        )
    return _FEEDBACK_MAP.get(category, _FEEDBACK_MAP["default"])
