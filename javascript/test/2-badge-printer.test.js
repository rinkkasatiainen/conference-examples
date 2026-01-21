import {expect} from 'chai'
import {BadgeDispenser} from '../src/badge-printer/badge-dispenser.js'

describe('badge-printer', () => {
  it.skip('prints a badge', () => {
    const badgeDispenser = new BadgeDispenser()

    const result = badgeDispenser.createBadge("Test person", "they/them")

    expect(result).to.eql({id: 'CONF-1', name: 'Test person', pronouns: 'they/them'})
  })

  it.skip('prints second badge', () => {
    const badgeDispenser = new BadgeDispenser()

    const result = badgeDispenser.createBadge("Test person", "they/them")

    expect(result).to.eql({id: 'CONF-1', name: 'Test person', pronouns: 'they/them'})
  })
})