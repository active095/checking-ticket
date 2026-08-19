import React from 'react';
import { ArrowRight, KeyRound } from 'lucide-react';
import { TranslationStrings } from '../types';
import heroDefaultBanner from '../../assets/image/image1.jpg';

interface HeroSectionProps {
  t: TranslationStrings;
  onNavigateToActivation: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ t, onNavigateToActivation }) => {
  const customHeroImage = localStorage.getItem('checking_ticket_hero_img');
  const heroOpacity = Number(localStorage.getItem('checking_ticket_hero_opacity') || '22');
  const activeHeroImage = customHeroImage || heroDefaultBanner;

  return (
    <section 
      id="hero-section" 
      className="relative overflow-hidden bg-gradient-to-b from-slate-50 via-white to-slate-50 text-slate-900 min-h-[500px] sm:min-h-[580px] flex items-center justify-center py-14 sm:py-20 border-b border-slate-200"
    >
      
      {/* 1. Full Background Image with tuned, executive opacity */}
      <div className="absolute inset-0 z-0 select-none overflow-hidden">
        <img
          src={activeHeroImage}
          alt="Fond Checking Ticket"
          referrerPolicy="no-referrer"
          style={{ opacity: heroOpacity / 100 }}
          className="w-full h-full object-cover object-center filter saturate-[1.1] transition-opacity duration-300"
        />
        {/* Subtle dot pattern texture */}
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#0284c7_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none"></div>
      </div>

      {/* 2. Text elements sitting directly and elegantly over the background */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center w-full flex flex-col items-center">
        
        {/* Primary Headline */}
        <h1 
          id="hero-headline"
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-slate-950 leading-tight mb-5 drop-shadow-sm"
        >
          {t.hero.headline}
        </h1>

        {/* Subtitle */}
        <p 
          id="hero-subtext"
          className="text-base sm:text-lg md:text-xl text-slate-600 max-w-2xl mx-auto font-medium leading-relaxed mb-8 sm:mb-10 text-balance"
        >
          {t.hero.subheadline}
        </p>

        {/* CTA Activation Button */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-2">
          <button
            id="hero-activation-cta-btn"
            onClick={onNavigateToActivation}
            className="w-full sm:w-auto px-10 py-4 rounded-full bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 hover:from-cyan-500 hover:via-blue-500 hover:to-indigo-500 text-white font-bold text-base sm:text-lg shadow-xl shadow-cyan-500/25 hover:shadow-cyan-500/40 transform hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 flex items-center justify-center gap-3 group cursor-pointer"
          >
            <KeyRound className="w-5 h-5 text-white" />
            <span>{t.hero.ctaButton}</span>
            <ArrowRight className="w-5 h-5 text-white group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

      </div>

    </section>
  );
};

