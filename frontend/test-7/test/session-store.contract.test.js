// Session-store contract - one suite, two runs (the T-4 pattern).
//
// The store is imported through the step-7 wrapper specifier, which is what the
// import map swaps:
//   test:store:fake -> web-test-runner.config.mjs      -> the FAKE answers (helpers/fake-session-store.js)
//   test:store:real -> web-test-runner.store-real.config.mjs (no map) -> real IndexedDB answers
//
// If the SAME assertions pass against both, the fake and the real store are
// proven interchangeable - which is what lets every other T-7 suite lean on the
// fast fake without lying about behaviour.
import { expect, use } from 'chai'
import { schemaMatcher } from '../../testing-utils/src/chai-helpers.js'
import { sessionDetailsSchema } from '../../test-3/contracts/session-details.schema.js'
import { sessionDetails } from '../../step-3/lib/builds-session-details.js'
import { Randomizer as R } from '../../test-2/test/helpers/randomizer.js'
import {
  deleteSession,
  getAllSessions,
  getSessionsByDay,
  saveSessions,
  updateSession,
} from '../../step-7/lib/store/session-store.js'


use(schemaMatcher)

const filterById = (...ids) => (data) => data.filter(it => ids.includes(it.id))

describe('session-store contract', () => {
  after(async function () {
    this.timeout(15000)
  })

  describe('saveSessions / getAllSessions', () => {
    it('returns an empty array when nothing has been saved', async () => {
      expect(await getAllSessions()).to.eql([])
    })

    it('round-trips a saved session', async () => {
      const id = R.uuid()
      const session = sessionWith({ id })
      await saveSessions([session])
      const stored = await getAllSessions()
      expect(filterById(id)(stored)).to.eql([session])
    })

    it('stores multiple sessions', async () => {
      const id1 = R.uuid()
      const id2 = R.uuid()
      await saveSessions([sessionWith({ id: id1 }), sessionWith({ id: id2 })])
      let stored = await getAllSessions()
      expect(filterById(id1, id2)(stored)).to.have.length(2)
    })

    it('upserts - re-saving the same id overwrites the entry', async () => {
      const id = R.uuid()
      await saveSessions([sessionWith({ id, title: 'Original' })])
      await saveSessions([sessionWith({ id, title: 'Updated' })])
      const result = await getAllSessions()
      const stored = filterById(id)(result)
      expect(stored).to.have.length(1)
      expect(stored[0].title).to.equal('Updated')
    })

    it('every stored session matches the sessionDetails schema', async () => {
      await saveSessions([sessionWith(), sessionWith()])
      const sessions = await getAllSessions()
      sessions.forEach(s => expect(s).to.matchSchema(sessionDetailsSchema))
    })
  })

  describe('updateSession', () => {
    it('replaces data for an existing id', async () => {
      const id = R.uuid()
      await saveSessions([sessionWith({ id, title: 'Original' })])
      await updateSession(sessionWith({ id, title: 'Updated' }))
      const stored = filterById(id)(await getAllSessions())
      expect(stored).to.have.length(1)
      expect(stored[0].title).to.equal('Updated')
    })

    it('throws when the session id does not exist', async () => {
      await saveSessions([sessionWith({ id: 'exists' })])
      let err
      try {
        await updateSession(sessionWith({ id: 'missing' }))
      } catch (e) {
        err = e
      }
      expect(err, 'expected updateSession to throw').to.be.instanceOf(Error)
    })

    it('updates several existing sessions in one call', async () => {
      const id1 = R.uuid()
      const id2 = R.uuid()
      await saveSessions([
        sessionWith({ id: id1, title: 'A0' }),
        sessionWith({ id: id2, title: 'B0' }),
      ])
      await updateSession(sessionWith({ id: id1, title: 'A1' }))
      await updateSession(sessionWith({ id: id2, title: 'B1' }))
      const all = await getAllSessions()
      expect(filterById(id1)(all)[0].title).to.equal('A1')
      expect(filterById(id2)(all)[0].title).to.equal('B1')
    })

    it('updated sessions still match the sessionDetails schema', async () => {
      const id = R.uuid()
      await saveSessions([sessionWith({ id })])
      const updated = sessionWith({ id, title: 'Replaced title' })
      await updateSession(updated)
      const stored = filterById(id)(await getAllSessions())[0]
      expect(stored).to.matchSchema(sessionDetailsSchema)
    })
  })

  describe('deleteSession', () => {
    it('removes a session by id', async () => {
      const id1 = 's1'
      const id2 = 's2'
      await saveSessions([sessionWith({ id: id1 }), sessionWith({ id: id2 })])
      await deleteSession(id1)
      const ids = (await getAllSessions()).map(s => s.id)
      expect(ids).to.not.include(id1)
      expect(ids).to.include(id2)
    })

    it('deleting a non-existent id does not throw', async () => {
      await deleteSession('ghost')
    })
  })

  describe('getSessionsByDay', () => {
    it('returns only sessions for the requested day', async () => {
      const id1 = R.uuid()
      const id2 = R.uuid()
      const id3 = R.uuid()
      await saveSessions([
        sessionWith({ id: id1, day: 'Wednesday' }),
        sessionWith({ id: id2, day: 'Wednesday' }),
        sessionWith({ id: id3, day: 'Thursday' }),
      ])
      const result = await getSessionsByDay('Wednesday')
      const stored = filterById(id1, id2, id3)(result)
      expect(stored).to.have.length(2)
      expect(stored.every(s => s.day === 'Wednesday')).to.be.true
    })

    it('returns an empty array for an unknown day', async () => {
      expect(await getSessionsByDay('Monday')).to.eql([])
    })
  })
})

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
