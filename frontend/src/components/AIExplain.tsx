import { Sparkles, Loader2, Brain, ChevronDown, ChevronUp, WandSparkles } from 'lucide-react';
import { useState, useEffect } from 'react';
import Markdown from 'react-markdown';

interface AIExplainProps {
  onExplain: () => void;
  loading: boolean;
  response: string | null;
  hasWeather: boolean;
}

export default function AIExplain({ onExplain, loading, response, hasWeather }: AIExplainProps) {
  const [expanded, setExpanded] = useState(true);
  const [showSparkle, setShowSparkle] = useState(false);

  useEffect(() => {
    if (!loading && !response) {
      const t = setTimeout(() => setShowSparkle(true), 300);
      return () => clearTimeout(t);
    }
    setShowSparkle(false);
  }, [loading, response]);

  return (
    <div className="animate-fade-in-up">
      <div className="md-card elevation-1 overflow-hidden">
        <div className="p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4 sm:mb-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[var(--color-primary-container)] flex items-center justify-center">
                <Brain className="w-5 h-5 text-[var(--color-on-primary-container)]" />
              </div>
              <div>
                <h3 className="md-title-medium text-[var(--color-on-surface)]">
                  AI Weather Insight
                </h3>
                <p className="md-label-small text-[var(--color-on-surface-variant)]">
                  Powered by OpenRouter
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {response && (
                <button
                  onClick={() => setExpanded(!expanded)}
                  className="md-icon-btn p-1"
                  aria-label={expanded ? 'Collapse' : 'Expand'}
                >
                  {expanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </button>
              )}
              <button
                onClick={onExplain}
                disabled={loading || !hasWeather}
                className={`
                  md-btn md-btn-primary md-btn-md gap-2
                  ${loading || !hasWeather ? 'opacity-38 cursor-not-allowed' : ''}
                `}
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <WandSparkles className="w-4 h-4" />
                )}
                {loading ? 'Analyzing...' : 'Analyze'}
              </button>
            </div>
          </div>

          {!hasWeather && !response && (
            <div className="flex flex-col items-center gap-3 py-8 sm:py-10 text-center">
              <div className="w-14 h-14 rounded-2xl md-card elevation-0 bg-[var(--color-surface-container)] flex items-center justify-center">
                <Sparkles className={`w-6 h-6 text-[var(--color-on-surface-variant)]/40 transition-all duration-700 ${showSparkle ? 'scale-110 opacity-60' : ''}`} />
              </div>
              <div>
                <p className="md-title-small text-[var(--color-on-surface)]">
                  AI Insights
                </p>
                <p className="md-body-small text-[var(--color-on-surface-variant)] mt-1 max-w-xs mx-auto">
                  Search for a city and tap <span className="font-medium text-[var(--color-primary)]">Analyze</span> to get AI-powered weather insights
                </p>
              </div>
            </div>
          )}

          {loading && (
            <div className="flex items-center gap-3 py-4 px-4 md-card elevation-0 bg-[var(--color-surface-container)] rounded-xl border border-[var(--color-outline-variant)]">
              <div className="flex gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[var(--color-primary)]" style={{ animation: 'pulse-dot 1.4s infinite ease-in-out both', animationDelay: '0s' }} />
                <span className="w-2 h-2 rounded-full bg-[var(--color-primary)]" style={{ animation: 'pulse-dot 1.4s infinite ease-in-out both', animationDelay: '0.16s' }} />
                <span className="w-2 h-2 rounded-full bg-[var(--color-primary)]" style={{ animation: 'pulse-dot 1.4s infinite ease-in-out both', animationDelay: '0.32s' }} />
              </div>
              <span className="md-body-medium text-[var(--color-on-surface-variant)]">AI is analyzing the weather data...</span>
            </div>
          )}

          {response && expanded && (
            <div className="md-card elevation-0 bg-[var(--color-surface-container)] rounded-xl p-4 animate-fade-in border border-[var(--color-outline-variant)]">
              <div className="markdown-body md-body-medium text-[var(--color-on-surface)] leading-relaxed">
                <Markdown>{response}</Markdown>
              </div>
            </div>
          )}

          {response && !expanded && (
            <p className="md-body-small text-[var(--color-on-surface-variant)] truncate cursor-pointer hover:text-[var(--color-on-surface)] transition-colors duration-200" onClick={() => setExpanded(true)}>
              {response.slice(0, 120)}...
            </p>
          )}
        </div>
      </div>
    </div>
  );
}