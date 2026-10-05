import React from 'react';
import { SITE_CONTENT, Integration } from '../../content/site';
import { Badge } from '../ui/Badge';
import {
  Smartphone,
  CreditCard,
  FileSpreadsheet,
  MessageCircle,
  Layers,
  ShoppingBag,
} from 'lucide-react';

export const IntegrationsSection: React.FC = () => {
  const getIcon = (id: string) => {
    switch (id) {
      case 'zomato':
      case 'swiggy':
        return <Smartphone className="w-5 h-5 text-red-500" />;
      case 'ondc':
        return <ShoppingBag className="w-5 h-5 text-blue-500" />;
      case 'upi':
        return <CreditCard className="w-5 h-5 text-curry-600" />;
      case 'tally':
        return <FileSpreadsheet className="w-5 h-5 text-amber-600" />;
      case 'whatsapp':
        return <MessageCircle className="w-5 h-5 text-emerald-500" />;
      default:
        return <Layers className="w-5 h-5 text-saffron-500" />;
    }
  };

  return (
    <section className="py-16 sm:py-24 font-sans bg-cream-100/60 dark:bg-maroon-900/20 border-t border-receipt-divider dark:border-maroon-800">
      <div className="max-w-container mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <Badge variant="maroon" className="mb-3">
            Ecosystem Connectivity
          </Badge>
          <h2 className="h2-fluid font-serif font-bold text-maroon-950 dark:text-cream-50 mb-3">
            Plugs into the software & hardware you already rely on
          </h2>
          <p className="text-sm sm:text-base text-maroon-900/80 dark:text-cream-200/80 leading-relaxed">
            Zero rip-and-replace. Connect your delivery accounts, payment soundboxes, and accounting registers in minutes.
          </p>
        </div>

        {/* Integrations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SITE_CONTENT.integrations.map((integration) => (
            <div
              key={integration.id}
              className="p-6 rounded-3xl bg-paper dark:bg-paper-dark border border-receipt-divider dark:border-maroon-800 shadow-sm hover:shadow-receipt transition-all text-left flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-4">
                  <div className="p-3 rounded-2xl bg-cream-100 dark:bg-maroon-900/50">
                    {getIcon(integration.id)}
                  </div>
                  <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-cream-200 dark:bg-maroon-900 text-maroon-800 dark:text-cream-200 uppercase tracking-wider">
                    {integration.badge}
                  </span>
                </div>

                <h3 className="font-bold text-lg text-maroon-950 dark:text-cream-50 mb-1.5">
                  {integration.name}
                </h3>

                <span className="text-xs font-mono font-semibold text-saffron-700 dark:text-saffron-400 block mb-2">
                  {integration.category}
                </span>

                <p className="text-xs text-maroon-900/70 dark:text-cream-200/70 leading-relaxed">
                  {integration.description}
                </p>
              </div>

              {/* Verified Tag / Verification notice */}
              <div className="pt-4 mt-4 border-t border-dashed border-receipt-divider dark:border-maroon-800 flex items-center justify-between text-[11px] font-mono text-receipt-faint">
                <span>API Status: Verified Ready</span>
                <span className="text-curry-600 font-bold">● Active Sync</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
