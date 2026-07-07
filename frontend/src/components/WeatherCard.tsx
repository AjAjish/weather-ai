import { useState, useEffect, useRef } from 'react';
import { Thermometer, Droplets, Wind, Gauge, RefreshCw, Info, X, ArrowDown, ArrowUp, CloudSun } from 'lucide-react';
import type { WeatherData } from '../types';

interface WeatherCardProps {
  data: WeatherData;
}

type DetailItemProps = {
  icon: typeof Thermometer;
  label: string;
  value: string | number;
  unit?: string;
  progress?: number;
  delay: number;
  description: string;
};

function DetailPopover({ label, description, onClose }: { label: string; description: string; onClose: () => void }) {
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleEsc);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6" style={{ background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(4px)', animation: 'fade-in 0.2s ease-out both' }}>
      <div
        ref={popoverRef}
        className="glass-card rounded-2xl max-w-sm w-full p-5 sm:p-6 shadow-xl animate-slide-down"
        role="dialog"
        aria-label={`${label} explanation`}
      >
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm sm:text-base font-bold text-text dark:text-text-dark">{label}</h4>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg hover:bg-muted dark:hover:bg-muted-dark flex items-center justify-center transition-colors duration-200 cursor-pointer text-subtext dark:text-subtext-dark"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <p className="text-xs sm:text-sm text-subtext dark:text-subtext-dark leading-relaxed">{description}</p>
        <button
          onClick={onClose}
          className="mt-4 w-full py-2.5 rounded-xl bg-accent hover:bg-accent/90 text-white text-sm font-semibold transition-all duration-200 cursor-pointer active:scale-95"
        >
          Got it
        </button>
      </div>
    </div>
  );
}

function DetailItem({ icon: Icon, label, value, unit, progress, delay, description }: DetailItemProps) {
  const [anim, setAnim] = useState(false);
  const [showPopover, setShowPopover] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setAnim(true), delay + 200);
    return () => clearTimeout(t);
  }, [delay]);

  return (
    <>
      <button
        type="button"
        onClick={() => setShowPopover(true)}
        className="flex flex-col gap-2 p-3 sm:p-4 rounded-xl glass-card hover:bg-white/90 dark:hover:bg-[rgba(15,23,42,0.9)] hover:shadow-md transition-all duration-300 cursor-pointer group w-full text-left relative"
        style={{ animation: `fade-in-up 0.5s ease-out ${delay}ms both` }}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-accent/10 to-accent/5 dark:from-accent/20 dark:to-accent/10 flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:rotate-[-4deg] transition-all duration-300">
            <Icon className="w-[18px] h-[18px] sm:w-5 sm:h-5 text-accent" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <p className="text-[10px] sm:text-xs font-semibold text-subtext dark:text-subtext-dark uppercase tracking-wider">{label}</p>
              <Info className="w-3 h-3 text-subtext/40 dark:text-subtext-dark/30 group-hover:text-accent transition-colors duration-200" />
            </div>
            <p className="text-sm sm:text-base font-bold text-text dark:text-text-dark truncate">
              {value}
              {unit && <span className="text-xs sm:text-sm font-medium text-subtext dark:text-subtext-dark ml-0.5">{unit}</span>}
            </p>
          </div>
        </div>
        {progress !== undefined && (
          <div className="h-1.5 rounded-full bg-muted dark:bg-muted-dark overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-accent to-accent-light transition-all duration-1000 ease-out"
              style={{ width: anim ? `${progress}%` : '0%' }}
            />
          </div>
        )}
      </button>
      {showPopover && (
        <DetailPopover
          label={label}
          description={description}
          onClose={() => setShowPopover(false)}
        />
      )}
    </>
  );
}

