# Learning log — Test step T-5

Use with [T-5 README](./README.md). Hub → [`learning-log-test.md`](../learning-log-test.md#t-5-key-takeaway).

**Build companion:** [Step 5](../step-5/README.md)

---

[← Back to README - 1) Connections](./README.md#1-connections)

---

<a id="t-5-connections-submit-guess"></a>

### T-5 — Connections: Invalid submit

_Guess before Concepts:_ If a required field is empty and you call `form.requestSubmit()`, does the submit handler run?

>

_(Revisit in [Loop back](#t-5-loop-back-submit).)_

---

<a id="t-5-connections-bridge"></a>

### T-5 — Bridge from Step 5

Name two native validation APIs you test instead of writing `if (title.length < 5)`.

>

---

[← Back to README - 2) Concepts](./README.md#2-concepts)

---

<a id="t-5-concepts-myth-fact"></a>

### T-5 — Myth or fact

1. `FormData` can read selected radio values when fields are named. — M / F: ___
2. Custom JS validation is always clearer than `checkValidity()`. — M / F: ___
3. `form.elements.title` is safe for the title input named `title`. — M / F: ___
4. A `waitForEvent` helper can prove an invalid submit does **not** dispatch. — M / F: ___

---

<a id="t-5-concepts-one-minute"></a>

### T-5 — One-minute review

Why does proving an invalid submit **does not** dispatch need a **spy**, not `waitForEvent`? (One sentence.)

>

---

[← Back to README - 3) Concrete practice](./README.md#3-concrete-practice)

---

<a id="t-5-concrete-test-list"></a>

### T-5 — Your test list

Write your `todo(...)` list for `cfb-add-session-form.test.js` before promoting any. Start from the guard:

```js
describe('<cfb-add-session-form>', () => {
  todo('does not dispatch cfb-session-created when the form is invalid')  // spy .to.not.have.been.called
  todo('dispatches cfb-session-created when the form is valid')           // fill first, then requestSubmit
  todo('the dispatched detail matches the entered session')
  // ...one todo per missing required field?
})
```

>

---

[← Back to README - 4) Conclusions](./README.md#4-conclusions)

---

<a id="t-5-loop-back-submit"></a>

### T-5 — Loop back — submit guess

>

---

<a id="t-5-conclusions-quick-check"></a>

### T-5 — Quick check

List **three** advantages of native constraint validation in tests (short phrases):

1. 
2. 
3. 

---

<a id="t-5-conclusions-ticket-out"></a>

### T-5 — Ticket out

**Integration vs isolated form tests** — when do you mount `<cfb-add-session-form>` vs a plain `<form>`?

>
