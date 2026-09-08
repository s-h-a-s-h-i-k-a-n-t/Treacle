# Project architecture

Sentry uses a feature-oriented React frontend and a layered Express backend. Keep a module focused on one responsibility; extract a component or service when it acquires an independent concern rather than splitting by an arbitrary line count.

```text
src/
  main.tsx                     # Browser entry point: mount App, import styles
  app/
    App.tsx                    # Compose startup and connection lifecycles
    AppRoutes.tsx              # Route definitions
  features/
    auth/pages/                # Login and profile/session pages
    overview/
      pages/                   # Overview composition and zone selection
      components/              # LiveMetricCards, ZoneHealth, ZoneTable
    analytics/pages/           # Aggregated trends
    alerts/pages/              # Alert list, filters, acknowledgement
    settings/pages/            # Preferences
  components/
    layout/                    # Protected dashboard shell
    charts/                    # Shared metric chart
    ui/                        # Brand, PageHeading, Status, Modal
  hooks/                       # Bootstrap, expiry, SSE and polling lifecycles
  services/                    # Typed auth and dashboard HTTP operations
  stores/                      # Runtime dashboard state and persisted preferences
  types/                       # Session, telemetry and metric contracts
  config/                      # Navigation and metric presentation metadata
  lib/                         # Shared HTTP client and time formatting
  styles/                      # Base, layout, feature, theme and responsive styles
server/
  index.js                     # Process entry point and production asset serving
  app.js                       # Express setup and dependency composition
  config/                      # Session, simulator and demo account constants
  routes/                      # Endpoint registration and middleware wiring
  controllers/                 # HTTP input handling and response mapping
  middleware/                  # Session authorization
  services/                    # Sessions, simulation, aggregation and SSE lifecycle
  utils/                       # Cookie parsing and numeric helpers
 tests/
  unit/                        # Simulator and aggregation behavior
  integration/                 # Authenticated APIs and streaming lifecycle
  helpers/                     # Isolated test server setup and cleanup
  browser/                     # Complete browser user flows
 docs/
  architecture.md             # This guide
```

## Frontend boundaries

- Pages compose UI and handle page-specific interactions. Shared components do not import feature pages.
- Feature-specific overview widgets stay beside their feature; generic dialogs, status badges and charts stay under `components/`.
- Pages and hooks call typed `services/*.api.ts` methods. HTTP paths, verbs and request serialization live in those services.
- The HTTP client centralizes request handling and the existing unauthorized-session cleanup policy. The stores never import the API layer, keeping the dependency direction explicit.
- Lifecycle hooks separately own session expiry, live streaming and polling. Each hook cleans up its connections, requests and timers on unmount or dependency changes.
- `dashboard.store.ts` owns session plus protected runtime data so expiry can clear them together. `preferences.store.ts` owns persistent device preferences.
- Types are shared between stores, API services and components. Metric keys are a finite union, and store updates are typed. TypeScript rejects unused locals and parameters.
- `styles/index.css` is the sole stylesheet entry point. Its import order preserves the existing cascade, including theme and responsive overrides.

## Backend boundaries

`app.js` creates per-application service instances and injects them into middleware, controllers and routers. Routes register endpoints; controllers handle HTTP input/output; services own state and domain behavior. There are no process-global session maps or timers.

The simulator owns the bounded reading and alert history. Summary calculation is a separate service. The stream service owns subscribers and its interval, and closes them through the application's `close()` function. The session service owns token generation, credential checks, expiry and revocation. Cookie details are centralized.

Sessions and telemetry remain in memory, as in the assessment implementation. This refactor does not add a database or change the SSE/REST protocol.

## Working on a change

- Add a page under its feature and register it in `app/AppRoutes.tsx`.
- Add HTTP operations to the appropriate frontend API service, with a response type.
- Add backend routes through a router/controller and put domain logic in a service.
- Run `npm run typecheck`, `npm test`, and `npm run build` for code changes.
- With `npm run dev` running, run `npm run test:e2e` for changes affecting browser flows.
- Run `npm run format` before handing off changes; `npm run format:check` checks formatting without rewriting files.
