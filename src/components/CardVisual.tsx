import React from 'react';
import { CardType } from '../types';

interface CardVisualProps {
  type: CardType;
  customImage?: string | null;
  className?: string;
}

export const CardVisual: React.FC<CardVisualProps> = ({ type, customImage, className = '' }) => {
  // If user uploaded a custom photo for this card, show it
  if (customImage) {
    return (
      <div className={`relative w-full aspect-[16/10] rounded-xl overflow-hidden shadow-md border border-slate-200 bg-slate-950 ${className}`}>
        <img
          src={customImage}
          alt={`Photo de carte ${type}`}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover"
        />
      </div>
    );
  }

  // Pixel-perfect rendered card photos based on uploaded images
  switch (type) {
    case 'PCS':
      return (
        <div className={`relative w-full aspect-[16/10] rounded-xl overflow-hidden bg-black text-white p-4 flex flex-col justify-between shadow-md border border-slate-800 select-none ${className}`}>
          {/* Top chip line */}
          <div className="flex justify-between items-start">
            <div className="w-7 h-5 rounded bg-amber-200/80 border border-amber-400/60 flex items-center justify-center">
              <div className="w-5 h-3 border-t border-b border-amber-700/40"></div>
            </div>
            <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest">PREPAID</span>
          </div>

          {/* Center PCS Outline Logo */}
          <div className="flex items-center justify-center my-auto">
            <div className="flex items-center gap-1.5">
              <span className="font-mono text-3xl sm:text-4xl font-extrabold tracking-widest text-[#f97316] drop-shadow-[0_0_8px_rgba(249,115,22,0.3)]">
                PCS
              </span>
            </div>
          </div>

          {/* Bottom Mastercard circles */}
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-300 font-sans tracking-wide">PCS CARD</span>
            <div className="flex items-center">
              <div className="w-5 h-5 rounded-full bg-red-600 opacity-90"></div>
              <div className="w-5 h-5 rounded-full bg-amber-500 opacity-90 -ml-2.5"></div>
            </div>
          </div>
        </div>
      );

    case 'Transcash':
      return (
        <div className={`relative w-full aspect-[16/10] rounded-xl overflow-hidden bg-gradient-to-b from-zinc-900 to-black text-white p-4 flex flex-col justify-between shadow-md border border-zinc-800 select-none ${className}`}>
          <div className="flex justify-between items-start">
            <div className="w-7 h-5 rounded bg-amber-200/80 border border-amber-400/60"></div>
            <span className="text-[9px] font-mono text-red-400 uppercase tracking-widest">RECHARGE</span>
          </div>

          {/* Center Transcash Swoosh & Logo */}
          <div className="flex flex-col items-center justify-center my-auto relative">
            {/* Red swoosh ring */}
            <div className="absolute w-24 h-12 rounded-full border-2 border-red-500 -rotate-12 opacity-80 pointer-events-none"></div>
            <div className="relative z-10 flex items-center">
              <span className="font-extrabold text-2xl sm:text-3xl tracking-tight text-white">
                trans<span className="text-red-500">cash</span>
              </span>
              <span className="text-xs text-red-400 font-bold ml-0.5">®</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-300">Mastercard</span>
            <div className="flex items-center">
              <div className="w-5 h-5 rounded-full bg-red-600 opacity-90"></div>
              <div className="w-5 h-5 rounded-full bg-amber-500 opacity-90 -ml-2.5"></div>
            </div>
          </div>
        </div>
      );

    case 'Neosurf':
      return (
        <div className={`relative w-full aspect-[16/10] rounded-xl overflow-hidden bg-white text-slate-900 p-4 flex flex-col justify-between shadow-md border border-pink-100 select-none ${className}`}>
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-bold text-pink-600 uppercase tracking-wider">Ticket Sécurisé</span>
            <span className="w-2 h-2 rounded-full bg-pink-500 animate-pulse"></span>
          </div>

          {/* Center Neosurf Pink Logo */}
          <div className="flex items-center justify-center my-auto">
            <span className="font-black text-3xl sm:text-4xl text-[#ec4899] tracking-tight drop-shadow-sm font-sans">
              Neosurf
            </span>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[10px] text-slate-500">
            <span>Paiement en ligne</span>
            <span className="font-mono font-bold text-pink-600">PIN 10 Caractères</span>
          </div>
        </div>
      );

    case 'Google Play':
      return (
        <div className={`relative w-full aspect-[16/10] rounded-xl overflow-hidden bg-white text-slate-900 p-4 flex flex-col justify-between shadow-md border border-slate-200 select-none ${className}`}>
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Carte Cadeau</span>
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">OFFICIEL</span>
          </div>

          {/* Center Google Play Triangle Logo */}
          <div className="flex items-center justify-center gap-2.5 my-auto">
            <svg viewBox="0 0 100 100" className="w-9 h-9 sm:w-11 sm:h-11">
              <path d="M15,10 L70,45 L15,80 Z" fill="#4285F4" />
              <path d="M15,10 L70,45 L45,60 Z" fill="#0F9D58" />
              <path d="M70,45 L90,55 L70,65 Z" fill="#FFBC00" />
              <path d="M15,80 L70,45 L90,55 Z" fill="#EA4335" />
            </svg>
            <div className="flex flex-col">
              <span className="font-extrabold text-xl sm:text-2xl text-slate-800 tracking-tight leading-none">
                Google <span className="text-slate-600 font-bold">Play</span>
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[10px] text-slate-500">
            <span>Code Recharge</span>
            <span className="font-mono font-bold text-emerald-600">Play Store</span>
          </div>
        </div>
      );

    case 'Steam':
      return (
        <div className={`relative w-full aspect-[16/10] rounded-xl overflow-hidden bg-gradient-to-tr from-blue-700 via-blue-600 to-indigo-600 text-white p-4 flex flex-col justify-between shadow-md border border-blue-400 select-none ${className}`}>
          <div className="flex justify-between items-center">
            <span className="text-[9px] font-mono text-blue-200 uppercase tracking-widest">WALLET CARD</span>
            <span className="text-[9px] font-bold bg-white/20 px-2 py-0.5 rounded-full text-white">VALVE</span>
          </div>

          {/* Center Steam Valve Logo & Bold Font */}
          <div className="flex items-center justify-center gap-3 my-auto">
            <div className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center">
              <div className="w-3.5 h-3.5 rounded-full bg-white"></div>
            </div>
            <span className="font-black text-2xl sm:text-3xl tracking-widest text-white">
              STEAM<span className="text-xs font-normal">®</span>
            </span>
          </div>

          <div className="flex items-center justify-between text-[10px] text-blue-100">
            <span>Porte-monnaie Steam</span>
            <span className="font-mono font-bold text-white">15-16 Chiffres</span>
          </div>
        </div>
      );

    case 'iTunes':
      return (
        <div className={`relative w-full aspect-[16/10] rounded-xl overflow-hidden bg-white text-slate-900 p-4 flex flex-col justify-between shadow-md border border-slate-200 select-none ${className}`}>
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Apple Gift Card</span>
            <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full">App Store</span>
          </div>

          {/* Center Colorful iTunes Apple Logo */}
          <div className="flex flex-col items-center justify-center my-auto">
            {/* Colorful stylized apple badge */}
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-pink-500 via-amber-400 to-cyan-400 p-1 flex items-center justify-center shadow-md">
              <span className="text-white text-lg font-bold"></span>
            </div>
            <span className="font-extrabold text-lg sm:text-xl text-slate-900 mt-1 tracking-tight">
              iTunes
            </span>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[10px] text-slate-500">
            <span>Apple Store & Arcade</span>
            <span className="font-mono font-bold text-purple-700">Code X...</span>
          </div>
        </div>
      );

    case 'Paysafecard':
      return (
        <div className={`relative w-full aspect-[16/10] rounded-xl overflow-hidden bg-white text-slate-900 p-4 flex flex-col justify-between shadow-md border border-blue-200 select-none ${className}`}>
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider">Paiement Prépayé</span>
            <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full">PIN 16</span>
          </div>

          {/* Center Paysafecard Blue Lock and Logo */}
          <div className="flex items-center justify-center gap-2.5 my-auto">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold shadow-sm">
              <span className="text-base">🔒</span>
            </div>
            <span className="font-black text-2xl sm:text-3xl text-blue-700 tracking-tight">
              paysafe<span className="text-blue-900">card</span>
            </span>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[10px] text-slate-500">
            <span>Sécurité certifiée</span>
            <span className="font-mono font-bold text-blue-700">16 Chiffres</span>
          </div>
        </div>
      );

    default:
      return null;
  }
};
