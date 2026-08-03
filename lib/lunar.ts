/** Cycle lunaire synodique moyen (jours) */
export const LUNAR_CYCLE_DAYS = 29.530588;

/** Nouvelle lune de référence (UTC) pour le calcul approximatif */
export const REFERENCE_NEW_MOON_UTC = Date.parse("2024-01-11T00:00:00Z");

export type LunarPhaseName =
  | "Nouvelle Lune"
  | "Premier Croissant"
  | "Premier Quartier"
  | "Gibbeuse Croissante"
  | "Pleine Lune"
  | "Gibbeuse Décroissante"
  | "Dernier Quartier"
  | "Dernier Croissant";

export interface ComputedLunarData {
  dayOfCycle: number;
  /** Illumination 0–1 (même formule que le graphique MoonPhase) */
  illumination: number;
  /** Illumination 0–100 pour l’affichage texte */
  illuminationPercent: number;
  phase: LunarPhaseName;
  isWaxing: boolean;
}

export function getDayOfLunarCycle(now: Date = new Date()): number {
  const lunarCycleMs = LUNAR_CYCLE_DAYS * 24 * 60 * 60 * 1000;
  const daysSinceNewMoon = (now.getTime() - REFERENCE_NEW_MOON_UTC) % lunarCycleMs;
  return daysSinceNewMoon / (24 * 60 * 60 * 1000);
}

export function getPhaseName(dayOfCycle: number): LunarPhaseName {
  if (dayOfCycle < 1.84) return "Nouvelle Lune";
  if (dayOfCycle < 5.53) return "Premier Croissant";
  if (dayOfCycle < 9.22) return "Premier Quartier";
  if (dayOfCycle < 12.91) return "Gibbeuse Croissante";
  if (dayOfCycle < 16.61) return "Pleine Lune";
  if (dayOfCycle < 20.3) return "Gibbeuse Décroissante";
  if (dayOfCycle < 23.99) return "Dernier Quartier";
  return "Dernier Croissant";
}

/**
 * Illumination continue 0–1 (cosinus de l’angle de phase).
 * Identique au rendu graphique de MoonPhase.
 */
export function getIlluminationFraction(dayOfCycle: number): number {
  const phaseAngle = (2 * Math.PI * dayOfCycle) / LUNAR_CYCLE_DAYS;
  const illumination = 0.5 - 0.5 * Math.cos(phaseAngle);
  return Math.max(0, Math.min(1, illumination));
}

export function computeLunarData(now: Date = new Date()): ComputedLunarData {
  const dayOfCycle = getDayOfLunarCycle(now);
  const illumination = getIlluminationFraction(dayOfCycle);
  return {
    dayOfCycle,
    illumination,
    illuminationPercent: Math.round(illumination * 100),
    phase: getPhaseName(dayOfCycle),
    isWaxing: dayOfCycle < LUNAR_CYCLE_DAYS / 2,
  };
}

/** Capitalise la phase renvoyée par une source externe (ex. lunopia). */
export function formatPhaseLabel(raw: string): string {
  const trimmed = raw.trim().replace(/\s+/g, " ");
  if (!trimmed) return trimmed;
  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
}
