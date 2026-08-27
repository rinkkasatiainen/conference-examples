# Test Step T-7: Loader Components · Mocking the Network (MSW)

**Build companion:** [Step 7](../step-7/README.md)

> **Before you start:** [getting-started.md](./getting-started.md) · [T-7 learning log](./learning-log.md)

Test Step 7 loaders by intercepting the network with **MSW** (no live backend). Verify success stores data and fires *
*`sessionsLoaded`** / **`scheduleLoaded`**, and failures fire **`loaderError`**. Test the orchestrator in isolation with
synthetic loader events.

---

## Learning goal

By the end of T-7 you can:

- Intercept HTTP with MSW handlers (`worker.use`) and reset them in `afterEach`
- Assert loader status via `dataset.state` and bubbling loader events
- Test `<cfb-board-orchestrator>` without IDB, both loaders must complete for the same `eventId`

---

## 1) Connections

In [your T-7 learning log](./learning-log.md):

1. [Fetch stub guess](./learning-log.md#t-7-connections-guess) *(before Concepts)*
2. [Bridge from Step 7](./learning-log.md#t-7-connections-bridge)

---

## 2) Concepts

| Component                  | Its one job                                                                                       |
|----------------------------|---------------------------------------------------------------------------------------------------|
| `<cfb-session-loader>`     | `fetch` sessions → IDB → `sessionsLoaded`                                                         |
| `<cfb-schedule-loader>`    | `fetch` schedule → schedule store → `scheduleLoaded`                                              |
| `<cfb-board-orchestrator>` | Wait for **both** loader events, then set `data-latest-updated-at` on `.listens-schedule-updates` |

In T-4 you swapped a *module* (the store) with an **import map**. T-7's dependency is the **network**, and you fake
it the modern way - with **MSW (Mock Service Worker)**. Rather than monkey-patch `window.fetch`, MSW registers a real
Service Worker that intercepts requests at the network boundary. The component makes a genuine `fetch` through its
`backend-api` seam; MSW answers it. It is the *same* tool the app already uses at its entry (`step-7/mocks/`), so
tests and app mock the network identically.

### Declare a handler per case

A shared worker is started once; each test declares only the response it needs with `worker.use(...)`, and
`worker.resetHandlers()` clears it afterwards:

```js
import { worker, http, HttpResponse, delay, API } from './helpers/msw.js'

before(async () => {
  await worker.start({ onUnhandledRequest: 'bypass', quiet: true })
})
afterEach(() => worker.resetHandlers())
after(() => worker.stop())
```

Shape the handler to the scenario - by matching the **real** route, not by faking a `Response` object:

```js
worker.use(http.get(`${API}/api/sessions/:eventId`, () => HttpResponse.json(SESSIONS)))        // 200
worker.use(http.get(`${API}/api/sessions/:eventId`, () => new HttpResponse(null, { status: 404 }))) // -> loaderError
worker.use(http.get(`${API}/api/sessions/:eventId`, async () => {
  await delay('infinite')
}))    // -> 'loading'
```

Q: **Why should I learn all this**, and not just use `sinon` to fake the `window.fetch`?
> Good question. One answer is that by using MSW, you are actually making the real fetch call, which means it's testing
> the whole call, from URL path, to headers and responses. You can even define in the handlers to spy on the headers,
> and verify those in your tests - if it's somethign you want to test.
> You also automatically test the handling of status codes, JSON parsing and error handling.

---
**Note!**

Later, in advanced sessions, we learn that just using
`window.fetch` is not enough, and it's best to have another supporting capability to support that behavior. When that
happens, we can easily mock the fetch call in a way that is guaranteed to work (and tested). And then we need MSW only
in one place - where we test the said supporting capability. But as said ... later.
---

### The two-loader barrier (orchestrator)

In this step, the orchestrator adds a coordination rule: it signals the schedule **only after both** `sessionsLoaded` *
*and** `scheduleLoaded` arrive for the **same** `eventId`. That's a *barrier*, and it's testable in complete isolation.

Complete [Myth or fact](./learning-log.md#t-7-concepts-myth-fact) and the
[one-minute review](./learning-log.md#t-7-concepts-one-minute).

Implementation notes: **[tips.md](./tips.md)**.

---

## 3) Concrete practice

```bash
cd frontend/test-7
npm install
npm test          # or: npm run test:watch
```

### Read the test lists, then make them green

Two skeleton suites ship as `todo(...)` lists. The session-loader suite already wires up the MSW worker (`worker`,
`http`, `HttpResponse`, `delay` from `helpers/msw.js`); the orchestrator suite has the `fire()` helper. Read a
`todo`, promote it into a real `it(...)`, drive it green, move on.

- [ ] `test/cfb-session-loader.test.js` - MSW handlers via `worker.use(...)`: success, error, loading, re-fetch on
  `data-event-id`.
- [ ] `test/cfb-board-orchestrator.test.js` - synthetic loader events (no network): the both-must-complete barrier,
  single loader, mismatched `eventId`.

### Read for reference (already complete)

- [ ] `test/cfb-schedule-loader.test.js` - the finished twin of your session-loader exercise; the *same* MSW handlers
  for the schedule route. Compare your work to it.

## Constraints

- Assert **observable output**: `dataset.state`, and bubbling `sessionsLoaded` / `scheduleLoaded` / `loaderError`.
- Reset MSW handlers (`worker.resetHandlers()`) and drop IDB (`cfb-db-test`, `cfb-schedule-db`) in `afterEach`.
- Max **30 minutes**.

See **[tips.md](./tips.md)**.

---

## 4) Conclusions

1. [Loop back: fetch stub guess](./learning-log.md#t-7-loop-back-guess)
2. [Ticket out](./learning-log.md#t-7-conclusions-ticket-out)
3. Hub takeaway → [`learning-log-test.md`](../learning-log-test.md#t-7-key-takeaway)

---

## Extras

- [ ] Assert `saveSessions` / schedule store round-trip after a successful load
- [ ] Test `data-reload-token` on session loader (orchestrator update flow)
- [ ] Test loader does not fire after disconnect before fetch resolves

---

### End result

- Network mocking at the request boundary with MSW - the same tool the app uses at its entry
- Orchestrator contract tests separate from loader integration tests
- Same pull-based refresh signal as Step 4, but gated on two HTTP loaders
