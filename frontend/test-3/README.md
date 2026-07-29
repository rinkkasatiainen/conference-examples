# Test Step T-3 - Pub/Sub · `cfb-session-created` Event Flow

**Build companion:** [Step 3](../step-3/README.md) - in-memory orchestrator; **`data-sessions`** push.

> **Before you start:** [getting-started.md](./getting-started.md) · [T-3 learning log](./learning-log.md)

Three components talk through **DOM events** without direct references. Test the **contracts**.

---

## Learning goal

By the end of T-3 you can:

- Test publisher, orchestrator, and subscriber sides of a custom event
- Validate event `detail` with schema / contract tests
- Dispatch synthetic events to drive orchestrator tests

---

## 1) Connections

In [your T-3 learning log](./learning-log.md):

1. [Event flow sketch](./learning-log.md#t-3-connections-event-guess) *(before Concepts)*
2. [Canonical event name](./learning-log.md#t-3-connections-bridge)
3. [Bridge from T-2](./learning-log.md#t-3-connections-prev)

---

## 2) Concepts

In T-1 you tested an atom on its own. In T-2 you tested one **seam** - a card handing data _down_ to a tag. T-3 is
that same idea one level up, with a twist: the seam is now, not data, but an **event**, and the two sides never
reference each other. Actually the two sides (orchestrator vs schedule) do not even know the existence of each other (
the actual concrete implementation is not seen by either - but they have a shared contract. And a promise to know how to
deal with the incoming events/data.

The significant flow of data (for this testing track) is:

1. `cfb-board-orchestrator` registers an event listener on _itself_ on `cfb-session-created`.
2. a child element dispatches cfb-session-created {bubbles: true}
3. `cfb-board-orchestrator` event listener handler updates the `data-sessions` attribute on the `.cfb-updates-schedule`
   element
4. `cfb-schedule` attributeChangedCallback is triggered and it re-renders session cards

From testing, and the contract/seam point of view, there are two interesting testing concepts:

- the behavior of `cfb-board-orchestrator`, and
- the behavior of `cfb-schedule`

### Test each side in isolation - the decoupling is the point

Because no component holds a reference to its neighbor, you never need the whole tree to test one part. You verify that
each component **plays their own role** in the play called 'sending and receiving messages'. For the orchestrator, the
role is responsible for listening the events, and sending the updated data to each of the "subscribers" of the data.

The `cfb-board-orchestrator` handles the **pub-sub** mechanism across the component boundary. But it does not need to
know the concrete implementation of the subscribers - it only needs to know the **contract** at the boundary. And the
contract, in this case is to be **a child element with .listens-schedule-updates class**'. So, testing this component,
our job is to:

- dispatch the event
- assert the observable result (changed data in the relevant child elements).

This is T-2's "trust the boundary" grown up - each component is tested against the **contract** at its edge, not against
the internals of the components around it. This also follows the learnings from 'how-to-test-anything' learning course.

For the `cfb-schedule` component, the behavior is a bit more simple: It only re-renders when an attribute changes. So,
the job of the test is to:

- wire up the element in DOM
- set the attribute
- assert the observable result - the sessions are rendered correctly in the schedule.

### Synthetic dispatch - you don't need the real button

To drive the orchestrator you don't click anything, you don't need even a child object dispatching the event; you hand
it the event directly:

```js
el.dispatchEvent(cfbSessionCreated(sessionWith({ id: 's1' })))
```

`dispatchEvent` is **synchronous** - after it is dispatched, the listener runs immediately (no microtasks are queued or
such). In this case, the listner updates the inner list of sessions, and updates the attribute of the schedule. (For
more about microtasks, JS event loop, and asynchronous calls in [test-4/tips.md](../test-4/tips.md))

And when the data goes to `cfb-schedule`, it's tested in it's own right. When we test both elements individually with
unit tests, we are pretty far with ensuring that the components talk very nicely with each other.

One remaining question is, how we know we're sending the right data? How do we know that the event is the right type,
and that the data sent to the the schedule listeners is the right shape, too? Basically - how do we ensure we're sending
correct shapes in both sides of the `cfb-board-orchestrator`. Enter contract testing.

### Contract tests - pin the protocol

Here is the genuinely new tool. The tests we have done so far in test-1, test-2 and this so far are DOM specific tests,
and those DOM tests prove that _the said_ component renders or reacts correctly today. A **contract test** proves what a
DOM test cannot: that the events/data plays well along across component boundaries. For example that `detail` has an
**agreed shape**, that the publisher and the subscriber, that never know of the concrete implementation of each other,
_agree_ on. The event name plus the detail shape **is** the shared protocol - the schema is that protocol written down.
This is the contract.

A contract test can be used between components that are not directly related, to agree on the shape of event, data, url
scheme or any other contract. For now, we will focus on the event contract:

### Event contract

An event contract is a **shape** of the `detail` property of the event of given name. In this journey, the contract is
the following:

Each event has a `name`, and a `detail` property. The `detail` property is the payload of the event, and it contains
one (sort of) hidden property, named `_type`, and the real payload. To verify that the real payload matches the
contract, there is a `Chai` custom matcher to verify it:

```js
const { _type, ...session } = event.detail   // _type is the discriminator - part of the contract
expect(session).to.matchSchema(sessionDetailsSchema) // fails if the payload does not match the schema
```

The thing to notice is, the schema lies only in the tests - it's not usable in the production code. Currently, there is
no type guards (if this was a typescript app, having a type guard could be a good idea). A type guard is different from
a schema matcher in few ways:

- firstly, a type guard is actually a run-time production check. Even though it is a TypeScript type guard, it ends up
  being a normal JavaScript function that runs at runtime.
- secondly, TypeScript type guard makes code more type-safe. But you have to also then deal with the exceptions that are
  thrown by the type guards.
- A type guard can be less strict than a schema matcher - I often write type guards that check that the object has
  _roughly the correct shape_, but I don't check necessarily the values are of correct type. For that - I use contract
  tests between components, frontend vs. backend, and such.

In this exercise, sharing and reusing the contract schema is easy, as all components are in the 'same domain'. Later, in
an advanced session, we learn how we can reuse a 'cross-capability' contracts between capabilities. Think about _Session
Lifecycle Tracking_ as capability that listens to updates in the server, and _Session Tracking_ as the one owning the
`Orchestrator`. In this example, one of the capabilities would own the event, and would then publish a **contract
package**. But that, too, is a story of another exercise.

### Working Example

You see contract tests in action in the `cfb-session-created.test.js` file. That file is testing the `cfbSessionCreated`
helper function that creates a new CustomEvent with the right shape.

For the other part, writing the contract test for the `sessionDetails` builder in `builds-session-details.js` is left
for your exercise - the `todo`s are already stubbed in `session-details.contract.test.js`. One reason being that this
shows how to read an external file (`well-known.json`) into the test with a real `fetch`.

The schema is deliberately **shared, stable infrastructure**: the same `sessionDetailsSchema` is reused by T-3, T-4,
T-5. You don't rebuild it each step - you **consume** it, the way T-2 said to trust the atom rather than re-test it.

Complete [Myth or fact](./learning-log.md#t-3-concepts-myth-fact)
and [Contract vs component](./learning-log.md#t-3-concepts-sketch).

### Contracts (canonical files)

The contract is now tested in two places - one where the session details is created, and also where the
`cfb-session-created` event is being built. See below:

| File                                        | Purpose                                                                            |
|---------------------------------------------|------------------------------------------------------------------------------------|
| `contracts/session-details.schema.js`       | Chai validators for session `detail` - **shared by T-3, T-4, T-5, …**              |
| `contracts/session-details.well-known.json` | Human-readable example validated by the schema. This could be shared with backend. |
| `test/session-details.contract.test.js`     | Schema + `sessionDetails()` builder round-trip                                     |
| `test/cfb-session-created.test.js`          | Uses schema matcher to validate the shape of the generated event                   |

---

## 3) Concrete practice

### Read the test list, then make it green

The `todo(...)` lists are already written for you this time - two skeleton files ship with a full list of `it.skip`
lines. Your job is the same T-1/T-2 loop, just starting from someone else's list: read a `todo`, promote it into a
real `it(...)`, drive it green, move on.

- [ ] `test/cfb-schedule.test.js` - the subscriber's list (placeholder / cards / columns / reactivity).
- [ ] `test/cfb-board-orchestrator.test.js` - the orchestrator's list (accumulate, don't replace; push down).

Drive the orchestrator with **synthetic dispatch** - `el.dispatchEvent(cfbSessionCreated(session))`, no button
needed. Notice the counts follow `0, 1, 2, many` again: zero sessions -> placeholder, one card per session, many
grouped into day-columns.

### The contract - read one, finish the other

Building a schema matcher from scratch would eat the whole session and bury the one new idea, so the contract work
comes as one **worked example to read** and one **half-done exercise to finish**:

- [ ] Read `cfb-session-created.test.js` - the worked event-factory contract. Trace a session from builder -> event
  -> `detail`, and how `_type` is stripped before `matchSchema`.
- [ ] Finish `session-details.contract.test.js` - the `well-known.json` cases are done for you; promote the remaining
  `todo`s on the `sessionDetails` builder. Notice it reads an external file with a real `fetch`.
- [ ] Optional stretch: add a case where a *malformed* session **fails** the schema, or pin the now-optional
  `day` / `room` (see Extras). A small change proves you read it.

### Three sides of the event flow

| Side                                          | What to test                                                                                                                                                |
|-----------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Publisher** (`<cfb-session-generator>`)     | Does clicking the button dispatch `EventTypes.SESSION_CREATED` with a valid detail? Does it bubble? Is the `id` unique per click?                           |
| **Orchestrator** (`<cfb-board-orchestrator>`) | Does it accumulate sessions and set `data-sessions` on the element with class `cfb-updates-schedule`?                                                       |
| **Subscriber** (`<cfb-schedule>`)             | Does it render one card per session? Does it group by day? Does it sort columns? Does it show a placeholder when empty? Does it react to attribute changes? |

## Constraints

- Do **not** assert on `innerHTML` or implementation internals.
- Assert only on observable contracts: event type, `bubbles`, `detail` shape, attribute changes.
- Max **30 minutes**.

See **[tips.md](./tips.md)** (capturing events, synthetic dispatch, contracts).

---

## 4) Conclusions

1. [Loop back - sketch](./learning-log.md#t-3-loop-back-sketch)
2. [Facilitator question](./learning-log.md#t-3-concrete-facilitator)
3. [Ticket out](./learning-log.md#t-3-conclusions-ticket-out)
4. Hub takeaway → [`learning-log-test.md`](../learning-log-test.md#t-3-key-takeaway)

---

## Extras

- [ ] Test that dispatching two events accumulates both sessions (does not replace)
- [ ] Test the `detail` shape against `contracts/session-details.schema.js`
- [ ] Test that a disconnected orchestrator no longer responds to events
- [ ] How did the contract change now? Day/Room became optional parameters for the session
  How should that change things?

---

## Demos

If you complete the challenge, share a short screen recording or paste your
terminal output here.

## Issues

If you get stuck, note the problem here so we can discuss it together.

---

### End result

After completing this step you will have learned:

- How to test an event **contract** - type, `bubbles`, and `detail` shape - in isolation
- How to dispatch synthetic events onto an element to drive an orchestrator test
  without needing the full component tree
- Why testing through observable output (attributes, DOM counts) is more durable
  than asserting on internal state
