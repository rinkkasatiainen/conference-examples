import { expect } from 'chai'
import { DB_NAME } from '../../step-4/session-store.js'
import { CfbSessionLoader } from '../../step-4/cfb-session-loader.solution.js'
import { cleanup, fixtureAndWaitFor } from './helpers/fixture.js'
import { EventTypes } from '../../step-4/lib/events.js'

if (!customElements.get('cfb-session-loader')) {
  customElements.define('cfb-session-loader', CfbSessionLoader)
}

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

// ---------------------------------------------------------------------------
// fixtureAndWaitFor sets up the event listener BEFORE connecting the element,
// so it catches the sessionsLoaded that fires from connectedCallback even
// though connectedCallback is async.
// ---------------------------------------------------------------------------

const todo = msg => it.skip(msg, () => { /* no-op */ })

describe('<cfb-session-loader>', () => {

  // Read each todo, then promote it into a real `it(...)`, one at a time.
  // The loader reads IDB on connect and fires cfb-sessions-loaded-to-idb - an
  // ASYNC signal. Use fixtureAndWaitFor, which attaches the listener BEFORE the
  // element connects, so the event fired from (async) connectedCallback isn't missed:
  //   const { event } = await fixtureAndWaitFor('<cfb-session-loader></cfb-session-loader>', EventTypes.SESSION_LOADED_TO_IDB)

  todo('dispatches cfb-sessions-loaded-to-idb on connectedCallback')
  todo('the cfb-sessions-loaded-to-idb event bubbles')
})

// ---------------------------------------------------------------------------
