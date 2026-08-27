# Tips

[← Back to README - 3) Concrete practice](./README.md#3-concrete-practice)

## Real IndexedDB or a fake store?

**Option A: real IndexedDB**

```js
function dropDb() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.deleteDatabase(DB_NAME)
    req.onsuccess = resolve
    req.onerror = (e) => reject(e.target.error)
  })
}

afterEach(async () => {
  cleanup()
  await dropDb()
})
```

Keep `dropDb` in **test code only**, not in production.

**Option B: fake store via import map**

```js
const testImportMappings = {
  '../step-4/session-store.js': './test/helpers/fake-session-store.js',
}
```

**Option C / D**: contract test on real IDB + fake-backed component tests (this repo uses Option D via two npm
scripts).

|            | Real IDB         | Fake store        | Contract + fake         |
|------------|------------------|-------------------|-------------------------|
| Confidence | Real browser API | Wiring only       | Good if contract passes |
| Speed      | Slower           | Instant           | Mixed                   |
| Isolation  | `dropDb()`       | `resetForTests()` | Per-suite               |

```bash
npm run test:store:fake   # components + fake
npm run test:store:real   # session-store contract vs real IDB
```

## Inspecting IndexedDB with `test:manual`

```bash
npm run test:manual
```

Open DevTools → **Application → IndexedDB** when tests bleed state between runs.

## Waiting for async work: don't count event-loop turns

This is the first step whose rendering is **not synchronous**. In steps 1–3 the DOM was updated inline
(custom-element callbacks and synchronous DOM events), so tests asserted immediately. **IndexedDB changes
the render mechanism.** Work now finishes *later*, on a different turn of the event loop, and that changes
how you wait.

### A 30-second model of the event loop

JavaScript runs one task at a time and drains two queues differently:

- **Microtask queue**: filled by `Promise.then`, `await`, `queueMicrotask`. After each task the loop drains
  this queue **completely** (including microtasks scheduled *during* the drain) before doing anything else.
- **Macrotask queue**: filled by `setTimeout`, events, and I/O completions. The loop takes **one** task per turn.

The rule that ties them together: **the whole microtask queue is flushed before the next macrotask runs.**
That is exactly why the `tick` helper works: `setTimeout` schedules a macrotask, so by the time it fires,
every pending microtask has already resolved. `await tick()` is therefore stronger than `await Promise.resolve()`
(which only flushes microtasks). But it is still **not** enough for real I/O, as the next section shows.

### Why `tick` isn't enough for IndexedDB

An IndexedDB read/write does not resolve on a microtask. It completes when the browser dispatches the `IDBRequest`
`success` **event**, a separate *task* that lands on a future loop turn, at a time you don't control. So:

| Render mechanism                                                     | Reliable wait                                     |
|----------------------------------------------------------------------|---------------------------------------------------|
| Synchronous (`attributeChangedCallback` sets DOM directly)           | none                                              |
| Async but microtask-only (`await Promise.resolve()`, `.then` chains) | `await tick()`, drains the whole microtask queue |
| Real async I/O (IndexedDB, `fetch`, `setTimeout`)                    | **await the actual completion signal**            |

`await tick()` yields exactly **one** macrotask turn, but the IDB `success` event is not guaranteed to fire within
that turn. Sometimes it passes, sometimes it doesn't: a classic flaky test. Chained I/O (read → write → read) makes
it worse, since each completion is its own task.

The fix is to stop waiting a *duration* and wait for the *signal* that the work is done: an event the component fires,
a promise it exposes, or the I/O call itself:

```js
const loaded = waitForEvent(el, EventTypes.SESSION_LOADED_TO_IDB)
el.dispatchEvent(cfbSessionCreated(sessionWith({ id: 'new-1' })))
await loaded                          // resolves exactly when the store finished
const rows = await getAllSessions()   // await the IDB read directly
```

This is deterministic no matter how many microtask/macrotask hops the internals take.

### The one place `tick` is still the right tool: a deliberate delay

`tick(ms)` has a legitimate use that has nothing to do with queues or I/O: letting **real wall-clock
time pass**. The orchestrator test in this folder uses `await tick(10)` so that two `Date.now()`
timestamps are measurably apart before asserting one is later than the other. That's a *sleep*, not a
flush, and that's the right mental model for `tick(10)` there, different from the (wrong) idea of using
`tick` to wait for IndexedDB.

### When there is no signal to await: `waitUntil`

Sometimes the work exposes neither an event nor a promise (e.g. you can only observe a
side effect settling). Then a `waitUntil` helper (poll a predicate until it's true or a
timeout elapses) is the pragmatic fallback:

```js
export async function waitUntil(predicateFn, { timeout = 1000, interval = 10 } = {}) {
  const deadline = Date.now() + timeout
  while (Date.now() < deadline) {
    if (await predicateFn()) return
    await tick(interval)
  }
  throw new Error(`waitUntil: predicate not satisfied within ${timeout}ms`)
}
```

Prefer an explicit signal (`waitForEvent`) when one exists. `waitUntil` trades
determinism for generality, so reach for it only when nothing better is available.

## `waitForEvent`

```js
export function waitForEvent(target, eventType) {
  return new Promise(resolve => {
    target.addEventListener(eventType, (e) => resolve(e), { once: true })
  })
}
```

Usage:

```js
const loaded = waitForEvent(el, EventTypes.SESSION_LOADED_TO_IDB)
el.dispatchEvent(cfbSessionCreated(sessionWith({ id: 'new-1' })))
const { detail } = await loaded
```

(`EventTypes.SESSION_LOADED_TO_IDB` is `'cfb-sessions-loaded-to-idb'`.)

## What to assert

| Component                | What to test                                                                           |
|--------------------------|----------------------------------------------------------------------------------------|
| `cfb-board-orchestrator` | `cfb-sessions-loaded-to-idb` → `data-latest-updated-at` on `.listens-schedule-updates` |
| `cfb-session-loader`     | Fires `cfb-sessions-loaded-to-idb` on connect; `bubbles`                               |
| `cfb-session-store`      | Created/removed events → IDB → `cfb-sessions-loaded-to-idb`                            |
| `store`                  | Contract: `saveSessions`, `getAllSessions`, …                                          |
