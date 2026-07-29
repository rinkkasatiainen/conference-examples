import { expect } from 'chai'
import { CfbScheduleLoader } from '../../step-7/cfb-schedule-loader.solution.js'
import { resetForTests } from './helpers/fake-session-store-core.js'
import { cleanup, fixture, fixtureAndWaitFor } from './helpers/fixture.js'
import { worker, http, HttpResponse, delay, API } from './helpers/msw.js'

if (!customElements.get('cfb-schedule-loader')) {
  customElements.define('cfb-schedule-loader', CfbScheduleLoader)
}

const SCHEDULE = { eventId: 'evt-a', name: 'Test Conf', days: [] }

before(async () => {
  await worker.start({ onUnhandledRequest: 'bypass', quiet: true })
})
afterEach(async () => {
  worker.resetHandlers()
  cleanup()
  await resetForTests()
})
after(() => worker.stop())

describe('<cfb-schedule-loader>', () => {
  it('dispatches scheduleLoaded with the correct eventId after a 200 response', async () => {
    worker.use(
      http.get(`${API}/api/schedule/:eventId`, () => HttpResponse.json(SCHEDULE)),
    )

    const { event } = await fixtureAndWaitFor(
      '<cfb-schedule-loader data-event-id="evt-a"></cfb-schedule-loader>',
      'cfb-schedule-loaded',
    )

    expect(event.bubbles).to.be.true
    expect(event.detail.eventId).to.equal('evt-a')
    expect(event.detail.updatedAt).to.be.a('number')
  })

  it('dispatches loaderError when the response is not ok', async () => {
    worker.use(
      http.get(`${API}/api/schedule/:eventId`, () => new HttpResponse(null, { status: 404 })),
    )

    const { event } = await fixtureAndWaitFor(
      '<cfb-schedule-loader data-event-id="evt-a"></cfb-schedule-loader>',
      'cfb-loader-error',
    )

    expect(event.detail.loader).to.equal('schedule')
    expect(event.detail.eventId).to.equal('evt-a')
  })

  it('shows loading state while the request is in flight', async () => {
    worker.use(
      http.get(`${API}/api/schedule/:eventId`, async () => {
        await delay('infinite')
      }),
    )

    const el = await fixture('<cfb-schedule-loader data-event-id="evt-a"></cfb-schedule-loader>')
    await Promise.resolve()

    expect(el.dataset.state).to.equal('loading')
  })
})
