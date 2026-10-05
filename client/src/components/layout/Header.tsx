import React, { useState, useEffect } from 'react';
import { SwaadSevakLogo } from '../ui/SwaadSevakLogo';
import { Button } from '../ui/Button';
import { useTranslation } from '../../i18n';
import { useTheme } from '../../hooks/useTheme';
import { SITE_CONTENT } from '../../content/site';
import { Phone, Globe, Sun, Moon, Menu, X, ArrowRight } from 'lucide-react';
import { trackEvent } from '../../lib/analytics';

export const Header: React.FC = () => {
  const { t, language, toggleLanguage } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (section: string) => {
    setMobileMenuOpen(false);
    trackEvent('demo_cta_click', { navSection: section });
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-200 ${
        isScrolled
          ? 'py-2.5 bg-cream-50/95 dark:bg-ink-950/95 backdrop-blur-md shadow-soft border-b border-ink-200 dark:border-ink-800'
          : 'py-4 bg-cream-50/80 dark:bg-ink-950/80 backdrop-blur-sm'
      }`}
    >
      <div className="max-w-container mx-auto px-4 sm:px-6 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <a href="#" className="focus-ring rounded-lg shrink-0">
          <SwaadSevakLogo size={isScrolled ? 'sm' : 'md'} />
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-7 text-sm font-semibold text-ink-600 dark:text-ink-300 font-sans">
          <a
            href={SITE_CONTENT.links.product}
            onClick={() => handleNavClick('product')}
            className="hover:text-ink-950 dark:hover:text-white transition-colors focus-ring rounded"
          >
            {t.nav.features}
          </a>
          <a
            href={SITE_CONTENT.links.websiteInquiry}
            onClick={() => handleNavClick('website')}
            className="flex items-center gap-1.5 hover:text-ink-950 dark:hover:text-white transition-colors focus-ring rounded group"
          >
            <span>{t.nav.website24h}</span>
            <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-ember-50 dark:bg-ember-950/80 text-ember-600 dark:text-ember-400 group-hover:bg-ember-500 group-hover:text-ink-950 transition-colors">
              24h Quote
            </span>
          </a>
          <a
            href="#outlets"
            onClick={() => handleNavClick('outlets')}
            className="hover:text-ink-950 dark:hover:text-white transition-colors focus-ring rounded"
          >
            {t.nav.outletTypes}
          </a>
          <a
            href={SITE_CONTENT.links.pricing}
            onClick={() => handleNavClick('pricing')}
            className="hover:text-ink-950 dark:hover:text-white transition-colors focus-ring rounded"
          >
            {t.nav.pricing}
          </a>
          <a
            href={SITE_CONTENT.links.faq}
            onClick={() => handleNavClick('faq')}
            className="hover:text-ink-950 dark:hover:text-white transition-colors focus-ring rounded"
          >
            {t.nav.faq}
          </a>
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Language Switch */}
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-ink-200 dark:border-ink-800 text-xs font-bold text-ink-700 dark:text-ink-200 hover:bg-ink-50 dark:hover:bg-ink-900 transition-colors focus-ring cursor-pointer"
            aria-label={`Switch to ${language === 'en' ? 'Hindi' : 'English'}`}
          >
            <Globe className="w-3.5 h-3.5 text-ember-500" />
            <span>{language === 'en' ? 'हिन्दी' : 'EN'}</span>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg border border-ink-200 dark:border-ink-800 text-ink-700 dark:text-ink-200 hover:bg-ink-50 dark:hover:bg-ink-900 transition-colors focus-ring cursor-pointer"
            aria-label="Toggle dark/light theme"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-ember-400" />
            ) : (
              <Moon className="w-4 h-4 text-ink-900" />
            )}
          </button>

          {/* Support Phone (Desktop) */}
          <a
            href={`tel:${SITE_CONTENT.brand.supportPhoneRaw}`}
            className="hidden xl:flex items-center gap-1.5 text-xs font-semibold text-ink-700 dark:text-ink-300 hover:text-ink-950 dark:hover:text-white px-2 py-1 focus-ring rounded"
          >
            <Phone className="w-3.5 h-3.5 text-ember-500" />
            <span>{SITE_CONTENT.brand.supportPhone}</span>
          </a>

          {/* Book Demo CTA Button */}
          <div className="hidden sm:block">
            <a href={SITE_CONTENT.links.demo}>
              <Button
                variant="ember"
                size={isScrolled ? 'sm' : 'md'}
                analyticsEvent="demo_cta_click"
                eventPayload={{ location: 'header' }}
                icon={<ArrowRight className="w-3.5 h-3.5" />}
              >
                {t.nav.bookDemo}
              </Button>
            </a>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg border border-ink-200 dark:border-ink-800 text-ink-950 dark:text-ink-50 focus-ring cursor-pointer"
            aria-label="Open mobile navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-ink-200 dark:border-ink-800 bg-white dark:bg-ink-950 px-6 py-5 shadow-card space-y-4 font-sans text-left">
          <nav className="flex flex-col space-y-3 font-semibold text-sm text-ink-900 dark:text-ink-100">
            <a
              href={SITE_CONTENT.links.product}
              onClick={() => handleNavClick('product')}
              className="py-1 hover:text-ember-500"
            >
              {t.nav.features}
            </a>
            <a
              href={SITE_CONTENT.links.websiteInquiry}
              onClick={() => handleNavClick('website')}
              className="py-1 flex items-center justify-between text-ember-600 dark:text-ember-400"
            >
              <span>{t.nav.website24h}</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-ember-50 dark:bg-ember-950">
                24h Response
              </span>
            </a>
            <a
              href="#outlets"
              onClick={() => handleNavClick('outlets')}
              className="py-1 hover:text-ember-500"
            >
              {t.nav.outletTypes}
            </a>
            <a
              href={SITE_CONTENT.links.calculator}
              onClick={() => handleNavClick('calculator')}
              className="py-1 hover:text-ember-500"
            >
              Savings Calculator
            </a>
            <a
              href={SITE_CONTENT.links.pricing}
              onClick={() => handleNavClick('pricing')}
              className="py-1 hover:text-ember-500"
            >
              {t.nav.pricing}
            </a>
            <a
              href={SITE_CONTENT.links.faq}
              onClick={() => handleNavClick('faq')}
              className="py-1 hover:text-ember-500"
            >
              {t.nav.faq}
            </a>
          </nav>

          <div className="pt-3 border-t border-ink-200 dark:border-ink-800 flex flex-col gap-3">
            <a
              href={`tel:${SITE_CONTENT.brand.supportPhoneRaw}`}
              className="flex items-center gap-2 text-xs font-semibold text-ink-700 dark:text-ink-300"
            >
              <Phone className="w-3.5 h-3.5 text-ember-500" />
              <span>Call Support: {SITE_CONTENT.brand.supportPhone}</span>
            </a>
            <a href={SITE_CONTENT.links.demo} onClick={() => setMobileMenuOpen(false)}>
              <Button fullWidth variant="ember" size="md">
                {t.nav.bookDemo}
              </Button>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
