# Sentry · Warehouse intelligence

A six-page full-stack monitoring dashboard for a simulated four-zone warehouse.

## Run locally

Requires Node.js 20.19+ (or 22.12+).

```sh
npm install
npm run dev
```

Open http://127.0.0.1:5173. The frontend proxies `/api` to the backend on port 3001.

**Demo login:** `demo@sentry.app` / `Warehouse123!`

```sh
npm run build # TypeScript check and production bundle
npm start     # Serve the production build and API on http://127.0.0.1:3001
```

## Source organization

The frontend is organized by feature, with separate shared components, lifecycle hooks, typed API services, stores, and styles. The backend separates routes, controllers, authorization middleware, and domain services. See [the architecture guide](docs/architecture.md) for the complete folder tree and contribution boundaries.

## Architecture

- React + TypeScript, React Router, Zustand, Recharts, responsive CSS with shared theme tokens and reduced-motion support.
- Express generates temperature, humidity, and power telemetry for four warehouse zones every 2 seconds. Readings include a timestamp, status, and UPDATE/ALERT/RECOVERY event label.
- Authenticated SSE delivers raw live readings; the browser reconnects automatically and displays connection state. Pause closes the stream without stopping the simulator or polling.
- REST polling every 5, 10 (default), or 15 seconds independently loads summaries and alerts. Summaries calculate rolling 60-second averages, differences against the previous 60 seconds, and sampled historical trends. Alerts are emitted when a zone transitions into a warning/critical temperature state.
- The cold-storage warning threshold is 7 °C; other zones use 26 °C. Critical means more than 2 °C above the warning threshold. Alerts retain the observed value and threshold and can be acknowledged.
- An initial four-minute simulated history populates charts. Raw history retains up to 900 frames; alerts retain up to 100 entries. All timestamps use the browser's local time for display.
- Sessions use random opaque tokens in HttpOnly, SameSite=Strict cookies, expire after 30 minutes, and are validated by the backend. Logout revokes the token. Session expiry closes SSE, clears protected frontend data, cancels polling, and redirects to login. API responses are not cached.
- Preferences persist locally; sessions and warehouse data are intentionally in memory and reset on backend restart. Demo credentials are deliberately public. For an HTTPS deployment, set `COOKIE_SECURE=true`; real deployment would also need a persistent session/data store and production authentication.

## Pages and requirements

| Route        | Features                                                                                                  |
| ------------ | --------------------------------------------------------------------------------------------------------- |
| `/login`     | Demo sign-in, validation and error feedback                                                               |
| `/`          | Live metrics, timestamps, connection state, chart metric tabs, zone filtering, zone details, pause/resume |
| `/analytics` | Polled aggregates, window deltas and three historical charts                                              |
| `/alerts`    | Polled derived alerts, search, severity filter, details and acknowledgement                               |
| `/settings`  | Persistent light/dark theme, polling interval, live pause/resume                                          |
| `/profile`   | User identity, sign-in/expiry times, time remaining, logout                                               |

## API

- `POST /api/auth/login`, `GET /api/auth/session`, `POST /api/auth/logout`
- `GET /api/dashboard/stream` — authenticated SSE
- `GET /api/dashboard/summary` — aggregates; optional `?zone=0` through `3`
- `GET /api/dashboard/alerts` — derived alerts and refresh timestamp
- `PATCH /api/dashboard/alerts/:id` — acknowledge an alert

## Manual verification

For a manual walkthrough: log in; watch live metrics/timestamps change; switch zones and chart metrics; pause live updates and verify analytics polling continues; filter and acknowledge an alert; change theme and polling interval; reload to confirm preferences/session persistence; sign out and confirm protected routes redirect.
