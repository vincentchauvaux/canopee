export type PlaylistCategory = "zen" | "temple" | "pluie" | "nature";

export interface YogaTrack {
  id: string;
  title: string;
  category: PlaylistCategory;
  src: string;
  durationSeconds: number;
  artist: string;
  license: string;
}

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

export const YOGA_TRACKS: YogaTrack[] = [
  {
    id: "zen-ambient-groove",
    title: "Ambient Groove Mix",
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
    id: "zen-ambient-meditation",
    title: "Ambient Meditation",
    category: "zen",
    src: "/audio/zen/ambient-meditation.mp3",
    durationSeconds: 397,
    artist: "MokkaMusic",
    license: "Jamendo / CC (Internet Archive)",
  },
  {
    id: "zen-rising-star",
    title: "Rising Star",
    category: "zen",
    src: "/audio/zen/rising-star.mp3",
    durationSeconds: 409,
    artist: "Yoga & Meditacion",
    license: "Compilation Meditation Music 2019 (Internet Archive)",
  },
  {
    id: "zen-softness-red",
    title: "Softness Red",
    category: "zen",
    src: "/audio/zen/softness-red.mp3",
    durationSeconds: 178,
    artist: "Funkana",
    license: "Compilation Meditation Music 2019 (Internet Archive)",
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
    id: "temple-gentle-flowing",
    title: "Gentle Flowing Meditative Ambient",
    category: "temple",
    src: "/audio/temple/gentle-flowing-bowls.mp3",
    durationSeconds: 239,
    artist: "Alex Saym",
    license: "Jamendo / CC (Internet Archive)",
  },
  {
    id: "temple-sol-naciente",
    title: "Sol Naciente",
    category: "temple",
    src: "/audio/temple/sol-naciente.mp3",
    durationSeconds: 359,
    artist: "Ressonnimo",
    license: "Compilation Meditation Music 2019 (Internet Archive)",
  },
  {
    id: "temple-stillness",
    title: "Stillness",
    category: "temple",
    src: "/audio/temple/stillness.mp3",
    durationSeconds: 93,
    artist: "Mouni Mantra",
    license: "Compilation Meditation Music 2019 (Internet Archive)",
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
    id: "pluie-rain-loop",
    title: "Pluie — boucle courte",
    category: "pluie",
    src: "/audio/pluie/rain-long-loop.mp3",
    durationSeconds: 120,
    artist: "Mixkit",
    license: "Mixkit License",
  },
  {
    id: "pluie-rain-city",
    title: "Rain In The City",
    category: "pluie",
    src: "/audio/pluie/rain-in-the-city.mp3",
    durationSeconds: 224,
    artist: "Biocuo",
    license: "Compilation Meditation Music 2019 (Internet Archive)",
  },
  {
    id: "pluie-soft-ambient",
    title: "Ambient doux",
    category: "pluie",
    src: "/audio/pluie/soft-ambient-rain.mp3",
    durationSeconds: 90,
    artist: "Mixkit",
    license: "Mixkit License",
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
  {
    id: "nature-forest",
    title: "Forêt européenne",
    category: "nature",
    src: "/audio/nature/european-forest.mp3",
    durationSeconds: 180,
    artist: "Mixkit",
    license: "Mixkit License",
  },
  {
    id: "nature-crickets",
    title: "Nuit d'été — grillons",
    category: "nature",
    src: "/audio/nature/summer-night-crickets.mp3",
    durationSeconds: 90,
    artist: "Mixkit",
    license: "Mixkit License",
  },
  {
    id: "nature-natural-theme",
    title: "Natural Theme",
    category: "nature",
    src: "/audio/nature/natural-theme.mp3",
    durationSeconds: 178,
    artist: "Mind Forest",
    license: "Compilation Meditation Music 2019 (Internet Archive)",
  },
  {
    id: "nature-outside",
    title: "Outside",
    category: "nature",
    src: "/audio/nature/outside-nature.mp3",
    durationSeconds: 108,
    artist: "Material Nature",
    license: "Compilation Meditation Music 2019 (Internet Archive)",
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
