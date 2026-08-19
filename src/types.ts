export type Language = 'fr' | 'en' | 'es' | 'de' | 'it' | 'pt';

export type CardType = 
  | 'Transcash'
  | 'Neosurf'
  | 'PCS'
  | 'Steam'
  | 'iTunes'
  | 'Paysafecard'
  | 'Google Play';

export interface TicketFormData {
  name: string;
  email: string;
  amount: string;
  cardType: CardType;
  code: string;
  hideCode: boolean;
}

export interface SubmissionResponse {
  success: boolean;
  referenceId?: string;
  timestamp?: string;
  name?: string;
  email?: string;
  cardType?: CardType;
  amount?: number;
  message?: string;
  error?: string;
  emailDelivery?: {
    adminNotified: boolean;
    userNotified: boolean;
  };
}

export interface LanguageOption {
  code: Language;
  label: string;
  flag: string;
  nativeLabel: string;
}

export interface TranslationStrings {
  siteTitle: string;
  tagline: string;
  nav: {
    home: string;
    activation: string;
    security: string;
    howItWorks: string;
    support: string;
    secureBadge?: string;
  };
  hero: {
    headline: string;
    subheadline: string;
    ctaButton: string;
    learnMore: string;
    trustedBy: string;
    activeSessions: string;
    sslGuaranteed: string;
  };
  features: {
    title: string;
    subtitle: string;
    encryptionTitle: string;
    encryptionDesc: string;
    instantTitle: string;
    instantDesc: string;
    complianceTitle: string;
    complianceDesc: string;
    supportTitle: string;
    supportDesc: string;
  };
  supportedCards: {
    title: string;
    subtitle: string;
    badge?: string;
    verifyButton?: string;
    clickToActivate?: string;
    cardSubtitles?: Record<CardType, string>;
  };
  howItWorks: {
    title: string;
    step1Title: string;
    step1Desc: string;
    step2Title: string;
    step2Desc: string;
    step3Title: string;
    step3Desc: string;
  };
  form: {
    pageTitle: string;
    pageSubtitle: string;
    securityNotice: string;
    nameLabel: string;
    namePlaceholder: string;
    emailLabel: string;
    emailPlaceholder: string;
    amountLabel: string;
    amountPlaceholder: string;
    cardTypeLabel: string;
    codeLabel: string;
    codePlaceholder: string;
    hideCodeLabel: string;
    hideCodeYes: string;
    hideCodeNo: string;
    cardReadyStatus?: string;
    cardDescriptions?: Record<CardType, string>;
    submitButton: string;
    submitting: string;
    errors: {
      nameRequired: string;
      emailInvalid: string;
      amountInvalid: string;
      codeRequired: string;
      generic: string;
    };
  };
  confirmation: {
    title: string;
    successMessage: string;
    refNumber: string;
    cardType: string;
    amount: string;
    date: string;
    emailSentTo: string;
    homeButton: string;
    newSubmission: string;
    statusText: string;
  };
  error: {
    title: string;
    message: string;
    retryButton: string;
  };
  footer: {
    copyright: string;
    languagesTitle: string;
    securityNotice: string;
    terms: string;
    privacy: string;
    legalNotice: string;
    standards: string;
  };
  emailPreview: {
    buttonLabel: string;
    modalTitle: string;
    adminTab: string;
    userTab: string;
    close: string;
  };
}
