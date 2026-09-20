import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AppState, JournalEntry, MainReason, AppSettings } from './types';
import { loadStoredState, saveStoredState } from './utils/storage';
import { evaluateBadges } from './utils/badges';
import { SplashScreen } from './components/screens/SplashScreen';
import { OnboardingScreen } from './components/screens/OnboardingScreen';
import { PinScreen } from './components/screens/PinScreen';
import { HomeScreen } from './components/screens/HomeScreen';
import { SosScreen } from './components/screens/SosScreen';
import { JournalScreen } from './components/screens/JournalScreen';
import { ProgressScreen } from './components/screens/ProgressScreen';
import { BadgesScreen } from './components/screens/BadgesScreen';
import { SettingsScreen } from './components/screens/SettingsScreen';
import { RelapseScreen } from './components/screens/RelapseScreen';
import { MilestoneModal } from './components/screens/MilestoneModal';
import { WidgetSimulatorScreen } from './components/screens/WidgetSimulatorScreen';
import { QuickSettingsTileModal } from './components/QuickSettingsTileModal';
import { ShareExportModal } from './components/screens/ShareExportModal';
import { DecoyCalculatorScreen } from './components/screens/DecoyCalculatorScreen';
import { SoftCheckInBanner } from './components/SoftCheckInBanner';

type ActiveView = 
  | 'splash'
  | 'onboarding'
  | 'pin'
  | 'home'
  | 'sos'
  | 'journal'
  | 'progress'
  | 'badges'
  | 'settings'
  | 'relapse'
  | 'widget'
  | 'decoy';

