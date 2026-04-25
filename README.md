# AgriSaathi PS08 — Crop Protection Advisory System

A monorepo containing:
- `agrisaathi-frontend/` → Next.js 15 frontend (deploy to **Vercel**)
- `agrisaathi-ps08-features/` → FastAPI Python backend (deploy to **Railway**)

## Project Structure
```
agrisaathi-ps08/
├── agrisaathi-frontend/      ← Deploy to Vercel
│   ├── src/
│   ├── vercel.json
│   └── package.json
└── agrisaathi-ps08-features/ ← Deploy to Railway
    ├── mlbackend/
    ├── Procfile
    ├── railway.json
    ├── nixpacks.toml
    └── requirements.txt
```

## Deploy Frontend (Vercel)
1. Go to [vercel.com](https://vercel.com) → New Project → Import this repo
2. Set **Root Directory** = `agrisaathi-frontend`
3. Add environment variable: `NEXT_PUBLIC_API_URL` = your Railway backend URL
4. Deploy

## Deploy Backend (Railway)
1. Go to [railway.app](https://railway.app) → New Project → Deploy from GitHub
2. Select this repo
3. Set **Root Directory** = `agrisaathi-ps08-features`
4. Add environment variables (see below)
5. Deploy

## Backend Environment Variables (Railway)
```
GROQ_API_KEY=your_groq_key
OPENWEATHER_API_KEY=your_openweather_key
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
TWILIO_PHONE_NUMBER=your_twilio_number
```

## Run Locally
```bash
npm run dev
```
