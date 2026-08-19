import React, { useState, useEffect } from 'react';
import { X, Mail, ShieldAlert, User, RefreshCw } from 'lucide-react';
import { TranslationStrings, Language } from '../types';

interface EmailPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  t: TranslationStrings;
  currentLang?: Language;
}

export const EmailPreviewModal: React.FC<EmailPreviewModalProps> = ({
  isOpen,
  onClose,
  t,
  currentLang = 'fr',
}) => {
  const [activeTab, setActiveTab] = useState<'admin' | 'user'>('admin');
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchEmailData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/diagnostic-emails?lang=${currentLang || 'fr'}`);
      const json = await res.json();
      setData(json);
    } catch (e) {
      console.error('Failed to load email diagnostic:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchEmailData();
    }
  }, [isOpen, currentLang]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
            <Mail className="w-5 h-5 text-cyan-600" />
            <span>{t.emailPreview.modalTitle}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchEmailData}
              title="Rafraîchir"
              className="p-2 rounded-full bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 shadow-sm transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 shadow-sm transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-200 bg-white px-6 pt-2">
          <button
            onClick={() => setActiveTab('admin')}
            className={`flex items-center gap-2 px-5 py-3 text-sm font-bold border-b-2 transition-all ${
              activeTab === 'admin'
                ? 'border-cyan-600 text-cyan-700 bg-cyan-50/60 rounded-t-xl'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <ShieldAlert className="w-4 h-4 text-cyan-600" />
            <span>{t.emailPreview.adminTab}</span>
          </button>

          <button
            onClick={() => setActiveTab('user')}
            className={`flex items-center gap-2 px-5 py-3 text-sm font-bold border-b-2 transition-all ${
              activeTab === 'user'
                ? 'border-cyan-600 text-cyan-700 bg-cyan-50/60 rounded-t-xl'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <User className="w-4 h-4 text-emerald-600" />
            <span>{t.emailPreview.userTab}</span>
          </button>
        </div>

        {/* Content Preview */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50">
          {loading ? (
            <div className="py-16 text-center text-slate-500 text-sm">
              <div className="w-6 h-6 border-2 border-cyan-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
              Chargement des modèles d'e-mail...
            </div>
          ) : data && data.hasSubmissions ? (
            <div>
              <div className="mb-4 flex items-center justify-between text-xs text-slate-600 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm">
                <span>
                  Dernier ticket traité : <strong className="text-cyan-700">{data.latestSubmission?.id}</strong>
                </span>
                <span>
                  Date : {new Date(data.latestSubmission?.createdAt).toLocaleString()}
                </span>
              </div>

              {/* Rendered HTML inside an iframe sandbox */}
              <div className="rounded-2xl overflow-hidden border border-slate-200 bg-white min-h-[420px] shadow-sm">
                <iframe
                  title="Email Preview"
                  srcDoc={activeTab === 'admin' ? data.adminEmailHtml : data.userEmailHtml}
                  className="w-full h-[450px] border-0"
                />
              </div>
            </div>
          ) : (
            <div className="py-16 text-center text-slate-500 text-sm">
              <Mail className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="font-bold text-slate-700 mb-1">
                Aucun e-mail n'a encore été généré
              </p>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Soumettez une première demande via le formulaire d'activation pour visualiser les notifications en direct.
              </p>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-3.5 border-t border-slate-200 bg-white text-xs text-slate-500">
          <span>Système d'envoi SMTP / Transactionnel configuré</span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-bold transition-colors cursor-pointer"
          >
            {t.emailPreview.close}
          </button>
        </div>

      </div>
    </div>
  );
};
