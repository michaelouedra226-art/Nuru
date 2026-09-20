import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AppState, QuoteItem } from '../../types';
import { DAILY_QUOTES } from '../../data/initialData';
import { AdinkraPattern } from '../AdinkraPattern';
import {
  IconBaobab,
  IconCalebasse,
  IconKalachakraRespiration,
  IconReglagesCustom,
} from '../icons/CustomSvgIcons';
import { triggerHaptic } from '../../utils/soundAndHaptics';
import { getAdaptiveGreeting, calculateCurrentRiskScore } from '../../utils/localAI';
import { getBaobabBiologicalStage } from '../RealisticBaobabIllustration';

interface HomeProps {
  state: AppState;
  onOpenSos: () => void;
  onOpenJournal: () => void;
  onOpenProgress: () => void;
  onOpenSettings: () => void;
  onOpenBadges: () => void;
  onOpenRelapse: () => void;
  onOpenShareModal: () => void;
}

export const HomeScreen: React.FC<HomeProps> = ({
  state,
  onOpenSos,
  onOpenJournal,
  onOpenProgress,
  onOpenSettings,
  onOpenBadges,
  onOpenRelapse,
  onOpenShareModal,
}) => {
  const [currentTime, setCurrentTime] = useState(Date.now());
  const [pulseBonus, setPulseBonus] = useState(false);
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [showRiskDetails, setShowRiskDetails] = useState(false);

  // Filtrer les citations selon la préférence de contenu
  const availableQuotes: QuoteItem[] = DAILY_QUOTES.filter((q) => {
    if (state.settings.faithPreference === 'secular') {
      return q.category === 'science' || q.category === 'african_proverb';
    }
    if (state.settings.faithPreference === 'christianity') {
      return q.category === 'faith_christian' || q.category === 'african_proverb' || q.category === 'science';
    }
    if (state.settings.faithPreference === 'islam') {
      return q.category === 'faith_islam' || q.category === 'african_proverb' || q.category === 'science';
    }
    return true; // mixte
  });

  const activeQuote = availableQuotes[quoteIndex % availableQuotes.length] || DAILY_QUOTES[0];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const elapsedMs = Math.max(0, currentTime - state.currentCycleStart);
  const totalSeconds = Math.floor(elapsedMs / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const currentHour = new Date(currentTime).getHours();
  const adaptiveText = getAdaptiveGreeting(state.settings.userName, days, currentHour);
  const riskAnalysis = calculateCurrentRiskScore(state.entries, days, new Date(currentTime));
  const bioStage = getBaobabBiologicalStage(days);

  const handleTapStreak = () => {
    triggerHaptic('tap');
    setPulseBonus(true);
    setTimeout(() => setPulseBonus(false), 800);
  };

  const handleNextQuote = () => {
    triggerHaptic('tap');
    setQuoteIndex((prev) => (prev + 1) % availableQuotes.length);
  };

  return (
    <div
      className="relative flex h-full min-h-[620px] w-full flex-col justify-between overflow-x-hidden bg-[#FAF4EA] text-[#1B2A41] px-5 py-6"
      id="nuru-home-screen"
    >
      <AdinkraPattern opacity={0.035} />

      {/* 1. Header minimal */}
      <div className="relative z-10 flex items-center justify-between pt-1">
        <div className="flex flex-col">
          <span
            style={{ fontFamily: 'var(--font-heading, sans-serif)' }}
            className="text-lg font-bold text-[#1B2A41]"
          >
            {adaptiveText.greeting}
          </span>
          <span className="text-[11px] text-[#5B6779] line-clamp-1 max-w-[220px]">
            {adaptiveText.subtext}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Raccourci badges */}
          <button
            type="button"
            onClick={onOpenBadges}
            title="Mes badges & jalons"
            className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-[#D4A24C] shadow-sm transition hover:bg-[#FAF4EA] active:scale-95 border border-[#1B2A41]/10"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
              <circle cx="12" cy="8" r="6" />
              <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
            </svg>
          </button>

          {/* Bouton réglages */}
          <button
            type="button"
            onClick={onOpenSettings}
            title="Réglages du sanctuaire"
            className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-[#1B2A41] shadow-sm transition hover:bg-[#FAF4EA] active:scale-95 border border-[#1B2A41]/10"
          >
            <IconReglagesCustom size={20} color="#1B2A41" />
          </button>
        </div>
      </div>

      {/* 2. Compteur Streak — Cœur de l'écran avec Halo doré 6s */}
      <div className="relative z-10 my-auto flex flex-col items-center justify-center text-center py-2">
        {/* Halo doré pulsant */}
        <motion.div
          animate={{
            scale: pulseBonus ? [1, 1.35, 1.1] : [1, 1.14, 1],
            opacity: pulseBonus ? [0.3, 0.65, 0.4] : [0.25, 0.45, 0.25],
          }}
          transition={{
            duration: pulseBonus ? 0.8 : 6,
            repeat: pulseBonus ? 0 : Infinity,
            ease: 'easeInOut',
          }}
          className="absolute h-56 w-56 rounded-full bg-gradient-to-tr from-[#D4A24C] via-[#C96A3F]/40 to-transparent blur-3xl pointer-events-none"
        />

        {/* Chiffre interactif avec micro-animation */}
        <div
          onClick={handleTapStreak}
          className="group relative cursor-pointer select-none flex flex-col items-center"
        >
          <motion.div
            animate={pulseBonus ? { scale: [1, 1.06, 1] } : {}}
            transition={{ duration: 0.3 }}
            style={{ fontFamily: 'var(--font-display, serif)' }}
            className="text-7xl sm:text-8xl font-normal leading-none tracking-tight text-[#1B2A41] drop-shadow-sm"
          >
            {days}
          </motion.div>

          <div className="mt-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#C96A3F]">
            {days <= 1 ? 'Jour de clarté' : 'Jours de clarté'}
          </div>

          {/* Horloge précise rafraîchie à la seconde */}
          <div
            style={{ fontFamily: 'var(--font-mono, monospace)' }}
            className="mt-2.5 rounded-full bg-white/80 border border-[#1B2A41]/10 px-4 py-1.5 text-xs font-medium text-[#5B6779] shadow-xs"
          >
            {String(hours).padStart(2, '0')}h · {String(minutes).padStart(2, '0')}m ·{' '}
            <span className="text-[#C96A3F] font-semibold">{String(seconds).padStart(2, '0')}s</span>
          </div>

          {/* Badge du stade biologique réel du Baobab */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onOpenProgress();
            }}
            className="mt-2 flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#3B6255]/10 border border-[#3B6255]/20 text-[11px] text-[#3B6255] font-medium hover:bg-[#3B6255]/15 transition"
            title="Consulter l'évolution biologique du Baobab"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-[#3B6255] animate-pulse" />
            <span className="font-semibold">{bioStage.stageName}</span>
            <span className="opacity-70 text-[10px]">({bioStage.progressPercent}%)</span>
          </button>

          <AnimatePresence>
            {pulseBonus && (
              <motion.span
                initial={{ opacity: 0, y: 0 }}
                animate={{ opacity: 1, y: -20 }}
                exit={{ opacity: 0 }}
                className="absolute -top-4 text-xs font-bold text-[#D4A24C]"
              >
                +1 souffle de lumière
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        {/* 2b. Indicateur d'Analyse Prédictive Bayésienne On-Device */}
        <div className="mt-3 w-full max-w-xs">
          <div
            onClick={() => setShowRiskDetails(!showRiskDetails)}
            className={`cursor-pointer rounded-2xl border px-3 py-1.5 text-center text-[11px] transition shadow-xs flex items-center justify-between ${
              riskAnalysis.level === 'eleve'
                ? 'border-[#B8382D]/40 bg-[#B8382D]/10 text-[#B8382D]'
                : riskAnalysis.level === 'modere'
                ? 'border-[#D4A24C]/40 bg-[#D4A24C]/10 text-[#1B2A41]'
                : 'border-[#3B6255]/20 bg-[#3B6255]/5 text-[#3B6255]'
            }`}
          >
            <div className="flex items-center gap-1.5 font-medium">
              <span
                className={`h-2 w-2 rounded-full ${
                  riskAnalysis.level === 'eleve'
                    ? 'bg-[#B8382D] animate-ping'
                    : riskAnalysis.level === 'modere'
                    ? 'bg-[#D4A24C]'
                    : 'bg-[#3B6255]'
                }`}
              />
              <span>
                Vigilance : {riskAnalysis.level === 'faible' ? 'Calme' : riskAnalysis.level === 'modere' ? 'Sensible' : 'Haute'}
              </span>
            </div>
            <span className="font-mono font-semibold text-[10px] opacity-80">
              {riskAnalysis.score}% risque
            </span>
          </div>

          {showRiskDetails && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-1.5 rounded-xl border border-[#1B2A41]/10 bg-white p-2.5 text-left text-[11px] text-[#5B6779] shadow-xs"
            >
              <p className="font-semibold text-[#1B2A41] mb-1">{riskAnalysis.message}</p>
              <p className="italic text-[10px] text-[#C96A3F] mb-1">
                Conseil : {riskAnalysis.actionRecommandee}
              </p>
              {riskAnalysis.contributingFactors.length > 0 && (
                <ul className="list-disc pl-3 text-[10px] space-y-0.5 text-[#5B6779]">
                  {riskAnalysis.contributingFactors.map((f, i) => (
                    <li key={i}>{f}</li>
                  ))}
                </ul>
              )}
            </motion.div>
          )}
        </div>
      </div>

      {/* 3. Carte de citation quotidienne */}
      <div className="relative z-10 w-full mb-3">
        <motion.div
          key={activeQuote.id}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -10 }}
          onClick={handleNextQuote}
          className="cursor-pointer rounded-2xl border border-[#1B2A41]/10 bg-white/90 p-3.5 shadow-xs transition hover:shadow-sm"
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#C96A3F]">
              {activeQuote.category === 'african_proverb'
                ? 'Sagesse africaine'
                : activeQuote.category === 'science'
                ? 'Neuroscience & Comportement'
                : 'Parole de foi'}
            </span>
            <span className="text-[10px] text-[#5B6779]">Toucher pour changer</span>
          </div>
          <p className="text-xs italic text-[#1B2A41] leading-relaxed">
            "{activeQuote.text}"
          </p>
          <div className="mt-1.5 text-right text-[10px] font-semibold text-[#5B6779]">
            — {activeQuote.source}
          </div>
        </motion.div>
      </div>

      {/* 4. Actions rapides (Journal, Baobab, Respiration) + Lien discret de rechute bienveillante */}
      <div className="relative z-10 flex flex-col gap-2">
        <div className="grid grid-cols-3 gap-2.5">
          {/* Journal / Calebasse */}
          <button
            type="button"
            onClick={onOpenJournal}
            className="flex flex-col items-center justify-center rounded-2xl border border-[#1B2A41]/10 bg-white py-3 px-2 shadow-xs transition hover:bg-[#FAF4EA] active:scale-95"
          >
            <div className="mb-1 text-[#C96A3F]">
              <IconCalebasse size={22} color="#C96A3F" />
            </div>
            <span className="text-xs font-semibold text-[#1B2A41]">Calebasse</span>
            <span className="text-[10px] text-[#5B6779]">Mon journal</span>
          </button>

          {/* Progression / Baobab */}
          <button
            type="button"
            onClick={onOpenProgress}
            className="flex flex-col items-center justify-center rounded-2xl border border-[#1B2A41]/10 bg-white py-3 px-2 shadow-xs transition hover:bg-[#FAF4EA] active:scale-95"
          >
            <div className="mb-1 text-[#3B6255]">
              <IconBaobab size={22} color="#3B6255" />
            </div>
            <span className="text-xs font-semibold text-[#1B2A41]">Baobab</span>
            <span className="text-[10px] text-[#5B6779]">Évolution</span>
          </button>

          {/* Respiration libre / Kalachakra */}
          <button
            type="button"
            onClick={onOpenSos}
            className="flex flex-col items-center justify-center rounded-2xl border border-[#1B2A41]/10 bg-white py-3 px-2 shadow-xs transition hover:bg-[#FAF4EA] active:scale-95"
          >
            <div className="mb-1 text-[#D4A24C]">
              <IconKalachakraRespiration size={22} color="#D4A24C" />
            </div>
            <span className="text-xs font-semibold text-[#1B2A41]">Respiration</span>
            <span className="text-[10px] text-[#5B6779]">Ancrage</span>
          </button>
        </div>

        {/* Barre utilitaire discrète */}
        <div className="flex items-center justify-between pt-1 px-1 text-[11px] text-[#5B6779]">
          <button
            type="button"
            onClick={onOpenShareModal}
            className="hover:text-[#1B2A41] transition flex items-center gap-1"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
              <polyline points="16 6 12 2 8 6" />
              <line x1="12" y1="2" x2="12" y2="15" />
            </svg>
            Carte sobre
          </button>

          <button
            type="button"
            onClick={onOpenRelapse}
            className="text-[#5B6779] hover:text-[#C96A3F] transition underline decoration-dotted"
          >
            J’ai traversé une épreuve
          </button>
        </div>
      </div>

      {/* 5. Bouton SOS Flottant terreux (#B8382D) */}
      <motion.button
        type="button"
        onClick={onOpenSos}
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
        className="fixed bottom-6 right-6 z-30 flex h-15 w-15 items-center justify-center rounded-full bg-[#B8382D] text-white shadow-xl shadow-[#B8382D]/35 transition active:scale-90"
        title="SOS d'ancrage immédiat"
        id="nuru-sos-floating-button"
      >
        <span className="text-sm font-extrabold tracking-wider">SOS</span>
      </motion.button>
    </div>
  );
};
