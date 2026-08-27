# Learning log - Test step T-2

Use with [T-2 README](./README.md). Hub → [`learning-log-test.md`](../learning-log-test.md#t-2-key-takeaway).

**Build companion:** [Step 2](../step-2/README.md)

---

[← Back to README - 1) Connections](./README.md#1-connections)

---

<a id="t-2-connections-count-vs-html"></a>

### T-2 - Connections: How many vs how it looks?

_Solo, ~2 min._ Which assertion survives a markup refactor: exact HTML string or `querySelectorAll('cfb-tag').length`?
Why?

>

---

<a id="t-2-connections-bridge"></a>

### T-2 - Bridge from Step 2

What is the exact attribute name for session JSON on `<cfb-session-card>`? (Guess before reading source.)

>

---

<a id="t-2-connections-prev"></a>

### T-2 - Bridge from T-1

Which atom from T-1 must be registered before testing the card?

>

---

[← Back to README - 2) Concepts](./README.md#2-concepts)

---

<a id="t-2-concepts-myth-fact"></a>

### T-2 - Myth or fact

1. Snapshot tests are ideal for molecules that compose atoms. - M / F: ___
2. Hard-coded `SESSION` constants in every test are always clearer than a Randomizer. - M / F: ___
3. Testing tag-count with **one** session of 3 tags covers the behaviour; `0` and `1` add nothing. - M / F: ___
4. A molecule test should assert that `<cfb-tag>` renders `cfb-tag--blue`. - M / F: ___

---

<a id="t-2-concepts-one-minute"></a>

### T-2 - One-minute review

You're testing `<cfb-session-card>` and want confidence the blue tag shows up correctly. Which assertion belongs in
**this** test, and which belongs back in T-1's `<cfb-tag>` test - and why? (One sentence; name the _seam_.)

>

---

[← Back to README - 3) Concrete practice](./README.md#3-concrete-practice)

---

<a id="t-2-concrete-test-list"></a>

### T-2 - Your test list

Brain-dump before you assert. Write each behaviour as a `todo('...')` line. For example: for every **count**, expand it
with `0, 1, 2, many` (one line per case).
Remember to use nested describe blocks. This is useful.

```js
// e.g.
describe('<cfb-card>', () => {
    describe('tags', () => {
      todo('renders zero cfb-tag for an empty tags array')   // 0
      todo('renders one cfb-tag for a single tag')           // 1
      // ...
    })
    describe('some other behaviour', () => {
      
    })
})
```

> Write your test list below:
> 1. ...
> 2. ...


---

[← Back to README - 4) Conclusions](./README.md#4-conclusions)

---

<a id="t-2-conclusions-builder"></a>

### T-2 - Builder pattern, in your own words

What does `sessionWith()` + `Randomizer` buy you that a hard-coded `SESSION` constant doesn't? Name at least one
thing the randomness _prevents you from doing by accident_.

>

---

<a id="t-2-conclusions-heuristic"></a>

### T-2 - 0, 1, 2, many: which case earns its keep?

For the card's tag count, which of `0 / 1 / 2 / many` is most likely to catch a real bug, and why? When is
**many** worth writing?

>
