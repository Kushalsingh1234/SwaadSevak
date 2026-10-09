import React, { useState, useEffect } from 'react';
import { SwaadSevakLogo } from '../ui/SwaadSevakLogo';
import { SITE_CONTENT } from '../../content/site';
import { Menu, X, ArrowRight } from 'lucide-react';
import { trackEvent } from '../../lib/analytics';

interface HeaderProps {
  onOpenLogin?: () => void;
  isLoggedIn?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onOpenLogin, isLoggedIn = false }) => {
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

  const handleLoginClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    trackEvent(isLoggedIn ? 'header_dashboard_click' : 'header_get_started_click');
    if (onOpenLogin) {
      onOpenLogin();
    } else {
      window.location.hash = isLoggedIn ? 'dashboard' : 'login';
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300 ${
        isScrolled
          ? 'py-3.5 sm:py-4 border-b border-walnut/40 shadow-elevated backdrop-blur-md'
          : 'py-5 sm:py-6 border-b border-transparent bg-transparent'
      }`}
      style={{
        backgroundColor: isScrolled ? 'rgba(26, 15, 10, 0.95)' : 'transparent',
      }}
    >
      <div className="max-w-[1700px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 flex items-center justify-between gap-6">
        {/* Brand Logo */}
        <a href="#" className="focus-ring rounded-lg shrink-0 flex items-center gap-3">
          <SwaadSevakLogo size="lg" lightText />
        </a>

        {/* Desktop Navigation - Enlarged Typography & Spacing */}
        <nav className="hidden lg:flex items-center gap-8 xl:gap-10 text-base font-bold text-white/90 font-sans">
          <a
            href="#products"
            onClick={() => handleNavClick('products')}
            className="text-white/90 hover:text-orange-400 transition-colors focus-ring rounded py-1"
          >
            Products
          </a>
          <a
            href="#features"
            onClick={() => handleNavClick('features')}
            className="text-white/90 hover:text-orange-400 transition-colors focus-ring rounded py-1"
          >
            Features
          </a>
          <a
            href="#calculator"
            onClick={() => handleNavClick('calculator')}
            className="text-white/90 hover:text-orange-400 transition-colors focus-ring rounded py-1"
          >
            Calculator
          </a>
          <a
            href={SITE_CONTENT.links.websiteInquiry}
            onClick={() => handleNavClick('website')}
            className="flex items-center gap-2 text-white/90 hover:text-orange-400 transition-colors focus-ring rounded group py-1"
          >
            <span>Website</span>
            <span className="text-[11px] uppercase font-black tracking-wider px-2 py-0.5 rounded-md bg-orange-500/20 text-orange-400 border border-orange-500/30 group-hover:bg-orange-500 group-hover:text-espresso-950 transition-colors">
              24h Quote
            </span>
          </a>
          <a
            href="#why-us"
            onClick={() => handleNavClick('why-us')}
            className="text-white/90 hover:text-orange-400 transition-colors focus-ring rounded py-1"
          >
            Why Us
          </a>
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-4">
          {/* Primary CTA Button: Platform Login or Go to Dashboard */}
          <a
            href={isLoggedIn ? "#dashboard" : "#login"}
            data-event={isLoggedIn ? "header_dashboard_click" : "header_get_started_click"}
            onClick={handleLoginClick}
            className="btn-shine hidden sm:inline-flex items-center justify-center gap-2.5 px-6 sm:px-7 py-3 rounded-xl font-extrabold text-base bg-orange-500 text-espresso hover:bg-orange-600 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-glow-orange focus-ring cursor-pointer"
            style={{ color: '#1A0F0A' }}
          >
            <span>{isLoggedIn ? 'Go to Dashboard' : 'Platform Login'}</span>
            <ArrowRight className="w-5 h-5" />
          </a>

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2.5 rounded-xl border border-walnut text-white/90 hover:bg-cocoa transition-colors focus-ring cursor-pointer"
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
          <nav className="flex flex-col space-y-2 text-sm font-semibold text-white/90">
            <a
              href="#products"
              onClick={() => handleNavClick('products')}
              className="px-3 py-2 rounded-lg text-white/90 hover:text-orange-400 hover:bg-white/5 transition-colors"
            >
              Products
            </a>
            <a
              href="#features"
              onClick={() => handleNavClick('features')}
              className="px-3 py-2 rounded-lg text-white/90 hover:text-orange-400 hover:bg-white/5 transition-colors"
            >
              Features
            </a>
            <a
              href="#calculator"
              onClick={() => handleNavClick('calculator')}
              className="px-3 py-2 rounded-lg text-white/90 hover:text-orange-400 hover:bg-white/5 transition-colors"
            >
              Calculator
            </a>
            <a
              href={SITE_CONTENT.links.websiteInquiry}
              onClick={() => handleNavClick('website')}
              className="px-3 py-2 rounded-lg text-white/90 hover:text-orange-400 hover:bg-white/5 transition-colors flex items-center justify-between"
            >
              <span>Website</span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-orange-500/20 text-orange-400">
                24h Quote
              </span>
            </a>
            <a
              href="#why-us"
              onClick={() => handleNavClick('why-us')}
              className="px-3 py-2 rounded-lg text-white/90 hover:text-orange-400 hover:bg-white/5 transition-colors"
            >
              Why Us
            </a>
          </nav>

          <div className="pt-2">
            <a
              href={isLoggedIn ? "#dashboard" : "#login"}
              onClick={handleLoginClick}
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-bold text-sm bg-orange-500 text-espresso hover:bg-orange-600 transition-colors shadow-soft cursor-pointer"
            >
              <span>{isLoggedIn ? 'Go to Dashboard' : 'Platform Login'}</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
