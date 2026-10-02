// Web Audio API & HTML5 Audio based High-Definition Restaurant Order Alert Synthesizer
// Produces a realistic culinary bell "ting" alert that repeats continuously until acknowledged.
// Uses an HTML5 Audio looping blob to guarantee uninterrupted playback even in background/switched tabs.

function createTingAudioBlobUrl(): string {
  const sampleRate = 22050;
  const duration = 2.4; // 2.4s cycle
  const totalSamples = Math.floor(sampleRate * duration);
  const buffer = new Int16Array(totalSamples);

  const freq1 = 1174.66; // D6 bright bell
  const freq2 = 2380.0; // Harmonic sparkle
  const decay = 3.6;

  for (let i = 0; i < totalSamples; i++) {
    const t = i / sampleRate;
    let sample = 0;
    if (t < 1.4) {
      const env = Math.exp(-t * decay);
      const tone1 = Math.sin(2 * Math.PI * freq1 * t);
      const tone2 = 0.35 * Math.sin(2 * Math.PI * freq2 * t);
      sample = (tone1 + tone2) * env;
    }
    buffer[i] = Math.max(-32767, Math.min(32767, Math.floor(sample * 30000)));
  }

  // Create WAV header
  const dataSize = totalSamples * 2;
  const header = new ArrayBuffer(44);
  const view = new DataView(header);

  function writeString(offset: number, string: string) {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  }

  writeString(0, 'RIFF');
  view.setUint32(4, 36 + dataSize, true);
  writeString(8, 'WAVE');
  writeString(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true); // PCM
  view.setUint16(22, 1, true); // Mono
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true); // 16-bit mono
  view.setUint16(34, 16, true);
  writeString(36, 'data');
  view.setUint32(40, dataSize, true);

  const fullBytes = new Uint8Array(44 + dataSize);
  fullBytes.set(new Uint8Array(header), 0);
  fullBytes.set(new Uint8Array(buffer.buffer), 44);

  const blob = new Blob([fullBytes], { type: 'audio/wav' });
  return URL.createObjectURL(blob);
}

class SoundManager {
  private audioCtx: AudioContext | null = null;
  private loopAudio: HTMLAudioElement | null = null;
  private isSoundEnabled = true; // ON by default
  private isLooping = false;
  private isUnlocked = false;

  constructor() {
    // Check saved preference; default to true
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('swaad_sound_enabled');
      if (saved !== null) {
        this.isSoundEnabled = saved !== 'false';
      } else {
        this.isSoundEnabled = true;
      }

      // Auto-unlock audio on first user gesture anywhere
      const unlock = () => {
        this.unlockAudio();
        window.removeEventListener('click', unlock);
        window.removeEventListener('keydown', unlock);
        window.removeEventListener('touchstart', unlock);
        window.removeEventListener('pointerdown', unlock);
      };
      window.addEventListener('click', unlock, { passive: true });
      window.addEventListener('keydown', unlock, { passive: true });
      window.addEventListener('touchstart', unlock, { passive: true });
      window.addEventListener('pointerdown', unlock, { passive: true });
    }
  }

  private unlockAudio(): void {
    if (this.isUnlocked) return;
    this.isUnlocked = true;
    try {
      const ctx = this.getContext();
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
    } catch {}

    // Pre-initialize loop audio element
    this.initLoopAudio();

    // If a loop was requested before gesture, start it now
    if (this.isLooping && this.isSoundEnabled) {
      this.playLoopAudio();
    }
  }

  private getContext(): AudioContext {
    if (!this.audioCtx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.audioCtx = new AudioCtx();
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    return this.audioCtx;
  }

  private initLoopAudio(): void {
    if (!this.loopAudio && typeof window !== 'undefined') {
      try {
        const audioUrl = createTingAudioBlobUrl();
        this.loopAudio = new Audio(audioUrl);
        this.loopAudio.loop = true;
        this.loopAudio.volume = 0.85;
      } catch (e) {
        console.warn('Failed to init loop audio:', e);
      }
    }
  }

  private playLoopAudio(): void {
    this.initLoopAudio();
    if (this.loopAudio) {
      this.loopAudio.currentTime = 0;
      this.loopAudio.play().catch(e => {
        // Fallback to Web Audio if HTML5 audio play fails
        console.warn('HTML5 Audio play failed, using Web Audio fallback:', e);
      });
    }
  }

  public enableAudio(): boolean {
    this.isSoundEnabled = true;
    localStorage.setItem('swaad_sound_enabled', 'true');
    this.unlockAudio();
    this.playTing(880, 0.15);
    if (this.isLooping) {
      this.playLoopAudio();
    }
    return true;
  }

  public disableAudio(): void {
    this.isSoundEnabled = false;
    localStorage.setItem('swaad_sound_enabled', 'false');
    this.stopPendingLoop();
  }

  public isEnabled(): boolean {
    return this.isSoundEnabled;
  }

  // Synthesize a single crisp culinary bell "ting"
  public playTing(frequency = 1174.66, volume = 0.35): void {
    if (!this.isSoundEnabled) return;
    try {
      const ctx = this.getContext();
      const now = ctx.currentTime;

      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(frequency, now);

      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(frequency * 2.02, now);

      gain1.gain.setValueAtTime(volume, now);
      gain1.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);

      gain2.gain.setValueAtTime(volume * 0.4, now);
      gain2.gain.exponentialRampToValueAtTime(0.0001, now + 0.8);

      osc1.connect(gain1);
      gain1.connect(ctx.destination);

      osc2.connect(gain2);
      gain2.connect(ctx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 1.2);
      osc2.stop(now + 0.8);
    } catch (err) {
      console.warn('Could not play Web Audio sound:', err);
    }
  }

  // Start continuous repeating "ting" alert loop
  // HTML5 audio loop ensures it rings continuously even when the tab is switched or minimized!
  public startPendingLoop(): void {
    if (this.isLooping) return;
    this.isLooping = true;

    if (!this.isSoundEnabled) return;

    this.playLoopAudio();
    // Also play an immediate ting chime
    this.playTing(1174.66, 0.4);
  }

  // Stop the alert loop once manager accepts or rejects all orders
  public stopPendingLoop(): void {
    this.isLooping = false;
    if (this.loopAudio) {
      try {
        this.loopAudio.pause();
        this.loopAudio.currentTime = 0;
      } catch {}
    }
  }
}

export const soundManager = new SoundManager();
