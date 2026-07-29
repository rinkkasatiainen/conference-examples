import { expect } from 'chai'
import { CfbEditSessionForm } from '../../step-6/cfb-edit-session-form.solution.js'
import { CfbSessionFormat } from '../../step-6/cfb-session-format.solution.js'
import { fixture, cleanup } from './helpers/fixture.js'
import { sessionDetails } from '../../step-3/lib/builds-session-details.js'

customElements.define(CfbSessionFormat.elementName, CfbSessionFormat)
customElements.define(CfbEditSessionForm.elementName, CfbEditSessionForm)

afterEach(cleanup)

function seedSession(overrides = {}) {
  return sessionDetails({
    id: 'seed-1',
    title: 'Original title',
    day: 'Wednesday',
    room: 'Main Hall',
    sessionFormat: 'Talk',
    startTime: '09:00',
    tags: [],
    attendees: [],
    ...overrides,
  })
}

describe('<cfb-edit-session-form> - populate + save', () => {
  it('populate fills fields and save dispatches cfb-edit-saved with updated sessionUpdatedEvent', async () => {
    const host = document.createElement('div')
    host.id = 'testRoot'
    document.body.appendChild(host)
    const formEl = document.createElement('cfb-edit-session-form')
    host.appendChild(formEl)
    await customElements.whenDefined('cfb-edit-session-form')

    const original = seedSession()
    formEl.populate(original)

    const form = formEl.querySelector('form')
    form.querySelector('[name="title"]').value = 'Updated title'
    form.querySelector('[name="day"]').value = 'Thursday'
    form.querySelector('[name="room"]').value = 'Track B'
    form.querySelector('[name="start-time"]').value = '10:30'

    const st = form.querySelector('cfb-session-format')
    const tile = st.querySelector('[data-value="Workshop"]')
    tile.click()

    let payload = null
    host.addEventListener('cfb-edit-saved', e => {
      payload = e.detail
    })

    form.requestSubmit()

    expect(payload).to.not.be.null
    const { sessionUpdatedEvent } = payload
    expect(sessionUpdatedEvent).to.be.instanceOf(CustomEvent)
    const detail = sessionUpdatedEvent.detail
    expect(detail.id).to.equal('seed-1')
    expect(detail.title).to.equal('Updated title')
    expect(detail.day).to.equal('Thursday')
    expect(detail.room).to.equal('Track B')
    expect(detail.startTime).to.equal('10:30')
    expect(detail.sessionFormat).to.equal('Workshop')
  })
})

