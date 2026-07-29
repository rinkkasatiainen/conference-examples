# Tips

[← Back to README - 3) Concrete practice](./README.md#3-concrete-practice)

## Registering the element

`cfb-tag.js` exports `CfbTag` but does not call `customElements.define` itself - register once in the test file:

```js
import { CfbTag } from '../../step-1/cfb-tag.js'
import { expect } from 'chai'
import { fixture, cleanup } from './helpers/fixture.js'

customElements.define('cfb-tag', CfbTag)
```

## Where does the CSS class actually land?

Open `step-1/cfb-tag.js` - the colour class is on the **inner `<span>`**, not `<cfb-tag>`:

```js
this.innerHTML = `<span class="cfb-tag cfb-tag--${this.#color}">${this.#label}</span>`
```

So `el.classList.contains('cfb-tag--green')` is always false. Query the inner element:

```js
expect(el.querySelector('.cfb-tag--green')).to.not.be.null
```

## Asserting after an attribute change - no waiting needed

`attributeChangedCallback` runs **synchronously** right after `setAttribute`. The DOM is already updated
by the time the next line runs, so you assert immediately - no `await`, no queue flush:

```js
el.setAttribute('data-label', 'After')
expect(el.textContent.trim()).to.equal('After')
```

Everything in these first steps renders synchronously (custom-element callbacks and, later, DOM events),
so your tests never have to *wait* for a render. You'll meet genuinely asynchronous rendering - and the
event-loop / microtask / macrotask concepts needed to test it - in **step 4**, when IndexedDB arrives.
Resist the urge to sprinkle `await Promise.resolve()` here "to be safe": it hides whether the code is
actually synchronous, which is a fact worth asserting plainly.

## What to assert

| Group                | What to verify                                                                                            |
|----------------------|-----------------------------------------------------------------------------------------------------------|
| Rendering            | `textContent` shows `data-label`; `cfb-tag--{color}` on inner element; nothing visible when no attributes |
| Attribute reactivity | `data-label` change updates text; `data-color` change swaps modifier class                                |
