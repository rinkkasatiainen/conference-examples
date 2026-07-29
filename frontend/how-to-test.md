# How to use the testing track — README.md and learning-log.md

Each test step in `test-N/` follows the same **Training from the Back of the Room (TBR)** rhythm as the build steps in
`step-N/` — adapted for **solo, async** work. You still move through four phases; the *subject* is testing and
observable behaviour instead of building UI.

---

## Why this track exists — the story

> _Placeholder-why: the reason to spend time here **with or after** the `step-N` build track._

You already built the components in `step-N/`. So why come back and test them?

**Because the thing worth protecting is the _behaviour_, not the internals.** A build step leaves you with a component
that works *today, in your hands*. A test step turns that into a component you can **refactor tomorrow without fear** —
because a test that asserts on observable behaviour (what a user or a sibling component can see) keeps passing when you
rewrite the insides, and fails only when the behaviour actually breaks. Snapshot the private markup instead and every
refactor lights up red for no reason. So the single rule of this track is:

> **Test the behaviour a browser can observe — the DOM, the events, the async outcomes — never the implementation.**

### The arc — why the steps are in this order

The track is not nine unrelated lessons. It is **one escalating question**: _as each kind of component gets harder to
observe, what new technique do you need to keep testing behaviour instead of internals?_ Each step answers it once, and
the boundary you have to test moves one ring further out from the component:

| Step    | Component archetype                     | The new problem it forces                    | The technique you learn                                        |
|---------|-----------------------------------------|----------------------------------------------|----------------------------------------------------------------|
| **T-0** | —                                       | Custom Elements don't exist in a fake DOM    | Real-browser runner; why JSDOM/Jest can't do this              |
| **T-1** | **Atom** `<cfb-tag>`                    | How do you mount one element and read it?    | `fixture()` mount/cleanup; assert text, classes, reactivity    |
| **T-2** | **Molecule** `<cfb-session-card>`       | A composite renders *many* things            | Assert counts & presence — "how many?" beats "how it looks"    |
| **T-3** | **Pub/Sub trio** `cfb-session-created`  | Components talk via events, not references   | Test each side; **contract/schema tests** on event `detail`    |
| **T-4** | **IndexedDB store**                     | Behaviour is now *async* and stateful        | `waitForEvent`, teardown; real-vs-fake store contract          |
| **T-5** | **Form (native)**                       | Validation is a browser capability           | Test the platform: `checkValidity()`, `FormData`, `requestSubmit()` |
| **T-6** | **Custom form control** `<cfb-session-format>` | Your element must *participate* in a form | Values land in `FormData` after `click()`; `required` via `checkValidity()` |
| **T-7** | **Loaders** (fetch)                     | Behaviour depends on the network             | Stub `window.fetch`; assert `dataset.state` + bubbling events  |
| **T-8** | **Live updates** (WebSocket)            | Behaviour is driven by a *server push*       | Inject a `FakeWebSocket`; simulate pushes; assert cleanup      |

Two through-lines hold it together:

- **The assertion style never changes; only the _seam_ you control moves.** From T-1 to T-8 you are always asserting on
  observable DOM and events. What changes is the boundary you replace with a test double — `fetch` becomes a stub, a
  `WebSocket` becomes a fake — so the component stays testable as it reaches further into the platform.
- **T-3 is the hinge.** It's where "test a component" becomes "test a **contract between** components." Once components
  stop referencing each other and start talking through event `detail` payloads, the *shape of the message* is the thing
  worth protecting — which is why the `contracts/` schema files start at T-3 and are **shared forward** into T-4, T-5, …

You can run a test step **the same week** as its build step (test-first or right after), or come back **later** to any
component you want to make safe to change. Either way, the payoff is the same: behaviour you can trust and refactor.

---

Each step in readme follows the same **4C** rhythm:

| Phase                    | What it is for (testing track)                                                                         |
|--------------------------|--------------------------------------------------------------------------------------------------------|
| **Learning goal**        | What is the important concept around testing that you learn in this ste                                |
| **1) Connections**       | Warm up to connect to what you know already: prior test experience, or just pure guesses on the topic. |
| **2) Concepts**          | The specific context relevant for testing the specific kind of web component.                          |
| **3) Concrete practice** | Your time to shine - your time to test what you built in the `step-N` exercise.                        |
| **4) Conclusions**       | Time to reflect on what you learned. And log that down for later reference.                            |

