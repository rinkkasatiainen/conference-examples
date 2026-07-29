# Step 6 - `<cfb-session-format>` · Form-associated custom element

In Step 5 you built add/edit forms with **native** controls and **`FormData`**. This week you replace **only** the
**session-format** radio group with **`<cfb-session-format>`** - a **form-associated** custom element. You'll learn to
integrate a custom element into a form in a way that the **same** submit path, validation, and events stay intact.

The field must still have the `name` attribute for `FormData` to work, honour the **`required`**, and work in **both**
add and edit dialogs. A cheat would be to have a **hidden** native radio group, but as that would defeat the purpose of
learning the form-associated element, it's highly encouraged to not use the cheat.

To begin with, copy your add/edit session forms from [step-5](../step-5).

> **Before you start:** branch, HTTP server, console clean - see [getting-started.md](./getting-started.md).

**Testing companion (optional):** [Test step T-6 · form-associated element](../test-6/README.md)

### Async / solo

These challenges are written for **async, often solo** work. Use [your Step 6 learning log](./learning-log.md), a short
message to your facilitator or team, or a brief sync when the README says “compare.” **Short timeboxes** matter more
than the format.

---

## Learning goal

By the end of this step, you can:

- Explain the lifecycle of submitting form (from cliking 'submit' to dispatching the custom element)
- Demonstrate how to integrate a custom element into a form
- Demonstrate how custom form element can be validated, errors reported to the user and follow the natural flow of form
  submission
- Explain why reset the form on form close is important.

---

## 1) Connections

Do these **in order**; capture answers in [your Step 6 learning log](./learning-log.md).

