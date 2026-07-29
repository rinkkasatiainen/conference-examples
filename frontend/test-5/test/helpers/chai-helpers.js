import { Assertion } from 'chai'

export function useSinonChai(chai, sinonChai) {
  chai.use(sinonChai)
  chai.use(overrideCallWithMatch('called'))
  chai.use(overrideCallWithMatch('true'))
}

function overrideCallWithMatch(name = 'called') {
  return () => {
    Assertion.overwriteProperty(name, _super =>
      function () {
        try {
          _super.apply(this, arguments)
        } catch (error) {
          delete error.actual
          throw error
        }
      })
  }
}

