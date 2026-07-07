import { useState, useCallback } from 'react';
import { CloudSun, MapPin, Globe } from 'lucide-react';
import Navbar from './components/Navbar';
import SearchBar from './components/SearchBar';
import WeatherCard from './components/WeatherCard';
import AIExplain from './components/AIExplain';
import WeeklyForecastChart from './components/WeeklyForecastChart';
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
  const [transitioning, setTransitioning] = useState(false);

  const [forecast, setForecast] = useState<ForecastData | null>(null);
  const [forecastLoading, setForecastLoading] = useState(false);
  const [forecastError, setForecastError] = useState<string | null>(null);

  const handleSearch = useCallback(async (city: string) => {
    setTransitioning(true);
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
      setTimeout(() => setTransitioning(false), 400);
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
      <div className="min-h-screen bg-bg dark:bg-bg-dark transition-colors duration-500 relative">
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-accent/5 dark:bg-accent/3 rounded-full blur-3xl animate-float" style={{ animationDuration: '8s' }} />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-500/5 dark:bg-blue-500/3 rounded-full blur-3xl animate-float" style={{ animationDuration: '10s', animationDelay: '2s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/[0.02] dark:bg-accent/[0.01] rounded-full blur-3xl" />
        </div>

        <Navbar dark={dark} onToggleDark={() => setDark((d) => !d)} />

        <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28 pb-10 sm:pb-14 relative">
          <div className="max-w-2xl mx-auto text-center mb-8 sm:mb-12" style={{ animation: 'fade-in-up 0.6s ease-out both' }}>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/10 dark:bg-accent/15 border border-accent/20 text-xs font-semibold text-accent mb-4 sm:mb-5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-accent" />
              </span>
              Live weather
            </div>

            <div className="relative inline-flex mb-5 sm:mb-6">
              <div className="absolute inset-0 bg-gradient-to-r from-accent via-accent-light to-blue-400 rounded-2xl blur-xl opacity-30 dark:opacity-40 animate-glow-pulse" />
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-accent/10 via-accent/5 to-blue-400/10 dark:from-accent/20 dark:via-accent/10 dark:to-blue-400/10 flex items-center justify-center shadow-sm backdrop-blur-sm border border-white/50 dark:border-white/10">
                <CloudSun className="w-8 h-8 sm:w-10 sm:h-10 text-accent" />
              </div>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1]">
              <span className="bg-gradient-to-r from-text dark:text-text-dark via-text/90 dark:via-text-dark/90 to-text/80 dark:to-text-dark/80 bg-clip-text text-transparent">
                Weather Dashboard
              </span>
            </h1>

            <p className="text-sm sm:text-base text-subtext dark:text-subtext-dark mt-3 sm:mt-4 max-w-lg mx-auto leading-relaxed font-medium">
              Real-time weather conditions with{' '}
              <span className="text-accent relative inline-block">
                AI-powered insights
                <span className="absolute -bottom-0.5 left-0 right-0 h-[2px] bg-accent/30 rounded-full" />
              </span>
            </p>
          </div>

          <div className="max-w-2xl mx-auto space-y-5 sm:space-y-6">
            <SearchBar onSearch={handleSearch} loading={weatherLoading} />

            {weatherLoading && (
              <div className="glass-card rounded-2xl" style={{ animation: 'fade-in 0.3s ease-out both' }}>
                <div className="flex flex-col items-center gap-5 py-14 sm:py-16">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent/20 to-accent/10 animate-pulse" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="flex gap-1.5">
                        {[0, 1, 2].map((i) => (
                          <span
                            key={i}
                            className="w-2 h-2 rounded-full bg-accent"
                            style={{
                              animation: 'pulse-dot 1.4s infinite ease-in-out both',
                              animationDelay: `${i * 0.16}s`,
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-bold text-text dark:text-text-dark/80">Fetching weather data</p>
                    <p className="text-xs text-subtext dark:text-subtext-dark mt-1">
                      {lastSearched ? `Searching ${lastSearched}...` : 'Please wait...'}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {weatherError && !weatherLoading && (
              <div className="glass-card rounded-2xl" style={{ animation: 'fade-in-up 0.4s ease-out both' }}>
                <div className="flex flex-col items-center gap-4 py-12 sm:py-14 px-6 text-center">
                  <div className="w-14 h-14 rounded-2xl bg-red-50 dark:bg-red-500/10 flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-red-400" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-red-500">City not found</p>
                    <p className="text-xs sm:text-sm text-subtext dark:text-subtext-dark mt-1 max-w-xs mx-auto">
                      {weatherError}. Please check the city name and try again.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {weather && !weatherLoading && (
              <div className={transitioning ? 'opacity-50 scale-[0.98] transition-all duration-300' : 'opacity-100 scale-100 transition-all duration-300'}>
                <div className="space-y-5 sm:space-y-6">
                  <WeatherCard data={weather} />
                  <WeeklyForecastChart
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
              </div>
            )}

            {!weather && !weatherLoading && !weatherError && (
              <div className="glass-card rounded-2xl" style={{ animation: 'fade-in-up 0.5s ease-out both' }}>
                <div className="flex flex-col items-center gap-5 py-16 sm:py-20 px-6 text-center">
                  <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-accent/5 to-accent/[0.02] dark:from-accent/10 dark:to-accent/5 flex items-center justify-center group hover:scale-110 transition-all duration-500 cursor-default">
                    <Globe className="w-9 h-9 text-accent/30 dark:text-accent/20 group-hover:text-accent/50 transition-colors duration-500" />
                  </div>
                  <div className="max-w-sm">
                    <p className="text-base sm:text-lg font-bold text-text dark:text-text-dark/80">
                      Discover the weather
                    </p>
                    <p className="text-xs sm:text-sm text-subtext dark:text-subtext-dark mt-2 leading-relaxed">
                      Enter a city name above to get current weather conditions and AI-powered insights
                    </p>
                  </div>
                  <div className="flex flex-wrap justify-center gap-2 mt-2">
                    {['London', 'Tokyo', 'Paris', 'New York', 'Dubai'].map((city, i) => (
                      <button
                        key={city}
                        onClick={() => handleSearch(city)}
                        className="px-4 py-2 rounded-xl bg-muted dark:bg-muted-dark hover:bg-accent/10 dark:hover:bg-accent/10 hover:text-accent text-xs sm:text-sm font-semibold text-subtext dark:text-subtext-dark transition-all duration-200 cursor-pointer hover:scale-105 active:scale-95"
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
            <p className="text-[10px] sm:text-xs font-medium text-subtext/50 dark:text-subtext-dark/30 tracking-wide">
              Powered by OpenWeather &bull; OpenRouter AI &bull; WeatherAI
            </p>
          </footer>
        </main>
      </div>
    </div>
  );
}

export default App;
