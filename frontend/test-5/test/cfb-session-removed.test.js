import { use, expect } from 'chai'
import { schemaMatcher } from '../../testing-utils/src/chai-helpers.js'
import { sessionRemovedDetailSchema } from '../contracts/session-removed-detail.schema.js'
import { cfbSessionRemoved, EventTypes } from '../../step-5/lib/events.js'
import { Randomizer as R } from '../../test-2/test/helpers/randomizer.js'

use(schemaMatcher)

describe('cfbSessionRemoved event factory (step-5 entry)', () => {
  describe('event structure', () => {
    it('produces a CustomEvent with the correct type', () => {
      const event = cfbSessionRemoved('session-id-1')
      expect(event.type).to.equal(EventTypes.SESSION_REMOVED)
      expect(event.type).to.equal('cfb-session-removed')
    })

    it('event bubbles', () => {
      expect(cfbSessionRemoved(R.stringOf(8)).bubbles).to.be.true
    })

    it('event is composed', () => {
      expect(cfbSessionRemoved(R.stringOf(8)).composed).to.be.true
    })

    it('detail matches sessionRemovedDetailSchema', () => {
      const id = 'remove-me-123'
      const event = cfbSessionRemoved(id)
      expect(event.detail).to.matchSchema(sessionRemovedDetailSchema)
      expect(event.detail.sessionId).to.equal(id)
    })
  })
})
