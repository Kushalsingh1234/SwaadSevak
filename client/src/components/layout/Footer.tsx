import React from 'react';
import { SwaadSevakLogo } from '../ui/SwaadSevakLogo';
import { SITE_CONTENT } from '../../content/site';
import { Phone, Mail, MapPin, ShieldCheck, CheckCircle2, Globe } from 'lucide-react';
import { useTranslation } from '../../i18n';

export const Footer: React.FC = () => {
  const { language, toggleLanguage } = useTranslation();

  return (
    <footer className="bg-ink-950 text-ink-300 pt-16 pb-28 sm:pb-16 border-t border-ink-800 font-sans text-left">
      <div className="max-w-container mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 pb-12 border-b border-ink-800">
          
          {/* Brand Column (2 Cols) */}
          <div className="lg:col-span-2 space-y-4">
            <SwaadSevakLogo size="md" />
            <p className="text-xs sm:text-sm text-ink-400 max-w-sm leading-relaxed">
              {SITE_CONTENT.brand.tagline}. Built specifically for Indian restaurants, cafés, cloud kitchens, and food chains.
            </p>
            <div className="flex items-center gap-2 text-xs font-mono text-ink-300 pt-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-success-500" />
              <span>100% Indian GST, KOT & UPI Compliant</span>
            </div>
            <div className="pt-2">
              <button
                onClick={toggleLanguage}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-ink-900 hover:bg-ink-800 text-xs font-semibold text-ink-200 border border-ink-800 transition-colors cursor-pointer focus-ring"
              >
                <Globe className="w-3.5 h-3.5 text-ember-500" />
                <span>Switch Language to {language === 'en' ? 'हिन्दी (Hindi)' : 'English'}</span>
              </button>
            </div>
          </div>

          {/* Product Links */}
          <div className="space-y-3 text-xs sm:text-sm">
            <h4 className="font-bold text-white text-sm">Product</h4>
            <ul className="space-y-2 text-ink-400">
              <li>
                <a href={SITE_CONTENT.links.product} className="hover:text-white transition-colors">
                  POS Billing Screen
                </a>
              </li>
              <li>
                <a href={SITE_CONTENT.links.features} className="hover:text-white transition-colors">
                  Offline KOT Engine
                </a>
              </li>
              <li>
                <a href={SITE_CONTENT.links.websiteInquiry} className="hover:text-white transition-colors flex items-center gap-1.5">
                  <span>Website Advisory</span>
                  <span className="text-[10px] font-mono bg-ember-500 text-ink-950 font-bold px-1 rounded">24h</span>
                </a>
              </li>
              <li>
                <a href={SITE_CONTENT.links.features} className="hover:text-white transition-colors">
                  Recipe Inventory System
                </a>
              </li>
              <li>
                <a href={SITE_CONTENT.links.calculator} className="hover:text-white transition-colors">
                  Savings Calculator
                </a>
              </li>
            </ul>
          </div>

          {/* Outlet Types */}
          <div className="space-y-3 text-xs sm:text-sm">
            <h4 className="font-bold text-white text-sm">Outlet Formats</h4>
            <ul className="space-y-2 text-ink-400">
              <li><a href="#outlets" className="hover:text-white transition-colors">Café & Bistro</a></li>
              <li><a href="#outlets" className="hover:text-white transition-colors">Quick Service (QSR)</a></li>
              <li><a href="#outlets" className="hover:text-white transition-colors">Cloud Kitchens</a></li>
              <li><a href="#outlets" className="hover:text-white transition-colors">Fine Dining & Bars</a></li>
              <li><a href="#outlets" className="hover:text-white transition-colors">Multi-Outlet Chains</a></li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div className="space-y-3 text-xs sm:text-sm">
            <h4 className="font-bold text-white text-sm">Contact & Support</h4>
            <div className="space-y-2 text-ink-400">
              <a href={`tel:${SITE_CONTENT.brand.supportPhoneRaw}`} className="flex items-center gap-2 hover:text-white transition-colors">
                <Phone className="w-4 h-4 text-ember-500 shrink-0" />
                <span>{SITE_CONTENT.brand.supportPhone}</span>
              </a>
              <a href={`mailto:${SITE_CONTENT.brand.supportEmail}`} className="flex items-center gap-2 hover:text-white transition-colors">
                <Mail className="w-4 h-4 text-ember-500 shrink-0" />
                <span>{SITE_CONTENT.brand.supportEmail}</span>
              </a>
              <div className="flex items-start gap-2 pt-1 text-xs text-ink-500 leading-relaxed">
                <MapPin className="w-4 h-4 text-ember-500 shrink-0 mt-0.5" />
                <span>{SITE_CONTENT.brand.officeAddress}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-ink-500">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-success-500" />
            <span>© {new Date().getFullYear()} {SITE_CONTENT.brand.legalName}. All rights reserved.</span>
          </div>

          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            <a href={SITE_CONTENT.links.privacy} className="hover:text-ink-200 transition-colors">
              Privacy Policy
            </a>
            <a href={SITE_CONTENT.links.terms} className="hover:text-ink-200 transition-colors">
              Terms of Service
            </a>
            <a href={SITE_CONTENT.links.refund} className="hover:text-ink-200 transition-colors">
              Refund Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
