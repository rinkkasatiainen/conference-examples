# Test Step T-1 - Atom Behaviour · `<cfb-tag>`

**Build companion:** [Step 1](../step-1/README.md)

> **Before you start:** [getting-started.md](./getting-started.md) · [T-1 learning log](./learning-log.md)

In T-0 you got the toolchain running. Now write tests for **observable DOM behaviour** of `<cfb-tag>` from Step 1 - not
HTML strings or private fields.

---

## Learning goal

By the end of T-1 you can:

- Mount a custom element with a `fixture` helper and tear down safely
- Assert on text, classes, and attribute reactivity
- Explain where in the DOM to query before writing assertions

---

## 1) Connections

Write in [your T-1 learning log](./learning-log.md) **before** deep reading:

1. [6 statements of writing tests?](./learning-log.md#t-1-connections-self-correcting-worksheet)
2. [Bridge from Step 1](./learning-log.md#t-1-connections-bridge)
3. [Bridge from T-0](./learning-log.md#t-1-connections-prev)

---

## 2) Concepts

### The `fixture` helper

Mounting a custom element inside a test requires a bit of ceremony. You need a
container node that is actually attached to the live `document`, because Custom
Elements only upgrade (and fire `connectedCallback`) once they are part of the
DOM.

Create `test/helpers/fixture.js`:

```js
export async function fixture(html) {
  const container = document.createElement('div')
  container.id = 'testRoot'
  container.innerHTML = html
  document.body.appendChild(container)
  return container.firstElementChild
}

export function cleanup() {
  const root = document.getElementById('testRoot')
  if (root) root.remove()
}
```

A few things worth understanding here:

**Q: Why a container `<div>` and not `document.body.innerHTML = html`?**
> `@web/test-runner` injects its own `<script>` tags into `document.body`. Setting  `body.innerHTML` nukes those scripts
> and might break the runner. Always append a container and remove just that container in cleanup.

**Q: Why `afterEach(cleanup)` and not `afterEach(() => document.body.innerHTML = '')`?**
> Same reason as above - nuking `body.innerHTML` removes WTR's injected scripts.

Complete [Myth or fact](./learning-log.md#t-1-concepts-myth-fact)
and [One-minute review](./learning-log.md#t-1-concepts-one-minute) in your log.

### What to test in CfbTag?

If thinking about the `<cfb-tag>` element, and the behavior that we might want to test. Take a few seconds to think what
could be tested.

[Note it down in your log.](./learning-log.md#t-1-concepts-what-to-test)

I guess this is very opinionated, many would test the element's internal implementation, making sure the classes are
correct, things rendered correctly.

Often times, I try to focus on testing the observable behavior of the element. What? Let's look a bit closer.

### Test List of observable behaviour

Before writing a single `it(...)`, brain-dump every behaviour you can imagine into a **test list** - one line
per case, in plain language. For example the following sentences could read as a nice beginning of a test list:

- "renders the label text"
- "applies `--blue` when `data-color` is blue",
- "reacts when `data-label` changes"

In TDD this list is your **working memory**: it lets you pick the smallest next test, keeps you from goldplating, and
gives you a place to park new cases you think of mid-test without breaking your flow. Whenever in the process of writing
tests, if you find yourself thinking of another item on the test list - just add it there. Right away.

A tidy way I have used to keep that list _in the test file itself_ is a tiny `todo` helper:

```js
const todo = msg => it.skip(msg, () => { /* no-op */
})
```

---
**Note**

Often times this is also useful in real prod app, because my Eslint rules are very strict, and it would complain an all
skipped tests - with this helper, you only need to silence this one `it.skip` piece of code.
---

`it.skip` registers a test that the runner reports as **pending/skipped** rather than running it, and the empty
body means there's nothing to execute. So each `todo('reacts when data-label changes')` shows up in the test
output as a visible, skipped line - a checklist that travels with the code. As you work, you promote items one by
one: turn a `todo(...)` into a real `it(...)` with an Arrange-Act-Assert body. When every `todo` is gone, the
test list is complete and the suite is all green. Magic.

### What to assert?

Resist the urge to snapshot the whole `innerHTML`. A snapshot asserts on _everything at once_ - the tag name, the
attribute order, whitespace, the exact class string - so it fails the moment any incidental detail changes, and it
never tells you _which_ behaviour actually broke. It couples the test to the implementation instead of the **intent**.

Instead, assert on the **specific observable behaviour** that matters, and nothing more:

- **Class presence, via `classList.contains('cfb-tag--blue')`** - not a string compare of `className`. Using the
  `contains` checks the one modifier you care about and stays green when other classes are added or reordered.
- **Text content, via `el.textContent`** - the label a user reads, independent of the markup that wraps it.
- **Structure only when it's part of the contract** - assert "there is one child element" (`children.length`), not
  "the child is a `<span>` and not a `<div>`". Whether the label sits in a `span` or a `div` is an implementation
  choice; asserting on it locks the test to a decision the user can never observe.

The rule of thumb: for each test, name the _one_ behaviour, then reach for the narrowest query that proves it.
If your assertion would still need editing after a harmless refactor, it's asserting on too much.

---

## 3) Concrete practice

### Write a test list.

- [ ] Go ahead and write a test list for the class you're working on.
- [ ] use nested `describe` blocks to group tests by behaviour.

### Implement one test at a time.

- [ ] Create `test/helpers/fixture.js` with the two helper functions described above.
- [ ] Register `<cfb-tag>` at the top of the test file

## Constraints

- Do **not** assert on `innerHTML` or snapshot output.
- Assert only on text content, class presence, and child element counts.
- Max **30 minutes**.

See **[tips.md](./tips.md)** (registering the element, where classes land, assertions).

---

## 4) Conclusions

1. [Think it, ink it](./learning-log.md#t-1-conclusions-think-it-ink-it)
2. Hub takeaway → [`learning-log-test.md`](../learning-log-test.md#t-1-key-takeaway)

---

## Extras

- [ ] Parameterise the colour test: loop over `['red', 'orange', 'green', 'blue', 'purple']`
  and assert each modifier class is applied correctly
- [ ] Test that `data-count` shows a number badge when the attribute is set
  (if you implemented that extra in Step 1)
- [ ] Test with Shadow DOM: if your `<cfb-tag>` uses `attachShadow`, query into
  `el.shadowRoot` instead of `el`
- [ ] Run tests with manual flag, opening Browser to see the tests running

---

## Demos

If you complete the challenge, share a short screen recording or paste your
terminal output here.

## Issues

If you get stuck, note the problem here so we can discuss it together.

---

### End result

After completing this step you will have learned:

- How to mount a custom element into the live `document` from a test
- Why `cleanup()` must remove a specific container - not wipe `body.innerHTML`
- How `customElements.whenDefined()` safely awaits element registration
- That `attributeChangedCallback` fires during HTML parsing - before
  `connectedCallback`
- How to find where a CSS class actually lands in the DOM before asserting on it
- The difference between testing the element's **observable output** and testing
  its **internal implementation**
