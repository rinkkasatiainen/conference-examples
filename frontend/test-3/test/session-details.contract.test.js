import { use, expect } from 'chai'
import { schemaMatcher } from '../../testing-utils/src/chai-helpers.js'
import { sessionDetailsSchema } from '../contracts/session-details.schema.js'
import { sessionDetails } from '../../step-3/lib/builds-session-details.js'

use(schemaMatcher)
const todo = msg => it.skip(msg, () => {
  /* no-op */
})

describe('Session Details Contract', () => {
  describe('well-known.json', () => {
    let wellKnown

    before(async () => {
      // To support contract tests, we need to fetch the well-known.json file - and it must be a real browser fetch call
      // because that's the only way to get the json file into the browser and in the tests.
      const response = await fetch('contracts/session-details.well-known.json')
      wellKnown = await response.json()
    })

    it('is a valid sessionDetails according to the schema', () => {
      expect(wellKnown).to.matchSchema(sessionDetailsSchema)
    })

    it('reproduces the well-known entry exactly', () => {
      const entry = sessionDetails(wellKnown)
      expect(entry).to.eql(wellKnown)
    })
  })

  describe('sessionDetails builder', () => {
    describe('schema validation', () => {
      todo('having only id and title is enough to build a valid sessionDetails')
      todo('builds a new Id by default, if omitted')
      todo('removes unknown keys')
    })

    describe('default behavior', () => {
      todo('defaults tags to an empty array when omitted')
      todo('defaults attendees to an empty array when omitted')
    })

  })
})