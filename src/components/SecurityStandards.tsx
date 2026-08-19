import React from 'react';
import { TranslationStrings } from '../types';
import { ShieldCheck, Lock, Cpu, FileKey2 } from 'lucide-react';

interface SecurityStandardsProps {
  t: TranslationStrings;
}

export const SecurityStandards: React.FC<SecurityStandardsProps> = ({ t }) => {
  return (
    <section id="security-standards-section" className="py-16 sm:py-20 bg-white text-slate-900 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-cyan-700 font-bold text-xs uppercase tracking-wider bg-cyan-50 px-3.5 py-1 rounded-full border border-cyan-200">
            Normes & Certifications
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 mt-3">
            {t.features.title}
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600">
            {t.features.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1 */}
          <div className="rounded-3xl bg-slate-50 border border-slate-200/80 p-6 flex flex-col justify-between hover:border-cyan-300 hover:shadow-md transition-all">
            <div>
              <div className="w-11 h-11 rounded-2xl bg-cyan-100 flex items-center justify-center text-cyan-700 mb-4">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">
                {t.features.encryptionTitle}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {t.features.encryptionDesc}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-200 text-[11px] font-mono font-bold text-cyan-800">
              Chiffrement 256-Bit SSL
            </div>
          </div>

          {/* Card 2 */}
          <div className="rounded-3xl bg-slate-50 border border-slate-200/80 p-6 flex flex-col justify-between hover:border-blue-300 hover:shadow-md transition-all">
            <div>
              <div className="w-11 h-11 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-700 mb-4">
                <Cpu className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">
                {t.features.instantTitle}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {t.features.instantDesc}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-200 text-[11px] font-mono font-bold text-blue-800">
              Audit instantané
            </div>
          </div>

          {/* Card 3 */}
          <div className="rounded-3xl bg-slate-50 border border-slate-200/80 p-6 flex flex-col justify-between hover:border-emerald-300 hover:shadow-md transition-all">
            <div>
              <div className="w-11 h-11 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-700 mb-4">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">
                {t.features.complianceTitle}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {t.features.complianceDesc}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-200 text-[11px] font-mono font-bold text-emerald-800">
              ISO/IEC 27001 & RGPD
            </div>
          </div>

          {/* Card 4 */}
          <div className="rounded-3xl bg-slate-50 border border-slate-200/80 p-6 flex flex-col justify-between hover:border-indigo-300 hover:shadow-md transition-all">
            <div>
              <div className="w-11 h-11 rounded-2xl bg-indigo-100 flex items-center justify-center text-indigo-700 mb-4">
                <FileKey2 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">
                {t.features.supportTitle}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {t.features.supportDesc}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-200 text-[11px] font-mono font-bold text-indigo-800">
              Traçabilité & Notifs
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
