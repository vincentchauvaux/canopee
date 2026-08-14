#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
AUDIO="$ROOT/public/audio"

mkdir -p "$AUDIO"/{zen,om,temple,pluie,nature}

download() {
  local url="$1"
  local dest="$2"
  echo "→ $dest"
  curl -fL --retry 3 --retry-delay 2 -o "$dest" "$url"
}

# Zen — ambient long-form + méditation (≥ 1 h)
download "https://archive.org/download/ambientgroove.net_mix1/Ambientgroovedotnet_mix.mp3" \
  "$AUDIO/zen/ambient-groove-mix.mp3"
download "https://archive.org/download/m_20210503/528hz_whole_body_regeneration_full_body_healing_emotional_physical_healing_epxe_XIByoK-gucZgB0-.mp3" \
  "$AUDIO/zen/healing-528hz-2h.mp3"

# Om — chants OM / mantras (≥ 1 h)
download "https://archive.org/download/yt-5s.com-om-chanting-528-hz-320-kbps/yt5s.com%20-%20OM%20Chanting%20%40%20528Hz%20(320%20kbps).mp3" \
  "$AUDIO/om/om-chanting-528hz.mp3"
download "https://archive.org/download/GETPOSITIVEENERGYAURASUPERPOWERFULVIBRATIONSOMZOOM/GET_POSITIVE_ENERGY_AURA___SUPER_POWERFUL_VIBRATIONS_OM_ZOOM_.mp3" \
  "$AUDIO/om/om-vibrations-1h.mp3"

# Temple — bols / chants spirituels (≥ 1 h)
download "https://archive.org/download/m_20210503/432hz_nature_s_healing_music_aura_cleanse_all_7_chakras_cleanse_positive_energy_boost_-3328895234798558088.mp3" \
  "$AUDIO/temple/singing-bowls-healing.mp3"
download "https://archive.org/download/m_20210503/432hz_3_hour_crystal_singing_bowl_healing_sound_bath_4k_no_talking_singing_bowls_sound_bath_-6866116459838027795.mp3" \
  "$AUDIO/temple/crystal-singing-bowl-3h.mp3"
download "https://archive.org/download/39ZenMeditationMusic2HOURSBuddhistMonkPeaceChantHealingMantraChantingPositiveEnergy/39%20Zen%20Meditation%20Music%202%20HOURS%20Buddhist%20Monk%20Peace%20Chant%20%20Healing%20Mantra%20Chanting%20%20Positive%20Energy.mp3" \
  "$AUDIO/temple/buddhist-monk-chant-2h.mp3"

# Pluie (≥ 1 h)
download "https://archive.org/download/y-2mate.com-rain-sounds-1-hours-sound-of-rain-meditation-2/y2mate.com%20-%20Rain%20Sounds%201%20Hours%20%20%20%20Sound%20of%20Rain%20Meditation%20_2.mp3" \
  "$AUDIO/pluie/rain-1-hour.mp3"
download "https://archive.org/download/rain-sounds-for-sleep-1/RAIN%20SOUNDS%20FOR%20SLEEP%201.mp3" \
  "$AUDIO/pluie/rain-sleep-2h.mp3"

# Nature (≥ 1 h)
download "https://archive.org/download/one-hour-relaxing-birdsong-the-nightingale./One%20Hour%20Relaxing%20Birdsong_%20the%20Nightingale..mp3" \
  "$AUDIO/nature/birdsong-1-hour.mp3"
download "https://archive.org/download/avatar-music-ambience-pandora-at-night-bioluminescence-forest-sounds-and-occasional-rain/Avatar%20Music%20%26%20Ambience%20-%20Pandora%20at%20Night%20%28Bioluminescence%2C%20Forest%20Sounds%20and%20Occasional%20Rain%29.mp3" \
  "$AUDIO/nature/pandora-forest-night.mp3"

echo "✅ Téléchargement terminé (pistes ≥ 1 h uniquement)."
