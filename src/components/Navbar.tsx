import React, { useState, useRef, useEffect } from 'react';
import { ShieldCheck, Lock, Globe, ChevronDown, Check, Menu, X, ArrowRight, Sparkles } from 'lucide-react';
import { Language, TranslationStrings } from '../types';
import { LANGUAGES } from '../translations';
import { BrandLogo } from './BrandLogo';

interface NavbarProps {
  currentLang: Language;
  onLanguageChange: (lang: Language) => void;
  activeView: 'home' | 'activation';
  onNavigate: (view: 'home' | 'activation') => void;
  t: TranslationStrings;
  onOpenEmailPreview?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentLang,
  onLanguageChange,
  activeView,
  onNavigate,
  t,
  onOpenEmailPreview,
}) => {
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLangObj = LANGUAGES.find((l) => l.code === currentLang) || LANGUAGES[0];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsLangDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="sticky top-0 z-50 pt-3 sm:pt-4 px-3 sm:px-6 lg:px-8 w-full transition-all duration-300">
      <header 
        id="main-header" 
        className="max-w-7xl mx-auto bg-white/95 backdrop-blur-md rounded-2xl sm:rounded-full border border-slate-200/90 shadow-lg shadow-slate-200/50 transition-all duration-300"
      >
        <div className="px-4 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between">
          
          {/* Brand Logo / Left Section */}
          <div 
            id="brand-logo"
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2.5 sm:gap-3.5 cursor-pointer group select-none"
          >
            <div className="flex items-center gap-2">
              <BrandLogo size="md" className="group-hover:opacity-90 transition-opacity" />
              {/*<span className="hidden sm:inline-flex items-center px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full h-fit self-center">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1 animate-pulse"></span>
                SSL Certifié
              </span>*/}
            </div>
          </div>

          {/* Desktop Nav Links & Controls */}
          <div className="hidden md:flex items-center space-x-2 lg:space-x-3">
            
            {/* Home Tab */}
            <button
              id="nav-link-home"
              onClick={() => onNavigate('home')}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                activeView === 'home'
                  ? 'bg-slate-100 text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              {t.nav.home}
            </button>

            {/* Activation Tab */}
            <button
              id="nav-link-activation"
              onClick={() => onNavigate('activation')}
              className={`px-5 py-2 rounded-full text-sm font-bold transition-all flex items-center gap-1.5 shadow-sm ${
                activeView === 'activation'
                  ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md shadow-cyan-500/25'
                  : 'bg-slate-900 hover:bg-slate-800 text-white'
              }`}
            >
              <span>{t.nav.activation}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            {/* Email Inspection diagnostic button             {onOpenEmailPreview && (
              <button
                id="header-email-preview-btn"
                onClick={onOpenEmailPreview}
                title="Prévisualiser les e-mails générés"
                className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/80 px-3 py-2 rounded-full border border-slate-200 transition-all"
              >
                <span>📬</span>
                <span className="hidden lg:inline">{t.emailPreview.buttonLabel}</span>
              </button>
            )}*/}


            {/* Language Selector Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                id="language-dropdown-button"
                onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
                className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-slate-50 hover:bg-slate-100 border border-slate-200 text-sm font-semibold text-slate-800 transition-all shadow-sm"
                aria-expanded={isLangDropdownOpen}
                aria-haspopup="true"
              >
                <span className="text-base" role="img" aria-label="Flag">
                  {currentLangObj.flag}
                </span>
                <span className="font-medium text-xs sm:text-sm">{currentLangObj.label}</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 text-slate-500 transition-transform duration-200 ${
                    isLangDropdownOpen ? 'rotate-180 text-cyan-600' : ''
                  }`}
                />
              </button>

              {isLangDropdownOpen && (
                <div 
                  id="language-dropdown-menu"
                  className="absolute right-0 mt-2 w-52 bg-white border border-slate-200 rounded-2xl shadow-xl py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150 overflow-hidden"
                >
                  <div className="px-3.5 py-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                    Sélectionnez la langue
                  </div>
                  {LANGUAGES.map((lang) => {
                    const isSelected = lang.code === currentLang;
                    return (
                      <button
                        key={lang.code}
                        id={`lang-option-${lang.code}`}
                        onClick={() => {
                          onLanguageChange(lang.code);
                          setIsLangDropdownOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3.5 py-2.5 text-sm text-left transition-colors ${
                          isSelected
                            ? 'bg-cyan-50 text-cyan-700 font-bold'
                            : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="text-base">{lang.flag}</span>
                          <span>{lang.nativeLabel}</span>
                        </div>
                        {isSelected && <Check className="w-4 h-4 text-cyan-600" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

          </div>

          {/* Mobile Right Controls */}
          <div className="flex items-center gap-2 md:hidden">
            {/* Quick Language Switcher on Mobile */}
            <button
              id="mobile-lang-btn"
              onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-xs font-bold text-slate-800"
            >
              <span>{currentLangObj.flag}</span>
              <span className="uppercase">{currentLangObj.code}</span>
              <ChevronDown className="w-3 h-3 text-slate-500" />
            </button>

            {/* Menu Toggle button */}
            <button
              id="mobile-menu-toggle"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-full text-slate-700 hover:text-slate-900 hover:bg-slate-100 focus:outline-none"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>

        {/* Mobile Language Dropdown Box */}
        {isLangDropdownOpen && (
          <div className="md:hidden bg-slate-50 border-t border-slate-200 px-4 py-3 rounded-b-2xl">
            <div className="grid grid-cols-2 gap-2">
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    onLanguageChange(lang.code);
                    setIsLangDropdownOpen(false);
                  }}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium ${
                    lang.code === currentLang
                      ? 'bg-cyan-600 text-white font-bold shadow-sm'
                      : 'bg-white text-slate-700 border border-slate-200 shadow-sm'
                  }`}
                >
                  <span>{lang.flag}</span>
                  <span>{lang.nativeLabel}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div id="mobile-nav-menu" className="md:hidden bg-white border-t border-slate-100 px-4 py-4 rounded-b-2xl space-y-2">
            <button
              onClick={() => {
                onNavigate('home');
                setIsMobileMenuOpen(false);
              }}
              className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold ${
                activeView === 'home'
                  ? 'bg-slate-100 text-cyan-700'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              {t.nav.home}
            </button>

            <button
              onClick={() => {
                onNavigate('activation');
                setIsMobileMenuOpen(false);
              }}
              className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-bold flex items-center justify-between ${
                activeView === 'activation'
                  ? 'bg-cyan-600 text-white'
                  : 'bg-slate-900 text-white'
              }`}
            >
              <span>{t.nav.activation}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {onOpenEmailPreview && (
              <button
                onClick={() => {
                  onOpenEmailPreview();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full text-left px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 bg-slate-50 border border-slate-200 flex items-center gap-2"
              >
                <span>📬</span>
                <span>{t.emailPreview.buttonLabel}</span>
              </button>
            )}
          </div>
        )}
      </header>
    </div>
  );
};
