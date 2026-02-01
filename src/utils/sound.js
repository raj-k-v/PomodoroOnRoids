let audioCtx;
let masterGain;

let brownSource = null;
let brownGain = null;

let volume = Number(localStorage.getItem("volume") ?? 0.35);

/* ===============================
   CORE AUDIO
   =============================== */
function getCtx() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();

    masterGain = audioCtx.createGain();
    masterGain.gain.value = volume;
    masterGain.connect(audioCtx.destination);
  }
  return audioCtx;
}

/* ===============================
   VOLUME
   =============================== */
export function setVolume(v) {
  volume = v;
  localStorage.setItem("volume", v);

  if (masterGain) {
    masterGain.gain.setTargetAtTime(
      v,
      getCtx().currentTime,
      0.05
    );
  }

  if (brownGain) {
    brownGain.gain.setTargetAtTime(
      v * 0.35,
      getCtx().currentTime,
      0.2
    );
  }
}

export function getVolume() {
  return volume;
}

/* ===============================
   CLICK (BASSY + HAPTIC)
   =============================== */
export function playClick() {
  const ctx = getCtx();
  const now = ctx.currentTime;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = "sine";
  osc.frequency.setValueAtTime(80, now);
  osc.frequency.exponentialRampToValueAtTime(50, now + 0.03);

  gain.gain.setValueAtTime(volume * 0.35, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

  osc.connect(gain).connect(masterGain);
  osc.start(now);
  osc.stop(now + 0.06);

  const buffer = ctx.createBuffer(1, ctx.sampleRate * 0.02, ctx.sampleRate);
  const data = buffer.getChannelData(0);

  for (let i = 0; i < data.length; i++) {
    data[i] = (Math.random() * 2 - 1) * (1 - i / data.length);
  }

  const noise = ctx.createBufferSource();
  noise.buffer = buffer;

  const noiseGain = ctx.createGain();
  noiseGain.gain.setValueAtTime(volume * 0.18, now);
  noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

  const filter = ctx.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = 600;

  noise.connect(filter).connect(noiseGain).connect(masterGain);
  noise.start(now);
  noise.stop(now + 0.05);
}

/* ===============================
   COMPLETION
   =============================== */
export function playComplete() {
  const ctx = getCtx();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = "sine";
  osc.frequency.setValueAtTime(880, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(
    1320,
    ctx.currentTime + 0.25
  );

  gain.gain.setValueAtTime(volume * 0.25, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(
    0.001,
    ctx.currentTime + 0.35
  );

  osc.connect(gain).connect(masterGain);
  osc.start();
  osc.stop(ctx.currentTime + 0.35);
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

  let lastOut = 0.0;
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
  brownGain.gain.setValueAtTime(
    volume * 0.35,
    ctx.currentTime
  );

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
