import React, { useState } from 'react';
import { motion } from 'motion/react';
import { AppState } from '../../types';
import { AdinkraPattern } from '../AdinkraPattern';

interface WidgetSimulatorProps {
  state: AppState;
  onOpenSos: () => void;
  onClose: () => void;
}

export const WidgetSimulatorScreen: React.FC<WidgetSimulatorProps> = ({
  state,
  onOpenSos,
  onClose,
}) => {
  const [selectedFormat, setSelectedFormat] = useState<'2x2' | '4x2' | '4x4'>('4x2');

  const currentStreakDays = Math.floor(
    Math.max(0, Date.now() - state.currentCycleStart) / (86400 * 1000)
  );

  return (
    <div
      className="relative flex h-full min-h-[620px] w-full flex-col justify-between overflow-hidden bg-[#FAF4EA] px-5 py-6 text-[#1B2A41]"
      id="nuru-widget-simulator-screen"
    >
      <AdinkraPattern opacity={0.03} />

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between pb-3">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-[#1B2A41] shadow-xs border border-[#1B2A41]/10 hover:bg-[#FAF4EA] transition"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <h2
              style={{ fontFamily: 'var(--font-heading, sans-serif)' }}
              className="text-lg font-bold text-[#1B2A41]"
            >
              Widgets Android (Glance)
            </h2>
            <span className="text-[11px] text-[#5B6779]">Aperçu sur l'écran d'accueil</span>
          </div>
        </div>
      </div>

      {/* Sélecteur de format */}
      <div className="relative z-10 flex justify-center gap-2 mb-4">
        {(['2x2', '4x2', '4x4'] as const).map((fmt) => (
          <button
            key={fmt}
            type="button"
            onClick={() => setSelectedFormat(fmt)}
            className={`rounded-xl px-4 py-2 text-xs font-semibold border transition ${
              selectedFormat === fmt
                ? 'bg-[#1B2A41] text-white border-[#1B2A41] shadow-xs'
                : 'bg-white border-[#1B2A41]/10 text-[#5B6779]'
            }`}
          >
            Format {fmt}
          </button>
        ))}
      </div>

      {/* Fond simulant un écran d'accueil Android sobre */}
      <div className="relative z-10 my-auto flex items-center justify-center p-4">
        <div className="relative w-full max-w-sm rounded-3xl bg-[#0E1620] p-6 shadow-xl border border-white/10 flex flex-col items-center justify-center min-h-[280px]">
          {selectedFormat === '2x2' && (
            <motion.div
              key="2x2"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex h-36 w-36 flex-col items-center justify-center rounded-3xl bg-[#FAF4EA] p-4 text-center shadow-lg border border-[#D4A24C]/30"
            >
              <div className="h-2.5 w-2.5 rounded-full bg-[#D4A24C] mb-1" />
              <span
                style={{ fontFamily: 'var(--font-display, serif)' }}
                className="text-4xl text-[#1B2A41]"
              >
                {currentStreakDays}
              </span>
              <span className="text-[9px] font-bold uppercase tracking-wider text-[#C96A3F]">
                Jours
              </span>
            </motion.div>
          )}

          {selectedFormat === '4x2' && (
            <motion.div
              key="4x2"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex w-full items-center justify-between rounded-3xl bg-[#FAF4EA] p-5 shadow-lg border border-[#D4A24C]/30"
            >
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#C96A3F]">
                  Sanctuaire Nuru
                </span>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span
                    style={{ fontFamily: 'var(--font-display, serif)' }}
                    className="text-4xl text-[#1B2A41]"
                  >
                    {currentStreakDays}
                  </span>
                  <span className="text-xs font-semibold text-[#5B6779]">jours</span>
                </div>
              </div>

              <button
                type="button"
                onClick={onOpenSos}
                className="flex h-12 w-12 items-center justify-center rounded-full bg-[#B8382D] text-xs font-bold text-white shadow-md active:scale-90"
              >
                SOS
              </button>
            </motion.div>
          )}

          {selectedFormat === '4x4' && (
            <motion.div
              key="4x4"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex w-full flex-col justify-between rounded-3xl bg-[#FAF4EA] p-5 shadow-lg border border-[#D4A24C]/30 min-h-[220px]"
            >
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#C96A3F]">
                    Sanctuaire Personnel
                  </span>
                  <div className="flex items-baseline gap-1">
                    <span
                      style={{ fontFamily: 'var(--font-display, serif)' }}
                      className="text-3xl text-[#1B2A41]"
                    >
                      {currentStreakDays}
                    </span>
                    <span className="text-xs font-semibold text-[#5B6779]">jours de clarté</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={onOpenSos}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-[#B8382D] text-[11px] font-bold text-white shadow-sm"
                >
                  SOS
                </button>
              </div>

              <p className="my-2 text-[11px] italic text-[#5B6779] border-l-2 border-[#C96A3F] pl-2">
                "Le baobab géant naît d'une graine pas plus grosse qu'un grain de café."
              </p>

              <div className="flex items-center justify-between pt-1 text-[10px] text-[#1B2A41] font-semibold border-t border-[#1B2A41]/5">
                <span>Record : {Math.max(state.personalRecordDays, currentStreakDays)} j</span>
                <span>Mode discret actif</span>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      <div className="relative z-10 text-center text-xs text-[#5B6779]">
        Composants écrits selon la spécification Jetpack Glance Android
      </div>
    </div>
  );
};
