import { useState, useRef } from 'react';
import { Calendar, Droplets, Umbrella, ChevronLeft, ChevronRight } from 'lucide-react';
import type { ForecastData } from '../types';
import WeatherIcon from './WeatherIcon';

interface WeeklyForecastCarouselProps {
  forecast: ForecastData | null;
  loading: boolean;
  error: string | null;
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + 'T12:00:00');
  return d.toLocaleDateString('en', { weekday: 'short', month: 'short', day: 'numeric' });
}

function formatDayFull(dateStr: string): string {
  const d = new Date(dateStr + 'T12:00:00');
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  if (d.toDateString() === today.toDateString()) return 'Today';
  if (d.toDateString() === tomorrow.toDateString()) return 'Tomorrow';
  return d.toLocaleDateString('en', { weekday: 'long' });
}

export default function WeeklyForecastCarousel({ forecast, loading, error }: WeeklyForecastCarouselProps) {
  const [scrollPosition, setScrollPosition] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: -280, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: 280, behavior: 'smooth' });
    }
  };

  const handleScroll = () => {
    if (carouselRef.current) {
      setScrollPosition(carouselRef.current.scrollLeft);
    }
  };

  const canScrollLeft = scrollPosition > 10;
  const canScrollRight = carouselRef.current
    ? scrollPosition + carouselRef.current.clientWidth < carouselRef.current.scrollWidth - 10
    : false;

  if (error) {
    return (
      <div className="md-card elevation-1 p-6 text-center">
        <p className="md-body-medium text-[var(--color-error)]">{error}</p>
      </div>
    );
  }

  return (
    <div className="md-card elevation-1 overflow-hidden animate-fade-in-up">
      <div className="p-4 sm:p-6 border-b border-[var(--color-outline-variant)]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[var(--color-primary-container)] flex items-center justify-center">
              <Calendar className="w-5 h-5 text-[var(--color-on-primary-container)]" />
            </div>
            <div>
              <h3 className="md-title-large text-[var(--color-on-surface)]">
                5-Day Forecast
              </h3>
              <p className="md-body-small text-[var(--color-on-surface-variant)]">
                Temperature & precipitation outlook
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 md-body-small text-[var(--color-on-surface-variant)]">
            <Calendar className="w-4 h-4" />
            <span>5 days</span>
          </div>
        </div>
      </div>

      <div className="relative">
        <div
          ref={carouselRef}
          className="flex gap-3 p-4 sm:p-6 overflow-x-auto scrollbar-hide snap-x snap-mandatory"
          onScroll={handleScroll}
          role="list"
          aria-label="5-day weather forecast"
        >
          {loading && Array.from({ length: 5 }).map((_, i) => (
            <div
              key={`skeleton-${i}`}
              className="flex-shrink-0 w-[260px] snap-start md-card elevation-0 bg-[var(--color-surface-container)] rounded-xl p-4 animate-pulse"
              role="listitem"
            >
              <div className="h-4 w-24 bg-[var(--color-surface-container-high)] rounded mb-2" />
              <div className="h-4 w-16 bg-[var(--color-surface-container-high)] rounded mb-4" />
              <div className="w-12 h-12 bg-[var(--color-surface-container-high)] rounded-full mx-auto mb-2" />
              <div className="h-8 w-20 bg-[var(--color-surface-container-high)] rounded mx-auto mb-2" />
              <div className="h-6 w-16 bg-[var(--color-surface-container-high)] rounded mx-auto mb-2" />
              <div className="flex gap-2 justify-center">
                <div className="h-5 w-12 bg-[var(--color-surface-container-high)] rounded-full" />
                <div className="h-5 w-12 bg-[var(--color-surface-container-high)] rounded-full" />
              </div>
            </div>
          ))}

          {!loading && forecast && forecast.length > 0 && (
            forecast.map((day, i) => (
              <div
                key={day.date}
                className="flex-shrink-0 w-[260px] snap-start md-card elevation-0 border border-[var(--color-outline-variant)] rounded-xl p-4 hover:elevation-1 transition-shadow duration-200 cursor-pointer"
                role="listitem"
                style={{ animation: `fade-in-up 0.4s ease-out ${i * 0.07}s both` }}
              >
                <div className="text-center">
                  <span className="md-title-medium text-[var(--color-on-surface)]">
                    {formatDayFull(day.date)}
                  </span>
                  <span className="md-body-small text-[var(--color-on-surface-variant)] block -mt-1">
                    {formatDate(day.date)}
                  </span>
                </div>

                <div className="my-3 flex justify-center">
                  <WeatherIcon condition={day.weather} size={48} />
                </div>

                <p className="md-body-small text-[var(--color-on-surface-variant)] text-center capitalize leading-tight line-clamp-1">
                  {day.weather}
                </p>

                <div className="flex items-center justify-center gap-3 mt-2">
                  <span className="md-headline-small text-[var(--color-on-surface)] font-medium">
                    {Math.round(day.max_temperature)}°
                  </span>
                  <span className="md-body-medium text-[var(--color-on-surface-variant)]">
                    {Math.round(day.min_temperature)}°
                  </span>
                </div>

                <div className="flex items-center justify-center gap-3 mt-3 pt-3 border-t border-[var(--color-outline-variant)]">
                  {day.rain_probability > 0 && (
                    <span className="flex items-center gap-1.5 md-body-small text-[var(--color-primary)] font-medium">
                      <Umbrella className="w-4 h-4" />
                      {Math.round(day.rain_probability * 100)}%
                    </span>
                  )}
                  <span className="flex items-center gap-1.5 md-body-small text-[var(--color-on-surface-variant)]">
                    <Droplets className="w-4 h-4" />
                    {day.humidity}%
                  </span>
                </div>
              </div>
            ))
          )}

          {!loading && forecast && forecast.length === 0 && (
            <div className="flex-shrink-0 w-[260px] snap-start flex flex-col items-center gap-3 py-10 text-center">
              <Calendar className="w-10 h-10 text-[var(--color-on-surface-variant)] opacity-30" />
              <p className="md-body-medium text-[var(--color-on-surface-variant)]">No forecast data available</p>
            </div>
          )}
        </div>

        {canScrollLeft && (
          <button
            onClick={scrollLeft}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 md-icon-btn elevation-2 bg-[var(--color-surface)] z-10"
            aria-label="Scroll left"
            type="button"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}

        {canScrollRight && (
          <button
            onClick={scrollRight}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 md-icon-btn elevation-2 bg-[var(--color-surface)] z-10"
            aria-label="Scroll right"
            type="button"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        )}

        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[var(--color-bg)] to-transparent pointer-events-none" />
      </div>
    </div>
  );
}