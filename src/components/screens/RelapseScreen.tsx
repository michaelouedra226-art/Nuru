import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { AppState } from '../../types';
import { AdinkraPattern } from '../AdinkraPattern';
import { triggerHaptic } from '../../utils/soundAndHaptics';

interface RelapseProps {
  state: AppState;
  onConfirmRelapse: (reasonNote?: string) => void;
  onNavigateToSos: () => void;
  onNavigateToJournal: () => void;
  onCancel: () => void;
}

export const RelapseScreen: React.FC<RelapseProps> = ({
  state,
  onConfirmRelapse,
  onNavigateToSos,
  onNavigateToJournal,
  onCancel,
}) => {
  const [reasonNote, setReasonNote] = useState('');
  const [step, setStep] = useState<'rain' | 'pause' | 'sun'>('rain');
  const [pauseSeconds, setPauseSeconds] = useState(60);

  const currentStreakDays = Math.floor(
    Math.max(0, Date.now() - state.currentCycleStart) / (86400 * 1000)
  );

  // Décompte de la pause d'ancrage somatique de 60s
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (step === 'pause' && pauseSeconds > 0) {
      timer = setInterval(() => {
        setPauseSeconds((s) => {
          if (s <= 1) {
            triggerHaptic('heart');
            setStep('sun');
            return 0;
          }
          return s - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [step, pauseSeconds]);

  const handleStartPause = () => {
    triggerHaptic('tap');
    setStep('pause');
  };

  const handleFinalContinue = () => {
    onConfirmRelapse(reasonNote);
  };

  return (
    <div
      className="relative flex h-full min-h-[620px] w-full flex-col justify-between overflow-hidden bg-gradient-to-b from-[#1B2A41] to-[#3B6255] px-6 py-8 text-[#F4E9D8]"
      id="nuru-relapse-screen"
    >
      <AdinkraPattern opacity={0.03} />

      {/* Header avec annulation possible */}
      <div className="relative z-10 flex items-center justify-between">
        <button
          type="button"
          onClick={onCancel}
          className="text-xs text-[#9AA8BA] hover:text-white transition"
        >
          ← Retour au sanctuaire
        </button>
      </div>

      <div className="relative z-10 my-auto flex flex-col items-center text-center max-w-sm mx-auto">
        {step === 'rain' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center"
          >
            {/* Animation de pluie bienveillante */}
            <div className="relative mb-6 flex h-24 w-24 items-center justify-center">
              <div className="absolute inset-0 rounded-full bg-white/5 animate-pulse" />
              <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#5C8B7A" strokeWidth="1.5">
                <path d="M20 16.58A5 5 0 0 0 18 7h-1.26A8 8 0 1 0 4 15.25" strokeLinecap="round" />
                <line x1="8" y1="19" x2="8" y2="21" strokeLinecap="round" />
                <line x1="12" y1="18" x2="12" y2="22" strokeLinecap="round" />
                <line x1="16" y1="19" x2="16" y2="21" strokeLinecap="round" />
              </svg>
            </div>

            <h2
              style={{ fontFamily: 'var(--font-heading, sans-serif)' }}
              className="text-2xl font-bold text-[#F4E9D8]"
            >
              Ce moment ne te définit pas.
            </h2>

            <p className="mt-3 text-sm text-[#9AA8BA] leading-relaxed">
              Ton record personnel reste intact à <strong className="text-white font-mono">{Math.max(state.personalRecordDays, currentStreakDays)} jours</strong>.
              Ce cycle de {currentStreakDays} jours n'est pas effacé : il devient un chapitre d'apprentissage précieux.
            </p>

            {/* Note libre optionnelle */}
            <div className="mt-6 w-full text-left">
              <label className="text-[11px] font-semibold text-[#9AA8BA] block mb-1">
                Que s'est-il passé ? (Facultatif, pour ta calebasse)
              </label>
              <textarea
                value={reasonNote}
                onChange={(e) => setReasonNote(e.target.value)}
                placeholder="Fatigue accumulée, isolement, scroll tardif..."
                rows={2}
                className="w-full rounded-2xl border border-white/10 bg-white/5 p-3 text-xs text-white placeholder-white/40 outline-none focus:border-[#D4A24C]"
              />
            </div>
          </motion.div>
        )}

        {step === 'pause' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center"
          >
            {/* Temporisation somatique de 60 secondes */}
            <div className="relative mb-6 flex h-28 w-28 items-center justify-center rounded-full border-2 border-[#D4A24C]/40 bg-white/5">
              <span className="font-mono text-4xl font-bold text-[#D4A24C]">
                {pauseSeconds}s
              </span>
            </div>

            <h2
              style={{ fontFamily: 'var(--font-heading, sans-serif)' }}
              className="text-xl font-bold text-[#F4E9D8]"
            >
              Pause de clarté somatique
            </h2>
            <p className="mt-3 text-xs text-[#9AA8BA] leading-relaxed max-w-xs">
              Avant de réinitialiser, accorde 60 secondes à ton cortex préfrontal pour se réaligner. Respire profondément par le nez, pose tes deux pieds bien à plat sur le sol.
            </p>
          </motion.div>
        )}

        {step === 'sun' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center"
          >
            {/* Soleil levant après la pluie */}
            <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-[#D4A24C]/20 text-[#D4A24C]">
              <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" />
                <line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" />
                <line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
            </div>

            <h2
              style={{ fontFamily: 'var(--font-display, serif)' }}
              className="text-2xl text-[#F4E9D8]"
            >
              L’averse est passée. L’arbre est toujours debout.
            </h2>
            <p className="mt-3 text-xs text-[#9AA8BA] leading-relaxed">
              Une nouvelle graine prend racine maintenant. Tout ton bagage reste avec toi.
            </p>
          </motion.div>
        )}
      </div>

      {/* Actions */}
      <div className="relative z-10 flex flex-col gap-2.5 max-w-sm mx-auto w-full">
        {step === 'rain' && (
          <>
            <button
              type="button"
              onClick={handleStartPause}
              className="w-full rounded-2xl bg-[#D4A24C] py-3.5 text-center text-xs font-bold text-[#1B2A41] hover:bg-[#deb463] transition shadow-md"
            >
              Pause de clarté (60 s)
            </button>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={onNavigateToJournal}
                className="rounded-2xl border border-white/20 bg-white/10 py-2.5 text-xs text-white hover:bg-white/15 transition"
              >
                Déposer dans le journal
              </button>
              <button
                type="button"
                onClick={onNavigateToSos}
                className="rounded-2xl border border-white/20 bg-white/10 py-2.5 text-xs text-white hover:bg-white/15 transition"
              >
                Respiration apaisante
              </button>
            </div>
          </>
        )}

        {step === 'pause' && (
          <div className="flex flex-col gap-2">
            <button
              type="button"
              disabled={pauseSeconds > 45}
              onClick={() => setStep('sun')}
              className="w-full rounded-2xl border border-white/20 bg-white/10 py-3 text-xs font-semibold text-white transition disabled:opacity-30"
            >
              Passer la pause ({pauseSeconds > 45 ? 'Attendre 15s' : 'Continuer'})
            </button>
          </div>
        )}

        {step === 'sun' && (
          <button
            type="button"
            onClick={handleFinalContinue}
            className="w-full rounded-2xl bg-[#3B6255] py-3.5 text-center text-xs font-bold text-white hover:bg-[#2e4f44] transition shadow-md"
          >
            Continuer mon voyage
          </button>
        )}
      </div>
    </div>
  );
};
