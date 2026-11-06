// Moduł audio bazujący na Web Audio API z pełnym wsparciem dla tła muzycznego (Spotify / Apple Music)
// oraz dynamiczną kontrolą głośności (Master GainNode)

export class WorkoutAudio {
  constructor() {
    this.ctx = null;
    this.masterGainNode = null;
    this.isMuted = localStorage.getItem('surf_workout_muted') === 'true';

    // Domyślna głośność: 0.8 (80%), zakres 0.0 - 1.0
    const savedVol = localStorage.getItem('surf_workout_volume');
    const parsed = savedVol !== null ? parseFloat(savedVol) : 0.8;
    this.volume = (!isNaN(parsed) && parsed >= 0 && parsed <= 1) ? parsed : 0.8;

    this.isUnlocked = false;
    this.setupAudioSession();
  }

  // Kategoria 'ambient' na iOS Safari / W3C Audio Session API
  // Pozwala na jednoczesne odtwarzanie dźwięków treningu wraz z muzyką w tle (np. Spotify)
  // bez przerywania, pauzowania czy wywłaszczania sesji odtwarzacza muzyki
  setupAudioSession() {
    if ('audioSession' in navigator) {
      try {
        navigator.audioSession.type = 'ambient';
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

    if (this.ctx) {
      if (!this.masterGainNode) {
        this.masterGainNode = this.ctx.createGain();
        this.applyVolume();
        this.masterGainNode.connect(this.ctx.destination);
      }

      if (this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }
    }
  }

  // Odblokowanie kontekstu audio na urządzeniach mobilnych przy geście użytkownika
  unlock() {
    this.init();
    if (!this.ctx || this.isUnlocked) return;

    try {
      if (this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }

      // Odtworzenie bufora 1-próbkowego (wymagane przez WebKit na iOS)
      const buffer = this.ctx.createBuffer(1, 1, 22050);
      const source = this.ctx.createBufferSource();
      source.buffer = buffer;
      source.connect(this.masterGainNode || this.ctx.destination);
      source.start(0);

      this.isUnlocked = true;
    } catch (e) {
      console.warn('Audio unlock warning:', e);
    }
  }

  applyVolume() {
    if (!this.masterGainNode || !this.ctx) return;
    const effectiveGain = this.isMuted ? 0 : this.volume;
    const t = this.ctx.currentTime;
    this.masterGainNode.gain.cancelScheduledValues(t);
    this.masterGainNode.gain.setValueAtTime(effectiveGain, t);
  }

  // Ustawienie głośności (wartość 0.0 - 1.0)
  setVolume(newVolume) {
    const val = typeof newVolume === 'number' ? newVolume : parseFloat(newVolume);
    const clamped = isNaN(val) ? 0.8 : Math.max(0, Math.min(1, val));
    this.volume = clamped;
    localStorage.setItem('surf_workout_volume', this.volume.toFixed(2));

    // Jeśli użytkownik zmienia głośność powyżej 0, a aplikacja była wyciszona, zdejmij wyciszenie
    if (this.isMuted && this.volume > 0) {
      this.isMuted = false;
      localStorage.setItem('surf_workout_muted', 'false');
    }

    this.init();
    this.applyVolume();
    return this.volume;
  }

  getVolumePercent() {
    return Math.round(this.volume * 100);
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    localStorage.setItem('surf_workout_muted', String(this.isMuted));
    this.init();
    this.applyVolume();
    if (!this.isMuted) {
      this.playTick(1); // dźwiękowa informacja o włączeniu dźwięku
    }
    return this.isMuted;
  }

  getDestination() {
    this.init();
    return this.masterGainNode || (this.ctx ? this.ctx.destination : null);
  }

  // Spokojny, organiczny, ale czytelny i wyrazisty tik odliczania (10s do 1s)
  // Wyrazisty atak i odpowiednia dynamika, aby dźwięk był świetnie słyszalny przez muzykę ze Spotify
  playTick(secondsRemaining = 10) {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const dest = this.getDestination();
      if (!dest) return;

      const t = this.ctx.currentTime;
      const isFinal = secondsRemaining <= 3 && secondsRemaining >= 1;
      const freq = isFinal ? 880 : 680;
      const baseGain = isFinal ? 0.85 : 0.60;
      const duration = isFinal ? 0.07 : 0.05;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(isFinal ? 3200 : 2400, t);

      gain.gain.setValueAtTime(baseGain, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + duration);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(dest);

      osc.start(t);
      osc.stop(t + duration + 0.02);
    } catch (e) {
      console.warn('playTick error:', e);
    }
  }

  // Ciepły, promienny dzwonek startu serii (akord F5 + A5 + C6)
  playStart() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const dest = this.getDestination();
      if (!dest) return;

      const t = this.ctx.currentTime;
      const notes = [
        { freq: 698.46, gain: 0.65, decay: 0.85, filterFreq: 3000 }, // F5
        { freq: 880.00, gain: 0.45, decay: 0.70, filterFreq: 3200 }, // A5
        { freq: 1046.50, gain: 0.50, decay: 0.60, filterFreq: 3500 } // C6
      ];

      notes.forEach(n => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(n.freq, t);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(n.filterFreq, t);

        gain.gain.setValueAtTime(n.gain, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + n.decay);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(dest);

        osc.start(t);
        osc.stop(t + n.decay + 0.03);
      });
    } catch (e) {
      console.warn('playStart error:', e);
    }
  }

  // Dźwięk końca serii / gong relaksacyjny (misa tybetańska z pełnym ciałem harmonicznym)
  playEndGong() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const dest = this.getDestination();
      if (!dest) return;

      const t = this.ctx.currentTime;
      const partials = [
        { freq: 220, gain: 0.70, decay: 1.8 },
        { freq: 440, gain: 0.40, decay: 1.4 },
        { freq: 660, gain: 0.20, decay: 1.0 },
        { freq: 880, gain: 0.12, decay: 0.7 }
      ];

      partials.forEach(p => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(p.freq, t);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1600, t);

        gain.gain.setValueAtTime(p.gain, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + p.decay);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(dest);

        osc.start(t);
        osc.stop(t + p.decay + 0.05);
      });
    } catch (e) {
      console.warn('playEndGong error:', e);
    }
  }

  // Spokojny ton wejścia w przerwę (łagodny dwuton C5 -> A4)
  playRest() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const dest = this.getDestination();
      if (!dest) return;

      const t = this.ctx.currentTime;
      const notes = [
        { freq: 523.25, offset: 0, decay: 0.45, gain: 0.50 },
        { freq: 440.00, offset: 0.12, decay: 0.60, gain: 0.55 }
      ];

      notes.forEach(n => {
        const startTime = t + n.offset;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(n.freq, startTime);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1400, startTime);

        gain.gain.setValueAtTime(n.gain, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + n.decay);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(dest);

        osc.start(startTime);
        osc.stop(startTime + n.decay + 0.03);
      });
    } catch (e) {
      console.warn('playRest error:', e);
    }
  }

  // Dźwięk zakończenia czasu przerwy (dwustopniowy dzwonek D5 -> A5)
  playRestEnd() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const dest = this.getDestination();
      if (!dest) return;

      const t = this.ctx.currentTime;
      const notes = [
        { freq: 587.33, offset: 0, decay: 0.40, gain: 0.60 },
        { freq: 880.00, offset: 0.15, decay: 0.65, gain: 0.70 }
      ];

      notes.forEach(n => {
        const startTime = t + n.offset;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(n.freq, startTime);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(2400, startTime);

        gain.gain.setValueAtTime(n.gain, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + n.decay);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(dest);

        osc.start(startTime);
        osc.stop(startTime + n.decay + 0.03);
      });
    } catch (e) {
      console.warn('playRestEnd error:', e);
    }
  }

  // Subtelne kliknięcie interfejsu
  playClick() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const dest = this.getDestination();
      if (!dest) return;

      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(360, t);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(900, t);

      gain.gain.setValueAtTime(0.25, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.04);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(dest);

      osc.start(t);
      osc.stop(t + 0.05);
    } catch (e) {
      console.warn('playClick error:', e);
    }
  }

  // Dźwięk testowy dla użytkownika do szybkiego sprawdzenia głośności
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
