import { expect, use } from 'chai'
import { schemaMatcher } from '../../testing-utils/src/chai-helpers.js'
import { sessionDetails } from '../../step-3/lib/builds-session-details.js'
import { sessionDetailsSchema } from '../../test-3/contracts/session-details.schema.js'

use(schemaMatcher)

describe('Session contract (step-5)', () => {
  let wellKnown

  before(async () => {
    // Resolved against this file, not the test page, so it survives rootDir changes.
    const response = await fetch(new URL('../contracts/session-step5.well-known.json', import.meta.url))
    wellKnown = await response.json()
  })

  describe('session-step5.well-known.json', () => {
    it('is valid according to sessionDetailsStep5Schema', () => {
      expect(wellKnown).to.matchSchema(sessionDetailsSchema)
    })
  })

  describe('sessionDetails builder', () => {
    it('built entry with scheduling extras matches the schema', () => {
      const entry = sessionDetails({
        id: 'x',
        title: 'Title Here',
        day: 'Thursday',
        room: 'Main Hall',
        startTime: '09:30',
        sessionFormat: 'Workshop',
        tags: [],
        attendees: [],
      })
      expect(entry).to.matchSchema(sessionDetailsSchema)
    })

    it('reproduces the well-known entry exactly', () => {
      expect(sessionDetails({ ...wellKnown })).to.eql(wellKnown)
    })
  })
})
