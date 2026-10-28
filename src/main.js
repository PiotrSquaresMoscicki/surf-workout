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
let appInstance = null;
export function initApp() {
  if (!appInstance) {
    appInstance = new SurfWorkoutApp(WORKOUT_SESSIONS);
    window.surfApp = appInstance;
    window.app = appInstance;
  }
  return appInstance;
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
