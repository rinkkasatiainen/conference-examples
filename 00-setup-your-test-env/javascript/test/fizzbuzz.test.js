const todo = msg => it.skip(msg, () => { /* no-op */ })

describe('fizz buzz', () => {

  todo('1 => 1', () => {})
  todo('2 => 2', () => {})
  todo('3 => Fizz', () => {})
  todo('6 => Fizz', () => {})
  todo('5 => Buzz', () => {})
  todo('10 => Buzz', () => {})
  todo('15 => FizzBuzz', () => {})
})
