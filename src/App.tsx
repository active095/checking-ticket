import React, { useState, useEffect } from 'react';
import { Language, CardType } from './types';
import { translations } from './translations';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { SupportedCards } from './components/SupportedCards';
import { ActivationForm } from './components/ActivationForm';
import { Footer } from './components/Footer';
import { EmailPreviewModal } from './components/EmailPreviewModal';

export default function App() {
  const [currentLang, setCurrentLang] = useState<Language>('fr');
  const [activeView, setActiveView] = useState<'home' | 'activation'>('home');
  const [selectedCard, setSelectedCard] = useState<CardType>('Transcash');
  const [isEmailPreviewOpen, setIsEmailPreviewOpen] = useState<boolean>(false);

  const t = translations[currentLang] || translations.fr;

  // Scroll to top upon page navigation
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeView]);

  const handleSelectCardFromHome = (cardType: CardType) => {
    setSelectedCard(cardType);
    setActiveView('activation');
  };

  const handleLanguageChange = (lang: Language) => {
    setCurrentLang(lang);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-cyan-600 selection:text-white">
      
      {/* Navigation Header */}
      <Navbar
        currentLang={currentLang}
        onLanguageChange={handleLanguageChange}
        activeView={activeView}
        onNavigate={setActiveView}
        t={t}
        onOpenEmailPreview={() => setIsEmailPreviewOpen(true)}
      />

      {/* Main Content View Switcher */}
      <main className="flex-grow">
        {activeView === 'home' ? (
          <div className="animate-in fade-in duration-300">
            {/* 1. Hero Section (Short, modern, with background and required texts) */}
            <HeroSection
              t={t}
              onNavigateToActivation={() => {
                setSelectedCard('Transcash');
                setActiveView('activation');
              }}
            />

            {/* 2. Supported Prepaid Cards Showcase */}
            <SupportedCards
              t={t}
              onSelectCard={handleSelectCardFromHome}
            />
          </div>
        ) : (
          <div className="animate-in fade-in duration-300">
            {/* Activation & Code Validation Form */}
            <ActivationForm
              t={t}
              currentLang={currentLang}
              initialCardType={selectedCard}
              onNavigateHome={() => setActiveView('home')}
              onOpenEmailPreview={() => setIsEmailPreviewOpen(true)}
            />
          </div>
        )}
      </main>

      {/* Full-width Black Footer with Copyright & Multilingual bar */}
      <Footer
        currentLang={currentLang}
        onLanguageChange={handleLanguageChange}
        t={t}
      />

      {/* Email Notification Preview Modal (Inspector for Admin & User emails) */}
      <EmailPreviewModal
        isOpen={isEmailPreviewOpen}
        onClose={() => setIsEmailPreviewOpen(false)}
        t={t}
        currentLang={currentLang}
      />

    </div>
  );
}

