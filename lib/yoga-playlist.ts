export type PlaylistCategory = "zen" | "om" | "temple" | "pluie" | "nature";

export interface YogaTrack {
  id: string;
  title: string;
  category: PlaylistCategory;
  src: string;
  durationSeconds: number;
  artist: string;
  license: string;
}

/** Durée minimale d'une piste (1 heure). */
export const MIN_TRACK_DURATION_SECONDS = 3600;

export const PLAYLIST_CATEGORIES: {
  id: PlaylistCategory;
  label: string;
  description: string;
}[] = [
  {
    id: "zen",
    label: "Zen",
    description: "Méditation douce et ambient relaxant",
  },
  {
    id: "om",
    label: "Om",
    description: "Chants OM et mantras méditatifs",
  },
  {
    id: "temple",
    label: "Temple",
    description: "Bols tibétains et atmosphères spirituelles",
  },
  {
    id: "pluie",
    label: "Pluie",
    description: "Pluie apaisante et textures aquatiques",
  },
  {
    id: "nature",
    label: "Nature",
    description: "Forêt, oiseaux et sons naturels",
  },
];

/** Uniquement des morceaux ≥ 1 h. */
export const YOGA_TRACKS: YogaTrack[] = [
  {
    id: "zen-ambient-groove",
    title: "Ambient Groove Mix (~1 h)",
    category: "zen",
    src: "/audio/zen/ambient-groove-mix.mp3",
    durationSeconds: 3755,
    artist: "ambientgroove.net",
    license: "CC BY-ND 3.0 (Internet Archive)",
  },
  {
    id: "zen-healing-528hz",
    title: "Méditation 528 Hz — régénération (~2 h)",
    category: "zen",
    src: "/audio/zen/healing-528hz-2h.mp3",
    durationSeconds: 7209,
    artist: "Healing Meditation Music",
    license: "Internet Archive",
  },
  {
    id: "om-chanting-528hz",
    title: "Chant OM @ 528 Hz (~1 h 42)",
    category: "om",
    src: "/audio/om/om-chanting-528hz.mp3",
    durationSeconds: 6150,
    artist: "OM Chanting",
    license: "Internet Archive",
  },
  {
    id: "om-vibrations-1h",
    title: "Vibrations OM — énergie positive (~1 h)",
    category: "om",
    src: "/audio/om/om-vibrations-1h.mp3",
    durationSeconds: 3638,
    artist: "OM Mantras",
    license: "Internet Archive",
  },
  {
    id: "temple-singing-bowls-healing",
    title: "Bols tibétains — nettoyage des chakras (~1 h 10)",
    category: "temple",
    src: "/audio/temple/singing-bowls-healing.mp3",
    durationSeconds: 4271,
    artist: "Tibetan Healing Sounds",
    license: "Internet Archive",
  },
  {
    id: "temple-crystal-bowls-3h",
    title: "Bols cristal — bain sonore (~3 h)",
    category: "temple",
    src: "/audio/temple/crystal-singing-bowl-3h.mp3",
    durationSeconds: 11481,
    artist: "Tibetan Healing Sounds",
    license: "Internet Archive",
  },
  {
    id: "temple-buddhist-monk-2h",
    title: "Chant bouddhiste — mantra de paix (~2 h)",
    category: "temple",
    src: "/audio/temple/buddhist-monk-chant-2h.mp3",
    durationSeconds: 7297,
    artist: "Buddhist Monk Peace Chant",
    license: "Internet Archive",
  },
  {
    id: "pluie-rain-1-hour",
    title: "Pluie douce — 1 heure",
    category: "pluie",
    src: "/audio/pluie/rain-1-hour.mp3",
    durationSeconds: 3600,
    artist: "Rain Sounds",
    license: "Internet Archive",
  },
  {
    id: "pluie-rain-sleep-2h",
    title: "Pluie pour le sommeil (~2 h)",
    category: "pluie",
    src: "/audio/pluie/rain-sleep-2h.mp3",
    durationSeconds: 8128,
    artist: "Rain Sounds",
    license: "Internet Archive",
  },
  {
    id: "nature-birdsong-1-hour",
    title: "Rossignol — 1 heure",
    category: "nature",
    src: "/audio/nature/birdsong-1-hour.mp3",
    durationSeconds: 3607,
    artist: "Nature Sounds",
    license: "Internet Archive",
  },
  {
    id: "nature-pandora-forest",
    title: "Forêt nocturne — bioluminescence (~1 h)",
    category: "nature",
    src: "/audio/nature/pandora-forest-night.mp3",
    durationSeconds: 3601,
    artist: "Avatar Music & Ambience",
    license: "Internet Archive",
  },
];

export function getCategoryLabel(category: PlaylistCategory) {
  return PLAYLIST_CATEGORIES.find((item) => item.id === category)?.label ?? category;
}

export function getCategoryTracks(category: PlaylistCategory) {
  return YOGA_TRACKS.filter((track) => track.category === category);
}

export function getTrackById(id: string) {
  return YOGA_TRACKS.find((track) => track.id === id) ?? null;
}

export function getCategoryTotalDuration(category: PlaylistCategory) {
  return getCategoryTracks(category).reduce(
    (total, track) => total + track.durationSeconds,
    0,
  );
}

export function formatDuration(totalSeconds: number) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  if (hours > 0) return `${hours} h ${minutes} min`;
  return `${minutes} min`;
}
