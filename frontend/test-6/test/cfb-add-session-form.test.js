import { expect } from 'chai'
import { CfbAddSessionForm } from '../../step-6/cfb-add-session-form.solution.js'
import { EventTypes } from '../../step-5/lib/events.js'
import { CfbSessionFormat } from '../../step-6/cfb-session-format.solution.js'
import { fixture, cleanup } from './helpers/fixture.js'

customElements.define(CfbSessionFormat.elementName, CfbSessionFormat)
customElements.define(CfbAddSessionForm.elementName, CfbAddSessionForm)

afterEach(cleanup)

function fillValidAddSessionForm(form) {
  form.querySelector('[name="title"]').value = 'Enough length for minlength'
  form.querySelector('[name="day"]').value = 'Wednesday'
  form.querySelector('[name="room"]').value = 'Track A'
  form.querySelector('[name="start-time"]').value = '11:00'

  const sessionFormat = form.querySelector('cfb-session-format')
  const tile = sessionFormat.querySelector('[data-value="Lightning Talk"]')
  tile.click()
}

describe('Does not duplicate the tests from step-5', () => {
  it('most of the tests from step-5 could be copy-pasted here', () => {
    expect(true).to.be.true
  })
})

describe('<cfb-add-session-form> (step 6) - constraint validation + dispatch', () => {
  it('does not dispatch session-created when the form is invalid (requestSubmit)', async () => {
    const el = await fixture('<cfb-add-session-form></cfb-add-session-form>')
    const form = el.querySelector('form')
    let count = 0
    el.addEventListener(EventTypes.SESSION_CREATED, () => {
      count += 1
    })
    form.requestSubmit()
    expect(count).to.equal(0)
  })

  it('dispatches cfb-session-created when the form is valid and includes sessionFormat detail', async () => {
    const el = await fixture('<cfb-add-session-form></cfb-add-session-form>')
    const form = el.querySelector('form')
    fillValidAddSessionForm(form)

    let detail = null
    el.addEventListener(EventTypes.SESSION_CREATED, e => {
      detail = e.detail
    })
    form.requestSubmit()

    expect(detail).to.not.be.null
    expect(detail._type).to.equal(EventTypes.SESSION_CREATED)
    expect(detail.title).to.equal('Enough length for minlength')
    expect(detail.day).to.equal('Wednesday')
    expect(detail.room).to.equal('Track A')
    expect(detail.startTime).to.equal('11:00')
    expect(detail.sessionFormat).to.equal('Lightning Talk')
    expect(detail.id).to.be.a('string').and.not.be.empty
  })
})

