import { test, expect } from '@playwright/test';

test.describe('Surf Workout UI & Timer Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Wyczyść localStorage przed każdym testem
    await page.addInitScript(() => {
      localStorage.clear();
    });
    await page.goto('/');
    // Poczekaj na inicjalizację instancji aplikacji
    await page.waitForFunction(() => typeof window.app !== 'undefined' && typeof window.app.handleMainAction === 'function');
  });

  test('powinien poprawnie zainicjalizować stan początkowy aplikacji', async ({ page }) => {
    await expect(page).toHaveTitle(/Surf Workout/);
    await expect(page.locator('#header-progress-text')).toHaveText(/Wariant 1 • 1 \/ 10/);
    await expect(page.locator('#app-version')).toBeVisible();
    await expect(page.locator('#app-version')).toHaveText(/^v\d+\.\d+\.\d+/);
    await expect(page.locator('#session-tag')).toHaveText('WARIANT 1');
    await expect(page.locator('#exercise-name')).toHaveText('Rozciąganie wstępne');
    await expect(page.locator('#sets-counter-text')).toHaveText('SERIA 1 Z 1');
    await expect(page.locator('#phase-banner')).toHaveText('PRZYGOTUJ SIĘ');
    await expect(page.locator('#main-digits')).toHaveText('10:00');
    await expect(page.locator('#btn-main-text')).toHaveText('ROZPOCZNIJ SERIĘ');

    const appVersion = await page.evaluate(() => window.APP_VERSION);
    expect(appVersion).toMatch(/^v\d+\.\d+\.\d+/);
  });

  test('powinien reagować na kliknięcie głównego przycisku i przechodzić z fazy READY do WORK', async ({ page }) => {
    const mainBtn = page.locator('#btn-main-action');
    await expect(page.locator('#phase-banner')).toHaveText('PRZYGOTUJ SIĘ');

    // Kliknięcie rozpoczęcia serii
    await mainBtn.click();

    // Sprawdzenie przejścia do fazy PRACA
    await expect(page.locator('#phase-banner')).toHaveText('PRACA');
    await expect(page.locator('#btn-main-text')).toHaveText('ZAKOŃCZ SERIĘ / PRZERWA');
    await expect(page.locator('#display-card')).toHaveClass(/phase-work/);

    // Weryfikacja że stan aplikacji uległ zmianie
    const appPhase = await page.evaluate(() => window.app.phase);
    expect(appPhase).toBe('WORK');
  });

  test('powinien poprawnie przejść z fazy WORK do REST i z powrotem do WORK', async ({ page }) => {
    const mainBtn = page.locator('#btn-main-action');

    // Start serii (READY -> WORK)
    await mainBtn.click();
    await expect(page.locator('#phase-banner')).toHaveText('PRACA');

    // Zakończenie serii -> przejście w odpoczynek (WORK -> REST)
    await mainBtn.click();
    await expect(page.locator('#phase-banner')).toHaveText('ODPOCZYNEK');
    await expect(page.locator('#btn-main-text')).toHaveText(/ZAKOŃCZ PRZERWĘ/);
    await expect(page.locator('#next-exercise-card')).not.toHaveClass(/hidden/);

    // Kliknięcie "Zakończ przerwę" -> natychmiastowe przejście do kolejnego ćwiczenia/serii (WORK)
    await mainBtn.click();
    await expect(page.locator('#phase-banner')).toHaveText('PRACA');
    await expect(page.locator('#exercise-name')).toHaveText('Pompki wąskie w futrynie drzwi');
    await expect(page.locator('#sets-counter-text')).toHaveText('SERIA 1 Z 3');
  });

  test('powinien obsługiwać przyciski DALEJ oraz WSTECZ do przełączania serii', async ({ page }) => {
    await expect(page.locator('#sets-counter-text')).toHaveText('SERIA 1 Z 1');

    // Kliknięcie DALEJ (przechodzi do drugiego ćwiczenia, seria 1)
    await page.locator('#btn-skip-set').click();
    await expect(page.locator('#exercise-name')).toHaveText('Pompki wąskie w futrynie drzwi');
    await expect(page.locator('#sets-counter-text')).toHaveText('SERIA 1 Z 3');

    // Kolejne kliknięcie DALEJ (seria 2 drugiego ćwiczenia)
    await page.locator('#btn-skip-set').click();
    await expect(page.locator('#sets-counter-text')).toHaveText('SERIA 2 Z 3');

    // Kliknięcie WSTECZ
    await page.locator('#btn-prev-set').click();
    await expect(page.locator('#sets-counter-text')).toHaveText('SERIA 1 Z 3');
  });

  test('powinien obsługiwać przycisk PAUZA / WZNÓW w trakcie trwania serii', async ({ page }) => {
    const mainBtn = page.locator('#btn-main-action');
    const pauseBtn = page.locator('#btn-pause-toggle');
    const pauseBtnText = page.locator('#pause-btn-text');

    // Rozpocznij serię
    await mainBtn.click();
    await expect(page.locator('#phase-banner')).toHaveText('PRACA');

    // Kliknij pauzę
    await pauseBtn.click();
    await expect(pauseBtnText).toHaveText('WZNÓW');
    const isPaused = await page.evaluate(() => window.app.isPaused);
    expect(isPaused).toBe(true);

    // Wznów trening
    await pauseBtn.click();
    await expect(pauseBtnText).toHaveText('PAUZA');
    const isResumed = await page.evaluate(() => window.app.isPaused);
    expect(isResumed).toBe(false);
  });

  test('powinien otwierać drawer menu i pozwalać na zmianę sesji treningowej na Wariant 2', async ({ page }) => {
    const drawer = page.locator('#exercises-drawer');
    await expect(drawer).toHaveClass(/hidden/);

    // Kliknięcie hamburgera
    await page.locator('#btn-open-list').click();
    await expect(drawer).not.toHaveClass(/hidden/);

    // Sprawdzenie dostępnych sesji
    const sessionCards = page.locator('.drawer-session-card');
    await expect(sessionCards).toHaveCount(3);

    // Wybór Wariantu 2 (indeks 1)
    await sessionCards.nth(1).click();

    // Zamknięcie drawera przyciskiem zamknięcia
    await page.locator('#btn-close-drawer').click();

    // Drawer powinien być zamknięty, a nagłówek i tag zaktualizowany na Wariant 2
    await expect(drawer).toHaveClass(/hidden/);
    await expect(page.locator('#header-progress-text')).toHaveText(/Wariant 2 • 1 \/ 11/);
    await expect(page.locator('#session-tag')).toHaveText('WARIANT 2');
    await expect(page.locator('#exercise-name')).toHaveText('Rozciąganie wstępne');
  });

  test('powinien prawidłowo przełączać wyciszenie dźwięku', async ({ page }) => {
    const soundBtn = page.locator('#btn-sound');
    const soundOnIcon = page.locator('#icon-sound-on');
    const soundOffIcon = page.locator('#icon-sound-off');

    await expect(soundOnIcon).not.toHaveClass(/hidden/);
    await expect(soundOffIcon).toHaveClass(/hidden/);

    // Kliknięcie wyciszenia
    await soundBtn.click();
    await expect(soundOnIcon).toHaveClass(/hidden/);
    await expect(soundOffIcon).not.toHaveClass(/hidden/);
    const isMuted = await page.evaluate(() => window.workoutAudio.isMuted);
    expect(isMuted).toBe(true);

    // Ponowne kliknięcie włącza dźwięk
    await soundBtn.click();
    await expect(soundOnIcon).not.toHaveClass(/hidden/);
    await expect(soundOffIcon).toHaveClass(/hidden/);
  });

  test('powinien reagować na skróty klawiszowe (Space do akcji, ArrowRight do następnej serii)', async ({ page }) => {
    await expect(page.locator('#phase-banner')).toHaveText('PRZYGOTUJ SIĘ');

    // Wciśnięcie spacji uruchamia serię
    await page.keyboard.press('Space');
    await expect(page.locator('#phase-banner')).toHaveText('PRACA');

    // Wciśnięcie strzałki w prawo przechodzi do kolejnej serii (drugie ćwiczenie, seria 1)
    await page.keyboard.press('ArrowRight');
    await expect(page.locator('#exercise-name')).toHaveText('Pompki wąskie w futrynie drzwi');
    await expect(page.locator('#sets-counter-text')).toHaveText('SERIA 1 Z 3');
  });

  test('powinien obsługiwać zmianę głośności suwakiem oraz presetami w menu drawer', async ({ page }) => {
    // Otwarcie menu hamburgera
    await page.locator('#btn-open-list').click();
    await expect(page.locator('#drawer-volume-badge')).toHaveText('100%');

    // Kliknięcie presetu 60%
    const preset60 = page.locator('.btn-preset[data-val="60"]');
    await preset60.click();

    // Weryfikacja wartości w obiekcie audio, badge i localStorage
    const vol60 = await page.evaluate(() => window.workoutAudio.volume);
    expect(vol60).toBe(0.6);
    await expect(page.locator('#drawer-volume-badge')).toHaveText('60%');
    const savedVol = await page.evaluate(() => localStorage.getItem('surf_workout_volume'));
    expect(savedVol).toBe('0.60');

    // Zmiana suwakiem na 30%
    const slider = page.locator('#volume-slider');
    await slider.fill('30');
    await slider.dispatchEvent('input');

    const vol30 = await page.evaluate(() => window.workoutAudio.volume);
    expect(vol30).toBe(0.3);
    await expect(page.locator('#drawer-volume-badge')).toHaveText('30%');
  });
});
