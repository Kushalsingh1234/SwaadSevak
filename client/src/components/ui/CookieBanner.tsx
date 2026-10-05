import React, { useState, useEffect } from 'react';
import { Button } from './Button';
import { ShieldCheck, X } from 'lucide-react';
import { trackEvent } from '../../lib/analytics';

const COOKIE_STORAGE_KEY = 'swaadsevak_cookie_consent';

export const CookieBanner: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [showCustomize, setShowCustomize] = useState(false);
  const [analyticsConsent, setAnalyticsConsent] = useState(true);

  useEffect(() => {
    try {
      const consent = localStorage.getItem(COOKIE_STORAGE_KEY);
      if (!consent) {
        setIsVisible(true);
      }
    } catch {
      // Ignore
    }
  }, []);

  const handleAccept = () => {
    try {
      localStorage.setItem(COOKIE_STORAGE_KEY, JSON.stringify({ essential: true, analytics: true }));
    } catch {
      // Ignore
    }
    trackEvent('pricing_plan_select', { consent: 'accepted_all' });
    setIsVisible(false);
  };

  const handleReject = () => {
    try {
      localStorage.setItem(COOKIE_STORAGE_KEY, JSON.stringify({ essential: true, analytics: false }));
    } catch {
      // Ignore
    }
    setIsVisible(false);
  };

  const handleSaveCustom = () => {
    try {
      localStorage.setItem(COOKIE_STORAGE_KEY, JSON.stringify({ essential: true, analytics: analyticsConsent }));
    } catch {
      // Ignore
    }
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <aside
      role="region"
      aria-label="Cookie Preferences"
      className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-50 p-5 rounded-2xl bg-white dark:bg-ink-900 border border-ink-200 dark:border-ink-800 shadow-elevated text-ink-950 dark:text-ink-50 font-sans"
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-ember-500 shrink-0" />
          <h4 className="font-bold text-sm">Privacy & Cookie Settings</h4>
        </div>
        <button
          onClick={handleReject}
          aria-label="Close cookie banner"
          className="text-ink-400 hover:text-ink-700 dark:hover:text-ink-200 focus-ring rounded"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <p className="text-xs text-ink-600 dark:text-ink-300 leading-relaxed mb-4">
        We use essential cookies to maintain secure sessions, and anonymous privacy-friendly metrics to ensure fast page loads.
      </p>

      {showCustomize && (
        <div className="mb-4 p-3 rounded-xl bg-ink-50 dark:bg-ink-950 border border-ink-200 dark:border-ink-800 space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-semibold">Essential (Required)</span>
            <span className="text-[10px] uppercase font-bold text-success-600">Always Active</span>
          </div>
          <div className="flex items-center justify-between">
            <label htmlFor="analytics-consent-checkbox" className="font-medium cursor-pointer">
              Anonymous Performance Metrics
            </label>
            <input
              id="analytics-consent-checkbox"
              type="checkbox"
              checked={analyticsConsent}
              onChange={(e) => setAnalyticsConsent(e.target.checked)}
              className="accent-ember-500 w-4 h-4 rounded cursor-pointer"
            />
          </div>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-2 justify-end">
        {!showCustomize ? (
          <>
            <button
              onClick={() => setShowCustomize(true)}
              className="text-xs font-semibold text-ink-500 hover:text-ink-900 dark:hover:text-ink-100 hover:underline px-2 py-1 focus-ring"
            >
              Customise
            </button>
            <Button size="sm" variant="outline" onClick={handleReject}>
              Reject Non-Essential
            </Button>
            <Button size="sm" variant="ember" onClick={handleAccept}>
              Accept All
            </Button>
          </>
        ) : (
          <Button size="sm" variant="ember" onClick={handleSaveCustom}>
            Save Preferences
          </Button>
        )}
      </div>
    </aside>
  );
};
