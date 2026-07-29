// Timing helpers for tests. See ../../tips.md for the full story on
// microtasks, macrotasks, and *why you await a signal instead of counting turns*.

/**
 * Resolves after `timeoutInMs` of real time via a macrotask (`setTimeout`).
 *
 * Two legitimate uses:
 *  - `tick(0)` - yield one macrotask turn, which also drains the whole microtask
 *    queue (stronger than `await Promise.resolve()`).
 *  - `tick(ms)` - a deliberate wall-clock delay (a *sleep*), e.g. so two
 *    `Date.now()` timestamps are measurably apart.
 *
 * NOT a reliable way to wait for real I/O (IndexedDB, fetch): those complete on
 * their own future task. Await the completion signal instead - see `waitForEvent`.
 */
export async function tick(timeoutInMs = 0) {
  return new Promise(resolve => {
    setTimeout(resolve, timeoutInMs)
  })
}

/**
 * Returns a Promise that resolves the next time `target` emits `eventType`.
 * The reliable way to wait for async work: await the signal, not a duration.
 */
export function waitForEvent(target, eventType) {
  return new Promise(resolve => {
    target.addEventListener(eventType, (e) => resolve(e), { once: true })
  })
}

/**
 * Polls `predicateFn` until it returns truthy or `timeout` elapses.
 * Fallback for when the work exposes neither an event nor a promise — prefer
 * `waitForEvent` when a signal exists; `waitUntil` trades determinism for generality.
 */
export async function waitUntil(predicateFn, { timeout = 1000, interval = 10 } = {}) {
  const deadline = Date.now() + timeout
  while (Date.now() < deadline) {
    if (await predicateFn()) return
    await tick(interval)
  }
  throw new Error(`waitUntil: predicate not satisfied within ${timeout}ms`)
}
