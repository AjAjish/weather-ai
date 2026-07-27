import { useState } from 'react';
import { CloudSun, Sun, Moon } from 'lucide-react';

interface NavbarProps {
  dark: boolean;
  onToggleDark: () => void;
}

export default function Navbar({ dark, onToggleDark }: NavbarProps) {
  const [toggling, setToggling] = useState(false);

  const handleToggle = () => {
    setToggling(true);
    onToggleDark();
    setTimeout(() => setToggling(false), 400);
  };

  return (
    <header
      className={`
        fixed top-0 left-0 right-0 z-50
        bg-[var(--color-bg)]/80 backdrop-blur-md
        border-b border-[var(--color-outline-variant)]
        transition-all duration-300
        ${dark ? 'dark' : ''}
      `}
      role="banner"
    >
      <div className="max-w-5xl mx-auto px-4">
        <div className="h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[var(--color-primary)] flex items-center justify-center shadow-sm">
              <CloudSun className="w-5 h-5 text-[var(--color-on-primary)]" />
            </div>
            <span className="md-title-large text-[var(--color-on-surface)] font-medium">
              WeatherAI
            </span>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={handleToggle}
              className={`
                md-icon-btn
                ${toggling ? 'scale-90' : ''}
                group
              `}
              aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
              data-tooltip={dark ? 'Light mode' : 'Dark mode'}
            >
              <div className="absolute inset-0 rounded-full transition-all duration-300 bg-[var(--color-primary-container)] group-hover:scale-100 scale-0" />
              {dark ? (
                <Sun className="w-5 h-5 text-[var(--color-warning)] group-hover:rotate-45 transition-transform duration-300 relative z-10" />
              ) : (
                <Moon className="w-5 h-5 text-[var(--color-on-surface-variant)] group-hover:-rotate-12 transition-transform duration-300 relative z-10" />
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}