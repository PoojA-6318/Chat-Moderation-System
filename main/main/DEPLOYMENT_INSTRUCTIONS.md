# 🚀 WeLe Deployment Guide

This guide explains how to deploy the WeLe platform using **Vercel** (Frontend) and **Render** (Backend).

## 1. Prerequisites
- Accounts on [Vercel](https://vercel.com) and [Render](https://render.com).
- Your code pushed to a GitHub repository.
- A **Neon PostgreSQL** database (already set up).
- An **Upstash Redis** instance (already set up).

---

## 2. Backend Services (Render)

### A. Chat Server (`chat-server`)
1. Create a new **Web Service** on Render.
2. Select the `chat-server` directory (or the root if it's a monorepo, and set base directory to `chat-server`).
3. **Runtime**: `Node`.
4. **Build Command**: `npx prisma generate && npm install`
5. **Start Command**: `node server.js`
6. **Environment Variables**:
   - `DATABASE_URL`: `your_neon_connection_string`
   - `JWT_SECRET`: `your_random_secret`
   - `AI_SERVICE_URL`: `https://your-ai-service.onrender.com`
   - `LEARNER_APP_URL`: `https://wele-learner.vercel.app`
   - `ADMIN_PANEL_URL`: `https://wele-admin.vercel.app`

### B. AI Service (`ai-service`)
1. Create a new **Web Service** on Render.
2. Select the `ai-service` directory.
3. **Runtime**: `Python 3`.
4. **Build Command**: `pip install -r requirements.txt`
5. **Start Command**: `python main.py`
6. **Environment Variables**:
   - `DATABASE_URL`: `your_neon_connection_string`
   - `REDIS_URL`: `your_upstash_redis_url`
   - `GROQ_API_KEY`: `your_groq_api_key`
   - `SIMILARITY_THRESHOLD`: `0.65`

---

## 3. Frontend Portals (Vercel)

### A. Learner App (`learner-app`)
1. Create a new project on Vercel.
2. Select the `learner-app` folder.
3. **Build Command**: `npm run build`
4. **Output Directory**: `dist`
5. **Environment Variables**:
   - `VITE_API_URL`: `https://your-chat-server.onrender.com`

### B. Admin Panel (`admin-panel`)
1. Create a new project on Vercel.
2. Select the `admin-panel` folder.
3. **Build Command**: `npm run build`
4. **Output Directory**: `dist`
5. **Environment Variables**:
   - `VITE_API_URL`: `https://your-chat-server.onrender.com`

---

## 💡 Important Notes
- **CORS**: Ensure your Render backend's `LEARNER_APP_URL` and `ADMIN_PANEL_URL` environment variables match exactly with your Vercel deployment URLs.
- **Node Version**: If Render fails to build, set `NODE_VERSION` to `20` or `22` in Render's environment variables.
- **Python Version**: Ensure Render uses Python 3.10+ for the AI service.
