# ✅ Phase 3 — Complete Report
## RAG Room Chatbot + Personal Learning Assistant

---

## 🎯 What Phase 3 Was About

Phase 3 adds **two AI-powered chatbots** to the WeLe platform:

1. **Room Knowledge Bot** — A RAG (Retrieval Augmented Generation) chatbot that answers questions about a specific room's topic using knowledge embedded by the admin. It never makes up answers — it only answers from what the admin provided.

2. **Personal Learning Assistant** — A friendly guide that looks at all available rooms and routes learners to the right community based on what they want to learn.

---

## 📂 Files Created in `ai-service/`

```
ai-service/
├── embedder.py     ← Vector store: chunk + embed + query (numpy)
└── chatbot.py      ← room_chatbot() + personal_assistant() (Groq)
```

> `main.py` already had stub handlers for `/chatbot` and `/embed-knowledge` from Phase 2 — Phase 3 fills in the real logic.

---

## 📄 File-by-File Explanation

---

### 1. `embedder.py` — Lightweight Vector Store

**Why not ChromaDB?**
ChromaDB has a pydantic v1/v2 conflict with FastAPI (pydantic v2). Instead, we built a lightweight vector store using **numpy arrays + JSON files** — same cosine similarity retrieval, zero extra dependencies.

**How it works:**

```
Admin provides knowledge text (e.g., Java tutorial, notes, docs)
          ↓
_chunk_text() → split into 500-char overlapping chunks
          ↓
sbert_model.encode() → convert each chunk to 384-dim vector
          ↓
np.save() → saved to disk as vector_store/room_{id}.npy
json.dump() → saved to disk as vector_store/room_{id}.json
```

**Text Chunking Strategy:**
- Chunk size: **500 characters**
- Overlap: **50 characters** between consecutive chunks
- Why overlap? So important context at chunk boundaries isn't lost

**Example:**
```
Input: "Java is OOP. Classes are blueprints. Objects are instances..."

Chunk 0: "Java is OOP. Classes are blueprints. Objects are instances..." (0-500)
Chunk 1: "Objects are instances. Inheritance allows reuse..." (450-950)
Chunk 2: "Inheritance allows reuse. Polymorphism changes behavior..." (900-1400)
```

**Retrieval (query_room_knowledge):**
```
User question → SBERT encode → query vector (384-dim)
          ↓
Load room's .npy file → N chunk vectors
          ↓
Cosine similarity = (chunk_vec · query_vec) / (|chunk_vec| * |query_vec|)
          ↓
Return top-3 chunks with similarity > 0.3
```

**Storage format:**
```
ai-service/
└── vector_store/
    ├── room_abc123.npy    ← numpy array (N chunks × 384 dims)
    └── room_abc123.json   ← ["chunk text 0", "chunk text 1", ...]
```

> This is persistent — survives server restarts. No database needed.

---

### 2. `chatbot.py` — Dual Chatbot Implementations

#### `room_chatbot(message, room_id, room_topic)` — RAG Bot

**Full RAG Pipeline:**

```
User asks: "How do I use Spring Boot @RestController?"
          ↓
embedder.query_room_knowledge(room_id, message, top_k=3)
          ↓
Returns top 3 relevant chunks from admin's knowledge base
          ↓
Build Groq prompt:
  System: "Answer ONLY from this knowledge base: [chunk1, chunk2, chunk3]"
  User: "How do I use Spring Boot @RestController?"
          ↓
Groq llama-3.1-8b-instant generates answer
          ↓
Response sent to user
```

**Key rules in the system prompt:**
- Answer ONLY from provided knowledge — no hallucination
- If answer not in knowledge → say "I'm not sure, ask in community chat 💬"
- Keep responses 2-4 sentences
- Warm, encouraging, educational tone

**What happens if no knowledge is embedded?**
```python
if not chunks:
    return "📚 I don't have specific info yet! The admin hasn't set up the knowledge base..."
```

> Admin embeds knowledge via `POST /embed-knowledge` from the Admin Panel (Phase 6).

---

#### `personal_assistant(message, rooms)` — Personal Guide Bot

Routes learners to the right room based on their interests.

**Input:** User's message + list of all active rooms with their topics
**Output:** A warm, helpful message pointing to the best matching room

**System prompt context:**
```json
[
  {"name": "Full Stack Java", "topic": "Java Development", "description": "..."},
  {"name": "Python ML Room", "topic": "Machine Learning", "description": "..."},
  {"name": "Web Dev Basics", "topic": "HTML/CSS/JS", "description": "..."}
]
```

**Example interaction:**
```
User: "I want to learn Spring Boot"
Assistant: "You'd love the Full Stack Java community! 🚀 They cover everything 
from Java basics to Spring Boot REST APIs. Head over and introduce yourself!"
```

**If no matching room:**
```
User: "I want to learn Kotlin"
Assistant: "We don't have a Kotlin room yet, but you can request one using the 
'Request Room' button in the sidebar! 📬 The Java room might also have helpful resources."
```

---

## 🔗 How `main.py` Uses These

The endpoints were already stubbed in Phase 2. Phase 3 fills them in:

### `POST /embed-knowledge`
```
Admin creates room → provides notes/docs/tutorial text
→ POST /embed-knowledge { room_id, content }
→ embedder.embed_room_knowledge(room_id, content)
→ Chunks → SBERT vectors → saved to disk
→ Returns { success: true, chunks_stored: 12 }
```

### `POST /chatbot`
```json
// Room chatbot (mode="room"):
{ "message": "How does JVM work?", "room_id": "abc123", "mode": "room" }
→ Query vector store → build RAG prompt → Groq answer

// Personal assistant (mode="personal"):
{ "message": "I want to learn Python", "mode": "personal" }
→ Load all rooms → Groq routes to best room
```

---

## 🧪 Test Results

```
Embed result: {'success': True, 'chunks_stored': 2}
Query result: ['Spring Boot is a popular Java framework...']
All Phase 3 tests passed!
Exit code: 0
```

---

## 🏗️ Architecture Diagram

```
Admin Panel (Phase 6)
      │
      │ POST /embed-knowledge
      ↓
  embedder.py ──→ vector_store/room_{id}.npy + .json

Learner App (Phase 5)
      │
      │ POST /chatbot (mode="room")    POST /chatbot (mode="personal")
      ↓                                        ↓
  chatbot.room_chatbot()              chatbot.personal_assistant()
      │                                        │
      ↓                                        ↓
  embedder.query()                        All rooms from MongoDB
      │                                        │
      ↓                                        ↓
  Top-3 chunks → Groq prompt           All rooms → Groq routing
      │                                        │
      ↓                                        ↓
  Grounded answer ←───────────────── Helpful room suggestion
```

---

## ✅ Phase 3 — What IS Done

- [x] `embedder.py` — chunk, embed, persist, query (numpy + JSON)
- [x] `chatbot.py` — RAG room bot + personal assistant
- [x] `/embed-knowledge` endpoint fully functional
- [x] `/chatbot` endpoint fully functional (both modes)
- [x] Verified: embed + query returns correct chunks
- [x] No external DB needed — self-contained numpy files

## ❌ Phase 3 — What Is NOT Done Yet

| Feature | Phase |
|---------|-------|
| Admin UI to embed knowledge | Phase 6 |
| Learner chat UI with bot panels | Phase 5 |
| Room bot + personal bot floating UI | Phase 5 |
| Docker | Phase 7 |

---

*Phase 3 completed: 2026-03-08 | Stack: SBERT + numpy vector store + Groq llama-3.1-8b-instant*
