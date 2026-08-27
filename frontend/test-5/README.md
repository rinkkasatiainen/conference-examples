# Test Step T-5: Form Validation · Constraint API

**Build companion:** [Step 5](../step-5/README.md)

> **Before you start:** [getting-started.md](./getting-started.md) · [T-5 learning log](./learning-log.md)

Test **native** form behaviour, not hand-written validation: `checkValidity()`, `ValidityState`, `FormData`,
`requestSubmit()`.

---

## Learning goal

By the end of T-5 you can:

- Test constraint validation on a plain `<form>` mirroring Step 5 fields
- Drive a component like a user (`requestSubmit()`, keyboard) and **spy** on the events it emits
- Test `<cfb-add-session-form>` integration: invalid submit blocked, valid submit dispatches `cfb-session-created`
- Use contract tests for Step 5 session event shapes where provided

---

## 1) Connections

In [your T-5 learning log](./learning-log.md):

1. [Invalid submit guess](./learning-log.md#t-5-connections-submit-guess) *(before Concepts)*
2. [Bridge from Step 5](./learning-log.md#t-5-connections-bridge)

---

## 2) Concepts

Through T-1..T-4 you drove components through **attributes** and **synthetic events**. T-5 adds the last input
channel: a real **user** - filling fields, submitting, clicking - and native **form** behaviour built on the
Constraint Validation API.

### Spy on what a component emits

In T-3 you captured an event by hand; in T-4 you `await`ed one with `waitForEvent`. T-5 reaches for a sharper tool -
a **sinon spy** (`spy()` + `sinon-chai`). Attach it as the listener, act, then assert on the call:

```js
const onCreated = spy()
el.addEventListener(EventTypes.SESSION_CREATED, onCreated)
form.requestSubmit()
expect(onCreated).to.have.been.calledOnce
const { _type, ...session } = onCreated.firstCall.args[0].detail   // read the payload back
```

The reason a spy earns its place here is the **negative** assertion. `waitForEvent` can prove an event *happens*, but
it cannot prove one *doesn't* - you would wait forever. A spy proves absence in one line:

```js
expect(onCreated).to.not.have.been.called   // an invalid submit must NOT fire the pipeline
```

### Drive it like a user

The input is no longer an attribute you set - it's an action a user takes, so the test performs the action:

- calling **`form.requestSubmit()`** runs native constraint validation *and* fires submit only if valid - unlike
  `.submit()`, which skips validation. That single call is what lets you test "invalid stays put, valid dispatches."
- using **`sendKeys` / `.click()`** type into fields and press buttons for real (see `cfb-flip-card.test.js`, which
  flips a card on click).

The assertion target has not changed since T-1: **observable output** - a dispatched event, an `aria` attribute, a
`.hidden` toggle. Only the *trigger* is new. Native form state (`checkValidity()`, `element.validity.*`, `FormData`)
is read the same way - you assert the browser's own validation, not hand-written checks.

The suites you will read and extend:

| File                                           | Role                                                               |
|------------------------------------------------|--------------------------------------------------------------------|
| `test/cfb-add-session-form.test.js`            | Real `<cfb-add-session-form>`: `requestSubmit()` + event dispatch |
| `test/cfb-session-updated.test.js`             | `cfbSessionUpdated()` event factory                                |
| `test/cfb-session-removed.test.js`             | `cfbSessionRemoved()` event factory                                |
| `test/session-step5.contract.test.js`          | Step 5 session fields in well-known JSON                           |
| `test/session-removed-detail.contract.test.js` | Removal event detail schema                                        |
| `test/helpers/fixture.js`                      | Mount + `#testRoot` cleanup                                        |

Complete [Myth or fact](./learning-log.md#t-5-concepts-myth-fact) and the
[one-minute review](./learning-log.md#t-5-concepts-one-minute).

Practical notes: **[tips.md](./tips.md)**.

---

## 3) Concrete practice

```bash
cd frontend/test-5
npm install
npm test          # or: npm run test:watch
```

### Read the test lists, then make them green

Same loop as T-3 / T-4: the practice suites ship as `todo(...)` lists. Read a `todo`, promote it into a real
`it(...)`, drive it green, move on. Start gentle, then take on the integration test. Capture your list in
[your log](./learning-log.md#t-5-concrete-test-list).

- [ ] `test/cfb-session-updated.test.js` - a warm-up: an event-factory **contract** for a new event
  (`cfbSessionUpdated`), the same shape of test as T-3, on a new payload.
- [ ] `test/cfb-add-session-form.test.js` - the main event: mount the real form, **spy** on `cfb-session-created`,
  and prove native validation gates `requestSubmit()`:
    - use the `fillValidAddSessionForm` helper to fill the form with valid data
    - when testing invalid form: use spy as `.to.not.have.been.called`
    - when testing valid form (fill it first) -> spy `.calledOnce`, and the `detail` matches the schema.
    - a missing required field -> no dispatch

### Read for reference (already complete)

Read these; don't rewrite them:

- [ ] `cfb-session-removed.test.js` - the finished twin of your `updated` exercise; compare your contract test to it.
- [ ] `session-step5.contract.test.js` and `session-removed-detail.contract.test.js` - well-known JSON validated
  against the step-5 schemas (the "read an external file" pattern from T-3).
- [ ] `cfb-flip-card.test.js` - interaction testing taken to the extreme: a card that pins, flips on click, adds a
  backdrop, and cleans up after the animation. Read it to see how far "drive it like a user + assert observable
  state" scales.

## Constraints

- Assert **observable output** only: dispatched events (via a spy), `aria` / `.hidden` state, native `validity.*`.
- Let the browser validate - no hand-written `if (title.length < 5)`.
- Max **30 minutes**.

See **[tips.md](./tips.md)**.

---

## 4) Conclusions

1. [Loop back: submit guess](./learning-log.md#t-5-loop-back-submit)
2. [Quick check: three advantages](./learning-log.md#t-5-conclusions-quick-check)
3. [Ticket out](./learning-log.md#t-5-conclusions-ticket-out)
4. Hub takeaway → [`learning-log-test.md`](../learning-log-test.md#t-5-key-takeaway)

---

## Extras

- [ ] Test `reportValidity()` leaves a visible `:invalid` field
- [ ] Pattern validation on tags field if you added it in Step 5

---

### End result

- `form.checkValidity()` vs `element.validity.*`
- `FormData` without a submit event
- Testing plain HTML forms and custom-element forms in one package
