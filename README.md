# Reactive Forms Starter

Aplikacja demonstracyjna: "Utworz klienta" z formularzem krokowym, dynamicznymi zgodami i walidacja oparta o Reactive Forms.

## Start

```bash
npm install
npm start
```

## Jakość kodu i testy

```bash
npm run lint
npm run lint:fix
npm run format
npm run format:check
npm test
npm run build
```

## Co jest zaimplementowane

- krok 1: dane klienta (`PERSON`/`COMPANY`) z walidacja warunkowa,
- krok 2: dynamiczne zgody z mock API (`inUse === true`), checkboxy i required consent validation,
- zapis mapuje formularz do finalnego payloadu i pokazuje JSON preview + loguje wynik do konsoli.

## Decyzje techniczne (krotko)

Formularz jest zbudowany w `ClientFormService`, aby trzymac logike walidacji poza komponentami UI i zachowac czytelny podzial odpowiedzialnosci. Zgody sa trzymane jako `FormRecord<FormControl<boolean>>`, co daje prosty, typowany model `code -> accepted` oraz latwe mapowanie do payloadu. RxJS jest uzyty do strumienia zgod: filtrowanie `inUse`, cache przez `shareReplay(1)` i reaktywna synchronizacja kontrolek formularza (`tap`). W kroku 2 jest tez prosty view-model: grupowanie po `scope` i licznik brakujacych wymaganych zgod przez `combineLatest`.

## Struktura projektu

```text
src/app/
  core/         # singletony: serwisy globalne, interceptory, config
  shared/       # komponenty/pipes/directives współdzielone
  features/     # moduły/funkcje domenowe
  layout/       # shell aplikacji (widoki ramowe)
```

## Dalsze kroki

- przenieść aktualny formularz demo do `features/`,
- dodać `core/http` i `core/state`,
- ustalić konwencję nazw folderów per feature.
