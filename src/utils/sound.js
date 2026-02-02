let audioCtx;
let masterGain;
let uiGain;

let brownSource = null;
let brownGain = null;

/* ===============================
   STATE
   =============================== */
let volume = Number(localStorage.getItem("volume") ?? 0.6);
let uiVolume = Number(localStorage.getItem("uiVolume") ?? 0.6);
let brownVolume = Number(localStorage.getItem("brownVolume") ?? 0.35);
let muted = false;

/* ===============================
   CORE AUDIO
   =============================== */
function getCtx() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();

    masterGain = audioCtx.createGain();
    masterGain.gain.value = volume;

    uiGain = audioCtx.createGain();
    uiGain.gain.value = uiVolume;

    uiGain.connect(masterGain);
    masterGain.connect(audioCtx.destination);
  }
  return audioCtx;
}

/* ===============================
   MASTER VOLUME
   =============================== */
export function setVolume(v) {
  volume = v;
  localStorage.setItem("volume", v);

  if (!masterGain) return;

  masterGain.gain.setTargetAtTime(
    muted ? 0 : v,
    getCtx().currentTime,
    0.08
  );
}

export function getVolume() {
  return volume;
}

/* ===============================
   UI VOLUME
   =============================== */
export function setUIVolume(v) {
  uiVolume = v;
  localStorage.setItem("uiVolume", v);

  if (uiGain) {
    uiGain.gain.setTargetAtTime(
      v,
      getCtx().currentTime,
      0.05
    );
  }
}

/* ===============================
   BROWN NOISE VOLUME
   =============================== */
export function setBrownVolume(v) {
  brownVolume = v;
  localStorage.setItem("brownVolume", v);

  if (brownGain) {
    brownGain.gain.setTargetAtTime(
      v,
      getCtx().currentTime,
      0.2
    );
  }
}

/* ===============================
   MUTE
   =============================== */
export function toggleMute() {
  muted = !muted;

  if (!masterGain) return;

  masterGain.gain.setTargetAtTime(
    muted ? 0 : volume,
    getCtx().currentTime,
    0.1
  );
}

export function isMuted() {
  return muted;
}

/* ===============================
   CLICK
   =============================== */
export function playClick() {
  if (muted) return;

  const ctx = getCtx();
  const now = ctx.currentTime;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = "sine";
  osc.frequency.setValueAtTime(80, now);
  osc.frequency.exponentialRampToValueAtTime(50, now + 0.03);

  gain.gain.setValueAtTime(uiVolume * 0.35, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

  osc.connect(gain).connect(uiGain);
  osc.start(now);
  osc.stop(now + 0.06);
}

/* ===============================
   ✅ COMPLETION CHIME (SUBTLE)
   =============================== */
export function playComplete() {
  if (muted) return;

  const ctx = getCtx();
  const now = ctx.currentTime;

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(
    uiVolume * 0.12,
    now + 0.05
  );
  gain.gain.exponentialRampToValueAtTime(
    0.0001,
    now + 0.9
  );

  // soft bell tones
  const freqs = [523.25, 783.99]; // C5 + G5

  freqs.forEach((f, i) => {
    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.setValueAtTime(f, now);

    osc.connect(gain);
    osc.start(now + i * 0.03);
    osc.stop(now + 1);
  });

  gain.connect(uiGain);
}

/* ===============================
   BROWN NOISE
   =============================== */
export function startBrownNoise() {
  if (brownSource) return;

  const ctx = getCtx();
  const bufferSize = 2 * ctx.sampleRate;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const output = buffer.getChannelData(0);

  let lastOut = 0;
  for (let i = 0; i < bufferSize; i++) {
    const white = Math.random() * 2 - 1;
    output[i] = (lastOut + 0.02 * white) / 1.02;
    lastOut = output[i];
    output[i] *= 3.5;
  }

  brownSource = ctx.createBufferSource();
  brownSource.buffer = buffer;
  brownSource.loop = true;

  brownGain = ctx.createGain();
  brownGain.gain.value = brownVolume;

  brownSource.connect(brownGain).connect(masterGain);
  brownSource.start();
}

export function stopBrownNoise() {
  if (!brownSource) return;

  brownGain.gain.linearRampToValueAtTime(
    0,
    getCtx().currentTime + 0.4
  );

  setTimeout(() => {
    brownSource?.stop();
    brownSource = null;
    brownGain = null;
  }, 500);
}

/* ===============================
   UNLOCK AUDIO
   =============================== */
document.addEventListener(
  "click",
  () => getCtx(),
  { once: true }
);
