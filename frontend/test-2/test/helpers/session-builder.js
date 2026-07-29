import { Randomizer } from './randomizer.js'
import { sessionDetails } from '../../../step-3/lib/builds-session-details.js'

export const sessionWith = (mockWith = {}) => {
  const randomSession = {
    title: Randomizer.stringOf(10),
    tags: [
      Randomizer.tag(),
      Randomizer.tag()
    ],
    attendees: [
      Randomizer.attendee(),
      Randomizer.attendee(),
      Randomizer.attendee()
    ],
  }

  return sessionDetails({ ...randomSession, ...mockWith })
}