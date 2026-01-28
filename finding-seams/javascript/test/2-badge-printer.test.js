import {expect} from 'chai'
import {BadgeDispenser} from '../src/badge-printer/badge-dispenser.js'

describe('badge-printer', () => {
  it.skip('prints a badge', () => {
    const badgeDispenser = new BadgeDispenser()

    const {id, name, pronouns} = badgeDispenser.createBadge("Test person", "they/them")

    expect({id, name, pronouns}).to.eql({id: 'CONF-1', name: 'Test person', pronouns: 'they/them'})
  })

  it.skip('prints second badge', () => {
    const badgeDispenser = new BadgeDispenser()

    const {id, name, pronouns} = badgeDispenser.createBadge("Test person", "they/them")

    expect({id, name, pronouns}).to.eql({id: 'CONF-1', name: 'Test person', pronouns: 'they/them'})
  })
})