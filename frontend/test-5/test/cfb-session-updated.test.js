import { expect, use } from 'chai'
import { schemaMatcher } from '../../testing-utils/src/chai-helpers.js'
import { sessionDetails } from '../../step-3/lib/builds-session-details.js'
import { cfbSessionUpdated, EventTypes } from '../../step-5/lib/events.js'
import { Randomizer as R } from '../../test-2/test/helpers/randomizer.js'
import { sessionDetailsSchema } from '../../test-3/contracts/session-details.schema.js'

use(schemaMatcher)

const todo = msg => it.skip(msg, () => { /* no-op */ })

// Read each todo, then promote it into a real `it(...)`. This is the SAME shape
// of contract test as T-3's cfb-session-created, on the new cfbSessionUpdated
// event:
//
//   const event = cfbSessionUpdated(sessionWith())
//   const { _type, ...session } = event.detail
//   expect(session).to.matchSchema(sessionDetailsSchema)

describe('cfbSessionUpdated event factory', () => {
  describe('event structure', () => {
    todo('produces a CustomEvent with the correct type (cfb-session-updated)')
    todo('event bubbles')
    todo('event is composed')
    todo('detail contains _type matching the event type')
    todo('session fields are spread directly into detail (not nested)')
  })

  describe('valid events - detail must match the schema', () => {
    todo('a session with scheduling extras produces a valid detail')
    todo('extra/unknown keys are stripped from the detail')
  })
})

// --- helpers you'll want when promoting the todos -------------------------

function sessionFrom(event) {
  const { _type, ...session } = event.detail
  return session
}

function sessionWith(overrides = {}) {
  return sessionDetails({
    id: R.stringOf(6),
    title: R.stringOf(12),
    day: R.day(),
    room: R.room(),
    tags: [R.tag()],
    attendees: [R.attendee()],
    ...overrides,
  })
}
