# Tips

[← Back to README - 3) Concrete practice](./README.md#3-concrete-practice)

## Implementation reminders

Read `step-6/cfb-session-format.js` once before asserting:

- Tiles use **`data-value="Talk"`** (not `data-type`)
- Selected: **`cfb-session-format__tile--selected`**, `aria-checked="true"`
- `#isRequired()` checks **`data-required`**; production forms use `required`, tests may set both

## Test through public behaviour

Do **not** assert on `ElementInternals` directly. Use:

- `tile.click()` for selection
- `new FormData(form).get('session-format')`
- `form.checkValidity()` for required

## Imports

Add/edit form tests use events from **`step-5/lib/events.js`** (not `step-5/events.js`).

## Fixture helper

Skip `customElements.whenDefined('div')` for plain hosts. See `test-6/test/helpers/fixture.js` (only await custom element tag names).

## Package layout

| File | Focus |
|------|--------|
| `cfb-session-format.test.js` | FormData, required, selection |
| `cfb-add-session-form.test.js` | Valid submit → event |
| `cfb-edit-session-form.test.js` | `populate()` + `cfb-edit-saved` |
| `session-format-form.test.js` | Native fields only |
