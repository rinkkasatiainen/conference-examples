# T-7 tips — mocking the network with MSW

## Why MSW, not a `window.fetch` stub

Step 7 loaders call `getBackendApi()`, which uses `fetch` internally. Rather than monkey-patch `window.fetch`, we
intercept the request at the network boundary with **MSW** — the component makes a genuine `fetch`, MSW answers it.
Its real code path runs (URL building, `res.ok`, `res.json()`), you assert against the routes and status codes the
backend actually speaks, and nothing global is left dirty for the next test. It's the same tool the app uses at its
entry (`step-7/mocks/`).

## Worker + handler pattern

A shared worker is started once; each test declares only the response it needs with `worker.use(...)`:

```js
import { worker, http, HttpResponse, delay, API } from './helpers/msw.js'

before(async () => { await worker.start({ onUnhandledRequest: 'bypass', quiet: true }) })
afterEach(() => worker.resetHandlers())   // drop this test's handlers so they don't leak
after(() => worker.stop())

// Shape the handler to the case — match the real route:
worker.use(http.get(`${API}/api/sessions/:eventId`, () => HttpResponse.json(SESSIONS)))         // 200
worker.use(http.get(`${API}/api/sessions/:eventId`, () => new HttpResponse(null, {status: 404}))) // -> cfb-loader-error
worker.use(http.get(`${API}/api/sessions/:eventId`, async () => { await delay('infinite') }))     // -> 'loading'
```

`API` is `http://localhost:3001` — the `backend-api` seam's default base URL. Routes: `GET /api/sessions/:eventId`
(session loader) and `GET /api/schedule/:eventId` (schedule loader).

## Setup requirements

- **Install:** `msw` is a devDependency (`npm install` in `test-7`).
- **Service worker:** MSW's `worker.start()` registers `/mockServiceWorker.js`, so that file must be served at the
  test root — it lives at `test-7/mockServiceWorker.js`. Regenerate with `npx msw init . --save` if it drifts from
  the installed MSW version.
- **Unhandled requests:** `onUnhandledRequest: 'bypass'` lets WTR's own module/asset requests through; only routes
  you register with `worker.use()` are mocked.

## Async events

Use `fixtureAndWaitFor(html, 'cfb-sessions-loaded')` so the listener is registered **before** the loader fires. The Step 7
session loader loads on `data-event-id` attribute change (including the initial upgrade).

## IDB cleanup

Delete both databases between tests **or** use import-map fakes (reference tests fake the session + schedule stores —
see `test/web-test-runner.config.mjs`). MSW mocks the *network*; the *store* is still faked via the import map, so a
successful load writes to the fake store.

## Orchestrator tests — no network

The orchestrator waits for both loader events; it never fetches. Test it with synthetic events, no MSW:

```js
el.dispatchEvent(new CustomEvent('cfb-schedule-loaded', {
  bubbles: true,
  detail: { eventId: 'evt-a', updatedAt: 9999 },
}))
```

Assert on `.listens-schedule-updates` — not on `<cfb-schedule>` internals.
