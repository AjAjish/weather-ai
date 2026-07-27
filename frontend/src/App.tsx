import { useState, useCallback } from 'react';
import Navbar from './components/Navbar';
import SearchBar from './components/SearchBar';
import WeatherCard from './components/WeatherCard';
import AIExplain from './components/AIExplain';
import WeeklyForecastCarousel from './components/WeeklyForecastCarousel';
import { fetchWeather, fetchWeeklyForecast, explainWeather } from './api';
import type { WeatherData, ForecastData } from './types';

function App() {
  const [dark, setDark] = useState(false);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [weatherError, setWeatherError] = useState<string | null>(null);
  const [lastSearched, setLastSearched] = useState('');
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);

  const [forecast, setForecast] = useState<ForecastData | null>(null);
  const [forecastLoading, setForecastLoading] = useState(false);
  const [forecastError, setForecastError] = useState<string | null>(null);

  const handleSearch = useCallback(async (city: string) => {
    setWeatherLoading(true);
    setWeatherError(null);
    setAiResponse(null);
    setForecast(null);
    setForecastError(null);
    setLastSearched(city);
    try {
      const data = await fetchWeather(city);
      setWeather(data);

      setForecastLoading(true);
      fetchWeeklyForecast(city)
        .then(setForecast)
        .catch((err) => setForecastError(err instanceof Error ? err.message : 'Failed to load forecast'))
        .finally(() => setForecastLoading(false));
    } catch (err) {
      setWeatherError(err instanceof Error ? err.message : 'Something went wrong');
      setWeather(null);
    } finally {
      setWeatherLoading(false);
    }
  }, []);

  const handleExplain = useCallback(async () => {
    setAiLoading(true);
    setAiResponse(null);
    try {
      const data = await explainWeather();
      setAiResponse(data.response);
    } catch (err) {
      setAiResponse(err instanceof Error ? err.message : 'Failed to get AI explanation');
    } finally {
      setAiLoading(false);
    }
  }, []);

  return (
    <div className={dark ? 'dark' : ''}>
      <div className="min-h-screen bg-[var(--color-bg)] transition-colors duration-300">
        <Navbar dark={dark} onToggleDark={() => setDark((d) => !d)} />

        <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-24 pb-10 sm:pb-14">
          <div className="max-w-2xl mx-auto text-center mb-8 sm:mb-12 animate-fade-in-up">
            <h1 className="md-headline-large text-[var(--color-on-surface)] font-normal tracking-tight">
              WeatherAI
            </h1>
            <p className="md-body-large text-[var(--color-on-surface-variant)] mt-3 sm:mt-4 max-w-lg mx-auto leading-relaxed">
              Real-time weather conditions with AI-powered insights
            </p>
          </div>

          <div className="max-w-2xl mx-auto space-y-5 sm:space-y-6">
            <SearchBar onSearch={handleSearch} loading={weatherLoading} />

            {weatherLoading && (
              <div className="md-card elevation-1 p-8 text-center animate-fade-in">
                <div className="flex flex-col items-center gap-4">
                  <div className="flex gap-2">
                    {[0, 1, 2].map((i) => (
                      <span
                        key={i}
                        className="w-2 h-2 rounded-full bg-[var(--color-primary)]"
                        style={{
                          animation: 'pulse-dot 1.4s infinite ease-in-out both',
                          animationDelay: `${i * 0.16}s`,
                        }}
                      />
                    ))}
                  </div>
                  <div className="text-center">
                    <p className="md-title-small text-[var(--color-on-surface)]">Fetching weather data</p>
                    <p className="md-body-small text-[var(--color-on-surface-variant)] mt-1">
                      {lastSearched ? `Searching ${lastSearched}...` : 'Please wait...'}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {weatherError && !weatherLoading && (
              <div className="md-card elevation-1 p-6 text-center animate-fade-in-up">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-[var(--color-error-container)] flex items-center justify-center">
                    <svg className="w-6 h-6 text-[var(--color-error)]" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
                  </div>
                  <div>
                    <p className="md-title-medium text-[var(--color-error)]">City not found</p>
                    <p className="md-body-small text-[var(--color-on-surface-variant)] mt-1 max-w-xs mx-auto">
                      {weatherError}. Please check the city name and try again.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {weather && !weatherLoading && (
              <div className="space-y-5 sm:space-y-6 animate-fade-in-up">
                <WeatherCard data={weather} />
                <WeeklyForecastCarousel
                  forecast={forecast}
                  loading={forecastLoading}
                  error={forecastError}
                />
                <AIExplain
                  onExplain={handleExplain}
                  loading={aiLoading}
                  response={aiResponse}
                  hasWeather={true}
                />
              </div>
            )}

            {!weather && !weatherLoading && !weatherError && (
              <div className="md-card elevation-1 p-8 text-center animate-fade-in-up">
                <div className="flex flex-col items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-[var(--color-primary-container)] flex items-center justify-center">
                    <svg className="w-8 h-8 text-[var(--color-on-primary-container)]" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/></svg>
                  </div>
                  <div className="max-w-sm">
                    <p className="md-title-large text-[var(--color-on-surface)]">
                      Discover the weather
                    </p>
                    <p className="md-body-medium text-[var(--color-on-surface-variant)] mt-2 leading-relaxed">
                      Enter a city name above to get current weather conditions and AI-powered insights
                    </p>
                  </div>
                  <div className="flex flex-wrap justify-center gap-2 mt-2">
                    {['New York', 'London', 'Tokyo', 'Paris', 'Dubai', 'Sydney'].map((city, i) => (
                      <button
                        key={city}
                        onClick={() => handleSearch(city)}
                        className="md-chip"
                        style={{ animation: `fade-in-up 0.3s ease-out ${0.5 + i * 0.07}s both` }}
                      >
                        {city}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          <footer className="max-w-2xl mx-auto mt-12 sm:mt-14 text-center">
            <p className="md-label-small text-[var(--color-on-surface-variant)]/60 tracking-wide">
              Powered by Ajish A J
            </p>
          </footer>
        </main>
      </div>
    </div>
  );
}

export default App;