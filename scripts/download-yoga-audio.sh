#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
AUDIO="$ROOT/public/audio"

mkdir -p "$AUDIO"/{zen,temple,pluie,nature}

download() {
  local url="$1"
  local dest="$2"
  echo "→ $dest"
  curl -fL --retry 3 --retry-delay 2 -o "$dest" "$url"
}

# Zen — ambient long-form + méditation
download "https://archive.org/download/ambientgroove.net_mix1/Ambientgroovedotnet_mix.mp3" \
  "$AUDIO/zen/ambient-groove-mix.mp3"
download "https://archive.org/download/jamendo-498246/01-1976994-MokkaMusic-Ambient%20Meditation.mp3" \
  "$AUDIO/zen/ambient-meditation.mp3"
download "https://archive.org/download/meditation-music-2019/Meditation%20Music%20(2019)/22.%20%20Yoga%20%26%20Meditacion%20%20-%20%20Rising%20Star%20(Yoga%20%26%20Zen%20Meditation%20Version).mp3" \
  "$AUDIO/zen/rising-star.mp3"
download "https://archive.org/download/meditation-music-2019/Meditation%20Music%20(2019)/23.%20%20Funkana%20%20-%20%20Softness%20Red%20(Zen%20Ambient%20Meditation).mp3" \
  "$AUDIO/zen/softness-red.mp3"
download "https://archive.org/download/FourWorldMeditation/4worlds4-29-08.mp3" \
  "$AUDIO/zen/four-world-meditation.mp3"

# Temple — bols / ambient spirituel
download "https://archive.org/download/jamendo-615329/01-2279515-Alex%20Saym-Gentle%20Flowing%20Meditative%20Ambient.mp3" \
  "$AUDIO/temple/gentle-flowing-bowls.mp3"
download "https://archive.org/download/meditation-music-2019/Meditation%20Music%20(2019)/04.%20%20Ressonnimo%20%20-%20%20Sol%20Naciente%20(Yoga%20%26%20Meditation%20Version).mp3" \
  "$AUDIO/temple/sol-naciente.mp3"
download "https://archive.org/download/meditation-music-2019/Meditation%20Music%20(2019)/16.%20%20Mouni%20Mantra%20%20-%20%20Stillness%20(Original%20Mix).mp3" \
  "$AUDIO/temple/stillness.mp3"

# Temple — piste longue (~1 h 10) bols tibétains
download "https://archive.org/download/m_20210503/432hz_nature_s_healing_music_aura_cleanse_all_7_chakras_cleanse_positive_energy_boost_-3328895234798558088.mp3" \
  "$AUDIO/temple/singing-bowls-healing.mp3"
download "https://archive.org/download/m_20210503/432hz_3_hour_crystal_singing_bowl_healing_sound_bath_4k_no_talking_singing_bowls_sound_bath_-6866116459838027795.mp3" \
  "$AUDIO/temple/crystal-singing-bowl-3h.mp3"

# Pluie — pluie + ambient
download "https://archive.org/download/y-2mate.com-rain-sounds-1-hours-sound-of-rain-meditation-2/y2mate.com%20-%20Rain%20Sounds%201%20Hours%20%20%20%20Sound%20of%20Rain%20Meditation%20_2.mp3" \
  "$AUDIO/pluie/rain-1-hour.mp3"
download "https://archive.org/download/rain-sounds-for-sleep-1/RAIN%20SOUNDS%20FOR%20SLEEP%201.mp3" \
  "$AUDIO/pluie/rain-sleep-2h.mp3"
download "https://assets.mixkit.co/active_storage/sfx/2394/2394-preview.mp3" \
  "$AUDIO/pluie/rain-long-loop.mp3"
download "https://archive.org/download/meditation-music-2019/Meditation%20Music%20(2019)/24.%20%20Biocuo%20%20-%20%20Rain%20In%20The%20City%20(Original%20Mix).mp3" \
  "$AUDIO/pluie/rain-in-the-city.mp3"
download "https://assets.mixkit.co/active_storage/sfx/2507/2507-preview.mp3" \
  "$AUDIO/pluie/soft-ambient-rain.mp3"

# Nature — forêt, oiseaux
download "https://assets.mixkit.co/active_storage/sfx/1213/1213-preview.mp3" \
  "$AUDIO/nature/european-forest.mp3"
download "https://assets.mixkit.co/active_storage/sfx/1789/1789-preview.mp3" \
  "$AUDIO/nature/summer-night-crickets.mp3"
download "https://archive.org/download/meditation-music-2019/Meditation%20Music%20(2019)/13.%20%20Mind%20Forest%20%20-%20%20Natural%20Theme%20(Original%20Mix).mp3" \
  "$AUDIO/nature/natural-theme.mp3"
download "https://archive.org/download/meditation-music-2019/Meditation%20Music%20(2019)/15.%20%20Material%20Nature%20%20-%20%20Out%20Side%20(Original%20Mix).mp3" \
  "$AUDIO/nature/outside-nature.mp3"

# Nature — rossignol 1 heure
download "https://archive.org/download/one-hour-relaxing-birdsong-the-nightingale./One%20Hour%20Relaxing%20Birdsong_%20the%20Nightingale..mp3" \
  "$AUDIO/nature/birdsong-1-hour.mp3"
download "https://archive.org/download/avatar-music-ambience-pandora-at-night-bioluminescence-forest-sounds-and-occasional-rain/Avatar%20Music%20%26%20Ambience%20-%20Pandora%20at%20Night%20%28Bioluminescence%2C%20Forest%20Sounds%20and%20Occasional%20Rain%29.mp3" \
  "$AUDIO/nature/pandora-forest-night.mp3"

echo "✅ Téléchargement terminé."
