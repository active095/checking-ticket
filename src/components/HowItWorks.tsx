import React from 'react';
import { TranslationStrings } from '../types';
import { FileText, KeyRound, CheckCircle2, ShieldCheck } from 'lucide-react';

interface HowItWorksProps {
  t: TranslationStrings;
  onNavigateToActivation: () => void;
}

export const HowItWorks: React.FC<HowItWorksProps> = ({ t, onNavigateToActivation }) => {
  return (
    <section id="how-it-works-section" className="py-16 sm:py-20 bg-slate-50 text-slate-900 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-cyan-700 font-bold text-xs uppercase tracking-wider bg-cyan-100/80 px-3.5 py-1 rounded-full border border-cyan-200">
            Guide d'utilisation
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-3 text-slate-900">
            {t.howItWorks.title}
          </h2>
        </div>

        {/* 3 Step Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 relative">
          {/* Step 1 */}
          <div className="rounded-3xl bg-white border border-slate-200/90 p-6 sm:p-8 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-cyan-50 border border-cyan-100 flex items-center justify-center text-cyan-600 mb-6">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                {t.howItWorks.step1Title}
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {t.howItWorks.step1Desc}
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 text-xs text-cyan-700 font-mono font-bold">
              Étape 01/03 • Saisie
            </div>
          </div>

          {/* Step 2 */}
          <div className="rounded-3xl bg-white border border-slate-200/90 p-6 sm:p-8 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 mb-6">
                <KeyRound className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                {t.howItWorks.step2Title}
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {t.howItWorks.step2Desc}
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 text-xs text-blue-700 font-mono font-bold">
              Étape 02/03 • Masquage Sécurisé
            </div>
          </div>

          {/* Step 3 */}
          <div className="rounded-3xl bg-white border border-slate-200/90 p-6 sm:p-8 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 mb-6">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                {t.howItWorks.step3Title}
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {t.howItWorks.step3Desc}
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 text-xs text-emerald-700 font-mono font-bold">
              Étape 03/03 • Accusé & Suivi
            </div>
          </div>
        </div>

        {/* Action Callout */}
        <div className="mt-12 text-center">
          <button
            onClick={onNavigateToActivation}
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-white hover:bg-slate-50 text-slate-900 border border-slate-200 hover:border-cyan-300 text-sm font-bold transition-all shadow-sm cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4 text-cyan-600" />
            <span>Accéder au formulaire de validation officiel</span>
          </button>
        </div>

      </div>
    </section>
  );
};
