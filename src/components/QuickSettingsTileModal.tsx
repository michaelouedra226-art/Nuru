import React from 'react';
import { motion } from 'motion/react';

interface QuickTileProps {
  onTriggerSos: () => void;
  onClose: () => void;
}

export const QuickSettingsTileModal: React.FC<QuickTileProps> = ({
  onTriggerSos,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-6 backdrop-blur-xs">
      <motion.div
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -30, opacity: 0 }}
        className="w-full max-w-xs rounded-3xl bg-[#1B2A41] p-6 text-white shadow-2xl border border-white/10"
      >
        <div className="flex items-center justify-between mb-4">
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#D4A24C]">
            Tuile Android Quick Settings
          </span>
          <button type="button" onClick={onClose} className="text-white/60 p-1">
            ✕
          </button>
        </div>

        <p className="text-xs text-[#9AA8BA] mb-5">
          Accessible depuis le volet déroulant système de notification Android, pour un ancrage immédiat en moins de 1 seconde.
        </p>

        {/* Bouton simulant la tuile système */}
        <button
          type="button"
          onClick={() => {
            onClose();
            onTriggerSos();
          }}
          className="flex w-full items-center gap-4 rounded-2xl bg-[#B8382D] p-4 text-left transition hover:bg-[#a63026] active:scale-98 shadow-md"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/20 text-white font-bold text-base">
            SOS
          </div>
          <div>
            <div className="text-sm font-bold">Nuru Ancrage</div>
            <div className="text-[11px] text-white/80">Lancer la respiration immédiate</div>
          </div>
        </button>
      </motion.div>
    </div>
  );
};
