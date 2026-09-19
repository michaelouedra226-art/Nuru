import { AppState } from '../types';
import { INITIAL_APP_STATE } from '../data/initialData';
import { encryptString, decryptString, EncryptedEnvelope } from './crypto';
import { evaluateBadges } from './badges';

const STORAGE_KEY = 'nuru_sanctuary_data_v2';
const ENCRYPTED_STORAGE_KEY = 'nuru_sanctuary_vault_v2';

const LEGACY_STORAGE_KEYS = [
  'nuru_sanctuary_data_v1',
  'nuru_sanctuary_vault_v1',
];

export function loadStoredState(): AppState {
  if (typeof window === 'undefined') return INITIAL_APP_STATE;
  try {
    // Purge inconditionnelle de toutes les anciennes clés hébergeant des données de démo (ex. 42 jours)
    LEGACY_STORAGE_KEYS.forEach((k) => {
      try {
        localStorage.removeItem(k);
      } catch {
        // Ignorer les erreurs d'environnement
      }
    });

    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return INITIAL_APP_STATE;
    const parsed = JSON.parse(raw);

    // Détection rigoureuse : si le timestamp de départ est issu d'une démo (ex. >= 1 jour alors que l'utilisateur n'a aucune donnée réelle)
    const isPhantomPastCycle =
      parsed.currentCycleStart &&
      Date.now() - parsed.currentCycleStart > 86400 * 1000 &&
      (!parsed.entries || parsed.entries.length === 0) &&
      (!parsed.chapters || parsed.chapters.length === 0) &&
      (!parsed.sosCompletedCount || parsed.sosCompletedCount === 0);

    const hasLegacyMockValues =
      parsed.personalRecordDays === 42 ||
      parsed.totalCleanDaysEver === 78 ||
      parsed.entries?.some((e: { id?: string }) => typeof e.id === 'string' && e.id.startsWith('demo_'));

    if (isPhantomPastCycle || hasLegacyMockValues) {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(ENCRYPTED_STORAGE_KEY);
      return INITIAL_APP_STATE;
    }

    const stateToValidate: AppState = {
      ...INITIAL_APP_STATE,
      ...parsed,
      settings: {
        ...INITIAL_APP_STATE.settings,
        ...(parsed.settings || {}),
      },
    };

    // Recalcul strict des badges en fonction de la vérité terrain réelle
    const elapsedDays = Math.floor(
      Math.max(0, Date.now() - stateToValidate.currentCycleStart) / (86400 * 1000)
    );
    const { updatedBadges } = evaluateBadges(
      stateToValidate.badges,
      elapsedDays,
      stateToValidate.sosCompletedCount,
      stateToValidate.entries.length,
      stateToValidate.chapters.length,
      false
    );

    return {
      ...stateToValidate,
      personalRecordDays: Math.max(stateToValidate.personalRecordDays, elapsedDays),
      totalCleanDaysEver: Math.max(stateToValidate.totalCleanDaysEver, elapsedDays),
      badges: updatedBadges,
    };
  } catch {
    return INITIAL_APP_STATE;
  }
}

export function saveStoredState(state: AppState): boolean {
  if (typeof window === 'undefined') return false;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));

    // Si le code PIN est actif, sauvegarder également une copie chiffrée AES-GCM en tâche de fond
    if (state.settings.pinEnabled && state.settings.pinCode) {
      encryptString(JSON.stringify(state), state.settings.pinCode)
        .then((envelope) => {
          localStorage.setItem(ENCRYPTED_STORAGE_KEY, JSON.stringify(envelope));
        })
        .catch(() => {
          // Silencieux
        });
    }

    return true;
  } catch {
    return false;
  }
}

export function exportStateToJson(state: AppState): string {
  const exportPayload = {
    app: 'Nuru',
    version: '1.1.0',
    exportDate: new Date().toISOString(),
    payload: state,
  };
  return JSON.stringify(exportPayload, null, 2);
}

export async function exportStateEncrypted(state: AppState, pin: string): Promise<string> {
  const envelope = await encryptString(JSON.stringify(state), pin);
  const exportPayload = {
    app: 'Nuru',
    format: 'AES-GCM-256',
    exportDate: new Date().toISOString(),
    envelope,
  };
  return JSON.stringify(exportPayload, null, 2);
}

export async function importStateFromJson(jsonString: string, pinForDecrypt?: string): Promise<AppState | null> {
  try {
    const data = JSON.parse(jsonString);

    // Format chiffré AES-GCM
    if (data && data.envelope && data.format === 'AES-GCM-256') {
      if (!pinForDecrypt) {
        throw new Error('Code PIN requis pour déchiffrer ce fichier.');
      }
      const decryptedJson = await decryptString(data.envelope as EncryptedEnvelope, pinForDecrypt);
      const parsed = JSON.parse(decryptedJson);
      return parsed as AppState;
    }

    // Format standard Nuru
    if (data && data.payload && typeof data.payload.currentCycleStart === 'number') {
      return data.payload as AppState;
    }
    if (data && typeof data.currentCycleStart === 'number') {
      return data as AppState;
    }
    return null;
  } catch {
    return null;
  }
}

export function clearAllData(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(ENCRYPTED_STORAGE_KEY);
  } catch {
    // Silencieux
  }
}
