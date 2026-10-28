// Konfiguracja planów treningowych do surfingu (3 różne sesje)
// Możesz swobodnie modyfikować ćwiczenia, czasy, serie i powtórzenia w tym pliku.

export const WORKOUT_SESSIONS = [
  {
    id: "session-a",
    name: "Sesja A",
    shortTitle: "Pop-up & Klatka",
    title: "Sesja A: Pop-up, Złączone Nogi & Otwarta Klatka",
    description: "Nacisk na złączone nogi, technikę 2-step pop-up, przysiad surfingowy i otwieranie klatki",
    defaultRestSame: 30, // sekundy między seriami tego samego ćwiczenia
    defaultRestNext: 60, // sekundy między kolejnymi ćwiczeniami
    exercises: [
      {
        id: "a-prone-hold",
        name: "Prone hold z klockiem",
        category: "Nogi i Pośladki",
        type: "timed",
        duration: 40,
        sets: 4,
        restSame: 30,
        restNext: 60,
        equipment: "Mata + klocek / piłka",
        cue: "Klocek zaciśnięty między kostkami. Kolana 2–3 cm nad matą (spięte pośladki). Dłonie przy dolnych żebrach, łokcie wąsko przy ciele.",
        keyPoints: [
          "Ściskaj klocek przez cały czas trwania serii",
          "Kolana oderwane dzięki pośladkom, nie zginaj nóg do 90°",
          "Klatka uniesiona, wzrok lekko przed siebie"
        ]
      },
      {
        id: "a-air-paddling",
        name: "Air paddling z klockiem",
        category: "Wiosłowanie i Stabilizacja",
        type: "timed",
        duration: 25,
        sets: 4,
        restSame: 30,
        restNext: 60,
        equipment: "Mata + klocek / piłka",
        cue: "Dół ciała nieruchomy jak monolit. Klocek między kostkami, kolana w powietrzu. Dynamiczna, naprzemienna praca ramion.",
        keyPoints: [
          "Zakaz kołysania miednicą na boki (anti-rotation)",
          "Kolana nie mogą dotknąć maty w trakcie wiosłowania",
          "Płynny, głęboki tor pociągnięcia ramion"
        ]
      },
      {
        id: "a-board-cushion-paddling",
        name: "Wiosłowanie na desce na poduszce",
        category: "Balans i Tor Wiosłowania",
        type: "timed",
        duration: 35,
        sets: 4,
        restSame: 30,
        restNext: 60,
        equipment: "Deska + poduszka balansowa",
        cue: "Wiosłuj wąsko tuż przy krawędziach (railach) deski. Zakaz szerokiego machania ramionami na boki. Utrzymuj balans deski.",
        keyPoints: [
          "Dłonie wchodzą blisko burt i idą wąsko wzdłuż deski",
          "Stopy złączone, pośladki spięte",
          "Kontrola przechyłu deski na poduszce"
        ]
      },
      {
        id: "a-two-step-popup",
        name: "2-Step Pop-up Drill",
        category: "Technika Pop-up",
        type: "reps",
        reps: 8,
        sets: 3,
        restSame: 30,
        restNext: 60,
        equipment: "Mata / Deska",
        cue: "Push-up -> natychmiastowe wklejenie CAŁEJ tylnej stopy pod kątem 90° z dociśniętą piętą -> dostawienie przedniej nogi.",
        keyPoints: [
          "Pięta tylnej stopy musi w 100% dotykać pokładu",
          "Stopa tylna prostopadle (85–90°) do osi podłużnej",
          "Spokojne, techniczne tempo (bez pośpiechu)"
        ]
      },
      {
        id: "a-wall-popup",
        name: "Pop-up na desce przy ścianie",
        category: "Technika Pop-up",
        type: "reps",
        reps: 6,
        sides: true,
        sets: 3,
        restSame: 30,
        restNext: 60,
        equipment: "Deska przy ścianie",
        cue: "Deska dosunięta do ściany. Kolano i stopa muszą przejść wąsko pod klatką bez dotknięcia ściany. Zrób 6 powt. na stronę.",
        keyPoints: [
          "Ściana fizycznie blokuje wyrzucanie kolana na zewnątrz",
          "Ciało porusza się ściśle w osi podłużnej deski",
          "Po serii odwróć deskę drugą burtą do ściany"
        ]
      },
      {
        id: "a-rail-touch-squats",
        name: "Przysiady surfingowe (Rail-Touch)",
        category: "Mobilność i Kontrola Postawy",
        type: "reps",
        reps: 10,
        sets: 3,
        restSame: 30,
        restNext: 60,
        equipment: "Deska (lub mata w rozstawie surf)",
        cue: "Pozycja surf stance. Zejdź w głęboki przysiad zginając biodra i kolana, aż dotkniesz obu krawędzi (raili) deski.",
        keyPoints: [
          "Tylna pięta w 100% przyklejona do pokładu",
          "Dotknij jednocześnie obu krawędzi (palce i pięty)",
          "Plecy proste, zatrzymaj na 1 sekundę na dole"
        ]
      },
      {
        id: "a-combat-stretch",
        name: "Combat Stretch (Kostka)",
        category: "Mobilność Stawu Skokowego",
        type: "timed",
        duration: 45,
        sides: true,
        sideLabel: "na nogę",
        sets: 3,
        restSame: 30,
        restNext: 60,
        equipment: "Mata (klęk jednonóż)",
        cue: "Klatka dociąża kolano przednie. Wypychaj kolano mocno w przód poza palce. Pięta BEZWZGLĘDNIE dociśnięta do podłogi.",
        keyPoints: [
          "Brak odrywania pięty od maty",
          "Utrzymuj stały nacisk tułowia na udo",
          "Zrób 45 s na prawą, a potem na lewą nogę"
        ]
      },
      {
        id: "a-doorway-pec-stretch",
        name: "Rozciąganie klatki przy ścianie",
        category: "Otwarta Klatka",
        type: "timed",
        duration: 30,
        sides: true,
        sideLabel: "na stronę",
        sets: 3,
        restSame: 30,
        restNext: 60,
        equipment: "Ściana / futryna",
        cue: "Łokieć na ścianie pod kątem 90° lub 120°. Krok w przód i lekka rotacja tułowia w przeciwną stronę do uczucia rozciągania.",
        keyPoints: [
          "Rozciągaj przód barku i klatkę piersiową",
          "Nie wyginaj odcinka lędźwiowego",
          "Spokojny, głęboki oddech do szczytu klatki"
        ]
      },
      {
        id: "a-prone-ytw",
        name: "Wznosy Y-T-W w leżeniu przodem",
        category: "Otwarta Klatka & Łopatki",
        type: "reps",
        reps: 8,
        sets: 3,
        restSame: 30,
        restNext: 0,
        equipment: "Mata",
        cue: "Kciuki skierowane pionowo w sufit. Po 8 powtórzeń na każdą literę (Y, T, W). Ściągaj łopatki mocno w dół i do siebie.",
        keyPoints: [
          "Y: kciuki w górę, ruch z dolnego czworobocznego",
          "T: ramiona w bok, maksymalne ściśnięcie łopatek",
          "W: łokcie wąsko przy żebrach, ściągnięcie w dół",
          "Stopy złączone, pośladki spięte przez całą serię"
        ]
      }
    ]
  },
  {
    id: "session-b",
    name: "Sesja B",
    shortTitle: "Wiosłowanie & Core",
    title: "Sesja B: Wytrzymałość Wiosłowania & Siła Core",
    description: "Wzmacnianie mięśni grzbietu, stabilizacja antyrotacyjna i wytrzymałość barków do długiego wiosłowania",
    defaultRestSame: 30,
    defaultRestNext: 60,
    exercises: [
      {
        id: "b-cobra-hold",
        name: "Prone Cobra z rotacją kciuków",
        category: "Górny Grzbiet & Łopatki",
        type: "timed",
        duration: 40,
        sets: 4,
        restSame: 30,
        restNext: 60,
        equipment: "Mata",
        cue: "Leżenie przodem, stopy złączone na macie. Unieś klatkę, rotuj kciuki maksymalnie w sufit i ściągaj łopatki w dół kręgosłupa.",
        keyPoints: [
          "Maksymalna zewnętrzna rotacja w barkach (kciuki w górę)",
          "Broda cofnięta (długa szyja, nie zadzieraj głowy)",
          "Pośladki napięte, stopy wklejone w matę"
        ]
      },
      {
        id: "b-swimmer-flutter",
        name: "Pływak surfingowy (Swimmer Kicks)",
        category: "Wytrzymałość Wiosłowania",
        type: "timed",
        duration: 30,
        sets: 4,
        restSame: 30,
        restNext: 60,
        equipment: "Mata",
        cue: "Klatka uniesiona. Naprzemienne unoszenie przeciwległej ręki i nogi z krótkim zatrzymaniem w szczycie.",
        keyPoints: [
          "Ruch kontrolowany i płynny, bez szarpania",
          "Kolana i klatka nie opadają na matę",
          "Ciągłe napięcie mięśni przykręgosłupowych"
        ]
      },
      {
        id: "b-band-paddle",
        name: "Wiosłowanie z gumą oporową",
        category: "Tor Wiosłowania & Siła",
        type: "timed",
        duration: 35,
        sets: 4,
        restSame: 30,
        restNext: 60,
        equipment: "Mata + lekka guma oporowa",
        cue: "W leżeniu na brzuchu pociągaj gumę wzdłuż tułowia imitując pełną fazę pociągnięcia w wodzie aż do bioder.",
        keyPoints: [
          "Pociągnięcie kończ za linią bioder z dopięciem tricepsa",
          "Łokcie nie uciekają szeroko na boki",
          "Stabilny tułów bez bujania biodrami"
        ]
      },
      {
        id: "b-dead-bug",
        name: "Dead Bug surfingowy (Anti-Extension)",
        category: "Core i Kontrola Miednicy",
        type: "reps",
        reps: 12,
        sets: 3,
        restSame: 30,
        restNext: 60,
        equipment: "Mata",
        cue: "Plecy dociśnięte do maty na 100%. Powolne, naprzemienne opuszczanie przeciwległej ręki i wyprostowanej nogi.",
        keyPoints: [
          "Lędźwie nie mogą oderwać się od maty nawet na milimetr",
          "Wydech przy wyproście kończyn",
          "Maksymalna kontrola mięśni głębokich brzucha"
        ]
      },
      {
        id: "b-popup-pause",
        name: "Pop-up z pauzą w dolnej pozycji",
        category: "Technika Pop-up",
        type: "reps",
        reps: 6,
        sets: 3,
        restSame: 30,
        restNext: 60,
        equipment: "Mata / Deska",
        cue: "Eksplozywny pop-up i natychmiastowe zamrożenie w niskiej pozycji surf stance na 2 sekundy przed wyprostowaniem.",
        keyPoints: [
          "Obie stopy lądują cicho w osi deski",
          "Niski środek ciężkości, kolana ugięte do wewnątrz",
          "Sprawdź rozkład masy: 50% przód, 50% tył"
        ]
      },
      {
        id: "b-side-plank-rotation",
        name: "Plank boczny z rotacją pod tułów",
        category: "Stabilizacja Skośna (Anti-Rotation)",
        type: "reps",
        reps: 8,
        sides: true,
        sets: 3,
        restSame: 30,
        restNext: 60,
        equipment: "Mata",
        cue: "Podpór bokiem na przedramieniu. Sięgaj górną ręką głęboko pod żebra, a następnie otwórz klatkę do sufitu.",
        keyPoints: [
          "Biodra uniesione wysoko przez cały czas serii",
          "Kontrolowana rotacja klatki bez utraty balansu",
          "8 powtórzeń na stronę lewą i prawą"
        ]
      },
      {
        id: "b-thoracic-thread-needle",
        name: "Nawlekanie igły (Thread the Needle)",
        category: "Mobilność Klatki Piersiowej",
        type: "timed",
        duration: 40,
        sides: true,
        sideLabel: "na stronę",
        sets: 3,
        restSame: 30,
        restNext: 0,
        equipment: "Mata",
        cue: "Klęk podparty. Przełóż rękę pod tułowiem kładąc bark na macie, a z wydechem otwórz klatkę pionowo ku górze.",
        keyPoints: [
          "Biodra zostają nieruchomo nad kolanami",
          "Ruch rotacji pochodzi wyłącznie z odcinka piersiowego",
          "Głęboki, spokojny oddech rozluźniający plecy"
        ]
      }
    ]
  },
  {
    id: "session-c",
    name: "Sesja C",
    shortTitle: "Balans & Mobilność",
    title: "Sesja C: Mobilność Bioder, Balans & Zwinność",
    description: "Głębokie zakresy ruchu w biodrach i skokowych, eksplozywne przejścia i stabilizacja na niestabilnym podłożu",
    defaultRestSame: 30,
    defaultRestNext: 60,
    exercises: [
      {
        id: "c-hip-90-90",
        name: "Rotacja bioder 90/90 z uniesieniem",
        category: "Mobilność Bioder",
        type: "reps",
        reps: 8,
        sides: true,
        sets: 3,
        restSame: 30,
        restNext: 60,
        equipment: "Mata",
        cue: "Siedząc w pozycji 90/90 płynnie unoś biodra do wyprostu napinając pośladki, a następnie powoli schodź w dół.",
        keyPoints: [
          "Kąty 90° w obu kolanach i biodrach",
          "Aktywne dopięcie pośladka w szczycie uniesienia",
          "Płynne przejście na drugą stronę"
        ]
      },
      {
        id: "c-deep-squat-prying",
        name: "Głęboki przysiad z rozpychaniem kolan (Deep Squat)",
        category: "Mobilność Bioder & Kostek",
        type: "timed",
        duration: 45,
        sets: 3,
        restSame: 30,
        restNext: 60,
        equipment: "Mata",
        cue: "Zejdź w najgłębszy możliwy przysiad. Łokciami delikatnie rozpychaj kolana na zewnątrz, klatka dumnie wyprostowana.",
        keyPoints: [
          "Pięty w 100% oparte na podłodze",
          "Przenoś delikatnie ciężar z prawej na lewą kostkę",
          "Oddychaj przeponą w dolnej pozycji"
        ]
      },
      {
        id: "c-cushion-surf-balance",
        name: "Stanie surfingowe na poduszce balansowej",
        category: "Równowaga & Propriocepcja",
        type: "timed",
        duration: 40,
        sides: true,
        sideLabel: "na nogę wiodącą",
        sets: 3,
        restSame: 30,
        restNext: 60,
        equipment: "Poduszka sensoryczna / dysk balansowy",
        cue: "Niska pozycja surfingowa na poduszce. Utrzymuj stabilność tułowia wykonując delikatne ruchy ramionami.",
        keyPoints: [
          "Wzrok skierowany przed siebie w horyzont",
          "Kolana ugięte, amortyzujące mikroruchy",
          "Zmień nogę wykroczną w kolejnej serii"
        ]
      },
      {
        id: "c-fast-popup",
        name: "Fast Pop-up Drill (Czas reakcji)",
        category: "Dynamika Pop-up",
        type: "reps",
        reps: 6,
        sets: 4,
        restSame: 30,
        restNext: 60,
        equipment: "Mata / Deska",
        cue: "Z leżenia przodem maksymalnie szybkie, eksplozywne wyjście do pozycji surf stance. Cel: minimalny czas od sygnału do lądowania.",
        keyPoints: [
          "Zdecydowane, mocne odepchnięcie dłońmi",
          "Stopy trafiają idealnie w swoje miejsca za jednym razem",
          "Po wylądowaniu zatrzymaj stabilną pozycję na ułamek sekundy"
        ]
      },
      {
        id: "c-cossack-squat",
        name: "Przysiady kozackie (Cossack Squats)",
        category: "Mobilność Bioder & Przywodziciele",
        type: "reps",
        reps: 8,
        sides: true,
        sets: 3,
        restSame: 30,
        restNext: 60,
        equipment: "Mata",
        cue: "Szeroki rozkrok. Zejdź głęboko na jedną nogę zginając kolano i biodro, podczas gdy druga noga zostaje prosta z palcami w sufit.",
        keyPoints: [
          "Pięta nogi ugiętej dociśnięta do maty",
          "Plecy proste, klatka otwarta",
          "Płynne, kontrolowane tempo zejścia"
        ]
      },
      {
        id: "c-duck-dive-pushup",
        name: "Duck-dive Push-up (Fala / Pomka hinduska)",
        category: "Mobilność Barków & Siła Pop-up",
        type: "reps",
        reps: 8,
        sets: 3,
        restSame: 30,
        restNext: 60,
        equipment: "Mata",
        cue: "Z pozycji psa z głową w dół nurkuj klatką nisko nad matą przechodząc płynnie do psa z głową w górę, a potem wracaj.",
        keyPoints: [
          "Łopatki pracują w pełnym zakresie",
          "Mocne otwarcie klatki w szczycie",
          "Ruch odwzorowuje nurkowanie pod nadchodzącą falę"
        ]
      },
      {
        id: "c-lizard-quad-stretch",
        name: "Lizard Pose z otwarciem klatki",
        category: "Mobilność Zginaczy Bioder",
        type: "timed",
        duration: 40,
        sides: true,
        sideLabel: "na stronę",
        sets: 3,
        restSame: 30,
        restNext: 0,
        equipment: "Mata",
        cue: "Głęboki wykrok jaszczurki. Opuść biodra w dół do maty, unieś jedno ramię i skręć klatkę w stronę kolana wykrocznego.",
        keyPoints: [
          "Poczuj rozciąganie z przodu biodra nogi zakrocznej",
          "Nie skręcaj miednicy na siłę, oddychaj głęboko",
          "Wykonaj po 40 sekund na obie strony"
        ]
      }
    ]
  }
];

// Domyślna konfiguracja dla wstecznej kompatybilności
export const WORKOUT_CONFIG = WORKOUT_SESSIONS[0];