const weatherGradients: Record<string, string> = {
  'clear': 'from-amber-400 via-orange-300 to-yellow-200',
  'sunny': 'from-amber-400 via-orange-300 to-yellow-200',
  'cloud': 'from-slate-400 via-slate-500 to-slate-600',
  'overcast': 'from-slate-500 via-slate-600 to-slate-700',
  'rain': 'from-blue-500 via-cyan-400 to-blue-600',
  'drizzle': 'from-blue-400 via-cyan-300 to-blue-500',
  'thunderstorm': 'from-gray-700 via-purple-800 to-gray-800',
  'snow': 'from-blue-100 via-white to-blue-200',
  'mist': 'from-slate-300 via-slate-400 to-slate-500',
  'fog': 'from-slate-400 via-slate-500 to-slate-600',
  'haze': 'from-amber-300 via-yellow-200 to-amber-400',
};

function getWeatherGradient(description: string): string {
  const lower = description.toLowerCase();
  for (const [key, grad] of Object.entries(weatherGradients)) {
    if (lower.includes(key)) return grad;
  }
  return 'from-accent via-accent-light to-blue-400';
}

function AnimatedWeatherIcon({ condition }: { condition: string }) {
  const lower = condition.toLowerCase();

  if (lower.includes('clear') || lower.includes('sunny')) {
    return (
      <svg className="w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 drop-shadow-lg" viewBox="0 0 100 100">
        <defs>
          <radialGradient id="sun-grad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FDE047" />
            <stop offset="100%" stopColor="#F59E0B" />
          </radialGradient>
        </defs>
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
          <line
            key={angle}
            x1="50" y1="8" x2="50" y2="20"
            stroke="#FCD34D"
            strokeWidth="3"
            strokeLinecap="round"
            transform={`rotate(${angle} 50 50)`}
            className="origin-center"
            style={{ animation: `fade-in 0.3s ease-out ${i * 0.05}s both, sun-rotate 12s linear infinite` }}
          />
        ))}
        <circle cx="50" cy="50" r="22" fill="url(#sun-grad)" className="animate-glow-pulse" />
      </svg>
    );
  }

  if (lower.includes('cloud') || lower.includes('overcast')) {
    return (
      <svg className="w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 drop-shadow-lg" viewBox="0 0 100 100">
        <g style={{ animation: 'cloud-drift 6s ease-in-out infinite' }}>
          <ellipse cx="50" cy="58" rx="30" ry="18" fill="#94A3B8" opacity="0.9" />
          <ellipse cx="35" cy="52" rx="18" ry="14" fill="#CBD5E1" opacity="0.9" />
          <ellipse cx="65" cy="54" rx="16" ry="12" fill="#CBD5E1" opacity="0.9" />
          <ellipse cx="50" cy="48" rx="14" ry="10" fill="#E2E8F0" opacity="0.8" />
        </g>
      </svg>
    );
  }

  if (lower.includes('rain') || lower.includes('drizzle')) {
    return (
      <svg className="w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 drop-shadow-lg" viewBox="0 0 100 100">
        <g>
          <ellipse cx="50" cy="48" rx="28" ry="16" fill="#64748B" opacity="0.9" />
          <ellipse cx="36" cy="44" rx="16" ry="12" fill="#94A3B8" opacity="0.9" />
          <ellipse cx="62" cy="45" rx="14" ry="10" fill="#94A3B8" opacity="0.9" />
          <ellipse cx="50" cy="40" rx="12" ry="8" fill="#CBD5E1" opacity="0.8" />
        </g>
        {[28, 40, 52, 64].map((x, i) => (
          <line
            key={i}
            x1={x} y1="58" x2={x - 4} y2="75"
            stroke="#60A5FA"
            strokeWidth="2.5"
            strokeLinecap="round"
            opacity="0.7"
            style={{ animation: `rain-drop 1.2s ease-in ${i * 0.2}s infinite` }}
          />
        ))}
      </svg>
    );
  }

  if (lower.includes('thunder')) {
    return (
      <svg className="w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 drop-shadow-lg" viewBox="0 0 100 100">
        <g>
          <ellipse cx="50" cy="45" rx="30" ry="18" fill="#475569" opacity="0.95" />
          <ellipse cx="34" cy="40" rx="18" ry="14" fill="#64748B" opacity="0.95" />
          <ellipse cx="64" cy="42" rx="16" ry="12" fill="#64748B" opacity="0.95" />
        </g>
        <polygon
          points="55,52 48,65 54,65 49,80 62,62 55,62 60,52"
          fill="#FACC15"
          className="animate-glow-pulse"
          style={{ animationDuration: '2s' }}
        />
        {[30, 50, 70].map((x, i) => (
          <line
            key={i}
            x1={x} y1="56" x2={x - 3} y2="72"
            stroke="#818CF8"
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.5"
            style={{ animation: `rain-drop 0.9s ease-in ${i * 0.25}s infinite` }}
          />
        ))}
      </svg>
    );
  }

  if (lower.includes('snow')) {
    return (
      <svg className="w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 drop-shadow-lg" viewBox="0 0 100 100">
        <g>
          <ellipse cx="50" cy="48" rx="28" ry="16" fill="#94A3B8" opacity="0.7" />
          <ellipse cx="36" cy="44" rx="16" ry="12" fill="#CBD5E1" opacity="0.7" />
          <ellipse cx="62" cy="45" rx="14" ry="10" fill="#CBD5E1" opacity="0.7" />
        </g>
        {[0, 1, 2].map((i) => (
          <circle
            key={i}
            cx={30 + i * 20} cy={62 + i * 4}
            r="2.5"
            fill="#E2E8F0"
            opacity="0.8"
            style={{ animation: `snow-fall ${2 + i * 0.5}s ease-in ${i * 0.4}s infinite` }}
          />
        ))}
      </svg>
    );
  }

  return (
    <svg className="w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 drop-shadow-lg" viewBox="0 0 100 100">
      <defs>
        <radialGradient id="sun-grad-2" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FDE047" />
          <stop offset="100%" stopColor="#F59E0B" />
        </radialGradient>
      </defs>
      {[0, 60, 120, 180, 240, 300].map((angle, i) => (
        <line
          key={angle}
          x1="50" y1="8" x2="50" y2="20"
          stroke="#FCD34D"
          strokeWidth="3"
          strokeLinecap="round"
          transform={`rotate(${angle} 50 50)`}
          style={{ animation: `fade-in 0.3s ease-out ${i * 0.05}s both, sun-rotate 12s linear infinite` }}
          className="origin-center"
        />
      ))}
      <circle cx="50" cy="50" r="22" fill="url(#sun-grad-2)" className="animate-glow-pulse" />
    </svg>
  );
}

