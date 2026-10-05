import React, { useState, useEffect } from 'react';
import { SwaadSevakLogo } from '../ui/SwaadSevakLogo';
import { SITE_CONTENT } from '../../content/site';
import { Menu, X, ArrowRight } from 'lucide-react';
import { trackEvent } from '../../lib/analytics';

export const Header: React.FC = () => {
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
    trackEvent('nav_click', { navSection: section });
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 border-b ${
        isScrolled ? 'py-4 backdrop-blur-md border-walnut/50 shadow-elevated' : 'py-4 sm:py-5 border-walnut/30'
      }`}
      style={{ backgroundColor: isScrolled ? 'rgba(26, 15, 10, 0.92)' : '#1A0F0A' }}
    >
      <div className="max-w-[1700px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 flex items-center justify-between gap-6">
        {/* Brand Logo */}
        <a href="#" className="focus-ring rounded-lg shrink-0 flex items-center gap-3">
          <SwaadSevakLogo size="lg" lightText />
        </a>

        {/* Desktop Navigation - Enlarged Typography & Spacing */}
        <nav className="hidden lg:flex items-center gap-8 xl:gap-10 text-base font-bold text-sand-100 font-sans">
          <a
            href="#products"
            onClick={() => handleNavClick('products')}
            className="hover:text-orange-400 transition-colors focus-ring rounded py-1"
          >
            Products
          </a>
          <a
            href={SITE_CONTENT.links.pricing}
            onClick={() => handleNavClick('pricing')}
            className="hover:text-orange-400 transition-colors focus-ring rounded py-1"
          >
            Pricing
          </a>
          <a
            href={SITE_CONTENT.links.websiteInquiry}
            onClick={() => handleNavClick('website')}
            className="flex items-center gap-2 hover:text-orange-400 transition-colors focus-ring rounded group py-1"
          >
            <span>Website</span>
            <span className="text-[11px] uppercase font-black tracking-wider px-2 py-0.5 rounded-md bg-orange-500/20 text-orange-400 border border-orange-500/30 group-hover:bg-orange-500 group-hover:text-espresso-950 transition-colors">
              24h Quote
            </span>
          </a>
          <a
            href="#why-us"
            onClick={() => handleNavClick('why-us')}
            className="hover:text-orange-400 transition-colors focus-ring rounded py-1"
          >
            Resources
          </a>
          <a
            href={SITE_CONTENT.links.faq}
            onClick={() => handleNavClick('faq')}
            className="hover:text-orange-400 transition-colors focus-ring rounded py-1"
          >
            FAQ
          </a>
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-4">
          {/* Orange Primary Button - Enlarged */}
          <a
            href={SITE_CONTENT.links.demo}
            data-event="header_get_started_click"
            onClick={() => trackEvent('header_get_started_click')}
            className="btn-shine hidden sm:inline-flex items-center justify-center gap-2.5 px-6 sm:px-7 py-3 rounded-xl font-extrabold text-base bg-orange-500 text-espresso hover:bg-orange-600 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-glow-orange focus-ring"
            style={{ color: '#1A0F0A' }}
          >
            <span>Get started</span>
            <ArrowRight className="w-5 h-5" />
          </a>

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2.5 rounded-xl border border-walnut text-sand-100 hover:bg-cocoa transition-colors focus-ring cursor-pointer"
            aria-label="Toggle mobile menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6 text-white" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-espresso-950 border-b border-walnut px-4 pt-3 pb-6 space-y-3 animate-fadeIn">
          <nav className="flex flex-col space-y-2 text-sm font-semibold text-sand-100">
            <a
              href="#products"
              onClick={() => handleNavClick('products')}
              className="px-3 py-2 rounded-lg hover:bg-cocoa transition-colors"
            >
              Products
            </a>
            <a
              href={SITE_CONTENT.links.pricing}
              onClick={() => handleNavClick('pricing')}
              className="px-3 py-2 rounded-lg hover:bg-cocoa transition-colors"
            >
              Pricing
            </a>
            <a
              href={SITE_CONTENT.links.websiteInquiry}
              onClick={() => handleNavClick('website')}
              className="px-3 py-2 rounded-lg hover:bg-cocoa transition-colors flex items-center justify-between"
            >
              <span>Website</span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-orange-500/20 text-orange-400">
                24h Quote
              </span>
            </a>
            <a
              href="#why-us"
              onClick={() => handleNavClick('why-us')}
              className="px-3 py-2 rounded-lg hover:bg-cocoa transition-colors"
            >
              Resources
            </a>
            <a
              href={SITE_CONTENT.links.faq}
              onClick={() => handleNavClick('faq')}
              className="px-3 py-2 rounded-lg hover:bg-cocoa transition-colors"
            >
              FAQ
            </a>
          </nav>

          <div className="pt-2">
            <a
              href={SITE_CONTENT.links.demo}
              onClick={() => {
                setMobileMenuOpen(false);
                trackEvent('mobile_menu_demo_click');
              }}
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-bold text-sm bg-orange-500 text-espresso hover:bg-orange-600 transition-colors shadow-soft"
            >
              <span>Get started</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
