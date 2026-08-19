import React, { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, Trash2, Check, Sliders } from 'lucide-react';

interface ImageUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  currentImage?: string | null;
  onSaveImage: (base64Image: string | null, opacity?: number) => void;
  aspectRatioLabel?: string;
  initialOpacity?: number;
  showOpacityControl?: boolean;
}

export const ImageUploadModal: React.FC<ImageUploadModalProps> = ({
  isOpen,
  onClose,
  title,
  currentImage,
  onSaveImage,
  aspectRatioLabel = 'Format recommandé : 16:9 ou 4:3 (JPG, PNG, WebP)',
  initialOpacity = 25,
  showOpacityControl = false,
}) => {
  const [preview, setPreview] = useState<string | null>(currentImage || null);
  const [opacity, setOpacity] = useState<number>(initialOpacity);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('L\'image est trop volumineuse (maximum 5 Mo).');
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    onSaveImage(preview, opacity);
    onClose();
  };

  const handleReset = () => {
    setPreview(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center gap-2 font-bold text-slate-900 text-base">
            <ImageIcon className="w-5 h-5 text-cyan-600" />
            <span>{title}</span>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-slate-500 hover:text-slate-800 hover:bg-slate-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          <p className="text-xs text-slate-500">{aspectRatioLabel}</p>

          {/* Preview Box or Drag Box */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className="relative border-2 border-dashed border-slate-300 hover:border-cyan-500 rounded-2xl p-4 text-center cursor-pointer bg-slate-50 hover:bg-cyan-50/40 transition-colors flex flex-col items-center justify-center min-h-[200px]"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />

            {preview ? (
              <div className="relative w-full h-44 rounded-xl overflow-hidden bg-slate-100 flex items-center justify-center">
                <img
                  src={preview}
                  alt="Aperçu"
                  referrerPolicy="no-referrer"
                  style={{ opacity: showOpacityControl ? opacity / 100 : 1 }}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold gap-2">
                  <Upload className="w-4 h-4" />
                  <span>Cliquer pour changer d'image</span>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2 text-slate-500 py-6">
                <div className="w-12 h-12 rounded-full bg-cyan-100 text-cyan-600 flex items-center justify-center">
                  <Upload className="w-6 h-6" />
                </div>
                <span className="text-sm font-bold text-slate-800">
                  Sélectionner une photo depuis votre appareil
                </span>
                <span className="text-xs text-slate-400">
                  Cliquez ou glissez-déposez votre fichier ici
                </span>
              </div>
            )}
          </div>

          {/* Opacity control for background image */}
          {showOpacityControl && (
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                <span className="flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-cyan-600" />
                  Intensité / Visibilité du fond
                </span>
                <span className="text-cyan-700 font-mono bg-cyan-50 px-2 py-0.5 rounded-full border border-cyan-200">
                  {opacity}% (Recommandé : 20% à 30%)
                </span>
              </div>
              <input
                type="range"
                min="10"
                max="80"
                step="5"
                value={opacity}
                onChange={(e) => setOpacity(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-cyan-600"
              />
              <div className="flex justify-between text-[10px] text-slate-600 font-medium">
                <span>Discret (10%)</span>
                <span>Idéal / Pro (25%)</span>
                <span>Prononcé (50%)</span>
                <span>Forte (80%)</span>
              </div>
            </div>
          )}

          {/* Quick Clear button */}
          {preview && (
            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleReset}
                className="text-xs text-red-600 hover:text-red-700 flex items-center gap-1 font-semibold cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Rétablir l'image d'origine</span>
              </button>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-100 bg-slate-50">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-full text-xs font-bold text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer"
          >
            Annuler
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2 rounded-full text-xs font-bold bg-cyan-600 hover:bg-cyan-500 text-white shadow-md shadow-cyan-500/20 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Check className="w-4 h-4" />
            <span>Valider et appliquer</span>
          </button>
        </div>

      </div>
    </div>
  );
};
