# Reactive Forms Starter

Aplikacja demonstracyjna: „Utwórz klienta” z formularzem krokowym, dynamicznymi zgodami i walidacją opartą o Reactive Forms.

For a Polish technical version, see `README.pl.md`.

## Project Scope and Assumptions

- The app demonstrates form architecture and UX patterns, not production backend integration.
- Domain complexity is intentionally moderate, enough to show:
  - conditional validation (`PERSON` vs `COMPANY`),
  - dynamic controls (`FormRecord` for consents),
  - browser-history-aware wizard steps (`?step=1|2`),
  - payload mapping and read-only post-save mode.
- Source of truth for behavior lives in service-layer logic, not in template conditionals.

## Quick Start

```bash
npm install
npm start
```

## Quality Gates

```bash
npm run lint
npm run lint:fix
npm run format
npm run format:check
npm run build
```

## Tests

```bash
npm test
```

Test runner: `ng test` with Vitest globals (`tsconfig.spec.json`).

Current coverage focus:
- `ClientFormService`:
  - validator switching for `PERSON`/`COMPANY`,
  - consent control synchronization,
  - consent reset behavior,
  - details reset behavior (`pristine`/`untouched` after programmatic reset).
- `ClientCreatePageComponent`:
  - core step-1 -> step-2 -> save flow with route and API mocks.
- `ThemePreferenceService`:
  - dark-mode class toggling.
- `App`:
  - shell smoke checks.

## Functional Flow

### Step 1: Client Details

Validation profile depends on `clientType`:
- `PERSON`: `firstName`, `lastName`, `email` are required.
- `COMPANY`: `companyName`, `nip`, `email` are required (`nip` pattern-validated).

On `clientType` change:
- details fields are reset (including `email`),
- controls are marked `pristine` and `untouched` to avoid false error visuals,
- validators are re-bound to the active profile.

### Step 2: Dynamic Consents

`ConsentsApiService.getConsents(clientType)` filters by:
- `inUse === true`,
- optional `forClientTypes` (if present in `ConsentDto`).

Form model uses `FormRecord<FormControl<boolean>>` keyed by consent code.
Required consents use `Validators.requiredTrue`.

When type changes:
- existing consent selections are cleared,
- controls are synchronized to the new consent set (add/remove/update validators).

### Wizard Navigation and Browser History

Step state is encoded in query param:
- `step=1` -> details,
- `step=2` -> consents.

This enables:
- native browser back/forward support,
- guard-like behavior for direct `step=2` access when step-1 is invalid (redirect to `step=1`).

### Save Semantics

On valid submit:
- form is mapped to `CreateClientPayload`,
- payload preview is displayed,
- form switches to read-only mode.

## Implementation Strategy

Architecture follows a "domain service + thin orchestration component" pattern.

1. **Types and Contracts**
   - Domain models live under `features/client-create/models`.
   - `ConsentDto.forClientTypes` allows type-specific consent eligibility.

2. **Service-Centric Form Logic**
   - `ClientFormService` owns:
     - form factory,
     - validator profile switching,
     - field touch/reset policies,
     - dynamic consent-control sync.
   - This keeps templates declarative and minimizes UI-layer branching.

3. **Reactive Orchestration in Page Component**
   - `ClientCreatePageComponent` coordinates route params, form state, and consent API.
   - `clientType.valueChanges` drives consent refresh (`switchMap`) and form synchronization.
   - URL query params drive active wizard step and browser history behavior.

4. **Presentation-Only Step Components**
   - `ClientStepDetails` and `ClientStepConsents` focus on rendering and local UI helpers.
   - They do not own domain state transitions.

5. **Incremental Hotfix-Friendly Design**
   - UX fixes (layout stability, reset semantics, history behavior) are localized and testable
     without large refactors.

## Engineering Decisions (Decision -> Trade-off -> Outcome)

1. **Decision:** Keep business form logic in `ClientFormService` instead of UI components.
   **Trade-off:** More service methods and orchestration boilerplate.
   **Outcome:** Predictable behavior, focused templates, and easier unit testing of validation/reset rules.

2. **Decision:** Use `FormRecord<FormControl<boolean>>` for consent state.
   **Trade-off:** Dynamic control sync logic is required when consent definitions change.
   **Outcome:** Type-safe, scalable `code -> accepted` model that maps directly to backend payload shape.

3. **Decision:** Drive wizard step from URL query param (`?step=1|2`).
   **Trade-off:** Route guards and redirects add complexity to step navigation.
   **Outcome:** Native browser back/forward works as expected, deep-linking is possible, and invalid step access is controlled.

4. **Decision:** Reset details and consent selections on `clientType` switch.
   **Trade-off:** User re-entry effort increases after switching type.
   **Outcome:** Eliminates stale cross-profile data leakage and prevents invalid carry-over of prior consent choices.

5. **Decision:** Normalize control UI state after programmatic resets (`pristine`/`untouched`).
   **Trade-off:** Additional explicit state management is required.
   **Outcome:** Prevents false negative UX signals (red invalid styles immediately after internal resets).

## Current Project Structure

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

## Suggested Next Steps

- Replace mock consents with real API integration (`core/http`, interceptors).
- Add integration-style tests for route-driven step navigation.
- Add e2e coverage (Playwright/Cypress) for critical wizard scenarios.
