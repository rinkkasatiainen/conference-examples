# Learning log - Test step T-7

Use with [T-7 README](./README.md). Hub → [`learning-log-test.md`](../learning-log-test.md#t-7-key-takeaway).

**Build companion:** [Step 7](../step-7/README.md)

---

[← Back to README - 1) Connections](./README.md#1-connections)

---

<a id="t-7-connections-guess"></a>

### T-7 - Connections: Fetch stub guess

_Before Concepts._ When testing `<cfb-session-loader>`, do you stub `getBackendApi()` or `window.fetch`? Why?

>

_(Revisit in [Loop back](#t-7-loop-back-guess).)_

---

<a id="t-7-connections-bridge"></a>

### T-7 - Bridge from Step 7

Name the two loader events the orchestrator waits for before setting `data-latest-updated-at`.

>

---

[← Back to README - 2) Concepts](./README.md#2-concepts)

---

<a id="t-7-concepts-myth-fact"></a>

### T-7 - Myth or fact

1. MSW is required to test loaders that call `fetch`. - M / F: ___
2. The orchestrator pushes session JSON to `<cfb-schedule>`. - M / F: ___
3. Both loaders must complete for the same `eventId` before the schedule refresh signal fires. - M / F: ___

---

<a id="t-7-concepts-one-minute"></a>

### T-7 - One-minute review

Two questions, one sentence each:

1. MSW intercepts the network with a Service Worker instead of patching `window.fetch`. Why is that a better test double?
2. Why call `worker.resetHandlers()` in `afterEach`?

>

---

[← Back to README - 3) Concrete practice](./README.md#3-concrete-practice)

---

[← Back to README - 4) Conclusions](./README.md#4-conclusions)

---

<a id="t-7-loop-back-guess"></a>

### T-7 - Loop back: fetch stub guess

>

---

<a id="t-7-conclusions-ticket-out"></a>

### T-7 - Ticket out

**Hardest part** of stubbing `fetch` vs using MSW in unit tests:

>
