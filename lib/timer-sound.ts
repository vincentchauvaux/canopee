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
    description: "Gong grave et apaisant",
    kind: "audio",
  },
  {
    id: "bol",
    label: "Bol tibétain",
    description: "Résonance douce de bol",
    kind: "audio",
  },
  {
    id: "cloche",
    label: "Cloche douce",
    description: "Tintement léger et calme",
    kind: "audio",
  },
  {
    id: "om",
    label: "Om doux",
    description: "Voyelle OM synthétisée",
    kind: "audio",
  },
  {
    id: "buzz",
    label: "Buzz (imitation vibreur)",
    description: "Son pulsant type vibreur, volume réglable",
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
export const DEFAULT_TIMER_VOLUME = 0.55;

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

/** Motif buzz audio (ms on / ms off), calqué sur un vibreur. */
const BUZZ_AUDIO_PATTERN = [
  180, 70,
  320, 70,
  180, 70,
  450, 100,
  180, 70,
  320, 70,
  550, 160,
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

function scheduleGong(ctx: AudioContext) {
  const now = ctx.currentTime;
  const master = createMasterGain(ctx, 0.55);
  master.gain.setValueAtTime(0, now);
  master.gain.linearRampToValueAtTime(alertVolume * 0.55, now + 0.1);
  master.gain.exponentialRampToValueAtTime(0.001, now + 3.2);

  const fundamental = ctx.createOscillator();
  fundamental.type = "sine";
  fundamental.frequency.setValueAtTime(155, now);
  fundamental.frequency.exponentialRampToValueAtTime(118, now + 2.8);

  const fundamentalGain = ctx.createGain();
  fundamentalGain.gain.setValueAtTime(1, now);
  fundamental.connect(fundamentalGain);
  fundamentalGain.connect(master);

  const harmonic = ctx.createOscillator();
  harmonic.type = "sine";
  harmonic.frequency.setValueAtTime(310, now);
  harmonic.frequency.exponentialRampToValueAtTime(236, now + 2.4);

  const harmonicGain = ctx.createGain();
  harmonicGain.gain.setValueAtTime(0.14, now);
  harmonic.connect(harmonicGain);
  harmonicGain.connect(master);

  const end = now + 3.4;
  fundamental.start(now);
  harmonic.start(now);
  fundamental.stop(end);
  harmonic.stop(end);
  activeSources.push(fundamental, harmonic);
}

function scheduleBol(ctx: AudioContext) {
  const now = ctx.currentTime;
  const master = createMasterGain(ctx, 0.45);
  master.gain.setValueAtTime(0, now);
  master.gain.linearRampToValueAtTime(alertVolume * 0.45, now + 0.05);
  master.gain.exponentialRampToValueAtTime(0.001, now + 4.5);

  const freqs = [196, 294, 392, 588];
  freqs.forEach((freq, index) => {
    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, now);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.35 / (index + 1), now);
    osc.connect(gain);
    gain.connect(master);

    osc.start(now);
    osc.stop(now + 4.6);
    activeSources.push(osc);
  });
}

function scheduleCloche(ctx: AudioContext) {
  const now = ctx.currentTime;
  const master = createMasterGain(ctx, 0.4);
  master.gain.setValueAtTime(0, now);
  master.gain.linearRampToValueAtTime(alertVolume * 0.4, now + 0.01);
  master.gain.exponentialRampToValueAtTime(0.001, now + 2.8);

  const osc = ctx.createOscillator();
  osc.type = "sine";
  osc.frequency.setValueAtTime(660, now);
  osc.frequency.exponentialRampToValueAtTime(520, now + 2.2);

  const partial = ctx.createOscillator();
  partial.type = "triangle";
  partial.frequency.setValueAtTime(1320, now);

  const partialGain = ctx.createGain();
  partialGain.gain.setValueAtTime(0.08, now);

  osc.connect(master);
  partial.connect(partialGain);
  partialGain.connect(master);

  osc.start(now);
  partial.start(now);
  osc.stop(now + 2.9);
  partial.stop(now + 2.9);
  activeSources.push(osc, partial);
}

