# Tips

[← Back to README - 3) Concrete practice](./README.md#3-concrete-practice)

## Registering elements

Register each element at the top of its test file:

```js
import { expect } from 'chai'
import { CfbSessionGenerator } from '../../step-3/cfb-session-generator.js'
import { fixture, cleanup } from './helpers/fixture.js'

customElements.define('cfb-session-generator', CfbSessionGenerator)
```

Prefer `EventTypes` and `cfbSessionCreated()` from `step-3/lib/events.js` over hard-coded strings.

## Capturing an event in a test

Attach a listener **before** the action:

```js
let captured = null
el.addEventListener('cfb-session-created', (e) => { captured = e })
el.querySelector('button').click()
// assert on captured
```

## Dispatching events to test the orchestrator

No button click required - dispatch onto the orchestrator:

```js
const el = await fixture(`
  <cfb-board-orchestrator>
    <div class="cfb-updates-schedule"></div>
  </cfb-board-orchestrator>
`)

el.dispatchEvent(new CustomEvent('cfb-session-created', {
  bubbles: true,
  detail: { id: 's1', title: 'Test Session' },
}))

const sessions = JSON.parse(
  el.querySelector('.cfb-updates-schedule').getAttribute('data-sessions')
)
expect(sessions.some(s => s.id === 's1')).to.be.true
```

**Notice there is no `await` before the assertion.** `dispatchEvent` is **synchronous** - the listener
runs, `setAttribute` fires the synchronous `attributeChangedCallback`, and the DOM is updated before the
next line. Everything in steps 1–3 works this way, so tests assert immediately. You don't need
`await Promise.resolve()` or a `tick` helper here; adding one only hides the fact that this code is
synchronous. Genuine async waiting starts in **step 4** with IndexedDB (see `test-4/tips.md`).

## Schema / contract tests

Session shape validators live in `test-3/contracts/`. Strip `_type` from event detail before `matchSchema`:

```js
const { _type, ...session } = e.detail
expect(session).to.matchSchema(sessionDetailsSchema)
```

## Fetching `well-known.json` into a test

`contracts/session-details.well-known.json` is a **real JSON file** - the kind of artifact you would hand to
the backend team and say "this is what we agree a session looks like". So the test reads it the way any
consumer would: over HTTP, with a real browser `fetch`. Don't copy the fixture into the test file - the
moment there are two copies, the contract stops being a contract.

`fetch` is async, but the assertions are not. Load the file **once** in a `before` hook and keep the
assertions synchronous:

```js
describe('well-known.json', () => {
  let wellKnown

  before(async () => {
    const response = await fetch('contracts/session-details.well-known.json')
    wellKnown = await response.json()
  })

  it('is a valid sessionDetails according to the schema', () => {
    expect(wellKnown).to.matchSchema(sessionDetailsSchema)
  })
})
```

Use `before`, not `beforeEach` - the file never changes between tests, so one fetch is enough. Declare
`let wellKnown` in the enclosing `describe` so every `it` can see it.

### Why the bare path works

This is the part that surprises people: `'contracts/…'` is **not** relative to the test file. It is relative
to the page the test runs in, and `@web/test-runner` serves that page from the **test package root**
(`test-3/`):

```
baseURI          → http://localhost:8000/?wtr-session-id=…
import.meta.url  → http://localhost:8000/test/session-details.contract.test.js?…
fetch('contracts/session-details.well-known.json')
                 → http://localhost:8000/contracts/session-details.well-known.json   ✅
```

So from `test/session-details.contract.test.js` you write `contracts/…` and **not** `../contracts/…`, even
though the file really does sit one directory up from the test.

A sturdier alternative is to resolve against the module's own URL, which does not care where the runner
decides to serve the page:

```js
const response = await fetch(new URL('../contracts/session-details.well-known.json', import.meta.url))
```

Both land on the same file here. T-5 uses the `import.meta.url` form - worth comparing the two once you have
this one green.

### When it goes wrong

- **`Unexpected token '<' … is not valid JSON`** - you did not get JSON, you got the dev server's 404 page.
  Check the path (`../` is the usual culprit). Adding `expect(response.ok).to.be.true` in the `before` hook
  turns that confusing parse error into an honest failure.
- **The file is outside the test package** - the runner only serves files under its root. A `well-known.json`
  living in `step-3/` would not be reachable this way; that's why the contract fixtures live in `test-3/`.
- **Forgot an `await`** - `wellKnown` is then a `Promise`, and `matchSchema` fails on every field at once.
  Two awaits are needed: one for the response, one for `.json()`.
