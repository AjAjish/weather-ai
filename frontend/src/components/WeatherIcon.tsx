interface WeatherIconProps {
  condition: string;
  size?: number;
  animated?: boolean;
}

export default function WeatherIcon({ condition, size = 28, animated = true }: WeatherIconProps) {
  const lower = condition.toLowerCase();

  if (lower.includes('clear') || lower.includes('sunny')) {
    return (
      <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
        <circle cx="32" cy="32" r="14" fill="#FBBF24" className={animated ? 'animate-glow-pulse' : ''} style={animated ? { animationDuration: '3s' } : undefined} />
        {[0, 45, 90, 135, 180, 225, 270, 315].map((a, i) => (
          <line
            key={a}
            x1="32" y1="6" x2="32" y2="14"
            stroke="#FCD34D"
            strokeWidth="2.5"
            strokeLinecap="round"
            transform={`rotate(${a} 32 32)`}
            className={animated ? 'origin-center' : ''}
            style={animated ? { animation: `fade-in 0.3s ease-out ${i * 0.04}s both` } : undefined}
          />
        ))}
      </svg>
    );
  }

  if (lower.includes('cloud') || lower.includes('overcast')) {
    return (
      <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
        <g className={animated ? '' : ''} style={animated ? { animation: 'cloud-drift 6s ease-in-out infinite' } : undefined}>
          <ellipse cx="32" cy="40" rx="20" ry="12" fill="#94A3B8" opacity="0.8" />
          <ellipse cx="22" cy="34" rx="14" ry="10" fill="#CBD5E1" opacity="0.9" />
          <ellipse cx="44" cy="36" rx="12" ry="9" fill="#CBD5E1" opacity="0.9" />
          <ellipse cx="32" cy="30" rx="10" ry="7" fill="#E2E8F0" opacity="0.8" />
        </g>
      </svg>
    );
  }

  if (lower.includes('rain') || lower.includes('drizzle')) {
    return (
      <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
        <ellipse cx="32" cy="30" rx="20" ry="11" fill="#64748B" opacity="0.8" />
        <ellipse cx="22" cy="26" rx="12" ry="8" fill="#94A3B8" opacity="0.8" />
        <ellipse cx="42" cy="27" rx="10" ry="7" fill="#CBD5E1" opacity="0.7" />
        {[20, 28, 36, 44].map((x, i) => (
          <line
            key={i}
            x1={x} y1="38" x2={x - 3} y2="50"
            stroke="#60A5FA"
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.7"
            style={animated ? { animation: `rain-drop 1.2s ease-in ${i * 0.15}s infinite` } : undefined}
          />
        ))}
      </svg>
    );
  }

  if (lower.includes('thunder')) {
    return (
      <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
        <ellipse cx="32" cy="28" rx="22" ry="13" fill="#475569" opacity="0.9" />
        <ellipse cx="20" cy="24" rx="14" ry="10" fill="#64748B" opacity="0.9" />
        <ellipse cx="44" cy="25" rx="12" ry="9" fill="#64748B" opacity="0.9" />
        <polygon points="35,32 30,42 34,42 30,54 40,40 35,40 38,32" fill="#FACC15" className={animated ? 'animate-glow-pulse' : ''} style={animated ? { animationDuration: '2s' } : undefined} />
        {[22, 38].map((x, i) => (
          <line key={i} x1={x} y1="36" x2={x - 2} y2="48" stroke="#818CF8" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" style={animated ? { animation: `rain-drop 0.9s ease-in ${i * 0.2}s infinite` } : undefined} />
        ))}
      </svg>
    );
  }

  if (lower.includes('snow')) {
    return (
      <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
        <ellipse cx="32" cy="30" rx="20" ry="11" fill="#94A3B8" opacity="0.6" />
        <ellipse cx="22" cy="26" rx="12" ry="8" fill="#CBD5E1" opacity="0.6" />
        <ellipse cx="42" cy="27" rx="10" ry="7" fill="#CBD5E1" opacity="0.6" />
        {[0, 1, 2].map((i) => (
          <circle key={i} cx={20 + i * 12} cy={40 + i * 3} r="2" fill="#E2E8F0" opacity="0.8" style={animated ? { animation: `snow-fall ${2 + i * 0.4}s ease-in ${i * 0.3}s infinite` } : undefined} />
        ))}
      </svg>
    );
  }

  if (lower.includes('mist') || lower.includes('fog') || lower.includes('haze')) {
    return (
      <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
        {[24, 30, 36, 42].map((y, i) => (
          <line key={i} x1="12" y1={y} x2="52" y2={y} stroke="#94A3B8" strokeWidth="3" strokeLinecap="round" opacity={0.5 + i * 0.1} style={animated ? { animation: `fade-in 1.5s ease-in-out ${i * 0.2}s infinite alternate` } : undefined} />
        ))}
      </svg>
    );
  }

  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <circle cx="32" cy="32" r="14" fill="#FBBF24" className={animated ? 'animate-glow-pulse' : ''} />
      {[0, 60, 120, 180, 240, 300].map((a) => (
        <line key={a} x1="32" y1="6" x2="32" y2="14" stroke="#FCD34D" strokeWidth="2.5" strokeLinecap="round" transform={`rotate(${a} 32 32)`} />
      ))}
    </svg>
  );
}
