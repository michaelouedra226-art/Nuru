import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AppState } from '../../types';
import { AdinkraPattern } from '../AdinkraPattern';
import { RealisticBaobabIllustration, getBaobabBiologicalStage } from '../RealisticBaobabIllustration';

interface ProgressProps {
  state: AppState;
  onClose: () => void;
  onOpenBadges: () => void;
}

export const ProgressScreen: React.FC<ProgressProps> = ({
  state,
  onClose,
  onOpenBadges,
}) => {
  const [showChapters, setShowChapters] = useState(false);

  const currentStreakDays = Math.floor(
    Math.max(0, Date.now() - state.currentCycleStart) / (86400 * 1000)
  );
  const hoursSaved = Math.round((currentStreakDays * 20) / 60);

  const baobabInfo = getBaobabBiologicalStage(currentStreakDays);

  const now = Date.now();
  const dayMs = 86400 * 1000;
  // Calcul 100% réel des 14 derniers jours sans aucune simulation factice
  const last14Days = Array.from({ length: 14 }).map((_, idx) => {
    // idx 0 = il y a 13 jours, idx 13 = aujourd'hui
    const daysAgo = 13 - idx;
    const dayStart = new Date(now - daysAgo * dayMs);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(dayStart.getTime() + dayMs);

    // Le jour est-il dans la période de clarté du cycle actuel ?
    const isWithinCurrentCycle = dayEnd.getTime() > state.currentCycleStart;

    // Y a-t-il une entrée de journal ce jour-là ?
    const hasEntry = state.entries.some((e) => {
      const t = new Date(e.timestamp).getTime();
      return t >= dayStart.getTime() && t < dayEnd.getTime();
    });

    let heightPercent = 10;
    let isClean = false;

    if (isWithinCurrentCycle) {
      isClean = true;
      heightPercent = hasEntry ? 85 : 45;
    } else {
      isClean = false;
      heightPercent = 10;
    }

    return { day: idx + 1, isClean, heightPercent };
  });

  return (
    <div
      className="relative flex h-full min-h-[620px] w-full flex-col justify-between overflow-hidden bg-[#FAF4EA] px-5 py-6 text-[#1B2A41]"
      id="nuru-progress-screen"
    >
      <AdinkraPattern opacity={0.03} />

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between pb-2">
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
              Évolution du Baobab
            </h2>
            <span className="text-[11px] text-[#5B6779]">Ta croissance continue</span>
          </div>
        </div>

        <button
          type="button"
          onClick={onOpenBadges}
          className="rounded-2xl border border-[#D4A24C]/40 bg-white px-3 py-1.5 text-xs font-semibold text-[#D4A24C] shadow-xs hover:bg-[#FAF4EA] transition"
        >
          Badges
        </button>
      </div>

      <div className="relative z-10 flex-1 overflow-y-auto pr-1 py-1 space-y-4">
        {/* Visuel du Baobab biologique réaliste avec ciel circadien */}
        <RealisticBaobabIllustration
          days={currentStreakDays}
          size="standard"
          showDetailsCard={true}
        />

        {/* Chiffres & statistiques assumées */}
        <div className="grid grid-cols-2 gap-2.5">
          <div className="rounded-2xl border border-[#1B2A41]/10 bg-white p-3.5 shadow-xs">
            <span className="text-[11px] font-semibold text-[#5B6779] block">Record personnel</span>
            <span
              style={{ fontFamily: 'var(--font-display, serif)' }}
              className="text-2xl text-[#1B2A41]"
            >
              {Math.max(state.personalRecordDays, currentStreakDays)} j
            </span>
            <span className="text-[10px] text-[#3B6255] font-medium block mt-0.5">
              Jamais réinitialisé
            </span>
          </div>

          <div className="rounded-2xl border border-[#1B2A41]/10 bg-white p-3.5 shadow-xs">
            <span className="text-[11px] font-semibold text-[#5B6779] block">Temps reconquis</span>
            <span
              style={{ fontFamily: 'var(--font-display, serif)' }}
              className="text-2xl text-[#C96A3F]"
            >
              {hoursSaved} h
            </span>
            <span className="text-[10px] text-[#5B6779] font-medium block mt-0.5">
              20 min / j réinvesties
            </span>
          </div>

          <div className="rounded-2xl border border-[#1B2A41]/10 bg-white p-3.5 shadow-xs">
            <span className="text-[11px] font-semibold text-[#5B6779] block">Jours cumulés</span>
            <span
              style={{ fontFamily: 'var(--font-display, serif)' }}
              className="text-2xl text-[#1B2A41]"
            >
              {state.totalCleanDaysEver} j
            </span>
            <span className="text-[10px] text-[#5B6779] font-medium block mt-0.5">
              Toutes victoires confondues
            </span>
          </div>

          <div className="rounded-2xl border border-[#1B2A41]/10 bg-white p-3.5 shadow-xs">
            <span className="text-[11px] font-semibold text-[#5B6779] block">SOS d'ancrage</span>
            <span
              style={{ fontFamily: 'var(--font-display, serif)' }}
              className="text-2xl text-[#D4A24C]"
            >
              {state.sosCompletedCount}
            </span>
            <span className="text-[10px] text-[#3B6255] font-medium block mt-0.5">
              Tempêtes traversées
            </span>
          </div>
        </div>

        {/* Graphique 14 jours (barres fines sans axes agressifs) */}
        <div className="rounded-3xl border border-[#1B2A41]/10 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#5B6779]">
              Constance — 14 derniers jours
            </span>
            <span className="text-[10px] text-[#3B6255] font-semibold">
              {currentStreakDays === 0 ? "Jour d'ancrage" : `${currentStreakDays} j actifs`}
            </span>
          </div>

          <div className="flex h-20 items-end justify-between gap-1.5 px-1">
            {last14Days.map((item, idx) => (
              <div key={idx} className="flex flex-1 flex-col items-center gap-1.5 h-full justify-end">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${item.heightPercent}%` }}
                  transition={{ duration: 0.6, delay: idx * 0.03 }}
                  className={`w-full max-w-[12px] rounded-full ${
                    item.isClean ? 'bg-gradient-to-t from-[#3B6255] to-[#D4A24C]' : 'bg-[#1B2A41]/15'
                  }`}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bouton bas de page : Voir mon voyage complet (chapitres) */}
      <div className="relative z-10 pt-3">
        <button
          type="button"
          onClick={() => setShowChapters(true)}
          className="w-full rounded-2xl border border-[#1B2A41]/15 bg-white py-3.5 text-center text-xs font-semibold text-[#1B2A41] shadow-xs hover:bg-[#FAF4EA] transition"
        >
          Voir mon voyage complet ({state.chapters.length + 1} chapitres)
        </button>
      </div>

      {/* Modal Voyage complet / Chapitres */}
      <AnimatePresence>
        {showChapters && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-5 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-sm rounded-3xl bg-[#FAF4EA] p-6 text-[#1B2A41] shadow-2xl max-h-[85vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-4">
                <h3
                  style={{ fontFamily: 'var(--font-heading, sans-serif)' }}
                  className="text-lg font-bold text-[#1B2A41]"
                >
                  Les chapitres de ton voyage
                </h3>
                <button
                  type="button"
                  onClick={() => setShowChapters(false)}
                  className="text-[#5B6779] p-1"
                >
                  ✕
                </button>
              </div>
              <p className="text-xs text-[#5B6779] mb-4">
                Chaque étape est un apprentissage, jamais un échec. Ton arbre continue de grandir.
              </p>

              <div className="space-y-3">
                {/* Chapitre en cours */}
                <div className="rounded-2xl border border-[#3B6255] bg-white p-3.5">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-bold text-[#3B6255]">Chapitre actuel</span>
                    <span className="font-mono text-xs font-bold text-[#C96A3F]">
                      {currentStreakDays} jours
                    </span>
                  </div>
                  <span className="text-[11px] text-[#5B6779]">
                    Débuté le {new Date(state.currentCycleStart).toLocaleDateString('fr-FR')}
                  </span>
                </div>

                {/* Anciens chapitres */}
                {state.chapters.map((ch, idx) => (
                  <div key={ch.id} className="rounded-2xl border border-[#1B2A41]/10 bg-white/70 p-3.5">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-semibold text-[#1B2A41]">
                        Chapitre {state.chapters.length - idx}
                      </span>
                      <span className="font-mono text-xs text-[#1B2A41]">
                        {ch.durationDays} jours
                      </span>
                    </div>
                    {ch.reasonEnd && (
                      <p className="text-[11px] text-[#5B6779] italic mt-1">
                        "{ch.reasonEnd}"
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
