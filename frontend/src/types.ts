export interface WeatherData {
  city: string;
  temperature: number;
  min_temperature: number;
  max_temperature: number;
  feels_like: number;
  humidity: number;
  pressure: number;
  weather: string;
  wind_speed: number;
  wind_deg: number;
  clouds: number;
  rain_probability: number;
  lat: number;
  lon: number;
}

export interface DayForecast {
  date: string;
  temperature: number;
  min_temperature: number;
  max_temperature: number;
  feels_like: number;
  humidity: number;
  pressure: number;
  weather: string;
  wind_speed: number;
  wind_deg: number;
  clouds: number;
  rain_probability: number;
}

export type ForecastData = DayForecast[];

export interface AIResponse {
  response: string;
}
