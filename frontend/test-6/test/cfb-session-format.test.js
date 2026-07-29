import { expect } from 'chai'
import { CfbSessionFormat } from '../../step-6/cfb-session-format.solution.js'
import { fixture, cleanup } from './helpers/fixture.js'

if (!customElements.get(CfbSessionFormat.elementName)) {
  customElements.define(CfbSessionFormat.elementName, CfbSessionFormat)
}

afterEach(cleanup)

const todo = msg => it.skip(msg, () => { /* no-op */ })

// Read each todo, then promote it into a real `it(...)`, one at a time.
//
// <cfb-session-format> is a FORM-ASSOCIATED custom element. Test it the way you'd
// test a native control - through FormData and checkValidity, driven by click()
// on a tile - NOT by poking `internals` directly (that's the implementation).
//
//   field.querySelector('[data-value="Workshop"]').click()
//   expect(new FormData(form).get('session-format')).to.equal('Workshop')

async function mountFormWithSessionFormat(attrs = '') {
  const form = await fixture(`
    <form>
      <cfb-session-format name="session-format" ${attrs}></cfb-session-format>
    </form>
  `)
  const field = form.querySelector('cfb-session-format')
  return { form, field }
}

describe('<cfb-session-format> - form association', () => {
  todo('does not contribute a value when nothing is selected')
  todo('writes the selected value into FormData')
  todo('honours required: form.checkValidity() is false until a value is selected')
  todo('formResetCallback clears the selected value on form.reset()')
  todo('updates FormData when a different tile is clicked')
  todo('renders tiles for all four session formats')
})

describe('<cfb-session-format> - visual state', () => {
  todo('marks the clicked tile as selected (class + aria-checked)')
  todo('deselects the previously selected tile when a new one is clicked')
})
