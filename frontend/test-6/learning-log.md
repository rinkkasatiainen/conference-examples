# Learning log - Test step T-6

Use with [T-6 README](./README.md). Hub → [`learning-log-test.md`](../learning-log-test.md#t-6-key-takeaway).

**Build companion:** [Step 6](../step-6/README.md)

---

[← Back to README - 1) Connections](./README.md#1-connections)

---

<a id="t-6-connections-formdata-guess"></a>

### T-6 - Connections: FormData guess

_Before Concepts._ How can `<cfb-session-format>` put `session-format` into `FormData` without hidden radio inputs?

>

_(Revisit in [Loop back](#t-6-loop-back-formdata).)_

---

<a id="t-6-connections-bridge"></a>

### T-6 - Bridge from Step 6

Three things that should **stay the same** in add/edit forms after swapping radios for `<cfb-session-format>`:

1. 
2. 
3. 

---

[← Back to README - 2) Concepts](./README.md#2-concepts)

---

<a id="t-6-concepts-myth-fact"></a>

### T-6 - Myth or fact

1. You should assert on `ElementInternals` directly in tests. - M / F: ___
2. `click()` on a tile is a good stand-in for user selection. - M / F: ___
3. `required` on the custom element should participate in `form.checkValidity()`. - M / F: ___

---

<a id="t-6-concepts-one-minute"></a>

### T-6 - One-minute review

Why assert `new FormData(form).get('session-format')` and `form.checkValidity()` rather than calling
`internals.setFormValue(...)` directly? (One sentence.)

>

---

[← Back to README - 3) Concrete practice](./README.md#3-concrete-practice)

---

[← Back to README - 4) Conclusions](./README.md#4-conclusions)

---

<a id="t-6-loop-back-formdata"></a>

### T-6 - Loop back: FormData guess

>

---

<a id="t-6-forms-two-steps"></a>

### T-6 - Forms across two steps

What did T-5 teach vs what T-6 adds? Two sentences.

>

---

<a id="t-6-conclusions-ticket-out"></a>

### T-6 - Ticket out

**Hardest part** of testing form-associated custom elements:

>
