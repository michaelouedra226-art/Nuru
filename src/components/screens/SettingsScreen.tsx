import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AppSettings, AppState } from '../../types';
import { AdinkraPattern } from '../AdinkraPattern';
import { exportStateToJson, exportStateEncrypted, importStateFromJson, clearAllData } from '../../utils/storage';
import { triggerHaptic } from '../../utils/soundAndHaptics';
import { isBiometricsAvailable, registerBiometrics, hasRegisteredBiometrics } from '../../utils/biometrics';

interface SettingsProps {
  appState: AppState;
  settings: AppSettings;
  onUpdateSettings: (newSettings: Partial<AppSettings>) => void;
  onUpdateCycleStart: (timestamp: number) => void;
  onResetToZero: () => void;
  onRestoreState: (importedState: AppState) => void;
  onClose: () => void;
  onOpenDecoyCalculator: () => void;
  onOpenWidgets?: () => void;
  onOpenTile?: () => void;
}

export const SettingsScreen: React.FC<SettingsProps> = ({
  appState,
  settings,
  onUpdateSettings,
  onUpdateCycleStart,
  onResetToZero,
  onRestoreState,
  onClose,
  onOpenDecoyCalculator,
  onOpenWidgets,
  onOpenTile,
}) => {
  const [openSection, setOpenSection] = useState<string>('real_streak');
  const [deleteConfirmationWord, setDeleteConfirmationWord] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);
  const [importPinInput, setImportPinInput] = useState('');
  const [biometricAvailable, setBiometricAvailable] = useState(false);
  const [exportEncryptedMode, setExportEncryptedMode] = useState(true);
  const [statusBanner, setStatusBanner] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  // État local pour le sélecteur de date réelle
  const currentStartDate = new Date(appState.currentCycleStart);
  // Format YYYY-MM-DDTHH:mm pour datetime-local
  const formattedDateTimeLocal = new Date(
    currentStartDate.getTime() - currentStartDate.getTimezoneOffset() * 60000
  )
    .toISOString()
    .slice(0, 16);

  const [inputDate, setInputDate] = useState<string>(formattedDateTimeLocal);

  useEffect(() => {
    isBiometricsAvailable().then((avail) => setBiometricAvailable(avail));
  }, []);

  const toggleSection = (id: string) => {
    triggerHaptic('tap');
    setOpenSection(openSection === id ? '' : id);
  };

  const handleExport = async () => {
    triggerHaptic('tap');
    let content: string;
    let fileName: string;

    if (exportEncryptedMode && settings.pinEnabled && settings.pinCode) {
      content = await exportStateEncrypted(appState, settings.pinCode);
      fileName = `nuru-sauvegarde-securisee-${new Date().toISOString().slice(0, 10)}.nuru.json`;
    } else {
      content = exportStateToJson(appState);
      fileName = `nuru-sauvegarde-${new Date().toISOString().slice(0, 10)}.json`;
    }

    const blob = new Blob([content], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (evt) => {
      const raw = evt.target?.result as string;
      const imported = await importStateFromJson(raw, importPinInput || settings.pinCode);
      if (imported) {
        triggerHaptic('victory');
        onRestoreState(imported);
        setImportError(null);
        setStatusBanner({ message: 'Sauvegarde restaurée avec succès.', type: 'success' });
      } else {
        setImportError('Fichier invalide ou code PIN incorrect pour le déchiffrement.');
      }
    };
    reader.readAsText(file);
  };

  const handleToggleBiometrics = async (enabled: boolean) => {
    if (enabled) {
      const ok = await registerBiometrics(settings.userName);
      if (ok) {
        onUpdateSettings({ biometricsEnabled: true });
        triggerHaptic('victory');
        setStatusBanner({ message: 'Authentification biométrique activée avec succès.', type: 'success' });
      } else {
        setStatusBanner({ message: "Enregistrement biométrique impossible ou refusé par l'appareil.", type: 'error' });
      }
    } else {
      onUpdateSettings({ biometricsEnabled: false });
      setStatusBanner({ message: 'Authentification biométrique désactivée.', type: 'info' });
    }
  };

  const handleConfirmDelete = () => {
    if (deleteConfirmationWord === 'EFFACER') {
      clearAllData();
      window.location.reload();
    }
  };

  const userInitials = (settings.userName || 'N').slice(0, 2).toUpperCase();

  const realElapsedMs = Math.max(0, Date.now() - appState.currentCycleStart);
  const realDays = Math.floor(realElapsedMs / (86400 * 1000));
  const realHours = Math.floor((realElapsedMs % (86400 * 1000)) / (3600 * 1000));

  const handleApplyCustomDate = (dateTimeString: string) => {
    const parsed = new Date(dateTimeString).getTime();
    if (!isNaN(parsed) && parsed <= Date.now()) {
      triggerHaptic('tap');
      onUpdateCycleStart(parsed);
      setInputDate(dateTimeString);
      setStatusBanner({ message: 'Date de point de départ mise à jour avec succès.', type: 'success' });
    } else if (parsed > Date.now()) {
      setStatusBanner({ message: 'La date de départ ne peut pas être dans le futur.', type: 'error' });
    }
  };

  const handleSetPastDays = (daysAgo: number) => {
    triggerHaptic('tap');
    const timestamp = Date.now() - daysAgo * 24 * 3600 * 1000;
    onUpdateCycleStart(timestamp);
    const d = new Date(timestamp);
    const iso = new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
    setInputDate(iso);
  };

  return (
    <div
      className="relative flex h-full min-h-[620px] w-full flex-col justify-between overflow-hidden bg-[#FAF4EA] px-5 py-6 text-[#1B2A41]"
      id="nuru-settings-screen"
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
              Réglages du Sanctuaire
            </h2>
            <span className="text-[11px] text-[#5B6779]">Vérité des données, sécurité & audio</span>
          </div>
        </div>
      </div>

      {/* Notification Toast/Banner */}
      <AnimatePresence>
        {statusBanner && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className={`relative z-10 mb-3 flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-medium border ${
              statusBanner.type === 'success'
                ? 'bg-[#3B6255]/10 text-[#3B6255] border-[#3B6255]/20'
                : statusBanner.type === 'error'
                ? 'bg-rose-50 text-rose-700 border-rose-200'
                : 'bg-[#1B2A41]/10 text-[#1B2A41] border-[#1B2A41]/20'
            }`}
          >
            <span>{statusBanner.message}</span>
            <button
              type="button"
              onClick={() => setStatusBanner(null)}
              className="ml-2 text-current opacity-60 hover:opacity-100 transition text-sm leading-none"
            >
              ×
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative z-10 flex-1 overflow-y-auto pr-1 py-1 space-y-3">
        {/* 1. Jalon Réel & Date de Départ */}
        <div className="rounded-2xl border border-[#1B2A41]/10 bg-white overflow-hidden shadow-xs">
          <button
            type="button"
            onClick={() => toggleSection('real_streak')}
            className="flex w-full items-center justify-between p-4 text-left font-semibold text-sm"
          >
            <div className="flex items-center gap-2">
              <span>Jalon Réel & Date de Départ</span>
              <span className="rounded-full bg-[#D4A24C]/15 px-2 py-0.5 text-[9px] font-bold text-[#D4A24C]">
                {realDays}j {realHours}h réels
              </span>
            </div>
            <span className="text-xs text-[#5B6779]">{openSection === 'real_streak' ? '▲' : '▼'}</span>
          </button>

          {openSection === 'real_streak' && (
            <div className="p-4 pt-0 border-t border-[#1B2A41]/5 space-y-3 text-xs">
              <p className="text-[#5B6779] leading-relaxed">
                Configure ici ta véritable date et heure de départ pour que le compteur d'accueil et les badges reflètent fidèlement ta réalité.
              </p>

              <div>
                <label className="text-[11px] font-medium text-[#5B6779] block mb-1">
                  Date et heure de début de mon abstinence :
                </label>
                <input
                  type="datetime-local"
                  value={inputDate}
                  max={new Date().toISOString().slice(0, 16)}
                  onChange={(e) => {
                    setInputDate(e.target.value);
                    handleApplyCustomDate(e.target.value);
                  }}
                  className="w-full rounded-xl border border-[#1B2A41]/15 px-3 py-2 font-mono text-xs font-semibold text-[#1B2A41] outline-none focus:border-[#C96A3F]"
                />
              </div>

              <div>
                <span className="text-[11px] font-medium text-[#5B6779] block mb-1.5">
                  Raccourcis rapides :
                </span>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={onResetToZero}
                    className="rounded-xl border border-[#3B6255]/30 bg-[#3B6255]/10 py-2 text-[11px] font-bold text-[#3B6255] hover:bg-[#3B6255] hover:text-white transition"
                  >
                    Maintenant (0j)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSetPastDays(1)}
                    className="rounded-xl border border-[#1B2A41]/10 bg-white py-2 text-[11px] font-medium text-[#1B2A41] hover:bg-[#FAF4EA] transition"
                  >
                    Hier (J1)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSetPastDays(3)}
                    className="rounded-xl border border-[#1B2A41]/10 bg-white py-2 text-[11px] font-medium text-[#1B2A41] hover:bg-[#FAF4EA] transition"
                  >
                    Il y a 3j (J3)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSetPastDays(7)}
                    className="rounded-xl border border-[#1B2A41]/10 bg-white py-2 text-[11px] font-medium text-[#1B2A41] hover:bg-[#FAF4EA] transition"
                  >
                    Il y a 7j (J7)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSetPastDays(14)}
                    className="rounded-xl border border-[#1B2A41]/10 bg-white py-2 text-[11px] font-medium text-[#1B2A41] hover:bg-[#FAF4EA] transition"
                  >
                    Il y a 14j (J14)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSetPastDays(30)}
                    className="rounded-xl border border-[#1B2A41]/10 bg-white py-2 text-[11px] font-medium text-[#1B2A41] hover:bg-[#FAF4EA] transition"
                  >
                    Il y a 30j (J30)
                  </button>
                </div>
              </div>

              <div className="rounded-xl bg-[#FAF4EA] p-3 text-[11px] text-[#5B6779] border border-[#1B2A41]/5 space-y-1">
                <div className="flex justify-between">
                  <span>Jours réels comptabilisés :</span>
                  <strong className="text-[#1B2A41] font-mono">{realDays} jour(s)</strong>
                </div>
                <div className="flex justify-between">
                  <span>Badges débloqués :</span>
                  <strong className="text-[#D4A24C] font-mono">
                    {appState.badges.filter((b) => !!b.unlockedAt).length} / {appState.badges.length}
                  </strong>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 2. Profil */}
        <div className="rounded-2xl border border-[#1B2A41]/10 bg-white overflow-hidden shadow-xs">
          <button
            type="button"
            onClick={() => toggleSection('profile')}
            className="flex w-full items-center justify-between p-4 text-left font-semibold text-sm"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#D4A24C] text-white font-bold text-xs shadow-xs">
                {userInitials}
              </div>
              <span>Profil & Prénom</span>
            </div>
            <span className="text-xs text-[#5B6779]">{openSection === 'profile' ? '▲' : '▼'}</span>
          </button>

          {openSection === 'profile' && (
            <div className="p-4 pt-0 border-t border-[#1B2A41]/5 space-y-3">
              <div>
                <label className="text-xs text-[#5B6779] block mb-1">Prénom utilisé</label>
                <input
                  type="text"
                  value={settings.userName}
                  onChange={(e) => onUpdateSettings({ userName: e.target.value })}
                  maxLength={24}
                  placeholder="Mon prénom"
                  className="w-full rounded-xl border border-[#1B2A41]/15 px-3 py-2 text-xs font-medium outline-none focus:border-[#C96A3F]"
                />
              </div>
            </div>
          )}
        </div>

        {/* 3. Discrétion, PIN & Biométrie */}
        <div className="rounded-2xl border border-[#1B2A41]/10 bg-white overflow-hidden shadow-xs">
          <button
            type="button"
            onClick={() => toggleSection('discretion')}
            className="flex w-full items-center justify-between p-4 text-left font-semibold text-sm"
          >
            <div className="flex items-center gap-2">
              <span>Sécurité, PIN & Biométrie</span>
              <span className="rounded-full bg-[#3B6255]/10 px-2 py-0.5 text-[9px] font-bold text-[#3B6255]">
                AES-GCM
              </span>
            </div>
            <span className="text-xs text-[#5B6779]">{openSection === 'discretion' ? '▲' : '▼'}</span>
          </button>

          {openSection === 'discretion' && (
            <div className="p-4 pt-0 border-t border-[#1B2A41]/5 space-y-3">
              {/* Code PIN */}
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-medium block">Verrouillage par code PIN</span>
                  <span className="text-[10px] text-[#5B6779]">Chiffre les données en mémoire locale</span>
                </div>
                <input
                  type="checkbox"
                  checked={settings.pinEnabled}
                  onChange={(e) => onUpdateSettings({ pinEnabled: e.target.checked })}
                  className="h-4 w-4 accent-[#C96A3F]"
                />
              </div>

              {settings.pinEnabled && (
                <div>
                  <label className="text-xs text-[#5B6779] block mb-1">Code PIN (6 chiffres)</label>
                  <input
                    type="password"
                    maxLength={6}
                    value={settings.pinCode}
                    onChange={(e) => onUpdateSettings({ pinCode: e.target.value.replace(/\D/g, '') })}
                    className="w-full rounded-xl border border-[#1B2A41]/15 px-3 py-2 font-mono text-center tracking-widest text-sm"
                  />
                </div>
              )}

              {/* Biométrie WebAuthn */}
              {biometricAvailable && (
                <div className="flex items-center justify-between pt-2 border-t border-[#1B2A41]/5">
                  <div>
                    <span className="text-xs font-medium block">Empreinte digitale / Passkey</span>
                    <span className="text-[10px] text-[#5B6779]">
                      {hasRegisteredBiometrics() ? 'Capteur local actif' : 'Enregistrer son empreinte'}
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.biometricsEnabled}
                    onChange={(e) => handleToggleBiometrics(e.target.checked)}
                    className="h-4 w-4 accent-[#3B6255]"
                  />
                </div>
              )}

              {/* Verrouillage automatique arrière-plan */}
              <div className="flex items-center justify-between pt-2 border-t border-[#1B2A41]/5">
                <div>
                  <span className="text-xs font-medium block">Verrouillage automatique en arrière-plan</span>
                  <span className="text-[10px] text-[#5B6779]">Re-verrouille si l’écran s’éteint ou change d'app</span>
                </div>
                <input
                  type="checkbox"
                  checked={settings.autoLockOnBackground}
                  onChange={(e) => onUpdateSettings({ autoLockOnBackground: e.target.checked })}
                  className="h-4 w-4 accent-[#C96A3F]"
                />
              </div>

              {/* Nom leurre */}
              <div className="pt-2 border-t border-[#1B2A41]/5">
                <span className="text-xs font-medium block mb-1">Nom leurre du launcher</span>
                <div className="grid grid-cols-3 gap-2">
                  {(['Calculatrice', 'Notes', 'Météo'] as const).map((name) => (
                    <button
                      key={name}
                      type="button"
                      onClick={() => onUpdateSettings({ decoyName: name })}
                      className={`rounded-xl py-2 text-xs font-semibold border transition ${
                        settings.decoyName === name
                          ? 'bg-[#1B2A41] text-white border-[#1B2A41]'
                          : 'bg-white border-[#1B2A41]/10 text-[#5B6779]'
                      }`}
                    >
                      {name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={onOpenDecoyCalculator}
                  className="w-full rounded-xl border border-[#1B2A41]/15 bg-[#FAF4EA] py-2.5 text-center text-xs font-semibold text-[#1B2A41] hover:bg-[#1B2A41] hover:text-white transition"
                >
                  Tester la Fausse Calculatrice (Mode Urgence)
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 4. Audio procédural */}
        <div className="rounded-2xl border border-[#1B2A41]/10 bg-white overflow-hidden shadow-xs">
          <button
            type="button"
            onClick={() => toggleSection('sound')}
            className="flex w-full items-center justify-between p-4 text-left font-semibold text-sm"
          >
            <span>Générateur Audio Procédural (Web Audio)</span>
            <span className="text-xs text-[#5B6779]">{openSection === 'sound' ? '▲' : '▼'}</span>
          </button>

          {openSection === 'sound' && (
            <div className="p-4 pt-0 border-t border-[#1B2A41]/5 space-y-3">
              <span className="text-xs text-[#5B6779] block">
                Synthèse sonore mathématique temps réel (sans aucun fichier MP3 externe).
              </span>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'theta', label: 'Ondes Thêta', desc: 'Binaural 5.5 Hz (Système parasympathique)' },
                  { id: 'heartbeat', label: 'Cœur lub-dub', desc: 'Rythme à 54 BPM rassurant' },
                  { id: 'rain', label: 'Pluie & Vent', desc: 'Bruit rose filtré sous le baobab' },
                  { id: 'none', label: 'Silencieux', desc: 'Aucune onde sonore' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() =>
                      onUpdateSettings({
                        ambientSoundType: item.id as 'heartbeat' | 'theta' | 'rain' | 'none',
                      })
                    }
                    className={`rounded-xl p-2.5 text-left border transition ${
                      settings.ambientSoundType === item.id
                        ? 'border-[#C96A3F] bg-[#C96A3F]/10 text-[#C96A3F]'
                        : 'border-[#1B2A41]/10 text-[#5B6779]'
                    }`}
                  >
                    <span className="font-bold text-xs block">{item.label}</span>
                    <span className="text-[10px] opacity-80">{item.desc}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 5. Données & Portabilité */}
        <div className="rounded-2xl border border-[#1B2A41]/10 bg-white overflow-hidden shadow-xs">
          <button
            type="button"
            onClick={() => toggleSection('data')}
            className="flex w-full items-center justify-between p-4 text-left font-semibold text-sm"
          >
            <span>Données & Portabilité (Zero-Knowledge)</span>
            <span className="text-xs text-[#5B6779]">{openSection === 'data' ? '▲' : '▼'}</span>
          </button>

          {openSection === 'data' && (
            <div className="p-4 pt-0 border-t border-[#1B2A41]/5 space-y-2.5">
              <div className="flex items-center justify-between pb-2 border-b border-[#1B2A41]/5">
                <span className="text-xs text-[#5B6779]">Chiffrement AES-GCM 256 bits</span>
                <input
                  type="checkbox"
                  checked={exportEncryptedMode}
                  onChange={(e) => setExportEncryptedMode(e.target.checked)}
                  className="h-4 w-4 accent-[#3B6255]"
                />
              </div>

              <button
                type="button"
                onClick={handleExport}
                className="w-full rounded-xl border border-[#1B2A41]/15 bg-white py-2.5 text-xs font-semibold text-[#1B2A41] hover:bg-[#FAF4EA] transition"
              >
                Exporter mes données {exportEncryptedMode ? '(Chiffrées AES-GCM)' : '(JSON brut)'}
              </button>

              <div className="pt-2">
                <label className="text-[11px] text-[#5B6779] block mb-1">
                  Code PIN de déchiffrement (si archive chiffrée) :
                </label>
                <input
                  type="password"
                  maxLength={6}
                  placeholder="PIN du fichier"
                  value={importPinInput}
                  onChange={(e) => setImportPinInput(e.target.value)}
                  className="w-full rounded-xl border border-[#1B2A41]/15 px-3 py-1.5 text-xs mb-2"
                />
                <label className="block w-full cursor-pointer rounded-xl border border-[#1B2A41]/15 bg-white py-2.5 text-center text-xs font-semibold text-[#1B2A41] hover:bg-[#FAF4EA] transition">
                  <span>Importer une sauvegarde JSON</span>
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImportFile}
                    className="hidden"
                  />
                </label>
              </div>

              {importError && (
                <span className="text-[10px] text-[#B8382D] block">{importError}</span>
              )}

              <div className="pt-2 border-t border-[#1B2A41]/10">
                <button
                  type="button"
                  onClick={() => setShowDeleteModal(true)}
                  className="w-full rounded-xl bg-[#B8382D]/10 py-2.5 text-xs font-bold text-[#B8382D] hover:bg-[#B8382D] hover:text-white transition"
                >
                  Effacer toutes mes données
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 6. Intégrations Android & Raccourcis */}
        {(onOpenWidgets || onOpenTile) && (
          <div className="rounded-2xl border border-[#1B2A41]/10 bg-white overflow-hidden shadow-xs">
            <button
              type="button"
              onClick={() => toggleSection('android')}
              className="flex w-full items-center justify-between p-4 text-left font-semibold text-sm"
            >
              <span>Intégrations Android (Widgets & Tuile)</span>
              <span className="text-xs text-[#5B6779]">{openSection === 'android' ? '▲' : '▼'}</span>
            </button>

            {openSection === 'android' && (
              <div className="p-4 pt-0 border-t border-[#1B2A41]/5 space-y-2.5">
                <span className="text-xs text-[#5B6779] block">
                  Aperçu des intégrations natives pour l'écran d'accueil et le volet de configuration rapide Android.
                </span>
                {onOpenWidgets && (
                  <button
                    type="button"
                    onClick={onOpenWidgets}
                    className="w-full rounded-xl border border-[#1B2A41]/15 bg-white py-2.5 px-3 text-xs font-semibold text-[#1B2A41] hover:bg-[#FAF4EA] transition flex items-center justify-between"
                  >
                    <span>Aperçu des Widgets Android (Compact & Étendu)</span>
                    <span className="text-xs text-[#5B6779]">Ouvrir</span>
                  </button>
                )}
                {onOpenTile && (
                  <button
                    type="button"
                    onClick={onOpenTile}
                    className="w-full rounded-xl border border-[#1B2A41]/15 bg-white py-2.5 px-3 text-xs font-semibold text-[#1B2A41] hover:bg-[#FAF4EA] transition flex items-center justify-between"
                  >
                    <span>Simulateur Tuile Rapide (Quick Settings Tile)</span>
                    <span className="text-xs text-[#5B6779]">Ouvrir</span>
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {/* 7. À propos & Positionnement clinique */}
        <div className="rounded-2xl border border-[#1B2A41]/10 bg-white overflow-hidden shadow-xs">
          <button
            type="button"
            onClick={() => toggleSection('about')}
            className="flex w-full items-center justify-between p-4 text-left font-semibold text-sm"
          >
            <span>À propos & Positionnement Clinique</span>
            <span className="text-xs text-[#5B6779]">{openSection === 'about' ? '▲' : '▼'}</span>
          </button>

          {openSection === 'about' && (
            <div className="p-4 pt-0 border-t border-[#1B2A41]/5 space-y-3 text-xs text-[#5B6779] leading-relaxed">
              <div className="flex items-center gap-3 pt-3">
                <img
                  src="/icon.png"
                  alt="Nuru Icon"
                  referrerPolicy="no-referrer"
                  className="h-12 w-12 rounded-2xl object-cover shadow-sm border border-[#1B2A41]/10"
                />
                <div>
                  <h4
                    style={{ fontFamily: 'var(--font-heading, sans-serif)' }}
                    className="text-sm font-bold text-[#1B2A41]"
                  >
                    Nuru — Sanctuaire & Dignité
                  </h4>
                  <span className="text-[11px] text-[#C96A3F] font-mono">v1.2.0 · Édition Résilience Réaliste</span>
                </div>
              </div>
              <p>
                <strong className="text-[#1B2A41]">Architecture technique :</strong> 100% hors-ligne, persistance chiffrée AES-GCM 256 bits, audio procédural Web Audio (ondes thêta d’apaisement) et modélisation biologique du Baobab basée sur la neuroplasticité dopaminergique.
              </p>
              <p>
                <strong className="text-[#1B2A41]">Positionnement clinique :</strong> Nuru ne pose aucun jugement moral. L’application accompagne les personnes traversant une perte de contrôle compulsive ou désireuses de vivre leur continence en harmonie avec leurs convictions.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Modal d'effacement sécurisé */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-6 backdrop-blur-xs">
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            className="w-full max-w-xs rounded-3xl bg-[#FAF4EA] p-6 text-[#1B2A41] shadow-2xl"
          >
            <h3
              style={{ fontFamily: 'var(--font-heading, sans-serif)' }}
              className="text-base font-bold text-[#B8382D]"
            >
              Action irréversible
            </h3>
            <p className="mt-2 text-xs text-[#5B6779]">
              Pour confirmer la suppression totale de ton journal, ton streak et tes badges, écris le mot <strong className="text-[#B8382D]">EFFACER</strong> ci-dessous :
            </p>

            <input
              type="text"
              value={deleteConfirmationWord}
              onChange={(e) => setDeleteConfirmationWord(e.target.value)}
              placeholder="EFFACER"
              className="mt-3 w-full rounded-xl border border-[#B8382D]/30 p-2 text-center font-mono font-bold text-sm uppercase text-[#B8382D] outline-none"
            />

            <div className="mt-4 flex flex-col gap-2">
              <button
                type="button"
                disabled={deleteConfirmationWord !== 'EFFACER'}
                onClick={handleConfirmDelete}
                className="w-full rounded-xl bg-[#B8382D] py-2.5 text-xs font-bold text-white disabled:opacity-30"
              >
                Tout effacer
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteConfirmationWord('');
                }}
                className="w-full rounded-xl border border-[#1B2A41]/10 bg-white py-2 text-xs font-medium text-[#5B6779]"
              >
                Annuler
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};
