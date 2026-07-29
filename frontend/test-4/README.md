# Test Step T-4 — IndexedDB Store · Async Round-Trips

**Build companion:** [Step 4](../step-4/README.md) — **`cfb-sessions-loaded-to-idb`** + **`data-latest-updated-at`**.

> **Before you start:** [getting-started.md](./getting-started.md) · [T-4 learning log](./learning-log.md)

The store is **async**. Components fire events after real I/O; tests need `waitForEvent` and careful teardown.

---

## Learning goal

By the end of T-4 you can:

- Demonstrate how test an asynchronous code that eventually executes
- Test loader / store / orchestrator wiring without coupling to markup
- Explain one use case of contract testing for databases.

---

## 1) Connections

In [your T-4 learning log](./learning-log.md):

1. [Real IDB vs fake — where do you stand?](./learning-log.md#t-4-connections-idb-choice)
2. [Bridge from Step 4](./learning-log.md#t-4-connections-bridge)
3. [What changed from T-3?](./learning-log.md#t-4-connections-prev)

---

## 2) Concepts

In T-3, `dispatchEvent` was **synchronous** - you asserted on the very next line. T-4 is the first step where that
breaks: the store writes to **IndexedDB**, real async I/O that finishes on a *later* turn of the event loop. For the
event data, we use the same seams and contracts as before - a brand-new problem in **when** the result is ready.

There are three new component roles plus the store:

| Component                  | Its one job                                                                                          |
|----------------------------|------------------------------------------------------------------------------------------------------|
| `<cfb-session-store>`      | Listen for session events, write to IDB, fire `cfb-sessions-loaded-to-idb`                           |
| `<cfb-session-loader>`     | Read all sessions from IDB on connect, fire `cfb-sessions-loaded-to-idb`                             |
| `<cfb-board-orchestrator>` | Listen for `cfb-sessions-loaded-to-idb`, set `data-latest-updated-at` on `.listens-schedule-updates` |

Notice that `<cfb-board-orchestrator>` has no IDB involvement - it is stateless. And it will remain stateless from now
on. Now it clearly has only one responsibility - a pub/sub hub between components.
It does **not** push session JSON to the schedule; it only signals **“re-read from IDB”**. Only the loader and store
components touch the database. (That statelessness is why the orchestrator's test needs no `await` at all - a clean
contrast to the two async suites.)

### Wait for a signal, not a duration

When work finishes *later*, the instinct is to wait "a bit" - `await Promise.resolve()`, or a `setTimeout`. Both are
guesses. An IndexedDB read/write doesn't resolve on a microtask; it completes when the browser dispatches the
request's `success` **event**, a separate task on a future turn you don't control. Waiting a fixed number of turns is
exactly how flaky tests are born. A flaky test is one that might succeed locally, but fail very badly in CI.

The fix is to wait for the **signal** the work actually emits:

```js
const loaded = waitForEvent(el, EventTypes.SESSION_LOADED_TO_IDB)
el.dispatchEvent(cfbSessionCreated(sessionWith({ id: 'new-1' })))
await loaded                          // resolves exactly when the store finished
const rows = await getAllSessions()   // await the IDB read directly
```

The snippet above is deterministic no matter how many event-loop hops the internals take. Two aspects that are important
to remember when writing async tests like the ones in step-3:

- **Attach the listener before you act.** The loader fires its event from an *async* `connectedCallback`.
  In [`fixtureAndWaitFor`](./test/helpers/fixture.js), it adds the event listener to the '#testRoot' element  *before*
  it mounts the element, so the signal isn't missed. This is a good practice to avoid situation where the element is
  dispatched before the listener is attached.
- **`tick(ms)` is a sleep, not a flush.** The orchestrator test uses `await tick(10)` for one honest reason: to let
  real wall-clock time pass so two `Date.now()` stamps are measurably apart. That is the *only* place a duration is
  the right tool. (Full event-loop story in [tips.md](./tips.md).)

### Real IndexedDB, or a fake store?

Async I/O forces a design choice the series hasn't needed before: what does the test run *against*? Because in this
step, we're introducing a real DB and we have 2 components that are using the real DB. Using the real DB might be slow,
and given many components using the db, this might be an issue. But as we know how to inject a fake IndexedDB store, we
have an option to use choose between the real, a fake, or sinon stubs.

- **Real IndexedDB** - highest confidence, but slower and needs teardown (we need to `await` the `dropDb()` between
  tests) so state doesn't bleed from one test into the next.
- **A fake in-memory store** - instant and isolated (`resetForTests()`), but blind to IDB-specific bugs.
- **sinon.stub** - instant and isolated, but blind to IDB-specific bugs. Also needs a contract test to prove it.

You don't have to pick one globally, and the rest of this section is how you get *both*: the speed of the fake for
almost every test, and the confidence of the real thing where it counts.

### Import maps - swap a dependency without touching code

This is the first step with an external dependency worth faking - steps 1-3 had nothing to swap, so it is the first
time we reach for an **import map**: a browser-native line that says "when any module imports *this* specifier, hand
it *that* file instead."

```js
// test/web-test-runner.config.mjs
const testImportMappings = {
  '../step-4/session-store.js': './test/helpers/fake-session-store.js',
}
```

Even when using import maps, every component still writes `import { saveSessions } from '../step-4/session-store.js'` -
unchanged. Under this config in the `web-test-runner.config.mjs` the browser gives them `fake-session-store.js` instead.
No `jest.mock`, no bundler, no edit to a single component: it is the platform's own module resolution, redirected. If we
add a **second** config (`web-test-runner.store-real.config.mjs`) without the import map, and run all the tests again,
the same imports resolve to the real IDB store. This is **one contract test, two runs** - that's what licenses the fake.
If we only run the store contract tests agains these two configs, we can **prove** that the fake and the real store are
interchangeable. *That* is why we then can always use the fake in all the rest of the tests - it's guaranteed to work
like a real IndexedDB.

### One contract test, two runs - that's what licenses the fake

Here is the payoff, and why T-3's contract idea matters so much now. `session-store.contract.test.js` is written
**once**, against the `session-store.js` API (`saveSessions`, `getAllSessions`, `updateSession`, …). It is then run
under **both** configs:

```bash
npm run test:store:fake   # default config: import map -> the FAKE answers the contract
npm run test:store:real   # real config:    no map     -> real IndexedDB answers the contract
```

If the **same** tests pass against both, the fake and the real store are proven interchangeable. *That* is what earns
you the right to run every other suite against the fast fake - they lean on a `session-store.js` that a contract has
already shown behaves like the real one. A fake that no contract has checked would make a green suite meaningless. A
sinon.stub would be also ok to use, but there would be no contract tests to prove it.

Complete [Myth or fact](./learning-log.md#t-4-concepts-myth-fact), the
[import-maps review](./learning-log.md#t-4-concepts-import-maps), and the optional
[concept sketch](./learning-log.md#t-4-concepts-sketch).

---

## 3) Concrete practice

### Read the test lists, then make them green

Same loop as T-3: three skeleton suites ship with a `todo(...)` list. Read a `todo`, promote it into a real
`it(...)`, drive it green, move on. Do the synchronous suite first, then the two async ones.

- [ ] First, a design call the async suites depend on: run components against **real IndexedDB** or a **fake
  in-memory store**? (see [tips.md](./tips.md) - the key decision).
- [ ] `test/cfb-board-orchestrator.test.js` - no IDB, pure event wiring (synchronous - no `await` needed).
- [ ] `test/cfb-session-loader.test.js` - connect the element, `await` the `cfb-sessions-loaded-to-idb` signal via
  `fixtureAndWaitFor`.
- [ ] `test/cfb-session-store.test.js` - dispatch a session event, wait for the signal, then read IDB back.

### Read for reference (already complete)

These ship finished - read them, don't rewrite them:

- [ ] `session-store.contract.test.js` - the store's API contract against real IndexedDB. This is the suite that lets
  you *trust* a fake.
- [ ] `cfb-menu.test.js` and `cfb-session-card.test.js` - a preview of **interaction and spy** testing (clicks,
  `aria-expanded`, `sinon` spies), covered properly in **T-5**.

## Constraints

- Do **not** assert on `innerHTML` or implementation details.
- Assert on observable output: event type and `bubbles`, `data-latest-updated-at`
  on `.listens-schedule-updates`, and store round-trips where relevant.
- Max **30 minutes**.

See **[tips.md](./tips.md)** (real vs fake IDB, `waitForEvent`, assertion table).

---

## 4) Conclusions

1. [Loop back — real vs fake](./learning-log.md#t-4-loop-back-idb)
2. [Ticket out](./learning-log.md#t-4-conclusions-ticket-out)
3. Hub takeaway → [`learning-log-test.md`](../learning-log-test.md#t-4-key-takeaway)

---

## Extras

- [ ] **Extend the provided store contract test** (`session-store.contract.test.js`) against the real IndexedDB.
  Cover `saveSessions`, `getAllSessions`, `deleteSession`, `getSessionsByDay`.
  Run it with a separate config that does not apply the import map swap so it hits real IDB.
- [ ] **Implement a `fake-session-store.js`** that mirrors the `session-store.js`
  API using a plain array - then flip between the two via the import map
  to experience the trade-off first-hand
- [ ] Test `disconnectedCallback` - dispatch an event after removing the element
  from the DOM and assert no `cfb-sessions-loaded-to-idb` side effect on schedule targets
- [ ] Test that `seedIfEmpty` in `session-store.js` is idempotent - calling it
  twice does not duplicate seed data

---

## Demos

If you complete the challenge, share a short screen recording or paste your
terminal output here.

## Issues

If you get stuck, note the problem here so we can discuss it together.

---

### End result

After completing this step you will have learned:

- Why async components need a different mounting helper than synchronous ones -
  `connectedCallback` can fire an event before your listener is attached
- How **import map swapping** replaces a real dependency with a test fake without
  touching any component code - a browser-native alternative to `jest.mock()`
- The trade-off between testing against **real IndexedDB** (high confidence, slower,
  needs teardown) and a **fake in-memory store** (fast, isolated, but cannot
  catch IDB-specific bugs)
- How to use `npm run test:manual` and the browser DevTools to inspect IndexedDB
  state when tests fail in unexpected ways
- How **one** contract test, run against both the fake and real IndexedDB, is what
  lets every other suite trust the fast fake
