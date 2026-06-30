from fastapi import APIRouter, HTTPException
import httpx
from config import config

BASE_URL = config.OPENROUTER_URL
MODEL = config.OPENROUTER_MODEL
API_KEY = config.OPENROUTER_API_KEY
HEADER = {
    "Authorization": f"Bearer {API_KEY}",
    "Content-Type": "application/json"
}
SYSTEM_PROMPT = config.SYSTEM_PROMPT

ai_router = APIRouter()

@ai_router.post("/ai")
async def get_ai_response(request: str):
    payload = {
        "model": MODEL,
        "messages": [
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": request}
        ]
    }

    async with httpx.AsyncClient() as client:
        response = await client.post(BASE_URL, json=payload, headers=HEADER)

    if response.status_code != 200:
        raise HTTPException(status_code=response.status_code, detail=response.json())

    data = response.json()
    ai_response = data.get("choices", [{}])[0].get("message", {}).get("content", "")
    return {"response": ai_response}
