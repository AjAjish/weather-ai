from fastapi import APIRouter, HTTPException
import httpx
from config import config

BASE_URL = config.OPENROUTER_URL
MODEL = config.OPENROUTER_MODEL
API_KEY = config.OPENROUTER_API_KEY
HEADER = {
    "Authorization": f"Bearer {API_KEY}",
    "Content-Type": "application/json",
}
SYSTEM_PROMPT = config.SYSTEM_PROMPT
AI_TIMEOUT = httpx.Timeout(45.0, connect=10.0)

ai_router = APIRouter()


@ai_router.post("/ai")
async def get_ai_response(request: str):
    payload = {
        "model": MODEL,
        "messages": [
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": request},
        ],
    }

    try:
        async with httpx.AsyncClient(timeout=AI_TIMEOUT) as client:
            response = await client.post(BASE_URL, json=payload, headers=HEADER)
    except httpx.TimeoutException as exc:
        raise HTTPException(
            status_code=504,
            detail="The AI service took too long to respond. Please try again.",
        ) from exc
    except httpx.RequestError as exc:
        raise HTTPException(
            status_code=502,
            detail="The AI service could not be reached. Please try again later.",
        ) from exc

    if response.status_code != 200:
        try:
            detail = response.json()
        except ValueError:
            detail = response.text or "The AI service returned an error."
        raise HTTPException(status_code=response.status_code, detail=detail)

    try:
        data = response.json()
    except ValueError as exc:
        raise HTTPException(
            status_code=502,
            detail="The AI service returned an invalid response.",
        ) from exc

    ai_response = data.get("choices", [{}])[0].get("message", {}).get("content", "")
    if not ai_response:
        raise HTTPException(
            status_code=502,
            detail="The AI service returned no explanation.",
        )

    return {"response": ai_response}
