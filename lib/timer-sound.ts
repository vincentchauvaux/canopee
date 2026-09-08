/** Identifiants de sonnerie du minuteur. */
export type TimerRingtoneId =
  | "gong"
  | "bol"
  | "cloche"
  | "om"
  | "buzz"
  | "vibrate";

export type TimerRingtoneKind = "audio" | "vibrate";

export interface TimerRingtone {
  id: TimerRingtoneId;
  label: string;
  description: string;
  kind: TimerRingtoneKind;
}

export const TIMER_RINGTONES: TimerRingtone[] = [
  {
    id: "gong",
    label: "Gong doux",
    description: "Gong grave, fade long — comme un bol de méditation",
    kind: "audio",
  },
  {
    id: "bol",
    label: "Bol tibétain",
    description: "Résonance chaude et enveloppante",
    kind: "audio",
  },
  {
    id: "cloche",
    label: "Cloche douce",
    description: "Tintement cristallin très léger",
    kind: "audio",
  },
  {
    id: "om",
    label: "Om doux",
    description: "Voyelle OM grave et lente",
    kind: "audio",
  },
  {
    id: "buzz",
    label: "Pulse doux",
    description: "Souffle sinusoïdal discret (remplace le vibreur, volume réglable)",
    kind: "audio",
  },
  {
    id: "vibrate",
    label: "Vibration téléphone",
    description: "Vibreur matériel (Android)",
    kind: "vibrate",
  },
];

/** @deprecated Utiliser TimerRingtoneId — conservé pour migration localStorage. */
export type TimerAlertMode = "sound" | "vibrate";

export const TIMER_ALERT_MODE_KEY = "yoga-timer-alert-mode";
export const TIMER_RINGTONE_KEY = "yoga-timer-ringtone";
export const TIMER_VOLUME_KEY = "yoga-timer-volume";

export const DEFAULT_TIMER_RINGTONE: TimerRingtoneId = "gong";
export const DEFAULT_TIMER_VOLUME = 0.4;

/**
 * Motif d'alarme à intensité maximale perçue : rafales longues, pauses minimales.
 * L'API Vibration ne permet pas de régler l'amplitude — seulement le rythme.
 */
const ALARM_VIBRATE_PATTERN = [
  0,
  1000, 25,
  1000, 25,
  1000, 25,
  1000, 25,
  1000, 40,
] as const;

/** Pulse doux : on/off en ms — gonflement lent type respiration. */
const SOFT_PULSE_PATTERN = [
  900, 500,
  900, 500,
  1200, 800,
] as const;

let sharedAudioContext: AudioContext | null = null;
let alertActive = false;
let vibrateIntervalId: number | null = null;
let soundIntervalId: number | null = null;
let activeSources: Array<AudioScheduledSourceNode | AudioBufferSourceNode> = [];
let alertVolume = DEFAULT_TIMER_VOLUME;

function patternDurationMs(pattern: readonly number[]) {
  return pattern.reduce((sum, value) => sum + value, 0);
}

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

async function resumeContext(ctx: AudioContext) {
  if (ctx.state === "running" || ctx.state === "closed") return;
  try {
    await ctx.resume();
  } catch {
    // Autoplay policy : reprise impossible sans geste utilisateur récent
  }
}

function stopActiveSources() {
  for (const source of activeSources) {
    try {
      source.stop();
    } catch {
      // déjà arrêté
    }
  }
  activeSources = [];
}

function clampVolume(value: number) {
  if (!Number.isFinite(value)) return DEFAULT_TIMER_VOLUME;
  return Math.min(1, Math.max(0, value));
}

export function getTimerRingtone(id: string | null | undefined): TimerRingtone {
  return (
    TIMER_RINGTONES.find((item) => item.id === id) ??
    TIMER_RINGTONES.find((item) => item.id === DEFAULT_TIMER_RINGTONE)!
  );
}

export function resolveStoredRingtone(stored: string | null): TimerRingtoneId {
  if (stored && TIMER_RINGTONES.some((item) => item.id === stored)) {
    return stored as TimerRingtoneId;
  }
  // Migration ancienne clé Sonner/Vibrer
  if (stored === "vibrate") return "vibrate";
  if (stored === "sound") return "gong";
  return DEFAULT_TIMER_RINGTONE;
}

