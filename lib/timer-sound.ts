export type TimerAlertMode = "sound" | "vibrate";

export const TIMER_ALERT_MODE_KEY = "yoga-timer-alert-mode";

const TIMER_VIBRATE_PATTERN = [0, 400, 150, 400, 150, 600] as const;

let sharedAudioContext: AudioContext | null = null;

function getAudioContextClass() {
  if (typeof window === "undefined") return null;
  return (
    window.AudioContext ??
    (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext ??
    null
  );
}

function getOrCreateAudioContext() {
  const AudioCtx = getAudioContextClass();
  if (!AudioCtx) return null;

  if (!sharedAudioContext || sharedAudioContext.state === "closed") {
    sharedAudioContext = new AudioCtx();
  }

  return sharedAudioContext;
}

/** Débloque l'audio Web sur un geste utilisateur (démarrage minuteur, switch Sonner). */
export async function unlockTimerAudio() {
  const ctx = getOrCreateAudioContext();
  if (!ctx || ctx.state !== "suspended") return;
  await ctx.resume();
}

export function canUseVibration() {
  return typeof navigator !== "undefined" && "vibrate" in navigator;
}

export function playTimerEndAlert(mode: TimerAlertMode) {
  if (mode === "sound") {
    void playTimerEndSound();
    return;
  }
  vibrateTimerEnd();
}

export function vibrateTimerEnd() {
  if (!canUseVibration()) return;
  navigator.vibrate([...TIMER_VIBRATE_PATTERN]);
}

export async function playTimerEndSound() {
  const ctx = getOrCreateAudioContext();
  if (!ctx) return;

  if (ctx.state === "suspended") {
    await ctx.resume();
  }

  if (ctx.state !== "running") return;

  const now = ctx.currentTime;
  const master = ctx.createGain();
  master.gain.setValueAtTime(0, now);
  master.gain.linearRampToValueAtTime(0.28, now + 0.12);
  master.gain.exponentialRampToValueAtTime(0.001, now + 5);
  master.connect(ctx.destination);

  const fundamental = ctx.createOscillator();
  fundamental.type = "sine";
  fundamental.frequency.setValueAtTime(155, now);
  fundamental.frequency.exponentialRampToValueAtTime(118, now + 3.5);

  const fundamentalGain = ctx.createGain();
  fundamentalGain.gain.setValueAtTime(1, now);
  fundamental.connect(fundamentalGain);
  fundamentalGain.connect(master);

  const harmonic = ctx.createOscillator();
  harmonic.type = "sine";
  harmonic.frequency.setValueAtTime(310, now);
  harmonic.frequency.exponentialRampToValueAtTime(236, now + 3);

  const harmonicGain = ctx.createGain();
  harmonicGain.gain.setValueAtTime(0.12, now);
  harmonic.connect(harmonicGain);
  harmonicGain.connect(master);

  const end = now + 5.2;
  fundamental.start(now);
  harmonic.start(now);
  fundamental.stop(end);
  harmonic.stop(end);
}
