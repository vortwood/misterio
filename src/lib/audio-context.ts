// Singleton AudioContext for the entire app
// This ensures the same context is used everywhere and is properly unlocked on user interaction

let audioContext: AudioContext | null = null;
let isUnlocked = false;

export function getAudioContext(): AudioContext {
  if (!audioContext) {
    audioContext = new AudioContext();
  }
  return audioContext;
}

export async function unlockAudio(): Promise<void> {
  if (isUnlocked) return;

  const ctx = getAudioContext();

  // Resume if suspended
  if (ctx.state === "suspended") {
    await ctx.resume();
  }

  // iOS requires playing a silent buffer to fully unlock
  const buffer = ctx.createBuffer(1, 1, ctx.sampleRate);
  const source = ctx.createBufferSource();
  source.buffer = buffer;
  source.connect(ctx.destination);
  source.start(0);

  isUnlocked = true;
}

export function isAudioUnlocked(): boolean {
  return isUnlocked;
}
