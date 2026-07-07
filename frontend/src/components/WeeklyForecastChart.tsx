import { useRef, useEffect, useState } from 'react';
import { Calendar, TrendingUp, Loader2, Droplets, Umbrella } from 'lucide-react';
import type { ForecastData } from '../types';
import WeatherIcon from './WeatherIcon';

interface WeeklyForecastChartProps {
  forecast: ForecastData | null;
  loading: boolean;
  error: string | null;
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + 'T12:00:00');
  return d.toLocaleDateString('en', { weekday: 'short', month: 'short', day: 'numeric' });
}

function formatDay(dateStr: string): string {
  const d = new Date(dateStr + 'T12:00:00');
  return d.toLocaleDateString('en', { weekday: 'short' });
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

export default function WeeklyForecastChart({ forecast, loading, error }: WeeklyForecastChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [chartInstance, setChartInstance] = useState<any>(null);

  useEffect(() => {
    return () => {
      if (chartInstance) {
        chartInstance.destroy();
      }
    };
  }, [chartInstance]);

  useEffect(() => {
    if (!forecast || !canvasRef.current || forecast.length === 0) return;

    (async () => {
      const { Chart, registerables } = await import('chart.js');
      Chart.register(...registerables);

      if (chartInstance) {
        chartInstance.destroy();
      }

      const ctx = canvasRef.current!.getContext('2d');
      if (!ctx) return;

      const isDark = document.documentElement.classList.contains('dark');
      const textColor = isDark ? '#94A3B8' : '#475569';
      const gridColor = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';

      const labels = forecast.map((d) => formatDay(d.date));
      const maxTemps = forecast.map((d) => Math.round(d.max_temperature));
      const minTemps = forecast.map((d) => Math.round(d.min_temperature));
      const rainProbs = forecast.map((d) => Math.round(d.rain_probability * 100));

      const instance = new Chart(ctx, {
        type: 'line',
        data: {
          labels,
          datasets: [
            {
              label: 'Max °C',
              data: maxTemps,
              borderColor: '#F97316',
              backgroundColor: 'rgba(249, 115, 22, 0.12)',
              tension: 0.35,
              pointRadius: 4,
              pointHoverRadius: 7,
              pointBackgroundColor: '#F97316',
              pointBorderColor: '#fff',
              pointBorderWidth: 2,
              borderWidth: 2.5,
              fill: false,
            },
            {
              label: 'Min °C',
              data: minTemps,
              borderColor: '#3B82F6',
              backgroundColor: 'rgba(59, 130, 246, 0.12)',
              tension: 0.35,
              pointRadius: 4,
              pointHoverRadius: 7,
              pointBackgroundColor: '#3B82F6',
              pointBorderColor: '#fff',
              pointBorderWidth: 2,
              borderWidth: 2.5,
              fill: false,
            },
            {
              label: 'Rain %',
              data: rainProbs,
              borderColor: '#22C55E',
              backgroundColor: 'rgba(34, 197, 94, 0.08)',
              tension: 0.35,
              pointRadius: 3,
              pointHoverRadius: 5,
              pointBackgroundColor: '#22C55E',
              pointBorderColor: '#fff',
              pointBorderWidth: 1.5,
              borderWidth: 2,
              borderDash: [4, 3],
              fill: false,
              yAxisID: 'y1',
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          interaction: { intersect: false, mode: 'index' },
          plugins: {
            legend: {
              display: true,
              position: 'top',
              align: 'end',
              labels: {
                usePointStyle: true,
                pointStyle: 'circle',
                padding: 16,
                color: textColor,
                font: { family: "'Plus Jakarta Sans', 'Inter', sans-serif", size: 11, weight: 600 },
                boxWidth: 8,
                boxHeight: 8,
              },
            },
            tooltip: {
              backgroundColor: isDark ? 'rgba(15,23,42,0.95)' : 'rgba(255,255,255,0.95)',
              titleColor: isDark ? '#F8FAFC' : '#0F172A',
              bodyColor: isDark ? '#94A3B8' : '#475569',
              borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)',
              borderWidth: 1,
              padding: 12,
              cornerRadius: 12,
              titleFont: { family: "'Plus Jakarta Sans', 'Inter', sans-serif", size: 12, weight: 700 },
              bodyFont: { family: "'Plus Jakarta Sans', 'Inter', sans-serif", size: 11 },
              displayColors: true,
              boxPadding: 4,
            },
          },
          scales: {
            x: {
              grid: { color: gridColor, drawTicks: false },
              ticks: { color: textColor, font: { family: "'Plus Jakarta Sans', 'Inter', sans-serif", size: 10, weight: 600 }, maxRotation: 0 },
              border: { display: false },
            },
            y: {
              position: 'left',
              grid: { color: gridColor, drawTicks: false },
              ticks: { color: textColor, font: { size: 10 }, maxTicksLimit: 6 },
              border: { display: false },
              title: { display: true, text: '°C', color: textColor, font: { size: 10, weight: 600 } },
            },
            y1: {
              position: 'right',
              grid: { display: false },
              ticks: { color: textColor, font: { size: 10 }, maxTicksLimit: 4, callback: (v: any) => `${v}%` },
              border: { display: false },
              title: { display: true, text: '%', color: textColor, font: { size: 10, weight: 600 } },
            },
          },
        },
      });

      setChartInstance(instance);
    })();
  }, [forecast]);

  if (error) {
    return (
      <div className="glass-card rounded-2xl p-6 text-center">
        <p className="text-sm text-red-400">{error}</p>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300">
      <div className="p-5 sm:p-6 lg:p-8">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent/10 to-accent/5 dark:from-accent/20 dark:to-accent/10 flex items-center justify-center">
              <TrendingUp className="w-[18px] h-[18px] text-accent" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-text dark:text-text-dark">
                5-Day Forecast
              </h3>
              <p className="text-[10px] sm:text-xs font-medium text-subtext dark:text-subtext-dark">
                Temperature & precipitation outlook
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] sm:text-xs font-medium text-subtext dark:text-subtext-dark">
            <Calendar className="w-3.5 h-3.5" />
            <span>5 days</span>
          </div>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-6 h-6 animate-spin text-accent" />
          </div>
        )}

        {!loading && forecast && forecast.length > 0 && (
          <>
            <div className="relative h-56 sm:h-64 mb-6">
              <canvas ref={canvasRef} />
            </div>

            <div className="grid grid-cols-5 gap-2 sm:gap-3">
              {forecast.map((day, i) => (
                <div
                  key={day.date}
                  className="flex flex-col items-center gap-1.5 sm:gap-2 p-2.5 sm:p-3 rounded-xl bg-muted dark:bg-muted-dark border border-border dark:border-border-dark hover:bg-accent/5 dark:hover:bg-accent/5 hover:border-accent/20 dark:hover:border-accent/20 transition-all duration-300 cursor-pointer group"
                  style={{ animation: `fade-in-up 0.4s ease-out ${i * 0.07}s both` }}
                >
                  <span className="text-[10px] sm:text-xs font-bold text-text dark:text-text-dark">
                    {formatDayFull(day.date)}
                  </span>
                  <span className="text-[9px] sm:text-[10px] font-medium text-subtext dark:text-subtext-dark -mt-1">
                    {formatDate(day.date)}
                  </span>

                  <div className="my-1 sm:my-1.5 group-hover:scale-110 transition-transform duration-300">
                    <WeatherIcon condition={day.weather} size={32} />
                  </div>

                  <span className="text-[10px] sm:text-xs text-subtext dark:text-subtext-dark text-center leading-tight capitalize line-clamp-1">
                    {day.weather}
                  </span>

                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="text-xs sm:text-sm font-bold text-text dark:text-text-dark">
                      {Math.round(day.max_temperature)}°
                    </span>
                    <span className="text-[10px] sm:text-xs font-medium text-subtext/60 dark:text-subtext-dark/50">
                      {Math.round(day.min_temperature)}°
                    </span>
                  </div>

                  <div className="flex items-center gap-2 mt-0.5">
                    {day.rain_probability > 0 && (
                      <span className="flex items-center gap-0.5 text-[9px] sm:text-[10px] font-medium text-blue-400">
                        <Umbrella className="w-2.5 h-2.5" />
                        {Math.round(day.rain_probability * 100)}%
                      </span>
                    )}
                    <span className="flex items-center gap-0.5 text-[9px] sm:text-[10px] font-medium text-subtext/60 dark:text-subtext-dark/50">
                      <Droplets className="w-2.5 h-2.5" />
                      {day.humidity}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {!loading && forecast && forecast.length === 0 && (
          <div className="flex flex-col items-center gap-3 py-10 text-center">
            <Calendar className="w-10 h-10 text-subtext/30 dark:text-subtext-dark/20" />
            <p className="text-sm text-subtext dark:text-subtext-dark">No forecast data available</p>
          </div>
        )}
      </div>
    </div>
  );
}