export function setTimerAlertVolume(volume: number) {
  alertVolume = clampVolume(volume);
}

export function getTimerAlertVolume() {
  return alertVolume;
}

function createMasterGain(ctx: AudioContext, peak: number) {
  const master = ctx.createGain();
  const level = alertVolume * peak;
  master.gain.setValueAtTime(Math.max(0.0001, level), ctx.currentTime);
  master.connect(ctx.destination);
  return master;
}

/** Filtre passe-bas pour adoucir les partiels aigus. */
function softLowpass(ctx: AudioContext, cutoffHz: number) {
  const filter = ctx.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.setValueAtTime(cutoffHz, ctx.currentTime);
  filter.Q.setValueAtTime(0.7, ctx.currentTime);
  return filter;
}

function scheduleGong(ctx: AudioContext) {
  const now = ctx.currentTime;
  const duration = 5.5;
  const master = createMasterGain(ctx, 0.28);
  const filter = softLowpass(ctx, 900);
  filter.connect(master);

  master.gain.setValueAtTime(0.0001, now);
  master.gain.linearRampToValueAtTime(alertVolume * 0.28, now + 0.25);
  master.gain.exponentialRampToValueAtTime(0.0001, now + duration);

  // Fondamental grave + harmoniques très discrètes (sinus uniquement)
  const partials: Array<[number, number]> = [
    [98, 1],
    [147, 0.22],
    [196, 0.1],
    [294, 0.04],
  ];

  for (const [freq, amp] of partials) {
    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, now);
    osc.frequency.exponentialRampToValueAtTime(freq * 0.94, now + duration * 0.85);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(amp, now);
    osc.connect(gain);
    gain.connect(filter);

    osc.start(now);
    osc.stop(now + duration + 0.05);
    activeSources.push(osc);
  }
}

function scheduleBol(ctx: AudioContext) {
  const now = ctx.currentTime;
  const duration = 6.5;
  const master = createMasterGain(ctx, 0.26);
  const filter = softLowpass(ctx, 1200);
  filter.connect(master);

  master.gain.setValueAtTime(0.0001, now);
  master.gain.linearRampToValueAtTime(alertVolume * 0.26, now + 0.4);
  master.gain.exponentialRampToValueAtTime(0.0001, now + duration);

  // Cordes de bol : 5e juste, octave — très douces
  const partials: Array<[number, number]> = [
    [174.61, 1], // Fa3
    [261.63, 0.28],
    [349.23, 0.12],
    [523.25, 0.05],
  ];

  partials.forEach(([freq, amp]) => {
    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, now);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(amp, now);
    osc.connect(gain);
    gain.connect(filter);

    osc.start(now);
    osc.stop(now + duration + 0.05);
    activeSources.push(osc);
  });
}

function scheduleCloche(ctx: AudioContext) {
  const now = ctx.currentTime;
  const duration = 4.2;
  const master = createMasterGain(ctx, 0.22);
  const filter = softLowpass(ctx, 1800);
  filter.connect(master);

  master.gain.setValueAtTime(0.0001, now);
  master.gain.linearRampToValueAtTime(alertVolume * 0.22, now + 0.08);
  master.gain.exponentialRampToValueAtTime(0.0001, now + duration);

  const osc = ctx.createOscillator();
  osc.type = "sine";
  osc.frequency.setValueAtTime(523.25, now); // Do5
  osc.frequency.exponentialRampToValueAtTime(440, now + 3.2);

  const shimmer = ctx.createOscillator();
  shimmer.type = "sine";
  shimmer.frequency.setValueAtTime(784, now);

  const shimmerGain = ctx.createGain();
  shimmerGain.gain.setValueAtTime(0.06, now);
  shimmerGain.gain.exponentialRampToValueAtTime(0.0001, now + 2.4);

  osc.connect(filter);
  shimmer.connect(shimmerGain);
  shimmerGain.connect(filter);

  osc.start(now);
  shimmer.start(now);
  osc.stop(now + duration + 0.05);
  shimmer.stop(now + duration + 0.05);
  activeSources.push(osc, shimmer);
}

