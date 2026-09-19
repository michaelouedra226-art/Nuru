import React, { useRef, useState } from 'react';
import { motion } from 'motion/react';
import { AppState } from '../../types';
import { DAILY_QUOTES } from '../../data/initialData';

interface ShareExportProps {
  state: AppState;
  onClose: () => void;
}

export const ShareExportModal: React.FC<ShareExportProps> = ({ state, onClose }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [includeBranding, setIncludeBranding] = useState(false); // Par défaut masqué pour discrétion absolue
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const currentStreakDays = Math.floor(
    Math.max(0, Date.now() - state.currentCycleStart) / (86400 * 1000)
  );
  const quote = DAILY_QUOTES[0];

  const handleDownloadImage = () => {
    // Rendu Canvas pour sauvegarde PNG
    const canvas = document.createElement('canvas');
    canvas.width = 600;
    canvas.height = 750;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Fond dégradé
    const gradient = ctx.createLinearGradient(0, 0, 0, 750);
    gradient.addColorStop(0, '#FAF4EA');
    gradient.addColorStop(0.5, '#F4E9D8');
    gradient.addColorStop(1, '#EFE4CE');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 600, 750);

    // Halo doré subtil
    ctx.beginPath();
    ctx.arc(300, 280, 160, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(212, 162, 76, 0.12)';
    ctx.fill();

    // Compteur jours
    ctx.fillStyle = '#1B2A41';
    ctx.font = 'bold 96px serif';
    ctx.textAlign = 'center';
    ctx.fillText(String(currentStreakDays), 300, 280);

    // Label
    ctx.fillStyle = '#C96A3F';
    ctx.font = '600 20px sans-serif';
    ctx.fillText('JOURS DE CLARTÉ', 300, 325);

    // Citation
    ctx.fillStyle = '#1B2A41';
    ctx.font = 'italic 22px sans-serif';
    ctx.fillText(`"${quote.text.slice(0, 70)}..."`, 300, 430);

    // Source
    ctx.fillStyle = '#5B6779';
    ctx.font = '16px sans-serif';
    ctx.fillText(`— ${quote.source}`, 300, 470);

    if (includeBranding) {
      ctx.fillStyle = '#1B2A41';
      ctx.font = '300 22px serif';
      ctx.fillText('Nuru — Sanctuaire', 300, 670);
    }

    const dataUrl = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `nuru-clarte-${currentStreakDays}j.png`;
    a.click();

    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-5 backdrop-blur-xs">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="w-full max-w-sm rounded-3xl bg-[#FAF4EA] p-6 text-[#1B2A41] shadow-2xl"
      >
        <div className="flex items-center justify-between mb-4">
          <h3
            style={{ fontFamily: 'var(--font-heading, sans-serif)' }}
            className="text-base font-bold text-[#1B2A41]"
          >
            Carte de Partage Discrète
          </h3>
          <button type="button" onClick={onClose} className="text-[#5B6779] p-1">
            ✕
          </button>
        </div>

        {/* Aperçu de la carte */}
        <div
          ref={cardRef}
          className="relative flex flex-col items-center justify-between rounded-2xl border border-[#1B2A41]/10 bg-gradient-to-b from-[#FAF4EA] via-[#F4E9D8] to-[#EFE4CE] p-6 text-center shadow-xs min-h-[260px]"
        >
          <div className="my-auto flex flex-col items-center">
            <span
              style={{ fontFamily: 'var(--font-display, serif)' }}
              className="text-6xl font-normal text-[#1B2A41]"
            >
              {currentStreakDays}
            </span>
            <span className="mt-1 text-[10px] font-bold uppercase tracking-widest text-[#C96A3F]">
              Jours de clarté
            </span>

            <p className="mt-3 text-xs italic text-[#1B2A41] max-w-[220px]">
              "{quote.text}"
            </p>
            <span className="mt-1 text-[10px] text-[#5B6779] font-medium">
              — {quote.source}
            </span>
          </div>

          {includeBranding && (
            <span
              style={{ fontFamily: 'var(--font-display, serif)' }}
              className="text-xs text-[#1B2A41]/60 pt-2 tracking-wide"
            >
              Nuru
            </span>
          )}
        </div>

        {/* Options de discrétion */}
        <div className="mt-4 flex items-center justify-between text-xs text-[#5B6779]">
          <span>Afficher le mot "Nuru"</span>
          <input
            type="checkbox"
            checked={includeBranding}
            onChange={(e) => setIncludeBranding(e.target.checked)}
            className="h-4 w-4 accent-[#C96A3F]"
          />
        </div>

        <div className="mt-5 flex flex-col gap-2">
          <button
            type="button"
            onClick={handleDownloadImage}
            className="w-full rounded-2xl bg-[#C96A3F] py-3 text-xs font-bold text-white shadow-md hover:bg-[#b7592f] transition"
          >
            {downloadSuccess ? 'Image téléchargée !' : 'Télécharger l’image (PNG)'}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-2xl border border-[#1B2A41]/10 bg-white py-2.5 text-xs font-medium text-[#5B6779]"
          >
            Fermer
          </button>
        </div>
      </motion.div>
    </div>
  );
};
