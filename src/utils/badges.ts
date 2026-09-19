import { BadgeItem } from '../types';
import { INITIAL_BADGES } from '../data/initialData';

/**
 * Moteur d'évaluation 100% réel et déterministe des badges.
 * Ne débloque aucun badge artificiellement.
 * Chaque jalon est calculé sur la base exacte des métriques réelles de l'utilisateur.
 */
export function evaluateBadges(
  existingBadges: BadgeItem[] = [],
  currentStreakDays: number,
  sosCompletedCount: number,
  journalEntriesCount: number,
  chaptersCount: number,
  hasSharedCard: boolean = false
): { updatedBadges: BadgeItem[]; newlyUnlocked: BadgeItem[] } {
  const badgeMap = new Map<string, BadgeItem>();
  for (const b of existingBadges) {
    badgeMap.set(b.id, b);
  }

  const newlyUnlocked: BadgeItem[] = [];

  const updatedBadges: BadgeItem[] = INITIAL_BADGES.map((template) => {
    const existing = badgeMap.get(template.id);
    let conditionMet = false;

    switch (template.id) {
      case 'graine':
        conditionMet = currentStreakDays >= 1;
        break;
      case 'pousse':
        conditionMet = currentStreakDays >= 3;
        break;
      case 'racine':
        conditionMet = currentStreakDays >= 7;
        break;
      case 'branche':
        conditionMet = currentStreakDays >= 14;
        break;
      case 'baobab':
        conditionMet = currentStreakDays >= 30;
        break;
      case 'gardien':
        conditionMet = currentStreakDays >= 90;
        break;
      case 'sage':
        conditionMet = currentStreakDays >= 180;
        break;
      case 'legende':
        conditionMet = currentStreakDays >= 365;
        break;
      case 'premier_sos':
        conditionMet = sosCompletedCount >= 1;
        break;
      case 'dix_sos':
        conditionMet = sosCompletedCount >= 10;
        break;
      case 'journalier':
        conditionMet = journalEntriesCount >= 7;
        break;
      case 'resilient':
        conditionMet = chaptersCount >= 1;
        break;
      case 'nocturne':
        conditionMet = currentStreakDays >= 10;
        break;
      case 'aube':
        conditionMet = currentStreakDays >= 10;
        break;
      case 'silence':
        conditionMet = currentStreakDays >= 30;
        break;
      case 'transmission':
        conditionMet = hasSharedCard;
        break;
      default:
        conditionMet = false;
    }

    if (conditionMet) {
      if (!existing?.unlockedAt) {
        const unlocked: BadgeItem = {
          ...template,
          unlockedAt: Date.now(),
        };
        newlyUnlocked.push(unlocked);
        return unlocked;
      }
      return {
        ...template,
        unlockedAt: existing.unlockedAt,
      };
    }

    // Si la condition n'est pas remplie, le badge doit rester verrouillé (garantie de vérité des données)
    return {
      ...template,
      unlockedAt: undefined,
    };
  });

  return { updatedBadges, newlyUnlocked };
}
