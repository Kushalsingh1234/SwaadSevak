import React from 'react';
import { SwaadSevakLogo } from '../ui/SwaadSevakLogo';
import { SITE_CONTENT } from '../../content/site';
import { Phone, Mail, MapPin, Shield, CheckCircle2, Globe } from 'lucide-react';
import { useTranslation } from '../../i18n';

export const Footer: React.FC = () => {
  const { language, toggleLanguage } = useTranslation();

  return (
    <footer className="bg-maroon-950 text-cream-100 pt-16 pb-28 sm:pb-16 border-t border-maroon-900 font-sans">
      <div className="max-w-container mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 pb-12 border-b border-dashed border-maroon-800/60">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <SwaadSevakLogo size="md" />
            <p className="text-sm text-cream-200/70 max-w-sm leading-relaxed">
              {SITE_CONTENT.brand.tagline}. Built specifically for Indian restaurants, cafés, cloud kitchens, and food chains.
            </p>
            <div className="flex items-center gap-2 text-xs font-mono text-saffron-400/90 pt-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-curry-400" />
              <span>100% Indian GST, KOT & UPI Compliant</span>
            </div>
            <div className="pt-2">
              <button
                onClick={toggleLanguage}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-maroon-900/80 hover:bg-maroon-800 text-xs font-semibold text-cream-100 border border-maroon-800 transition-colors cursor-pointer focus-ring"
              >
                <Globe className="w-3.5 h-3.5 text-saffron-400" />
                <span>Switch Language to {language === 'en' ? 'हिन्दी (Hindi)' : 'English'}</span>
              </button>
            </div>
          </div>

          {/* Product Links */}
          <div className="space-y-3 text-sm">
            <h4 className="font-serif font-bold text-cream-50 text-base">Product</h4>
            <ul className="space-y-2.5 text-cream-200/70">
              <li>
                <a href={SITE_CONTENT.links.features} className="hover:text-saffron-400 transition-colors">
                  3-Click POS Billing
                </a>
              </li>
              <li>
                <a href={SITE_CONTENT.links.features} className="hover:text-saffron-400 transition-colors">
                  Offline KOT Engine
                </a>
              </li>
              <li>
                <a href={SITE_CONTENT.links.website24h} className="hover:text-saffron-400 transition-colors flex items-center gap-1">
                  <span>Website in 24 Hours</span>
                  <span className="text-[10px] bg-saffron-500 text-white font-bold px-1.5 rounded">Fast</span>
                </a>
              </li>
              <li>
                <a href={SITE_CONTENT.links.features} className="hover:text-saffron-400 transition-colors">
                  Recipe Inventory System
                </a>
              </li>
              <li>
                <a href={SITE_CONTENT.links.calculator} className="hover:text-saffron-400 transition-colors">
                  Savings Calculator
                </a>
              </li>
            </ul>
          </div>

          {/* Outlet Types */}
          <div className="space-y-3 text-sm">
            <h4 className="font-serif font-bold text-cream-50 text-base">Outlet Types</h4>
            <ul className="space-y-2.5 text-cream-200/70">
              <li><a href="#outlets" className="hover:text-saffron-400 transition-colors">Café & Bistro</a></li>
              <li><a href="#outlets" className="hover:text-saffron-400 transition-colors">Quick Service (QSR)</a></li>
              <li><a href="#outlets" className="hover:text-saffron-400 transition-colors">Cloud Kitchens (Multi-brand)</a></li>
              <li><a href="#outlets" className="hover:text-saffron-400 transition-colors">Fine Dine & Restro-Bars</a></li>
              <li><a href="#outlets" className="hover:text-saffron-400 transition-colors">Multi-Outlet Food Chains</a></li>
            </ul>
          </div>

          {/* Contact & Legal */}
          <div className="space-y-3 text-sm">
            <h4 className="font-serif font-bold text-cream-50 text-base">Contact & Support</h4>
            <div className="space-y-2.5 text-cream-200/70 text-xs sm:text-sm">
              <a href={`tel:${SITE_CONTENT.brand.supportPhoneRaw}`} className="flex items-center gap-2 hover:text-saffron-400 transition-colors">
                <Phone className="w-4 h-4 text-saffron-400 shrink-0" />
                <span>{SITE_CONTENT.brand.supportPhone}</span>
              </a>
              <a href={`mailto:${SITE_CONTENT.brand.supportEmail}`} className="flex items-center gap-2 hover:text-saffron-400 transition-colors">
                <Mail className="w-4 h-4 text-saffron-400 shrink-0" />
                <span>{SITE_CONTENT.brand.supportEmail}</span>
              </a>
              <div className="flex items-start gap-2 pt-1 text-xs text-cream-300/60 leading-relaxed">
                <MapPin className="w-4 h-4 text-saffron-400 shrink-0 mt-0.5" />
                <span>{SITE_CONTENT.brand.officeAddress}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-cream-300/60">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-curry-400" />
            <span>© {new Date().getFullYear()} {SITE_CONTENT.brand.legalName}. All rights reserved.</span>
          </div>

          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            <a href={SITE_CONTENT.links.privacy} className="hover:text-cream-100 transition-colors">
              Privacy Policy
            </a>
            <a href={SITE_CONTENT.links.terms} className="hover:text-cream-100 transition-colors">
              Terms of Service
            </a>
            <a href={SITE_CONTENT.links.refund} className="hover:text-cream-100 transition-colors">
              Refund & Cancellation Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
