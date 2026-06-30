import type { WeatherData, AIResponse } from './types';

const BASE = import.meta.env.VITE_API_URL ?? '';

export async function fetchWeather(city: string): Promise<WeatherData> {
  const res = await fetch(`${BASE}/weather?city=${encodeURIComponent(city)}`);
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: 'Failed to fetch weather' }));
    throw new Error(err.detail ?? `HTTP ${res.status}`);
  }
  return res.json();
}

export async function explainWeather(): Promise<AIResponse> {
  const res = await fetch(`${BASE}/explain_weather`);
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: 'No weather data available' }));
    throw new Error(err.detail ?? `HTTP ${res.status}`);
  }
  return res.json();
}
