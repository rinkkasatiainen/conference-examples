// In-memory implementation of the session-store.js API.
//
// This mirrors the real IndexedDB store (step-4/session-store.js, re-exported by
// step-7/lib/store/session-store.js) so it can stand in for it in tests that
// don't need a real database. `session-store.contract.test.js` is what proves
// the two are interchangeable - run the same contract against this fake (import
// map) and against real IndexedDB (no map).

export const DB_NAME = 'fake-db'

let _store = []

export async function saveSessions(sessions) {
  for (const s of sessions) {
    const idx = _store.findIndex((x) => x.id === s.id)
    if (idx >= 0) _store[idx] = s
    else _store.push(s)
  }
}

export async function updateSession(session) {
  const idx = _store.findIndex((x) => x.id === session.id)
  if (idx < 0) {
    throw new Error(`Session not found: ${session.id}`)
  }
  _store[idx] = session
}

export async function getAllSessions() {
  return [..._store]
}

export async function deleteSession(id) {
  _store = _store.filter((s) => s.id !== id)
}

export async function getSessionsByDay(day) {
  return _store.filter((s) => s.day === day)
}

// Teardown: wipe all in-memory state. Call in afterEach (equivalent to dropping the real DB).
export async function resetForTests() {
  _store = []
}
