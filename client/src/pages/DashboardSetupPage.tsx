import React, { useState } from 'react';
import { UploadCloud, PlusCircle, Sparkles, ArrowRight, Store, CheckCircle } from 'lucide-react';
import { Restaurant } from '../types';
import { AiMenuModal } from '../components/AiMenuModal';

interface DashboardSetupPageProps {
  restaurant: Restaurant | null;
  onProceedToDashboard: () => void;
  onOpenManualAddDish: () => void;
}

export const DashboardSetupPage: React.FC<DashboardSetupPageProps> = ({
  restaurant,
  onProceedToDashboard,
  onOpenManualAddDish,
}) => {
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#1B120C] text-[#FFF7ED] flex flex-col justify-center items-center p-4 sm:p-6 lg:p-8 font-sans">
      <div className="max-w-3xl w-full text-center">
        {/* Restaurant Header */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.08] text-[#FF9E58] text-xs font-bold mb-4 border border-white/[0.12]">
          <Store className="w-3.5 h-3.5" />
          <span>{restaurant?.name || 'Your Restaurant'} • Onboarding Complete</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          How would you like to build your menu?
        </h1>
        <p className="mt-2 text-sm text-[#D4C3B3] max-w-md mx-auto">
          Choose an option below to set up your dishes. You can always edit, add, or toggle availability at any time.
        </p>

        {/* Two Main Cards */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
          {/* Option 1: Upload Menu PDF */}
          <div className="bg-[#251A12] rounded-3xl p-8 border border-brand-500/50 shadow-2xl flex flex-col justify-between hover:border-brand-500 transition-all group">
            <div>
              <div className="w-14 h-14 rounded-2xl bg-brand-500/20 text-[#FF9E58] flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
                <UploadCloud className="w-7 h-7" />
              </div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-brand-500/10 text-[#FF9E58] text-[10px] font-extrabold uppercase tracking-wider mb-2 border border-brand-500/20">
                <Sparkles className="w-3 h-3" />
                <span>Recommended</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                Upload Menu PDF
              </h3>
              <p className="text-xs text-[#D4C3B3] leading-relaxed">
                Let Swaad Sevak AI read your menu and create your dishes automatically. Extracts categories, vegetarian indicators, pricing variations & portions.
              </p>
            </div>

            <div className="mt-8">
              <button
                type="button"
                onClick={() => setIsAiModalOpen(true)}
                className="w-full py-3.5 px-4 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold shadow-lg shadow-brand-500/25 transition-all flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>Upload Menu PDF</span>
              </button>
            </div>
          </div>

          {/* Option 2: Add Menu Manually */}
          <div className="bg-[#251A12] rounded-3xl p-8 border border-white/[0.12] shadow-2xl flex flex-col justify-between hover:border-white/[0.25] transition-all group">
            <div>
              <div className="w-14 h-14 rounded-2xl bg-white/[0.06] text-[#FFF7ED] flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
                <PlusCircle className="w-7 h-7" />
              </div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/[0.06] text-stone-400 text-[10px] font-extrabold uppercase tracking-wider mb-2 border border-white/[0.08]">
                <span>Manual Control</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                Add Menu Manually
              </h3>
              <p className="text-xs text-stone-400 leading-relaxed">
                Create your menu yourself and customize every dish. Add categories, portion sizes, prices, and chef's recommendation tags with full control.
              </p>
            </div>

            <div className="mt-8">
              <button
                type="button"
                onClick={onOpenManualAddDish}
                className="w-full py-3.5 px-4 rounded-xl bg-[#140D08] hover:bg-[#1a110a] text-white text-xs font-bold border border-white/[0.12] transition-all flex items-center justify-center gap-2"
              >
                <span>Add Dishes Manually</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Skip to Dashboard */}
        <div className="mt-10 text-center">
          <button
            type="button"
            onClick={onProceedToDashboard}
            className="text-xs font-semibold text-stone-400 hover:text-white transition-colors"
          >
            Or proceed directly to Live Manager Dashboard →
          </button>
        </div>
      </div>

      {/* AI Menu Modal */}
      <AiMenuModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        onMenuImported={async () => {
          await onProceedToDashboard();
        }}
      />
    </div>
  );
};
