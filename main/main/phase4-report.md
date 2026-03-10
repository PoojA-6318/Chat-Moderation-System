# WeLe Phase 4 — Detailed Report: Chat Server APIs & Socket.io

This phase focused on the backbone of the platform: making the chat real-time and connecting it to the AI Moderation Engine.

## 📡 1. Real-Time Socket.io Implementation

The core of WeLe is the `send_message` event loop. It is not just a simple broadcast; it is a secure, moderated pipeline.

### The Message Flow:
1.  **Client Emit**: Learner sends a message via Socket.io.
2.  **Server Receive**: `server.js` catches the message and extracts `user_id` and `room_id`.
3.  **AI Proxy**: The server sends the message to the **Python AI Service** ([http://localhost:8000/validate](http://localhost:8000/validate)).
4.  **Moderation Check**:
    -   If **SUCCESS**: The message is saved to MongoDB and broadcasted to all users in the room using `io.to(room_id).emit('new_message')`.
    -   If **BLOCK**: The message is **REJECTED**. The server sends a specific `moderation_block` event ONLY to the sender, containing the reason, feedback, and AI suggestion.
5.  **Persistence**: Every valid message is logged in the `messages` collection for chat history.

---

## 🛠️ 2. REST API Architecture

We implemented 5 key route modules to handle the platform's biological functions:

### 🏠 Rooms API (`/api/rooms`)
-   `GET /`: List all active learning communities.
-   `GET /:id/messages`: Fetch the last 50 messages (for chat history when joining).
-   `POST /`: Admin-only room creation.

### 📬 Requests API (`/api/requests`)
-   `POST /`: Learners submit "Room Requests" (Topic + Reason).
-   `GET /`: Admins view pending requests.
-   `PUT /:id`: Admin approves or rejects a request.

### 🛡️ Boundaries API (`/api/boundaries`)
-   `GET /`: List current AI rules (Politics, Abuse, PII, etc.).
-   `PUT /:id/toggle`: Instant activation/deactivation of a rule.
-   **Cache Sync**: When a rule changes, the server calls the AI Service's `/invalidate-cache` endpoint to clear the Redis cache instantly.

---

## 🔒 3. Security & Middleware
-   **JWT Protection**: Every single API call and Socket connection requires a valid Bearer Token.
-   **Role Guards**: The `adminOnly` middleware ensures that learners cannot access boundary settings or approve their own room requests.
-   **CORS Management**: Dynamically allows requests from `localhost:5173` (Learner) and `localhost:5174` (Admin).

---

### Phase 4 Outcome:
The platform transitioned from a "static server" to a "living ecosystem" where messages are moderated in real-time and the database is kept clean automatically.
