import { Sparkles, Loader2, Brain, ChevronDown, ChevronUp, WandSparkles } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import Markdown from 'react-markdown';

interface AIExplainProps {
  onExplain: () => void;
  loading: boolean;
  response: string | null;
  hasWeather: boolean;
}

function TypewriterText({ text }: { text: string }) {
  const [displayed, setDisplayed] = useState('');
  const indexRef = useRef(0);

  useEffect(() => {
    indexRef.current = 0;
    setDisplayed('');
    const interval = setInterval(() => {
      if (indexRef.current < text.length) {
        setDisplayed(text.slice(0, indexRef.current + 1));
        indexRef.current++;
      } else {
        clearInterval(interval);
      }
    }, 6);
    return () => clearInterval(interval);
  }, [text]);

  return <Markdown>{displayed}</Markdown>;
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
    <div className="animate-fade-in-up-delay-2">
      <div className="glass-card rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300">
        <div className="p-5 sm:p-6 lg:p-8">
          <div className="flex items-center justify-between mb-4 sm:mb-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent/10 to-accent/5 dark:from-accent/20 dark:to-accent/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Brain className="w-[18px] h-[18px] sm:w-5 sm:h-5 text-accent" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-text dark:text-text-dark">
                  AI Weather Insight
                </h3>
                <p className="text-[10px] sm:text-xs font-medium text-subtext dark:text-subtext-dark">
                  Powered by OpenRouter
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {response && (
                <button
                  onClick={() => setExpanded(!expanded)}
                  className="w-8 h-8 rounded-xl hover:bg-muted dark:hover:bg-muted-dark flex items-center justify-center transition-all duration-200 cursor-pointer text-subtext dark:text-subtext-dark hover:scale-110 active:scale-95"
                  aria-label={expanded ? 'Collapse' : 'Expand'}
                >
                  {expanded ? <ChevronUp className="w-[16px] h-[16px]" /> : <ChevronDown className="w-[16px] h-[16px]" />}
                </button>
              )}
              <button
                onClick={onExplain}
                disabled={loading || !hasWeather}
                className={`
                  px-4 py-2 sm:py-2.5 rounded-xl text-white text-xs sm:text-sm font-semibold
                  transition-all duration-200 cursor-pointer flex items-center gap-1.5 sm:gap-2
                  ${loading || !hasWeather
                    ? 'bg-gray-300 dark:bg-white/10 cursor-not-allowed'
                    : 'bg-accent hover:bg-accent/90 shadow-sm hover:shadow-md hover:scale-105 active:scale-95'
                  }
                `}
              >
                {loading ? (
                  <Loader2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-spin" />
                ) : (
                  <WandSparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                )}
                {loading ? 'Analyzing...' : 'Analyze'}
              </button>
            </div>
          </div>

          {!hasWeather && !response && (
            <div className="flex flex-col items-center gap-3 py-8 sm:py-10 text-center">
              <div className="w-14 h-14 rounded-2xl bg-muted dark:bg-muted-dark flex items-center justify-center">
                <Sparkles className={`w-6 h-6 text-subtext/40 dark:text-subtext-dark/30 transition-all duration-700 ${showSparkle ? 'scale-110 opacity-60' : ''}`} />
              </div>
              <div>
                <p className="text-sm font-medium text-text dark:text-text-dark/70">
                  AI Insights
                </p>
                <p className="text-xs sm:text-sm text-subtext dark:text-subtext-dark mt-1 max-w-xs mx-auto">
                  Search for a city and tap <span className="font-semibold text-accent">Analyze</span> to get AI-powered weather insights
                </p>
              </div>
            </div>
          )}

          {loading && (
            <div className="flex items-center gap-3 sm:gap-4 py-4 sm:py-5 px-4 sm:px-5 rounded-xl bg-muted dark:bg-muted-dark border border-border dark:border-border-dark">
              <div className="flex gap-1.5">
                <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-accent" style={{ animation: 'pulse-dot 1.4s infinite ease-in-out both', animationDelay: '0s' }} />
                <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-accent-light" style={{ animation: 'pulse-dot 1.4s infinite ease-in-out both', animationDelay: '0.16s' }} />
                <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-accent" style={{ animation: 'pulse-dot 1.4s infinite ease-in-out both', animationDelay: '0.32s' }} />
              </div>
              <span className="text-xs sm:text-sm font-medium text-subtext dark:text-subtext-dark">AI is analyzing the weather data...</span>
            </div>
          )}

          {response && expanded && (
            <div className="p-4 sm:p-5 rounded-xl bg-muted dark:bg-muted-dark border border-border dark:border-border-dark animate-fade-in">
              <div className="markdown-body text-xs sm:text-sm text-text dark:text-text-dark/85 leading-relaxed">
                <TypewriterText text={response} />
              </div>
            </div>
          )}

          {response && !expanded && (
            <p className="text-xs sm:text-sm text-subtext dark:text-subtext-dark truncate cursor-pointer hover:text-text dark:hover:text-text-dark transition-colors duration-200" onClick={() => setExpanded(true)}>
              {response.slice(0, 120)}...
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
