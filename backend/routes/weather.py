from fastapi import HTTPException ,APIRouter
import httpx
from routes.ai import get_ai_response
from config import config

BASE_URL = config.OPEN_WEATHER_BASE_URL
API_KEY = config.OPEN_WEATHER_API_KEY
weather_router = APIRouter()

latest_weather = None

@weather_router.get("/weather")
async def get_weather(city: str):

    global latest_weather

    params = {
        "q": city,
        "appid": API_KEY,
        "units": "metric"
    }

    async with httpx.AsyncClient() as client:
        response = await client.get(BASE_URL, params=params)

    if response.status_code != 200:
        return HTTPException(status_code=response.status_code, detail=response.json())

    data = response.json()

    latest_weather = {
            "city": data.get("name"),
            "temperature": data.get("main", {}).get("temp"),
            "feels_like": data.get("main", {}).get("feels_like"),
            "humidity": data.get("main", {}).get("humidity"),
            "weather": data.get("weather", [{}])[0].get("description"),
            "wind_speed": data.get("wind", {}).get("speed")
        }
    
    return latest_weather

@weather_router.get("/explain_weather")
async def explain_weather():
    if latest_weather is None:
        raise HTTPException(status_code=404, detail="No weather data available. Please fetch weather data first.")

    request = f"Explain the following weather data: {latest_weather}"
    ai_response = await get_ai_response(request)
    return ai_response