function scheduleOm(ctx: AudioContext) {
  const now = ctx.currentTime;
  const duration = 5.8;
  const master = createMasterGain(ctx, 0.3);
  const filter = softLowpass(ctx, 700);
  filter.connect(master);

  // Attack / sustain / release type respiration
  master.gain.setValueAtTime(0.0001, now);
  master.gain.linearRampToValueAtTime(alertVolume * 0.3, now + 0.9);
  master.gain.setValueAtTime(alertVolume * 0.3, now + 3.2);
  master.gain.exponentialRampToValueAtTime(0.0001, now + duration);

  const fundamental = ctx.createOscillator();
  fundamental.type = "sine";
  fundamental.frequency.setValueAtTime(110, now); // La2

  const formant = ctx.createOscillator();
  formant.type = "sine";
  formant.frequency.setValueAtTime(165, now);
  formant.frequency.linearRampToValueAtTime(138, now + 2.5);
  formant.frequency.linearRampToValueAtTime(110, now + 5);

  const formantGain = ctx.createGain();
  formantGain.gain.setValueAtTime(0.28, now);

  const fifth = ctx.createOscillator();
  fifth.type = "sine";
  fifth.frequency.setValueAtTime(165, now);
  const fifthGain = ctx.createGain();
  fifthGain.gain.setValueAtTime(0.08, now);

  fundamental.connect(filter);
  formant.connect(formantGain);
  formantGain.connect(filter);
  fifth.connect(fifthGain);
  fifthGain.connect(filter);

  fundamental.start(now);
  formant.start(now);
  fifth.start(now);
  fundamental.stop(now + duration + 0.05);
  formant.stop(now + duration + 0.05);
  fifth.stop(now + duration + 0.05);
  activeSources.push(fundamental, formant, fifth);
}

/**
 * Remplace l'ancien buzz (sawtooth + bruit) par un pulse sinusoïdal
 * type souffle / respiration — discret, compatible musique zen.
 */
function scheduleBuzz(ctx: AudioContext) {
  const now = ctx.currentTime;
  const master = createMasterGain(ctx, 0.24);
  const filter = softLowpass(ctx, 480);
  filter.connect(master);

  const tone = ctx.createOscillator();
  tone.type = "sine";
  tone.frequency.setValueAtTime(174.61, now); // Fa3 — fréquence douce

  const harmonic = ctx.createOscillator();
  harmonic.type = "sine";
  harmonic.frequency.setValueAtTime(261.63, now);

  const toneGain = ctx.createGain();
  toneGain.gain.setValueAtTime(0.0001, now);
  const harmGain = ctx.createGain();
  harmGain.gain.setValueAtTime(0.0001, now);

  tone.connect(toneGain);
  toneGain.connect(filter);
  harmonic.connect(harmGain);
  harmGain.connect(filter);

  tone.start(now);
  harmonic.start(now);

  let cursor = now;
  for (let i = 0; i < SOFT_PULSE_PATTERN.length; i += 2) {
    const onMs = SOFT_PULSE_PATTERN[i] ?? 0;
    const offMs = SOFT_PULSE_PATTERN[i + 1] ?? 0;
    const onSec = onMs / 1000;
    const offSec = offMs / 1000;
    const peak = alertVolume * 0.24;
    const attack = Math.min(0.28, onSec * 0.35);
    const release = Math.min(0.35, onSec * 0.4);

    toneGain.gain.setValueAtTime(0.0001, cursor);
    toneGain.gain.linearRampToValueAtTime(peak, cursor + attack);
    toneGain.gain.setValueAtTime(peak * 0.85, cursor + onSec - release);
    toneGain.gain.linearRampToValueAtTime(0.0001, cursor + onSec);

    harmGain.gain.setValueAtTime(0.0001, cursor);
    harmGain.gain.linearRampToValueAtTime(peak * 0.18, cursor + attack);
    harmGain.gain.setValueAtTime(peak * 0.12, cursor + onSec - release);
    harmGain.gain.linearRampToValueAtTime(0.0001, cursor + onSec);

    cursor += onSec + offSec;
  }

  const end = cursor + 0.05;
  tone.stop(end);
  harmonic.stop(end);
  activeSources.push(tone, harmonic);
}

