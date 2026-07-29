import { expect } from 'chai'
import { cleanup, fixture } from './helpers/fixture.js'
import { Randomizer } from '../../test-2/test/helpers/randomizer.js'
import { cfbSessionCreated } from '../../step-3/lib/events.js'
import { sessionDetails } from '../../step-3/lib/builds-session-details.js'
import { CfbBoardOrchestrator } from '../../step-3/cfb-board-orchestrator.js'

customElements.define('cfb-board-orchestrator', CfbBoardOrchestrator)

const todo = msg => it.skip(msg, () => { /* no-op */ })

describe('<cfb-board-orchestrator>', () => {
  afterEach(cleanup)

  // Read each todo, then promote it into a real `it(...)`, one at a time.
  //
  // The orchestrator listens for `cfb-session-created` events bubbling UP and
  // pushes the accumulated sessions DOWN as `data-sessions` on its
  // `.cfb-updates-schedule` child. Drive it with synthetic dispatch - no button:
  //
  //   el.dispatchEvent(cfbSessionCreated(sessionWith({ id: 's1' })))
  //   const pushed = JSON.parse(schedule.getAttribute('data-sessions'))
  //
  // Build payloads with the `sessionDetails` + `Randomizer` builder from T-2/T-3.

  describe('listening for cfb-session-created', () => {
    todo('sets data-sessions on the .cfb-updates-schedule child after one event')                 // 1 session
    todo('accumulates two events - both sessions present, the second does not replace the first') // 2 sessions
    todo('keeps sessions with different ids distinct - no mix-up')                                 // many
    todo('sets the data-session on all listeners') // 2 listeners
  })

  describe('what it pushes down stays sound', () => {
    todo('every session written to data-sessions still matches the session-details contract')
  })

  describe('lifecycle', () => {
    todo('stops responding to events after disconnectedCallback')                                 // 0 after teardown
  })
})
