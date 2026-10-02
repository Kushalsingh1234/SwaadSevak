// Web Audio API based High-Definition Restaurant Order Alert Synthesizer
// Produces a realistic, warm culinary bell "ting" alert that repeats until acknowledged.

class SoundManager {
  private audioCtx: AudioContext | null = null;
  private repeatTimer: any = null;
  private isSoundEnabled = false;
  private isLooping = false;

  constructor() {
    // Lazy initialize on first user interaction
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

  public enableAudio(): boolean {
    try {
      const ctx = this.getContext();
      this.isSoundEnabled = true;
      // Play a quick soft confirmation chime
      this.playTing(880, 0.15);
      return true;
    } catch (e) {
      console.warn('Audio activation failed:', e);
      return false;
    }
  }

  public isEnabled(): boolean {
    return this.isSoundEnabled;
  }

  // Synthesize a pleasant brass restaurant order bell "ting"
  public playTing(frequency = 1046.5, volume = 0.25): void {
    if (!this.isSoundEnabled) return;
    try {
      const ctx = this.getContext();
      const now = ctx.currentTime;

      // Primary tone
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(frequency, now); // C6

      // Harmonic chime
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(frequency * 2.02, now); // Harmonic overtone

      // Gain envelope
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
      console.warn('Could not play sound:', err);
    }
  }

  // Start looping the alert sound while orders are pending
  public startPendingLoop(): void {
    if (this.isLooping) return;
    this.isLooping = true;
    this.playTing(1174.66, 0.3); // High D6 ding

    this.repeatTimer = setInterval(() => {
      this.playTing(1174.66, 0.3);
    }, 2800); // repeats every 2.8s
  }

  // Stop the alert loop once manager accepts or rejects
  public stopPendingLoop(): void {
    this.isLooping = false;
    if (this.repeatTimer) {
      clearInterval(this.repeatTimer);
      this.repeatTimer = null;
    }
  }
}

export const soundManager = new SoundManager();
