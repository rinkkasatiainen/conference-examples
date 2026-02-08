import { expect } from 'chai'

import sinon from 'sinon'
import { ConcreteClassThatResponds, theMethodUnderTest } from '../../src/responds-to-message.js'

describe('using sinon', () => {
  it('with a custom-override with sinon', () => {
    // with sinon.stub(), we stub a single method
    const message = sinon.stub()
    const collaborator = {
      // ..that we inject to the 'shape'
      respondsToAMessage: message,
    }
    // and we prepare the stub to return a canned value
    message.returns('4321')

    const result = theMethodUnderTest(collaborator, 0)

    expect(result).to.eql('4321')
  })

  it('with a stub an interface', () => {
    // stub a concrete implementation - does this partial mock? That would be scary.
    const collaborator = sinon.createStubInstance(ConcreteClassThatResponds, {
      respondsToAMessage: 'A String',
    })

    const result = theMethodUnderTest(collaborator, 0)

    expect(result).to.eql('A String')
  })
})
