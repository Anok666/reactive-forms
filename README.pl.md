# Reactive Forms Starter (PL)

Techniczne demo (Angular 21) formularza krokowego "Utworz klienta", z dynamicznymi zgodami
i nawigacja krokow oparta o URL.

English version: `README.md`.

## Zakres projektu i zalozenia

- To jest aplikacja demonstracyjna architektury formularza, a nie gotowa integracja backendowa.
- Zlozonosc jest celowo umiarkowana, ale obejmuje:
  - walidacje warunkowa (`PERSON` vs `COMPANY`),
  - dynamiczne kontrolki (`FormRecord` dla zgod),
  - kroki kreatora zsynchronizowane z historia przegladarki (`?step=1|2`),
  - mapowanie formularza do payloadu i tryb read-only po zapisie.
- Logika domenowa jest utrzymywana glownie w serwisach, nie w szablonach.

## Szybki start

```bash
npm install
npm start
```

## Jakosc i build

```bash
npm run lint
npm run lint:fix
npm run format
npm run format:check
npm run build
```

## Testy

```bash
npm test
```

Runner: `ng test` + Vitest globals (`tsconfig.spec.json`).

Zakres testow:
- `ClientFormService`:
  - przepinanie walidatorow dla `PERSON`/`COMPANY`,
  - synchronizacja kontrolek zgod,
  - reset zaznaczen zgod,
  - reset danych szczegolowych i stan `pristine`/`untouched`.
- `ClientCreatePageComponent`:
  - glowny przeplyw krok 1 -> krok 2 -> zapis z mockami routera i API.
- `ThemePreferenceService`:
  - przelaczanie klasy `dark`.
- `App`:
  - smoke test shella aplikacji.

## Przeplyw funkcjonalny

### Krok 1: dane klienta

Profil walidacji zalezy od `clientType`:
- `PERSON`: wymagane `firstName`, `lastName`, `email`.
- `COMPANY`: wymagane `companyName`, `nip`, `email` (wzorzec dla `nip`).

Przy zmianie typu klienta:
- pola szczegolowe sa czyszczone (w tym `email`),
- kontrolki sa oznaczane jako `pristine` i `untouched` (brak falszywego "error state"),
- walidatory sa przepinane do aktywnego profilu.

### Krok 2: zgody dynamiczne

`ConsentsApiService.getConsents(clientType)` filtruje zgody po:
- `inUse === true`,
- opcjonalnym `forClientTypes` (w `ConsentDto`).

Model formularza dla zgod: `FormRecord<FormControl<boolean>>`, kluczowany po `code`.
Dla zgod wymaganych stosowane jest `Validators.requiredTrue`.

Przy zmianie typu:
- zaznaczenia zgod sa zerowane,
- kontrolki sa synchronizowane z nowym zestawem zgod (dodanie/usuniecie/aktualizacja walidatorow).

### Nawigacja krokow i historia

Stan kroku jest trzymany w query param:
- `step=1` -> dane,
- `step=2` -> zgody.

Dzieki temu:
- dziala natywne cofanie/przechodzenie do przodu w przegladarce,
- wejscie na `step=2` bez poprawnych danych skutkuje powrotem do `step=1`.

### Zapis

Po przejsciu walidacji:
- formularz mapuje sie do `CreateClientPayload`,
- payload jest wyswietlany jako JSON preview,
- formularz przechodzi w tryb read-only.

## Strategia implementacji

Podejscie: "serwis domenowy + cienki komponent orkiestrujacy".

1. **Modele i kontrakty**
   - Typy formularza/payloadu: `features/client-create/models`.
   - `ConsentDto.forClientTypes` wspiera zgody zalezne od typu klienta.

2. **Serwis jako centrum logiki formularza**
   - `ClientFormService` odpowiada za:
     - fabryke formularza,
     - przepinanie walidatorow,
     - polityke resetu/touch,
     - synchronizacje dynamicznych kontrolek zgod.

3. **Komponent strony jako orkiestrator reaktywny**
   - `ClientCreatePageComponent` laczy route params, formularz i API zgod.
   - `clientType.valueChanges` steruje odswiezaniem zgod (`switchMap`) i synchronizacja stanu.
   - Query params steruja aktywnym krokiem i historia przegladarki.

4. **Komponenty krokow jako warstwa prezentacji**
   - `ClientStepDetails` i `ClientStepConsents` skupiaja sie na renderowaniu i helperach UI.
   - Nie przechowuja logiki domenowej przeplywu.

5. **Latwe hotfixy UX**
   - Poprawki UX (reset danych, reset zgod, historia, stabilnosc walidacji) sa lokalizowane
     i testowalne bez duzych refaktorow.

## Decyzje inzynierskie (Decyzja -> Trade-off -> Rezultat)

1. **Decyzja:** Logike formularza trzymac w `ClientFormService`, a nie w komponentach UI.
   **Trade-off:** Wiecej metod serwisowych i kodu orkiestrujacego.
   **Rezultat:** Przewidywalne zachowanie, czytelniejsze szablony i prostsze testowanie logiki walidacji/resetu.

2. **Decyzja:** Stan zgod oparty o `FormRecord<FormControl<boolean>>`.
   **Trade-off:** Potrzebna jawna synchronizacja kontrolek przy zmianie definicji zgod.
   **Rezultat:** Skalowalny, typowany model `code -> accepted`, latwy do mapowania na payload API.

3. **Decyzja:** Sterowanie krokiem przez query param (`?step=1|2`).
   **Trade-off:** Dodatkowa zlozonosc walidacji wejscia i redirectow.
   **Rezultat:** Dziala natywna historia przegladarki (wstecz/dalej), mozliwy deep-link i kontrola niepoprawnego wejscia na krok 2.

4. **Decyzja:** Czyszczenie danych szczegolowych i zgod przy zmianie `clientType`.
   **Trade-off:** Uzytkownik musi ponownie uzupelnic dane po przelaczeniu typu.
   **Rezultat:** Brak "wycieku" danych miedzy profilami (PERSON/COMPANY) i brak przenoszenia nieaktualnych zaznaczen zgod.

5. **Decyzja:** Po resetach programowych ustawiac `pristine` i `untouched`.
   **Trade-off:** Wiecej jawnego zarzadzania stanem kontrolek.
   **Rezultat:** Brak falszywych sygnalow bledu (czerwonych ramek) tuz po wewnetrznym resecie formularza.

## Aktualna struktura projektu

```text
src/app/
  app.ts / app.html / app.routes.ts
  core/
    theme/
  features/
    client-create/
      models/
      mocks/
      services/
      pages/
      steps/
  shared/   # placeholder (.gitkeep)
  layout/   # placeholder (.gitkeep)
```

## Proponowany dalszy rozwoj

- Podmiana mock API na realna integracje (`core/http`, interceptory).
- Testy integracyjne dla route-driven step navigation.
- Testy e2e (Playwright/Cypress) dla krytycznych scenariuszy kreatora.
