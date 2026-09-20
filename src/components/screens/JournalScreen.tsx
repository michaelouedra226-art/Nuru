import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { JournalEntry, TriggerType, MoodType } from '../../types';
import { AdinkraPattern } from '../AdinkraPattern';
import { IconCalebasse } from '../icons/CustomSvgIcons';
import { triggerHaptic } from '../../utils/soundAndHaptics';
import { analyzeVulnerability } from '../../utils/localAI';

interface JournalProps {
  entries: JournalEntry[];
  sosCompletedCount: number;
  onAddEntry: (entry: Omit<JournalEntry, 'id' | 'timestamp'>) => void;
  onDeleteEntry: (id: string) => void;
  onClose: () => void;
}

const ALL_TRIGGERS: TriggerType[] = [
  'Ennui',
  'Stress',
  'Solitude',
  'Nuit',
  'Réseaux',
  'Fatigue',
  'Colère',
  'Autre',
];

const MOODS: { type: MoodType; label: string; emoji: string }[] = [
  { type: 'peaceful', label: 'Serein', emoji: '🕊' },
  { type: 'focused', label: 'Conscient', emoji: '🌿' },
  { type: 'neutral', label: 'Neutre', emoji: '⚖' },
  { type: 'struggling', label: 'Tension', emoji: '🌊' },
  { type: 'distressed', label: 'Fragile', emoji: '🌧' },
];

