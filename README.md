# Reactive Forms Starter

Aplikacja demonstracyjna: „Utwórz klienta” z formularzem krokowym, dynamicznymi zgodami i walidacją opartą o Reactive Forms.

## Start

```bash
npm install
npm start
```

## Jakość kodu

```bash
npm run lint
npm run lint:fix
npm run format
npm run format:check
npm run build
```

## Testy

Runner: **`ng test`** (Angular unit tests) z **Vitest** (`tsconfig.spec.json`: `vitest/globals`). Mocki spy: **`vi`** z `vitest`.

```bash
npm test
```

**Co jest pokryte testami (skrót):**

- **`ClientFormService`** — walidacja `PERSON` / `COMPANY`, synchronizacja i czyszczenie zgód (`FormRecord`), reset pól szczegółów przy zmianie typu (w tym `pristine` / `untouched` po programowym `setValue`).
- **`ClientCreatePageComponent`** — jeden scenariusz przepływu krok 1 → krok 2 → zapis z mockiem routera i API zgód.
- **`ThemePreferenceService`** — klasa `dark` na `document.documentElement`.
- **`App`** — utworzenie komponentu i obecność `router-outlet`.

Brak testów e2e (Playwright/Cypress) — celowo, to mały starter.

## Co jest zaimplementowane

- **Krok 1:** dane klienta (`PERSON` / `COMPANY`) z walidacją warunkową. Przy **zmianie typu klienta** czyszczone są pola szczegółów (w tym email) oraz zaznaczenia zgód; kontrolki po resecie są **`pristine` / `untouched`**, żeby uniknąć czerwonej ramki „jak po błędzie” (programowy `setValue` ustawia `dirty`).
- **Krok 2:** zgody z mockowego API: filtrowanie `inUse`, opcjonalnie **`forClientTypes`** w DTO (inne zestawy dla osoby i firmy). Checkboxy, `requiredTrue` dla wymaganych zgód.
- **Nawigacja:** query param **`?step=1`** (dane) / **`?step=2`** (zgody) + **`Location.back()`** przy „Wstecz”, żeby **historia przeglądarki** (wstecz / dalej) odpowiadała krokom.
- **Zapis:** mapowanie formularza do payloadu, podgląd JSON i `console.log` w dev.

## Decyzje techniczne (krótko)

Formularz jest zbudowany w **`ClientFormService`**, żeby trzymać logikę walidacji poza komponentami UI. Zgody są w **`FormRecord<FormControl<boolean>>`** (`code → accepted`) i mapują się do payloadu.

**Zgody i typ klienta:** strumień z **`ConsentsApiService.getConsents(clientType)`** jest podpięty pod **`clientType.valueChanges`** (z `startWith`), potem **`switchMap`**, **`tap`** z `syncConsentControls` oraz **`shareReplay`** — przy zmianie typu przeładowywany jest zestaw zgód, a wcześniejsze zaznaczenia są czyszczone przed synchronizacją.

W kroku 2 jest prosty view-model: grupowanie po **`scope`**, licznik brakujących wymaganych zgód przez **`combineLatest`**.

## Struktura projektu

```text
src/app/
  core/         # m.in. theme (preferencja jasny/ciemny)
  shared/       # placeholder (.gitkeep) — pod współdzielone komponenty
  features/     # m.in. client-create (formularz demo)
  layout/       # placeholder (.gitkeep)
```

Katalogi `shared/` i `layout/` są przygotowane pod rozbudowę; aktualna logika demo siedzi w **`features/client-create`**.

## Dalsze kroki (propozycje)

- **`core/http`:** prawdziwy klient HTTP zamiast mocka zgód, interceptory.
- **Konwencje** nazewnictwa folderów per feature i ewentualnie **feature shell** w `layout/`.
- **Testy:** szablony kroków (`ClientStepDetails` / `ClientStepConsents`), ewentualnie testy nawigacji `?step=`.
