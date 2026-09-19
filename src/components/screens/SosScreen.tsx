import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AppState, QuoteItem } from '../../types';
import { DAILY_QUOTES } from '../../data/initialData';
import { IconGraine } from '../icons/CustomSvgIcons';
import {
  triggerHaptic,
  startAmbientSound,
  stopAmbientSound,
  playVictoryChime,
} from '../../utils/soundAndHaptics';

interface SosProps {
  state: AppState;
  onClose: () => void;
  onSosCompleted: () => void;
  onNavigateToJournal: () => void;
}

type BreathPhase = 'inspire' | 'hold' | 'expire';
type SoundOption = 'heartbeat' | 'theta' | 'rain' | 'none';

export const SosScreen: React.FC<SosProps> = ({
  state,
  onClose,
  onSosCompleted,
  onNavigateToJournal,
}) => {
  const [phase, setPhase] = useState<BreathPhase>('inspire');
  const [secondsRemaining, setSecondsRemaining] = useState<number>(4);
  const [completedCycles, setCompletedCycles] = useState<number>(0);
  const [showExitConfirm, setShowExitConfirm] = useState<boolean>(false);
  const [showVictoryGraine, setShowVictoryGraine] = useState<boolean>(false);
  const [quoteIndex, setQuoteIndex] = useState<number>(0);
  const [soundMode, setSoundMode] = useState<SoundOption>(
    state.settings.ambientSoundType || 'theta'
  );

  // Filtrage des citations réconfortantes
  const availableQuotes: QuoteItem[] = DAILY_QUOTES.filter((q) => {
    if (state.settings.faithPreference === 'secular') {
      return q.category === 'science' || q.category === 'african_proverb';
    }
    if (state.settings.faithPreference === 'christianity') {
      return q.category === 'faith_christian' || q.category === 'science';
    }
    if (state.settings.faithPreference === 'islam') {
      return q.category === 'faith_islam' || q.category === 'science';
    }
    return true;
  });

  const currentQuote = availableQuotes[quoteIndex % availableQuotes.length] || DAILY_QUOTES[0];

  // Gestion de la boucle d'ambiance sonore
  useEffect(() => {
    if (soundMode !== 'none') {
      startAmbientSound(soundMode);
    } else {
      stopAmbientSound();
    }
    return () => {
      stopAmbientSound();
    };
  }, [soundMode]);

  // Cycle de respiration 4 - 7 - 8 secondes
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev > 1) {
          return prev - 1;
        }

        // Transition de phase
        if (phase === 'inspire') {
          setPhase('hold');
          triggerHaptic('breath_step');
          return 7;
        } else if (phase === 'hold') {
          setPhase('expire');
          triggerHaptic('breath_step');
          return 8;
        } else {
          // Fin cycle expire -> retour inspire
          setPhase('inspire');
          triggerHaptic('breath_step');
          setCompletedCycles((c) => c + 1);
          setQuoteIndex((qi) => qi + 1);
          return 4;
        }
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [phase]);

  const handleHoldVictory = () => {
    stopAmbientSound();
    triggerHaptic('victory');
    playVictoryChime();
    setShowVictoryGraine(true);
    setTimeout(() => {
      onSosCompleted();
    }, 2000);
  };

  const handleCallTrusted = () => {
    if (state.settings.trustedContactNumber) {
      window.location.href = `tel:${state.settings.trustedContactNumber}`;
    } else {
      alert("Aucun numéro n'a été configuré dans les Réglages. Tu peux en ajouter un dès maintenant.");
    }
  };

  return (
    <div
      className="relative flex h-full min-h-[620px] w-full flex-col justify-between overflow-hidden bg-gradient-to-b from-[#1B2A41] via-[#3B6255] to-[#C96A3F] p-6 text-[#F4E9D8]"
      id="nuru-sos-screen"
    >
      {/* Header SOS & Contrôles discrets */}
      <div className="relative z-10 flex items-center justify-between">
        <button
          type="button"
          onClick={() => setShowExitConfirm(true)}
          className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10 text-white/80 hover:bg-white/20 transition"
          title="Quitter"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {/* Sélecteur de mode sonore procédural */}
        <div className="flex items-center gap-1 rounded-2xl bg-white/10 p-1 backdrop-blur-xs">
          {[
            { id: 'theta' as SoundOption, label: 'Thêta' },
            { id: 'heartbeat' as SoundOption, label: 'Cœur' },
            { id: 'rain' as SoundOption, label: 'Pluie' },
            { id: 'none' as SoundOption, label: 'Muet' },
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setSoundMode(item.id)}
              className={`rounded-xl px-2.5 py-1 text-[10px] font-semibold transition ${
                soundMode === item.id
                  ? 'bg-[#D4A24C] text-[#1B2A41] shadow-xs'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Citation apaisante rotative */}
      <div className="relative z-10 my-auto flex flex-col items-center text-center max-w-sm mx-auto">
        <motion.div
          key={currentQuote.id}
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          className="mb-8 px-2"
        >
          <p className="text-sm font-medium italic text-white/90 leading-relaxed">
            "{currentQuote.text}"
          </p>
          <span className="mt-1 block text-[11px] font-semibold text-[#D4A24C]">
            — {currentQuote.source}
          </span>
        </motion.div>

        {/* Cercle respirant 4-7-8 secondes (diamètre 220 dp) */}
        <div className="relative flex h-[220px] w-[220px] items-center justify-center">
          {/* Anneau extérieur */}
          <motion.div
            animate={{
              scale: phase === 'inspire' ? 1.25 : phase === 'hold' ? 1.25 : 0.85,
              opacity: phase === 'hold' ? 0.9 : 0.65,
            }}
            transition={{
              duration: phase === 'inspire' ? 4 : phase === 'hold' ? 0.2 : 8,
              ease: 'easeInOut',
            }}
            className="absolute inset-0 rounded-full border-2 border-[#D4A24C]/60 bg-white/5 backdrop-blur-xs"
          />

          {/* Cercle plein central */}
          <motion.div
            animate={{
              scale: phase === 'inspire' ? 1.15 : phase === 'hold' ? 1.15 : 0.75,
              backgroundColor:
                phase === 'inspire'
                  ? 'rgba(212, 162, 76, 0.35)'
                  : phase === 'hold'
                  ? 'rgba(92, 139, 122, 0.45)'
                  : 'rgba(201, 106, 63, 0.35)',
            }}
            transition={{
              duration: phase === 'inspire' ? 4 : phase === 'hold' ? 0.2 : 8,
              ease: 'easeInOut',
            }}
            className="flex h-36 w-36 flex-col items-center justify-center rounded-full text-center shadow-lg"
          >
            <span className="text-xs font-bold uppercase tracking-widest text-[#F4E9D8]">
              {phase === 'inspire' ? 'Inspire' : phase === 'hold' ? 'Retiens' : 'Expire'}
            </span>
            <span
              style={{ fontFamily: 'var(--font-mono, monospace)' }}
              className="mt-1 text-3xl font-bold text-white"
            >
              {secondsRemaining}s
            </span>
          </motion.div>
        </div>

        <div className="mt-4 flex items-center gap-3 text-[11px] text-white/70">
          <span>Cycles accomplis : <strong className="font-mono text-white">{completedCycles}</strong></span>
          <span>·</span>
          <span>Ambiance : <strong className="text-[#D4A24C] capitalize">{soundMode === 'none' ? 'Silence' : soundMode}</strong></span>
        </div>
      </div>

      {/* Actions de soutien : Victoire ou Appel / Journal */}
      <div className="relative z-10 flex flex-col gap-3 max-w-sm mx-auto w-full pt-2">
        <button
          type="button"
          onClick={handleHoldVictory}
          className="w-full rounded-2xl bg-[#D4A24C] py-4 text-center text-sm font-bold text-[#1B2A41] shadow-lg shadow-[#D4A24C]/30 transition hover:bg-[#e0b25e] active:scale-95"
        >
          Je tiens bon (Victoire)
        </button>

        <div className="grid grid-cols-2 gap-2.5">
          <button
            type="button"
            onClick={handleCallTrusted}
            className="rounded-2xl border border-white/20 bg-white/10 py-3 text-center text-xs font-medium text-white hover:bg-white/15 transition"
          >
            Appeler un proche
          </button>
          <button
            type="button"
            onClick={onNavigateToJournal}
            className="rounded-2xl border border-white/20 bg-white/10 py-3 text-center text-xs font-medium text-white hover:bg-white/15 transition"
          >
            Écrire dans le journal
          </button>
        </div>
      </div>

      {/* Dialogue de confirmation bienveillant lors du retour */}
      <AnimatePresence>
        {showExitConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-6 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-xs rounded-3xl bg-[#FAF4EA] p-6 text-[#1B2A41] shadow-2xl"
            >
              <h3
                style={{ fontFamily: 'var(--font-heading, sans-serif)' }}
                className="text-lg font-bold text-[#1B2A41]"
              >
                Es-tu certain ?
              </h3>
              <p className="mt-2 text-xs text-[#5B6779] leading-relaxed">
                Encore 30 secondes d'ancrage peuvent tout changer. La vague d'envie va redescendre d'elle-même.
              </p>

              <div className="mt-6 flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => setShowExitConfirm(false)}
                  className="rounded-2xl bg-[#3B6255] py-3 text-xs font-bold text-white shadow-xs hover:bg-[#2f4f44] transition"
                >
                  Continuer à respirer
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-2xl border border-[#1B2A41]/15 bg-transparent py-2.5 text-xs font-medium text-[#5B6779] hover:text-[#1B2A41] transition"
                >
                  Quitter le sanctuaire
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Animation de victoire "Graine qui germe" */}
      <AnimatePresence>
        {showVictoryGraine && (
          <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/70 p-6 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1.1, opacity: 1 }}
              exit={{ scale: 1, opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center text-center"
            >
              <div className="mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-[#3B6255] text-white shadow-2xl">
                <IconGraine size={56} color="#FFFFFF" />
              </div>
              <h3
                style={{ fontFamily: 'var(--font-display, serif)' }}
                className="text-2xl text-white"
              >
                Tu viens d’écrire ta victoire.
              </h3>
              <p className="mt-2 text-xs text-white/80 max-w-xs">
                La graine germe et fortifie tes racines. L'arbre reste debout.
              </p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
