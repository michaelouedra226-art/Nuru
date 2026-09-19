import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AppState } from '../../types';
import { AdinkraPattern } from '../AdinkraPattern';

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

  // Étape du baobab selon streak
  const getBaobabStage = (days: number) => {
    if (days < 3) return { stage: 'Graine en terre', level: 1, desc: 'L’étincelle est posée' };
    if (days < 14) return { stage: 'Jeune pousse', level: 2, desc: 'Première tige vers le ciel' };
    if (days < 60) return { stage: 'Jeune arbre', level: 3, desc: 'Racines bien ancrées' };
    if (days < 180) return { stage: 'Baobab vigoureux', level: 4, desc: 'Tronc massif résilient' };
    return { stage: 'Grand Baobab séculaire', level: 5, desc: 'Cime éternelle & oiseaux du ciel' };
  };

  const baobabInfo = getBaobabStage(currentStreakDays);

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
        {/* Visuel du Baobab SVG évolutif */}
        <div className="relative flex flex-col items-center justify-center rounded-3xl border border-[#1B2A41]/10 bg-white p-6 shadow-xs text-center">
          <div className="relative h-40 w-40 flex items-center justify-center">
            {/* Halo de terre et soleil */}
            <div className="absolute h-32 w-32 rounded-full bg-gradient-to-t from-[#C96A3F]/15 via-[#D4A24C]/20 to-transparent blur-xl" />

            <svg width="140" height="140" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Sol */}
              <path d="M10 85 Q50 82 90 85" stroke="#1B2A41" strokeWidth="2" strokeLinecap="round" />
              <path d="M25 89 Q50 87 75 89" stroke="#C96A3F" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />

              {/* Soleil Levant d'aube pour niveaux >= 3 */}
              {baobabInfo.level >= 3 && (
                <circle cx="78" cy="24" r="8" fill="#D4A24C" opacity="0.4" />
              )}

              {/* Arbre selon niveau */}
              {baobabInfo.level === 1 && (
                /* Graine en terre */
                <g>
                  <circle cx="50" cy="80" r="5" fill="#C96A3F" />
                  <path d="M50 75 Q52 70 54 68" stroke="#3B6255" strokeWidth="2" strokeLinecap="round" />
                </g>
              )}

              {baobabInfo.level === 2 && (
                /* Jeune pousse */
                <g>
                  <path d="M50 85 Q50 65 48 55" stroke="#3B6255" strokeWidth="4" strokeLinecap="round" />
                  <path d="M48 62 Q38 58 35 64 Q42 68 48 64" fill="#5C8B7A" />
                  <path d="M49 57 Q58 52 62 57 Q56 62 49 58" fill="#5C8B7A" />
                </g>
              )}

              {baobabInfo.level >= 3 && (
                /* Tronc Baobab puissant */
                <g>
                  {/* Tronc massif */}
                  <path
                    d="M38 85 C36 70 40 55 44 45 C44 45 42 35 34 26 C38 28 44 32 46 38 C47 32 50 22 50 18 C52 24 53 32 54 38 C56 32 62 28 66 26 C58 35 56 45 56 45 C60 55 64 70 62 85 Z"
                    fill="#3B6255"
                  />
                  {/* Textures d'écorce mandingue */}
                  <path d="M46 72 Q50 68 54 72" stroke="#FAF4EA" strokeWidth="1" strokeLinecap="round" opacity="0.4" />
                  <path d="M44 58 Q50 54 56 58" stroke="#FAF4EA" strokeWidth="1" strokeLinecap="round" opacity="0.4" />

                  {/* Feuillage / cime */}
                  <ellipse cx="50" cy="22" rx="26" ry="14" fill="#5C8B7A" opacity="0.85" />
                  <ellipse cx="36" cy="26" rx="14" ry="10" fill="#3B6255" opacity="0.75" />
                  <ellipse cx="64" cy="26" rx="14" ry="10" fill="#3B6255" opacity="0.75" />

                  {/* Oiseaux libres pour niveau >= 4 */}
                  {baobabInfo.level >= 4 && (
                    <g>
                      <path d="M22 20 Q25 17 28 20 Q31 17 34 20" stroke="#1B2A41" strokeWidth="1.2" strokeLinecap="round" fill="none" />
                      <path d="M72 14 Q74 12 76 14 Q78 12 80 14" stroke="#1B2A41" strokeWidth="1.2" strokeLinecap="round" fill="none" />
                    </g>
                  )}
                </g>
              )}
            </svg>
          </div>

          <span
            style={{ fontFamily: 'var(--font-heading, sans-serif)' }}
            className="mt-2 text-base font-bold text-[#1B2A41]"
          >
            {baobabInfo.stage}
          </span>
          <span className="text-xs text-[#5B6779]">{baobabInfo.desc}</span>
        </div>

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
