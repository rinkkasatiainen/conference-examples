# Learning log - Test step T-3

Use with [T-3 README](./README.md). Hub → [`learning-log-test.md`](../learning-log-test.md#t-3-key-takeaway).

**Build companion:** [Step 3](../step-3/README.md) - Step 3 uses **`data-sessions`** push (in-memory orchestrator).

---

[← Back to README - 1) Connections](./README.md#1-connections)

---

<a id="t-3-connections-event-guess"></a>

### T-3 - Connections: Event flow sketch

_Before Concepts._ Draw (ASCII ok): button → ? → orchestrator → ? → schedule.

>

_(Revisit in [Loop back](#t-3-loop-back-sketch).)_

---

<a id="t-3-connections-bridge"></a>

### T-3 - Bridge from Step 3

What is the canonical event **name string** (not `sessionAdded`)?

>

---

<a id="t-3-connections-prev"></a>

### T-3 — Bridge from T-2

What helper from `test-2` helps build valid session payloads?

>

---

[← Back to README - 2) Concepts](./README.md#2-concepts)

---

<a id="t-3-concepts-myth-fact"></a>

### T-3 — Myth or fact

1. You must click the real button to test the orchestrator. — M / F: ___
2. Event `detail` should be validated after stripping `_type`. — M / F: ___
3. Step 4 uses the same `data-sessions` push pattern as Step 3. — M / F: ___

---

<a id="t-3-concepts-sketch"></a>

### T-3 — Contract vs component test

In one sentence: what does a **contract test** prove that a DOM test alone might not?

>

---

[← Back to README - 3) Concrete practice](./README.md#3-concrete-practice)

---

<a id="t-3-concrete-facilitator"></a>

### T-3 — Question for facilitator

Write one contract-test question you would ask:

>

---

[← Back to README - 4) Conclusions](./README.md#4-conclusions)

---

<a id="t-3-loop-back-sketch"></a>

### T-3 — Loop back — sketch

Fix your sketch if anything changed after coding.

>

---

<a id="t-3-conclusions-ticket-out"></a>

### T-3 — Ticket out

**Best insight** about testing pub/sub without coupling to child element names:

>