export const JournalScreen: React.FC<JournalProps> = ({
  entries,
  sosCompletedCount,
  onAddEntry,
  onDeleteEntry,
  onClose,
}) => {
  const [showAddSheet, setShowAddSheet] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [timeFilter, setTimeFilter] = useState<'7j' | '30j' | 'tout'>('tout');

  // Formulaire d'ajout
  const [selectedTrigger, setSelectedTrigger] = useState<TriggerType>('Ennui');
  const [selectedMood, setSelectedMood] = useState<MoodType>('neutral');
  const [intensity, setIntensity] = useState<number>(5);
  const [note, setNote] = useState<string>('');

  // Snackbar d'annulation (undo)
  const [deletedBackup, setDeletedBackup] = useState<JournalEntry | null>(null);

  const report = analyzeVulnerability(entries, sosCompletedCount);

  const handleSave = () => {
    triggerHaptic('tap');
    onAddEntry({
      trigger: selectedTrigger,
      mood: selectedMood,
      intensity,
      note: note.trim(),
    });
    setNote('');
    setShowAddSheet(false);
  };

  const handleDeleteWithUndo = (entry: JournalEntry) => {
    triggerHaptic('tap');
    setDeletedBackup(entry);
    onDeleteEntry(entry.id);
    setTimeout(() => {
      setDeletedBackup((curr) => (curr?.id === entry.id ? null : curr));
    }, 5000);
  };

  const handleUndo = () => {
    if (deletedBackup) {
      onAddEntry({
        trigger: deletedBackup.trigger,
        mood: deletedBackup.mood,
        intensity: deletedBackup.intensity,
        note: deletedBackup.note,
      });
      setDeletedBackup(null);
    }
  };

  // Filtrage des entrées
  const now = Date.now();
  const filteredEntries = entries.filter((e) => {
    if (timeFilter === '7j') return now - e.timestamp <= 7 * 86400000;
    if (timeFilter === '30j') return now - e.timestamp <= 30 * 86400000;
    return true;
  });

  return (
    <div
      className="relative flex h-full min-h-[620px] w-full flex-col justify-between overflow-hidden bg-[#FAF4EA] px-5 py-6 text-[#1B2A41]"
      id="nuru-journal-screen"
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
              Ce que tu portes
            </h2>
            <span className="text-[11px] text-[#5B6779]">Calebasse de vérité & bienveillance</span>
          </div>
        </div>

        {/* Bascule vue analytique */}
        <button
          type="button"
          onClick={() => setShowAnalytics(!showAnalytics)}
          className={`flex h-10 w-10 items-center justify-center rounded-2xl border transition ${
            showAnalytics
              ? 'border-[#C96A3F] bg-[#C96A3F] text-white shadow-xs'
              : 'border-[#1B2A41]/10 bg-white text-[#1B2A41]'
          }`}
          title="Analyses de vulnérabilité"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="20" x2="18" y2="10" />
            <line x1="12" y1="20" x2="12" y2="4" />
            <line x1="6" y1="20" x2="6" y2="14" />
          </svg>
        </button>
      </div>

      {/* Vue analytique OU Liste des entrées */}
      <div className="relative z-10 flex-1 overflow-y-auto pr-1">
        {showAnalytics ? (
          <div className="space-y-4 py-2">
            {/* Boîte diagnostic prédictif local */}
            <div className="rounded-3xl border border-[#C96A3F]/20 bg-white p-4.5 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#C96A3F]">
                  IA Locale Préventive
                </span>
                <span className="rounded-full bg-[#3B6255]/10 px-2 py-0.5 text-[10px] font-semibold text-[#3B6255]">
                  100% hors-ligne
                </span>
              </div>
              <p className="text-sm font-medium text-[#1B2A41] leading-relaxed">
                {report.suggestion}
              </p>

              <div className="mt-4 grid grid-cols-2 gap-2 text-center text-xs">
                <div className="rounded-2xl bg-[#FAF4EA] p-3">
                  <span className="block text-[11px] text-[#5B6779]">Jour critique</span>
                  <span className="font-bold text-[#1B2A41]">{report.criticalDayOfWeek}</span>
                </div>
                <div className="rounded-2xl bg-[#FAF4EA] p-3">
                  <span className="block text-[11px] text-[#5B6779]">Plage horaire</span>
                  <span className="font-bold text-[#C96A3F]">{report.criticalHourRange}</span>
                </div>
              </div>
            </div>

            {/* Déclencheurs fréquents */}
            <div className="rounded-3xl border border-[#1B2A41]/10 bg-white p-4.5 shadow-xs">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#5B6779] mb-3">
                Top déclencheurs identifiés
              </h3>
              <div className="flex flex-wrap gap-2">
                {report.topTriggers.length > 0 ? (
                  report.topTriggers.map((t) => (
                    <span
                      key={t}
                      className="rounded-xl bg-[#FAF4EA] border border-[#1B2A41]/10 px-3 py-1.5 text-xs font-semibold text-[#1B2A41]"
                    >
                      {t}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-[#5B6779] italic">
                    Aucun déclencheur identifié pour le moment.
                  </span>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-3 py-2">
            {/* Filtres de temps */}
            <div className="flex items-center justify-between gap-2 pb-1">
              <div className="flex gap-1.5">
                {(['7j', '30j', 'tout'] as const).map((f) => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => setTimeFilter(f)}
                    className={`rounded-xl px-3 py-1 text-xs font-semibold transition ${
                      timeFilter === f
                        ? 'bg-[#1B2A41] text-white'
                        : 'bg-white text-[#5B6779] border border-[#1B2A41]/10'
                    }`}
                  >
                    {f === '7j' ? '7 jours' : f === '30j' ? '30 jours' : 'Tout'}
                  </button>
                ))}
              </div>

              <span className="text-[11px] text-[#5B6779]">
                {filteredEntries.length} pensée{filteredEntries.length > 1 ? 's' : ''}
              </span>
            </div>

            {/* État vide conforme au cahier des charges */}
            {filteredEntries.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="mb-3 text-[#C96A3F]/50">
                  <IconCalebasse size={48} color="#C96A3F" />
                </div>
                <h3
                  style={{ fontFamily: 'var(--font-heading, sans-serif)' }}
                  className="text-base font-bold text-[#1B2A41]"
                >
                  Ta calebasse est vide.
                </h3>
                <p className="mt-1 text-xs text-[#5B6779] max-w-xs">
                  Écris ta première pensée pour déposer ce qui pèse et garder l’esprit clair.
                </p>
              </div>
            ) : (
              filteredEntries.map((entry) => {
                const dateObj = new Date(entry.timestamp);
                const dateStr = dateObj.toLocaleDateString('fr-FR', {
                  day: 'numeric',
                  month: 'short',
                  hour: '2-digit',
                  minute: '2-digit',
                });
                return (
                  <motion.div
                    key={entry.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="relative rounded-2xl border border-[#1B2A41]/10 bg-white p-4 shadow-xs"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="rounded-lg bg-[#C96A3F]/10 px-2 py-0.5 text-[11px] font-bold text-[#C96A3F]">
                          {entry.trigger}
                        </span>
                        <span className="text-[11px] text-[#5B6779]">
                          Intensité : <strong className="font-mono text-[#1B2A41]">{entry.intensity}/10</strong>
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleDeleteWithUndo(entry)}
                        className="text-[#5B6779] hover:text-[#B8382D] transition p-1"
                        title="Supprimer la pensée"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="3 6 5 6 21 6" />
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                        </svg>
                      </button>
                    </div>

                    {entry.note && (
                      <p className="text-xs text-[#1B2A41] leading-relaxed mb-2 whitespace-pre-wrap">
                        {entry.note}
                      </p>
                    )}

                    <div className="flex items-center justify-between text-[10px] text-[#5B6779] pt-1 border-t border-[#1B2A41]/5">
                      <span>{dateStr}</span>
                      <span className="capitalize">Humeur : {entry.mood}</span>
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>
        )}
      </div>

      {/* Bouton d'ajout central */}
      <div className="relative z-10 pt-3">
        <button
          type="button"
          onClick={() => setShowAddSheet(true)}
          className="w-full rounded-2xl bg-[#C96A3F] py-3.5 text-center text-sm font-semibold text-white shadow-md shadow-[#C96A3F]/25 hover:bg-[#b7592f] transition active:scale-98"
        >
          + Ajouter une entrée
        </button>
      </div>

      {/* Snackbar d'annulation (Section 12.2) */}
      <AnimatePresence>
        {deletedBackup && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-20 left-6 right-6 z-40 flex items-center justify-between rounded-2xl bg-[#1B2A41] px-4 py-3 text-xs text-white shadow-xl"
          >
            <span>Pensée supprimée</span>
            <button
              type="button"
              onClick={handleUndo}
              className="font-bold text-[#D4A24C] hover:underline"
            >
              Annuler (5s)
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom sheet d'ajout */}
      <AnimatePresence>
        {showAddSheet && (
          <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-xs">
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="w-full max-w-md rounded-t-3xl bg-[#FAF4EA] p-6 text-[#1B2A41] shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-4">
                <h3
                  style={{ fontFamily: 'var(--font-heading, sans-serif)' }}
                  className="text-lg font-bold text-[#1B2A41]"
                >
                  Déposer dans la calebasse
                </h3>
                <button
                  type="button"
                  onClick={() => setShowAddSheet(false)}
                  className="text-[#5B6779] p-1"
                >
                  ✕
                </button>
              </div>

              {/* Chips Déclencheur */}
              <div className="mb-4">
                <label className="text-xs font-bold uppercase tracking-wider text-[#5B6779] mb-2 block">
                  Déclencheur
                </label>
                <div className="flex flex-wrap gap-2">
                  {ALL_TRIGGERS.map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => {
                        setSelectedTrigger(t);
                        triggerHaptic('tap');
                      }}
                      className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition ${
                        selectedTrigger === t
                          ? 'bg-[#C96A3F] text-white shadow-xs'
                          : 'bg-white border border-[#1B2A41]/10 text-[#1B2A41]'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Humeur */}
              <div className="mb-4">
                <label className="text-xs font-bold uppercase tracking-wider text-[#5B6779] mb-2 block">
                  Humeur intérieure
                </label>
                <div className="grid grid-cols-5 gap-2 text-center">
                  {MOODS.map((m) => (
                    <button
                      key={m.type}
                      type="button"
                      onClick={() => {
                        setSelectedMood(m.type);
                        triggerHaptic('tap');
                      }}
                      className={`flex flex-col items-center rounded-2xl p-2 transition ${
                        selectedMood === m.type
                          ? 'bg-white border-2 border-[#3B6255] shadow-xs'
                          : 'bg-white/60 border border-[#1B2A41]/10'
                      }`}
                    >
                      <span className="text-xl mb-1">{m.emoji}</span>
                      <span className="text-[10px] font-medium text-[#1B2A41]">{m.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Intensité */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#5B6779]">
                    Intensité de la tension
                  </label>
                  <span className="font-mono font-bold text-[#C96A3F] text-sm">
                    {intensity} / 10
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={intensity}
                  onChange={(e) => setIntensity(Number(e.target.value))}
                  className="w-full accent-[#C96A3F] cursor-pointer"
                />
              </div>

              {/* Note libre */}
              <div className="mb-6">
                <label className="text-xs font-bold uppercase tracking-wider text-[#5B6779] mb-1.5 block">
                  Note libre (max 500 caractères)
                </label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value.slice(0, 500))}
                  placeholder="Que se passe-t-il en toi en cet instant précis ?"
                  rows={3}
                  className="w-full rounded-2xl border border-[#1B2A41]/15 bg-white p-3.5 text-xs text-[#1B2A41] outline-none focus:border-[#C96A3F]"
                />
                <div className="text-right text-[10px] text-[#5B6779] mt-1">
                  {note.length} / 500
                </div>
              </div>

              <button
                type="button"
                onClick={handleSave}
                className="w-full rounded-2xl bg-[#3B6255] py-3.5 text-center text-sm font-bold text-white shadow-md hover:bg-[#2e4f44] transition"
              >
                Enregistrer dans la calebasse
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
