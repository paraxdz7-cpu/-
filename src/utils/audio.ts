/**
 * Web Audio and Speech Synthesis utilities for Osama Remote Control
 */

let audioCtx: AudioContext | null = null;

function getAudioContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

/**
 * Speaks the premium Arabic welcome greeting using browser Speech Synthesis.
 */
export function speakWelcomeArabic() {
  if (!('speechSynthesis' in window)) return;

  // Cancel any active speech
  window.speechSynthesis.cancel();

  const text = "مرحبًا بك في تطبيق ريموت أسامة للتحكم عن بعد";
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'ar-SA';
  
  // Try to find an Arabic voice
  const voices = window.speechSynthesis.getVoices();
  const arabicVoice = voices.find(v => v.lang.startsWith('ar'));
  if (arabicVoice) {
    utterance.voice = arabicVoice;
  }
  
  utterance.rate = 0.95; // Slightly slower, premium pace
  utterance.pitch = 1.05; // Slightly warmer/friendly pitch
  
  window.speechSynthesis.speak(utterance);
}

/**
 * Synthesizes a clean physical haptic click sound
 */
export function playClickSound() {
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    // Very short, snappy click
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1000, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.04);
    
    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.04);
    
    osc.start();
    osc.stop(ctx.currentTime + 0.05);
  } catch (e) {
    // Fail silently if audio context blocked or unsupported
  }
}

/**
 * Synthesizes a friendly double beep for successful pairing / connecting
 */
export function playSuccessSound() {
  try {
    const ctx = getAudioContext();
    
    // First note
    const playNote = (freq: number, start: number, duration: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.setValueAtTime(freq, start);
      gain.gain.setValueAtTime(0.15, start);
      gain.gain.exponentialRampToValueAtTime(0.01, start + duration);
      osc.start(start);
      osc.stop(start + duration);
    };

    const now = ctx.currentTime;
    playNote(523.25, now, 0.12);       // C5
    playNote(659.25, now + 0.1, 0.12);  // E5
    playNote(783.99, now + 0.2, 0.25);  // G5
  } catch (e) {
    // Fail silently
  }
}

/**
 * Synthesizes a low error buzzer sound
 */
export function playErrorSound() {
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(150, ctx.currentTime);
    osc.frequency.setValueAtTime(130, ctx.currentTime + 0.1);
    
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.3);
    
    osc.start();
    osc.stop(ctx.currentTime + 0.3);
  } catch (e) {
    // Fail silently
  }
}
