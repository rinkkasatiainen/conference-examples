// Promise-based IndexedDB wrapper for session data.
// DB_NAME is exported so tests can delete the database between runs.
import { DB_NAME } from '../../../step-4/session-store.js'

export {
  saveSessions, updateSession, deleteSession, getAllSessions, getSessionsByDay
} from '../../../step-4/session-store.js'

const DB_VERSION = 1

function openDb() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION)

    req.onupgradeneeded = (e) => {
      const db = e.target.result
      if (!db.objectStoreNames.contains('sessions')) {
        const store = db.createObjectStore('sessions', { keyPath: 'id' })
        store.createIndex('by-day', 'day', { unique: false })
      }
    }

    req.onsuccess = (e) => resolve(e.target.result)
    req.onerror = (e) => reject(e.target.error)
  })
}

export async function upsertSession(session) {
  const db = await openDb()
  return new Promise((resolve, reject) => {
    const tx = db.transaction('sessions', 'readwrite')
    tx.objectStore('sessions').put(session)
    tx.oncomplete = () => resolve()
    tx.onerror = (e) => reject(e.target.error)
  })
}
