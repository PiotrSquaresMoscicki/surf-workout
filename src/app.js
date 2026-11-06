// Główna logika aplikacji treningowej Surf Workout

export class SurfWorkoutApp {
  constructor(sessionsConfig) {
    // Wsparcie dla wielu sesji treningowych (Sesja A, B, C)
    this.sessions = Array.isArray(sessionsConfig) ? sessionsConfig : (sessionsConfig.exercises ? [sessionsConfig] : []);
    
    // Pobierz zapisaną sesję z localStorage lub domyślnie pierwszą (Sesja A)
    const savedSessionId = localStorage.getItem('surf_workout_session_id');
    const savedIdx = this.sessions.findIndex(s => s.id === savedSessionId);
    this.currentSessionIndex = savedIdx >= 0 ? savedIdx : 0;
    
    this.applyCurrentSession();

    // Stan bieżący
    this.currentExIndex = 0;
    this.currentSetIndex = 0;
    this.phase = 'READY'; // 'READY' | 'WORK' | 'REST' | 'COMPLETE'
    this.isPaused = false;

    // Timery
    this.timeRemaining = 0;
    this.repsElapsedSeconds = 0;
    this.restDuration = 0;
    this.totalSeconds = 0;
    this.timerInterval = null;
    this.totalTimerInterval = null;
    this.hasWorkoutStarted = false;

    // WakeLock (obsługiwany automatycznie w tle)
    this.wakeLock = null;

    // Cache elementów DOM
    this.dom = {
      headerProgressText: document.getElementById('header-progress-text'),
      totalTimeDisplay: document.getElementById('total-time-display'),
      sessionTag: document.getElementById('session-tag'),
      sessionDescText: document.getElementById('session-desc-text'),
      categoryBadge: document.getElementById('category-badge'),
      equipmentBadge: document.getElementById('equipment-badge'),
      exerciseName: document.getElementById('exercise-name'),
      setsCounterText: document.getElementById('sets-counter-text'),
      setsDots: document.getElementById('sets-dots'),
      displayCard: document.getElementById('display-card'),
      phaseBanner: document.getElementById('phase-banner'),
      mainDigits: document.getElementById('main-digits'),
      secondaryDigits: document.getElementById('secondary-digits'),
      phaseProgressBar: document.getElementById('phase-progress-bar'),
      nextExerciseCard: document.getElementById('next-exercise-card'),
      nextExerciseName: document.getElementById('next-exercise-name'),
      nextExerciseMeta: document.getElementById('next-exercise-meta'),
      cueText: document.getElementById('cue-text'),
      cuePoints: document.getElementById('cue-points'),
      mainView: document.getElementById('main-view'),
      completeView: document.getElementById('complete-view'),
      completeSessionSubtitle: document.getElementById('complete-session-subtitle'),
      finalTotalTime: document.getElementById('final-total-time'),
      finalTotalSets: document.getElementById('final-total-sets'),
      btnMainAction: document.getElementById('btn-main-action'),
      btnMainText: document.getElementById('btn-main-text'),
      btnMainIcon: document.getElementById('btn-main-icon'),
      btnPrevSet: document.getElementById('btn-prev-set'),
      btnPauseToggle: document.getElementById('btn-pause-toggle'),
      pauseBtnText: document.getElementById('pause-btn-text'),
      iconPause: document.getElementById('icon-pause'),
      iconResume: document.getElementById('icon-resume'),
      btnResetSet: document.getElementById('btn-reset-set'),
      btnSkipSet: document.getElementById('btn-skip-set'),
      btnSound: document.getElementById('btn-sound'),
      iconSoundOn: document.getElementById('icon-sound-on'),
      iconSoundOff: document.getElementById('icon-sound-off'),
      btnVolumeToggle: document.getElementById('btn-volume-toggle'),
      topVolumeVal: document.getElementById('top-volume-val'),
      quickVolumePopover: document.getElementById('quick-volume-popover'),
      quickVolumeVal: document.getElementById('quick-volume-val'),
      quickVolumeSlider: document.getElementById('quick-volume-slider'),
      drawerVolumeBadge: document.getElementById('drawer-volume-badge'),
      drawerVolumeSlider: document.getElementById('drawer-volume-slider'),
      btnDrawerTestSound: document.getElementById('btn-drawer-test-sound'),
      btnOpenList: document.getElementById('btn-open-list'),
      btnCloseDrawer: document.getElementById('btn-close-drawer'),
      drawerBackdrop: document.getElementById('drawer-backdrop'),
      exercisesDrawer: document.getElementById('exercises-drawer'),
      drawerSessionList: document.getElementById('drawer-session-list'),
      drawerTotalSessionsBadge: document.getElementById('drawer-total-sessions-badge'),
      drawerSessionExCount: document.getElementById('drawer-session-ex-count'),
      drawerExerciseList: document.getElementById('drawer-exercise-list'),
      btnRestartWorkout: document.getElementById('btn-restart-workout'),
      appVersion: document.getElementById('app-version')
    };

    this.init();
  }

