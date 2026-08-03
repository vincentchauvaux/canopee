export type TimerAlertMode = "sound" | "vibrate";

export const TIMER_ALERT_MODE_KEY = "yoga-timer-alert-mode";

/**
 * Motif type réveil (bzz / bzzz / bzzzz) — intensité max via rafales longues et rapprochées.
 * L'API Vibration ne permet pas de régler l'amplitude, seulement le rythme.
 */
const ALARM_VIBRATE_PATTERN = [
  0,
  220, 90, // bzz
  380, 90, // bzzz
  220, 90, // bzz
  520, 120, // bzzzz
  220, 90, // bzz
  380, 90, // bzzz
  650, 180, // bzzzzz
  300, 350, // pause avant boucle
] as const;

let sharedAudioContext: AudioContext | null = null;
let alertActive = false;
let vibrateIntervalId: number | null = null;
let soundIntervalId: number | null = null;
let activeOscillators: OscillatorNode[] = [];

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

function stopActiveOscillators() {
  for (const osc of activeOscillators) {
    try {
      osc.stop();
    } catch {
      // déjà arrêté
    }
  }
  activeOscillators = [];
}

function scheduleGong(ctx: AudioContext) {
  const now = ctx.currentTime;
  const master = ctx.createGain();
  master.gain.setValueAtTime(0, now);
  master.gain.linearRampToValueAtTime(0.32, now + 0.1);
  master.gain.exponentialRampToValueAtTime(0.001, now + 3.2);
  master.connect(ctx.destination);

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
  activeOscillators.push(fundamental, harmonic);
}

/** Débloque l'audio Web sur un geste utilisateur (démarrage minuteur, switch Sonner). */
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

  stopActiveOscillators();

  if (canUseVibration()) {
    navigator.vibrate(0);
  }
}

export function playTimerEndAlert(mode: TimerAlertMode) {
  stopTimerAlert();
  alertActive = true;

  if (mode === "sound") {
    void startRepeatingGong();
    return;
  }

  startAlarmVibration();
}

function startAlarmVibration() {
  if (!canUseVibration()) return;

  const run = () => {
    if (!alertActive || !canUseVibration()) return;
    navigator.vibrate([...ALARM_VIBRATE_PATTERN]);
  };

  run();
  const period = patternDurationMs(ALARM_VIBRATE_PATTERN) + 80;
  vibrateIntervalId = window.setInterval(run, period);
}

async function startRepeatingGong() {
  const playOnce = async () => {
    if (!alertActive) return;

    let ctx = getOrCreateAudioContext();
    if (!ctx) return;

    await resumeContext(ctx);

    if (ctx.state !== "running") {
      const AudioCtx = getAudioContextClass();
      if (!AudioCtx) return;
      ctx = new AudioCtx();
      await resumeContext(ctx);
    }

    if (!alertActive) return;
    scheduleGong(ctx);
  };

  await playOnce();
  soundIntervalId = window.setInterval(() => {
    void playOnce();
  }, 3200);
}

/** @deprecated Utiliser playTimerEndAlert("vibrate") — conservé pour compatibilité. */
export function vibrateTimerEnd() {
  playTimerEndAlert("vibrate");
}

/** @deprecated Utiliser playTimerEndAlert("sound") — conservé pour compatibilité. */
export async function playTimerEndSound() {
  playTimerEndAlert("sound");
}
