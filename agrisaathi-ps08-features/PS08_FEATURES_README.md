# AgriSaathi — PS08 Crop Protection Advisory System
## Features & Requirements Analysis

> **PS08 | Category: Agriculture**  
> Build a crop protection advisory system that guides farmers on protecting crops from pests, birds, animals, and environmental threats with preventive measures, safe practices, and practical action suggestions.

---

## 📋 PS08 Requirements (From Problem Statement)

| # | Requirement |
|---|-------------|
| R1 | Identify major threats to crops |
| R2 | Provide practical prevention and protection suggestions |
| R3 | Support crop-specific and condition-based guidance |
| R4 | Help reduce avoidable crop loss |

---

---

# ✅ SECTION 1: EXISTING FEATURES & REQUIREMENTS (Already Implemented)

These features are fully built and functional in the backend codebase.

---

## 1. Pest & Disease Prediction Engine ⭐ (PRIMARY PS08 MODULE)
- **Endpoint:** `POST /api/pest-disease`
- **File:** `mlbackend/pest_service.py`
- **PS08 Requirements Covered:** R1, R2, R3, R4
- **Description:**
  - Hybrid engine combining static rule-based threat detection + AI-powered symptom diagnosis
  - Covers 5 crops: Rice, Wheat, Cotton, Maize, Tomato
  - Detects 11+ threats: Rice Blast, Brown Plant Hopper, Stem Borer, Yellow Rust, Aphids, Bollworm, Red Spider Mite, Fall Armyworm, Downy Mildew, Early Blight, Fruit Borer
  - Takes inputs: crop, growth_stage, temperature, humidity, rainfall, symptoms, region
  - Provides exact chemical/organic treatment recommendations with dosages
  - AI diagnoses farmer-described symptoms (Probable Cause → Immediate Treatment → Red List Warnings)
  - Risk scoring: 0–100 with levels LOW / MEDIUM / HIGH / CRITICAL

---

## 2. Weather-Based Crop Risk Intelligence
- **Endpoint:** `POST /api/crop-risk` (alias: `/api/weather-advice`)
- **File:** `mlbackend/main.py` (Module 3)
- **PS08 Requirements Covered:** R1, R2, R3, R4
- **Description:**
  - Combines current weather + 48-hour forecast for Forward-Looking Risk Score
  - Detects threats: Heatwave (>38°C), Frost (<10°C), Heavy Rain (>70% probability), High Wind
  - Risk classification: SAFE (🟢) / MODERATE (🟡) / HIGH (🟠) / SEVERE (🔴)
  - LLM generates crop-stage-specific preventative action plans
  - Provides harvest impact analysis
  - Uses OpenWeather API for live weather data

---

## 3. Automated CRON Alert Engine
- **Endpoint:** `POST /api/cron/trigger-alerts`
- **File:** `mlbackend/main.py` (Module 3A)
- **PS08 Requirements Covered:** R2, R4
- **Description:**
  - Scheduled job (every 3–6 hours) that checks weather risk for all registered farmers
  - Auto-dispatches SMS/Telegram/Voice alerts when risk reaches HIGH or SEVERE
  - Pulls farmer data from Supabase database
  - Proactive alerting before damage occurs

---

## 4. Soil Health Intelligence
- **Endpoint:** `POST /api/soil-health`
- **File:** `mlbackend/soil_service.py`
- **PS08 Requirements Covered:** R1, R2, R3
- **Description:**
  - Analyzes pH, N/P/K, organic carbon, sand/clay/silt texture
  - Classifies soil: Heavy Clay / Sandy / Loamy
  - Detects nutrient deficiencies and provides rejuvenation steps
  - Recommendations: liming for acidity, sulfur for alkalinity, cover crops, mulching
  - Status levels: STABLE / WARNING / CRITICAL

---

## 5. Fertilizer Optimization Engine
- **Endpoint:** `POST /api/fertilizer-optimize`
- **File:** `mlbackend/fertilizer_service.py`
- **PS08 Requirements Covered:** R2, R3
- **Description:**
  - Calculates exact NPK requirements per crop and growth stage
  - Adjusts for soil type (sandy/clay/loamy), organic history, irrigation method
  - Covers 4 crops with base NPK tables: Rice, Wheat, Cotton, Maize
  - Provides scientific reasoning for each fertilizer recommendation
  - Supports split application advice for sandy soils, fertigation for drip irrigation

---

