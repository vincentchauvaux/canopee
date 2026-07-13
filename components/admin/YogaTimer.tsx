"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Minus, Pause, Play, Plus, RotateCcw } from "lucide-react";
import {
  canUseVibration,
  playTimerEndAlert,
  TIMER_ALERT_MODE_KEY,
  type TimerAlertMode,
} from "@/lib/timer-sound";

const PRESETS = [
  { label: "1 min", seconds: 60 },
  { label: "2 min", seconds: 120 },
  { label: "3 min", seconds: 180 },
  { label: "4 min", seconds: 240 },
] as const;

const STEP_SECONDS = 60;
const MIN_SECONDS = 60;
const MAX_SECONDS = 60 * 60;

const SIZE = 240;
const STROKE = 10;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

type TimerStatus = "idle" | "running" | "paused" | "finished";

function formatTime(totalSeconds: number) {
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export default function YogaTimer() {
  const [duration, setDuration] = useState(60);
  const [remaining, setRemaining] = useState(60);
  const [status, setStatus] = useState<TimerStatus>("idle");
  const [alertMode, setAlertMode] = useState<TimerAlertMode>("sound");
  const endAtRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);
  const progress = duration > 0 ? remaining / duration : 0;
  const strokeOffset = CIRCUMFERENCE * (1 - progress);
  const isVibrateMode = alertMode === "vibrate";

  const clearTimer = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    endAtRef.current = null;
  }, []);

  const finishTimer = useCallback(() => {
    clearTimer();
    setRemaining(0);
    setStatus("finished");
    playTimerEndAlert(alertMode);
  }, [alertMode, clearTimer]);

  const toggleAlertMode = useCallback(() => {
    setAlertMode((prev) => {
      const next: TimerAlertMode = prev === "sound" ? "vibrate" : "sound";
      localStorage.setItem(TIMER_ALERT_MODE_KEY, next);
      return next;
    });
  }, []);

  const tick = useCallback(() => {
    if (endAtRef.current === null) return;
    const secondsLeft = Math.max(0, Math.ceil((endAtRef.current - Date.now()) / 1000));
    setRemaining(secondsLeft);
    if (secondsLeft <= 0) {
      finishTimer();
      return;
    }
    rafRef.current = requestAnimationFrame(tick);
  }, [finishTimer]);

  const startTimer = useCallback(() => {
    if (remaining <= 0) {
      setRemaining(duration);
    }
    endAtRef.current = Date.now() + (remaining > 0 ? remaining : duration) * 1000;
    setStatus("running");
    rafRef.current = requestAnimationFrame(tick);
  }, [duration, remaining, tick]);

  const pauseTimer = useCallback(() => {
    if (endAtRef.current === null) return;
    const secondsLeft = Math.max(0, Math.ceil((endAtRef.current - Date.now()) / 1000));
    setRemaining(secondsLeft);
    clearTimer();
    setStatus("paused");
  }, [clearTimer]);

  const resetTimer = useCallback(() => {
    clearTimer();
    setRemaining(duration);
    setStatus("idle");
  }, [clearTimer, duration]);

  const selectPreset = useCallback(
    (seconds: number) => {
      clearTimer();
      setDuration(seconds);
      setRemaining(seconds);
      setStatus("idle");
    },
    [clearTimer],
  );

  const canAdjustDuration = status === "idle" || status === "finished";

  const adjustDuration = useCallback(
    (delta: number) => {
      if (!canAdjustDuration) return;

      clearTimer();
      const base = status === "finished" ? duration : remaining;
      const next = Math.min(Math.max(base + delta, MIN_SECONDS), MAX_SECONDS);
      setDuration(next);
      setRemaining(next);
      setStatus("idle");
    },
    [canAdjustDuration, clearTimer, duration, remaining, status],
  );

  useEffect(() => () => clearTimer(), [clearTimer]);

  useEffect(() => {
    const stored = localStorage.getItem(TIMER_ALERT_MODE_KEY);
    if (stored === "sound" || stored === "vibrate") {
      setAlertMode(stored);
    }
  }, []);

  return (
    <div className="rounded-2xl border border-primary/10 bg-white p-6 shadow-canopee-soft sm:p-8">
      <div className="mb-6">
        <h2 className="font-serif text-2xl font-bold text-text-dark">Minuteur</h2>
        <p className="text-sm text-text-dark/60">
          Choisissez une durée, ajustez avec ±1 min, puis lancez le cercle.
        </p>
      </div>

      <div className="mb-6 flex flex-wrap justify-center gap-2">
        {PRESETS.map((preset) => (
          <button
            key={preset.seconds}
            type="button"
            onClick={() => selectPreset(preset.seconds)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              duration === preset.seconds
                ? "bg-primary text-white"
                : "bg-accent/60 text-text-dark hover:bg-accent"
            }`}
          >
            {preset.label}
          </button>
        ))}
      </div>

      <div className="mb-6 flex flex-col items-center gap-1">
        <div className="flex items-center gap-3">
          <button
            type="button"
            role="switch"
            aria-checked={isVibrateMode}
            aria-label={isVibrateMode ? "Vibrer à la fin" : "Sonner à la fin"}
            onClick={toggleAlertMode}
            className={`relative h-7 w-12 shrink-0 rounded-full transition-colors duration-300 ${
              isVibrateMode ? "bg-primary" : "bg-primary/20"
            }`}
          >
            <span
              className={`absolute top-0.5 left-0.5 h-6 w-6 rounded-full bg-white shadow-sm transition-transform duration-300 ${
                isVibrateMode ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
          <span className="text-sm font-medium text-text-dark">
            {isVibrateMode ? "Vibrer" : "Sonner"}
          </span>
        </div>
        {isVibrateMode && !canUseVibration() && (
          <p className="text-center text-xs text-text-dark/50">
            Vibration non disponible sur cet appareil (ex. iPhone)
          </p>
        )}
      </div>

      <div className="relative mx-auto mb-8 flex items-center justify-center" style={{ width: SIZE, height: SIZE }}>
        <svg width={SIZE} height={SIZE} className="-rotate-90">
          <circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            fill="none"
            stroke="currentColor"
            strokeWidth={STROKE}
            className="text-primary/10"
          />
          <circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            fill="none"
            stroke="currentColor"
            strokeWidth={STROKE}
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={strokeOffset}
            className="text-primary transition-[stroke-dashoffset] duration-300"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-between px-6">
          <button
            type="button"
            onClick={() => adjustDuration(-STEP_SECONDS)}
            disabled={!canAdjustDuration || remaining <= MIN_SECONDS}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-primary/20 text-primary transition-colors hover:bg-primary/5 disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Retirer 1 minute"
          >
            <Minus className="h-4 w-4" />
          </button>
          <div className="flex flex-col items-center">
            <span className="font-serif text-5xl font-bold tabular-nums text-text-dark">
              {formatTime(remaining)}
            </span>
            <span className="mt-1 text-xs uppercase tracking-wider text-text-dark/50">
              {status === "finished" ? "Terminé" : status === "running" ? "En cours" : status === "paused" ? "Pause" : "Prêt"}
            </span>
          </div>
          <button
            type="button"
            onClick={() => adjustDuration(STEP_SECONDS)}
            disabled={!canAdjustDuration || remaining >= MAX_SECONDS}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-primary/20 text-primary transition-colors hover:bg-primary/5 disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Ajouter 1 minute"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="flex justify-center gap-3">
        {status === "running" ? (
          <button
            type="button"
            onClick={pauseTimer}
            className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-light"
          >
            <Pause className="h-4 w-4" />
            Pause
          </button>
        ) : (
          <button
            type="button"
            onClick={startTimer}
            className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-light"
          >
            <Play className="h-4 w-4" />
            {status === "finished" ? "Relancer" : "Démarrer"}
          </button>
        )}
        <button
          type="button"
          onClick={resetTimer}
          className="inline-flex items-center gap-2 rounded-full border border-primary/20 px-5 py-2.5 text-sm font-medium text-primary transition-colors hover:bg-primary/5"
        >
          <RotateCcw className="h-4 w-4" />
          Reset
        </button>
      </div>
    </div>
  );
}
