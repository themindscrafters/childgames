export class AudioManager {
  private static instance: AudioManager;
  private soundEnabled = true;
  private narrationEnabled = true;
  private synth: SpeechSynthesis | null = null;

  private constructor() {
    if (typeof window !== 'undefined') {
      this.synth = window.speechSynthesis;
    }
  }

  static getInstance(): AudioManager {
    if (!AudioManager.instance) {
      AudioManager.instance = new AudioManager();
    }
    return AudioManager.instance;
  }

  setSoundEnabled(enabled: boolean) {
    this.soundEnabled = enabled;
  }

  setNarrationEnabled(enabled: boolean) {
    this.narrationEnabled = enabled;
  }

  speak(text: string, rate = 0.85): Promise<void> {
    return new Promise((resolve) => {
      if (!this.narrationEnabled || !this.synth) {
        resolve();
        return;
      }
      this.synth.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'pt-BR';
      utterance.rate = rate;
      utterance.pitch = 1.1;
      utterance.volume = 1;

      const voices = this.synth.getVoices();
      const ptVoice = voices.find(
        (v) => v.lang.startsWith('pt') && v.name.toLowerCase().includes('female')
      ) || voices.find((v) => v.lang.startsWith('pt'));
      if (ptVoice) {
        utterance.voice = ptVoice;
      }

      utterance.onend = () => resolve();
      utterance.onerror = () => resolve();
      this.synth.speak(utterance);
    });
  }

  playTone(frequency: number, duration: number, type: OscillatorType = 'sine'): void {
    if (!this.soundEnabled) return;
    try {
      const ctx = new AudioContext();
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      oscillator.type = type;
      oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);
      gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration / 1000);
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);
      oscillator.start();
      oscillator.stop(ctx.currentTime + duration / 1000);
    } catch {
      // Audio not supported
    }
  }

  playCorrect(): void {
    this.playTone(523, 150);
    setTimeout(() => this.playTone(659, 150), 150);
    setTimeout(() => this.playTone(784, 200), 300);
  }

  playWrong(): void {
    this.playTone(200, 300, 'square');
  }

  playClick(): void {
    this.playTone(440, 80);
  }

  playSuccess(): void {
    const notes = [523, 587, 659, 784, 880];
    notes.forEach((freq, i) => {
      setTimeout(() => this.playTone(freq, 200), i * 120);
    });
  }

  playSelect(): void {
    this.playTone(660, 100);
  }
}

export const audioManager = AudioManager.getInstance();
