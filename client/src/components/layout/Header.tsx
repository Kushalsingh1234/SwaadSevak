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
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled
          ? 'py-2.5 bg-cream-50/95 dark:bg-maroon-950/95 backdrop-blur-md shadow-sm border-b border-receipt-divider dark:border-maroon-800/60'
          : 'py-4 bg-cream-50/80 dark:bg-maroon-950/80 backdrop-blur-sm'
      }`}
    >
      <div className="max-w-container mx-auto px-4 sm:px-6 flex items-center justify-between gap-4">
        {/* Logo */}
        <a href="#" className="focus-ring rounded-lg shrink-0">
          <SwaadSevakLogo size={isScrolled ? 'sm' : 'md'} />
        </a>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-7 text-sm font-semibold text-maroon-900/80 dark:text-cream-200/80 font-sans">
          <a
            href={SITE_CONTENT.links.features}
            onClick={() => handleNavClick('features')}
            className="hover:text-saffron-600 dark:hover:text-saffron-400 transition-colors focus-ring rounded"
          >
            {t.nav.features}
          </a>
          <a
            href={SITE_CONTENT.links.website24h}
            onClick={() => handleNavClick('website24h')}
            className="flex items-center gap-1.5 hover:text-saffron-600 dark:hover:text-saffron-400 transition-colors focus-ring rounded group"
          >
            <span>{t.nav.website24h}</span>
            <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-full bg-saffron-100 dark:bg-saffron-950 text-saffron-700 dark:text-saffron-300 group-hover:bg-saffron-500 group-hover:text-white transition-colors">
              New
            </span>
          </a>
          <a
            href="#outlets"
            onClick={() => handleNavClick('outlets')}
            className="hover:text-saffron-600 dark:hover:text-saffron-400 transition-colors focus-ring rounded"
          >
            {t.nav.outletTypes}
          </a>
          <a
            href={SITE_CONTENT.links.pricing}
            onClick={() => handleNavClick('pricing')}
            className="hover:text-saffron-600 dark:hover:text-saffron-400 transition-colors focus-ring rounded"
          >
            {t.nav.pricing}
          </a>
          <a
            href={SITE_CONTENT.links.faq}
            onClick={() => handleNavClick('faq')}
            className="hover:text-saffron-600 dark:hover:text-saffron-400 transition-colors focus-ring rounded"
          >
            {t.nav.faq}
          </a>
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5 sm:gap-3.5">
          {/* Language Switch */}
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-receipt-divider dark:border-maroon-800 text-xs font-bold text-maroon-900 dark:text-cream-100 hover:bg-cream-200/60 dark:hover:bg-maroon-900/50 transition-colors focus-ring"
            aria-label={`Switch to ${language === 'en' ? 'Hindi' : 'English'}`}
          >
            <Globe className="w-3.5 h-3.5 text-saffron-600 dark:text-saffron-400" />
            <span>{language === 'en' ? 'हिन्दी' : 'EN'}</span>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl border border-receipt-divider dark:border-maroon-800 text-maroon-900 dark:text-cream-100 hover:bg-cream-200/60 dark:hover:bg-maroon-900/50 transition-colors focus-ring"
            aria-label="Toggle dark/light theme"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-saffron-400" />
            ) : (
              <Moon className="w-4 h-4 text-maroon-900" />
            )}
          </button>

          {/* Direct Phone link (hidden on small mobile) */}
          <a
            href={`tel:${SITE_CONTENT.brand.supportPhoneRaw}`}
            className="hidden xl:flex items-center gap-1.5 text-xs font-bold text-maroon-900 dark:text-cream-100 hover:text-saffron-600 dark:hover:text-saffron-400 px-2 py-1 focus-ring rounded"
          >
            <Phone className="w-3.5 h-3.5 text-saffron-500" />
            <span>{SITE_CONTENT.brand.supportPhone}</span>
          </a>

          {/* Book Demo CTA Button */}
          <div className="hidden sm:block">
            <a href={SITE_CONTENT.links.demo}>
              <Button
                variant="saffron"
                size={isScrolled ? 'sm' : 'md'}
                analyticsEvent="demo_cta_click"
                eventPayload={{ location: 'header' }}
                icon={<ArrowRight className="w-4 h-4" />}
              >
                {t.nav.bookDemo}
              </Button>
            </a>
          </div>

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl border border-receipt-divider dark:border-maroon-800 text-maroon-950 dark:text-cream-50 focus-ring"
            aria-label="Open mobile navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-receipt-divider dark:border-maroon-800 bg-paper dark:bg-maroon-950 px-6 py-5 shadow-receipt space-y-4 animate-ticket-drop font-sans">
          <nav className="flex flex-col space-y-3 font-semibold text-base text-maroon-900 dark:text-cream-100">
            <a
              href={SITE_CONTENT.links.features}
              onClick={() => handleNavClick('features')}
              className="py-1 hover:text-saffron-600"
            >
              {t.nav.features}
            </a>
            <a
              href={SITE_CONTENT.links.website24h}
              onClick={() => handleNavClick('website24h')}
              className="py-1 flex items-center justify-between text-saffron-600 dark:text-saffron-400"
            >
              <span>{t.nav.website24h}</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-saffron-100 dark:bg-saffron-900">
                Guaranteed 24h
              </span>
            </a>
            <a
              href="#outlets"
              onClick={() => handleNavClick('outlets')}
              className="py-1 hover:text-saffron-600"
            >
              {t.nav.outletTypes}
            </a>
            <a
              href={SITE_CONTENT.links.calculator}
              onClick={() => handleNavClick('calculator')}
              className="py-1 hover:text-saffron-600"
            >
              Savings Calculator
            </a>
            <a
              href={SITE_CONTENT.links.pricing}
              onClick={() => handleNavClick('pricing')}
              className="py-1 hover:text-saffron-600"
            >
              {t.nav.pricing}
            </a>
            <a
              href={SITE_CONTENT.links.faq}
              onClick={() => handleNavClick('faq')}
              className="py-1 hover:text-saffron-600"
            >
              {t.nav.faq}
            </a>
          </nav>

          <div className="pt-3 border-t border-dashed border-receipt-divider dark:border-maroon-800 flex flex-col gap-3">
            <a
              href={`tel:${SITE_CONTENT.brand.supportPhoneRaw}`}
              className="flex items-center gap-2 text-sm font-semibold text-maroon-900 dark:text-cream-100"
            >
              <Phone className="w-4 h-4 text-saffron-500" />
              <span>Call Us: {SITE_CONTENT.brand.supportPhone}</span>
            </a>
            <a href={SITE_CONTENT.links.demo} onClick={() => setMobileMenuOpen(false)}>
              <Button fullWidth variant="saffron" size="md">
                {t.nav.bookDemo}
              </Button>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
