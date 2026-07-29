import { expect, use } from 'chai'
import { schemaMatcher } from '../../testing-utils/src/chai-helpers.js'
import { cfbSessionCreated, cfbSessionRemoved, EventTypes } from '../../step-4/lib/events.js'
import { getAllSessions, saveSessions } from '../../step-4/session-store.js'
import { resetForTests } from './helpers/fake-session-store.js'
import { CfbSessionStore } from '../../step-4/cfb-session-store.solution.js'
import { cleanup, fixture } from './helpers/fixture.js'
import { waitForEvent } from './helpers/async.js'
import { sessionDetails } from '../../step-3/lib/builds-session-details.js'
import { Randomizer as R } from '../../test-2/test/helpers/randomizer.js'

use(schemaMatcher)

if (!customElements.get('cfb-session-store')) {
  customElements.define('cfb-session-store', CfbSessionStore)
}

// ---------------------------------------------------------------------------

const todo = msg => it.skip(msg, () => { /* no-op */ })

describe('<cfb-session-store>', () => {
  afterEach(async () => {
    cleanup()
    resetForTests()
  })

  // Read each todo, then promote it into a real `it(...)`, one at a time.
  // The store writes to IDB, then fires cfb-sessions-loaded-to-idb - real async I/O.
  // Wait for the SIGNAL, not a duration, and await the IDB read directly:
  //   const loaded = waitForEvent(el, EventTypes.SESSION_LOADED_TO_IDB)
  //   el.dispatchEvent(cfbSessionCreated(sessionWith({ id: 'new-1' })))
  //   await loaded
  //   const rows = await getAllSessions()
  // (Add a `sessionWith(overrides)` builder on sessionDetails + Randomizer when you promote a todo.)

  describe('on SESSION_CREATED', () => {
    todo('dispatches cfb-sessions-loaded-to-idb after writing')
    todo('stores the new session to IndexedDB')                       // 1
    todo('accumulates sessions across multiple events')               // 2
    todo('the loaded event bubbles up from the element')
  })

  describe('on SESSION_REMOVED', () => {
    todo('removes the matching session from the store')
    todo('keeps the other sessions after removing one')
  })

  describe('lifecycle', () => {
    todo('stops responding to events after disconnectedCallback')
  })
})
