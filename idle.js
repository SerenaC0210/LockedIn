console.log("🔥 idleHandler.js loaded");

// STATE
let isIdle = false;
let idleTimeout = null;
let ttsInterval = null;
let loop = 0;

const IDLE_TIME = 5 * 1000; // 5 seconds

/* ---------------------------------------
    🎵 BACKGROUND MUSIC
--------------------------------------- */

const bgMusic = new Audio(chrome.runtime.getURL("musicFun.mp3"));
bgMusic.loop = true;
bgMusic.volume = 0.6;

const screamAudio = new Audio(chrome.runtime.getURL("scream.mp3"));
screamAudio.volume = 1.0;

let audioUnlocked = false;

window.addEventListener("click", () => {
  if (!audioUnlocked) {
    bgMusic.play().then(() => {
      bgMusic.pause();
      bgMusic.currentTime = 0;
      audioUnlocked = true;
      console.log("🔓 Audio unlocked");
    });
  }
});

/* ---------------------------------------
    🔁 TTS LOOP + SCREAM
--------------------------------------- */

function startTtsLoop() {
  if (ttsInterval) return;

  loop = 0;
  console.log("🔁 Starting TTS loop...");

  ttsInterval = setInterval(() => {
    if (!isIdle) return;

    if (loop < 5) {
      if (window.speakNext) window.speakNext();
      loop++;
      return;
    }

    if (loop === 5) {
      screamAudio.currentTime = 0;
      screamAudio.play();
      loop++;
      stopTtsLoop();
    }
  }, 5000);
}

function stopTtsLoop() {
  clearInterval(ttsInterval);
  ttsInterval = null;
}

/* ---------------------------------------
    ⏰ IDLE DETECTION
--------------------------------------- */

function resetIdleTimer() {
  if (idleTimeout) clearTimeout(idleTimeout);

  if (isIdle) {
    isIdle = false;
    bgMusic.pause();
    bgMusic.currentTime = 0;
    stopTtsLoop();
  }

  idleTimeout = setTimeout(() => {
    isIdle = true;

    if (audioUnlocked) bgMusic.play();

    startTtsLoop();

  }, IDLE_TIME);
}

// Track activity
["mousemove", "keydown", "click", "scroll"].forEach(evt => {
  window.addEventListener(evt, resetIdleTimer);
});

resetIdleTimer();
