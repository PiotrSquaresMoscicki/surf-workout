import './style.css';
import { WORKOUT_SESSIONS } from './workout-data.js';
import { WorkoutAudio } from './audio.js';
import { SurfWorkoutApp } from './app.js';

// Inicjalizacja instancji audio
if (!window.workoutAudio) {
  window.workoutAudio = new WorkoutAudio();
}

// Globalny handler odblokowujący audio na iOS Safari przy pierwszej interakcji
const unlockAudioOnUserGesture = () => {
  if (window.workoutAudio) {
    window.workoutAudio.unlock();
  }
};

['touchstart', 'touchend', 'pointerdown', 'mousedown', 'keydown'].forEach(evtType => {
  window.addEventListener(evtType, unlockAudioOnUserGesture, { passive: true });
});

// Inicjalizacja aplikacji po załadowaniu DOM
function initApp() {
  if (!window.app) {
    window.app = new SurfWorkoutApp(WORKOUT_SESSIONS);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