## 6. Crop Yield Prediction
- **Endpoint:** `POST /api/yield-predict`
- **File:** `mlbackend/yield_service.py`
- **PS08 Requirements Covered:** R4 (indirect)
- **Description:**
  - Predicts yield (quintals/acre) based on crop, soil, irrigation, fertilizer, rainfall, temperature, seed variety
  - Covers 8 crops: Rice, Wheat, Maize, Cotton, Sugarcane, Soybean, Groundnut, Tomato
  - Calculates estimated revenue at MSP rates
  - Helps quantify potential crop loss to motivate protection

---

## 7. Smart Crop Rotation Planner
- **Endpoint:** `POST /api/crop-rotation`
- **File:** `mlbackend/rotation_service.py`
- **PS08 Requirements Covered:** R2, R4
- **Description:**
  - Generates 3-season rotation plans based on current crop, soil, irrigation
  - Covers 7 crops with expert rotation databases
  - Breaks pest/disease cycles through crop succession
  - Recommends nitrogen-fixing legumes for soil restoration
  - AI-powered reasoning layer for personalized plans

---

## 8. Satellite Crop Monitoring (Remote Sensing)
- **Endpoint:** `POST /api/satellite-analysis`
- **Files:** `mlbackend/satellite_service.py`, `mlbackend/main.py` (Module 11)
- **PS08 Requirements Covered:** R1, R4
- **Description:**
  - Fetches Sentinel-2 L2A satellite data
  - Calculates NDVI, EVI, SAVI vegetation indices
  - 14-day NDVI trend tracking
  - Anomaly detection: low biomass, waterlogging, boundary stress, pest damage zones
  - AI interprets satellite data with field-specific recommendations
  - Health classification: EXCELLENT / GOOD / MODERATE / STRESSED

---

## 9. Multi-Channel Notification System
- **Endpoints:** `POST /api/send-alert`, `/api/broadcast-scheme`, `/api/broadcast-disaster`
- **File:** `mlbackend/notification_service.py`
- **PS08 Requirements Covered:** R2, R4
- **Description:**
  - Severity-based smart dispatch:
    - INFO → Telegram only
    - WARNING → Telegram + SMS
    - CRITICAL → Telegram + SMS + Voice Call
  - Disaster broadcasting (flood, cyclone, drought, heatwave, frost)
  - Scheme notification broadcasting
  - Twilio integration for SMS and voice calls

---

## 10. AI Chatbot Advisor
- **Endpoint:** `POST /api/chat`
- **File:** `mlbackend/main.py`
- **PS08 Requirements Covered:** R2, R3
- **Description:**
  - Context-aware agricultural Q&A powered by LLM (Groq Llama-3.3-70B / Gemini 1.5 Flash)
  - Auto-injects real-time market data when price questions detected
  - Auto-injects weather data when climate questions detected
  - Responds in farmer's regional language
  - Detects commodity names and price keywords automatically

---

## 11. Geolocation Language Detection
- **Endpoint:** `POST /api/detect-language`
- **File:** `mlbackend/services.py`
- **PS08 Requirements Covered:** Usability (understandable recommendations)
- **Description:**
  - Reverse geocodes GPS coordinates to detect Indian state
  - Maps state to dominant regional language
  - Supports 22 Indian languages
  - Enables all advice to be delivered in farmer's native language

---

## 12. Indic Voice TTS Engine
- **Endpoint:** `GET /api/tts`
- **File:** `mlbackend/main.py` (Module 13)
- **PS08 Requirements Covered:** Usability
- **Description:**
  - Converts text alerts into spoken MP3 audio using gTTS
  - Supports 11 Indian languages (Hindi, Telugu, Tamil, Marathi, Punjabi, Bengali, Gujarati, Malayalam, Nepali, Urdu, English)
  - Makes protection advice accessible to low-literacy farmers

---

## 13. Voice IVR System (Phone Call Q&A)
- **Endpoints:** `POST /api/ivr/incoming`, `/api/ivr/process`
- **File:** `mlbackend/twilio_ivr.py`
- **PS08 Requirements Covered:** Usability
- **Description:**
  - Farmers can call the AgriSaathi phone number and ask questions via voice
  - Twilio-powered speech-to-text transcription
  - LLM generates concise answers spoken back to the farmer
  - Default language: Hindi (hi-IN)

---

## 14. ML Crop Recommendation Model
- **Endpoint:** `POST /api/recommend`
- **Files:** `mlbackend/main.py` (Module 1), `mlbackend/train_model.py`, `mlbackend/model.joblib`
- **PS08 Requirements Covered:** R4 (indirect)
- **Description:**
  - RandomForest ML model trained on N, P, K, temperature, humidity, pH, rainfall
  - Predicts best crop with confidence score
  - Helps avoid crop loss by recommending crops suited to conditions

---

