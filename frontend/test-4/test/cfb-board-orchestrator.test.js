import { expect } from 'chai'
import { CfbBoardOrchestrator } from '../../step-4/cfb-board-orchestrator.js'
import { fixture, cleanup } from './helpers/fixture.js'
import { tick } from './helpers/async.js'
import { sessionDetails } from '../../step-3/lib/builds-session-details.js'
import { Randomizer as R } from '../../test-2/test/helpers/randomizer.js'
import { cfbSessionsLoadedToIDB } from '../../step-4/lib/events.js'

if (!customElements.get('cfb-board-orchestrator')) {
  customElements.define('cfb-board-orchestrator', CfbBoardOrchestrator)
}

// No IDB involved - the step-4 orchestrator is stateless:
// it listens for cfb-sessions-loaded-to-idb and sets data-latest-updated-at
// on .listens-schedule-updates (schedule pulls fresh rows from IDB).

const todo = msg => it.skip(msg, () => { /* no-op */ })

describe('<cfb-board-orchestrator>', () => {
  afterEach(cleanup)

  // Read each todo, then promote it into a real `it(...)`, one at a time.
  // This orchestrator is SYNCHRONOUS (event -> setAttribute), so no waiting is
  // needed here - a deliberate contrast to the async loader/store suites.
  //   el.dispatchEvent(cfbSessionsLoadedToIDB())

  describe('on cfb-sessions-loaded-to-idb', () => {
    todo('sets data-latest-updated-at on the .listens-schedule-updates target')            // 1
    todo('updates every .listens-schedule-updates target when there are several')          // many
    todo('bumps data-latest-updated-at on a later event (use tick(10) for a real delay)')  // time passes
  })

  describe('lifecycle', () => {
    todo('stops responding to events after disconnectedCallback')                          // 0 after teardown
  })
})
