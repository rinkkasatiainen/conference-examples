import { use, expect } from 'chai'
import { schemaMatcher } from '../../testing-utils/src/chai-helpers.js'
import { sessionDetailsSchema } from '../contracts/session-details.schema.js'
import { cfbSessionCreated, EventTypes } from '../../step-3/lib/events.js'
import { sessionDetails } from '../../step-3/lib/builds-session-details.js'
import { Randomizer as R } from '../../test-2/test/helpers/randomizer.js'

use(schemaMatcher)

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Builds a fully-valid random session, with per-test overrides. */
function sessionWith(overrides = {}) {
  return sessionDetails({
    id: R.stringOf(6),
    title: R.stringOf(12),
    tags: [R.tag()],
    attendees: [R.attendee()],
    ...overrides,
  })
}

const sessionWithExtraProperties = (overrides = {}) => ({
  id: R.stringOf(6),
  title: R.stringOf(12),
  tags: [R.tag()],
  attendees: [R.attendee()],
  ...overrides,
})

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('cfbSessionCreated event factory', () => {

  describe('event structure', () => {
    it('produces a CustomEvent with the correct type', () => {
      const event = cfbSessionCreated(sessionWith())
      expect(event.type).to.equal(EventTypes.SESSION_CREATED)
      expect(event.detail._type).to.equal(EventTypes.SESSION_CREATED)
    })

    it('event bubbles', () => {
      const event = cfbSessionCreated(sessionWith())
      expect(event.bubbles).to.be.true
    })

    it('event is composed', () => {
      const event = cfbSessionCreated(sessionWith())
      expect(event.composed).to.be.true
    })

    it('session fields are spread directly into detail (not nested)', () => {
      const session = sessionWith({ id: 'talk-1', title: 'My Talk' })
      const event = cfbSessionCreated(session)
      expect(event.detail.id).to.equal('talk-1')
      expect(event.detail.title).to.equal('My Talk')
    })
  })

  describe('valid events - session in detail must match schema', () => {
    /** a helper to strip the `_type` discriminator and returns the plain session payload. */
    function sessionFrom(event) {
      const { _type, ...session } = event.detail
      return session
    }

    it('full session with day and room produces a valid detail', () => {
      const event = cfbSessionCreated(sessionWith({ day: R.day(), room: R.room() }))
      expect(sessionFrom(event)).to.matchSchema(sessionDetailsSchema)
    })

    it('extra keys for session still matches schema', () => {
      const event = cfbSessionCreated(sessionWithExtraProperties({
        any: 'extra',
        should: 'be ignored',
      }))
      expect(sessionFrom(event)).to.matchSchema(sessionDetailsSchema)
    })
  })
})
