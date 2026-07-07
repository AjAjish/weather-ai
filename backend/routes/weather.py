from datetime import datetime

from fastapi import HTTPException ,APIRouter
import httpx
from routes.ai import get_ai_response
from config import config

BASE_URL = config.OPEN_WEATHER_BASE_URL
FORECAST_URL = config.OPEN_WEATHER_FORECAST_URL
API_KEY = config.OPEN_WEATHER_API_KEY
weather_router = APIRouter()

latest_weather = None
temp_city = None

@weather_router.get("/weather")
async def get_weather(city: str):

    global temp_city
    global latest_weather

    params = {
        "q": city,
        "appid": API_KEY,
        "units": "metric"
    }

    async with httpx.AsyncClient() as client:
        response = await client.get(BASE_URL, params=params)

    if response.status_code != 200:
        raise HTTPException(status_code=response.status_code, detail=response.json())

    data = response.json()

    coord = data.get("coord", {})

    latest_weather = {
            "city": data.get("name"),
            "temperature": data.get("main", {}).get("temp"),
            "min_temperature": data.get("main", {}).get("temp_min"),
            "max_temperature": data.get("main", {}).get("temp_max"),
            "feels_like": data.get("main", {}).get("feels_like"),
            "humidity": data.get("main", {}).get("humidity"),
            "pressure": data.get("main", {}).get("pressure"),
            "weather": data.get("weather", [{}])[0].get("description"),
            "wind_speed": data.get("wind", {}).get("speed"),
            "wind_deg": data.get("wind", {}).get("deg"),
            "clouds": data.get("clouds", {}).get("all"),
            "rain_probability": data.get("pop", 0),
            "lat": coord.get("lat"),
            "lon": coord.get("lon"),
        }

    temp_city = latest_weather["city"]
    
    return latest_weather

@weather_router.get("/explain_weather")
async def explain_weather():
    if latest_weather is None:
        raise HTTPException(status_code=404, detail="No weather data available. Please fetch weather data first.")

    request = f"Explain the following weather data: {latest_weather}"
    ai_response = await get_ai_response(request)
    return ai_response

@weather_router.get("/weekly_forecast")
async def get_weekly_forecast(city: str = None):
    city_name = city or temp_city
    if city_name is None:
        raise HTTPException(status_code=404, detail="No city specified. Please fetch weather data first.")

    params = {
        "q": city_name,
        "appid": API_KEY,
        "units": "metric",
    }

    async with httpx.AsyncClient() as client:

        weather_response = await client.get(
            FORECAST_URL,
            params=params,
        )

        if weather_response.status_code != 200:
            raise HTTPException(status_code=weather_response.status_code, detail=weather_response.json())

        data = weather_response.json()

        weekly_forecast = []

        for item in data.get("list", []):
            data_txt = item.get("dt_txt", "")

            if "12:00:00" in data_txt:

                weekly_forecast.append(
                    {
                        "date": datetime.fromtimestamp(item["dt"]).strftime("%Y-%m-%d"),
                        "temperature": item["main"]["temp"],
                        "min_temperature": item["main"]["temp_min"],
                        "max_temperature": item["main"]["temp_max"],
                        "feels_like": item["main"]["feels_like"],
                        "humidity": item["main"]["humidity"],
                        "pressure": item["main"]["pressure"],
                        "weather": item["weather"][0]["description"],
                        "wind_speed": item["wind"]["speed"],
                        "wind_deg": item["wind"]["deg"],
                        "clouds": item["clouds"]["all"],
                        "rain_probability": item.get("pop", 0),
                    }
                )

        if not weekly_forecast:
            for item in data.get("list", []):
                weekly_forecast.append(
                    {
                        "date": datetime.fromtimestamp(item["dt"]).strftime("%Y-%m-%d"),
                        "temperature": item["main"]["temp"],
                        "min_temperature": item["main"]["temp_min"],
                        "max_temperature": item["main"]["temp_max"],
                        "feels_like": item["main"]["feels_like"],
                        "humidity": item["main"]["humidity"],
                        "pressure": item["main"]["pressure"],
                        "weather": item["weather"][0]["description"],
                        "wind_speed": item["wind"]["speed"],
                        "wind_deg": item["wind"]["deg"],
                        "clouds": item["clouds"]["all"],
                        "rain_probability": item.get("pop", 0),
                    }
                )

    return weekly_forecast