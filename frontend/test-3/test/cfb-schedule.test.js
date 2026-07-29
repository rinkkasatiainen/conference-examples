import { expect } from 'chai'
import { fixture, cleanup } from './helpers/fixture.js'
import { sessionDetails } from '../../step-3/lib/builds-session-details.js'
import { Randomizer as R } from '../../test-2/test/helpers/randomizer.js'
import { CfbSchedule } from '../../step-3/cfb-schedule.js'

customElements.define('cfb-schedule', CfbSchedule)

const todo = msg => it.skip(msg, () => { /* no-op */ })

describe('<cfb-schedule>', () => {
  afterEach(cleanup)

  // Read each todo, then promote it into a real `it(...)`, one at a time.
  //
  // <cfb-schedule> is the subscriber: it takes `data-sessions` (a JSON array) DOWN
  // via setAttribute and renders one column per day, one card per session, or a
  // placeholder when empty. Note the counts follow the 0, 1, 2, many heuristic.
  //
  //   el.setAttribute('data-sessions', JSON.stringify([sessionWith({ day: 'Wednesday' })]))

  describe('with no sessions', () => {                                        // 0
    todo('renders a placeholder when no data-sessions attribute is set')
    todo('renders a placeholder when data-sessions is an empty array')
  })

  describe('with sessions', () => {                                           // 1, 2, many
    todo('renders one card per session')
    todo('creates one column per distinct day')
    todo('groups sessions from the same day into a single column')
    todo('labels each column with its day name')
    todo('orders columns Wednesday -> Thursday -> Friday regardless of input order')
  })

  describe('reactivity', () => {
    todo('adds a card when a session is appended to data-sessions')
    todo('shows the placeholder again when data-sessions is cleared')
  })
})
