// eleven.js
console.log("🎧 eleven.js loaded");

let lineIndex = 0;

const lines = [
  "Hi… do you like ever plan on coming back?",
  "Where’d you go, I’m waiting",
  "HELLO... PAY ATTENTION TO ME!",
  "If you ignore me I'm gonna start screaming",
  "I'm being serious, this is your last warning",
];

const ELEVEN_KEY = "sk_2e8e69a4242d82eefef33af39d0585676eb311faab0c4106";
const VOICE_ID = "dtSEyYGNJqjrtBArPCVZ";

async function speakNext() {
  const text = lines[lineIndex];
  lineIndex = (lineIndex + 1) % lines.length;

  console.log("🗣️ TTS line:", text);

  try {
    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`,
      {
        method: "POST",
        headers: {
          "xi-api-key": ELEVEN_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text,
          model_id: "eleven_multilingual_v2",
          voice_settings: {
            stability: 0.05,
            similarity_boost: 0.9,
            speed: 0.9,
            use_speaker_boost: false,
          },
        }),
      }
    );

    if (!response.ok) {
      console.error("❌ ElevenLabs response not OK:", response.status, response.statusText);
      return;
    }

    const audioData = await response.arrayBuffer();
    const blob = new Blob([audioData], { type: "audio/mpeg" });
    const url = URL.createObjectURL(blob);

    const audio = new Audio(url);
    audio.play().catch(err => console.error("❌ TTS play error:", err));
  } catch (err) {
    console.error("❌ TTS error:", err);
  }
}

// ⭐ Make it visible to idle.js
window.speakNext = speakNext;
