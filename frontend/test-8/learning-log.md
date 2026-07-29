# Learning log — Test step T-8

Use with [T-8 README](./README.md). Hub → [`learning-log-test.md`](../learning-log-test.md#t-8-key-takeaway).

**Build companion:** [Step 8](../step-8/README.md)

---

[← Back to README - 1) Connections](./README.md#1-connections)

---

<a id="t-8-connections-guess"></a>

### T-8 — Connections: WebSocket guess

_Before Concepts._ Does `<cfb-live-session-updates>` write to IndexedDB directly, or dispatch events for another component?

>

_(Revisit in [Loop back](#t-8-loop-back-guess).)_

---

<a id="t-8-connections-bridge"></a>

### T-8 — Bridge from Step 8

What two message types from the WebSocket feed does the live component handle?

>

---

[← Back to README - 2) Concepts](./README.md#2-concepts)

---

<a id="t-8-concepts-myth-fact"></a>

### T-8 — Myth or fact

1. You need a real WebSocket server to unit-test the live component. — M / F: ___
2. Live updates reuse the same orchestrator refresh signal as Step 7 loaders. — M / F: ___
3. `FakeWebSocket` can extend `EventTarget` to simulate server pushes. — M / F: ___

---

<a id="t-8-concepts-one-minute"></a>

### T-8 — One-minute review

Two questions, one sentence each:

1. Why must the fake `WebSocket` extend `EventTarget` (what does the component do with it)?
2. What does the `disconnectedCallback` test protect against?

>

---

[← Back to README - 3) Concrete practice](./README.md#3-concrete-practice)

---

[← Back to README - 4) Conclusions](./README.md#4-conclusions)

---

<a id="t-8-loop-back-guess"></a>

### T-8 — Loop back — WebSocket guess

>

---

<a id="t-8-conclusions-ticket-out"></a>

### T-8 — Ticket out

**One thing** `disconnectedCallback` protects against when a WebSocket is open:

>
