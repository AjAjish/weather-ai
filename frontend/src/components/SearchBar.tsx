import { useState, useRef, useEffect, type FormEvent } from 'react';
import { Search, Loader2, MapPin, X, Clock, ArrowRight } from 'lucide-react';

interface SearchBarProps {
  onSearch: (city: string) => void;
  loading: boolean;
}

const SUGGESTIONS = ['London', 'Tokyo', 'Paris', 'New York', 'Dubai'];

export default function SearchBar({ onSearch, loading }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [focused, setFocused] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('recentSearches') || '[]');
    } catch {
      return [];
    }
  });
  const [showRecent, setShowRecent] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node) && inputRef.current && !inputRef.current.contains(e.target as Node)) {
        setShowRecent(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const addRecentSearch = (city: string) => {
    const updated = [city, ...recentSearches.filter(s => s.toLowerCase() !== city.toLowerCase())].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('recentSearches', JSON.stringify(updated));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (trimmed) {
      addRecentSearch(trimmed);
      onSearch(trimmed);
      inputRef.current?.blur();
      setShowRecent(false);
    }
  };

  const handleSuggestion = (city: string) => {
    setQuery(city);
    addRecentSearch(city);
    onSearch(city);
    inputRef.current?.blur();
    setShowRecent(false);
  };

  const clearRecent = () => {
    setRecentSearches([]);
    localStorage.removeItem('recentSearches');
  };

  const showDropdown = focused && !loading && (query.trim() === '' || showRecent);

  return (
    <form onSubmit={handleSubmit} className="w-full" style={{ animation: 'fade-in-up 0.5s ease-out both' }}>
      <div className="relative">
        <div
          className={`
            relative flex items-center glass-card rounded-2xl overflow-hidden
            transition-all duration-300
            ${focused
              ? 'ring-2 ring-accent/30 shadow-lg shadow-accent/5'
              : 'hover:shadow-md'
            }
          `}
        >
          <div className="flex items-center gap-2 pl-4 sm:pl-5 shrink-0">
            <MapPin className={`w-4 h-4 sm:w-[18px] sm:h-[18px] transition-all duration-300 ${focused ? 'text-accent scale-110' : 'text-subtext dark:text-subtext-dark'}`} />
          </div>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => { setFocused(true); setShowRecent(true); }}
            onBlur={() => { setFocused(false); setTimeout(() => setShowRecent(false), 200); }}
            placeholder="Search for a city..."
            className="flex-1 bg-transparent text-text dark:text-text-dark placeholder-subtext/50 dark:placeholder-subtext-dark/40 px-3 py-3.5 sm:py-4 outline-none text-sm sm:text-base font-medium"
            disabled={loading}
          />
          <div className="flex items-center pr-2 sm:pr-3 gap-1">
            {query.trim() && !loading && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="w-7 h-7 rounded-lg hover:bg-muted dark:hover:bg-muted-dark flex items-center justify-center transition-all duration-200 cursor-pointer text-subtext dark:text-subtext-dark hover:scale-110"
                tabIndex={-1}
              >
                <X className="w-[14px] h-[14px]" />
              </button>
            )}
            <button
              type="submit"
              disabled={loading || !query.trim()}
              className={`
                px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl text-white text-sm font-semibold
                transition-all duration-200 cursor-pointer flex items-center gap-2
                ${loading || !query.trim()
                  ? 'bg-gray-300 dark:bg-white/10 cursor-not-allowed'
                  : 'bg-accent hover:bg-accent/90 shadow-sm hover:shadow-md hover:scale-105 active:scale-95'
                }
              `}
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Search className="w-4 h-4" />
              )}
              <span className="hidden sm:inline">{loading ? 'Searching...' : 'Search'}</span>
            </button>
          </div>
        </div>

        {showDropdown && (
          <div
            ref={dropdownRef}
            className="absolute top-full left-0 right-0 mt-2 glass-card rounded-2xl overflow-hidden shadow-lg z-40 animate-slide-down"
          >
            {recentSearches.length > 0 && query.trim() === '' && (
              <div>
                <div className="flex items-center justify-between px-4 sm:px-5 pt-3 pb-1.5">
                  <span className="text-[10px] sm:text-xs font-semibold text-subtext dark:text-subtext-dark uppercase tracking-wider flex items-center gap-1.5">
                    <Clock className="w-3 h-3" />
                    Recent
                  </span>
                  <button
                    type="button"
                    onClick={clearRecent}
                    className="text-[10px] sm:text-xs font-medium text-subtext/60 dark:text-subtext-dark/50 hover:text-red-400 transition-colors duration-200 cursor-pointer"
                  >
                    Clear
                  </button>
                </div>
                {recentSearches.map((city, i) => (
                  <button
                    key={city}
                    type="button"
                    onClick={() => handleSuggestion(city)}
                    className="w-full flex items-center gap-3 px-4 sm:px-5 py-2.5 sm:py-3 text-left text-sm text-text dark:text-text-dark hover:bg-muted dark:hover:bg-muted-dark transition-all duration-200 cursor-pointer group"
                    style={{ animation: `slide-down 0.2s ease-out ${i * 0.03}s both` }}
                  >
                    <Clock className="w-3.5 h-3.5 text-subtext dark:text-subtext-dark shrink-0" />
                    <span className="flex-1 font-medium">{city}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-subtext/40 dark:text-subtext-dark/30 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                  </button>
                ))}
                <div className="h-px bg-border dark:bg-border-dark mx-4 sm:mx-5" />
              </div>
            )}
            <div className="px-4 sm:px-5 py-3">
              <span className="text-[10px] sm:text-xs font-semibold text-subtext dark:text-subtext-dark uppercase tracking-wider">
                Quick pick
              </span>
              <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-2">
                {SUGGESTIONS.map((city, i) => (
                  <button
                    key={city}
                    type="button"
                    onClick={() => handleSuggestion(city)}
                    className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-muted dark:bg-muted-dark hover:bg-accent/10 dark:hover:bg-accent/10 hover:text-accent text-xs sm:text-sm font-semibold text-subtext dark:text-subtext-dark transition-all duration-200 cursor-pointer hover:scale-105 active:scale-95"
                    style={{ animation: `fade-in-up 0.3s ease-out ${i * 0.05}s both` }}
                  >
                    {city}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </form>
  );
}
