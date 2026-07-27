import { useState, useEffect, useRef } from 'react';
import { Droplets, Wind, Gauge, RefreshCw, X, ArrowDown, ArrowUp, Sun, Cloud, CloudRain, CloudSnow, CloudLightning, CloudFog, HelpCircle } from 'lucide-react';
import type { WeatherData } from '../types';

interface WeatherCardProps {
  data: WeatherData;
}

type DetailItemProps = {
  icon: typeof Droplets;
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(4px)', animation: 'fade-in 0.2s ease-out both' }}>
      <div
        ref={popoverRef}
        className="md-card elevation-3 rounded-2xl max-w-sm w-full p-5 sm:p-6 animate-scale-in"
        role="dialog"
        aria-label={`${label} explanation`}
      >
        <div className="flex items-center justify-between mb-3">
          <h4 className="md-title-small text-[var(--color-on-surface)]">{label}</h4>
          <button
            onClick={onClose}
            className="md-icon-btn p-1"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <p className="md-body-medium text-[var(--color-on-surface-variant)] leading-relaxed">{description}</p>
        <button
          onClick={onClose}
          className="mt-4 w-full md-btn md-btn-primary md-btn-md"
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
        className="flex flex-col gap-2 p-3 sm:p-4 rounded-xl md-card elevation-0 bg-[var(--color-surface-container)] hover:bg-[var(--color-surface-container-high)] hover:elevation-1 transition-all duration-300 cursor-pointer group w-full text-left"
        style={{ animation: `fade-in-up 0.5s ease-out ${delay}ms both` }}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-[var(--color-primary-container)] flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:rotate-[-4deg] transition-all duration-300">
            <Icon className="w-[18px] h-[18px] sm:w-5 sm:h-5 text-[var(--color-on-primary-container)]" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <p className="md-label-small text-[var(--color-on-surface-variant)] uppercase tracking-wider">{label}</p>
              <HelpCircle className="w-3 h-3 text-[var(--color-on-surface-variant)]/40 group-hover:text-[var(--color-primary)] transition-colors duration-200" />
            </div>
            <p className="md-body-large font-bold text-[var(--color-on-surface)] truncate">
              {value}
              {unit && <span className="md-body-medium font-medium text-[var(--color-on-surface-variant)] ml-0.5">{unit}</span>}
            </p>
          </div>
        </div>
        {progress !== undefined && (
          <div className="h-1.5 rounded-full bg-[var(--color-surface-container-highest)] overflow-hidden">
            <div
              className="h-full rounded-full bg-[var(--color-primary)] transition-all duration-1000 ease-out"
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
  return 'from-[var(--color-primary)] via-[var(--color-secondary)] to-[var(--color-tertiary)]';
}

function getWeatherIcon(condition: string) {
  const lower = condition.toLowerCase();
  
  if (lower.includes('clear') || lower.includes('sunny')) {
    return <Sun className="w-14 h-14 text-[var(--color-warning)]" />;
  }
  if (lower.includes('cloud') || lower.includes('overcast')) {
    return <Cloud className="w-14 h-14 text-[var(--color-on-surface-variant)]" />;
  }
  if (lower.includes('rain') || lower.includes('drizzle')) {
    return <CloudRain className="w-14 h-14 text-[var(--color-primary)]" />;
  }
  if (lower.includes('thunder')) {
    return <CloudLightning className="w-14 h-14 text-[var(--color-secondary)]" />;
  }
  if (lower.includes('snow')) {
    return <CloudSnow className="w-14 h-14 text-[var(--color-on-surface)]" />;
  }
  if (lower.includes('mist') || lower.includes('fog') || lower.includes('haze')) {
    return <CloudFog className="w-14 h-14 text-[var(--color-on-surface-variant)]" />;
  }
  return <Sun className="w-14 h-14 text-[var(--color-warning)]" />;
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
      <div className="md-card elevation-2 overflow-hidden group/card hover:elevation-3 transition-all duration-500">
        <div className={`bg-gradient-to-br ${gradient} p-6 sm:p-8 lg:p-10 relative overflow-hidden`}>
          <div className="absolute inset-0 bg-black/10" />
          <div className="absolute -top-20 -right-20 w-60 h-60 bg-white/10 rounded-full blur-2xl" />
          <div className="relative flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6 sm:gap-8">
            <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
              <div className="flex items-center gap-3 mb-1">
                <h2 className="md-headline-small font-bold text-[var(--color-on-primary)] drop-shadow-sm">
                  {data.city}
                </h2>
              </div>
              <p className="md-body-medium text-[var(--color-on-primary)]/80 capitalize font-medium drop-shadow-sm">
                {data.weather}
              </p>
              <div className="flex items-baseline justify-center sm:justify-start gap-1 mt-4 sm:mt-5">
                <span className="text-6xl sm:text-7xl lg:text-8xl font-extralight text-[var(--color-on-primary)] drop-shadow-lg tracking-tight leading-none">
                  {Math.round(data.temperature)}
                </span>
                <span className="text-3xl sm:text-4xl text-[var(--color-on-primary)]/80 drop-shadow-sm font-light">°C</span>
              </div>
              <div className="flex items-center gap-3 mt-2">
                <p className="md-body-medium text-[var(--color-on-primary)]/70 drop-shadow-sm">
                  Feels like {Math.round(data.feels_like)}°C
                </p>
                <span className="text-[var(--color-on-primary)]/30">|</span>
                <div className="flex items-center gap-2 md-body-small text-[var(--color-on-primary)]/70 drop-shadow-sm">
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
              {getWeatherIcon(data.weather)}
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-6 lg:p-8">
          <div className="flex items-center justify-between mb-4">
            <p className="md-label-small text-[var(--color-on-surface-variant)] flex items-center gap-1.5">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-[var(--color-primary)] animate-pulse" />
              Updated {updatedAt}
            </p>
            <button
              onClick={handleRefresh}
              className="md-btn md-btn-text md-btn-sm gap-1.5"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
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
              icon={Sun}
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