import { expect } from 'chai'
import { CfbLiveSessionUpdates } from '../../step-8/cfb-live-session-updates.solution.js'
import { EventTypes } from '../../step-8/lib/events.js'
import { FakeWebSocket } from './helpers/fake-websocket.js'
import { cleanup, mountLiveUpdates } from './helpers/fixture.js'

if (!customElements.get('cfb-live-session-updates')) {
  customElements.define(CfbLiveSessionUpdates.elementName, CfbLiveSessionUpdates)
}

const todo = msg => it.skip(msg, () => { /* no-op */ })

// Read each todo, then promote it into a real `it(...)`, one at a time.
//
// Replace the GLOBAL window.WebSocket CONSTRUCTOR with FakeWebSocket (which
// extends EventTarget). The component's `new WebSocket(url)` then gets your
// double. Push a server message and assert the DOM events it re-dispatches:
//
//   window.WebSocket = FakeWebSocket
//   const el = await mountLiveUpdates()
//   FakeWebSocket.last.receive({ type: 'sessionUpdated', session: {...} })
//   // -> el dispatches EventTypes.SESSION_UPDATED
//
// Restore the real constructor in afterEach.

let OriginalWebSocket

beforeEach(() => {
  OriginalWebSocket = window.WebSocket
  window.WebSocket = FakeWebSocket
  FakeWebSocket.last = null
})

afterEach(() => {
  window.WebSocket = OriginalWebSocket
  cleanup()
})

describe('<cfb-live-session-updates>', () => {
  todo('opens a WebSocket to the configured URL including eventId')
  todo('dispatches cfb-session-updated when a sessionUpdated message arrives')
  todo('dispatches cfb-session-removed for sessionRemoved messages')
  todo('does not dispatch session events for unknown message types')
  todo('closes the socket in disconnectedCallback')                         // no leaked sockets
})
