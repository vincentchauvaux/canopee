"use client";

import { useMemo, useState } from "react";
import { ListMusic, Play, Repeat } from "lucide-react";
import { useAudioPlayer } from "@/contexts/AudioPlayerContext";
import {
  formatDuration,
  getCategoryTotalDuration,
  getCategoryTracks,
  PLAYLIST_CATEGORIES,
  type PlaylistCategory,
} from "@/lib/yoga-playlist";

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export default function MusicPlayer() {
  const {
    playCategory,
    playTrack,
    currentTrack,
    category,
    status,
    loopPlaylist,
    setLoopPlaylist,
    currentTime,
    duration,
  } = useAudioPlayer();

  const [selectedCategory, setSelectedCategory] = useState<PlaylistCategory>("zen");

  const tracks = useMemo(
    () => getCategoryTracks(selectedCategory),
    [selectedCategory],
  );

  const totalDuration = useMemo(
    () => getCategoryTotalDuration(selectedCategory),
    [selectedCategory],
  );

  return (
    <div className="rounded-2xl border border-primary/10 bg-white p-6 shadow-canopee-soft sm:p-8">
      <div className="mb-6">
        <h2 className="font-serif text-2xl font-bold text-text-dark">Musique zen</h2>
        <p className="text-sm text-text-dark/60">
          Playlists pour accompagner un cours (~1 h). La lecture continue sur tout le site.
        </p>
      </div>

      <div className="mb-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {PLAYLIST_CATEGORIES.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setSelectedCategory(item.id)}
            className={`rounded-xl border px-3 py-3 text-left transition-colors ${
              selectedCategory === item.id
                ? "border-primary bg-primary/10"
                : "border-primary/10 bg-accent/20 hover:bg-accent/40"
            }`}
          >
            <p className="font-medium text-text-dark">{item.label}</p>
            <p className="text-xs text-text-dark/60">{item.description}</p>
          </button>
        ))}
      </div>

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-accent/30 px-4 py-3">
        <div>
          <p className="text-sm font-medium text-text-dark">
            Durée totale : {formatDuration(totalDuration)}
          </p>
          <p className="text-xs text-text-dark/60">{tracks.length} pistes dans cette catégorie</p>
        </div>
        <label className="inline-flex items-center gap-2 text-sm text-text-dark/80">
          <input
            type="checkbox"
            checked={loopPlaylist}
            onChange={(event) => setLoopPlaylist(event.target.checked)}
            className="accent-primary"
          />
          <Repeat className="h-4 w-4 text-primary" />
          Boucle playlist
        </label>
      </div>

      <button
        type="button"
        onClick={() => playCategory(selectedCategory)}
        className="mb-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-primary-light sm:w-auto"
      >
        <ListMusic className="h-4 w-4" />
        Lancer la playlist {PLAYLIST_CATEGORIES.find((c) => c.id === selectedCategory)?.label}
      </button>

      {currentTrack && category === selectedCategory && (
        <div className="mb-4 rounded-xl border border-primary/15 bg-primary/5 px-4 py-3 text-sm text-text-dark">
          <p className="font-medium">En lecture : {currentTrack.title}</p>
          <p className="text-text-dark/60">
            {status === "playing" ? "Lecture" : "Pause"} · {formatTime(currentTime)} /{" "}
            {formatTime(duration)}
          </p>
        </div>
      )}

      <ul className="space-y-2">
        {tracks.map((track, index) => {
          const isActive = currentTrack?.id === track.id;
          return (
            <li
              key={track.id}
              className={`flex items-center justify-between gap-3 rounded-xl border px-4 py-3 ${
                isActive
                  ? "border-primary/30 bg-primary/5"
                  : "border-primary/8 bg-white"
              }`}
            >
              <div className="min-w-0">
                <p className="truncate font-medium text-text-dark">
                  {index + 1}. {track.title}
                </p>
                <p className="truncate text-xs text-text-dark/60">
                  {track.artist} · {formatDuration(track.durationSeconds)}
                </p>
              </div>
              <button
                type="button"
                onClick={() => playTrack(track.id)}
                className="shrink-0 rounded-full border border-primary/20 p-2 text-primary transition-colors hover:bg-primary/10"
                aria-label={`Lire ${track.title}`}
              >
                <Play className="h-4 w-4" />
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
