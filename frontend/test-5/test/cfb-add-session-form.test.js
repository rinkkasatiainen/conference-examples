import * as chai from 'chai'
import { expect } from 'chai'
import { spy } from 'sinon'
import sinonChai from 'sinon-chai'
import { sendKeys } from '@web/test-runner-commands'
import { CfbAddSessionForm } from '../../step-5/cfb-add-session-form.solution.js'
import { EventTypes } from '../../step-5/lib/events.js'
import { cleanup, fixture } from './helpers/fixture.js'
import { useSinonChai } from './helpers/chai-helpers.js'

useSinonChai(chai, sinonChai)

if (!customElements.get(CfbAddSessionForm.elementName)) {
  customElements.define(CfbAddSessionForm.elementName, CfbAddSessionForm)
}

const todo = msg => it.skip(msg, () => { /* no-op */ })

// Read each todo, then promote it into a real `it(...)`, one at a time.
//
// Mount the real form, put a `spy()` on cfb-session-created, and let NATIVE
// constraint validation gate `form.requestSubmit()`:
//
//   const onCreated = spy()
//   el.addEventListener(EventTypes.SESSION_CREATED, onCreated)
//   form.requestSubmit()
//   expect(onCreated).to.not.have.been.called   // invalid form -> nothing fires
//
// A spy is the tool for the NEGATIVE case: waitForEvent cannot prove an event
// that never comes. Use fillValidAddSessionForm(form) (below) to reach a valid
// state before asserting the positive case.

describe('<cfb-add-session-form> - constraint validation + dispatch', () => {
  let onCreated
  beforeEach(() => { onCreated = spy() })
  afterEach(cleanup)

  todo('does not dispatch cfb-session-created when the form is invalid')   // spy .to.not.have.been.called
  todo('dispatches cfb-session-created when the form is valid')            // fill first, then requestSubmit
  todo('the dispatched detail matches the entered session')
  todo('the event bubbles for upstream listeners')

  describe('validations', () => {
    todo('the title is required with a minlength of 5')
    todo('session-format is required')

    describe('does not dispatch if a required field is missing', () => {
      ;['session-format', 'start-time', 'room', 'day'].forEach(field => {
        todo(`missing ${field}`)
      })
      todo('the user types a too-short title')
    })
  })
})

// --- helpers you'll want when promoting the todos -------------------------

async function fillValidAddSessionForm(form, fillWith = {}) {
  const values = {
    title: 'Enough length for minlength',
    day: 'Wednesday',
    room: 'Track A',
    'start-time': '11:00',
    'session-format': 'Lightning Talk',
    ...fillWith
  }
  titleElementOf(form).value = values.title
  if (values['session-format']) {
    form.querySelector(`[name="session-format"][value="${values['session-format']}"]`).checked = true
  }
  if (values.day) {
    form.querySelector('[name="day"]').value = values.day
  }
  if (values.room) {
    form.querySelector('[name="room"]').value = values.room
  }
  if (values['start-time']) {
    form.querySelector('[name="start-time"]').value = values['start-time']
  }
}

function sessionFormatElementOf(form) {
  return form.querySelector('[name="session-format"]')
}

function titleElementOf(form) {
  return form.querySelector('[name="title"]')
}

async function typeInto(input, text) {
  input.focus()
  try {
    await sendKeys({ type: text })        // real driver input (CLI/CI)
  } catch {
    input.value = text                    // --manual fallback
  }
}