function getWindDirection(deg: number): string {
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  return directions[Math.round(deg / 45) % 8];
}

function getProgressValue(value: number, type: 'humidity' | 'wind' | 'pressure' | 'clouds'): number {
  if (type === 'humidity' || type === 'clouds') return Math.min(value, 100);
  if (type === 'pressure') return Math.min((value - 950) / 100 * 100, 100);
  return Math.min((value / 20) * 100, 100);
}

function getLastUpdated(): string {
  const now = new Date();
  return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export default function WeatherCard({ data }: WeatherCardProps) {
  const gradient = getWeatherGradient(data.weather);
  const [updatedAt, setUpdatedAt] = useState(getLastUpdated());
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setUpdatedAt(getLastUpdated());
      setRefreshing(false);
    }, 600);
  };

  return (
    <div className="animate-fade-in-up">
      <div className="glass-card rounded-2xl overflow-hidden group/card hover:shadow-xl transition-all duration-500">
        <div className={`bg-gradient-to-br ${gradient} p-6 sm:p-8 lg:p-10 relative overflow-hidden`}>
          <div className="absolute inset-0 bg-black/10 dark:bg-black/30" />
          <div className="absolute -top-20 -right-20 w-60 h-60 bg-white/5 rounded-full blur-2xl" />
          <div className="relative flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6 sm:gap-8">
            <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
              <div className="flex items-center gap-3 mb-1">
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white drop-shadow-sm">
                  {data.city}
                </h2>
              </div>
              <p className="text-sm sm:text-base text-white/80 capitalize font-medium drop-shadow-sm">
                {data.weather}
              </p>
              <div className="flex items-baseline justify-center sm:justify-start gap-1 mt-4 sm:mt-5">
                <span className="text-6xl sm:text-7xl lg:text-8xl font-extralight text-white drop-shadow-lg tracking-tight leading-none">
                  {Math.round(data.temperature)}
                </span>
                <span className="text-3xl sm:text-4xl text-white/80 drop-shadow-sm font-light">°C</span>
              </div>
              <div className="flex items-center gap-3 mt-2">
                <p className="text-sm sm:text-base text-white/70 drop-shadow-sm">
                  Feels like {Math.round(data.feels_like)}°C
                </p>
                <span className="text-white/30">|</span>
                <div className="flex items-center gap-2 text-xs sm:text-sm text-white/70 drop-shadow-sm">
                  <span className="flex items-center gap-1">
                    <ArrowUp className="w-3 h-3 text-red-300" />
                    {Math.round(data.max_temperature)}°
                  </span>
                  <span className="flex items-center gap-1">
                    <ArrowDown className="w-3 h-3 text-blue-300" />
                    {Math.round(data.min_temperature)}°
                  </span>
                </div>
              </div>
            </div>
            <div className="hidden sm:flex items-center justify-center">
              <AnimatedWeatherIcon condition={data.weather} />
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-6 lg:p-8">
          <div className="flex items-center justify-between mb-4">
            <p className="text-[10px] sm:text-xs font-medium text-subtext dark:text-subtext-dark flex items-center gap-1.5">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
              Updated {updatedAt}
            </p>
            <button
              onClick={handleRefresh}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[10px] sm:text-xs font-medium text-subtext dark:text-subtext-dark hover:text-accent dark:hover:text-accent hover:bg-muted dark:hover:bg-muted-dark transition-all duration-200 cursor-pointer"
            >
              <RefreshCw className={`w-3 h-3 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:gap-3">
            <DetailItem
              icon={Droplets}
              label="Humidity"
              value={data.humidity}
              unit="%"
              progress={getProgressValue(data.humidity, 'humidity')}
              delay={0}
              description="Humidity is the amount of water vapor in the air. Higher humidity makes the air feel warmer and more muggy. Ideal indoor humidity is between 30-50%."
            />
            <DetailItem
              icon={Wind}
              label="Wind"
              value={`${data.wind_speed} m/s ${getWindDirection(data.wind_deg)}`}
              progress={getProgressValue(data.wind_speed, 'wind')}
              delay={50}
              description="Wind speed measures how fast air is moving. Wind direction tells you where the wind is coming from. Measured in meters per second."
            />
            <DetailItem
              icon={Gauge}
              label="Pressure"
              value={data.pressure}
              unit="hPa"
              progress={getProgressValue(data.pressure, 'pressure')}
              delay={100}
              description="Atmospheric pressure indicates the weight of the air above. Rising pressure usually means improving weather, while falling pressure can indicate approaching storms."
            />
            <DetailItem
              icon={CloudSun}
              label="Clouds"
              value={data.clouds}
              unit="%"
              progress={getProgressValue(data.clouds, 'clouds')}
              delay={150}
              description="Cloud cover percentage indicates how much of the sky is covered by clouds. Higher values mean more overcast conditions."
            />
            <DetailItem
              icon={ArrowUp}
              label="Max Temp"
              value={Math.round(data.max_temperature)}
              unit="°C"
              delay={200}
              description="The maximum temperature expected for today. This typically occurs in the afternoon when the sun is at its peak."
            />
            <DetailItem
              icon={ArrowDown}
              label="Min Temp"
              value={Math.round(data.min_temperature)}
              unit="°C"
              delay={250}
              description="The minimum temperature recorded for today. This typically occurs during the early morning hours before sunrise."
            />
          </div>
        </div>
      </div>
    </div>
  );
}
