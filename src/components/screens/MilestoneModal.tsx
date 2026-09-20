import React from 'react';
import { motion } from 'motion/react';
import { AdinkraPattern } from '../AdinkraPattern';
import { RealisticBaobabIllustration, getBaobabBiologicalStage } from '../RealisticBaobabIllustration';

interface MilestoneProps {
  days: number;
  onClose: () => void;
  onShare: () => void;
}

export const MilestoneModal: React.FC<MilestoneProps> = ({ days, onClose, onShare }) => {
  const stage = getBaobabBiologicalStage(days);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-6 backdrop-blur-sm">
      <motion.div
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.85, opacity: 0 }}
        className="relative w-full max-w-sm overflow-hidden rounded-3xl bg-[#FAF4EA] p-6 text-center text-[#1B2A41] shadow-2xl"
      >
        <AdinkraPattern opacity={0.05} />

        {/* Halo doré célébratoire */}
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 h-44 w-44 rounded-full bg-gradient-to-b from-[#D4A24C]/30 to-transparent blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center">
          <div className="w-full max-w-[260px] mb-2">
            <RealisticBaobabIllustration days={days} size="compact" showDetailsCard={false} />
          </div>

          <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#C96A3F]">
            Jalon de Clarté — {stage.stageName}
          </span>

          <h2
            style={{ fontFamily: 'var(--font-display, serif)' }}
            className="mt-1 text-3xl text-[#1B2A41]"
          >
            {days} Jours
          </h2>

          <p className="mt-2 text-xs text-[#5B6779] leading-relaxed">
            {stage.neuroBiology}
          </p>

          <div className="mt-6 flex w-full flex-col gap-2.5">
            <button
              type="button"
              onClick={onShare}
              className="w-full rounded-2xl bg-[#D4A24C] py-3.5 text-xs font-bold text-[#1B2A41] shadow-md hover:bg-[#e2b35a] transition"
            >
              Partager une carte sobre
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-full rounded-2xl border border-[#1B2A41]/10 bg-white py-3 text-xs font-semibold text-[#5B6779] hover:bg-[#FAF4EA] transition"
            >
              Retourner au sanctuaire
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
