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
/** Volume par défaut audible tout en restant doux. */
export const DEFAULT_TIMER_VOLUME = 0.7;

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

/** Garantit un AudioContext running (recréation si Safari reste suspendu). */
async function ensureRunningAudioContext() {
  let ctx = getOrCreateAudioContext();
  if (!ctx) return null;

  await resumeContext(ctx);

  if (ctx.state !== "running") {
    const AudioCtx = getAudioContextClass();
    if (!AudioCtx) return null;
    ctx = new AudioCtx();
    sharedAudioContext = ctx;
    await resumeContext(ctx);
  }

  return ctx.state === "running" ? ctx : null;
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

/** Volume effectif : évite le silence total si le curseur est à 0. */
function effectivePeak(multiplier: number) {
  const vol = Math.max(0.25, alertVolume);
  return Math.min(1, vol * multiplier);
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

function softLowpass(ctx: AudioContext, cutoffHz: number) {
  const filter = ctx.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.setValueAtTime(cutoffHz, ctx.currentTime);
  filter.Q.setValueAtTime(0.7, ctx.currentTime);
  return filter;
}

function connectSoftMaster(ctx: AudioContext, cutoffHz: number, peak: number, attack: number, duration: number) {
  const master = ctx.createGain();
  const filter = softLowpass(ctx, cutoffHz);
  filter.connect(master);
  master.connect(ctx.destination);

  const now = ctx.currentTime;
  master.gain.setValueAtTime(0.0001, now);
  master.gain.linearRampToValueAtTime(peak, now + attack);
  master.gain.exponentialRampToValueAtTime(0.0001, now + duration);
  return { filter, now, duration };
}

function scheduleGong(ctx: AudioContext) {
  const peak = effectivePeak(0.6);
  const { filter, now, duration } = connectSoftMaster(ctx, 1200, peak, 0.15, 5);

  const partials: Array<[number, number]> = [
    [110, 1],
    [165, 0.3],
    [220, 0.14],
    [330, 0.06],
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
  const peak = effectivePeak(0.58);
  const { filter, now, duration } = connectSoftMaster(ctx, 1500, peak, 0.25, 5.8);

  const partials: Array<[number, number]> = [
    [174.61, 1],
    [261.63, 0.34],
    [349.23, 0.15],
    [523.25, 0.07],
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
  const peak = effectivePeak(0.52);
  const { filter, now, duration } = connectSoftMaster(ctx, 2400, peak, 0.04, 3.8);

  const osc = ctx.createOscillator();
  osc.type = "sine";
  osc.frequency.setValueAtTime(523.25, now);
  osc.frequency.exponentialRampToValueAtTime(440, now + 2.8);

  const shimmer = ctx.createOscillator();
  shimmer.type = "sine";
  shimmer.frequency.setValueAtTime(784, now);

  const shimmerGain = ctx.createGain();
  shimmerGain.gain.setValueAtTime(0.1, now);
  shimmerGain.gain.exponentialRampToValueAtTime(0.0001, now + 2);

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
  const peak = effectivePeak(0.58);
  const now = ctx.currentTime;
  const duration = 5.2;
  const master = ctx.createGain();
  const filter = softLowpass(ctx, 1000);
  filter.connect(master);
  master.connect(ctx.destination);

  master.gain.setValueAtTime(0.0001, now);
  master.gain.linearRampToValueAtTime(peak, now + 0.55);
  master.gain.linearRampToValueAtTime(peak * 0.85, now + 2.8);
  master.gain.exponentialRampToValueAtTime(0.0001, now + duration);

  const fundamental = ctx.createOscillator();
  fundamental.type = "sine";
  fundamental.frequency.setValueAtTime(110, now);

  const formant = ctx.createOscillator();
  formant.type = "sine";
  formant.frequency.setValueAtTime(165, now);
  formant.frequency.linearRampToValueAtTime(138, now + 2.2);
  formant.frequency.linearRampToValueAtTime(110, now + 4.5);

  const formantGain = ctx.createGain();
  formantGain.gain.setValueAtTime(0.35, now);

  const fifth = ctx.createOscillator();
  fifth.type = "sine";
  fifth.frequency.setValueAtTime(165, now);
  const fifthGain = ctx.createGain();
  fifthGain.gain.setValueAtTime(0.12, now);

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

/** Pulse sinusoïdal type souffle — doux mais clairement audible. */
function scheduleBuzz(ctx: AudioContext) {
  const now = ctx.currentTime;
  const peak = effectivePeak(0.55);
  const master = ctx.createGain();
  const filter = softLowpass(ctx, 900);
  filter.connect(master);
  master.connect(ctx.destination);
  master.gain.setValueAtTime(1, now);

  const tone = ctx.createOscillator();
  tone.type = "sine";
  tone.frequency.setValueAtTime(196, now);

  const harmonic = ctx.createOscillator();
  harmonic.type = "sine";
  harmonic.frequency.setValueAtTime(294, now);

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
    const attack = Math.min(0.2, onSec * 0.28);
    const release = Math.min(0.25, onSec * 0.32);

    toneGain.gain.cancelScheduledValues(cursor);
    toneGain.gain.setValueAtTime(0.0001, cursor);
    toneGain.gain.linearRampToValueAtTime(peak, cursor + attack);
    toneGain.gain.linearRampToValueAtTime(peak * 0.8, cursor + onSec - release);
    toneGain.gain.linearRampToValueAtTime(0.0001, cursor + onSec);

    harmGain.gain.cancelScheduledValues(cursor);
    harmGain.gain.setValueAtTime(0.0001, cursor);
    harmGain.gain.linearRampToValueAtTime(peak * 0.25, cursor + attack);
    harmGain.gain.linearRampToValueAtTime(peak * 0.15, cursor + onSec - release);
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
      return 6000;
    case "cloche":
      return 4200;
    case "om":
      return 5400;
    case "buzz":
      return patternDurationMs(SOFT_PULSE_PATTERN) + 400;
    case "gong":
    default:
      return 5200;
  }
}

/** Débloque l'audio Web sur un geste utilisateur (démarrage minuteur, choix sonnerie). */
export async function unlockTimerAudio() {
  await ensureRunningAudioContext();
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
    const ctx = await ensureRunningAudioContext();
    if (!ctx || !alertActive) return;
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
      return;
    }
    // iPhone : pas de vibreur Web → aperçu sonore du pulse doux
    ringtone = "buzz";
  }

  stopActiveSources();

  const ctx = await ensureRunningAudioContext();
  if (!ctx) return;

  const previous = alertVolume;
  alertVolume = clampVolume(volume <= 0.05 ? DEFAULT_TIMER_VOLUME : volume);
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
