# Crédits audio — Canopée

Musiques et sons utilisés dans les outils admin (lecteur zen). Téléchargés pour hébergement local.

## Zen

| Fichier | Titre | Artiste | Source | Licence |
|---------|-------|---------|--------|---------|
| `zen/ambient-groove-mix.mp3` | Ambient Groove Mix | ambientgroove.net | [Internet Archive](https://archive.org/details/ambientgroove.net_mix1) | CC BY-ND 3.0 |
| `zen/healing-528hz-2h.mp3` | Méditation 528 Hz — régénération (~2 h) | Healing Meditation Music | [Internet Archive](https://archive.org/details/m_20210503) | Internet Archive |
| `zen/ambient-meditation.mp3` | Ambient Meditation | MokkaMusic | [Internet Archive / Jamendo](https://archive.org/details/jamendo-498246) | Jamendo CC |
| `zen/rising-star.mp3` | Rising Star | Yoga & Meditacion | [Internet Archive](https://archive.org/details/meditation-music-2019) | Compilation 2019 |
| `zen/softness-red.mp3` | Softness Red | Funkana | [Internet Archive](https://archive.org/details/meditation-music-2019) | Compilation 2019 |
| `zen/rising-mountains.mp3` | Rising Mountains | Lunamica | [Internet Archive](https://archive.org/details/meditation-music-2019) | Compilation 2019 |
| `zen/cosmica.mp3` | Cosmica | 8s8 | [Internet Archive](https://archive.org/details/meditation-music-2019) | Compilation 2019 |

## Temple

| Fichier | Titre | Artiste | Source | Licence |
|---------|-------|---------|--------|---------|
| `temple/singing-bowls-healing.mp3` | Bols tibétains — nettoyage des chakras (~1 h 10) | Tibetan Healing Sounds | [Internet Archive](https://archive.org/details/m_20210503) | Internet Archive |
| `temple/crystal-singing-bowl-3h.mp3` | Bols cristal — bain sonore (~3 h) | Tibetan Healing Sounds | [Internet Archive](https://archive.org/details/m_20210503) | Internet Archive |
| `temple/gentle-flowing-bowls.mp3` | Gentle Flowing Meditative Ambient | Alex Saym | [Internet Archive / Jamendo](https://archive.org/details/jamendo-615329) | Jamendo CC |
| `temple/sol-naciente.mp3` | Sol Naciente | Ressonnimo | [Internet Archive](https://archive.org/details/meditation-music-2019) | Compilation 2019 |
| `temple/stillness.mp3` | Stillness | Mouni Mantra | [Internet Archive](https://archive.org/details/meditation-music-2019) | Compilation 2019 |
| `temple/new-planet.mp3` | New Planet | Gurulike | [Internet Archive](https://archive.org/details/meditation-music-2019) | Compilation 2019 |

## Pluie

| Fichier | Titre | Artiste | Source | Licence |
|---------|-------|---------|--------|---------|
| `pluie/rain-1-hour.mp3` | Pluie douce — 1 heure | Rain Sounds | [Internet Archive](https://archive.org/details/y-2mate.com-rain-sounds-1-hours-sound-of-rain-meditation-2) | Internet Archive |
| `pluie/rain-sleep-2h.mp3` | Pluie pour le sommeil (~2 h) | Rain Sounds | [Internet Archive](https://archive.org/details/rain-sounds-for-sleep-1) | Internet Archive |
| `pluie/rain-long-loop.mp3` | Rain long loop | Mixkit | [Mixkit](https://mixkit.co/free-sound-effects/rain/) | Mixkit License |
| `pluie/rain-in-the-city.mp3` | Rain In The City | Biocuo | [Internet Archive](https://archive.org/details/meditation-music-2019) | Compilation 2019 |
| `pluie/soft-ambient-rain.mp3` | Soft ambient | Mixkit | [Mixkit](https://mixkit.co/) | Mixkit License |
| `pluie/condensacion.mp3` | Condensacion | Surbica | [Internet Archive](https://archive.org/details/meditation-music-2019) | Compilation 2019 |
| `pluie/light-rain.mp3` | Pluie légère | Mixkit | [Mixkit](https://mixkit.co/) | Mixkit License |

## Nature

| Fichier | Titre | Artiste | Source | Licence |
|---------|-------|---------|--------|---------|
| `nature/birdsong-1-hour.mp3` | Rossignol — 1 heure | Nature Sounds | [Internet Archive](https://archive.org/details/one-hour-relaxing-birdsong-the-nightingale.) | Internet Archive |
| `nature/pandora-forest-night.mp3` | Forêt nocturne — bioluminescence (~1 h) | Avatar Music & Ambience | [Internet Archive](https://archive.org/details/avatar-music-ambience-pandora-at-night-bioluminescence-forest-sounds-and-occasional-rain) | Internet Archive |
| `nature/european-forest.mp3` | European forest | Mixkit | [Mixkit](https://mixkit.co/) | Mixkit License |
| `nature/summer-night-crickets.mp3` | Summer night crickets | Mixkit | [Mixkit](https://mixkit.co/) | Mixkit License |
| `nature/natural-theme.mp3` | Natural Theme | Mind Forest | [Internet Archive](https://archive.org/details/meditation-music-2019) | Compilation 2019 |
| `nature/outside-nature.mp3` | Outside | Material Nature | [Internet Archive](https://archive.org/details/meditation-music-2019) | Compilation 2019 |
| `nature/second-desert.mp3` | The Second Desert | Planez T | [Internet Archive](https://archive.org/details/meditation-music-2019) | Compilation 2019 |
| `nature/ocean-waves.mp3` | Vagues océan | Mixkit | [Mixkit](https://mixkit.co/) | Mixkit License |
| `nature/stream-water.mp3` | Ruisseau | Mixkit | [Mixkit](https://mixkit.co/) | Mixkit License |

## Minuteur

Le signal de fin est généré en direct (Web Audio API) : gong doux et grave, sans fichier MP3.

Au choix via le switch du minuteur : **Sonner** (gong répété) ou **Vibrer** (motif type réveil en boucle sur Android). Les deux ne se déclenchent pas en même temps. Un bouton **Stop** coupe la sonnerie ou la vibration. iOS Safari ne prend pas en charge `navigator.vibrate` ; un message d&apos;aide s&apos;affiche si le mode Vibrer est sélectionné sur un appareil non compatible.

Téléchargement automatisé : `scripts/download-yoga-audio.sh`
