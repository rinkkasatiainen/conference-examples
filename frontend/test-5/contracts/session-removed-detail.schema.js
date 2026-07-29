import { expect, use } from 'chai'
import { schemaMatcher } from '../../testing-utils/src/chai-helpers.js'
import { EventTypes } from '../../step-5/lib/events.js'

use(schemaMatcher)

export const sessionRemovedDetailSchema = {
  sessionId: value => expect(value).to.be.a('string').and.not.be.empty,
  _type: value => expect(value).to.equal(EventTypes.SESSION_REMOVED),
}
