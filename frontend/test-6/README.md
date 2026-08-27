# Test Step T-6: Custom Form Element · `ElementInternals`

**Build companion:** [Step 6](../step-6/README.md)

> **Before you start:** [getting-started.md](./getting-started.md) · [T-6 learning log](./learning-log.md)

Test `<cfb-session-format>` as a **form participant**: `FormData`, `required`, tile selection, through user-visible
behaviour, not `internals` directly.

---

## Learning goal

By the end of T-6 you can:

- Assert selected values appear in `FormData` after `click()` on tiles
- Test `form.checkValidity()` with a required custom control
- Test add/edit form integration where Step 6 swapped radios for `<cfb-session-format>`

---

## 1) Connections

In [your T-6 learning log](./learning-log.md):

1. [FormData guess](./learning-log.md#t-6-connections-formdata-guess) *(before Concepts)*
2. [Bridge from Step 6: what stays the same](./learning-log.md#t-6-connections-bridge)

---

## 2) Concepts

T-5 tested **native** form controls. T-6 tests your **own** element joining the form as a first-class participant -
a *form-associated custom element*. `<cfb-session-format>` uses `ElementInternals` under the hood, but the twist for
testing is: you still treat it like a native control, and never assert on `internals` directly.

### Setup with fixture

To test a custom form element, it's useful to test the behavior of it in isolation from the surrounding form. Easy way
to do that is to use a fixture that mounts the element in an empty form:

```javascript
async function mountFormWithSessionFormat(attrs = '') {
  const form = await fixture(`
    <form>
      <cfb-session-format name="session-format" ${attrs}></cfb-session-format>
    </form>
  `)
  const field = form.querySelector('cfb-session-format')
  return { form, field }
}
```

This returns you a form and the element, in the DOM.

### Test a custom control like a native one

The question a form test asks is not "did it call `setFormValue`?" - it is "**does its value show up where the form
collects values?**" That is `FormData` (again, focus on the behavior, not the internals):

```js
field.querySelector('[data-value="Workshop"]').click()
expect(new FormData(form).get('session-format')).to.equal('Workshop')
```

Same for validity: a `required` custom control makes `form.checkValidity()` return `false` until something is
selected - exactly as a `required` `<select>` would. You assert the **form's** view of the element, not the element's
internals.

### Drive it with click(), not internals

Select a tile the way a user does - `tile.click()` - not `internals.setFormValue('Workshop')`. It's the same rule of '
test the observable behavior', but now from the input side - _interact with the public interface, not internals_.
`internals` is the mechanism; the click is the behaviour. Asserting through `internals` couples the test to **how**
participation works; asserting through `FormData` / `checkValidity` pins **that** it works, and survives a rewrite of
the
internals.

---
**NOTE:**
T-2's "assert the seam, not the child," applied to the form boundary. It's a common thing to remember in all the test
steps.
---

### Testing the behavior vs. testing the visuals.

As good practice is, keep the `describe` blocks coherent. Tell in the describe block what you're testing. In this case,
you can easily test the form association (which is the behavior) in one block, and have visuals in another `describe`
block. This keeps the tests easier to read and to understand. 

Both assert observable output; mixing them in one test hides which concern broke.

--- 

Complete [Myth or fact](./learning-log.md#t-6-concepts-myth-fact) and the
[one-minute review](./learning-log.md#t-6-concepts-one-minute).

Implementation and test-file layout: **[tips.md](./tips.md)**.

---

## 3) Concrete practice

```bash
cd frontend/test-6
npm install
npm test          # or: npm run test:watch
```

### Read the test list, then make it green

`test/cfb-session-format.test.js` ships as a `todo(...)` list; the mount helper (`mountFormWithSessionFormat`) is
already
there. Read a `todo`, promote it into a real `it(...)`, drive it green, move on.

- [ ] Form participation: no value when unselected, value after `click()`, `required` gates `checkValidity()`, reset
  clears.
- [ ] Visual state: the selected tile gains the class + `aria-checked`, the previous tile deselects.

### Read for reference (already complete)

- [ ] `cfb-add-session-form.test.js` and `cfb-edit-session-form.test.js` - the T-5 form patterns, now with the custom
  control dropped in where Step 6 swapped the radios. Read them to see `<cfb-session-format>` behaving inside a real
  form.

## Constraints

- Assert **observable output** only: `FormData`, `validity.*`, `aria` / class state. Never `internals` directly.
- Drive selection with `click()`, not `setFormValue`.
- Max **30 minutes**.

See **[tips.md](./tips.md)**.

---

## 4) Conclusions

1. [Loop back: FormData guess](./learning-log.md#t-6-loop-back-formdata)
2. [Forms across two steps](./learning-log.md#t-6-forms-two-steps)
3. [Ticket out](./learning-log.md#t-6-conclusions-ticket-out)
4. Hub takeaway → [`learning-log-test.md`](../learning-log-test.md#t-6-key-takeaway)

---

## Extras

- [ ] Keyboard: `Enter` / `Space` on focused tile
- [ ] Dynamic `required` via `setAttribute`
- [ ] `reportValidity()` surfaces message when empty

---

### End result

- Form-associated custom elements via standard form APIs
- Separating visual-state assertions from FormData participation
- Reusing T-5 form patterns for T-6 custom controls
