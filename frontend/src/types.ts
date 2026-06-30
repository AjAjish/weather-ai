export interface WeatherData {
  city: string;
  temperature: number;
  feels_like: number;
  humidity: number;
  weather: string;
  wind_speed: number;
}

export interface AIResponse {
  response: string;
}
