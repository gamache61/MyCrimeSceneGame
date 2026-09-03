// ============================================================
// sound-system.js — Crowsnest Castle
// Generated sounds via Web Audio API. No audio files, no keys.
// Include in any room:  <script src="sound-system.js"></script>
// (adjust path, e.g. "../sound-system.js" from subfolders)
//
// Usage:
//   SoundSystem.play('pickup')     - evidence orb collected
//   SoundSystem.play('click')      - UI button click
//   SoundSystem.play('clue')       - clue discovered / board event
//   SoundSystem.play('doorOpen')   - door opens
//   SoundSystem.play('doorClose')  - door closes
//   SoundSystem.play('denied')     - action not allowed
//   SoundSystem.play('paper')      - notes / evidence card flip
//   SoundSystem.footstep()         - call every frame while moving (auto-throttled)
//   SoundSystem.startAmbient()     - low castle drone + wind (loops)
//   SoundSystem.stopAmbient()
//   SoundSystem.setVolume(0.0–1.0)
//   SoundSystem.toggleMute()       - saved to localStorage
// ============================================================

(function () {
  const LS_KEY = 'crowsnest_sound_v1';

  let ctx = null;
  let master = null;
  let muted = false;
  let volume = 0.5;

  // load saved settings
  try {
    const saved = JSON.parse(localStorage.getItem(LS_KEY) || '{}');
    if (typeof saved.muted === 'boolean') muted = saved.muted;
    if (typeof saved.volume === 'number') volume = saved.volume;
  } catch (e) {}

  function saveSettings() {
    try { localStorage.setItem(LS_KEY, JSON.stringify({ muted, volume })); } catch (e) {}
  }

  function ensureCtx() {
    if (!ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return false;
      ctx = new AC();
      master = ctx.createGain();
      master.gain.value = muted ? 0 : volume;
      master.connect(ctx.destination);
    }
    if (ctx.state === 'suspended') ctx.resume();
    return true;
  }

  // Browsers require a user gesture before audio can start
  function unlock() {
    ensureCtx();
    window.removeEventListener('click', unlock);
    window.removeEventListener('keydown', unlock);
    window.removeEventListener('touchstart', unlock);
  }
  window.addEventListener('click', unlock);
  window.addEventListener('keydown', unlock);
  window.addEventListener('touchstart', unlock);

  // ---------- helpers ----------
  function tone(freq, dur, type, vol, when, slideTo) {
    const t = ctx.currentTime + (when || 0);
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = type || 'sine';
    o.frequency.setValueAtTime(freq, t);
    if (slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, t + dur);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol || 0.3, t + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g); g.connect(master);
    o.start(t); o.stop(t + dur + 0.05);
  }

  function noiseBuffer(seconds) {
    const len = ctx.sampleRate * seconds;
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    return buf;
  }

  function noise(dur, vol, filterFreq, filterType, when) {
    const t = ctx.currentTime + (when || 0);
    const src = ctx.createBufferSource();
    src.buffer = noiseBuffer(dur);
    const f = ctx.createBiquadFilter();
    f.type = filterType || 'lowpass';
    f.frequency.value = filterFreq || 800;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol || 0.3, t + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    src.connect(f); f.connect(g); g.connect(master);
    src.start(t); src.stop(t + dur + 0.05);
  }

  // ---------- sound definitions ----------
  const sounds = {
    pickup() {
      // golden chime: ascending two-note sparkle
      tone(660, 0.15, 'sine', 0.35);
      tone(990, 0.25, 'sine', 0.3, 0.08);
      tone(1320, 0.35, 'sine', 0.2, 0.16);
    },
    click() {
      tone(900, 0.05, 'square', 0.12);
    },
    clue() {
      // mysterious minor arpeggio
      tone(440, 0.3, 'triangle', 0.25);
      tone(523, 0.3, 'triangle', 0.22, 0.12);
      tone(659, 0.45, 'triangle', 0.2, 0.24);
    },
    doorOpen() {
      // slow scrape sliding across floor
      const t = ctx.currentTime;
      const src = ctx.createBufferSource();
      src.buffer = noiseBuffer(1.2);
      const f = ctx.createBiquadFilter();
      f.type = 'bandpass'; f.frequency.value = 800; f.Q.value = 0.4;
      f.frequency.setValueAtTime(1200, t);
      f.frequency.linearRampToValueAtTime(400, t + 1.2);
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.0001, t);
      g.gain.linearRampToValueAtTime(0.006, t + 0.2);
      g.gain.linearRampToValueAtTime(0.004, t + 0.9);
      g.gain.linearRampToValueAtTime(0.0001, t + 1.2);
      src.connect(f); f.connect(g); g.connect(master);
      src.start(t); src.stop(t + 1.3);
    },
    doorClose() {
      const t = ctx.currentTime;
      const src = ctx.createBufferSource();
      src.buffer = noiseBuffer(1.2);
      const f = ctx.createBiquadFilter();
      f.type = 'bandpass'; f.frequency.value = 400; f.Q.value = 0.4;
      f.frequency.setValueAtTime(400, t);
      f.frequency.linearRampToValueAtTime(1200, t + 1.2);
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.0001, t);
      g.gain.linearRampToValueAtTime(0.006, t + 0.2);
      g.gain.linearRampToValueAtTime(0.004, t + 0.9);
      g.gain.linearRampToValueAtTime(0.0001, t + 1.2);
      src.connect(f); f.connect(g); g.connect(master);
      src.start(t); src.stop(t + 1.3);
    },
    denied() {
      tone(180, 0.2, 'square', 0.2);
      tone(140, 0.3, 'square', 0.2, 0.18);
    },
    paper() {
      noise(0.18, 0.2, 3500, 'highpass');
    }
  };

  // ---------- footsteps (throttled) ----------
  let lastStep = 0;
  function footstep(interval) {
    if (!ensureCtx() || muted) return;
    const now = performance.now();
    if (now - lastStep < (interval || 420)) return;
    lastStep = now;
    const pitch = 250 + Math.random() * 120;
    noise(0.08, 0.22, pitch, 'lowpass');
  }

  // ---------- ambient loop ----------
  let ambientNodes = null;
  function startAmbient() {
    if (!ensureCtx() || ambientNodes) return;
    const g = ctx.createGain();
    g.gain.value = 0.0;
    g.connect(master);

    // low drone
    const o1 = ctx.createOscillator();
    o1.type = 'sine'; o1.frequency.value = 55;
    const o2 = ctx.createOscillator();
    o2.type = 'sine'; o2.frequency.value = 57.5; // slight detune for unease
    const og = ctx.createGain(); og.gain.value = 0.06;
    o1.connect(og); o2.connect(og); og.connect(g);

    o1.start(); o2.start();
    g.gain.linearRampToValueAtTime(1.0, ctx.currentTime + 3); // fade in
    ambientNodes = { g, o1, o2 };
  }

  function stopAmbient() {
    if (!ambientNodes || !ctx) return;
    const n = ambientNodes;
    ambientNodes = null;
    n.g.gain.linearRampToValueAtTime(0.0001, ctx.currentTime + 1.5);
    setTimeout(() => {
      try { n.o1.stop(); n.o2.stop(); } catch (e) {}
    }, 1700);
  }

  // ---------- public API ----------
  window.SoundSystem = {
    play(name) {
      if (!ensureCtx() || muted) return;
      const fn = sounds[name];
      if (fn) fn();
    },
    footstep,
    startAmbient,
    stopAmbient,
    setVolume(v) {
      volume = Math.max(0, Math.min(1, v));
      if (master && !muted) master.gain.value = volume;
      saveSettings();
    },
    toggleMute() {
      muted = !muted;
      if (master) master.gain.value = muted ? 0 : volume;
      saveSettings();
      return muted;
    },
    get muted() { return muted; }
  };
})();