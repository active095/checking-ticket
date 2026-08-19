import { CardType } from '../types';

export interface CardAssetInfo {
  type: CardType;
  title: string;
  subtitle: string;
  currency: string;
  format: string;
  defaultBg: string;
  themeColor: string;
  logoType: 'transcash' | 'neosurf' | 'pcs' | 'steam' | 'itunes' | 'paysafecard' | 'googleplay';
}

export const CARD_ASSETS_CONFIG: CardAssetInfo[] = [
  {
    type: 'Transcash',
    title: 'Transcash',
    subtitle: 'Recharges Mastercard',
    currency: '€ EUR',
    format: '12 Chiffres',
    defaultBg: 'bg-zinc-950',
    themeColor: '#ef4444',
    logoType: 'transcash',
  },
  {
    type: 'PCS',
    title: 'PCS',
    subtitle: 'Chrome, Black & Virtual Card',
    currency: '€ EUR',
    format: 'Recharge PCS',
    defaultBg: 'bg-slate-950',
    themeColor: '#f97316',
    logoType: 'pcs',
  },
  {
    type: 'Neosurf',
    title: 'Neosurf',
    subtitle: 'Tickets Classiques & Pro',
    currency: '€ EUR',
    format: '10 Caractères',
    defaultBg: 'bg-white',
    themeColor: '#ec4899',
    logoType: 'neosurf',
  },
  {
    type: 'Google Play',
    title: 'Google Play',
    subtitle: 'Cartes Cadeaux & Codes Play',
    currency: '€ EUR',
    format: '16-20 Caractères',
    defaultBg: 'bg-white',
    themeColor: '#10b981',
    logoType: 'googleplay',
  },
  {
    type: 'Steam',
    title: 'Steam',
    subtitle: 'Porte-Monnaie Steam Card',
    currency: 'Multi-Devises',
    format: '15-16 Caractères',
    defaultBg: 'bg-gradient-to-br from-blue-600 to-indigo-800',
    themeColor: '#3b82f6',
    logoType: 'steam',
  },
  {
    type: 'iTunes',
    title: 'iTunes',
    subtitle: 'Apple Gift Card & App Store',
    currency: '€ EUR',
    format: '16 Caractères (X)',
    defaultBg: 'bg-white',
    themeColor: '#8b5cf6',
    logoType: 'itunes',
  },
  {
    type: 'Paysafecard',
    title: 'Paysafecard',
    subtitle: 'Code PIN 16 Chiffres',
    currency: '€ EUR',
    format: '16 Chiffres',
    defaultBg: 'bg-white',
    themeColor: '#3b82f6',
    logoType: 'paysafecard',
  },
];
