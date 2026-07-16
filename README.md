# PDF to Podcast AI Platform

This repository contains a full-stack application that converts PDF documents into AI-generated podcast audio using Gemini AI and Google TTS.

## Security Features
- **Strict HTTPS (HSTS)**
- **API Key Protection**
- **File Magic Number Validation**
- **XSS & NoSQL Injection Sanitization**
- **Rate Limiting & Helmet Configured**

## How to Run Locally

### Backend
```bash
cd backend
npm install
# Create a .env file based on the required variables
npm run dev
```

### Frontend
```bash
cd frontend
npm install
# Create a .env file with VITE_API_URL and VITE_API_KEY
npm run dev
```

## Deployment Guide

We recommend a split deployment strategy because of Vercel's strict file upload limits (4.5MB) and timeouts (10s), which break large AI generations.

### 1. Deploy Backend to Render
1. Go to [Render.com](https://render.com) and create a **Web Service**.
2. Connect this repository and set the **Root Directory** to `backend`.
3. Build Command: `npm install`
4. Start Command: `node server.js`
5. Add these Environment Variables:
   - `GEMINI_API_KEY`: Your Gemini API key
   - `API_KEY`: A secret key (e.g., `super-secret-key-123`)
   - `ALLOWED_ORIGINS`: `*` (Update this to your Vercel URL later)
6. Deploy and copy your Render URL (e.g., `https://my-backend.onrender.com`).

### 2. Deploy Frontend to Vercel
1. Go to [Vercel.com](https://vercel.com) and create a **New Project**.
2. Import this repository and set the **Root Directory** to `frontend`.
3. Framework Preset: **Vite**
4. Add these Environment Variables:
   - `VITE_API_URL`: Your Render backend URL
   - `VITE_API_KEY`: The exact same secret key you used above.
5. Deploy!

### 3. Final Security Step
Go back to your Render Dashboard and update the `ALLOWED_ORIGINS` environment variable to match your new Vercel URL (e.g., `https://my-frontend.vercel.app`). This completely locks down your API!