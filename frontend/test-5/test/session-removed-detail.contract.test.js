import { use, expect } from 'chai'
import { schemaMatcher } from '../../testing-utils/src/chai-helpers.js'
import { sessionRemovedDetailSchema } from '../contracts/session-removed-detail.schema.js'

use(schemaMatcher)

describe('Session removed detail contract (step-5)', () => {
  let wellKnown

  before(async () => {
    // Resolved against this file, not the test page, so it survives rootDir changes.
    const response = await fetch(new URL('../contracts/session-removed-detail.well-known.json', import.meta.url))
    wellKnown = await response.json()
  })

  it('session-removed-detail.well-known.json matches the detail schema', () => {
    expect(wellKnown).to.matchSchema(sessionRemovedDetailSchema)
  })
})