1. **Solo, ~2 min - Think → ink (FormData guess)**  
   [FormData guess](./learning-log.md#step-6-connections-formdata-guess)

2. **Solo, ~3 min - Bridge from Step 5**  
   [Bridge from Step 5](./learning-log.md#step-6-bridge-step-5).

3. **Optional pair / async, ~3 min**  
   [Surprise / compare](./learning-log.md#step-6-connections-surprise).

4. **Solo, ~2 min - Topic link**  
   [Topic link](./learning-log.md#step-6-topic-link): answer **A** or **B**.

---

## 2) Concepts

### Using form-associated custom elements

The change for this step is to change the radio button group of 'session-format's, into a custom element that takes the
logic to itself. The `CfbSessionFormat` is partly impelmented to show a bit more styling, just to showcase how this
could
be used.

The change we want to showcase is change

```HTML

<fieldset class="cfb-add-session-form__group">
    <legend>Session format *</legend>
    <label class="cfb-add-session-form__radio">
        <input type="radio" name="session-format" value="Talk" required/> Talk
    </label>
    <label class="cfb-add-session-form__radio">
        <input type="radio" name="session-format" value="Workshop"/> Workshop
    </label>
    <label class="cfb-add-session-form__radio">
        <input type="radio" name="session-format" value="Keynote"/> Keynote
    </label>
    <label class="cfb-add-session-form__radio">
        <input type="radio" name="session-format" value="Lightning Talk"/> Lightning Talk
    </label>
</fieldset>
```

to

```HTML

<fieldset class="cfb-add-session-form__group">
    <legend>Session format *</legend>
    <cfb-session-format name="session-format" required></cfb-session-format>
</fieldset>
```

To do this, we need to learn the concept of form-associated custom elements.

This also shows the magic of custom elements in forms - the form itself is product of `SessionProposal` capability,
while the `cfb-session-format` is a product of `SessionCategorization` capability. 2 different capabilities, where one
does not know of the existence of the other (concrete classes), but it can still communicate with each other using
native browser APIs.

### Form-associated custom elements

Making custom elements for a form is possible with Web Components. What we'll learn now is how that is done. It requires
**two** things:

- The element must be made to _act like a form element_ in the browser. This is done by setting a static attribute
  `formAssociated` to be `true`.
- and you need to call `this.attachInternals()` as the bridge between the data and the form behavior.

When these things are done, you can introduce element-specific logic (validation, reporting, and setting the value) by
using methods like `setFormValue`, `setValidity` and `reportValidity`

### `Value` and `FormData`

When calling `this.attachInternals()`, it returns a concept of **`ElementInternals`**, which makes you able to:

- set the value of the custom form element with `internals.setFormValue(value)`, where value is the value of
  `data-value` of the button.
- set the value to **`null`** if none is selected.
- See also, that the `name` attribute of the form is defined for the `cfb-session-format` element, and not within this
  component. This is how **`FormData`** maps the value of the element to the collection of Form Data elements.

### Inner HTML of the new component

In this example, we're transforming the plain radio button group into a collection of `button` elements that behave like
it was a radio button group. To do that, the inner HTML of the form element is:

```HTML

<div class="cfb-session-format__group" role="radiogroup" aria-label="Session format">
    ${OPTIONS.map(t => `
    <button type="button" role="radio" class="cfb-session-format__tile"
            data-value="${escapeAttr(t.value)}"
            aria-checked="false"
            tabindex="-1">
        <span class="cfb-session-format__emoji" aria-hidden="true">${t.emoji}</span>
        <span class="cfb-session-format__label">${t.label}</span>
    </button>
    `).join('')}
</div>
```

To make this work correctly in the browser, what needs to be implemented is an event listener for 'click' when a user '
clicks' any of the buttons. As usual, this can be done on the `button` level (there are other ways too, but would cause
some extra logic to be handled).

After finding the element, it only needs to set the value of the custom form element to `buttonElement.dataset.value`.

### Validation

One of the core learnings for this session is to learn how to integrate into the 'submit' flow of browsers.

### What happens when you submit.

In [Step 5 tips](../step-5/tips.md#what-happens-when-user-presses-submit), we learned a simplified version of the
'submit' flow of forms. It is accurate in many cases, but there are exceptions to the rule. For example, validation step
is not run at all if:

- if form has `novalidate` attribute
- if form has a `button type="button"` (instead of `type="submit""`) - and there is custom JS that calls
  `form.submit()` -> then no implicit validation happens.
- `form.submit()` in general bypasses validation - but `form.requestSubmit()` does work like a real click, running
  validations etc.

In short - if the flow from 'clicking submit' follows the 'default' flow, the validations are run. This is crucial for
the custom form elements: If the custom element sets the validity of the element, that validation is part of the
_validation flow_ of the submit flor.

**Meaning**: If the custom component defines:

```javascript
this.#internals.setValidity({ valueMissing: true }, "Please select the type")
```

then on the validation phase, it will show the custom error defined "Please select the type".

To make sure the the validation always happens, in the `#submit` handler of the form, you can have the following piece
of code, then the validation logic is guaranteed to run. This would guarantee the validation even if the logic is
triggered by a custom JS call to `form.submit()`

```javascript
if (!form.checkValidity()) {
  form.reportValidity()
  return
}
```

### Integrate the custom element to basic form behavior.

The steps needed to be done for this step are:

- validate the validity of `cfb-session-format` and explicity set that with `setValidity()` function
- define `get value()` for `cfb-session-format` so that FormData integration works
- explicity check validity & report validity in the form.

### No hidden radio fallback

- The **session-format** value must come from **`this.#internals.setFormValue()`** on your custom element - **not** from
  a shadowed **`<input type="hidden">`** pretending to be the control. That keeps the learning goal honest.

### End-to-end flow (reference)

Legend:

- ✅ This is already provided
- 🚧 Partly done, part of this exercise
- ✨ New features, core of the exercise

```
user opens add/edit form and selects session format tile
    │
    ▼
✨ <cfb-session-format>       (new this step)
    the form is using this new form-associated custom element
    setFormValue(value) so FormData includes `session-format`
    setValidity/reportValidity so `required` behaves natively
    keyboard + click support for selection
    │ value is submitted with the parent form
    ▼
🚧 <cfb-add-session-form> / <cfb-edit-session-form>
    use <cfb-session-format name="session-format" required>
    collect with new FormData(form) (same as Step 5)
    │ dispatches cfb-session-created / cfb-session-updated
    ▼
✅ <cfb-session-store> (unchanged from step-5)
    persists to IndexedDB and rebroadcasts sessions
    │
    ▼
    ... (unchanged from before)
```

---

### One-minute review (~1 min)

After reading the sections above, complete [One-minute review](./learning-log.md#step-6-concepts-one-minute) in your
learning log.

---

### Concept check (Step 3 style)

Do **two** short activities in your [learning log](./learning-log.md).

1. **Mini quiz** - Open [Mini quiz](./learning-log.md#step-6-concept-quiz) and answer the three questions **before** you
   lean on copy-paste from source.
2. **Flow sketch** - Open [Flow sketch](./learning-log.md#step-6-concept-flow-sketch) and draw the pipeline (boxes +
   arrow labels). Paper is fine; ASCII or a photo pasted elsewhere is fine.

When both are done, move on to **Concrete practice**.

---

## 3) Concrete practice

### Files to work in

To finish this exercise, you need to (detailed help below the table)

| File                                                        | Role                                                                                             |
|-------------------------------------------------------------|--------------------------------------------------------------------------------------------------|
| ✨ [`cfb-session-format.js`](./cfb-session-format.js)        | New custom element, focus of this session                                                        |
| 🚧 [`cfb-add-session-form.js`](./cfb-add-session-form.js)   | Replace session-format **radios** with **`<cfb-session-format name="session-format" required>`** |
| 🚧 [`cfb-edit-session-form.js`](./cfb-edit-session-form.js) | Same replacement · **preselect** type for the session being edited                               |
| ✅ [`index.js`](./index.js)                                  | registers elements as before                                                                     |
| ✅ [`index.html`](./index.html)                              | no changes from Step-5                                                                           |

### ✨ `cfb-session-format.js` - new custom element

- [ ] Create `<cfb-session-format>` with `static formAssociated = true`
- [ ] Call `this.attachInternals()` in the constructor and store internals
- [ ] Render selectable tiles (Talk / Workshop / Keynote / Lightning Talk)
- [ ] Keep selected value in component state and reflect it in the UI
- [ ] On selection, call `internals.setFormValue(selectedValue)`
- [ ] Handle validation:
    1. if `required` and empty -> `setValidity({ valueMissing: true }, 'Please select a session format.')`
    2. if valid -> `setValidity({})`
    3. call `reportValidity()` when appropriate (e.g. submit path)

### 🚧 `cfb-add-session-form.js`

- [ ] Replace session-format radio inputs with `<cfb-session-format name="session-format" required>`
- [ ] Keep submit flow unchanged: `checkValidity` / `reportValidity` / `FormData`

### 🚧 `cfb-edit-session-form.js`

- [ ] Replace session-format radio inputs with `<cfb-session-format name="session-format" required>`
- [ ] Ensure existing session format is preselected when editing

### 🚧 `index.js` and `index.html`

- [ ] Register/import the new element in step 6
- [ ] Keep board wiring and store flow unchanged from step 5

### **After building these, you can show:**

- [ ] **`<cfb-session-format>`** with **`static formAssociated = true`** and **`attachInternals()`** early in the
  instance
  lifecycle (e.g. **class field** or **`constructor`** - match one style on your team).
- [ ] **Tiles** for **Talk**, **Workshop**, **Keynote**, **Lightning Talk** (emoji or icons) with a clear **selected**
  state.
- [ ] **`internals.setFormValue(...)`** updates when the user selects a tile; empty / unselected state omits or clears
  per your **`FormData`** contract.
- [ ] **`required`**: invalid submit shows a **native-style** validation message; valid submit includes **
  `session-format`
  **
  in **`FormData`**.
- [ ] **Add form** and **edit form** both use the custom element; **edit** shows the existing type.
- [ ] **`formResetCallback`** (and **`formDisabledCallback`** if applicable) keep reset/disable flows correct.

**Constraints**

- HTML, JavaScript, and (optionally) CSS only - no frameworks.
- **No** hidden native **`<input>`** as the real carrier for session format - **`ElementInternals`** owns the value.
- Aim for about **30–45 minutes** on the core challenge.

**Definition of done**

- Submitting without a selection is **blocked** with a **browser validation** experience (not only a custom `alert`).
- After selecting a type, **`FormData`** from the parent form includes **`session-format`** with the expected string.
- **Edit** opens with the correct tile selected; **reset** clears selection and validity as users expect.

In [Question for your facilitator](./learning-log.md#step-6-concrete-facilitator-question), ask **one** real question
and capture the answer.

---

Go to [Learning Log](./learning-log.md#step-5---concrete-practice-think-it-and-ink-it) and do the few reflections.

---

## 4) Conclusions

### 1) Quick check

Answer in [your learning log - Quick check](./learning-log.md#step-6-conclusions-quick-check).

### 2) Loop back

Update [FormData guess](./learning-log.md#step-6-loop-back-formdata-guess) if your mental model changed.

### 3) Forms across Step 5 + Step 6

Complete [Forms across two steps](./learning-log.md#step-6-forms-two-steps) in your log.

### 4) Key takeaway (journey hub)

Add **one or two sentences** in the [journey hub `learning-log.md`](../learning-log.md#step-6-key-takeaway).

---

### Demos / issues

- Share a short screen recording or a [CodePen](https://codepen.io) link if you want feedback.
- If you get stuck, note it in your learning log or ping your facilitator.

---

## Extras

If you finish early:

### Reset, disabled, edit

- [ ] Implement `formResetCallback` to empty the form when closing the dialog.
- [ ] Implement the same custom component for the 'edit flow'
- [ ] React to **`required`** dynamically in **`attributeChangedCallback`** and re-sync validity.
- [ ] Custom validation copy via **`setValidity`** for more than **`valueMissing`**.
- [ ] **Keyboard**: **`tabIndex`**, **arrow** keys between tiles, **Enter** / **Space** to select; expose *
  *`aria-selected`** / roles appropriately.
- [ ] Extract **tags** UI into its own form-associated or composite control and compare coupling trade-offs.
- [ ] Add lightweight tests for keyboard + validation (see other steps’ test folders for patterns).

---

### End result (skills you can demonstrate)

- **`ElementInternals`** and **`attachInternals()`**
- **`static formAssociated = true`**
- **`setFormValue`**, **`setValidity`**, **`reportValidity`**
- **`formResetCallback`** / **`formDisabledCallback`**
- **Accessible**, keyboard-friendly custom controls inside real **`<form>`**s
