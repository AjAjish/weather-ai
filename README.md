<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://img.shields.io/badge/●-Live-22C55E?style=flat-square">
    <img src="https://img.shields.io/badge/●-Live-22C55E?style=flat-square" alt="Live" width="80">
  </picture>
</p>

<h1 align="center" style="font-size: 3rem; font-weight: 800; line-height: 1.1; letter-spacing: -0.03em; margin: 0.5rem 0;">
  Weather<span style="color: #22C55E;">AI</span>
</h1>

<p align="center" style="font-size: 1.1rem; color: #64748B; max-width: 520px; margin: 0 auto 1.5rem auto; line-height: 1.6;">
  Real-time weather conditions with <strong style="color: #22C55E;">AI-powered insights</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/FastAPI-009688?style=flat-square&logo=fastapi&logoColor=white" alt="FastAPI">
  <img src="https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=react&logoColor=black" alt="React">
  <img src="https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white" alt="Tailwind CSS">
  <img src="https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white" alt="Vite">
  <img src="https://img.shields.io/badge/Python-3776AB?style=flat-square&logo=python&logoColor=white" alt="Python">
  <img src="https://img.shields.io/badge/license-MIT-0F172A?style=flat-square" alt="License">
</p>

<p align="center" style="margin-top: 2rem;">
  A modern full-stack weather dashboard that delivers real-time conditions and intelligent analysis through OpenWeather and OpenRouter AI.
</p>

<br>

---

## Features

- **Live Weather Data** — Real-time temperature, humidity, wind speed, and conditions
- **AI-Powered Insights** — Natural language analysis of current weather via OpenRouter
- **Interactive Cards** — Click any metric (Humidity, Wind, etc.) for detailed explanations
- **Animated Weather Icons** — Dynamic SVG icons that reflect current conditions
- **Dark / Light Mode** — Persistent theme toggle with smooth transitions
- **Recent Searches** — City history stored locally for quick access
- **Responsive Design** — Optimized for 375px to 1440px viewports
- **Glassmorphism UI** — Modern frosted glass aesthetic with backdrop blur

---

## Architecture

```
weather-ai/
├── backend/                  # FastAPI Python server
│   ├── app.py                # Application entry point
│   ├── config.py             # Environment configuration
│   ├── requirements.txt      # Python dependencies
│   └── routes/
│       ├── weather.py        # OpenWeather API integration
│       └── ai.py             # OpenRouter AI integration
│
├── frontend/                 # React + Vite SPA
│   ├── src/
│   │   ├── components/       # UI components
│   │   │   ├── Navbar.tsx
│   │   │   ├── SearchBar.tsx
│   │   │   ├── WeatherCard.tsx
│   │   │   └── AIExplain.tsx
│   │   ├── api.ts            # HTTP client
│   │   ├── types.ts          # TypeScript types
│   │   ├── App.tsx           # Root component
│   │   ├── index.css         # Tailwind + design tokens
│   │   └── main.tsx          # Entry point
│   ├── index.html
│   ├── vite.config.ts
│   └── package.json
│
└── README.md
```

---

## Getting Started

### Prerequisites

| Tool | Version |
|------|---------|
| Python | 3.11+ |
| Node.js | 18+ |
| npm | 9+ |

### 1. Clone & Install

```bash
git clone https://github.com/yourusername/weather-ai.git
cd weather-ai
```

#### Backend

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate    # Windows
source .venv/bin/activate # macOS / Linux
pip install -r requirements.txt
```

#### Frontend

```bash
cd frontend
npm install
```

### 2. Set Environment Variables

Copy `.env` in `backend/` and fill in your keys:

```env
# Required
OPENROUTER_API_KEY=sk-or-v1-...
OPEN_WEATHER_API_KEY=your_key_here

# Optional defaults
OPEN_WEATHER_BASE_URL=https://api.openweathermap.org/data/2.5/weather
OPENROUTER_URL=https://openrouter.ai/api/v1/chat/completions
OPENROUTER_MODEL=openrouter/free
CORS_ORIGINS=http://localhost:5173
```

<details>
<summary>Where to get API keys</summary>

| Service | Sign Up |
|---------|---------|
| **OpenWeather** | [openweathermap.org](https://openweathermap.org/api) |
| **OpenRouter** | [openrouter.ai](https://openrouter.ai/keys) |
</details>

### 3. Run Locally

Start both servers in separate terminals:

```bash
# Terminal 1 — Backend (http://localhost:8000)
cd backend
uvicorn app:app --reload --port 8000

# Terminal 2 — Frontend (http://localhost:5173)
cd frontend
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

---

## Deployment

### Backend → Render

| Setting | Value |
|---------|-------|
| Service | Web Service |
| Runtime | Python 3 |
| Build | `pip install -r requirements.txt` |
| Start | `uvicorn app:app --host 0.0.0.0 --port $PORT` |
| Env vars | `OPENROUTER_API_KEY`, `OPEN_WEATHER_API_KEY`, `CORS_ORIGINS` (include your Vercel URL) |

### Frontend → Vercel

| Setting | Value |
|---------|-------|
| Framework | Vite (auto-detected) |
| Build | `npm run build` |
| Output | `dist` |
| Env var | `VITE_API_URL` → `https://your-backend.onrender.com` |

> **Important:** Set `VITE_API_URL` in Vercel project settings (not in `.env` in repo).  
> The Vite dev proxy (`vite.config.ts`) is for local development only.

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React 19, TypeScript, Vite 8, Tailwind CSS 4 |
| **Backend** | Python 3.11, FastAPI, Uvicorn |
| **APIs** | OpenWeather, OpenRouter (DeepSeek) |
| **Icons** | Lucide React |
| **Font** | Plus Jakarta Sans |

---

## Project Details

- **Components**: `Navbar` (glass floating), `SearchBar` (local recent history), `WeatherCard` (animated SVG icons, progress bars, info popovers), `AIExplain` (typewriter effect)
- **Design**: Glassmorphism, green accent (#22C55E), dark mode (OLED #020617), responsive grid
- **Animations**: 9 custom keyframes (fade, float, glow, rain, snow, cloud drift, sun rotate, pulse dots, slide-down)
- **Accessibility**: `prefers-reduced-motion`, focus states, aria labels, keyboard navigation

---

## Contact

<p align="left">
  <a href="mailto:abiajish2202@gmail.com">
    <img src="https://img.shields.io/badge/abiajish2202@gmail.com-EA4335?style=flat-square&logo=gmail&logoColor=white" alt="Email">
  </a>
  <a href="https://github.com/AjAjish">
    <img src="https://img.shields.io/badge/github.com/AjAjish-181717?style=flat-square&logo=github&logoColor=white" alt="GitHub">
  </a>
  <a href="https://linkedin.com/in/ajish-aj">
    <img src="https://img.shields.io/badge/in%2Fajish--aj-0A66C2?style=flat-square&logo=linkedin&logoColor=white" alt="LinkedIn">
  </a>
</p>

---

## License

MIT
