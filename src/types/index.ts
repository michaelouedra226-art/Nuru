export type FaithPreference = 'christianity' | 'islam' | 'secular' | 'mixed';

export type MainReason = 'faith' | 'energy' | 'relations' | 'studies';

export type MoodType = 'peaceful' | 'focused' | 'neutral' | 'struggling' | 'distressed';

export type TriggerType = 
  | 'Ennui' 
  | 'Stress' 
  | 'Solitude' 
  | 'Nuit' 
  | 'Réseaux' 
  | 'Fatigue' 
  | 'Colère' 
  | 'Autre';

export interface JournalEntry {
  id: string;
  timestamp: number; // Date Unix ms
  trigger: TriggerType;
  mood: MoodType;
  intensity: number; // 1 to 10
  note: string; // max 500 chars
}

export interface CycleChapter {
  id: string;
  startDate: number;
  endDate: number;
  durationDays: number;
  reasonEnd?: string;
}

export interface BadgeItem {
  id: string;
  name: string;
  condition: string;
  iconName: string;
  description: string;
  unlockedAt?: number;
  category: 'streak' | 'sos' | 'journal' | 'special';
}

export interface QuoteItem {
  id: string;
  text: string;
  source: string;
  category: 'faith_christian' | 'faith_islam' | 'african_proverb' | 'science';
}

export interface VulnerabilityReport {
  criticalDayOfWeek: string | null;
  criticalHourRange: string | null;
  topTriggers: TriggerType[];
  sosSuccessRate: number;
  totalSosCount: number;
  suggestion: string;
}

export interface RiskAnalysis {
  score: number; // 0 to 100
  level: 'faible' | 'modere' | 'eleve';
  message: string;
  actionRecommandee: string;
  contributingFactors: string[];
}

export interface AppSettings {
  userName: string;
  faithPreference: FaithPreference;
  mainReasons: MainReason[];
  temptationHour: number; // 0 - 23
  pinEnabled: boolean;
  pinCode: string; // 6 digits
  biometricsEnabled: boolean;
  autoLockOnBackground: boolean;
  ambientSoundType: 'heartbeat' | 'theta' | 'rain' | 'none';
  decoyMode: boolean; // disguise app as Calculator
  decoyName: 'Calculatrice' | 'Notes' | 'Météo';
  shakeForSos: boolean;
  trustedContactNumber: string;
  audioHeartbeatEnabled: boolean;
  hapticsEnabled: boolean;
  themeMode: 'auto' | 'light' | 'night';
  simplifiedText: boolean;
}

export interface AppState {
  isOnboarded: boolean;
  isUnlocked: boolean; // for PIN
  currentCycleStart: number; // Unix timestamp
  personalRecordDays: number;
  totalCleanDaysEver: number;
  sosCompletedCount: number;
  entries: JournalEntry[];
  chapters: CycleChapter[];
  badges: BadgeItem[];
  settings: AppSettings;
  lastKnownTemptationHour: number;
  lastCheckInDate?: string;
  savedShareCard?: { quote: string; streakDays: number };
}
