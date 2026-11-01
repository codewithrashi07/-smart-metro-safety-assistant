// Web Audio API Synthesizer for Authentic Delhi Metro Chimes and Safety Sirens

class MetroAudioService {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    return this.isMuted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  // Authentic Delhi Metro 3-Tone Door Chime
  public playDoorChime() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      // Notes: G4, B4, D5 (chime chord)
      const freqs = [392.00, 493.88, 587.33];

      freqs.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.16);

        gain.gain.setValueAtTime(0, now + idx * 0.16);
        gain.gain.linearRampToValueAtTime(0.25, now + idx * 0.16 + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.16 + 0.6);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(now + idx * 0.16);
        osc.stop(now + idx * 0.16 + 0.65);
      });
    } catch {
      // Audio autoplay policy fallback
    }
  }

  // DMRC Door Closing Warning Pulsing Beep
  public playDoorClosingBeep() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const beeps = 3;

      for (let i = 0; i < beeps; i++) {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'square';
        osc.frequency.setValueAtTime(960, now + i * 0.22);

        gain.gain.setValueAtTime(0, now + i * 0.22);
        gain.gain.linearRampToValueAtTime(0.2, now + i * 0.22 + 0.02);
        gain.gain.setValueAtTime(0.2, now + i * 0.22 + 0.12);
        gain.gain.linearRampToValueAtTime(0.001, now + i * 0.22 + 0.14);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + i * 0.22);
        osc.stop(now + i * 0.22 + 0.15);
      }
    } catch {
      // Ignore
    }
  }

  // SIL-4 Emergency Brake (EB) / Track Intrusion Siren
  public playEmergencySiren() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      
      // Siren wobble between 750Hz and 1300Hz
      for (let step = 0; step < 4; step++) {
        const t = now + step * 0.35;
        osc.frequency.setValueAtTime(750, t);
        osc.frequency.linearRampToValueAtTime(1300, t + 0.17);
        osc.frequency.linearRampToValueAtTime(750, t + 0.35);
      }

      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 1.4);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 1.45);
    } catch {
      // Ignore
    }
  }

  // Click / Button Feedback Sound
  public playKeyClick() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, now);
      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.06);
    } catch {
      // Ignore
    }
  }

  // Speech Announcement using Web Speech API
  public speakAnnouncement(text: string, lang: 'en-IN' | 'hi-IN' = 'en-IN') {
    if (this.isMuted || typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel(); // Stop prior
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      utterance.rate = 0.95; // Slightly slower, calm professional transit announcer cadence
      utterance.pitch = 1.0;
      utterance.volume = 0.8;
      window.speechSynthesis.speak(utterance);
    } catch {
      // Fallback
    }
  }
}

export const metroAudio = new MetroAudioService();
