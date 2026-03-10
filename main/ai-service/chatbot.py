"""
Dual Chatbot System
1. room_chatbot()      — RAG-powered: answers grounded in admin knowledge base
2. personal_assistant() — Route learners to the right room using all active rooms
Both use Groq llama-3.1-8b-instant for generation.
"""
import os
import json
from groq import Groq
import embedder
from dotenv import load_dotenv

load_dotenv()

# ── Groq singleton ─────────────────────────────────────────────────────────────
_groq_client = None

def get_groq():
    global _groq_client
    if _groq_client is None:
        _groq_client = Groq(api_key=os.getenv("GROQ_API_KEY"))
    return _groq_client


# ── Room Knowledge Chatbot (RAG) ───────────────────────────────────────────────
def room_chatbot(message: str, room_id: str, room_topic: str) -> str:
    """
    Answers questions using ONLY the knowledge embedded by admin for this room.
    Grounded RAG — no hallucination.

    Flow:
    1. Query ChromaDB for top-3 relevant chunks
    2. If no chunks → return fallback message
    3. Build prompt with knowledge context
    4. Generate grounded answer via Groq
    """
    # Step 1: Retrieve relevant knowledge chunks
    chunks = embedder.query_room_knowledge(room_id, message, top_k=3)

    # Step 2: No knowledge embedded yet
    if not chunks:
        return (
            "📚 I don't have specific information on that yet! "
            "The room admin hasn't set up the knowledge base for this topic. "
            "Feel free to ask the community in the main chat — someone will help! 🙂"
        )

    # Step 3: Build RAG prompt
    knowledge_text = "\n\n---\n\n".join(chunks)

    system_prompt = f"""You are a helpful learning assistant for the **{room_topic}** community on WeLe platform.

Your job: Answer questions ONLY based on the following knowledge base content provided by the room admin.

Rules:
- If the answer is clearly in the knowledge base → answer concisely and helpfully
- If the answer is NOT in the knowledge base → say "I'm not sure about that — try asking in the community chat! 💬"
- DO NOT make up information or hallucinate facts
- Keep responses concise (2-4 sentences max unless more detail is needed)
- Be warm, encouraging, and educational in tone
- Use simple language suitable for learners

Knowledge Base:
{knowledge_text}"""

    # Step 4: Generate answer
    try:
        response = get_groq().chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user",   "content": message}
            ],
            max_tokens=400,
            temperature=0.3
        )
        return response.choices[0].message.content.strip()

    except Exception as e:
        print(f"[CHATBOT] Room bot Groq error: {e}")
        return "🤖 I'm having trouble connecting right now. Please try again in a moment!"


# ── Personal Learning Assistant ────────────────────────────────────────────────
def personal_assistant(message: str, rooms: list[dict]) -> str:
    """
    Routes learners to the correct room based on what they want to learn.
    Uses all active rooms as context so Groq can suggest the best match.

    rooms format: [{ "_id": "...", "name": "...", "topic": "...", "description": "..." }]
    """
    # Build room list for context
    if not rooms:
        rooms_context = "No rooms available yet."
    else:
        rooms_context = json.dumps(
            [{"name": r.get("name",""), "topic": r.get("topic",""), "description": r.get("description","")} for r in rooms],
            indent=2
        )

    system_prompt = f"""You are a friendly learning guide for WeLe — an AI-moderated learning community platform.

Your job: Help learners find the right community room and encourage them to start learning!

Available learning communities:
{rooms_context}

Rules:
- When a user mentions a topic or skill → enthusiastically guide them to the most relevant room by NAME
- If no room matches their interest → tell them they can request a new room using the "Request Room" button in the sidebar
- Keep responses UNDER 3 sentences — be punchy and encouraging
- Be warm, friendly, and motivating — like a helpful senior student
- Use emojis occasionally to add energy 🚀

If the user greets you → respond warmly and ask what topic they want to explore today."""

    try:
        response = get_groq().chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user",   "content": message}
            ],
            max_tokens=200,
            temperature=0.7  # slightly creative for personality
        )
        return response.choices[0].message.content.strip()

    except Exception as e:
        print(f"[CHATBOT] Personal assistant Groq error: {e}")
        return "🤖 I'm having trouble connecting right now. Please try again in a moment!"
