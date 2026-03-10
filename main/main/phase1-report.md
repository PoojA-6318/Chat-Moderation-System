# ✅ Phase 1 — Complete Report
## Project Setup + Mongoose Models + JWT Auth

---

## 🎯 What Phase 1 Was About

Phase 1 is the **foundation** of the entire WeLe platform. Without this, nothing else can work. It sets up:
- The Node.js backend server
- All database models (how data is stored in MongoDB)
- User authentication (login/register system)
- Admin account (pre-seeded automatically)
- Content boundary rules (pre-seeded automatically)

---

## 📂 Files Created

```
chat-server/
├── models/
│   ├── User.js
│   ├── Room.js
│   ├── Message.js
│   ├── Boundary.js
│   ├── RoomRequest.js
│   └── ViolationLog.js
├── middleware/
│   └── auth.js
├── routes/
│   ├── auth.js
│   ├── rooms.js
│   ├── requests.js
│   ├── boundaries.js
│   └── admin.js
├── server.js
├── package.json
├── .env
└── .env.example
```

---

## 🗃️ The 6 Mongoose Models (Database Schemas)

These define how data is stored in MongoDB. Each model = one collection (like a table in SQL).

---

### 1. `User.js` — users collection

Stores every person who registers on WeLe.

| Field | Type | Purpose |
|-------|------|---------|
| `name` | String | Display name |
| `email` | String (unique) | Login identifier |
| `password` | String | Stored as bcrypt hash (never plain text) |
| `role` | `admin` or `learner` | Controls what the user can access |
| `violation_count` | Number | How many times user has been blocked |
| `muted_until` | Date | If set, user cannot send messages until this time |
| `violation_history` | Array | Last 20 violations with reason + date (embedded) |
| `created_at` | Date | When the account was created |

> **Key design:** `violation_history` is embedded inside the User document — no separate table needed. MongoDB handles this natively.

---

### 2. `Room.js` — rooms collection

Stores every learning room (like channels in Discord).

| Field | Type | Purpose |
|-------|------|---------|
| `name` | String | Room display name (e.g. "Full Stack Java") |
| `topic` | String | Main topic of room (e.g. "Java Development") |
| `description` | String | Short description shown on room card |
| `blocked_topics` | Array of Strings | Topics NOT allowed in this room (e.g. [".NET", "DevOps"]) |
| `created_by` | ObjectId → User | Which admin created this room |
| `is_active` | Boolean | Whether room is visible to users |
| `knowledge_embedded` | Boolean | Whether admin has added AI knowledge base yet |
| `member_count` | Number | How many users are in this room |
| `created_at` | Date | Creation timestamp |

> **Key design:** `blocked_topics` array is used by the AI Topic Detector (Layer 4) to automatically block off-topic messages.

---

### 3. `Message.js` — messages collection

Stores every chat message that was **allowed** by the AI.

| Field | Type | Purpose |
|-------|------|---------|
| `room_id` | ObjectId → Room | Which room this message belongs to |
| `user_id` | ObjectId → User | Who sent it |
| `username` | String | Sender's name (copied here to avoid lookups) |
| `content` | String | The actual message text |
| `moderation_status` | String | Always `'allowed'` (blocked messages are never saved) |
| `topic_tag` | String | AI-assigned label (e.g. "java-streams", "debugging") |
| `created_at` | Date | When it was sent |

> **Key design:** `username` is stored directly in the message (denormalized) — this avoids doing a User lookup every time we load 50 messages. This is a MongoDB best practice.

---

### 4. `Boundary.js` — boundaries collection

Stores AI moderation rules that the admin can configure without redeploying.

| Field | Type | Purpose |
|-------|------|---------|
| `category` | String (unique) | Rule name (e.g. `politics`, `abuse`, `pii`) |
| `keywords` | Array of Strings | Words that trigger this boundary |
| `patterns` | Array of Strings | Regex patterns that trigger this boundary |
| `is_enabled` | Boolean | Admin can turn individual rules on/off |
| `feedback_msg` | String | Friendly message shown to user when blocked |
| `updated_at` | Date | Auto-updates whenever rule is changed |

> **5 boundaries seeded automatically on first boot:**
> - `abuse` — idiot, stupid, hate, etc.
> - `politics` — election, BJP, congress, vote, etc.
> - `pii` — phone numbers, emails, Aadhaar, PAN (regex patterns)
> - `spam` — buy now, click here, free money, etc.
> - `social_media` — instagram, youtube, tiktok, etc.

---

### 5. `RoomRequest.js` — roomrequests collection

When a learner wants a room that doesn't exist, they submit a request here.

| Field | Type | Purpose |
|-------|------|---------|
| `user_id` | ObjectId → User | Who requested |
| `user_name` | String | Requester's name (denormalized) |
| `topic_name` | String | What topic they want (e.g. "Blockchain Development") |
| `reason` | String | Why they think this room is needed |
| `status` | `pending` / `approved` / `rejected` | Admin decision |
| `admin_note` | String | Optional rejection/approval note from admin |
| `created_at` | Date | When requested |

---

### 6. `ViolationLog.js` — violationlogs collection

Every time a message is blocked by any AI layer, a violation is logged here for admin analytics.

| Field | Type | Purpose |
|-------|------|---------|
| `user_id` | ObjectId → User | Who sent the blocked message |
| `room_id` | ObjectId → Room | Which room it was in |
| `message_content` | String | First 200 chars of the blocked message |
| `violation_category` | String | What kind of violation (abuse, pii, politics, etc.) |
| `layer_triggered` | String | Which AI layer caught it (1-pii, 2-keyword, 3-toxicity, etc.) |
| `created_at` | Date | When it happened |

