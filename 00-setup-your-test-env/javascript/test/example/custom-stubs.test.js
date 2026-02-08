import { expect } from 'chai'

import { theMethodUnderTest } from '../../src/responds-to-message.js'

describe('using custom stubs', () => {
  it('does magic', () => {
    // With typescript, we can easily make things to look like the Interface/Shape/Role
    const respondsToMessage = {
      respondsToAMessage: () => '42',
    }
    const result = theMethodUnderTest(respondsToMessage, 0)

    expect(result).to.eql('42')
  })

  it('can be provided nice defaults', () => {
    // let's create a nice little helper (look below)
    // try commenting the overrides to see the test break
    const respondsToMessage = mockWith({
      respondsToAMessage: () => '42',
    })
    const result = theMethodUnderTest(respondsToMessage, 0)

    expect(result).to.eql('42')
  })
})

const mockWith = overrides => {
  const defaultValues = {
    respondsToAMessage: () => {
      throw new Error("unexpected call to 'respondsToAMessage'")
    },
  }
  return { ...defaultValues, ...overrides }
}
