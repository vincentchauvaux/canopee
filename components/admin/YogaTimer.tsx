"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Minus, Pause, Play, Plus, RotateCcw, Square, Volume2 } from "lucide-react";
import {
  canUseVibration,
  DEFAULT_TIMER_RINGTONE,
  DEFAULT_TIMER_VOLUME,
  getTimerRingtone,
  playTimerEndAlert,
  previewTimerRingtone,
  resolveStoredRingtone,
  setTimerAlertVolume,
  stopTimerAlert,
  TIMER_RINGTONE_KEY,
  TIMER_RINGTONES,
  TIMER_VOLUME_KEY,
  unlockTimerAudio,
  type TimerRingtoneId,
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
  const [ringtone, setRingtone] = useState<TimerRingtoneId>(DEFAULT_TIMER_RINGTONE);
  const [volume, setVolume] = useState(DEFAULT_TIMER_VOLUME);
  const [alerting, setAlerting] = useState(false);
  const ringtoneRef = useRef<TimerRingtoneId>(DEFAULT_TIMER_RINGTONE);
  const volumeRef = useRef(DEFAULT_TIMER_VOLUME);
  const endAtRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);
  const progress = duration > 0 ? remaining / duration : 0;
  const strokeOffset = CIRCUMFERENCE * (1 - progress);
  const selectedRingtone = getTimerRingtone(ringtone);
  const isAudioRingtone = selectedRingtone.kind === "audio";

  const clearTimer = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    endAtRef.current = null;
  }, []);

  const silenceAlert = useCallback(() => {
    stopTimerAlert();
    setAlerting(false);
  }, []);

  const finishTimer = useCallback(() => {
    clearTimer();
    setRemaining(0);
    setStatus("finished");
    playTimerEndAlert(ringtoneRef.current, volumeRef.current);
    setAlerting(true);
  }, [clearTimer]);

  const selectRingtone = useCallback((next: TimerRingtoneId) => {
    setRingtone(next);
    ringtoneRef.current = next;
    localStorage.setItem(TIMER_RINGTONE_KEY, next);
    if (getTimerRingtone(next).kind === "audio") {
      void unlockTimerAudio();
    }
  }, []);

  const changeVolume = useCallback((next: number) => {
    setVolume(next);
    volumeRef.current = next;
    setTimerAlertVolume(next);
    localStorage.setItem(TIMER_VOLUME_KEY, String(next));
  }, []);

  const previewRingtone = useCallback(() => {
    void previewTimerRingtone(ringtoneRef.current, volumeRef.current);
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
    silenceAlert();
    void unlockTimerAudio();
    if (remaining <= 0) {
      setRemaining(duration);
    }
    endAtRef.current = Date.now() + (remaining > 0 ? remaining : duration) * 1000;
    setStatus("running");
    rafRef.current = requestAnimationFrame(tick);
  }, [duration, remaining, silenceAlert, tick]);

  const pauseTimer = useCallback(() => {
    if (endAtRef.current === null) return;
    const secondsLeft = Math.max(0, Math.ceil((endAtRef.current - Date.now()) / 1000));
    setRemaining(secondsLeft);
    clearTimer();
    setStatus("paused");
  }, [clearTimer]);

  const resetTimer = useCallback(() => {
    silenceAlert();
    clearTimer();
    setRemaining(duration);
    setStatus("idle");
  }, [clearTimer, duration, silenceAlert]);

  const selectPreset = useCallback(
    (seconds: number) => {
      silenceAlert();
      void unlockTimerAudio();
      clearTimer();
      setDuration(seconds);
      setRemaining(seconds);
      setStatus("idle");
    },
    [clearTimer, silenceAlert],
  );

  const canAdjustDuration = status === "idle" || status === "finished";

  const adjustDuration = useCallback(
    (delta: number) => {
      if (!canAdjustDuration) return;

      silenceAlert();
      void unlockTimerAudio();
      clearTimer();
      const base = status === "finished" ? duration : remaining;
      const next = Math.min(Math.max(base + delta, MIN_SECONDS), MAX_SECONDS);
      setDuration(next);
      setRemaining(next);
      setStatus("idle");
    },
    [canAdjustDuration, clearTimer, duration, remaining, silenceAlert, status],
  );

  useEffect(
    () => () => {
      clearTimer();
      stopTimerAlert();
    },
    [clearTimer],
  );

  useEffect(() => {
    ringtoneRef.current = ringtone;
  }, [ringtone]);

  useEffect(() => {
    volumeRef.current = volume;
    setTimerAlertVolume(volume);
  }, [volume]);

  useEffect(() => {
    const storedRingtone = localStorage.getItem(TIMER_RINGTONE_KEY);
    const legacyMode = localStorage.getItem("yoga-timer-alert-mode");
    const resolved = resolveStoredRingtone(storedRingtone ?? legacyMode);
    setRingtone(resolved);
    ringtoneRef.current = resolved;

    const storedVolume = localStorage.getItem(TIMER_VOLUME_KEY);
    if (storedVolume !== null) {
      const parsed = Number(storedVolume);
      if (Number.isFinite(parsed)) {
        const next = Math.min(1, Math.max(0, parsed));
        setVolume(next);
        volumeRef.current = next;
        setTimerAlertVolume(next);
      }
    }
  }, []);

  return (
    <div className="rounded-2xl border border-primary/10 bg-white p-6 shadow-canopee-soft sm:p-8">
      <div className="mb-6">
        <h2 className="font-serif text-2xl font-bold text-text-dark">Minuteur</h2>
        <p className="text-sm text-text-dark/60">
          Choisissez une durée, une sonnerie douce, puis lancez le cercle.
        </p>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {PRESETS.map((preset) => (
          <button
            key={preset.seconds}
            type="button"
            onClick={() => selectPreset(preset.seconds)}
            className={`w-full rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              duration === preset.seconds
                ? "bg-primary text-white"
                : "bg-accent/60 text-text-dark hover:bg-accent"
            }`}
          >
            {preset.label}
          </button>
        ))}
      </div>

      <div className="relative mx-auto mb-6 flex items-center justify-center" style={{ width: SIZE, height: SIZE }}>
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
        <div className="absolute inset-0 flex flex-col items-center justify-center px-4">
          <div className="flex w-full items-center justify-between">
            <button
              type="button"
              onClick={() => adjustDuration(-STEP_SECONDS)}
              disabled={!canAdjustDuration || remaining <= MIN_SECONDS}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-primary/20 text-primary transition-colors hover:bg-primary/5 disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Retirer 1 minute"
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="font-serif text-4xl font-bold tabular-nums text-text-dark sm:text-5xl">
              {formatTime(remaining)}
            </span>
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
          <span className="mt-0.5 text-xs uppercase tracking-wider text-text-dark/50">
            {alerting
              ? selectedRingtone.kind === "vibrate"
                ? "Alarme"
                : "Sonnerie"
              : status === "finished"
                ? "Terminé"
                : status === "running"
                  ? "En cours"
                  : status === "paused"
                    ? "Pause"
                    : "Prêt"}
          </span>
        </div>
      </div>

      <div className="mb-6 space-y-3 rounded-xl border border-primary/10 bg-accent/20 px-4 py-3">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <label htmlFor="timer-ringtone" className="shrink-0 text-sm font-medium text-text-dark">
            Sonnerie
          </label>
          <select
            id="timer-ringtone"
            value={ringtone}
            onChange={(event) => selectRingtone(event.target.value as TimerRingtoneId)}
            className="w-full rounded-lg border border-primary/15 bg-white px-3 py-2 text-sm text-text-dark outline-none focus:border-primary"
          >
            {TIMER_RINGTONES.map((item) => (
              <option key={item.id} value={item.id}>
                {item.label}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={previewRingtone}
            className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-full border border-primary/20 px-3 py-2 text-xs font-medium text-primary transition-colors hover:bg-primary/5"
          >
            Tester
          </button>
        </div>
        <p className="text-xs text-text-dark/55">{selectedRingtone.description}</p>

        {isAudioRingtone && (
          <div className="flex items-center gap-2">
            <Volume2 className="h-4 w-4 shrink-0 text-primary" />
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={volume}
              onChange={(event) => changeVolume(Number(event.target.value))}
              className="w-full accent-primary"
              aria-label="Volume de la sonnerie"
            />
            <span className="w-8 shrink-0 text-right text-xs tabular-nums text-text-dark/60">
              {Math.round(volume * 100)}%
            </span>
          </div>
        )}

        {ringtone === "vibrate" && !canUseVibration() && (
          <p className="text-[11px] leading-snug text-text-dark/50">
            Vibration non disponible sur cet appareil (ex. iPhone) — choisissez « Buzz » pour une
            imitation sonore avec volume réglable.
          </p>
        )}
      </div>

      <div className="flex flex-wrap justify-center gap-3">
        {alerting ? (
          <button
            type="button"
            onClick={silenceAlert}
            className="inline-flex items-center gap-2 rounded-full bg-red-700 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-red-800"
          >
            <Square className="h-4 w-4 fill-current" />
            Stop
          </button>
        ) : status === "running" ? (
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