export default function App() {
  const [state, setState] = useState<AppState>(() => loadStoredState());
  const [currentView, setCurrentView] = useState<ActiveView>('splash');
  const [showTileModal, setShowTileModal] = useState<boolean>(false);
  const [showShareModal, setShowShareModal] = useState<boolean>(false);
  const [milestoneDays, setMilestoneDays] = useState<number | null>(null);
  const [showCheckInBanner, setShowCheckInBanner] = useState<boolean>(false);

  // Synchronisation persistante du state
  useEffect(() => {
    saveStoredState(state);
  }, [state]);

  // Détection de l'heure critique pour le check-in doux contextuel
  useEffect(() => {
    const checkHour = () => {
      const currentHour = new Date().getHours();
      if (currentHour >= 21 || currentHour === state.settings.temptationHour) {
        setShowCheckInBanner(true);
      }
    };
    checkHour();
  }, [state.settings.temptationHour]);

  // Verrouillage automatique Zero-Knowledge lors du passage en arrière-plan
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (
        document.visibilityState === 'hidden' &&
        state.settings.pinEnabled &&
        state.settings.autoLockOnBackground &&
        state.isOnboarded
      ) {
        setState((prev) => ({ ...prev, isUnlocked: false }));
        setCurrentView('pin');
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [state.settings.pinEnabled, state.settings.autoLockOnBackground, state.isOnboarded]);

  // Fin du splash -> redirection
  const handleSplashComplete = () => {
    if (!state.isOnboarded) {
      setCurrentView('onboarding');
    } else if (state.settings.pinEnabled && !state.isUnlocked) {
      setCurrentView('pin');
    } else {
      setCurrentView('home');
    }
  };

  // Fin onboarding avec date de début réelle
  const handleOnboardingComplete = (data: {
    userName: string;
    reasons: MainReason[];
    temptationHour: number;
    startDateTimestamp: number;
  }) => {
    const elapsedDays = Math.floor(
      Math.max(0, Date.now() - data.startDateTimestamp) / (86400 * 1000)
    );
    const { updatedBadges } = evaluateBadges(
      state.badges,
      elapsedDays,
      0,
      0,
      0,
      false
    );

    setState((prev) => ({
      ...prev,
      isOnboarded: true,
      currentCycleStart: data.startDateTimestamp,
      personalRecordDays: Math.max(prev.personalRecordDays, elapsedDays),
      totalCleanDaysEver: Math.max(prev.totalCleanDaysEver, elapsedDays),
      badges: updatedBadges,
      settings: {
        ...prev.settings,
        userName: data.userName,
        mainReasons: data.reasons,
        temptationHour: data.temptationHour,
      },
    }));
    setCurrentView('home');
  };

  // Déverrouillage PIN
  const handlePinSuccess = () => {
    setState((prev) => ({ ...prev, isUnlocked: true }));
    setCurrentView('home');
  };

  // Ajustement précis de la date réelle de départ
  const handleUpdateCycleStart = (newStartTimestamp: number) => {
    setState((prev) => {
      const elapsedDays = Math.floor(
        Math.max(0, Date.now() - newStartTimestamp) / (86400 * 1000)
      );
      const { updatedBadges, newlyUnlocked } = evaluateBadges(
        prev.badges,
        elapsedDays,
        prev.sosCompletedCount,
        prev.entries.length,
        prev.chapters.length,
        false
      );

      if (
        newlyUnlocked.length > 0 &&
        [1, 3, 7, 14, 30, 90, 180, 365].includes(elapsedDays)
      ) {
        setMilestoneDays(elapsedDays);
      }

      return {
        ...prev,
        currentCycleStart: newStartTimestamp,
        personalRecordDays: Math.max(prev.personalRecordDays, elapsedDays),
        totalCleanDaysEver: Math.max(prev.totalCleanDaysEver, elapsedDays),
        badges: updatedBadges,
      };
    });
  };

  // Remise à zéro instantanée (départ à l'instant présent)
  const handleResetToZero = () => {
    handleUpdateCycleStart(Date.now());
  };

  // Ajout d'une entrée journal
  const handleAddJournalEntry = (entryData: Omit<JournalEntry, 'id' | 'timestamp'>) => {
    const newEntry: JournalEntry = {
      id: `entry_${Date.now()}`,
      timestamp: Date.now(),
      ...entryData,
    };

    setState((prev) => {
      const updatedEntries = [newEntry, ...prev.entries];
      const elapsedDays = Math.floor(
        Math.max(0, Date.now() - prev.currentCycleStart) / (86400 * 1000)
      );
      const { updatedBadges } = evaluateBadges(
        prev.badges,
        elapsedDays,
        prev.sosCompletedCount,
        updatedEntries.length,
        prev.chapters.length,
        false
      );

      return {
        ...prev,
        entries: updatedEntries,
        badges: updatedBadges,
      };
    });
  };

  // Suppression d'une entrée journal
  const handleDeleteJournalEntry = (id: string) => {
    setState((prev) => {
      const updatedEntries = prev.entries.filter((e) => e.id !== id);
      const elapsedDays = Math.floor(
        Math.max(0, Date.now() - prev.currentCycleStart) / (86400 * 1000)
      );
      const { updatedBadges } = evaluateBadges(
        prev.badges,
        elapsedDays,
        prev.sosCompletedCount,
        updatedEntries.length,
        prev.chapters.length,
        false
      );

      return {
        ...prev,
        entries: updatedEntries,
        badges: updatedBadges,
      };
    });
  };

  // Victoire SOS
  const handleSosCompleted = () => {
    setState((prev) => {
      const nextSosCount = prev.sosCompletedCount + 1;
      const elapsedDays = Math.floor(
        Math.max(0, Date.now() - prev.currentCycleStart) / (86400 * 1000)
      );
      const { updatedBadges } = evaluateBadges(
        prev.badges,
        elapsedDays,
        nextSosCount,
        prev.entries.length,
        prev.chapters.length,
        false
      );

      return {
        ...prev,
        sosCompletedCount: nextSosCount,
        badges: updatedBadges,
      };
    });
    setCurrentView('home');
  };

  // Confirmation d'épreuve / rechute bienveillante
  const handleConfirmRelapse = (reasonNote?: string) => {
    const currentStreakDays = Math.floor(
      Math.max(0, Date.now() - state.currentCycleStart) / (86400 * 1000)
    );

    const newChapter = {
      id: `chapter_${Date.now()}`,
      startDate: state.currentCycleStart,
      endDate: Date.now(),
      durationDays: currentStreakDays,
      reasonEnd: reasonNote || 'Épreuve traversée — Le voyage continue',
    };

    setState((prev) => {
      const nextChapters = [newChapter, ...prev.chapters];
      const { updatedBadges } = evaluateBadges(
        prev.badges,
        0,
        prev.sosCompletedCount,
        prev.entries.length,
        nextChapters.length,
        false
      );

      return {
        ...prev,
        currentCycleStart: Date.now(),
        personalRecordDays: Math.max(prev.personalRecordDays, currentStreakDays),
        chapters: nextChapters,
        badges: updatedBadges,
      };
    });

    setCurrentView('home');
  };

  // Mise à jour des réglages
  const handleUpdateSettings = (newSettings: Partial<AppSettings>) => {
    setState((prev) => ({
      ...prev,
      settings: {
        ...prev.settings,
        ...newSettings,
      },
    }));
  };

  // Restauration de l'état
  const handleRestoreState = (imported: AppState) => {
    const elapsedDays = Math.floor(
      Math.max(0, Date.now() - imported.currentCycleStart) / (86400 * 1000)
    );
    const { updatedBadges } = evaluateBadges(
      imported.badges,
      elapsedDays,
      imported.sosCompletedCount,
      imported.entries.length,
      imported.chapters.length,
      false
    );

    setState({
      ...imported,
      badges: updatedBadges,
    });
  };

  return (
    <div
      className="flex min-h-screen w-full items-center justify-center bg-[#1B2A41]/15 p-0 sm:p-4 selection:bg-[#C96A3F]/30"
      id="nuru-main-container"
    >
      {/* Cadre de l'appareil mobile (390px x 844px max) pour rendu smartphone pur */}
      <div className="relative flex h-screen sm:h-[844px] w-full max-w-[412px] flex-col overflow-hidden bg-[#FAF4EA] shadow-2xl sm:rounded-[36px] sm:border-[6px] sm:border-[#1B2A41]/20">
        {/* Barre d'état smartphone stylisée avec nom discret ou leurre */}
        <div className="relative z-40 flex items-center justify-between px-6 pt-3 pb-1 text-[11px] font-semibold text-[#1B2A41]/70">
          <span className="font-mono">09:41</span>
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] uppercase tracking-wider text-[#5B6779]">
              {state.settings.decoyMode ? state.settings.decoyName : '100% Hors-Ligne'}
            </span>
            <div className="h-2 w-2 rounded-full bg-[#3B6255]" title="Sécurisé hors-ligne" />
          </div>
        </div>

        {/* Notification in-app "Check-in doux" le soir */}
        <AnimatePresence>
          {showCheckInBanner && currentView === 'home' && (
            <SoftCheckInBanner
              userName={state.settings.userName}
              onOpenJournal={() => {
                setShowCheckInBanner(false);
                setCurrentView('journal');
              }}
              onDismiss={() => setShowCheckInBanner(false)}
            />
          )}
        </AnimatePresence>

        {/* Corps principal avec transitions fluides */}
        <div className="relative flex-1 overflow-hidden">
          <AnimatePresence mode="wait">
            {currentView === 'splash' && (
              <motion.div
                key="splash"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full w-full"
              >
                <SplashScreen onComplete={handleSplashComplete} />
              </motion.div>
            )}

            {currentView === 'onboarding' && (
              <motion.div
                key="onboarding"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="h-full w-full"
              >
                <OnboardingScreen onComplete={handleOnboardingComplete} />
              </motion.div>
            )}

            {currentView === 'pin' && (
              <motion.div
                key="pin"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full w-full"
              >
                <PinScreen
                  correctPin={state.settings.pinCode}
                  biometricsEnabled={state.settings.biometricsEnabled}
                  onSuccess={handlePinSuccess}
                  onDecoyEmergency={() => setCurrentView('decoy')}
                />
              </motion.div>
            )}

            {currentView === 'home' && (
              <motion.div
                key="home"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="h-full w-full"
              >
                <HomeScreen
                  state={state}
                  onOpenSos={() => setCurrentView('sos')}
                  onOpenJournal={() => setCurrentView('journal')}
                  onOpenProgress={() => setCurrentView('progress')}
                  onOpenSettings={() => setCurrentView('settings')}
                  onOpenBadges={() => setCurrentView('badges')}
                  onOpenRelapse={() => setCurrentView('relapse')}
                  onOpenShareModal={() => setShowShareModal(true)}
                />
              </motion.div>
            )}

            {currentView === 'sos' && (
              <motion.div
                key="sos"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                className="h-full w-full"
              >
                <SosScreen
                  state={state}
                  onClose={() => setCurrentView('home')}
                  onSosCompleted={handleSosCompleted}
                  onNavigateToJournal={() => setCurrentView('journal')}
                  onNavigateToSettings={() => setCurrentView('settings')}
                />
              </motion.div>
            )}

            {currentView === 'journal' && (
              <motion.div
                key="journal"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="h-full w-full"
              >
                <JournalScreen
                  entries={state.entries}
                  sosCompletedCount={state.sosCompletedCount}
                  onAddEntry={handleAddJournalEntry}
                  onDeleteEntry={handleDeleteJournalEntry}
                  onClose={() => setCurrentView('home')}
                />
              </motion.div>
            )}

            {currentView === 'progress' && (
              <motion.div
                key="progress"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="h-full w-full"
              >
                <ProgressScreen
                  state={state}
                  onClose={() => setCurrentView('home')}
                  onOpenBadges={() => setCurrentView('badges')}
                />
              </motion.div>
            )}

            {currentView === 'badges' && (
              <motion.div
                key="badges"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="h-full w-full"
              >
                <BadgesScreen
                  badges={state.badges}
                  appState={state}
                  onClose={() => setCurrentView('home')}
                />
              </motion.div>
            )}

            {currentView === 'settings' && (
              <motion.div
                key="settings"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="h-full w-full"
              >
                <SettingsScreen
                  appState={state}
                  settings={state.settings}
                  onUpdateSettings={handleUpdateSettings}
                  onUpdateCycleStart={handleUpdateCycleStart}
                  onResetToZero={handleResetToZero}
                  onRestoreState={handleRestoreState}
                  onClose={() => setCurrentView('home')}
                  onOpenDecoyCalculator={() => setCurrentView('decoy')}
                  onOpenWidgets={() => setCurrentView('widget')}
                  onOpenTile={() => setShowTileModal(true)}
                />
              </motion.div>
            )}

            {currentView === 'relapse' && (
              <motion.div
                key="relapse"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 12 }}
                className="h-full w-full"
              >
                <RelapseScreen
                  state={state}
                  onConfirmRelapse={handleConfirmRelapse}
                  onNavigateToSos={() => setCurrentView('sos')}
                  onNavigateToJournal={() => setCurrentView('journal')}
                  onCancel={() => setCurrentView('home')}
                />
              </motion.div>
            )}

            {currentView === 'widget' && (
              <motion.div
                key="widget"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="h-full w-full"
              >
                <WidgetSimulatorScreen
                  state={state}
                  onOpenSos={() => setCurrentView('sos')}
                  onClose={() => setCurrentView('home')}
                />
              </motion.div>
            )}

            {currentView === 'decoy' && (
              <motion.div
                key="decoy"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full w-full"
              >
                <DecoyCalculatorScreen
                  unlockCode={state.settings.pinCode}
                  onUnlockNuru={() => setCurrentView('home')}
                  onExitDecoy={() => setCurrentView('home')}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Modal de jalon débloqué */}
        <AnimatePresence>
          {milestoneDays !== null && (
            <MilestoneModal
              days={milestoneDays}
              onClose={() => setMilestoneDays(null)}
              onShare={() => {
                setMilestoneDays(null);
                setShowShareModal(true);
              }}
            />
          )}
        </AnimatePresence>

        {/* Tuile Quick Settings Android */}
        <AnimatePresence>
          {showTileModal && (
            <QuickSettingsTileModal
              onTriggerSos={() => setCurrentView('sos')}
              onClose={() => setShowTileModal(false)}
            />
          )}
        </AnimatePresence>

        {/* Modal d'export de partage d'image */}
        <AnimatePresence>
          {showShareModal && (
            <ShareExportModal
              state={state}
              onClose={() => setShowShareModal(false)}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