## 15. 5-Day Weather Forecast
- **Endpoint:** `POST /api/forecast`
- **File:** `mlbackend/main.py`, `mlbackend/services.py`
- **PS08 Requirements Covered:** R1
- **Description:**
  - 5-day / 3-hour agricultural forecast from OpenWeather API
  - Used by crop risk engine for proactive threat detection

---

## 16. Translation Service
- **File:** `mlbackend/services.py`
- **PS08 Requirements Covered:** Usability
- **Description:**
  - Google Translate integration via deep-translator
  - Chunks long text into ≤4500 char pieces for API limits
  - Retry logic with graceful fallback
  - All modules use this to deliver advice in regional languages

---

## 17. Soil Data API (ISRIC SoilGrids)
- **File:** `mlbackend/services.py`
- **PS08 Requirements Covered:** R3
- **Description:**
  - Fetches multi-layer soil data from ISRIC SoilGrids v2 global database
  - Properties: Nitrogen, pH, Organic Carbon, Clay, Sand, Silt
  - Provides real-world soil condition data for location-based guidance

---

## 18. Telegram Webhook (Farmer Registration)
- **Endpoint:** `POST /api/telegram/webhook`
- **File:** `mlbackend/main.py`
- **PS08 Requirements Covered:** Usability
- **Description:**
  - Farmers message the bot with `/start +91XXXXXXXXXX` to link their phone
  - Links Telegram chat ID to Supabase farmer profile
  - Enables automated alert delivery via Telegram

---

## 19. Additional Features (Beyond PS08 Scope)

These features exist in the backend but are NOT related to crop protection:

| Feature | Endpoint | File |
|---------|----------|------|
| Market Price Tracker | `GET /api/market-prices` | `mlbackend/market_service.py` |
| Governance Feed | `POST /api/governance-feed` | `mlbackend/main.py` |
| Scheme Document Drafter | `POST /api/scheme-draft` | `mlbackend/main.py` |
| Contract Audit | `POST /api/contract-audit` | `mlbackend/main.py` |
| Subsidy Matcher | `POST /api/subsidy-match` | `mlbackend/main.py` |
| Dispute Advisor | `POST /api/dispute-advice` | `mlbackend/main.py` |

---

---

# ❌ SECTION 2: MISSING FEATURES & REQUIREMENTS (Not Yet Implemented)

These features are required by PS08 but are **not present** in the current backend.

---

## 🔴 CRITICAL GAPS

### 1. Bird Threat Protection Module — MISSING
- **PS08 Requirement:** "protect crops from pests, **birds**, animals"
- **Status:** ❌ Not implemented
- **What's Needed:**
  - Bird species identification (crows, parrots, sparrows, pigeons, mynas)
  - Crop-specific bird damage patterns (e.g., grain-eating birds during ripening)
  - Prevention methods: bird nets, reflective tape, scarecrows, ultrasonic deterrents, bird spikes
  - Seasonal bird migration awareness and timing-based alerts
  - Safe, humane, and legal deterrent recommendations

### 2. Animal Intrusion Protection Module — MISSING
- **PS08 Requirement:** "protect crops from pests, birds, **animals**"
- **Status:** ❌ Not implemented
- **What's Needed:**
  - Wild animal threat identification (wild boar, nilgai, elephants, monkeys, stray cattle, deer, rats/rodents)
  - Region-specific animal threat mapping (elephants in Kerala/Assam, nilgai in Rajasthan, monkeys in UP)
  - Fencing recommendations (electric, barbed wire, live hedges, trenches)
  - Non-lethal deterrents (chili fences, light/sound systems, guard dogs)
  - Government compensation scheme info for wildlife crop damage
  - Emergency helpline numbers for wildlife departments

---

## 🟡 MEDIUM GAPS

### 3. Image-Based Crop Disease Diagnosis — MISSING
- **PS08 Requirement:** "let users identify the kind of problem they are facing"
- **Status:** ❌ Not implemented (currently text-only symptom input)
- **What's Needed:**
  - Photo upload endpoint for leaf/pest/disease images
  - CNN/Vision model for plant disease classification (e.g., PlantVillage dataset)
  - OR integration with Google Gemini Vision / GPT-4V for image analysis
  - Return identified disease + confidence score + treatment

### 4. Expanded Pest/Disease Library — INCOMPLETE
- **Current State:** Only 5 crops in `PEST_LIBRARY` (rice, wheat, cotton, maize, tomato)
- **What's Needed:**
  - Expand to 20+ crops: sugarcane, soybean, groundnut, chickpea, mustard, potato, onion, chili, brinjal, okra, banana, mango, grapes, coconut, tea, coffee, turmeric, ginger, etc.
  - Add more pest/disease entries per crop (currently 2–3 per crop, should be 8–10)
  - Include region-specific pest prevalence data

