import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BadgeItem, AppState } from '../../types';
import { AdinkraPattern } from '../AdinkraPattern';
import {
  IconGraine,
  IconBaobab,
  IconCalebasse,
  IconKalachakraRespiration,
  IconLuneTamTam,
  IconSoleilLevant,
  IconOiseauLibere,
  IconNoeudAdinkra,
} from '../icons/CustomSvgIcons';
import { triggerHaptic } from '../../utils/soundAndHaptics';

interface BadgesProps {
  badges: BadgeItem[];
  appState?: AppState;
  onClose: () => void;
}

export const BadgesScreen: React.FC<BadgesProps> = ({ badges, appState, onClose }) => {
  const [selectedBadge, setSelectedBadge] = useState<BadgeItem | null>(null);

  const realElapsedDays = appState
    ? Math.floor(Math.max(0, Date.now() - appState.currentCycleStart) / (86400 * 1000))
    : 0;
  const sosCount = appState?.sosCompletedCount ?? 0;
  const entriesCount = appState?.entries.length ?? 0;
  const chaptersCount = appState?.chapters.length ?? 0;

  const renderBadgeIcon = (iconName: string, isUnlocked: boolean) => {
    const color = isUnlocked ? '#D4A24C' : '#5B6779';
    switch (iconName) {
      case 'seed':
        return <IconGraine size={26} color={color} />;
      case 'baobab':
        return <IconBaobab size={26} color={color} />;
      case 'calabash':
        return <IconCalebasse size={26} color={color} />;
      case 'kalachakra':
      case 'kalachakra_ten':
        return <IconKalachakraRespiration size={26} color={color} />;
      case 'moon_drum':
        return <IconLuneTamTam size={26} color={color} />;
      case 'rising_sun':
        return <IconSoleilLevant size={26} color={color} />;
      case 'freed_bird':
      case 'bird_rising':
        return <IconOiseauLibere size={26} color={color} />;
      case 'shield':
      case 'mask':
      case 'phoenix':
      case 'root':
      case 'sprout':
      case 'branch':
      case 'shell':
      default:
        return <IconNoeudAdinkra size={26} color={color} />;
    }
  };

  const getBadgeProgress = (badge: BadgeItem): { current: number; target: number; unit: string } => {
    switch (badge.id) {
      case 'graine':
        return { current: Math.min(realElapsedDays, 1), target: 1, unit: 'jour' };
      case 'pousse':
        return { current: Math.min(realElapsedDays, 3), target: 3, unit: 'jours' };
      case 'racine':
        return { current: Math.min(realElapsedDays, 7), target: 7, unit: 'jours' };
      case 'branche':
        return { current: Math.min(realElapsedDays, 14), target: 14, unit: 'jours' };
      case 'baobab':
        return { current: Math.min(realElapsedDays, 30), target: 30, unit: 'jours' };
      case 'gardien':
        return { current: Math.min(realElapsedDays, 90), target: 90, unit: 'jours' };
      case 'sage':
        return { current: Math.min(realElapsedDays, 180), target: 180, unit: 'jours' };
      case 'legende':
        return { current: Math.min(realElapsedDays, 365), target: 365, unit: 'jours' };
      case 'premier_sos':
        return { current: Math.min(sosCount, 1), target: 1, unit: 'SOS' };
      case 'dix_sos':
        return { current: Math.min(sosCount, 10), target: 10, unit: 'SOS' };
      case 'journalier':
        return { current: Math.min(entriesCount, 7), target: 7, unit: 'entrées' };
      case 'resilient':
        return { current: Math.min(chaptersCount, 1), target: 1, unit: 'retour' };
      case 'nocturne':
      case 'aube':
        return { current: Math.min(realElapsedDays, 10), target: 10, unit: 'jours' };
      case 'silence':
        return { current: Math.min(realElapsedDays, 30), target: 30, unit: 'jours' };
      case 'transmission':
        return { current: badge.unlockedAt ? 1 : 0, target: 1, unit: 'partage' };
      default:
        return { current: badge.unlockedAt ? 1 : 0, target: 1, unit: '' };
    }
  };

  const unlockedCount = badges.filter((b) => !!b.unlockedAt).length;

  return (
    <div
      className="relative flex h-full min-h-[620px] w-full flex-col justify-between overflow-hidden bg-[#FAF4EA] px-5 py-6 text-[#1B2A41]"
      id="nuru-badges-screen"
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
              Badges & Jalons Réels
            </h2>
            <span className="text-[11px] text-[#5B6779]">
              {unlockedCount} sur {badges.length} jalons authentiques atteints
            </span>
          </div>
        </div>
      </div>

      {/* Grille des badges */}
      <div className="relative z-10 flex-1 overflow-y-auto pr-1 py-1">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {badges.map((badge) => {
            const isUnlocked = !!badge.unlockedAt;
            const progress = getBadgeProgress(badge);
            const percent = Math.min(100, Math.round((progress.current / progress.target) * 100));

            return (
              <button
                key={badge.id}
                type="button"
                onClick={() => {
                  triggerHaptic('tap');
                  setSelectedBadge(badge);
                }}
                className={`flex flex-col items-center justify-center rounded-2xl p-3 text-center transition-all ${
                  isUnlocked
                    ? 'border border-[#D4A24C]/40 bg-white shadow-xs hover:border-[#D4A24C]'
                    : 'border border-[#1B2A41]/10 bg-white/40 opacity-70 hover:opacity-100'
                }`}
              >
                <div
                  className={`mb-2 flex h-12 w-12 items-center justify-center rounded-2xl ${
                    isUnlocked ? 'bg-[#D4A24C]/15' : 'bg-[#1B2A41]/5'
                  }`}
                >
                  {renderBadgeIcon(badge.iconName, isUnlocked)}
                </div>

                <span className="text-xs font-bold text-[#1B2A41] line-clamp-1">{badge.name}</span>
                <span className="text-[10px] text-[#5B6779] font-mono mt-0.5">{badge.condition}</span>

                {isUnlocked ? (
                  <span className="mt-1.5 inline-block rounded-full bg-[#3B6255]/10 px-2 py-0.5 text-[9px] font-semibold text-[#3B6255]">
                    Atteint
                  </span>
                ) : (
                  <div className="mt-2 w-full">
                    <div className="h-1 w-full rounded-full bg-[#1B2A41]/10 overflow-hidden">
                      <div
                        className="h-full bg-[#C96A3F] transition-all"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                    <span className="text-[9px] text-[#5B6779] font-mono mt-0.5 block">
                      {progress.current}/{progress.target}
                    </span>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Modal de détail du badge sélectionné */}
      <AnimatePresence>
        {selectedBadge && (() => {
          const progress = getBadgeProgress(selectedBadge);
          const percent = Math.min(100, Math.round((progress.current / progress.target) * 100));

          return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-6 backdrop-blur-xs">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="w-full max-w-xs rounded-3xl bg-[#FAF4EA] p-6 text-center text-[#1B2A41] shadow-2xl"
              >
                <div
                  className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl ${
                    selectedBadge.unlockedAt ? 'bg-[#D4A24C]/20' : 'bg-[#1B2A41]/10'
                  }`}
                >
                  {renderBadgeIcon(selectedBadge.iconName, !!selectedBadge.unlockedAt)}
                </div>

                <h3
                  style={{ fontFamily: 'var(--font-heading, sans-serif)' }}
                  className="text-lg font-bold text-[#1B2A41]"
                >
                  {selectedBadge.name}
                </h3>
                <div className="mt-1 text-xs font-mono font-medium text-[#C96A3F]">
                  Condition : {selectedBadge.condition}
                </div>

                <p className="mt-3 text-xs italic text-[#5B6779] leading-relaxed">
                  "{selectedBadge.description}"
                </p>

                {selectedBadge.unlockedAt ? (
                  <div className="mt-4 rounded-xl bg-[#3B6255]/10 py-2 text-[11px] font-semibold text-[#3B6255]">
                    Débloqué le {new Date(selectedBadge.unlockedAt).toLocaleDateString('fr-FR')}
                  </div>
                ) : (
                  <div className="mt-4 rounded-xl bg-white border border-[#1B2A41]/10 p-2.5 text-[11px] text-[#5B6779]">
                    <div className="flex justify-between font-medium mb-1">
                      <span>Progression réelle :</span>
                      <span className="font-mono text-[#1B2A41]">
                        {progress.current} / {progress.target} {progress.unit} ({percent}%)
                      </span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-[#1B2A41]/10 overflow-hidden">
                      <div
                        className="h-full bg-[#C96A3F] transition-all duration-500"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => setSelectedBadge(null)}
                  className="mt-5 w-full rounded-2xl bg-[#1B2A41] py-2.5 text-xs font-semibold text-white hover:bg-black transition"
                >
                  Fermer
                </button>
              </motion.div>
            </div>
          );
        })()}
      </AnimatePresence>
    </div>
  );
};
