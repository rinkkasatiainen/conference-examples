import { expect } from 'chai'

import { theMethodUnderTest } from '../../src/responds-to-message.js'

class TestableClass {
  #val

  constructor(val) {
    this.#val = val
  }

  respondsToAMessage() {
    return `${this.#val}`
  }
}

describe('using testable classes', () => {
  it('can be overridden', () => {
    const result = theMethodUnderTest(new TestableClass(22), 0)
    expect(result).to.eql('22')
  })
})
