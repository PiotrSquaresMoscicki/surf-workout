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
    await expect(page.locator('#header-progress-text')).toHaveText(/Sesja A • 1 \/ 9/);
    await expect(page.locator('#session-tag')).toHaveText('SESJA A');
    await expect(page.locator('#exercise-name')).toHaveText('Prone hold z klockiem');
    await expect(page.locator('#sets-counter-text')).toHaveText('SERIA 1 Z 4');
    await expect(page.locator('#phase-banner')).toHaveText('PRZYGOTUJ SIĘ');
    await expect(page.locator('#main-digits')).toHaveText('00:40');
    await expect(page.locator('#btn-main-text')).toHaveText('ROZPOCZNIJ SERIĘ');
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

    // Kliknięcie "Zakończ przerwę" -> natychmiastowe przejście do kolejnej serii (WORK)
    await mainBtn.click();
    await expect(page.locator('#phase-banner')).toHaveText('PRACA');
    await expect(page.locator('#sets-counter-text')).toHaveText('SERIA 2 Z 4');
  });

  test('powinien obsługiwać przyciski DALEJ oraz WSTECZ do przełączania serii', async ({ page }) => {
    await expect(page.locator('#sets-counter-text')).toHaveText('SERIA 1 Z 4');

    // Kliknięcie DALEJ
    await page.locator('#btn-skip-set').click();
    await expect(page.locator('#sets-counter-text')).toHaveText('SERIA 2 Z 4');

    // Kolejne kliknięcie DALEJ
    await page.locator('#btn-skip-set').click();
    await expect(page.locator('#sets-counter-text')).toHaveText('SERIA 3 Z 4');

    // Kliknięcie WSTECZ
    await page.locator('#btn-prev-set').click();
    await expect(page.locator('#sets-counter-text')).toHaveText('SERIA 2 Z 4');
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

  test('powinien otwierać drawer menu i pozwalać na zmianę sesji treningowej na Sesję B', async ({ page }) => {
    const drawer = page.locator('#exercises-drawer');
    await expect(drawer).toHaveClass(/hidden/);

    // Kliknięcie hamburgera
    await page.locator('#btn-open-list').click();
    await expect(drawer).not.toHaveClass(/hidden/);

    // Sprawdzenie dostępnych sesji
    const sessionCards = page.locator('.drawer-session-card');
    await expect(sessionCards).toHaveCount(3);

    // Wybór Sesji B (indeks 1)
    await sessionCards.nth(1).click();

    // Zamknięcie drawera przyciskiem zamknięcia
    await page.locator('#btn-close-drawer').click();

    // Drawer powinien być zamknięty, a nagłówek i tag zaktualizowany na Sesję B
    await expect(drawer).toHaveClass(/hidden/);
    await expect(page.locator('#header-progress-text')).toHaveText(/Sesja B • 1 \//);
    await expect(page.locator('#session-tag')).toHaveText('SESJA B');
    await expect(page.locator('#exercise-name')).not.toHaveText('Prone hold z klockiem');
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

    // Wciśnięcie strzałki w prawo przechodzi do kolejnej serii
    await page.keyboard.press('ArrowRight');
    await expect(page.locator('#sets-counter-text')).toHaveText('SERIA 2 Z 4');
  });
});
