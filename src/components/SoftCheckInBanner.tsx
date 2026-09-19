import React from 'react';
import { motion } from 'motion/react';

interface SoftCheckInProps {
  userName: string;
  onOpenJournal: () => void;
  onDismiss: () => void;
}

export const SoftCheckInBanner: React.FC<SoftCheckInProps> = ({
  userName,
  onOpenJournal,
  onDismiss,
}) => {
  return (
    <motion.div
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -50, opacity: 0 }}
      className="relative z-30 mx-4 mb-2 rounded-2xl border border-[#D4A24C]/30 bg-gradient-to-r from-[#FAF4EA] to-[#F4E9D8] p-3.5 shadow-md"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="h-2 w-2 rounded-full bg-[#C96A3F] animate-ping" />
          <div>
            <div className="text-xs font-bold text-[#1B2A41]">
              {userName}, comment tu te sens ce soir ?
            </div>
            <div className="text-[11px] text-[#5B6779]">
              Un moment pour déposer ta pensée dans la calebasse.
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onOpenJournal}
            className="rounded-xl bg-[#C96A3F] px-3 py-1.5 text-[11px] font-bold text-white shadow-xs hover:bg-[#b5582f] transition"
          >
            Déposer
          </button>
          <button
            type="button"
            onClick={onDismiss}
            className="text-[#5B6779] hover:text-[#1B2A41] p-1 text-xs"
          >
            ✕
          </button>
        </div>
      </div>
    </motion.div>
  );
};
