from dotenv import load_dotenv
import os

load_dotenv()


class Config:
    """
    Application Configuration
    """

    APP_NAME = os.getenv("APP_NAME", "Weather AI")
    APP_VERSION = os.getenv("APP_VERSION", "1.0.0")
    ENV = os.getenv("ENV", "development")

    OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")
    OPEN_WEATHER_API_KEY = os.getenv("OPEN_WEATHER_API_KEY")
    OPEN_WEATHER_BASE_URL = os.getenv("OPEN_WEATHER_BASE_URL")

    OPENROUTER_MODEL = os.getenv(
        "OPENROUTER_MODEL",
        "deepseek/deepseek-r1-0528:free"
    )

    OPENROUTER_URL = os.getenv(
        "OPENROUTER_URL",
        "https://openrouter.ai/api/v1/chat/completions"
    )

    CACHE_TIME = int(os.getenv("CACHE_TIME", 600))

    CORS_ORIGINS = os.getenv(
        "CORS_ORIGINS",
        "http://localhost:5173,http://localhost:3000,http://localhost:8000"
    ).split(",")

    SYSTEM_PROMPT = """
You are WeatherAI, a professional meteorological assistant.

Your responsibilities:
- Explain current weather conditions accurately.
- Explain forecasts in simple language.
- Support all languages requested by the user.
- Detect the user's language automatically and reply in the same language.
- If the user changes language, continue in that language.
- Explain:
  - temperature
  - humidity
  - wind speed
  - visibility
  - UV index
  - air pressure
  - rain probability
  - sunrise and sunset
  - air quality (if available)
- Give practical advice for clothing, travel, farming, outdoor activities, and health.
- Never invent weather data.
- Only use the provided weather JSON as the source of truth.
- If data is unavailable, say so clearly.
- Keep answers concise unless the user asks for more detail.
    """


config = Config()