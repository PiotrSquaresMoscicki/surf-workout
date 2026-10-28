# Surf Workout

Aplikacja treningowa przygotowująca ciało do surfingu (pop-up drills, prone holds, otwieranie klatki, mobilność bioder i stawu skokowego).

## Funkcjonalności

- **3 sesje treningowe**:
  - **Sesja A**: Pop-up, Złączone Nogi & Otwarta Klatka
  - **Sesja B**: Anti-Rotation, Wiosłowanie & Mobilność Kostek
  - **Sesja C**: Wytrzymałość Wiosłowania & Eksplozywny Pop-up
- **Precyzyjny timer**: 10-sekundowe odliczanie przygotowawcze, przejścia serii, czas pracy i przerw.
- **Dźwięki Web Audio**: Naturalne sygnały dźwiękowe z pełną obsługą iOS Safari (omijanie sprzętowego trybu cichego).
- **Interfejs mobilny**: Płynne menu boczne (drawer), widok ukończenia treningu, obsługa blokady wygaszania ekranu (Screen Wake Lock API).

## Rozwój lokalny

Wymagania:
- Node.js (wersja 20+ lub 22+)
- npm

```bash
# Instalacja zależności
npm install

# Uruchomienie serwera deweloperskiego
npm run dev

# Kompilacja produkcyjna
npm run build

# Podgląd wersji produkcyjnej
npm run preview
```

## Wdrożenie

Projekt wykorzystuje szablon `static_web_service_template`. Każdy push do gałęzi `main` automatycznie buduje aplikację i publikuje ją na GitHub Pages za pośrednictwem GitHub Actions (`.github/workflows/deploy-main.yml`).
