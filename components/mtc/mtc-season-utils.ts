export interface MTCSeasonInfo {
  season: string;
  element: string;
  dates: string;
  description: string;
  organ: string;
  viscera: string;
  color: string;
  emotion: string;
  orientation: string;
  taste: string;
  regenerationHours: string;
  climate: string;
}

export type ElementType = "Bois" | "Feu" | "Terre" | "Métal" | "Eau";

export function getSeasonTitle(season: string): string {
  const titles: Record<string, string> = {
    Printemps: "LE PRINTEMPS",
    Été: "L'ÉTÉ",
    Intersaison: "L'INTERSAISON",
    Automne: "L'AUTOMNE",
    Hiver: "L'HIVER",
  };
  return titles[season] ?? season.toUpperCase();
}

export function getSeasonPeriod(season: string): string {
  const periods: Record<string, string> = {
    Printemps: "d'épanouissement",
    Été: "de rayonnement",
    Intersaison: "de mutation",
    Automne: "de changement",
    Hiver: "de repli",
  };
  return periods[season] ?? "";
}

export function getElementIntro(season: string): string {
  const intros: Record<string, string> = {
    Printemps: "Au printemps, l'élément",
    Été: "Pendant l'été, l'élément",
    Intersaison: "Durant l'intersaison, l'élément",
    Automne: "Pendant l'automne, l'élément",
    Hiver: "Pendant l'hiver, l'élément",
  };
  return intros[season] ?? "L'élément";
}

export function getCorrespondenceLabel(season: string): string {
  if (season === "Intersaison") return "l'intersaison";
  return `le ${season.toLowerCase()}`;
}

export const correspondenceFields: {
  key: keyof Pick<
    MTCSeasonInfo,
    | "element"
    | "season"
    | "organ"
    | "viscera"
    | "color"
    | "regenerationHours"
    | "taste"
    | "emotion"
    | "orientation"
    | "climate"
  >;
  label: string;
}[] = [
  { key: "element", label: "Élément" },
  { key: "season", label: "Saison" },
  { key: "organ", label: "Organe" },
  { key: "viscera", label: "Viscère" },
  { key: "color", label: "Couleur" },
  { key: "regenerationHours", label: "Heures de régénération" },
  { key: "taste", label: "Goût" },
  { key: "emotion", label: "Émotion" },
  { key: "orientation", label: "Orientation" },
  { key: "climate", label: "Énergie climatique" },
];
