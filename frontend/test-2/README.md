# Test Step T-2 - Molecule Behaviour · `<cfb-session-card>`

**Build companion:** [Step 2](../step-2/README.md)

> **Before you start:** [getting-started.md](./getting-started.md) · [T-2 learning log](./learning-log.md)

Testing a **molecule**

---

## Learning goal

By the end of T-2 you can:

- Test a composite component through child counts and text
- Pass session data via `data-session-details` in tests
- Explain why “how many?” beats snapshots for molecules

---

## 1) Connections

In [your T-2 learning log](./learning-log.md):

1. [How many vs how it looks?](./learning-log.md#t-2-connections-count-vs-html)
2. [Attribute name guess](./learning-log.md#t-2-connections-bridge)
3. [Bridge from T-1](./learning-log.md#t-2-connections-prev)

---

## 2) Concepts

An atom renders itself; a **molecule composes other components**. That one difference drives everything T-2 adds on
top of T-1 - you're no longer testing what a single element looks like, you're testing that the card wires the right
number of children together with the right data.

### Count, don't snapshot - assert "how many," not "how it looks"

`<cfb-session-card>` renders one `<cfb-tag>` per tag and one `.cfb-avatar` (or `<cfb-avatar>` element if you built such
in step-1) per attendee. The durable way to test that is to **count**:

```js
expect(el.querySelectorAll('cfb-tag').length).to.equal(session.tags.length)
```

A snapshot of `innerHTML` asserts every tag name, class and whitespace at once and breaks on the first harmless
refactor (see T-1, [What to assert](../test-1/README.md#what-to-assert)). A count survives the markup changing
underneath it, because "one tag per tag" is the **actual behaviour** a user relies on. Remember to focus on the behavior
that matter.

### 0, 1, 2, many Heuristic:

There is a heuristic with this name (actually, the 'many' is often 'infinity'), when testing a collection of something.
This heuristic gives a guidance what scenarios are worth to test. And it is useful, because it guides to test at least 4
different scenarios. In this specific example, the heuristic says us to test:

- **0** - empty `tags` renders **zero** `<cfb-tag>` (the case that flushes out "forgot to handle empty").
- **1** - a single tag renders exactly one: no stray separator, no off-by-one.
- **2** - two tags prove the card is really _iterating_, not hard-coding the first.
- **many** - In this situation, a handful proves nothing the `2` didn't; add it only if a large count has its own
  behaviour (truncation, a "+3 more" badge). But still, it would document that the behavior is that there is no
  truncation even with 7 tags. **Add this test if makes sense to you**.

The **many** is a useful, because that makes us ask us: _"does big differ?"_.

### Don't re-test the atom - verify the seam, not the child

It's tempting to reach into a rendered `<cfb-tag>` and assert it turned blue. Don't - that's **T-1's contract**, and
re-checking it here couples two test files to one behaviour and duplicates coverage. The molecule's job, and so the
molecule test's job, is **delegation**: did the card hand each child the right inputs?

Good news is, the way components are wired together in test cases (by explicitly registering the custom element) gives a
smell if you try to verify the child - if you only define one custom element in your test file, the child element will
not be executed - it exists in the DOM, but the lifecycle events are not triggered.

So, to verify that the card passed the right data down to tag, do assertion like this:

```js
const tags = el.querySelectorAll('cfb-tag')
expect(tags[0].getAttribute('data-color')).to.equal(session.tags[0].color)
```

You're asserting the **wiring** - the card passed `color` down as `data-color` - not the **atom's rendering**, that
`data-color="blue"` becomes `cfb-tag--blue`. Trust the boundary: if `<cfb-tag>` is correct, and T-1 proves it is,
then testing the seam is enough. **Rule of thumb: assert what the parent controls, not what the child already tests.**

### Feeding the molecule its data - structured JSON down an attribute

An atom took plain string attributes; a molecule takes a whole object. That object travels **down** the DOM as JSON
on `data-session-details` - "state/trigger down via attributes":

```js
el.setAttribute(CfbSessionCard.definedAttributes.details, JSON.stringify(session))
```

Two things worth testing exist only because the input is structured:

- **Reactivity** - replace the attribute with new JSON and assert the counts update. And as attributeChangedCallback is
  a synchronous call, there is no need for microtask flush to see the canges. Instead, the re-render happens
  synchronously inside `attributeChangedCallback`.
- **Malformed input** - `JSON.parse` throws on bad JSON. Decide the behaviour you want (throw loudly? degrade
  quietly?) and write the test that pins it. This is exactly the edge a click-through in the browser sails past.

### Test data builders - say only what matters

The last concept on this step is the test data builder.

Look at a full `SESSION` constant: title, tags, attendees, all spelled out in every test. But a test about tag-count
doesn't care about attendees, and one about the title doesn't care about either. That noise buries the single line
that matters - the opposite of readable. There is a rule of thumb worth remembering:

> If it's not important for the test, it is important to **not** be in the test.

A **builder** fixes it. `sessionWith()` (see `test/helpers/randomizer.js`) fills every field with a sensible random
value, and each test overrides **only** what it's about:

```js
const session = sessionWith({ tags: [{ label: 'Solo', color: 'red' }] })
// title + attendees are randomised; the test says out loud: "this is about tags"
```

This is T-1's rule grown up for composite data: _if it's not important for the test, it is important to **not** be in
the test._ A random title also quietly proves you're not secretly depending on `'Opening Keynote'` - if a test only
passes with one magic value, the builder turns that hidden coupling into a loud, honest failure.

Builders have this extra benefit - because of the randomness, we cannot rely on the test data to be stable. This means
that we cannot, by accident, do a snapshot test. Nor verify something that is not part of the specific test. It makes
it crystal clear if the test is testing too much, or just right.

Complete [Myth or fact](./learning-log.md#t-2-concepts-myth-fact) and the
[one-minute review](./learning-log.md#t-2-concepts-one-minute) after reading [tips.md](./tips.md).

---

## 3) Concrete practice

### Write a test list first

Let's still practice the habit of writing a test list. Capture each behaviour as a `todo(...)` line.

- [ ] For every **count** (tags, attendees), expand it with the `0, 1, 2, many` heuristic - one `todo` per case,
  not a single "renders 3 tags".
- [ ] test also that data is passed correctly to the child component(s).
- [ ] Add one **reactivity** `todo` - replacing `data-session-details` updates the counts.
- [ ] Group with nested `describe` blocks by behaviour (title / tags / attendees / reactivity).

_(Ready-made test lists come later - for now the value is in writing your own.)_

### Implement one test at a time - with a builder

- [ ] Reach for `sessionWith()` + `Randomizer` (see `test/helpers/randomizer.js`), **not** a hard-coded `SESSION`.
- [ ] Override **only** the field under test: `sessionWith({ tags: [ ... ] })` - let title and attendees stay random.
- [ ] Promote one `todo` at a time into a real `it(...)` with an Arrange-Act-Assert body; keep the suite green.

## Constraints

- No snapshot assertions - no `el.innerHTML ===`.
- Count elements, check text, verify presence - and assert the **seam**, not the child's rendering.
- Max **30 minutes**.

See **[tips.md](./tips.md)** (registration, test data, queries, assertion table).

---

## 4) Conclusions

1. [Builder pattern - in your own words](./learning-log.md#t-2-conclusions-builder)
2. [0, 1, 2, many: which case earns its keep?](./learning-log.md#t-2-conclusions-heuristic)
3. Hub takeaway → [`learning-log-test.md`](../learning-log-test.md#t-2-key-takeaway)

---

## Extras

- [ ] Test that each avatar chip displays the attendee's initials as text
- [ ] Test graceful handling of malformed JSON in `data-session-details` - does
  the component throw, or degrade quietly?
- [ ] If you added Shadow DOM to `<cfb-session-card>`, query via
  `el.shadowRoot.querySelectorAll(...)` instead
- [ ] Consider how you could add contract tests for the `SessionDetails` shape.

---

## Demos

If you complete the challenge, share a short screen recording or paste your
terminal output here.

## Issues

If you get stuck, note the problem here so we can discuss it together.

---

### End result

After completing this step you will have learned:

- How to test a **molecule** by counting and querying its child elements
- Why asserting "how many?" is more durable than asserting "what does it
  look like?" - counts survive markup refactors; snapshots don't
- How tests can surface a bug (`connectedCallback` without a guard) that
  manual testing in the browser missed
- How to pass structured JSON data through a DOM attribute in test code
- The difference between querying **light DOM** (via `el.querySelectorAll`)
  and **Shadow DOM** (via `el.shadowRoot.querySelectorAll`)
