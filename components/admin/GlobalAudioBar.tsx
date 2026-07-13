"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  Pause,
  Play,
  SkipBack,
  SkipForward,
  Square,
  Volume2,
} from "lucide-react";
import { useAudioPlayer } from "@/contexts/AudioPlayerContext";
import { isIosDevice } from "@/lib/device";
import { getCategoryLabel } from "@/lib/yoga-playlist";

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export function GlobalAudioBar() {
  const {
    isActive,
    status,
    currentTrack,
    category,
    currentTime,
    duration,
    volume,
    togglePlay,
    stop,
    nextTrack,
    previousTrack,
    setVolume,
    seekTo,
  } = useAudioPlayer();

  const progressRef = useRef<HTMLDivElement>(null);
  const [isSeeking, setIsSeeking] = useState(false);
  const [seekPreview, setSeekPreview] = useState<number | null>(null);
  const [isIos, setIsIos] = useState(false);

  useEffect(() => {
    setIsIos(isIosDevice());
  }, []);

  const getTimeFromClientX = useCallback(
    (clientX: number) => {
      const el = progressRef.current;
      if (!el || duration <= 0) return null;
      const rect = el.getBoundingClientRect();
      const ratio = Math.min(Math.max((clientX - rect.left) / rect.width, 0), 1);
      return ratio * duration;
    },
    [duration],
  );

  const handlePointerDown = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (duration <= 0) return;
      event.currentTarget.setPointerCapture(event.pointerId);
      setIsSeeking(true);
      const time = getTimeFromClientX(event.clientX);
      if (time !== null) setSeekPreview(time);
    },
    [duration, getTimeFromClientX],
  );

  const handlePointerMove = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (!isSeeking) return;
      const time = getTimeFromClientX(event.clientX);
      if (time !== null) setSeekPreview(time);
    },
    [isSeeking, getTimeFromClientX],
  );

  const handlePointerUp = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (!isSeeking) return;
      event.currentTarget.releasePointerCapture(event.pointerId);
      const time = getTimeFromClientX(event.clientX);
      if (time !== null) seekTo(time);
      setIsSeeking(false);
      setSeekPreview(null);
    },
    [isSeeking, getTimeFromClientX, seekTo],
  );

  if (!isActive || !currentTrack) return null;

  const displayTime = isSeeking && seekPreview !== null ? seekPreview : currentTime;
  const progress = duration > 0 ? (displayTime / duration) * 100 : 0;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-primary/15 bg-white/95 shadow-canopee-deep backdrop-blur-md">
      <div className="container mx-auto px-4 py-3 sm:px-6 lg:px-8">
        <div
          ref={progressRef}
          role="slider"
          aria-label="Position dans le morceau"
          aria-valuemin={0}
          aria-valuemax={duration}
          aria-valuenow={displayTime}
          aria-valuetext={`${formatTime(displayTime)} sur ${formatTime(duration)}`}
          className="group mb-2 flex h-4 cursor-pointer touch-none items-center"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        >
          <div className="relative h-1 w-full overflow-hidden rounded-full bg-primary/10 group-hover:h-1.5 transition-[height]">
            <div
              className={`h-full rounded-full bg-primary ${isSeeking ? "" : "transition-all duration-300"}`}
              style={{ width: `${progress}%` }}
            />
            <div
              className={`absolute top-1/2 h-3 w-3 -translate-y-1/2 rounded-full bg-primary shadow-sm transition-opacity ${
                isSeeking ? "opacity-100" : "opacity-0 group-hover:opacity-100"
              }`}
              style={{ left: `calc(${progress}% - 6px)` }}
            />
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0 flex-1">
            <p className="truncate font-medium text-text-dark">{currentTrack.title}</p>
            <p className="truncate text-xs text-text-dark/60">
              {category ? getCategoryLabel(category) : ""} · {formatTime(displayTime)} /{" "}
              {formatTime(duration)}
            </p>
          </div>

          <div className="flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={previousTrack}
              className="rounded-full p-2 text-primary transition-colors hover:bg-primary/10"
              aria-label="Piste précédente"
            >
              <SkipBack className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={togglePlay}
              className="rounded-full bg-primary p-3 text-white transition-colors hover:bg-primary-light"
              aria-label={status === "playing" ? "Pause" : "Lecture"}
            >
              {status === "playing" ? (
                <Pause className="h-5 w-5" />
              ) : (
                <Play className="h-5 w-5" />
              )}
            </button>
            <button
              type="button"
              onClick={nextTrack}
              className="rounded-full p-2 text-primary transition-colors hover:bg-primary/10"
              aria-label="Piste suivante"
            >
              <SkipForward className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={stop}
              className="rounded-full p-2 text-text-dark/60 transition-colors hover:bg-primary/10 hover:text-primary"
              aria-label="Arrêter"
            >
              <Square className="h-4 w-4" />
            </button>
          </div>

          {!isIos && (
            <div className="flex items-center gap-2 sm:w-40">
              <Volume2 className="h-4 w-4 shrink-0 text-primary" />
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={volume}
                onChange={(event) => setVolume(Number(event.target.value))}
                className="w-full accent-primary"
                aria-label="Volume"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
