# Tips

[← Back to README - 3) Concrete practice](./README.md#3-concrete-practice)

## Registering both elements

```js
import { expect } from 'chai'
import { CfbTag } from '../../step-1/cfb-tag.js'
import { CfbSessionCard } from '../../step-2/cfb-session-card.js'
import { fixture, cleanup } from './helpers/fixture.js'

customElements.define('cfb-tag', CfbTag)
customElements.define('cfb-session-card', CfbSessionCard)
```

## Test data

A fixed `SESSION` constant works for learning; for more reliable tests use `Randomizer` + `sessionWith()` (see `test-2/test/helpers/randomizer.js` and T-3 patterns).

```js
const SESSION = {
  title: 'Opening Keynote',
  tags: [
    { label: 'Keynote', color: 'blue' },
    { label: 'Frontend', color: 'green' },
  ],
  attendees: [
    { name: 'Alice Kent', initials: 'AK' },
    { name: 'James Smith', initials: 'JS' },
    { name: 'Maria R', initials: 'MR' },
  ],
}
```

## Querying child elements

Light DOM - query directly on the card:

```js
const tags = el.querySelectorAll('cfb-tag')
expect(tags.length).to.equal(SESSION.tags.length)

const avatars = el.querySelectorAll('.cfb-avatar')
expect(avatars.length).to.equal(SESSION.attendees.length)
```

## Testing reactivity

No microtask flush needed after `setAttribute`:

```js
const updated = { ...SESSION, tags: [{ label: 'Solo', color: 'red' }] }
el.setAttribute(CfbSessionCard.definedAttributes.details, JSON.stringify(updated))
expect(el.querySelectorAll('cfb-tag').length).to.equal(1)
```

## What to assert

| Group | What to verify |
|-------|----------------|
| Title | `textContent` includes session title |
| Tags | One `<cfb-tag>` per tag; zero when empty; correct `data-color` per tag |
| Attendees | One `.cfb-avatar` per attendee |
| Reactivity | Replacing `data-session-details` updates tag count |
