# Learning log - Step 7

Use this file while you work through [Step 7 README](./README.md). When you finish the step, add your **key takeaway**
in the [journey hub `learning-log.md`](../learning-log.md#step-7-key-takeaway).

This step uses **Training from the Back of the Room** ideas adapted for **solo / async**: **different** prompt types,
**writing** and a small **sketch**, and **short** timeboxes. Follow the **order** in the README.

---

[← Back to README - 1) Connections](./README.md#1-connections)

---

### Step 7 - Connections: First fetch

_Solo, ~2 minutes. Answer **before** you read Concepts._

You click **“CodeFreeze 2025”** (or the page loads with **`data-event-id`** already set). Two loaders run.

**In one or two sentences:** what do you think happens **first** in the browser

- **`cfb-schedule`** paints cards,
- loaders makes a **`fetch`**,
- data is returned from Backend
- IndexedDB is read?
  Number them **1–4** in your guessed order.

>

| order | situation                       |
|-------|---------------------------------|
|       | **`cfb-schedule`** paints cards |
|       | loaders makes a **`fetch`**     |
|       | data is returned from Backend   |
|       | IndexedDB is read               |

_(You will [loop back](#step-7-loop-back-first-fetch) in Conclusions.)_

---

<a id="step-7-bridge-step-4-6"></a>

### Step 7 - Connections: Bridge from Step 4–6

_Solo, ~4 minutes._

Step 4–6 already wrote sessions to **IndexedDB** and refreshed **`cfb-schedule`** via signals using attributes.

**What is new** when data comes from **`fetch`** + a small API layer instead of only in-page events? Two bullets:
one **similarity** (what stays the same), one **difference** (what’s new).

> **similarity:** ___
> **difference:** ___

---

<a id="step-7-connections-surprise"></a>

### Step 7 - Connections: Surprise (solo or pair)

_~3 minutes._

**Solo:** One thing about **`fetch`**, **CORS**, or **mocking** that has tricked you before - one line.

>

---

<a id="step-7-topic-link"></a>

### Step 7 - Connections: Topic link

_Solo, ~2 minutes. Answer **A** or **B** - not both._

**A)** Name one tool or pattern (Postman, contract tests, OpenAPI, …) teams use when working between frontend and
backend.

>

**B)** Remind yourself of the pub/sub pattern in Step 4. What do you remember of it?

>

---

[← Back to README - 2) Concepts](./README.md#2-concepts)

---

<a id="step-7-concepts-one-minute"></a>

### Step 7 - Concepts: One-minute review

_After reading the README Concepts sections - ~1 minute._

**Two bullets:**

1. What do you think is the most complicated part of this step?
2. Describe the flow from UI events (add/update/delete a session) to the showing the change in the UI?

>

---

### Step 7 - Concept check: Mini quiz

_Answer **from memory first** (~4 minutes). Then peek at the README
or [`cfb-board-orchestrator.js`](./cfb-board-orchestrator.js) if needed._

1. When loading the page, what two backend calls are made to get the initial state of the schedule?

   >

2. Why do the loaders use **`bubbles: true`** (and **`composed: true`** in this repo) on those events?

   >

3. What does **`attributeChangedCallback`** on **`cfb-schedule`** **not** receive from the parent - i.e. what does the
   schedule still have to **read** itself after the attribute changes?

   >

---

<a id="step-7-concept-flow-sketch"></a>

### Step 7 - Concept check: Flow sketch (visual)

_Solo, ~4 minutes. Training from the Back of the Room - “images / different activity.”_

Draw the flow chart from 'removing a session' to showing the change in the UI. Add all components involved and the

**event / `data-event-id`** → **both loaders** (parallel **`fetch`**) → **IndexedDB writes** → **orchestrator** → *
*`cfb-schedule` + re-render**.

Add **one short label** on each **arrow** (e.g. **`scheduleLoaded`**, **`data-latest-updated-at`**).

>

---

[← Back to README - 3) Concrete practice](./README.md#3-concrete-practice)

---

<a id="step-7-concrete-facilitator-question"></a>

### Step 7 - Concrete practice: Question for your facilitator

_Solo, ~5 minutes._

Ask **one** question about **`fetch`**, **MSW**, **loader vs orchestrator responsibilities**, or **testing APIs without
a backend**. Paste their reply (or your notes) below.

**My question**

>

**Facilitator reply / notes**

>

---

[← Back to README - 4) Conclusions](./README.md#4-conclusions)

---

<a id="step-7-conclusions-quick-check"></a>

### Step 7 - Conclusions: Quick check

_~4 minutes._

1. Why is it useful to have a single point for backend API calls?

   >

2. In one line: what is the **single attribute** the orchestrator writes so **`cfb-schedule`** knows to **re-pull**
   sessions from IndexedDB? Why is this a useful pattern?

   >

---

### Step 7 - Conclusions: Loop back - first fetch

_Look at your answer under [First fetch](#step-7---connections-first-fetch). Update the ordering in one line: what was
wrong?_

>

---

### Step 7 - Conclusions: Myth or Fact


1. Loader completion events can coordinate rendering **without** components importing each other’s classes.

   - Your first guess (M/F): ___
   - Correction / note: ___

2. For changes in Backend to be reflected in the UI, the loader component must be ancestor of the component that needs
   to know about the change.

   - Your first guess (M/F): ___
   - Correction / note: ___

---

### Key takeaway (journey hub)

Add **one or two sentences** in the [journey hub `learning-log.md`](../learning-log.md#step-3--pubsub)

---

[← Journey hub (key takeaways)](../learning-log.md)