function scheduleOm(ctx: AudioContext) {
  const now = ctx.currentTime;
  const master = createMasterGain(ctx, 0.42);
  master.gain.setValueAtTime(0, now);
  master.gain.linearRampToValueAtTime(alertVolume * 0.42, now + 0.35);
  master.gain.setValueAtTime(alertVolume * 0.42, now + 2.2);
  master.gain.exponentialRampToValueAtTime(0.001, now + 3.8);

  const fundamental = ctx.createOscillator();
  fundamental.type = "sine";
  fundamental.frequency.setValueAtTime(110, now);

  const formant = ctx.createOscillator();
  formant.type = "sine";
  formant.frequency.setValueAtTime(220, now);
  formant.frequency.linearRampToValueAtTime(165, now + 1.2);
  formant.frequency.linearRampToValueAtTime(140, now + 2.8);

  const formantGain = ctx.createGain();
  formantGain.gain.setValueAtTime(0.35, now);

  fundamental.connect(master);
  formant.connect(formantGain);
  formantGain.connect(master);

  fundamental.start(now);
  formant.start(now);
  fundamental.stop(now + 4);
  formant.stop(now + 4);
  activeSources.push(fundamental, formant);
}

function createNoiseBuffer(ctx: AudioContext, durationSec: number) {
  const length = Math.max(1, Math.floor(ctx.sampleRate * durationSec));
  const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < length; i += 1) {
    data[i] = Math.random() * 2 - 1;
  }
  return buffer;
}

function scheduleBuzz(ctx: AudioContext) {
  const now = ctx.currentTime;
  const master = createMasterGain(ctx, 0.7);
  const filter = ctx.createBiquadFilter();
  filter.type = "bandpass";
  filter.frequency.setValueAtTime(180, now);
  filter.Q.setValueAtTime(4, now);
  filter.connect(master);

  const rumble = ctx.createOscillator();
  rumble.type = "sawtooth";
  rumble.frequency.setValueAtTime(55, now);

  const rumbleGain = ctx.createGain();
  rumbleGain.gain.setValueAtTime(0, now);
  rumble.connect(rumbleGain);
  rumbleGain.connect(filter);

  const noise = ctx.createBufferSource();
  noise.buffer = createNoiseBuffer(ctx, 4);
  const noiseGain = ctx.createGain();
  noiseGain.gain.setValueAtTime(0, now);
  noise.connect(noiseGain);
  noiseGain.connect(filter);

  rumble.start(now);
  noise.start(now);

  let cursor = now;
  for (let i = 0; i < BUZZ_AUDIO_PATTERN.length; i += 2) {
    const onMs = BUZZ_AUDIO_PATTERN[i] ?? 0;
    const offMs = BUZZ_AUDIO_PATTERN[i + 1] ?? 0;
    const onSec = onMs / 1000;
    const offSec = offMs / 1000;
    const peak = alertVolume * 0.7;

    rumbleGain.gain.setValueAtTime(0.0001, cursor);
    rumbleGain.gain.linearRampToValueAtTime(peak * 0.85, cursor + 0.01);
    rumbleGain.gain.setValueAtTime(peak * 0.85, cursor + onSec - 0.01);
    rumbleGain.gain.linearRampToValueAtTime(0.0001, cursor + onSec);

    noiseGain.gain.setValueAtTime(0.0001, cursor);
    noiseGain.gain.linearRampToValueAtTime(peak * 0.35, cursor + 0.01);
    noiseGain.gain.setValueAtTime(peak * 0.35, cursor + onSec - 0.01);
    noiseGain.gain.linearRampToValueAtTime(0.0001, cursor + onSec);

    cursor += onSec + offSec;
  }

  const end = cursor + 0.05;
  rumble.stop(end);
  noise.stop(end);
  activeSources.push(rumble, noise);
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
      return 4200;
    case "cloche":
      return 2800;
    case "om":
      return 3800;
    case "buzz":
      return patternDurationMs(BUZZ_AUDIO_PATTERN) + 120;
    case "gong":
    default:
      return 3200;
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
