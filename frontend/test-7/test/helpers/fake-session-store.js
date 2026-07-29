// Fake for step-7/lib/store/session-store.js.
//
// The real module re-exports the IndexedDB store from step-4; this fake mirrors
// that surface from the in-memory core so `session-store.contract.test.js` can
// run the same suite against both (import map -> this fake, no map -> real IDB).
export {
  saveSessions,
  updateSession,
  deleteSession,
  getAllSessions,
  getSessionsByDay,
  resetForTests,
} from './fake-session-store-core.js'
