export class ConcreteClassThatResponds {
  respondsToAMessage(val) {
    return `value of ${val}`
  }
}

export const theMethodUnderTest = (fn, val) => fn.respondsToAMessage(val)
