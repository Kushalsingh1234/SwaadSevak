import React from 'react';
import { SwaadSevakLogo } from '../ui/SwaadSevakLogo';
import { SITE_CONTENT } from '../../content/site';
import { Phone, Mail, MessageCircle, MapPin, ShieldCheck, Award } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer 
      className="text-[#F5E9DD] pt-8 pb-12 sm:pb-8 border-t border-[#5A3A28]/40 font-sans text-left"
      style={{ backgroundColor: '#2B1A12' }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Top 4-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 sm:gap-8 pb-8 border-b border-[#5A3A28]/50">
          
          {/* Brand Column (2 Cols) */}
          <div className="lg:col-span-2 space-y-3">
            <div className="inline-block">
              <SwaadSevakLogo size="sm" lightText={true} />
            </div>
            <p className="text-xs sm:text-[13px] text-[#D8C2B0] max-w-sm leading-relaxed font-normal">
              {SITE_CONTENT.brand.tagline}. Built specifically for Indian restaurants, cafés, cloud kitchens, and multi-outlet chains.
            </p>
            
            {/* Country Badge */}
            <div className="pt-1 flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#3D2519] text-[11px] font-bold text-[#F5E9DD] border border-[#5A3A28]">
                <span>🇮🇳</span>
                <span>Built for Indian Food Businesses</span>
              </span>
            </div>
          </div>

          {/* Product Links */}
          <div className="space-y-2 text-xs">
            <h4 className="font-extrabold text-white text-[12px] uppercase tracking-wider">Products</h4>
            <ul className="space-y-2 text-[#C4A895] font-medium text-[12px]">
              <li>
                <a href="#products" className="hover:text-orange-400 hover:underline transition-colors">
                  POS &amp; KOT Billing
                </a>
              </li>
              <li>
                <a href="#products" className="hover:text-orange-400 hover:underline transition-colors">
                  Online Orders Hub
                </a>
              </li>
              <li>
                <a href="#products" className="hover:text-orange-400 hover:underline transition-colors">
                  Recipe Inventory Engine
                </a>
              </li>
              <li>
                <a href={SITE_CONTENT.links.websiteInquiry} className="hover:text-orange-400 hover:underline transition-colors flex items-center gap-1.5">
                  <span>Restaurant Website</span>
                  <span className="text-[9px] font-mono bg-orange-500 text-white font-bold px-1.5 py-0.2 rounded">24h</span>
                </a>
              </li>
              <li>
                <a href={SITE_CONTENT.links.calculator} className="hover:text-orange-400 hover:underline transition-colors">
                  Savings Calculator
                </a>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-2 text-xs">
            <h4 className="font-extrabold text-white text-[12px] uppercase tracking-wider">Resources</h4>
            <ul className="space-y-2 text-[#C4A895] font-medium text-[12px]">
              <li><a href="#features" className="hover:text-orange-400 hover:underline transition-colors">Core Features</a></li>
              <li><a href="#why-us" className="hover:text-orange-400 hover:underline transition-colors">Why SwaadSevak</a></li>
              <li><a href="#ecosystem" className="hover:text-orange-400 hover:underline transition-colors">Ecosystem</a></li>
              <li><a href="#calculator" className="hover:text-orange-400 hover:underline transition-colors">Calculator</a></li>
              <li><a href={SITE_CONTENT.links.demo} className="hover:text-orange-400 hover:underline transition-colors">Get Started</a></li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div className="space-y-2 text-xs">
            <h4 className="font-extrabold text-white text-[12px] uppercase tracking-wider">Contact &amp; Support</h4>
            <div className="space-y-2 text-[#C4A895] font-medium text-[12px]">
              <a href={`tel:${SITE_CONTENT.brand.supportPhoneRaw}`} className="flex items-center gap-2 hover:text-orange-400 transition-colors">
                <Phone className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                <span>{SITE_CONTENT.brand.supportPhone}</span>
              </a>
              <a
                href={`https://wa.me/${SITE_CONTENT.brand.whatsappNumber}?text=Hi%20SwaadSevak%2C%20I%20would%20like%20to%20know%20more%20about%20your%20restaurant%20POS.`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-orange-400 transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                <span>WhatsApp Live Desk</span>
              </a>
              <a href={`mailto:${SITE_CONTENT.brand.supportEmail}`} className="flex items-center gap-2 hover:text-orange-400 transition-colors">
                <Mail className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                <span>{SITE_CONTENT.brand.supportEmail}</span>
              </a>
              <div className="flex items-start gap-2 pt-1 text-[11px] text-[#A89080] leading-relaxed">
                <MapPin className="w-3.5 h-3.5 text-orange-400 shrink-0 mt-0.5" />
                <span>{SITE_CONTENT.brand.officeAddress}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Certification & Benchmark Badges Row */}
        <div className="py-4 border-b border-[#5A3A28]/40 flex flex-wrap items-center justify-between gap-3 text-xs">
          <span className="font-mono text-orange-400/90 font-bold text-[10px] uppercase tracking-wider">
            Certification &amp; Benchmark Badges:
          </span>
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#3D2519] border border-[#5A3A28] text-[10px] text-[#F5E9DD] font-semibold">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              <span>GST &amp; DLT Compliant</span>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#3D2519] border border-[#5A3A28] text-[10px] text-[#F5E9DD] font-semibold">
              <Award className="w-3 h-3 text-orange-400" />
              <span>ESC/POS Standard Certified</span>
            </div>
            <div className="px-2 py-1 rounded-lg bg-[#3D2519]/70 border border-[#5A3A28] text-[9px] font-mono text-[#C4A895] font-semibold uppercase">
              Verified Architecture
            </div>
          </div>
        </div>

        {/* Bottom Legal Row */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-[#A89080]">
          <p>© {new Date().getFullYear()} {SITE_CONTENT.brand.legalName}. All rights reserved.</p>
          <div className="flex items-center gap-4 sm:gap-6">
            <a href={SITE_CONTENT.links.privacy} className="hover:text-orange-400 hover:underline transition-colors">Privacy Policy</a>
            <a href={SITE_CONTENT.links.terms} className="hover:text-orange-400 hover:underline transition-colors">Terms of Service</a>
            <a href={SITE_CONTENT.links.refund} className="hover:text-orange-400 hover:underline transition-colors">Refund Policy</a>
            <a href="/security" className="hover:text-orange-400 hover:underline transition-colors">Security</a>
          </div>
        </div>

      </div>
    </footer>
  );
};