### 5. Season/Calendar-Based Threat Classification — MISSING
- **PS08 Requirement:** "classify issues by crop type, **season**, or field condition"
- **Status:** ❌ Not implemented
- **What's Needed:**
  - Kharif (June–Oct), Rabi (Oct–Mar), Zaid (Mar–Jun) season tagging
  - Season-specific pest/disease calendars
  - Monthly pest activity forecasts
  - Sowing-to-harvest timeline with threat windows

### 6. Historical Outbreak Tracking & Pattern Analysis — MISSING
- **Status:** ❌ Not implemented
- **What's Needed:**
  - Database of past pest/disease outbreaks per region
  - Trend analysis: recurring threats in specific months/locations
  - Early warning based on historical patterns
  - Integration with ICAR / State Agriculture Department outbreak data

---

## 🟢 LOW-PRIORITY GAPS

### 7. Community/Crowdsourced Threat Reporting — MISSING
- **Status:** ❌ Not implemented
- **What's Needed:**
  - Endpoint for farmers to report pest/disease sightings
  - Nearby farmer notification when an outbreak is reported in the area
  - Heatmap of active threats by region
  - Verification mechanism to prevent false reports

### 8. Organic/IPM-First Recommendations — PARTIAL
- **Current State:** Pest service recommends chemicals primarily, organic options mentioned secondarily
- **What's Needed:**
  - Integrated Pest Management (IPM) as the default recommendation tier
  - Organic-first approach: neem oil, pheromone traps, biocontrol agents listed before chemicals
  - Chemical pesticides as last resort with safety warnings and waiting periods
  - Safety gear instructions for chemical application

### 9. Crop Protection Cost Calculator — MISSING
- **Status:** ❌ Not implemented
- **What's Needed:**
  - Estimate cost of protection measures (pesticides, nets, fencing)
  - Compare cost vs. potential crop loss
  - Help farmers make informed economic decisions about protection

---

---

# 📊 SUMMARY TABLE

| Category | Count |
|----------|-------|
| **Total Existing Features** | 19 (including 6 beyond PS08 scope) |
| **PS08-Relevant Existing Features** | 13 |
| **Total API Endpoints** | 20+ |
| **Backend Service Files** | 12 |
| **Critical Missing Features** | 2 (Bird Protection, Animal Protection) |
| **Medium Missing Features** | 4 (Image Diagnosis, Expanded Pest Library, Season Classification, Historical Tracking) |
| **Low-Priority Missing Features** | 3 (Community Reporting, IPM-First, Cost Calculator) |

---

## 🛠️ Tech Stack

| Component | Technology |
|-----------|-----------|
| Backend Framework | FastAPI (Python) |
| AI/LLM | Groq (Llama-3.3-70B) → Gemini 1.5 Flash (fallback) |
| ML Model | scikit-learn RandomForest (model.joblib) |
| Database | Supabase (PostgreSQL) |
| Weather API | OpenWeather |
| Soil Data | ISRIC SoilGrids v2 |
| Satellite | Sentinel Hub (Sentinel-2 L2A) |
| Market Prices | data.gov.in (Agmarknet) |
| Notifications | Twilio (SMS/Voice) + Telegram Bot |
| Voice TTS | gTTS (Google Text-to-Speech) |
| Translation | deep-translator (Google Translate) |
| Geocoding | OpenStreetMap Nominatim |
| Frontend | Next.js (React) |

---

## 📁 Files Included in This Package

```
agrisaathi-ps08-features/
├── PS08_FEATURES_README.md    ← This file
├── mlbackend/
│   ├── main.py                ← All 13 modules + endpoints
│   ├── config.py              ← Environment configuration
│   ├── llm_service.py         ← AI/LLM integration
│   ├── pest_service.py        ← Pest & Disease Engine
│   ├── fertilizer_service.py  ← Fertilizer Optimization
│   ├── soil_service.py        ← Soil Health Analysis
│   ├── yield_service.py       ← Yield Prediction
│   ├── rotation_service.py    ← Crop Rotation Planner
│   ├── market_service.py      ← Market Prices
│   ├── satellite_service.py   ← Satellite Monitoring
│   ├── notification_service.py← Alert Dispatch
│   ├── services.py            ← Weather, Soil, Translation, Geo-Lang
│   ├── twilio_ivr.py          ← Voice IVR
│   ├── train_model.py         ← ML Model Training
│   ├── __init__.py            ← Package init
│   └── requirements.txt       ← Python dependencies
├── requirements.txt           ← Root Python dependencies
├── package.json               ← Node.js dependencies
└── README.md                  ← Original project README
```