  applyCurrentSession() {
    this.session = this.sessions[this.currentSessionIndex] || this.sessions[0];
    this.exercises = this.session.exercises || [];
  }

  init() {
    this.updateAppVersion();
    this.bindEvents();
    this.updateSessionHeader();
    this.renderDrawerSessions();
    this.renderDrawerExercises();
    this.loadExercise(0, 0);
    this.requestWakeLock();
    this.updateVolumeUI();
  }

  updateAppVersion() {
    const version = typeof __APP_VERSION__ !== 'undefined' ? __APP_VERSION__ : (this.dom.appVersion?.textContent || 'v1.0.1');
    window.APP_VERSION = version;
    if (this.dom.appVersion) {
      this.dom.appVersion.textContent = version;
    }
  }

  // Przełączanie sesji treningowej (wybierane z menu hamburgera / drawer)
  switchSession(sessionId) {
    const idx = this.sessions.findIndex(s => s.id === sessionId);
    if (idx === -1) return;

    this.currentSessionIndex = idx;
    localStorage.setItem('surf_workout_session_id', sessionId);
    this.applyCurrentSession();

    // Reset stanu treningu przy zmianie sesji
    this.stopTimer();
    if (this.totalTimerInterval) {
      clearInterval(this.totalTimerInterval);
      this.totalTimerInterval = null;
    }
    this.hasWorkoutStarted = false;
    this.totalSeconds = 0;
    this.dom.totalTimeDisplay.textContent = '00:00';

    this.dom.completeView.classList.add('hidden');
    this.dom.mainView.classList.remove('hidden');

    this.updateSessionHeader();
    this.renderDrawerSessions();
    this.renderDrawerExercises();
    this.loadExercise(0, 0);
  }

  updateSessionHeader() {
    if (!this.session) return;

    if (this.dom.sessionTag) {
      this.dom.sessionTag.textContent = this.session.name.toUpperCase();
    }
    if (this.dom.sessionDescText) {
      this.dom.sessionDescText.textContent = this.session.description || this.session.title;
    }
    if (this.dom.completeSessionSubtitle) {
      this.dom.completeSessionSubtitle.textContent = `${this.session.title} ukończony zgodnie z planem.`;
    }
  }

