# Tips

[← Back to README — 3) Concrete practice](./README.md#3-concrete-practice)

## Querying form fields

Prefer `form.querySelector('[name="title"]')` over `form.elements.title` — the latter collides with the form element’s
own `title` IDL property.

## `requestSubmit()` and validation

`requestSubmit()` respects constraint validation: if the form is invalid, the `submit` event is **not** emitted, so your
add-session handler never runs.

Test invalid paths with `requestSubmit()` + assert **no** `cfb-session-created` listener fired.

## A note on timing

The tests in this step are **synchronous**: `requestSubmit()`, `dispatchEvent`, and the event
contracts all resolve inline, so you assert immediately — no `await tick()` or queue flush. The one
async surface in step 5 is the flip-card animation, which uses **`requestAnimationFrame`** (an
animation-frame callback — yet another macrotask source, distinct from microtasks). It isn't covered
here; if you add tests for it, you'd wait on a frame rather than a promise. The full treatment of
async waiting — microtasks, macrotasks, and *why you await a signal instead of counting turns* — lives
in [`test-4/tips.md`](../test-4/tips.md), introduced with IndexedDB.

## Contract tests

Step 5 session shape: `test-5/contracts/session-step5.well-known.json` and related schema files. Reuse patterns from
T-3.

See [`PLAN-TEST.md`](../PLAN-TEST.md) § T-5 for the original spec.
