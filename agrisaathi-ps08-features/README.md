# AgriSaathi AI Pro Max
AI-Powered Agricultural Governance & Financial Copilot.

## 🚀 Quick Start

Just run ONE command:

```bash
npm run dev
```

This automatically starts:
- ✅ Frontend (Next.js) on port 3000
- ✅ Backend (FastAPI) on port 8000
- ✅ Everything works together!

Then open: **http://localhost:3000**

## 📋 Prerequisites

- Node.js (v18+)
- Python (v3.8+)
- npm or yarn

## 🛠️ Setup

### 1. Install Dependencies

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd ml-backend
pip install -r requirements-minimal.txt
cd ..
```

### 2. Configure API Keys (REQUIRED)

You need at least 2 API keys to run AgriSaathi:

1. **AI Service** (Choose one):
   - **Groq** (Recommended): https://console.groq.com/keys
   - **Gemini**: https://aistudio.google.com/app/apikey

2. **Weather Service**:
   - **OpenWeather**: https://home.openweathermap.org/api_keys

Create `ml-backend/.env`:
```bash
cd ml-backend
copy .env.example .env
```

Edit `ml-backend/.env` and add your keys:
```env
# Required
GROQ_API_KEY=gsk_your_groq_key_here
OPENWEATHER_API_KEY=your_openweather_key_here
```

📖 **Detailed guide**: See [API_KEYS_GUIDE.md](./API_KEYS_GUIDE.md)

### 3. Start Development

```bash
npm run dev
```

That's it! Both servers start automatically.

## 🌐 Architecture

- **Frontend**: Next.js on port 3000 (user-facing)
- **Backend**: FastAPI on port 8000 (internal)
- **Proxy**: Next.js automatically forwards `/api/*` to backend

```
User → http://localhost:3000 → Next.js → /api/* → FastAPI (port 8000)
```

## 📡 API Endpoints

All accessible at `http://localhost:3000/api/`:

- `/api/recommend` - AI crop recommendation
- `/api/crop-risk` - Weather-based risk analysis
- `/api/fertilizer-optimize` - Fertilizer optimization
- `/api/soil-health` - Soil health analysis
- `/api/pest-disease` - Pest & disease prediction
- `/api/yield-predict` - Yield prediction
- `/api/crop-rotation` - Crop rotation planning
- `/api/market-prices` - Market price tracking
- `/api/chat` - AI chatbot advisor

## 🔧 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start both frontend and backend |
| `npm run dev:frontend` | Start only frontend |
| `npm run dev:backend` | Start only backend |
| `npm run build` | Build for production |
| `npm start` | Start production server |

## 🐛 Troubleshooting

**"Offline mode" error:**
- Missing AI API key (Groq or Gemini)
- See [API_KEYS_GUIDE.md](./API_KEYS_GUIDE.md)

**"concurrently not found" error:**
```bash
npm install
```

**Backend not starting:**
```bash
cd ml-backend
pip install -r requirements-minimal.txt
py main.py
```

**Port already in use:**
```bash
# Kill process on port 3000
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Kill process on port 8000
netstat -ano | findstr :8000
taskkill /PID <PID> /F
```

**Network error:**
Make sure both servers are running. Check the terminal output.

## 📦 What You Need

### Minimum (Required)
- ✅ Groq API Key (free, 30 seconds)
- ✅ OpenWeather API Key (free, 1 minute)

### Optional (Add later)
- Supabase (database)
- Telegram Bot (notifications)
- Twilio (SMS/voice)
- Data.gov.in (market prices)
- Sentinel Hub (satellite imagery)

## 📄 License

MIT
