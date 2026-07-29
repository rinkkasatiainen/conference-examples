import { expect } from 'chai'
import { CfbSessionLoader } from '../../step-7/cfb-session-loader.solution.js'
import { resetForTests } from './helpers/fake-session-store-core.js'
import { cleanup, fixture, fixtureAndWaitFor } from './helpers/fixture.js'
import { worker, http, HttpResponse, delay, API } from './helpers/msw.js'

if (!customElements.get('cfb-session-loader')) {
  customElements.define('cfb-session-loader', CfbSessionLoader)
}

const todo = msg => it.skip(msg, () => { /* no-op */ })

const SESSIONS = [
  { id: 's1', eventId: 'evt-a', title: 'Talk', day: 'Mon', room: 'R1', tags: [], attendees: [] },
]

// Read each todo, then promote it into a real `it(...)`, one at a time.
//
// The loader makes a real fetch through the backend-api seam. MSW intercepts it
// at the network boundary - no window.fetch patching. Declare the handler the
// case needs with worker.use(), shaped to the scenario:
//
//   worker.use(http.get(`${API}/api/sessions/:eventId`, () => HttpResponse.json(SESSIONS)))     // 200
//   worker.use(http.get(`${API}/api/sessions/:eventId`, () => new HttpResponse(null, {status:404}))) // error
//   worker.use(http.get(`${API}/api/sessions/:eventId`, async () => { await delay('infinite') }))     // loading
//
// Assert observable output: el.dataset.state, and the bubbling sessionsLoaded /
// loaderError events (fixtureAndWaitFor catches the event fired on connect).

before(async () => {
  await worker.start({ onUnhandledRequest: 'bypass', quiet: true })
})
afterEach(async () => {
  worker.resetHandlers()          // drop this test's handlers so they don't leak
  cleanup()
  await resetForTests()
})
after(() => worker.stop())

describe('<cfb-session-loader>', () => {
  todo('dispatches sessionsLoaded with the correct eventId after a 200 response')
  todo('dispatches loaderError when the response is not ok')
  todo('shows dataset.state = "loading" while the request is in flight')
  todo('re-fetches when data-event-id changes')
})
