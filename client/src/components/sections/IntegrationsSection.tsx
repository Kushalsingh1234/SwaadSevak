import React from 'react';
import { SITE_CONTENT, IntegrationItem } from '../../content/site';
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
        return <Smartphone className="w-5 h-5 text-ember-500" />;
      case 'ondc':
        return <ShoppingBag className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />;
      case 'upi':
        return <CreditCard className="w-5 h-5 text-success-600" />;
      case 'tally':
        return <FileSpreadsheet className="w-5 h-5 text-amber-500" />;
      case 'whatsapp':
        return <MessageCircle className="w-5 h-5 text-success-500" />;
      default:
        return <Layers className="w-5 h-5 text-slate-500" />;
    }
  };

  return (
    <section className="py-16 sm:py-24 font-sans bg-ink-50/50 dark:bg-ink-900/30 border-t border-ink-200/80 dark:border-ink-800 overflow-hidden">
      <div className="max-w-container mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <Badge variant="neutral" className="mb-3">
            Ecosystem Integrations
          </Badge>
          <h2 className="h2-fluid font-bold text-ink-950 dark:text-ink-50 mb-3">
            Plugs into your existing delivery & payment accounts
          </h2>
          <p className="text-sm sm:text-base text-ink-600 dark:text-ink-300 leading-relaxed">
            Connect your delivery aggregators, dynamic UPI soundboxes, and accounting software without changing your workflow.
          </p>
        </div>

        {/* Integrations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
          {SITE_CONTENT.integrations.map((item: IntegrationItem) => (
            <div
              key={item.id}
              className="p-6 rounded-3xl bg-white dark:bg-ink-900 border border-ink-200 dark:border-ink-800 shadow-soft flex flex-col justify-between hover:border-ink-400 dark:hover:border-ink-600 transition-all"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-4">
                  <div className="p-2.5 rounded-xl bg-ink-50 dark:bg-ink-950">
                    {getIcon(item.id)}
                  </div>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-ink-100 dark:bg-ink-800 text-ink-700 dark:text-ink-200 uppercase">
                    {item.badge}
                  </span>
                </div>

                <h3 className="font-bold text-base text-ink-950 dark:text-ink-50 mb-1">
                  {item.name}
                </h3>

                <span className="text-xs font-mono font-semibold text-indigo-600 dark:text-indigo-400 block mb-2">
                  {item.category}
                </span>

                <p className="text-xs text-ink-600 dark:text-ink-300 leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-ink-100 dark:border-ink-800 flex items-center justify-between text-[11px] font-mono text-ink-400">
                <span>Direct API Bridge</span>
                <span className="text-success-600 font-bold">● Active Sync</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
