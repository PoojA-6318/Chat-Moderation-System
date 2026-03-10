# WeLe Phase 5 — Detailed Report: Learner React App

Phase 5 was about building a world-class, responsive, and "warmly moderated" user experience for learners.

## 🎨 1. Design System & Aesthetics
-   **Theme**: GitHub Dark inspired (Deep blacks, slate grays, and vibrant purple accents).
-   **Interactive UI**: Glassmorphism effects, smooth CSS transitions, and high-contrast typography (Inter font).
-   **Responsiveness**: Mobile-first design using flexbox and grid, with specific `@media` breakpoints for small screens.

---

## 🛡️ 2. The "Warm Moderation" Experience
This is WeLe's unique selling point. We don't just "delete" or "block" messages; we educate.

### ModerationPopup.jsx:
-   When a message is blocked, the user sees a premium modal instead of an error message.
-   **Anatomy of a Block**:
    1.  **Reason**: Clear explanation (e.g., "PII Detected").
    2.  **Educational Feedback**: AI-generated reasoning on why the message was blocked.
    3.  **The "Fix-It" Suggestion**: The AI rewrite of their message.
    4.  **Instant Correction**: A "Use Suggestion" button that automatically replaces their original text with the safe version.

---

## 🤖 3. Dual AI Bot Integration

Learners have access to two distinct AI personalities which are integrated as React components:

### A. Personal Assistant (`PersonalBot.jsx`)
-   A floating chatbot available on every page.
-   Helps the user navigate the platform and find the right learning rooms based on their interests.
-   Uses the global `rooms` list context to suggest paths.

### B. Room Knowledge Bot (`RoomBot.jsx`)
-   A specialized side-panel inside each chat room.
-   **RAG-Powered**: Only answers questions based on the knowledge base (PDF/Text/Tutorials) that the admin has uploaded for that specific room.
-   Allows students to learn quietly while others are chatting.

---

## 🏗️ 4. State Management & Navigation
-   **AuthContext**: Handles JWT storage, auto-login on refresh, and API header injection.
-   **Socket Singleton**: Manages a single persistent connection across all chat pages.
-   **Room Request Modal**: A built-in form that lets learners instantly petition for new topics without leaving their current room.

### Outcomes:
A community platform that feels high-end, responsive, and most importantly, safe for learning.