> **Used in Phase 6** for the admin dashboard charts and violation heatmap.

---

## 🔐 JWT Authentication

### `middleware/auth.js`

Two middleware functions that protect routes:

**`protect`** — Verifies JWT token on every request:
1. Reads `Authorization: Bearer <token>` from request header
2. Decodes the token using `JWT_SECRET`
3. Attaches `req.user = { user_id, email, role }` for use in route handlers
4. Returns 401 if token is missing or invalid

**`adminOnly`** — Must be used AFTER `protect`:
1. Checks if `req.user.role === 'admin'`
2. Returns 403 Forbidden if not admin
3. Only passes through for admin users

---

### `routes/auth.js`

**POST `/api/auth/register`**
1. Validates name, email, password are present
2. Checks email is not already used
3. Hashes password with `bcrypt` (salt rounds: 10)
4. Creates new User in MongoDB with `role: 'learner'`
5. Returns `{ token, user: { id, name, email, role } }`

**POST `/api/auth/login`**
1. Finds user by email
2. Compares password against bcrypt hash
3. Returns `{ token, user }` on success
4. Returns 401 if email/password wrong

---

## 🛣️ REST API Routes

### `routes/rooms.js`
| Method | URL | Who | What |
|--------|-----|-----|------|
| GET | `/api/rooms` | Any logged-in user | Get all active rooms |
| GET | `/api/rooms/:id` | Any logged-in user | Get one room |
| GET | `/api/rooms/:id/messages` | Any logged-in user | Get last 50 messages |
| POST | `/api/rooms` | Admin only | Create a new room |
| PATCH | `/api/rooms/:id` | Admin only | Update a room |

### `routes/requests.js`
| Method | URL | Who | What |
|--------|-----|-----|------|
| POST | `/api/requests` | Logged-in user | Submit room request |
| GET | `/api/requests` | Admin only | View all requests |
| PATCH | `/api/requests/:id` | Admin only | Approve or reject |

### `routes/boundaries.js`
| Method | URL | Who | What |
|--------|-----|-----|------|
| GET | `/api/boundaries` | Any logged-in user | View all rules |
| POST | `/api/boundaries` | Admin only | Create new rule |
| PATCH | `/api/boundaries/:id` | Admin only | Update rule |
| DELETE | `/api/boundaries/:id` | Admin only | Delete rule |

> Every boundary change automatically calls `/invalidate-cache` on the AI service to refresh Redis immediately.

### `routes/admin.js`
| Method | URL | Who | What |
|--------|-----|-----|------|
| GET | `/api/admin/stats` | Admin only | Dashboard stats (rooms, users, violations) |
| GET | `/api/admin/violation-logs` | Admin only | Full violation log table |
| GET | `/api/admin/users` | Admin only | All users list |
| POST | `/api/admin/grant-access` | Admin only | Promote any user to admin by email |
| DELETE | `/api/admin/revoke-access` | Admin only | Remove admin role from user |

---

## 🌐 The Main Server (`server.js`)

### What it does on startup:
1. Connects to **MongoDB Atlas** using `MONGODB_URI` from `.env`
2. Sets up **Express** HTTP server with CORS
3. Sets up **Socket.io** for real-time chat (port 5000)
4. Mounts all 5 route files
5. **Seeds admin user** `vrtkaarthik6@gmail.com / hello123` if not yet in DB
6. **Seeds 5 boundary rules** if DB is empty
7. Starts listening on `PORT=5000`

### Socket.io Events (Real-time Chat):
| Event | Direction | What Happens |
|-------|-----------|-------------|
| `join_room` | Client → Server | User joins a room's socket channel |
| `send_message` | Client → Server | Message is validated by AI before broadcast |
| `new_message` | Server → Room | Allowed message broadcast to everyone |
| `message_blocked` | Server → Sender only | Blocked message info + AI suggestion |
| `message_success` | Server → Sender only | "Posted ✓" confirmation |
| `muted_warning` | Server → Sender only | User is muted, shows countdown |

### Escalating Mute System:
- **3rd violation** → Muted for 30 minutes
- **5th violation** → Muted for 2 hours
- Muted users get `muted_warning` event, cannot send messages

---

## 🔑 Admin Access System

### Primary Admin (Pre-seeded):
- **Email:** `vrtkaarthik6@gmail.com`
- **Password:** `hello123`
- Created automatically on first server boot
- Cannot be revoked (protected in code)

### Granting Admin to Others:
Only an existing admin can do this:
```
POST /api/admin/grant-access
Body: { "email": "someuser@gmail.com" }
```
- Finds user by email → sets `role: 'admin'`
- Returns `"✅ Admin access granted to someuser@gmail.com"`

### Revoking Admin:
```
DELETE /api/admin/revoke-access  
Body: { "email": "someuser@gmail.com" }
```
- Cannot revoke `vrtkaarthik6@gmail.com` (protected)

---

## ✅ Phase 1 — Test Results

```
[DB] ✅ Connected to MongoDB Atlas
[SEED] ✅ Admin user created: vrtkaarthik6@gmail.com
[SEED] ✅ 5 default boundary rules created
[SERVER] 🚀 WeLe Chat Server running on port 5000
```

**Server is live and fully functional.**

---

## ❌ What Is NOT Done Yet

| Feature | Phase |
|---------|-------|
| Python AI 5-layer moderation engine | Phase 2 |
| RAG chatbot (ChromaDB + Groq) | Phase 3 |
| Learner React app (chat UI) | Phase 5 |
| Admin React dashboard | Phase 6 |
| Docker + deployment | Phase 7 |

---

*Phase 1 completed: 2026-03-08 | Server: Node.js + Express + Socket.io + Mongoose + MongoDB Atlas + Upstash Redis*
