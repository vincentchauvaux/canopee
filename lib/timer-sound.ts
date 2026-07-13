const TIMER_VIBRATE_PATTERN = [0, 400, 150, 400, 150, 600] as const;

export function vibrateTimerEnd() {
  if (typeof navigator === "undefined" || !("vibrate" in navigator)) return;
  navigator.vibrate([...TIMER_VIBRATE_PATTERN]);
}

export function playTimerEndSound() {
  const AudioCtx =
    window.AudioContext ??
    (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioCtx) return;

  const ctx = new AudioCtx();
  void ctx.resume();

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

  window.setTimeout(() => {
    void ctx.close();
  }, 6000);
}
