import React from 'react';
import { CardType, TranslationStrings } from '../types';
import { ShieldCheck, ArrowRight } from 'lucide-react';
import { CardVisual } from './CardVisual';
import { CARD_ASSETS_CONFIG } from '../data/cardAssets';

interface SupportedCardsProps {
  t: TranslationStrings;
  onSelectCard?: (cardType: CardType) => void;
}

export const SupportedCards: React.FC<SupportedCardsProps> = ({ t, onSelectCard }) => {
  return (
    <section id="supported-cards-section" className="py-16 sm:py-20 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Cards Grid with Realistic Visuals / Photos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-7">
          {CARD_ASSETS_CONFIG.map((card) => {
            return (
              <div
                key={card.type}
                id={`card-item-${card.type.toLowerCase().replace(/\s+/g, '-')}`}
                className="rounded-3xl bg-white border border-slate-200/90 p-4 sm:p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl shadow-sm flex flex-col justify-between group relative overflow-hidden"
              >
                <div>
                  {/* Photo / Card Visual Mockup */}
                  <div 
                    onClick={() => onSelectCard && onSelectCard(card.type)}
                    className="cursor-pointer relative overflow-hidden rounded-2xl group/img"
                  >
                    <CardVisual type={card.type} />
                    
                    {/* Hover Overlay with Activation CTA */}
                    <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white font-bold text-xs backdrop-blur-[2px]">
                      <ShieldCheck className="w-4 h-4 text-cyan-400" />
                      <span>{t.supportedCards.clickToActivate || 'Cliquer pour activer'}</span>
                    </div>
                  </div>

                  {/* Card Title & Info */}
                  <div className="mt-4 flex items-center justify-between">
                    <div>
                      <h3 className="font-extrabold text-lg text-slate-900 group-hover:text-cyan-600 transition-colors">
                        {card.title}
                      </h3>
                      <p className="text-xs text-slate-500 font-medium mt-0.5">
                        {t.supportedCards.cardSubtitles?.[card.type] || card.subtitle}
                      </p>
                    </div>
                    <span className="text-[11px] font-mono font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                      {card.currency}
                    </span>
                  </div>
                </div>

                {/* Bottom Actions Row */}
                <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-end text-xs">
                  {/* Activation Button */}
                  <button
                    type="button"
                    onClick={() => onSelectCard && onSelectCard(card.type)}
                    className="inline-flex items-center gap-1.5 text-cyan-700 hover:text-cyan-800 font-bold group-hover:translate-x-0.5 transition-transform cursor-pointer"
                  >
                    <span>{t.supportedCards.verifyButton || 'Activation'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
