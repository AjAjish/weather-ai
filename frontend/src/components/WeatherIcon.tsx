import { Sun, Cloud, CloudRain, CloudSnow, CloudLightning, CloudFog } from 'lucide-react';

interface WeatherIconProps {
  condition: string;
  size?: number;
}

export default function WeatherIcon({ condition, size = 32 }: WeatherIconProps) {
  const lower = condition.toLowerCase();
  const style = { width: size, height: size } as React.CSSProperties;

  if (lower.includes('clear') || lower.includes('sunny')) {
    return <Sun className="text-[var(--color-warning)]" style={style} />;
  }
  if (lower.includes('cloud') || lower.includes('overcast')) {
    return <Cloud className="text-[var(--color-on-surface-variant)]" style={style} />;
  }
  if (lower.includes('rain') || lower.includes('drizzle')) {
    return <CloudRain className="text-[var(--color-primary)]" style={style} />;
  }
  if (lower.includes('thunder')) {
    return <CloudLightning className="text-[var(--color-secondary)]" style={style} />;
  }
  if (lower.includes('snow')) {
    return <CloudSnow className="text-[var(--color-on-surface)]" style={style} />;
  }
  if (lower.includes('mist') || lower.includes('fog') || lower.includes('haze')) {
    return <CloudFog className="text-[var(--color-on-surface-variant)]" style={style} />;
  }

  return <Sun className="text-[var(--color-warning)]" style={style} />;
}