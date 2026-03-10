# 🏆 WeLe — AI-Moderated Learning Community Chat Platform
## Complete Build Workflow (8 Phases)

---

## 🔑 Admin Credentials (Pre-configured — Seeded on First Boot)
| Field | Value |
|-------|-------|
| Email | `vrtkaarthik6@gmail.com` |
| Password | `hello123` |
| Role | `admin` |

> **IMPORTANT:** Only the admin can grant admin access to other users. This is done via email authentication through the Admin Panel (`/admin/grant-access`). The admin sends an invite by entering the target user's email — if the user exists in the system, their role is promoted to `admin`.

---

## 📋 Environment Variables You Must Fill In

Before starting ANY phase, sign up for these FREE services and collect your keys:

| Variable | Where to Get It | Used In |
|----------|----------------|---------|
| `MONGODB_URI` | [atlas.mongodb.com](https://atlas.mongodb.com) → Create Free M0 Cluster → Connect | chat-server + ai-service |
| `REDIS_URL` | [upstash.com](https://upstash.com) → Create Database → REST URL | chat-server + ai-service |
| `JWT_SECRET` | Any random string (e.g., `openssl rand -hex 32`) | chat-server only |
| `GROQ_API_KEY` | [console.groq.com](https://console.groq.com) → API Keys | ai-service only |
| `AI_SERVICE_URL` | `http://localhost:8000` (local) or your Render URL (deployed) | chat-server |
| `PORT` | `5000` (chat-server default) | chat-server |
| `SIMILARITY_THRESHOLD` | `0.65` (default — no signup needed) | ai-service |

**Create these `.env` files before Phase 1:**

```
# chat-server/.env
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/wele?retryWrites=true&w=majority
REDIS_URL=rediss://:<password>@<region>.upstash.io:<port>
JWT_SECRET=your_super_secret_jwt_key_here_minimum_32_chars
PORT=5000
AI_SERVICE_URL=http://localhost:8000

# ai-service/.env
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/wele?retryWrites=true&w=majority
REDIS_URL=rediss://:<password>@<region>.upstash.io:<port>
GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxxxxxxxxxx
SIMILARITY_THRESHOLD=0.65
```

---

## 🏗️ Project Structure

```
wele-ai-moderator/
├── ai-service/          # Python FastAPI — AI brain
├── chat-server/         # Node.js + Socket.io backend
├── learner-app/         # React frontend for learners (PUBLIC forum view)
├── admin-panel/         # React admin dashboard
└── docker-compose.yml   # One command to run everything
```

---

## 📱 Mobile Responsiveness
All frontend UIs use `@media` queries so they work on phones/tablets. Key breakpoints:
- `max-width: 768px` — Mobile: sidebar collapses, full-width chat
- `max-width: 1024px` — Tablet: condensed layout
- `min-width: 1025px` — Desktop: full 3-column layout

---

## 🎨 UI Design Concept

**WeLe** is a **public learning forum** — similar to Stack Overflow meets Discord.

- **Students** post doubts/questions in topic rooms
- **Experts/educators** answer them
- **AI** moderates everything in real-time (5-layer pipeline)

The UI should feel **modern, dark-themed, educational** — not corporate. Think: a smart Discord for learners. The logo should reflect:
- Learning & growth (book/brain motif)
- AI & technology (circuit/neural motif)
- Community (people/network motif)

---

## 📦 PHASE 1 — Project Setup + All Mongoose Models + JWT Auth
**Estimated Time:** ~40 mins | **Difficulty:** ⭐⭐

### What Gets Built
- All 4 project folders initialized with `package.json`
- 6 Mongoose models: `User`, `Room`, `Message`, `Boundary`, `RoomRequest`, `ViolationLog`
- MongoDB Atlas connection
- Upstash Redis connection
- JWT auth routes: `POST /api/auth/register` + `POST /api/auth/login`
- JWT `protect` + `adminOnly` middleware
- **Admin seeding:** `vrtkaarthik6@gmail.com` / `hello123` created on first boot
- 5 default boundary documents seeded on startup

### Install Commands
```bash
# Chat Server
cd chat-server && npm init -y
npm install express socket.io mongoose ioredis jsonwebtoken bcryptjs cors dotenv axios

# Learner App
cd ../learner-app && npx create-react-app . --template cra-template
npm install axios socket.io-client react-router-dom

# Admin Panel
cd ../admin-panel && npx create-react-app . --template cra-template
npm install axios react-router-dom recharts
```

### Files to Create
| File | Purpose |
|------|---------|
| `chat-server/models/User.js` | User schema with role, violation_history |
| `chat-server/models/Room.js` | Room schema with blocked_topics |
| `chat-server/models/Message.js` | Message schema with moderation_status |
| `chat-server/models/Boundary.js` | Boundary rules schema |
| `chat-server/models/RoomRequest.js` | Room request schema |
| `chat-server/models/ViolationLog.js` | Violation log schema |
| `chat-server/server.js` | Express app + MongoDB + Redis + seed |
| `chat-server/routes/auth.js` | Register + login endpoints |
| `chat-server/middleware/auth.js` | JWT protect + adminOnly |
| `chat-server/.env.example` | Template for env vars |

### ✅ Phase 1 Done When
- `npm start` in `chat-server/` connects to MongoDB and Redis without errors
- `POST /api/auth/register` creates a user in MongoDB Atlas
- `POST /api/auth/login` returns a JWT token
- Admin user `vrtkaarthik6@gmail.com` exists in DB on first boot
- 5 boundary documents seeded in `boundaries` collection

### ⚠️ What YOU Need to Do Before I Run Phase 1
1. Create a **MongoDB Atlas** free cluster → copy `MONGODB_URI`
2. Create an **Upstash Redis** database → copy `REDIS_URL`
3. Generate a random `JWT_SECRET` (at least 32 chars)
4. Place these values in `chat-server/.env`

---

## 🧠 PHASE 2 — Python AI Moderation Engine (5-Layer Pipeline)
**Estimated Time:** ~90 mins | **Difficulty:** ⭐⭐⭐⭐⭐

### What Gets Built
A FastAPI service that validates every chat message through 5 layers before allowing/blocking.

| Layer | Tool | Speed | Purpose |
|-------|------|-------|---------|
| L1 — PII | Regex + spaCy | ~5ms | Phone, email, Aadhaar, PAN, URLs |
| L2 — Keywords | Redis cache from MongoDB | ~10ms | Custom blocked keywords |
| L3 — Toxicity | Detoxify multilingual | ~60-100ms | Abuse, hate speech |
| L4 — Topic AI | SBERT all-MiniLM-L6-v2 | ~100-200ms | Off-topic detection |
| L5 — LLM | Groq llama-3.1-8b-instant | ~200-400ms | Ambiguous message reasoning + rewriter |

### Install Commands
```bash
cd ai-service
pip install fastapi uvicorn sentence-transformers detoxify \
  chromadb groq spacy redis pymongo python-dotenv
python -m spacy download en_core_web_sm
```

### Files to Create
| File | Purpose |
|------|---------|
| `ai-service/mongo_client.py` | pymongo → get_room(), get_enabled_boundaries() |
| `ai-service/pii_checker.py` | Layer 1: regex + spaCy NER |
| `ai-service/keyword_checker.py` | Layer 2: Redis-cached keyword match |
| `ai-service/toxicity.py` | Layer 3: Detoxify wrapper |
| `ai-service/topic_detector.py` | Layer 4: SBERT cosine similarity |
| `ai-service/llm_layer.py` | Layer 5: Groq reasoning + rewriter |
| `ai-service/feedback.py` | Friendly message mapper |
| `ai-service/moderation_engine.py` | 5-layer orchestrator |
| `ai-service/main.py` | FastAPI: /validate, /chatbot, /embed-knowledge, /invalidate-cache |
| `ai-service/.env.example` | Template for env vars |

### ✅ Phase 2 Done When
- `uvicorn main:app --reload` runs without errors
- `POST /validate` with a test message returns `{status: "allowed"}` for clean message
- `POST /validate` with "Call me at 9876543210" returns `{status: "blocked", layer_triggered: "1-pii"}`

### ⚠️ What YOU Need to Do Before I Run Phase 2
1. Add your `GROQ_API_KEY` to `ai-service/.env`
2. Make sure `ai-service/.env` has `MONGODB_URI` and `REDIS_URL`

---

## 💬 PHASE 3 — RAG Room Chatbot + Personal Assistant
**Estimated Time:** ~60 mins | **Difficulty:** ⭐⭐⭐⭐

### What Gets Built
- **Room Chatbot**: Admin feeds knowledge text → chunked → embedded in ChromaDB → users ask questions → answers grounded in that knowledge
- **Personal Assistant**: Floating bot that routes learners to relevant rooms, suggests requesting new ones

### Files to Create
| File | Purpose |
|------|---------|
| `ai-service/embedder.py` | ChromaDB chunk + embed + query |
| `ai-service/chatbot.py` | room_chatbot() + personal_assistant() |
| `ai-service/models.py` | Shared singleton model loader (avoids duplicate loads) |
| Update `ai-service/main.py` | Add /chatbot endpoint |

### ✅ Phase 3 Done When
- `POST /embed-knowledge` with room_id + content stores chunks in ChromaDB
- `POST /chatbot` with `{mode: "room"}` returns RAG-grounded answers
- `POST /chatbot` with `{mode: "personal"}` routes to relevant room
- No model loaded twice (check startup logs for single model load)

---

## 🔌 PHASE 4 — Chat Server REST APIs + Socket.io (Full)
**Estimated Time:** ~60 mins | **Difficulty:** ⭐⭐⭐

### What Gets Built
- Full Socket.io real-time chat with AI validation on every message (server-side)
- All CRUD REST endpoints for rooms, requests, boundaries, admin stats

### Key Socket.io Flow
```
User types message → socket emit 'send_message'
       ↓
Node.js server receives → JWT verify → check mute status
       ↓
POST /validate to Python AI service
       ↓
ALLOWED: save to MongoDB + broadcast 'new_message' to room
BLOCKED: emit 'message_blocked' to sender only + log violation
```

### Files to Create
| File | Purpose |
|------|---------|
| `chat-server/server.js` | Full Socket.io + Express (complete version) |
| `chat-server/routes/rooms.js` | GET/POST/PATCH rooms |
| `chat-server/routes/requests.js` | Submit + review room requests |
| `chat-server/routes/boundaries.js` | CRUD boundaries + cache invalidation |
| `chat-server/routes/admin.js` | Stats + violation logs + grant-admin-access |

### Admin Grant Access Endpoint
```
POST /api/admin/grant-access
Body: { email: "user@example.com" }
Auth: adminOnly
Action: Find user by email → set role to "admin"
Returns: { message: "Admin access granted to user@example.com" }
```

### ✅ Phase 4 Done When
- Socket.io chat works end-to-end
- Sending "idiot" in chat gets blocked (keyword layer)
- Sending normal message broadcasts to all users in room
- Admin can grant access to another user via email

---

## ⚛️ PHASE 5 — Learner React App (Chat UI + Bots + Room Request)
**Estimated Time:** ~75 mins | **Difficulty:** ⭐⭐⭐⭐

### What Gets Built
The public-facing WeLe forum UI — this is what all users see. Designed like a modern Q&A community where:
- **Students** post questions/doubts
- **Others** answer in real-time
- **AI** silently moderates the conversation

### Key Components
| Component | Purpose |
|-----------|---------|
| `MessageInput.jsx` | Text input + socket emit + show block popup |
| `ModerationPopup.jsx` | Warm, educational popup when message is blocked |
| `ChatWindow.jsx` | Real-time message display, auto-scroll |
| `RoomSidebar.jsx` | Room list + "Request New Room" modal |
| `PersonalBot.jsx` | Floating 🤖 guide bot (bottom-right) |
| `RoomBot.jsx` | Knowledge chatbot panel inside room |

### Pages
| Page | Route | Purpose |
|------|-------|---------|
| `Login.jsx` | `/login` | Email + password login |
| `Register.jsx` | `/register` | New user registration |
| `Home.jsx` | `/` | Room discovery grid |
| `ChatRoom.jsx` | `/room/:id` | Full chat experience |

### Mobile Responsiveness (`@media` rules)
```css
/* Mobile: < 768px — sidebar collapses to bottom tab bar */
@media (max-width: 768px) {
  .room-sidebar { display: none; }           /* hidden, use bottom nav */
  .chat-area { width: 100%; }               /* full width */
  .room-bot-panel { position: fixed; bottom: 0; width: 100%; } 
  .personal-bot { bottom: 70px; right: 16px; }  /* above bottom nav */
}

/* Tablet: 769px–1024px — condensed layout */
@media (min-width: 769px) and (max-width: 1024px) {
  .room-sidebar { width: 200px; }
  .room-bot-panel { width: 260px; }
}
```

### ✅ Phase 5 Done When
- Login/register works and stores JWT in localStorage
- Room list loads from API
- Real-time chat works in any room
- Sending blocked message shows warm popup
- Personal bot (floating) answers topic questions
- Room bot answers from embedded knowledge
- UI looks great on mobile (tested at 375px width)

---

## 📊 PHASE 6 — Admin Panel (Room Creation, Boundaries, Dashboard)
**Estimated Time:** ~60 mins | **Difficulty:** ⭐⭐⭐

### What Gets Built
The admin control center — only accessible to users with `role: "admin"`.

### Pages
| Page | Purpose |
|------|---------|
| `Dashboard.jsx` | Stats cards + Recharts violation charts + recent logs |
| `RoomManager.jsx` | Create/edit rooms + embed knowledge base |
| `BoundaryManager.jsx` | Keyword management + toggle enable/disable |
| `Requests.jsx` | Approve/reject room requests from learners |
| `GrantAccess.jsx` | Enter email → promote user to admin |

### Admin Grant Access UI
```
📧 Grant Admin Access
[Email Input: "Enter user email address..."]
[Grant Access Button]

>> On success: "✅ Admin access granted to user@example.com"
>> On error: "❌ No user found with that email"
>> Only logged-in admin can see this page
```

### Mobile Responsiveness (`@media` rules)
```css
@media (max-width: 768px) {
  .admin-sidebar { display: none; }        /* collapsed sidebar */
  .admin-topbar { display: flex; }         /* show hamburger menu */
  .stats-grid { grid-template-columns: 1fr 1fr; }
  .violations-table { overflow-x: auto; display: block; }
}
```

### ✅ Phase 6 Done When
- Admin login works (protected route)
- Can create room with knowledge base text
- Boundary changes take effect in < 30 seconds (Redis invalidated)
- Room requests table shows with approve/reject buttons
- Dashboard shows violation bar chart
- Admin can promote user to admin via email field

---

## 🐳 PHASE 7 — Docker Compose + Integration + Testing
**Estimated Time:** ~45 mins | **Difficulty:** ⭐⭐⭐

### What Gets Built
- `docker-compose.yml` — one command runs all 6 services
- Dockerfiles for all 4 app services
- `.env.example` covering all variables
- `README.md` with quick start guide

### Run Everything
```bash
# Copy env file and fill in your values
cp .env.example .env
# Edit .env with MONGODB_URI, REDIS_URL, GROQ_API_KEY, JWT_SECRET

# Start all services
docker-compose up --build
```

### Integration Checklist
- [ ] Learner App → Chat Server via Socket.io
- [ ] Chat Server → AI Service via axios POST /validate
- [ ] Admin Panel → Chat Server → AI Service /invalidate-cache
- [ ] Admin Panel → AI Service /embed-knowledge
- [ ] Test mute after 3+ violations
- [ ] Test boundary update → Redis refresh → new keyword blocked within 30s

### ✅ Phase 7 Done When
- `docker-compose up --build` completes successfully
- All 6 services running and healthy
- End-to-end flow: register → login → chat → blocked message → popup shown

---

## ⭐ PHASE 8 — WOW Features (Make Judges Remember You)
**Estimated Time:** ~30 mins each | **Difficulty:** ⭐⭐⭐

| Feature | How It Works |
|---------|-------------|
| 🔄 AI Message Rewriter | L5 `suggestion` field + "Use This Instead" button in ModerationPopup |
| 🏷️ Live Topic Tagging | L5 returns topic label → stored in `topic_tag` → shown as pill on message |
| 📊 Violation Heatmap | Admin Dashboard: Recharts bar chart by category + line chart over time |
| 🔴 Smart Escalating Mute | 1st violation: warning. 3rd: 30min mute. 5th: 2hr mute. Countdown shown. |
| 🔔 Tone Shift on Repeat | ModerationPopup changes text from gentle → firm after 2+ violations |
| 📚 Room Redirect Suggestion | Off-topic block → personal bot suggests correct room |

---

## 🚀 Free Hosting Deployment Order
1. **MongoDB Atlas** → get `MONGODB_URI` (free M0 cluster)
2. **Upstash Redis** → get `REDIS_URL` (free tier)
3. **Groq** → get `GROQ_API_KEY` (free tier)
4. Deploy **ai-service** to Render/HF Spaces → get URL
5. Deploy **chat-server** to Render → set all env vars → get URL
6. Deploy **learner-app** to Vercel → set `REACT_APP_CHAT_SERVER`
7. Deploy **admin-panel** to Vercel → same env vars
8. ✅ All live. All free.

---

## 📋 After Each Phase — Report Format
After completing each phase, I will give you:

```
✅ PHASE [N] COMPLETE

DONE:
• [list of files created]
• [things that work]

⚠️ YOU NEED TO DO:
• [env vars to fill in]
• [services to set up]
• [manual test to run]

❌ NOT YET BUILT:
• [things left for next phases]

👉 Ready for Phase [N+1]? Type YES to continue.
```

---

*Blueprint Source: WeLe Full Blue Print.html — Bound AI Hackathon v2*
