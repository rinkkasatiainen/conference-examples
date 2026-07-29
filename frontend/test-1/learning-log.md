# Learning log - Test step T-1

Use with [T-1 README](./README.md). Hub → [`learning-log-test.md`](../learning-log-test.md#t-1-key-takeaway).

**Build companion:** [Step 1](../step-1/README.md)

---

[← Back to README - 1) Connections](./README.md#1-connections)

---

<a id="t-1-connections-self-correcting-worksheet"></a>

### T-1 - Connections: Self-correcting worksheet

Fill in the blanks from the words mentioned below.

<details><summary>Words to fit (in no particular order)</summary>

`observable` · `story` · `Assert` · `one` · `line` · `Arrange` · `beforeEach` · `thumb` · `blank` · `Act`

</details>

1. Every unit test runs three phases in order - you **______** the element and inputs, **______** the behaviour under test, then **______** on the result.
2. Keep exactly **______** act per test, so a failure points at a single behaviour instead of several.
3. Separate the three phases with a **______** **______**  so a reader can scan _given / when / then_ in seconds.
4. Assert on the **______** behavior a user can see - never test the internals.
5. A good rule of **______** is: _If it's not important for the test, it is important to **not** be in the test_:
6. Concretely, this means that incidental setup belongs in **______**, leaving each test's Arrange to show only what makes it different.
7. A well-written test reads top-to-bottom like a small **______**.


---

<a id="t-1-connections-bridge"></a>

### T-1 - Bridge from Step 1

One observable behaviour you built in Step 1 that these tests must verify (not re-implement).

>

---

<a id="t-1-connections-prev"></a>

### T-1 - Bridge from T-0

How can you debug the tests when using `@web/test-runner`?

>

---

[← Back to README - 2) Concepts](./README.md#2-concepts)

---

<a id="t-1-concepts-what-to-test"></a>

### What to test from Step 1

The code for step-1 is roughly the following:
```js
export class CfbTag extends HTMLElement {
  #color = 'red';
  #label = 'default';

  static get observedAttributes() {
    return ['data-label', 'data-color'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) return
    if(name === 'data-color') {
      this.#color = newValue;
    }
    if(name === 'data-label') {
      this.#label = newValue;
    }
    this.innerHTML = `<span class="cfb-tag cfb-tag--${this.#color}">${this.#label}</span>`;
  }
}
```

What would you test?

> ___

---

<a id="t-1-concepts-myth-fact"></a>

### T-1 - Myth or fact

1. Asserting `innerHTML` is the most stable way to test custom elements. - M / F: ___
2. `document.body.innerHTML = ''` is safe cleanup in WTR. - M / F: ___
3. `el.classList` on `<cfb-tag>` always includes the colour modifier. - M / F: ___

---

<a id="t-1-concepts-one-minute"></a>

### T-1 - One-minute review

Observable output vs implementation detail - one sentence with an example from `<cfb-tag>`.

>

---

[← Back to README - 3) Concrete practice](./README.md#3-concrete-practice)

---

<a id="t-1-concrete-facilitator"></a>

### T-1 - Question for facilitator

>

---

[← Back to README - 4) Conclusions](./README.md#4-conclusions)


---

<a id="t-1-conclusions-think-it-ink-it"></a>

### T-1 - Think it, ink it

**Remember:** why `fixture` + `#testRoot` instead of nuking `body`?

>
