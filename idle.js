console.log("🔥 idleHandler.js loaded");

// STATE
let isIdle = false;
let idleTimeout = null;
let ttsInterval = null;
let loop = 0;

const IDLE_TIME = 5 * 1000; // 5 seconds


/* ---------------------------------------
    🎵 BACKGROUND MUSIC SETUP (FIXED)
--------------------------------------- */

const bgMusic = new Audio(chrome.runtime.getURL("musicFun.mp3"));
bgMusic.loop = true;
bgMusic.volume = 0.6;

const screamAudio = new Audio(chrome.runtime.getURL("scream.mp3"));
screamAudio.volume = 1.0;

let audioUnlocked = false;

// Unlock audio AFTER user interacts (Chrome policy)
window.addEventListener("click", () => {
  if (!audioUnlocked) {
    console.log("🔓 Unlocking audio...");
    bgMusic.play().then(() => {
      bgMusic.pause();
      bgMusic.currentTime = 0;
      audioUnlocked = true;
      console.log("🔓 Audio unlocked for bg + scream");
    });
  }
});


/* ---------------------------------------
    🔁 TTS LOOPING + SCREAM
--------------------------------------- */

function startTtsLoop() {
  if (ttsInterval) return;

  console.log("🔁 Starting TTS loop...");
  loop = 0;  // reset per idle session

  ttsInterval = setInterval(() => {
    if (!isIdle) return;

    if (loop < 5) {
      speakNext();
      loop++;
      return;
    }

    if (loop === 5) {
      console.log("😱 Playing scream!");
      screamAudio.currentTime = 0;
      screamAudio.play().catch(err => console.error("❌ Scream error:", err));

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
    console.log("🚶 User became active");
    isIdle = false;

    bgMusic.pause();
    bgMusic.currentTime = 0;

    stopTtsLoop();
  }

  idleTimeout = setTimeout(() => {
    console.log("😴 User idle for 5 seconds");
    isIdle = true;

    // Start background music (this finally works)
    if (audioUnlocked) {
      console.log("🎶 Starting background music");
      bgMusic.play().catch(err => console.error("❌ Music error:", err));
    }

    startTtsLoop();
  }, IDLE_TIME);
}


// Reset idle timer when user interacts
["mousemove", "keydown", "click", "scroll"].forEach(evt => {
  window.addEventListener(evt, resetIdleTimer);
});

// Kick off initial timer
resetIdleTimer();
