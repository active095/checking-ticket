import React from 'react';
import { Language, TranslationStrings } from '../types';
import { ShieldCheck, Lock, CheckCircle2 } from 'lucide-react';
import { BrandLogo } from './BrandLogo';

interface FooterProps {
  currentLang: Language;
  onLanguageChange: (lang: Language) => void;
  t: TranslationStrings;
}

interface FooterLangOption {
  code: Language;
  label: string;
}

const FOOTER_LANGS: FooterLangOption[] = [
  { code: 'en', label: 'English (US)' },
  { code: 'fr', label: 'Français' },
  { code: 'de', label: 'Deutsch' },
  { code: 'it', label: 'Italiano' },
  { code: 'pt', label: 'Português' },
  { code: 'es', label: 'Español' },
];

export const Footer: React.FC<FooterProps> = ({ currentLang, onLanguageChange, t }) => {
  return (
    <footer id="main-footer" className="w-full bg-black text-neutral-400 border-t border-neutral-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col items-center justify-center text-center space-y-6">
        
        {/* Brand & Security Stamp */}
        <div className="flex items-center justify-center">
          <BrandLogo size="lg" textColor="#38bdf8" />
        </div>

        {/* Security & Standard notice */}
        <p className="text-xs text-neutral-400 max-w-xl leading-relaxed">
          {t.footer.securityNotice}
        </p>

        {/* Languages Row */}
        <div id="footer-languages-container" className="flex flex-wrap items-center justify-center gap-x-2.5 gap-y-1.5 text-xs sm:text-sm text-neutral-300 font-medium">
          {FOOTER_LANGS.map((item, index) => {
            const isSelected = item.code === currentLang;
            return (
              <React.Fragment key={item.code}>
                <button
                  id={`footer-lang-${item.code}`}
                  onClick={() => onLanguageChange(item.code)}
                  className={`hover:text-cyan-400 transition-colors py-1 px-1.5 rounded ${
                    isSelected ? 'text-cyan-400 font-bold underline underline-offset-4 decoration-cyan-400' : 'text-neutral-400 hover:text-neutral-200'
                  }`}
                >
                  {item.label}
                </button>
                {index < FOOTER_LANGS.length - 1 && (
                  <span className="text-neutral-700 select-none">|</span>
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Copyright Notice */}
        <div className="pt-4 border-t border-neutral-900 w-full flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-500 gap-4">
          <div id="footer-copyright-text" className="font-normal text-neutral-400">
            {t.footer.copyright}
          </div>

          <div className="flex items-center gap-4 text-[11px] text-neutral-400">
            {/*<span className="flex items-center gap-1">
              <Lock className="w-3 h-3 text-emerald-400" />
              SSL 256-Bit Standard
            </span>
            <span>•</span>*/}
            <span>{t.footer.standards}</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