The core of the track lies in the **learning-log.md** structure. It guides you to think and ink what you learned, your
thinking and questions for the facilitator (who will later read, and answer to them). Take your time to answer to the
items on the learning log, it's there for you.

---

## The four files (per test step)

### `test-N/getting-started.md` - Start here

This is the file you probably want to start with. It has clear steps on what to do in order to take on the learning
steps. It often means that it says you to run `npm install` and `npm test` in the `test-N/` folder - and if you have one
failing test, you are good to go.

### `test-N/README.md` — your guide

The readme.md file is the **training guide** for the test step. It documents the **learning goal** has relevant learning
material for you to work through each of the testing steps. It also guides you to the concrete practice.

And if you get stuck with your tests, please open the

### `test-N/tips.md` - practical hints

that will have code snippets, test snippet, and some concrete advice on javascript, testing and other possibly context
related topics

### `test-N/learning-log.md` — your workbook

This is your core. It's meant to serve as your own little journal. One where you can write down your thoughts and
questions. It's also a place to log your learnings.. And later you can copy the contents (if you wish) to your own "2nd
brain".

Open this in a **second tab or split pane** while you run tests.

### `frontend/learning-log-test.md` — test journey hub

This is the one file you should add one-liner of your main takeaway for the one step. This way this can act as a "
learning hub" for you.

---

This track depends on the so called build-step. So without actually working on this, this might be very difficult to
work on. The idea is that for the each 'build step', this track provides the relevant testing material.

## Build track vs test track

You can run **test-N** in parallel with **step-N** or after the build step — same week or later.

---

## npm scripts (usual pattern)

Copied from `test-0/` into later packages:

| Script                                     | When to use                                        |
|--------------------------------------------|----------------------------------------------------|
| `npm test`                                 | Full suite once — before you declare the step done |
| `npm run test:watch`                       | Active test-driven work                            |
| `npm run test:manual`                      | Browser stays open; inspect DOM / IDB in DevTools  |
| `PATTERN=cfb-tag npm run test:specific`    | One file while focused                             |
| `PATTERN=cfb-tag yarn run test:specific`   | One file while focused (works also with yarn)      |
| `npm run test:specific --PATTERN:specific` | One file while focused - works only on npm         |

Some steps add extra scripts (e.g. T-4: `test:store:real`, `test:store:fake`).

---

## Async / solo substitutions

Same as the build track:

- Write in the learning log as your stand-in partner
- Post one failing test name + error line to your facilitator
- Short **timeboxes** (~1–5 min per prompt) beat perfect prose

---

## File map

```
frontend/
├── README.md                 ← series overview
├── learning-log.md           ← build hub (Steps 0–8)
├── learning-log-test.md      ← test hub (T-0–T-8)
├── how-to.md                 ← build track 4C flow
├── how-to-test.md            ← this file
└── test-N/
    ├── README.md
    ├── learning-log.md
    ├── getting-started.md
    ├── tips.md                 ← practical hints (linked from Concrete practice)
    ├── package.json
    └── test/
```

---

## Quick reference — anchor links

When a test README uses 4C headings, the learning log links to:

| README section       | Anchor                 |
|----------------------|------------------------|
| 1) Connections       | `#1-connections`       |
| 2) Concepts          | `#2-concepts`          |
| 3) Concrete practice | `#3-concrete-practice` |
| 4) Conclusions       | `#4-conclusions`       |

Per-step prompts use IDs like `#t-3-connections-event-guess`.

--

## For facilitators

- Learners should use a **branch or fork** so you can read build hub, test hub, and per-step logs
- A green `npm test` in `test-N/` plus hub takeaway is enough for async review
- Migration status: [`test-migration-steps.md`](./test-migration-steps.md) · full plan: [
  `PLAN-test-migration.md`](./PLAN-test-migration.md)
