import { expect } from 'chai'

const todo = msg => it.skip(msg, () => { /* no-op */ })

describe('fizz buzz', () => {

  it('1 => 1', () => {
    expect(fizzBuzz(1)).to.eql(1)
  })
  it('2 => 2', () => {
    expect(fizzBuzz(2)).to.eql(2)
  })
  it('3 => Fizz', () => {
    expect(fizzBuzz(3)).to.eql('Fizz')
  })
  todo('6 => Fizz', () => {})
  todo('5 => Buzz', () => {})
  todo('10 => Buzz', () => {})
  todo('15 => FizzBuzz', () => {})
})

function fizzBuzz(n) {
  if (n % 3 === 0) {
    return 'Fizz'
  }
  return n
}
