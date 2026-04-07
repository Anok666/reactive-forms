# Reactive Forms Starter

Szkielet aplikacji: Angular 21, PrimeNG 19+, Tailwind CSS 4.1+, RxJS, Reactive Forms, Vitest, ESLint + Prettier.

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
