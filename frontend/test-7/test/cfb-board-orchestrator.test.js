import { expect } from 'chai'
import { CfbBoardOrchestrator } from '../../step-7/cfb-board-orchestrator.solution.js'
import { cleanup, fixture } from './helpers/fixture.js'

if (!customElements.get('cfb-board-orchestrator')) {
  customElements.define('cfb-board-orchestrator', CfbBoardOrchestrator)
}

const todo = msg => it.skip(msg, () => { /* no-op */ })

afterEach(cleanup)

// Read each todo, then promote it into a real `it(...)`, one at a time.
//
// No fetch, no IDB. Drive the orchestrator with SYNTHETIC loader events and
// assert it only signals the schedule once BOTH loaders complete for the SAME
// eventId - a barrier:
//
//   fire(el, 'cfb-schedule-loaded', { eventId: 'evt-a', updatedAt: 9999 })
//   fire(el, 'cfb-sessions-loaded', { eventId: 'evt-a', updatedAt: 9999 })
//   expect(schedule.getAttribute('data-latest-updated-at')).to.equal('9999')

function fire(target, type, detail) {
  target.dispatchEvent(new CustomEvent(type, { bubbles: true, detail }))
}

describe('<cfb-board-orchestrator>', () => {
  todo('sets data-latest-updated-at on .listens-schedule-updates when BOTH loaders complete')
  todo('does not signal the schedule when only one loader has completed')   // the barrier
  todo('ignores a mismatched loader pair after the event id changes')       // eventId gate
})
