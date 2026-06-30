import { useState } from 'react';
import { CloudSun, Moon, Sun } from 'lucide-react';

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
    <nav className="fixed top-4 left-4 right-4 z-50 max-w-5xl mx-auto glass rounded-2xl shadow-sm animate-slide-down">
      <div className="px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-accent to-accent-light flex items-center justify-center shadow-sm hover:scale-110 transition-transform duration-300">
            <CloudSun className="w-5 h-5 text-white" />
          </div>
          <span className="text-sm sm:text-base font-bold text-text dark:text-text-dark tracking-tight">
            WeatherAI
          </span>
          <span className="hidden sm:inline-flex ml-2 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded-md bg-accent/10 text-accent border border-accent/20">
            Pro
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleToggle}
            className={`
              w-9 h-9 rounded-xl hover:bg-muted dark:hover:bg-muted-dark
              flex items-center justify-center transition-all duration-200 cursor-pointer
              group relative overflow-hidden
              ${toggling ? 'scale-90' : 'hover:scale-105'}
            `}
            aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            <div className={`absolute inset-0 rounded-xl transition-all duration-300 ${toggling ? 'bg-accent/10 scale-100' : 'scale-0'}`} />
            {dark ? (
              <Sun className="w-[18px] h-[18px] text-yellow-500 group-hover:rotate-45 transition-transform duration-300 relative z-10" />
            ) : (
              <Moon className="w-[18px] h-[18px] text-subtext dark:text-subtext-dark group-hover:-rotate-12 transition-transform duration-300 relative z-10" />
            )}
          </button>
        </div>
      </div>
    </nav>
  );
}
