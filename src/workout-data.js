// Konfiguracja planów treningowych do surfingu (3 warianty sesji z polskimi nazwami ćwiczeń)
// Wygenerowano na podstawie Bazy ćwiczeń programu przygotowania surfingowego.

export const WORKOUT_SESSIONS = [
  {
    id: "variant-1",
    name: "Wariant 1",
    shortTitle: "Wstawanie i Balans",
    title: "Wariant 1: Technika wstawania i balans poprzeczny",
    description: "Zwężenie toru ruchu nóg przy ścianie, wklejenie tylnej pięty, balans poprzeczny na poduszce.",
    defaultRestSame: 30,
    defaultRestNext: 30,
    exercises: [
      {
        id: "w1-rozgrzewka",
        name: "Rozciąganie wstępne",
        category: "Mobilizacja i Rozgrzewka",
        type: "timed",
        duration: 600,
        sets: 1,
        restSame: 0,
        restNext: 30,
        equipment: "Mata / wolna przestrzeń",
        cue: "Krążenia ramion, otwieranie klatki piersiowej, wypady z rotacją tułowia, pies z głową w dół do kobry, dociskanie stawów skokowych.",
        keyPoints: [
          "Podniesienie temperatury tkanek",
          "Dynamiczna mobilizacja bioder, skoków i barków",
          "Mobilizacja kręgosłupa piersiowego przed obciążeniem"
        ]
      },
      {
        id: "w1-pompki-futryna",
        name: "Pompki wąskie w futrynie drzwi",
        category: "Góra ciała / Pchanie",
        type: "reps",
        reps: 10,
        sets: 3,
        restSame: 30,
        restNext: 30,
        equipment: "Futryna drzwi",
        cue: "Dłonie na futrynie na szerokość dolnych żeber. Stopy płasko na ziemi. Łokcie prowadzone ściśle przy tułowiu.",
        keyPoints: [
          "Wąski chwyt odpowiadający fazie wstawania na desce",
          "Łokcie nie rozchodzą się na boki",
          "Napięty brzuch i pośladki, tułów w linii prostej"
        ]
      },
      {
        id: "w1-wznosy-rotacja",
        name: "Wznosy hantli bokiem i rotacja ramion",
        category: "Barki i Stożek rotatorów",
        type: "reps",
        reps: 12,
        sets: 3,
        restSame: 30,
        restNext: 30,
        equipment: "Hantle 2 kg",
        cue: "Wznos ramion bokiem do poziomu barków, zgięcie łokci do 90° i rotacja zewnętrzna przedramion w górę.",
        keyPoints: [
          "Ruch kontrolowany bez bujania tułowiem",
          "Wzmocnienie stożka rotatorów i mięśni naramiennych",
          "Barki opuszczone z dala od uszu"
        ]
      },
      {
        id: "w1-przyciaganie-pilka",
        name: "Przyciąganie kolan na piłce gimnastycznej z dłońmi na desce",
        category: "Brzuch i Zginacze bioder",
        type: "reps",
        reps: 10,
        sets: 3,
        restSame: 30,
        restNext: 30,
        equipment: "Piłka gimnastyczna + Deska surfingowa (lub mata)",
        cue: "Podpór przodem z dłońmi na desce, stopy na piłce. Dynamiczne przyciągnięcie kolan pod klatkę piersiową z lekkim uniesieniem bioder.",
        keyPoints: [
          "Dłonie stabilnie na desce w strefie oparcia do wstawania",
          "Eksplozywna kompresja nóg pod tułów",
          "Kontrolowany powrót do idealnej linii podporu"
        ]
      },
      {
        id: "w1-przysiady-krawedzie",
        name: "Przysiady surfingowe z dotknięciem krawędzi deski",
        category: "Nogi i Mobilność",
        type: "reps",
        reps: 10,
        sets: 3,
        restSame: 30,
        restNext: 30,
        equipment: "Deska surfingowa (lub mata)",
        cue: "Pozycja surfingowa: tylna stopa 85–90°, przednia 45°. Zejdź w głęboki przysiad i dotknij opuszkami palców obu krawędzi deski.",
        keyPoints: [
          "Tylna pięta w 100% przyklejona do pokładu",
          "Klatka uniesiona, nie zginaj się wyłącznie w pasie",
          "Zatrzymaj ruch na 1 sekundę na dole"
        ]
      },
      {
        id: "w1-wioslowanie-poduszka",
        name: "Wiosłowanie na desce z poduszką balansową",
        category: "Plecy i Balans poprzeczny",
        type: "timed",
        duration: 40,
        sets: 3,
        restSame: 30,
        restNext: 30,
        equipment: "Deska + poduszka balansowa",
        cue: "Deska na poduszce sensomotorycznej. Wiosłuj wąsko tuż przy burtach deski. Koryguj przechyły boczne napięciem tułowia.",
        keyPoints: [
          "Dłonie wchodzą blisko dziobu i schodzą wąsko pod tułów",
          "Stopy złączone, pośladki spięte, klatka uniesiona",
          "Zakaz dotykania podłogi stopami lub dłońmi"
        ]
      },
      {
        id: "w1-wstawanie-sciana",
        name: "Wstawanie na desce przy ścianie",
        category: "Technika wstawania",
        type: "reps",
        reps: 6,
        sides: true,
        sideLabel: "na stronę",
        sets: 3,
        restSame: 45,
        restNext: 30,
        equipment: "Deska przy ścianie",
        cue: "Deska dosunięta do ściany. Kolano i stopa muszą przejść wąsko pod klatką bez dotknięcia ściany. Po serii obróć deskę o 180°.",
        keyPoints: [
          "Ściana fizycznie blokuje wyrzucanie kolana na zewnątrz",
          "Prowadzenie nóg ściśle w osi podłużnej deski",
          "Wklejenie tylnej stopy i niska pozycja surfingowa"
        ]
      },
      {
        id: "w1-wstawanie-dwuetapowe",
        name: "Dwuetapowe wstawanie na deskę",
        category: "Technika wstawania",
        type: "reps",
        reps: 8,
        sets: 3,
        restSame: 30,
        restNext: 30,
        equipment: "Deska surfingowa (lub mata)",
        cue: "Faza pchnięcia -> Krok 1: postaw tylną stopę pod kątem 85–90° z wklejoną piętą -> Krok 2: dostaw przednią stopę między dłonie.",
        keyPoints: [
          "Cała tylna stopa wraz z piętą dociśnięta do pokładu",
          "Dłonie płasko pod dolnymi żebrami (bez chwytania krawędzi)",
          "Zablokowanie pozycji w stabilnym niskim przysiadzie"
        ]
      },
      {
        id: "w1-wstawanie-klasyczne",
        name: "Klasyczne wstawanie na desce",
        category: "Integracja techniczna",
        type: "reps",
        reps: 10,
        sets: 1,
        restSame: 0,
        restNext: 30,
        equipment: "Deska surfingowa",
        cue: "Płynne, dynamiczne wyjście z leżenia do pozycji surfingowej. Stopy lądują w osi deski, obie pięty wklejone, niski środek ciężkości.",
        keyPoints: [
          "Eksplozywne odepchnięcie z jednoczesnym wyrzutem bioder",
          "Zatrzymanie na 1–2 sekundy w stabilnej postawie",
          "Powrót do leżenia i 10–15 sekund odpoczynku przed kolejnym powtórzeniem"
        ]
      },
      {
        id: "w1-rozciaganie-koncowe",
        name: "Rozciąganie końcowe i wyciszenie",
        category: "Regeneracja i Wyciszenie",
        type: "timed",
        duration: 300,
        sets: 1,
        restSame: 0,
        restNext: 0,
        equipment: "Mata / Deska",
        cue: "Pozycja dziecka, rozciąganie pośladka w pozycji gołębia, rozciąganie zginaczy bioder w wykroku, rozciąganie tyłu ud w siadzie prostym.",
        keyPoints: [
          "Wyciszenie układu nerwowego i obniżenie tętna",
          "Głębokie oddychanie przeponowe",
          "Spokojne rozciąganie statyczne bez szarpania"
        ]
      }
    ]
  },
  {
    id: "variant-2",
    name: "Wariant 2",
    shortTitle: "Wytrzymałość Wiosłowania",
    title: "Wariant 2: Wytrzymałość wiosłowania i otwarta klatka",
    description: "Siła mięśni grzbietu, retrakcja łopatek, nawyk złączonych stóp i odporność na zmęczenie barków.",
    defaultRestSame: 30,
    defaultRestNext: 30,
    exercises: [
      {
        id: "w2-rozgrzewka",
        name: "Rozciąganie wstępne",
        category: "Mobilizacja i Rozgrzewka",
        type: "timed",
        duration: 600,
        sets: 1,
        restSame: 0,
        restNext: 30,
        equipment: "Mata / wolna przestrzeń",
        cue: "Krążenia ramion, otwieranie klatki piersiowej, wypady z rotacją tułowia, pies z głową w dół do kobry, dociskanie stawów skokowych.",
        keyPoints: [
          "Podniesienie temperatury tkanek",
          "Dynamiczna mobilizacja bioder, skoków i barków",
          "Mobilizacja kręgosłupa piersiowego"
        ]
      },
      {
        id: "w2-rozciaganie-klatka",
        name: "Rozciąganie klatki piersiowej w futrynie drzwi",
        category: "Klatka piersiowa / Mobilność",
        type: "timed",
        duration: 30,
        sides: true,
        sideLabel: "na stronę",
        sets: 3,
        restSame: 20,
        restNext: 30,
        equipment: "Futryna drzwi / Ściana",
        cue: "Przedramię oparte pionowo o futrynę pod kątem 90° lub 120°. Krok w przód nogą wykroczną i delikatna rotacja tułowia.",
        keyPoints: [
          "Usunięcie przykurczów mięśni piersiowych",
          "Ułatwienie retrakcji łopatek i wyprostu klatki",
          "Brak przeprostu w odcinku lędźwiowym"
        ]
      },
      {
        id: "w2-wioslowanie-tasma",
        name: "Wiosłowanie w pionie z taśmą oporową",
        category: "Plecy i Ramiona",
        type: "timed",
        duration: 45,
        sets: 3,
        restSame: 30,
        restNext: 30,
        equipment: "Stojąc + taśma / guma oporowa",
        cue: "Chwyć taśmę oburącz na szerokość barków pod stałym napięciem. Wykonuj dynamiczne ruchy wiosłowania w dół i w tył.",
        keyPoints: [
          "Barki nisko z dala od uszu",
          "Ruch wyprowadzany z mięśni najszerszych grzbietu i tricepsów",
          "Utrzymanie stabilnego pionowego tułowia"
        ]
      },
      {
        id: "w2-wyciskanie-nad-glowe",
        name: "Wyciskanie hantli nad głowę",
        category: "Barki / Góra ciała",
        type: "reps",
        reps: 10,
        sets: 3,
        restSame: 30,
        restNext: 30,
        equipment: "Hantle 5 kg",
        cue: "Hantle na wysokości barków, łokcie lekko przed tułowiem. Wyciskaj pionowo nad głowę do pełnego wyprostu ramion.",
        keyPoints: [
          "Zepnij brzuch i pośladki, bez odchylania tułowia w tył",
          "Pełen kontrolowany zakres ruchu",
          "Stabilny oddech przy wyciskaniu"
        ]
      },
      {
        id: "w2-pompki-parapet",
        name: "Pompki wąskie przy parapecie",
        category: "Klatka i Triceps / Pchanie",
        type: "reps",
        reps: 10,
        sets: 3,
        restSame: 30,
        restNext: 30,
        equipment: "Parapet okienny / Stół",
        cue: "Dłonie na szerokość żeber oparte o parapet, stopy na palcach. Uginaj ramiona prowadząc łokcie ściśle przy ciele.",
        keyPoints: [
          "Tułów w idealnej linii prostej",
          "Wąski rozstaw dłoni jak w fazie wstawania",
          "Kontrolowane tempo opuszczania i mocne pchnięcie"
        ]
      },
      {
        id: "w2-izometria-brzuch",
        name: "Izometria na brzuchu z klockiem między kostkami",
        category: "Pośladki i Nogi / Izometria",
        type: "timed",
        duration: 40,
        sets: 3,
        restSame: 30,
        restNext: 30,
        equipment: "Deska surfingowa (lub mata) + klocek / piłka",
        cue: "Klocek zaciśnięty mocno między kostkami. Unieś kolana 2–3 cm nad pokład siłą pośladków. Klatka uniesiona, wzrok przed siebie.",
        keyPoints: [
          "Nogi wyprostowane w kolanach, uniesienie wynika z pośladków",
          "Wymuszenie nawyku złączonych stóp na desce",
          "Dłonie przy dolnych żebrach, łokcie wąsko"
        ]
      },
      {
        id: "w2-wioslowanie-powietrze",
        name: "Wiosłowanie w powietrzu z klockiem między kostkami",
        category: "Stabilizacja tułowia i Wiosłowanie",
        type: "timed",
        duration: 30,
        sets: 3,
        restSame: 30,
        restNext: 30,
        equipment: "Deska + klocek / piłka",
        cue: "Dolna połowa ciała zablokowana ze ściśniętym klockiem. Dynamiczna, naprzemienna praca ramion w powietrzu wąsko wzdłuż burt.",
        keyPoints: [
          "Całkowity brak kołysania miednicą na boki",
          "Kolana ani na chwilę nie opadają na deskę",
          "Głęboki, rytmiczny tor pociągnięcia ramion"
        ]
      },
      {
        id: "w2-boczne-sieganie",
        name: "Boczne sięganie w leżeniu na brzuchu",
        category: "Mięśnie skośne i Grzbiet",
        type: "reps",
        reps: 12,
        sets: 3,
        restSame: 30,
        restNext: 30,
        equipment: "Deska surfingowa (lub mata)",
        cue: "W leżeniu na brzuchu ze spiętymi pośladkami naprzemiennie sięgaj dłonią wzdłuż burty deski w stronę kolana (po 6 na stronę).",
        keyPoints: [
          "Ruch boczny w płaszczyźnie poziomej bez wyginania w łuk",
          "Dolna część ciała od miednicy w dół całkowicie nieruchoma",
          "Płynna aktywacja mięśni skośnych brzucha"
        ]
      },
      {
        id: "w2-wznosy-ytw",
        name: "Wznosy ramion w leżeniu przodem (litery Y-T-W)",
        category: "Łopatki i Plecy",
        type: "reps",
        reps: 6,
        sets: 3,
        restSame: 45,
        restNext: 30,
        equipment: "Deska surfingowa (lub mata)",
        cue: "W leżeniu przodem wykonaj sekwencję wznosów ramion z kciukami w sufit: Y (kąt 45°), T (w bok), W (łokcie ściągnięte do żeber).",
        keyPoints: [
          "Po 6 powtórzeń na każdą literę",
          "Ruch inicjowany pracą łopatek, a nie szyją",
          "Wzmocnienie mięśni utrzymujących otwartą klatkę piersiową"
        ]
      },
      {
        id: "w2-wstawanie-klasyczne",
        name: "Klasyczne wstawanie na desce",
        category: "Integracja techniczna",
        type: "reps",
        reps: 10,
        sets: 1,
        restSame: 0,
        restNext: 30,
        equipment: "Deska surfingowa",
        cue: "10 pełnych wstawień w tempie technicznym. Wklejona tylna pięta, wąskie kolana pod klatką, stabilna postawa surfingowa.",
        keyPoints: [
          "Czystość techniczna każdego powtórzenia",
          "Tylna stopa pod kątem 85–90° do osi",
          "Krótka pauza na pokładzie przed powrotem do leżenia"
        ]
      },
      {
        id: "w2-rozciaganie-koncowe",
        name: "Rozciąganie końcowe i wyciszenie",
        category: "Regeneracja i Wyciszenie",
        type: "timed",
        duration: 300,
        sets: 1,
        restSame: 0,
        restNext: 0,
        equipment: "Mata / Deska",
        cue: "Pozycja dziecka, gołąb na pośladki, wykrok na zginacze bioder, siad prosty na tył ud.",
        keyPoints: [
          "Wyciszenie układu nerwowego",
          "Spokojne oddychanie",
          "Statyczna regeneracja mięśni"
        ]
      }
    ]
  },
  {
    id: "variant-3",
    name: "Wariant 3",
    shortTitle: "Moc i Kompresja",
    title: "Wariant 3: Moc, stabilizacja głęboka i eksplozywne wstawanie",
    description: "Dynamiczne zgięcie bioder, siła mięśni posturalnych, mobilność stawu skokowego i transfer mocy.",
    defaultRestSame: 30,
    defaultRestNext: 30,
    exercises: [
      {
        id: "w3-rozgrzewka",
        name: "Rozciąganie wstępne",
        category: "Mobilizacja i Rozgrzewka",
        type: "timed",
        duration: 600,
        sets: 1,
        restSame: 0,
        restNext: 30,
        equipment: "Mata / wolna przestrzeń",
        cue: "Krążenia ramion, otwieranie klatki piersiowej, wypady z rotacją tułowia, pies z głową w dół do kobry, dociskanie stawów skokowych.",
        keyPoints: [
          "Podniesienie temperatury tkanek",
          "Dynamiczna mobilizacja stawów",
          "Przygotowanie do pracy eksplozywnej"
        ]
      },
      {
        id: "w3-pompki-stol",
        name: "Pompki wąskie przy stole",
        category: "Klatka i Triceps / Pchanie",
        type: "reps",
        reps: 10,
        sets: 3,
        restSame: 30,
        restNext: 30,
        equipment: "Niski stół / Parapet",
        cue: "Dłonie wąsko na krawędzi niskiego stołu, większe nachylenie tułowia. Prowadź łokcie ściśle wzdłuż żeber.",
        keyPoints: [
          "Zwiększony opór dzięki niższemu kątowi podparcia",
          "Mocna faza wypchnięcia tułowia",
          "Napięty brzuch i pośladki w jednej linii"
        ]
      },
      {
        id: "w3-miks-hantle",
        name: "Łączona seria hantlami: wznosy bokiem i wyciskanie nad głowę",
        category: "Barki kompleksowo",
        type: "reps",
        reps: 8,
        sets: 3,
        restSame: 45,
        restNext: 30,
        equipment: "Hantle 2 kg + 5 kg",
        cue: "Najpierw 8 wznosów bokiem hantlami 2 kg, a następnie natychmiast 8 wyciśnięć nad głowę hantlami 5 kg.",
        keyPoints: [
          "Płynne przejście między hantlami bez przerwy",
          "Kontrola toru ruchu barków bez zarzucania ciałem",
          "Pełne zaangażowanie stożka rotatorów i naramiennych"
        ]
      },
      {
        id: "w3-wioslowanie-dynamiczne",
        name: "Wiosłowanie w pionie z taśmą oporową (dynamiczne)",
        category: "Najszerszy grzbietu / Triceps",
        type: "timed",
        duration: 30,
        sets: 3,
        restSame: 30,
        restNext: 30,
        equipment: "Stojąc + taśma / guma",
        cue: "Maksymalnie szybkie, eksplozywne pociągnięcia z taśmą w pionie symulujące sprint ramion przed złapaniem fali.",
        keyPoints: [
          "Wysoka kadencja i dynamika pracy ramion",
          "Pionowa postawa tułowia",
          "Akcent na fazę pociągnięcia za linię bioder"
        ]
      },
      {
        id: "w3-przyciaganie-pilka",
        name: "Przyciąganie kolan na piłce gimnastycznej z dłońmi na desce",
        category: "Brzuch i Zginacze bioder",
        type: "reps",
        reps: 12,
        sets: 3,
        restSame: 30,
        restNext: 30,
        equipment: "Piłka gimnastyczna + Deska",
        cue: "Podpór przodem na desce ze stopami na piłce. Dynamiczne przyciągnięcie kolan pod klatkę z uniesieniem bioder.",
        keyPoints: [
          "Wzorzec eksplozywnego wciągania nóg pod tułów",
          "Stabilność dłoni na desce bez chwytania krawędzi",
          "Kontrolowany powrót do pozycji wyjściowej"
        ]
      },
      {
        id: "w3-skokowy-wykrok",
        name: "Głębokie rozciąganie stawu skokowego w wykroku",
        category: "Mobilność stawu skokowego",
        type: "timed",
        duration: 40,
        sides: true,
        sideLabel: "na nogę",
        sets: 3,
        restSame: 20,
        restNext: 30,
        equipment: "Deska surfingowa (lub mata)",
        cue: "Klęk jednonóż na desce. Dociskaj kolano maksymalnie w przód poza palce stóp z piętą dociśniętą do pokładu.",
        keyPoints: [
          "Pięta przedniej stopy musi w 100% przylegać do podłoża",
          "Dociążenie kolana ciężarem klatki piersiowej",
          "Zwiększenie zgięcia grzbietowego dla stabilnego lądowania"
        ]
      },
      {
        id: "w3-wioslowanie-poduszka",
        name: "Wiosłowanie na desce z poduszką balansową",
        category: "Plecy i Balans poprzeczny",
        type: "timed",
        duration: 35,
        sets: 3,
        restSame: 30,
        restNext: 30,
        equipment: "Deska + poduszka balansowa",
        cue: "Deska centralnie na poduszce. Prowadź dłonie wąsko przy burtach, stabilizując przechyły boczne mięśniami głębokimi.",
        keyPoints: [
          "Kontrola osi poprzecznej deski",
          "Złączone stopy i spięte pośladki",
          "Płynny, wąski tor ruchu ramion"
        ]
      },
      {
        id: "w3-wstawanie-sciana",
        name: "Wstawanie na desce przy ścianie",
        category: "Technika wstawania",
        type: "reps",
        reps: 6,
        sides: true,
        sideLabel: "na stronę",
        sets: 3,
        restSame: 45,
        restNext: 30,
        equipment: "Deska przy ścianie",
        cue: "Deska dosunięta do ściany. Wstawaj wąsko prowadząc nogi pod klatką bez dotknięcia ściany. Po serii obróć deskę o 180°.",
        keyPoints: [
          "Fizyczna eliminacja wyrzucania kolana na zewnątrz",
          "Ruch ściśle w osi deski",
          "Błyskawiczne wklejenie obu stóp"
        ]
      },
      {
        id: "w3-przysiady-krawedzie",
        name: "Przysiady surfingowe z dotknięciem krawędzi deski",
        category: "Nogi i Pozycja surfingowa",
        type: "reps",
        reps: 10,
        sets: 3,
        restSame: 30,
        restNext: 30,
        equipment: "Deska surfingowa",
        cue: "Głęboki przysiad w pozycji surfingowej z jednoczesnym dotknięciem obu burt deski opuszkami palców.",
        keyPoints: [
          "Tylna pięta stale wklejona w deskę",
          "Niska kompresja i stabilny tułów",
          "Pauza 1 sekundy w dolnym punkcie"
        ]
      },
      {
        id: "w3-wstawanie-klasyczne",
        name: "Klasyczne wstawanie na desce",
        category: "Integracja techniczna",
        type: "reps",
        reps: 10,
        sets: 1,
        restSame: 0,
        restNext: 30,
        equipment: "Deska surfingowa",
        cue: "10 powtórzeń pełnego wstawania na desce z maksymalną dynamiką i powtarzalnością pozycji lądowania.",
        keyPoints: [
          "Odepchnięcie dłońmi pod dolnymi żebrami",
          "Jednoczesne zablokowanie obu stóp na pokładzie",
          "Odpoczynek 10–15 sekund między powtórzeniami"
        ]
      },
      {
        id: "w3-rozciaganie-koncowe",
        name: "Rozciąganie końcowe i wyciszenie",
        category: "Regeneracja i Wyciszenie",
        type: "timed",
        duration: 300,
        sets: 1,
        restSame: 0,
        restNext: 0,
        equipment: "Mata / Deska",
        cue: "Wyciszenie oddechu, rozciąganie pośladków, tyłu ud, zginaczy bioder i klatki piersiowej.",
        keyPoints: [
          "Obniżenie tętna",
          "Relaksacja mięśniowa",
          "Regeneracja po wysiłku"
        ]
      }
    ]
  }
];

export const WORKOUT_CONFIG = WORKOUT_SESSIONS[0];