function scheduleRingtone(ctx: AudioContext, ringtone: TimerRingtoneId) {
  switch (ringtone) {
    case "bol":
      scheduleBol(ctx);
      break;
    case "cloche":
      scheduleCloche(ctx);
      break;
    case "om":
      scheduleOm(ctx);
      break;
    case "buzz":
      scheduleBuzz(ctx);
      break;
    case "gong":
    default:
      scheduleGong(ctx);
      break;
  }
}

function ringtoneRepeatMs(ringtone: TimerRingtoneId) {
  switch (ringtone) {
    case "bol":
      return 6200;
    case "cloche":
      return 4500;
    case "om":
      return 5800;
    case "buzz":
      return patternDurationMs(SOFT_PULSE_PATTERN) + 400;
    case "gong":
    default:
      return 5200;
  }
}

/** Débloque l'audio Web sur un geste utilisateur (démarrage minuteur, choix sonnerie). */
export async function unlockTimerAudio() {
  const ctx = getOrCreateAudioContext();
  if (!ctx) return;
  await resumeContext(ctx);
}

export function canUseVibration() {
  return typeof navigator !== "undefined" && "vibrate" in navigator;
}

export function isTimerAlertActive() {
  return alertActive;
}

/** Arrête sonnerie et/ou vibration du minuteur. */
export function stopTimerAlert() {
  alertActive = false;

  if (vibrateIntervalId !== null) {
    window.clearInterval(vibrateIntervalId);
    vibrateIntervalId = null;
  }

  if (soundIntervalId !== null) {
    window.clearInterval(soundIntervalId);
    soundIntervalId = null;
  }

  stopActiveSources();

  if (canUseVibration()) {
    navigator.vibrate(0);
  }
}

export function playTimerEndAlert(
  ringtone: TimerRingtoneId,
  volume: number = alertVolume,
) {
  stopTimerAlert();
  alertActive = true;
  alertVolume = clampVolume(volume);

  if (ringtone === "vibrate") {
    startAlarmVibration();
    return;
  }

  void startRepeatingRingtone(ringtone);
}

function startAlarmVibration() {
  if (!canUseVibration()) return;

  const run = () => {
    if (!alertActive || !canUseVibration()) return;
    navigator.vibrate([...ALARM_VIBRATE_PATTERN]);
  };

  run();
  const period = patternDurationMs(ALARM_VIBRATE_PATTERN) + 20;
  vibrateIntervalId = window.setInterval(run, period);
}

async function startRepeatingRingtone(ringtone: TimerRingtoneId) {
  const playOnce = async () => {
    if (!alertActive) return;

    let ctx = getOrCreateAudioContext();
    if (!ctx) return;

    await resumeContext(ctx);

    if (ctx.state !== "running") {
      const AudioCtx = getAudioContextClass();
      if (!AudioCtx) return;
      ctx = new AudioCtx();
      sharedAudioContext = ctx;
      await resumeContext(ctx);
    }

    if (!alertActive) return;
    scheduleRingtone(ctx, ringtone);
  };

  await playOnce();
  soundIntervalId = window.setInterval(() => {
    void playOnce();
  }, ringtoneRepeatMs(ringtone));
}

/** Aperçu court d'une sonnerie (geste utilisateur). */
export async function previewTimerRingtone(
  ringtone: TimerRingtoneId,
  volume: number = alertVolume,
) {
  if (ringtone === "vibrate") {
    if (canUseVibration()) {
      navigator.vibrate([0, 220, 80, 380, 80, 220]);
    }
    return;
  }

  await unlockTimerAudio();
  const ctx = getOrCreateAudioContext();
  if (!ctx) return;
  await resumeContext(ctx);
  if (ctx.state !== "running") return;

  const previous = alertVolume;
  alertVolume = clampVolume(volume);
  scheduleRingtone(ctx, ringtone);
  alertVolume = previous;
}

/** @deprecated Utiliser playTimerEndAlert("vibrate"). */
export function vibrateTimerEnd() {
  playTimerEndAlert("vibrate");
}

/** @deprecated Utiliser playTimerEndAlert("gong"). */
export async function playTimerEndSound() {
  playTimerEndAlert("gong");
}
