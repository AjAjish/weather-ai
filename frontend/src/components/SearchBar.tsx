import { useState, useRef, useEffect, type FormEvent } from 'react';
import { Search, Loader2, X, MapPin } from 'lucide-react';

interface SearchBarProps {
  onSearch: (city: string) => void;
  loading: boolean;
}

const RECENT_STORAGE_KEY = 'weather_recent_searches';
const MAX_RECENT = 5;

export default function SearchBar({ onSearch, loading }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [focused, setFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem(RECENT_STORAGE_KEY) || '[]');
    } catch {
      return [];
    }
  });
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const addRecentSearch = (city: string) => {
    const updated = [
      city,
      ...recentSearches.filter((s) => s.toLowerCase() !== city.toLowerCase()),
    ].slice(0, MAX_RECENT);
    setRecentSearches(updated);
    localStorage.setItem(RECENT_STORAGE_KEY, JSON.stringify(updated));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (trimmed) {
      addRecentSearch(trimmed);
      onSearch(trimmed);
      inputRef.current?.blur();
      setShowSuggestions(false);
    }
  };

  const handleSuggestion = (city: string) => {
    setQuery(city);
    addRecentSearch(city);
    onSearch(city);
    inputRef.current?.blur();
    setShowSuggestions(false);
  };

  const clearRecent = () => {
    setRecentSearches([]);
    localStorage.removeItem(RECENT_STORAGE_KEY);
  };

  const hasContent = query.trim() !== '';
  const shouldShowDropdown = focused && !loading && (hasContent || showSuggestions);

  return (
    <form onSubmit={handleSubmit} className="w-full animate-fade-in-up">
      <div className="relative">
        <div
          className={`
            md-textfield flex items-center gap-3
            ${focused ? 'border-[var(--color-primary)] border-2' : ''}
            ${hasContent ? 'bg-[var(--color-surface-container-high)]' : ''}
          `}
        >
          <MapPin
            className={`
              w-5 h-5 shrink-0 transition-colors duration-200
              ${focused ? 'text-[var(--color-primary)]' : 'text-[var(--color-on-surface-variant)]'}
            `}
            aria-hidden="true"
          />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => {
              setFocused(true);
              setShowSuggestions(true);
            }}
            onBlur={() => {
              setFocused(false);
              setTimeout(() => setShowSuggestions(false), 200);
            }}
            placeholder="Search for a city..."
            className="flex-1 bg-transparent text-[var(--color-on-surface)] placeholder-[var(--color-on-surface-variant)] outline-none text-base font-normal"
            disabled={loading}
            aria-label="Search for a city"
          />
          <div className="flex items-center gap-1">
            {hasContent && !loading && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="md-icon-btn p-1"
                tabIndex={-1}
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <button
              type="submit"
              disabled={loading || !hasContent}
              className={`
                md-btn md-btn-primary md-btn-md
                ${loading || !hasContent ? 'opacity-38 cursor-not-allowed' : ''}
              `}
              aria-label={loading ? 'Searching...' : 'Search'}
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

        {shouldShowDropdown && (
          <div
            ref={dropdownRef}
            className="absolute top-full left-0 right-0 mt-2 md-card elevation-3 animate-slide-down z-50 max-h-[300px] overflow-auto"
            role="listbox"
          >
            {recentSearches.length > 0 && !hasContent && (
              <div className="border-b border-[var(--color-outline-variant)]">
                <div className="flex items-center justify-between px-4 py-2">
                  <span className="md-label-medium text-[var(--color-on-surface-variant)] flex items-center gap-2">
                    <span className="w-4 h-4" aria-hidden="true">
                      <svg viewBox="0 0 24 24" fill="currentColor"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/></svg>
                    </span>
                    Recent searches
                  </span>
                  <button
                    type="button"
                    onClick={clearRecent}
                    className="md-btn md-btn-text md-btn-sm text-[var(--color-error)] hover:text-[var(--color-error)]"
                  >
                    Clear
                  </button>
                </div>
                {recentSearches.map((city, i) => (
                  <button
                    key={city}
                    type="button"
                    onClick={() => handleSuggestion(city)}
                    className="md-list-item w-full justify-start gap-3"
                    role="option"
                    style={{ animation: `fade-in-up 0.2s ease-out ${i * 0.03}s both` }}
                  >
                    <span className="w-4 h-4 text-[var(--color-on-surface-variant)]" aria-hidden="true">
                      <svg viewBox="0 0 24 24" fill="currentColor"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/></svg>
                    </span>
                    <span className="md-body-medium flex-1">{city}</span>
                    <span className="w-4 h-4 text-[var(--color-on-surface-variant)] opacity-0 group-hover:opacity-100 transition-opacity" aria-hidden="true">
                      <svg viewBox="0 0 24 24" fill="currentColor"><path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/></svg>
                    </span>
                  </button>
                ))}
              </div>
            )}

            <div className="p-3">
              <span className="md-label-medium text-[var(--color-on-surface-variant)]">Popular cities</span>
              <div className="flex flex-wrap gap-2 mt-2">
                {['New York', 'London', 'Tokyo', 'Paris', 'Dubai', 'Sydney'].map((city, i) => (
                  <button
                    key={city}
                    type="button"
                    onClick={() => handleSuggestion(city)}
                    className={`
                      md-chip
                      ${i === 0 ? 'md-chip-selected' : ''}
                    `}
                    role="option"
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