  // Obsługa zdarzeń UI
  bindEvents() {
    this.dom.btnMainAction.addEventListener('click', () => {
      window.workoutAudio.unlock();
      this.requestWakeLock();
      this.handleMainAction();
    });

    this.dom.btnPrevSet.addEventListener('click', () => {
      window.workoutAudio.playClick();
      this.prevSet();
    });

    this.dom.btnPauseToggle.addEventListener('click', () => {
      window.workoutAudio.playClick();
      this.togglePause();
    });

    this.dom.btnResetSet.addEventListener('click', () => {
      window.workoutAudio.playClick();
      this.resetCurrentSet();
    });

    this.dom.btnSkipSet.addEventListener('click', () => {
      window.workoutAudio.playClick();
      this.skipToNext();
    });

    this.dom.btnSound.addEventListener('click', () => {
      window.workoutAudio.toggleMute();
      this.updateVolumeUI();
    });

    if (this.dom.btnVolumeToggle) {
      this.dom.btnVolumeToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        this.toggleQuickVolumePopover();
      });
    }

    if (this.dom.quickVolumeSlider) {
      this.dom.quickVolumeSlider.addEventListener('input', (e) => {
        const val = parseInt(e.target.value, 10);
        window.workoutAudio.setVolume(val / 100);
        this.updateVolumeUI();
      });
      this.dom.quickVolumeSlider.addEventListener('change', () => {
        window.workoutAudio.playTick(1);
      });
    }

    if (this.dom.drawerVolumeSlider) {
      this.dom.drawerVolumeSlider.addEventListener('input', (e) => {
        const val = parseInt(e.target.value, 10);
        window.workoutAudio.setVolume(val / 100);
        this.updateVolumeUI();
      });
      this.dom.drawerVolumeSlider.addEventListener('change', () => {
        window.workoutAudio.playTick(1);
      });
    }

    // Presety głośności
    document.querySelectorAll('.btn-quick-preset, .btn-vol-preset').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const pVol = parseInt(btn.dataset.vol, 10);
        if (!isNaN(pVol)) {
          window.workoutAudio.setVolume(pVol / 100);
          this.updateVolumeUI();
          window.workoutAudio.playTick(1);
        }
      });
    });

    if (this.dom.btnDrawerTestSound) {
      this.dom.btnDrawerTestSound.addEventListener('click', () => {
        window.workoutAudio.playTestSound();
      });
    }

    // Zamknięcie podręcznego popoveru przy kliknięciu poza nim
    document.addEventListener('click', (e) => {
      if (this.dom.quickVolumePopover && !this.dom.quickVolumePopover.classList.contains('hidden')) {
        if (!this.dom.quickVolumePopover.contains(e.target) && (!this.dom.btnVolumeToggle || !this.dom.btnVolumeToggle.contains(e.target))) {
          this.closeQuickVolumePopover();
        }
      }
    });

    // Otwarcie hamburger menu (drawer po lewej stronie)
    this.dom.btnOpenList.addEventListener('click', () => {
      this.openDrawer();
    });

    this.dom.btnCloseDrawer.addEventListener('click', () => {
      this.closeDrawer();
    });

    this.dom.drawerBackdrop.addEventListener('click', () => {
      this.closeDrawer();
    });

    this.dom.btnRestartWorkout.addEventListener('click', () => {
      this.restartWorkout();
    });

    // Skróty klawiszowe (pilot Bluetooth / Spacja)
    document.addEventListener('keydown', (e) => {
      if (e.code === 'Space') {
        e.preventDefault();
        window.workoutAudio.init();
        this.handleMainAction();
      } else if (e.code === 'ArrowRight') {
        this.skipToNext();
      } else if (e.code === 'ArrowLeft') {
        this.prevSet();
      }
    });

    // Automatyczne odnawianie WakeLock przy powrocie do aplikacji
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        this.requestWakeLock();
      }
    });
  }

  async requestWakeLock() {
    try {
      if ('wakeLock' in navigator && !this.wakeLock) {
        this.wakeLock = await navigator.wakeLock.request('screen');
        this.wakeLock.addEventListener('release', () => {
          this.wakeLock = null;
        });
      }
    } catch (err) {
      // Ciche zignorowanie braku wsparcia w przeglądarce
    }
  }

  // Ładowanie konkretnego ćwiczenia i serii
  loadExercise(exIndex, setIndex) {
    this.currentExIndex = exIndex;
    this.currentSetIndex = setIndex;
    this.phase = 'READY';
    this.isPaused = false;
    this.stopTimer();

    const ex = this.exercises[this.currentExIndex];
    if (!ex) return;

    // Header & Meta
    this.dom.headerProgressText.textContent = `${this.session.name} • ${this.currentExIndex + 1} / ${this.exercises.length}`;
    this.dom.categoryBadge.textContent = ex.category;
    this.dom.equipmentBadge.textContent = ex.equipment;
    this.dom.exerciseName.textContent = ex.name;

    // Sets Tracker Dots
    const currentSetNum = this.currentSetIndex + 1;
    this.dom.setsCounterText.textContent = `SERIA ${currentSetNum} Z ${ex.sets}`;
    this.renderSetsDots(ex.sets, this.currentSetIndex);

    // Wskazówki techniczne
    this.dom.cueText.textContent = ex.cue;
    this.dom.cuePoints.innerHTML = '';
    if (ex.keyPoints && ex.keyPoints.length) {
      ex.keyPoints.forEach(pt => {
        const li = document.createElement('li');
        li.textContent = pt;
        this.dom.cuePoints.appendChild(li);
      });
    }

    // Ukryj kartę Następnego ćwiczenia w trybie przygotowania
    this.dom.nextExerciseCard.classList.add('hidden');

    // UI Card: Gotowość w kolorze ZIELONYM
    this.dom.displayCard.className = 'display-card phase-ready';
    this.dom.phaseBanner.textContent = 'PRZYGOTUJ SIĘ';
    this.dom.phaseProgressBar.style.width = '0%';

    if (ex.type === 'timed') {
      this.timeRemaining = ex.duration;
      this.dom.mainDigits.textContent = this.formatTime(ex.duration);
      const sideText = ex.sides ? ` (${ex.sideLabel || 'na stronę'})` : '';
      this.dom.secondaryDigits.textContent = `CEL: ${ex.duration} SEKUND${sideText}`;
    } else {
      this.repsElapsedSeconds = 0;
      const sideText = ex.sides ? ' / STRONĘ' : '';
      this.dom.mainDigits.textContent = `${ex.reps} POWT.${sideText}`;
      this.dom.secondaryDigits.textContent = 'SERIA NA POWTÓRZENIA';
    }

    // Główny przycisk: zielony, oczekujący na 1 kliknięcie do rozpoczęcia
    this.setMainButton('ROZPOCZNIJ SERIĘ', 'work', 'play', true);
    this.updatePauseButton();
    this.updateDrawerActive();
  }

  renderSetsDots(totalSets, activeIndex) {
    this.dom.setsDots.innerHTML = '';
    for (let i = 0; i < totalSets; i++) {
      const dot = document.createElement('div');
      dot.className = 'set-dot';
      if (i < activeIndex) dot.classList.add('completed');
      else if (i === activeIndex) dot.classList.add('active');
      this.dom.setsDots.appendChild(dot);
    }
  }

  // Główny przycisk akcji
  handleMainAction() {
    this.startTotalTimerOnce();

    if (this.phase === 'READY') {
      this.startWork();
    } else if (this.phase === 'WORK') {
      this.finishWorkAndStartRest();
    } else if (this.phase === 'REST') {
      // Wymóg: Jeśli klikam "Zakończ przerwę", kolejna seria rozpoczyna się automatycznie
      this.skipRestAndStartNextSet();
    }
  }

  startTotalTimerOnce() {
    if (!this.hasWorkoutStarted) {
      this.hasWorkoutStarted = true;
      this.totalTimerInterval = setInterval(() => {
        this.totalSeconds++;
        this.dom.totalTimeDisplay.textContent = this.formatTime(this.totalSeconds);
      }, 1000);
    }
  }

  // Faza PRACY
  startWork() {
    this.phase = 'WORK';
    this.isPaused = false;
    this.updatePauseButton();

    const ex = this.exercises[this.currentExIndex];
    window.workoutAudio.playStart();

    this.dom.displayCard.className = 'display-card phase-work';
    this.dom.phaseBanner.textContent = 'PRACA';
    this.dom.nextExerciseCard.classList.add('hidden');

    if (ex.type === 'timed') {
      this.timeRemaining = ex.duration;
      this.dom.mainDigits.textContent = this.formatTime(this.timeRemaining);
      this.setMainButton('ZAKOŃCZ SERIĘ / PRZERWA', 'work', 'stop', false);
      this.runTimedWork();
    } else {
      this.repsElapsedSeconds = 0;
      const sideText = ex.sides ? ' / STRONĘ' : '';
      this.dom.mainDigits.textContent = `${ex.reps} POWT.${sideText}`;
      this.dom.secondaryDigits.textContent = 'CZAS SERII: 00:00';
      this.setMainButton('ZAKOŃCZ SERIĘ / PRZERWA', 'work', 'check', false);
      this.runRepsWork();
    }
  }

  runTimedWork() {
    const ex = this.exercises[this.currentExIndex];
    const totalDuration = ex.duration;

    this.stopTimer();
    this.timerInterval = setInterval(() => {
      if (this.isPaused) return;

      this.timeRemaining--;

      // Wymóg: Odliczanie sygnałem dźwiękowym od 10 sekund zamiast od 3
      if (this.timeRemaining <= 10 && this.timeRemaining >= 1) {
        window.workoutAudio.playTick(this.timeRemaining);
      }

      const percent = Math.min(100, Math.max(0, ((totalDuration - this.timeRemaining) / totalDuration) * 100));
      this.dom.phaseProgressBar.style.width = `${percent}%`;

      if (this.timeRemaining <= 0) {
        this.dom.mainDigits.textContent = '00:00';
        this.stopTimer();
        window.workoutAudio.playEndGong();

        this.dom.phaseBanner.textContent = 'CZAS MINĄŁ!';
        this.setMainButton('ZACZNIJ PRZERWĘ', 'work', 'arrow', true);
      } else {
        this.dom.mainDigits.textContent = this.formatTime(this.timeRemaining);
      }
    }, 1000);
  }

  runRepsWork() {
    this.stopTimer();
    this.dom.phaseProgressBar.style.width = '100%';

    this.timerInterval = setInterval(() => {
      if (this.isPaused) return;
      this.repsElapsedSeconds++;
      this.dom.secondaryDigits.textContent = `CZAS SERII: ${this.formatTime(this.repsElapsedSeconds)}`;
    }, 1000);
  }

  // Zakończenie serii i przejście do PRZERWY
  finishWorkAndStartRest() {
    this.stopTimer();
    const ex = this.exercises[this.currentExIndex];
    const isLastSetOfEx = this.currentSetIndex >= ex.sets - 1;
    const isLastEx = this.currentExIndex >= this.exercises.length - 1;

    // Jeśli to ostatnia seria ostatniego ćwiczenia -> koniec treningu
    if (isLastSetOfEx && isLastEx) {
      this.completeWorkout();
      return;
    }

    this.phase = 'REST';
    this.isPaused = false;
    this.updatePauseButton();

    window.workoutAudio.playRest();

    // Określenie czasu przerwy
    this.restDuration = isLastSetOfEx ? (ex.restNext || this.session.defaultRestNext || 60) : (ex.restSame || this.session.defaultRestSame || 30);
    this.timeRemaining = this.restDuration;

    // UI Przerwy
    this.dom.displayCard.className = 'display-card phase-rest';
    this.dom.phaseBanner.textContent = 'ODPOCZYNEK';
    this.dom.mainDigits.textContent = this.formatTime(this.timeRemaining);
    this.dom.secondaryDigits.textContent = `PRZERWA: ${this.restDuration} SEKUND`;
    this.dom.phaseProgressBar.style.width = '0%';

    this.showNextExercisePreview(isLastSetOfEx);

    // Przycisk przerwy: Kliknięcie od razu startuje kolejną serię
    this.setMainButton('ZAKOŃCZ PRZERWĘ (START)', 'rest', 'play', false);

    // Odliczanie przerwy
    this.timerInterval = setInterval(() => {
      if (this.isPaused) return;

      this.timeRemaining--;

      // Wymóg: Odliczanie sygnałem dźwiękowym od 10 sekund zamiast od 3
      if (this.timeRemaining <= 10 && this.timeRemaining >= 1) {
        window.workoutAudio.playTick(this.timeRemaining);
      }

      const percent = Math.min(100, Math.max(0, ((this.restDuration - this.timeRemaining) / this.restDuration) * 100));
      this.dom.phaseProgressBar.style.width = `${percent}%`;

      if (this.timeRemaining <= 0) {
        this.stopTimer();
        this.dom.mainDigits.textContent = '00:00';
        window.workoutAudio.playRestEnd();

        // Wymóg: Czas przerwy minął sam -> automatycznie przejście w stan zielony i oczekiwanie na 1 kliknięcie
        this.advanceToNextSet(false);
      } else {
        this.dom.mainDigits.textContent = this.formatTime(this.timeRemaining);
      }
    }, 1000);
  }

  showNextExercisePreview(isLastSetOfEx) {
    this.dom.nextExerciseCard.classList.remove('hidden');

    if (!isLastSetOfEx) {
      const ex = this.exercises[this.currentExIndex];
      this.dom.nextExerciseName.textContent = ex.name;
      this.dom.nextExerciseMeta.textContent = `Seria ${this.currentSetIndex + 2} z ${ex.sets}`;
    } else {
      const nextEx = this.exercises[this.currentExIndex + 1];
      if (nextEx) {
        this.dom.nextExerciseName.textContent = nextEx.name;
        const metaDetail = nextEx.type === 'timed' ? `${nextEx.sets} serie × ${nextEx.duration} s` : `${nextEx.sets} serie × ${nextEx.reps} powt.`;
        this.dom.nextExerciseMeta.textContent = `${metaDetail} (${nextEx.equipment})`;
      }
    }
  }

  // Wymóg: Jeśli klikam "Zakończ przerwę", kolejna seria rozpoczyna się automatycznie
  skipRestAndStartNextSet() {
    this.stopTimer();
    this.advanceToNextSet(true); // autoStart = true
  }

  advanceToNextSet(autoStart = false) {
    const ex = this.exercises[this.currentExIndex];
    if (this.currentSetIndex < ex.sets - 1) {
      this.loadExercise(this.currentExIndex, this.currentSetIndex + 1);
      if (autoStart) {
        this.startWork();
      }
    } else if (this.currentExIndex < this.exercises.length - 1) {
      this.loadExercise(this.currentExIndex + 1, 0);
      if (autoStart) {
        this.startWork();
      }
    } else {
      this.completeWorkout();
    }
  }

  // Nawigacja wstecz
  prevSet() {
    this.stopTimer();
    if (this.currentSetIndex > 0) {
      this.loadExercise(this.currentExIndex, this.currentSetIndex - 1);
    } else if (this.currentExIndex > 0) {
      const prevEx = this.exercises[this.currentExIndex - 1];
      this.loadExercise(this.currentExIndex - 1, prevEx.sets - 1);
    } else {
      this.loadExercise(0, 0);
    }
  }

  // Reset bieżącej serii
  resetCurrentSet() {
    this.stopTimer();
    this.loadExercise(this.currentExIndex, this.currentSetIndex);
  }

  // Pomiń serię / Przejdź dalej
  skipToNext() {
    this.stopTimer();
    this.advanceToNextSet(false);
  }

  // Pauza / Wznów
  togglePause() {
    if (this.phase === 'READY' || this.phase === 'COMPLETE') return;

    this.isPaused = !this.isPaused;
    this.updatePauseButton();
  }

  updatePauseButton() {
    if (this.isPaused) {
      this.dom.pauseBtnText.textContent = 'WZNÓW';
      this.dom.iconPause.classList.add('hidden');
      this.dom.iconResume.classList.remove('hidden');
      this.dom.phaseBanner.textContent = 'PAUZA';
    } else {
      this.dom.pauseBtnText.textContent = 'PAUZA';
      this.dom.iconPause.classList.remove('hidden');
      this.dom.iconResume.classList.add('hidden');
      if (this.phase === 'WORK') this.dom.phaseBanner.textContent = 'PRACA';
      else if (this.phase === 'REST') this.dom.phaseBanner.textContent = 'ODPOCZYNEK';
    }
  }

  // Koniec całego treningu
  completeWorkout() {
    this.stopTimer();
    if (this.totalTimerInterval) clearInterval(this.totalTimerInterval);
    this.phase = 'COMPLETE';

    window.workoutAudio.playEndGong();

    let totalSets = 0;
    this.exercises.forEach(e => totalSets += e.sets);

    this.dom.mainView.classList.add('hidden');
    this.dom.completeView.classList.remove('hidden');
    this.dom.finalTotalTime.textContent = this.formatTime(this.totalSeconds);
    this.dom.finalTotalSets.textContent = totalSets;
  }

  restartWorkout() {
    this.totalSeconds = 0;
    this.hasWorkoutStarted = false;
    this.dom.totalTimeDisplay.textContent = '00:00';
    this.dom.completeView.classList.add('hidden');
    this.dom.mainView.classList.remove('hidden');
    this.loadExercise(0, 0);
  }

  stopTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }

  setMainButton(text, theme = 'work', iconType = 'play', isPulsing = false) {
    this.dom.btnMainText.textContent = text;
    this.dom.btnMainAction.className = `btn btn-giant btn-primary ${theme === 'rest' ? 'btn-rest' : ''} ${isPulsing ? 'btn-pulse' : ''}`;

    let svgIcon = '<svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>';
    if (iconType === 'stop') {
      svgIcon = '<svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><rect x="5" y="5" width="14" height="14" rx="2"></rect></svg>';
    } else if (iconType === 'check') {
      svgIcon = '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><polyline points="20 6 9 17 4 12"></polyline></svg>';
    } else if (iconType === 'arrow') {
      svgIcon = '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><polyline points="9 18 15 12 9 6"></polyline></svg>';
    }
    this.dom.btnMainIcon.innerHTML = svgIcon;
  }

  // Renderowanie wyboru sesji w menu hamburgera
  renderDrawerSessions() {
    if (!this.dom.drawerSessionList) return;
    this.dom.drawerSessionList.innerHTML = '';

    if (this.dom.drawerTotalSessionsBadge) {
      this.dom.drawerTotalSessionsBadge.textContent = `${this.sessions.length} SESJE`;
    }

    this.sessions.forEach((s, idx) => {
      const isCurrent = idx === this.currentSessionIndex;
      const card = document.createElement('div');
      card.className = `drawer-session-card ${isCurrent ? 'active' : ''}`;
      card.dataset.sessionId = s.id;

      card.innerHTML = `
        <div class="drawer-session-info">
          <div class="drawer-session-headline">
            <span class="drawer-session-name">${s.name}</span>
            <span class="drawer-session-sub">${s.shortTitle || ''}</span>
          </div>
          <div class="drawer-session-desc">${s.description || s.title}</div>
        </div>
        <div class="drawer-session-badge">
          ${isCurrent ? '<span class="badge-active">AKTYWNA</span>' : '<span class="badge-select">WYBIERZ</span>'}
        </div>
      `;

      card.addEventListener('click', () => {
        if (!isCurrent) {
          window.workoutAudio.playClick();
          this.switchSession(s.id);
        }
      });

      this.dom.drawerSessionList.appendChild(card);
    });
  }

  // Renderowanie listy ćwiczeń aktywnej sesji w drawerze
  renderDrawerExercises() {
    if (!this.dom.drawerExerciseList) return;
    this.dom.drawerExerciseList.innerHTML = '';

    if (this.dom.drawerSessionExCount) {
      this.dom.drawerSessionExCount.textContent = `${this.exercises.length} ĆWICZEŃ`;
    }

    this.exercises.forEach((ex, idx) => {
      const item = document.createElement('div');
      item.className = 'drawer-item';
      item.dataset.index = idx;

      const targetText = ex.type === 'timed' ? `${ex.duration}s` : `${ex.reps} powt.`;
      const sidesText = ex.sides ? ' / str.' : '';

      item.innerHTML = `
        <div>
          <div class="drawer-item-title">${idx + 1}. ${ex.name}</div>
          <div class="drawer-item-meta">${ex.sets} serie × ${targetText}${sidesText} • ${ex.equipment}</div>
        </div>
        <div class="drawer-item-status">0 / ${ex.sets}</div>
      `;

      item.addEventListener('click', () => {
        window.workoutAudio.playClick();
        this.closeDrawer();
        this.loadExercise(idx, 0);
      });

      this.dom.drawerExerciseList.appendChild(item);
    });
  }

  updateDrawerActive() {
    // Aktualizacja podświetlenia ćwiczeń
    if (this.dom.drawerExerciseList) {
      const items = this.dom.drawerExerciseList.querySelectorAll('.drawer-item');
      items.forEach((item, idx) => {
        item.classList.toggle('active', idx === this.currentExIndex);
        item.classList.toggle('completed', idx < this.currentExIndex);
        const statusEl = item.querySelector('.drawer-item-status');
        if (statusEl) {
          if (idx < this.currentExIndex) {
            const ex = this.exercises[idx];
            statusEl.textContent = `${ex.sets} / ${ex.sets} ✓`;
          } else if (idx === this.currentExIndex) {
            const ex = this.exercises[idx];
            statusEl.textContent = `${this.currentSetIndex} / ${ex.sets}`;
          } else {
            const ex = this.exercises[idx];
            statusEl.textContent = `0 / ${ex.sets}`;
          }
        }
      });
    }

    // Aktualizacja podświetlenia sesji
    if (this.dom.drawerSessionList) {
      const sessionCards = this.dom.drawerSessionList.querySelectorAll('.drawer-session-card');
      sessionCards.forEach((card, idx) => {
        const isCurrent = idx === this.currentSessionIndex;
        card.classList.toggle('active', isCurrent);
        const badgeContainer = card.querySelector('.drawer-session-badge');
        if (badgeContainer) {
          badgeContainer.innerHTML = isCurrent ? '<span class="badge-active">AKTYWNA</span>' : '<span class="badge-select">WYBIERZ</span>';
        }
      });
    }
  }

  updateVolumeUI() {
    const isMuted = window.workoutAudio.isMuted;
    const volPct = window.workoutAudio.getVolumePercent();

    if (this.dom.iconSoundOn) this.dom.iconSoundOn.classList.toggle('hidden', isMuted);
    if (this.dom.iconSoundOff) this.dom.iconSoundOff.classList.toggle('hidden', !isMuted);

    const displayTxt = isMuted ? 'MUTE' : `${volPct}%`;
    if (this.dom.topVolumeVal) this.dom.topVolumeVal.textContent = displayTxt;
    if (this.dom.quickVolumeVal) this.dom.quickVolumeVal.textContent = `${volPct}%`;
    if (this.dom.drawerVolumeBadge) this.dom.drawerVolumeBadge.textContent = isMuted ? 'WYCISZONY' : `${volPct}%`;

    if (this.dom.quickVolumeSlider) {
      this.dom.quickVolumeSlider.value = isMuted ? 0 : volPct;
    }
    if (this.dom.drawerVolumeSlider) {
      this.dom.drawerVolumeSlider.value = isMuted ? 0 : volPct;
    }

    document.querySelectorAll('.btn-quick-preset').forEach(btn => {
      const pVol = parseInt(btn.dataset.vol, 10);
      btn.classList.toggle('active', !isMuted && pVol === volPct);
    });

    document.querySelectorAll('.btn-vol-preset').forEach(btn => {
      const pVol = parseInt(btn.dataset.vol, 10);
      btn.classList.toggle('active', !isMuted && pVol === volPct);
    });
  }

  toggleQuickVolumePopover() {
    if (!this.dom.quickVolumePopover) return;
    const isHidden = this.dom.quickVolumePopover.classList.contains('hidden');
    if (isHidden) {
      this.dom.quickVolumePopover.classList.remove('hidden');
    } else {
      this.dom.quickVolumePopover.classList.add('hidden');
    }
  }

  closeQuickVolumePopover() {
    if (this.dom.quickVolumePopover) {
      this.dom.quickVolumePopover.classList.add('hidden');
    }
  }

  openDrawer() {
    this.updateDrawerActive();
    this.dom.exercisesDrawer.classList.remove('hidden');
    this.dom.drawerBackdrop.classList.remove('hidden');
  }

  closeDrawer() {
    this.dom.exercisesDrawer.classList.add('hidden');
    this.dom.drawerBackdrop.classList.add('hidden');
  }
}
