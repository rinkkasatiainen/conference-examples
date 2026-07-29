# Learning log — Test step T-4

Use with [T-4 README](./README.md). Hub → [`learning-log-test.md`](../learning-log-test.md#t-4-key-takeaway).

**Build companion:** [Step 4](../step-4/README.md) — orchestrator uses **`data-latest-updated-at`**, not `data-sessions`.

---

[← Back to README - 1) Connections](./README.md#1-connections)

---

<a id="t-4-connections-idb-choice"></a>

### T-4 — Where do you stand?

**A)** Test components against **real IndexedDB** only.  
**B)** Use a **fake store** via import map for speed, plus a **contract test** on the real store.

Pick A or B and one reason (before reading Tips deeply):

>

---

<a id="t-4-connections-bridge"></a>

### T-4 — Bridge from Step 4

Why does the orchestrator **poke** `data-latest-updated-at` instead of pushing session JSON?

>

---

<a id="t-4-connections-prev"></a>

### T-4 — Bridge from T-3

What changed in the **event name** and **schedule attribute** compared to Step 3 tests?

>

---

[← Back to README - 2) Concepts](./README.md#2-concepts)

---

<a id="t-4-concepts-myth-fact"></a>

### T-4 — Myth or fact

1. `resetForTests()` belongs in production `session-store.js`. — M / F: ___
2. Import maps can swap `session-store.js` without editing components. — M / F: ___
3. `npm run test:manual` helps debug IDB bleed between tests. — M / F: ___

---

<a id="t-4-concepts-import-maps"></a>

### T-4 — One-minute review — import maps & the twice-run contract

One sentence each:

1. What does the import map in `web-test-runner.config.mjs` swap, and what does that let every *other* test use?
2. Why must `session-store.contract.test.js` pass against **both** the fake and the real store before you trust the fake?

>

---

<a id="t-4-concepts-sketch"></a>

### T-4 — Concept map

Store → event → orchestrator → attribute → schedule pull. Label your sketch.

>

---

[← Back to README - 3) Concrete practice](./README.md#3-concrete-practice)

---

[← Back to README - 4) Conclusions](./README.md#4-conclusions)

---

<a id="t-4-loop-back-idb"></a>

### T-4 — Loop back — real vs fake

Still happy with your A/B choice? One line.

>

---

<a id="t-4-conclusions-ticket-out"></a>

### T-4 — Ticket out

When is import-map faking **not** enough?

>
