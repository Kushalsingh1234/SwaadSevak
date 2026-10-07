import React from 'react';
import { SITE_CONTENT } from '../../content/site';
import { Badge } from '../ui/Badge';
import { XCircle, CheckCircle2, ArrowRight } from 'lucide-react';

export const ProblemSolutionSection: React.FC = () => {
  return (
    <section className="py-16 sm:py-24 font-sans bg-white dark:bg-ink-950">
      <div className="max-w-container mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <Badge variant="neutral" className="mb-3">
            Operational Friction vs The Fix
          </Badge>
          <h2 className="h2-fluid font-bold text-ink-950 dark:text-ink-50 mb-3">
            Why traditional restaurant operations break under pressure
          </h2>
          <p className="text-sm sm:text-base text-ink-600 dark:text-ink-300 leading-relaxed">
            Running a busy kitchen is hard enough without fighting cluttered software, disconnected tablets, and recipe shrinkage.
          </p>
        </div>

        {/* 3 Problem -> Solution Rows */}
        <div className="space-y-6">
          {SITE_CONTENT.problemSolutions.map((item, idx) => (
            <div
              key={item.id}
              className="grid grid-cols-1 lg:grid-cols-12 rounded-2xl border border-ink-200 dark:border-ink-800 bg-ink-50/40 dark:bg-ink-900/30 overflow-hidden shadow-soft text-left"
            >
              {/* Problem Side (5 Cols) */}
              <div className="lg:col-span-5 p-6 sm:p-8 bg-ink-50/80 dark:bg-ink-900/60 border-b lg:border-b-0 lg:border-r border-ink-200 dark:border-ink-800 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-danger-600 dark:text-danger-400 font-semibold text-xs mb-3">
                    <XCircle className="w-4 h-4 shrink-0" />
                    <span className="uppercase tracking-wider font-mono">The Operational Pain</span>
                  </div>
                  <h3 className="font-bold text-base sm:text-lg text-ink-950 dark:text-ink-50 mb-2">
                    {item.problemTitle}
                  </h3>
                  <p className="text-xs sm:text-sm text-ink-600 dark:text-ink-300 leading-relaxed">
                    {item.problemDesc}
                  </p>
                </div>
              </div>

              {/* Solution Side (7 Cols) */}
              <div className="lg:col-span-7 p-6 sm:p-8 bg-white dark:bg-ink-900 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-success-600 dark:text-success-400 font-semibold text-xs mb-3">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span className="uppercase tracking-wider font-mono">The SwaadSevak Solution</span>
                  </div>
                  <h3 className="font-bold text-base sm:text-lg text-ink-950 dark:text-ink-50 mb-2">
                    {item.solutionTitle}
                  </h3>
                  <p className="text-xs sm:text-sm text-ink-600 dark:text-ink-300 leading-relaxed">
                    {item.solutionDesc}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-ink-100 dark:border-ink-800 flex items-center justify-between text-xs font-mono text-ink-500">
                  <span>Built for Indian kitchens</span>
                  <span className="text-ember-600 dark:text-ember-400 font-bold">Standard in all plans →</span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
