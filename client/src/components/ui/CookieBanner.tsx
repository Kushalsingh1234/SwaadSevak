import React, { useState, useEffect } from 'react';
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
    trackEvent('cookie_consent', { consent: 'accepted_all' });
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
      className="fixed bottom-20 sm:bottom-6 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-50 p-5 rounded-2xl bg-espresso text-white border border-walnut shadow-elevated font-sans"
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-orange-400 shrink-0" />
          <h4 className="font-bold text-sm text-white">Privacy &amp; Cookie Preferences</h4>
        </div>
        <button
          onClick={handleReject}
          aria-label="Close cookie banner"
          className="text-sand-300 hover:text-white focus-ring rounded"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <p className="text-xs text-sand-200 leading-relaxed mb-4">
        We use essential cookies for security and anonymous performance metrics to provide faster order routing.
      </p>

      {showCustomize && (
        <div className="mb-4 p-3 rounded-xl bg-cocoa border border-walnut space-y-2 text-xs text-sand-100">
          <div className="flex items-center justify-between">
            <span className="font-semibold">Essential (Required)</span>
            <span className="text-[10px] uppercase font-bold text-success">Always Active</span>
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
              className="accent-orange-500 w-4 h-4 rounded cursor-pointer"
            />
          </div>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-2 justify-end">
        {!showCustomize ? (
          <>
            <button
              onClick={() => setShowCustomize(true)}
              className="px-3 py-1.5 text-xs font-semibold text-sand-300 hover:text-white cursor-pointer"
            >
              Customise
            </button>
            <button
              onClick={handleReject}
              className="px-3 py-1.5 rounded-lg border border-walnut text-xs font-bold text-sand-100 hover:bg-cocoa cursor-pointer"
            >
              Reject
            </button>
            <button
              onClick={handleAccept}
              className="btn-shine px-4 py-1.5 rounded-lg bg-orange-500 text-espresso text-xs font-bold hover:bg-orange-600 shadow-soft cursor-pointer"
            >
              Accept All
            </button>
          </>
        ) : (
          <button
            onClick={handleSaveCustom}
            className="btn-shine px-4 py-1.5 rounded-lg bg-orange-500 text-espresso text-xs font-bold hover:bg-orange-600 shadow-soft cursor-pointer"
          >
            Save Preferences
          </button>
        )}
      </div>
    </aside>
  );
};
