// Moduł audio bazujący na Web Audio API z pełnym wsparciem dla iOS Safari (w tym iPhone Silent Mode bypass)

export class WorkoutAudio {
  constructor() {
    this.ctx = null;
    this.isMuted = false;
    this.isUnlocked = false;

    // Głośność 0.0 - 9.0 (suwak w UI: 0% - 900%, domyślnie 1.0 = 100%, maks 9.0 = 900%)
    const savedVol = localStorage.getItem('surf_workout_volume');
    const parsed = savedVol !== null ? parseFloat(savedVol) : 1.0;
    this.volume = (!isNaN(parsed) && parsed >= 0 && parsed <= 9.0) ? parsed : 1.0;

    this.setupAudioSession();
  }

  // Wymuszenie kategorii 'playback' na iOS Safari (omija sprzętowy przełącznik wyciszenia / Silent Mode)
  setupAudioSession() {
    if ('audioSession' in navigator) {
      try {
        navigator.audioSession.type = 'playback';
      } catch (e) {
        console.warn('audioSession error:', e);
      }
    }
  }

  init() {
    this.setupAudioSession();

    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        this.ctx = new AudioContextClass();
      }
    }

    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  // Odblokowanie kontekstu audio na iOS przy pierwszej interakcji użytkownika
  unlock() {
    this.init();
    if (!this.ctx || this.isUnlocked) return;

    try {
      // 1. Wznowienie kontekstu
      if (this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }

      // 2. Odtworzenie bufora 1-próbkowego (wymagane przez WebKit na iOS)
      const buffer = this.ctx.createBuffer(1, 1, 22050);
      const source = this.ctx.createBufferSource();
      source.buffer = buffer;
      source.connect(this.ctx.destination);
      source.start(0);

      // 3. Cichy dźwięk HTML5 wymuszający sesję multimedialną (playback channel na iOS)
      const dummyAudio = document.createElement('audio');
      dummyAudio.setAttribute('playsinline', '');
      dummyAudio.setAttribute('x-webkit-airplay', 'deny');
      dummyAudio.src = 'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA';
      dummyAudio.play().catch(() => {});

      this.isUnlocked = true;
    } catch (e) {
      console.warn('Audio unlock warning:', e);
    }
  }

  setVolume(newVolume) {
    const val = typeof newVolume === 'number' ? newVolume : parseFloat(newVolume);
    this.volume = isNaN(val) ? 1.0 : Math.max(0, Math.min(9.0, val));
    localStorage.setItem('surf_workout_volume', this.volume.toFixed(2));
    if (this.isMuted && this.volume > 0) {
      this.isMuted = false;
    }
    return this.volume;
  }

  getVolumePercent() {
    return Math.round(this.volume * 100);
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (!this.isMuted) {
      this.init();
      this.playTick(1); // dźwiękowa informacja o włączeniu dźwięku
    }
    return this.isMuted;
  }

  // Spokojny, organiczny tik odliczania (10s do 1s)
  playTick(secondsRemaining = 10) {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const t = this.ctx.currentTime;
      const isFinal = secondsRemaining <= 3 && secondsRemaining >= 1;
      const freq = isFinal ? 620 : 480;
      const baseVol = isFinal ? 0.35 : 0.22;
      const volume = baseVol * this.volume * 2.5;
      const duration = isFinal ? 0.08 : 0.05;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1400, t);

      gain.gain.setValueAtTime(volume, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + duration);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + duration + 0.02);
    } catch (e) {
      console.warn('playTick error:', e);
    }
  }

  // Spokojny, ciepły dzwonek startu serii (akord dzwonkowy F5 + C6)
  playStart() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const t = this.ctx.currentTime;
      const mult = this.volume * 2.2;
      const notes = [
        { freq: 698.46, gain: 0.32 * mult, decay: 0.75 },
        { freq: 1046.5, gain: 0.18 * mult, decay: 0.55 }
      ];

      notes.forEach(n => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(n.freq, t);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(2200, t);

        gain.gain.setValueAtTime(n.gain, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + n.decay);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(t);
        osc.stop(t + n.decay + 0.03);
      });
    } catch (e) {
      console.warn('playStart error:', e);
    }
  }

  // Dźwięk końca serii / gong relaksacyjny (niski gong / misa tybetańska)
  playEndGong() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const t = this.ctx.currentTime;
      const mult = this.volume * 2.0;
      const partials = [
        { freq: 220, gain: 0.40 * mult, decay: 1.5 },
        { freq: 440, gain: 0.20 * mult, decay: 1.1 },
        { freq: 660, gain: 0.08 * mult, decay: 0.7 }
      ];

      partials.forEach(p => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(p.freq, t);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1100, t);

        gain.gain.setValueAtTime(p.gain, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + p.decay);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(t);
        osc.stop(t + p.decay + 0.05);
      });
    } catch (e) {
      console.warn('playEndGong error:', e);
    }
  }

  // Spokojny ton wejścia w przerwę (wyciszenie A4 440 Hz)
  playRest() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, t);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1000, t);

      gain.gain.setValueAtTime(0.25 * this.volume * 2.2, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.45);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + 0.5);
    } catch (e) {
      console.warn('playRest error:', e);
    }
  }

  // Dźwięk zakończenia czasu przerwy (dwustopniowy spokojny dzwonek D5 -> A5)
  playRestEnd() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const t = this.ctx.currentTime;
      const mult = this.volume * 2.2;
      const notes = [
        { freq: 587.33, offset: 0, decay: 0.40, gain: 0.28 * mult },
        { freq: 880.00, offset: 0.16, decay: 0.55, gain: 0.32 * mult }
      ];

      notes.forEach(n => {
        const startTime = t + n.offset;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(n.freq, startTime);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(2000, startTime);

        gain.gain.setValueAtTime(n.gain, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + n.decay);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + n.decay + 0.03);
      });
    } catch (e) {
      console.warn('playRestEnd error:', e);
    }
  }

  // Bardzo subtelne kliknięcie interfejsu
  playClick() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(320, t);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(700, t);

      gain.gain.setValueAtTime(0.12 * this.volume * 2.0, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.04);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + 0.05);
    } catch (e) {
      console.warn('playClick error:', e);
    }
  }

  // Dźwięk testowy do sprawdzenia głośności
  playTestSound() {
    this.init();
    this.playTick(1);
    setTimeout(() => {
      this.playStart();
    }, 240);
  }
}

window.workoutAudio = new WorkoutAudio();

// Globalny handler odblokowujący audio na iOS Safari przy dowolnym dotknięciu ekranu
const unlockAudioOnUserGesture = () => {
  window.workoutAudio.unlock();
};

['touchstart', 'touchend', 'pointerdown', 'mousedown', 'keydown'].forEach(evtType => {
  window.addEventListener(evtType, unlockAudioOnUserGesture, { passive: true });
});
