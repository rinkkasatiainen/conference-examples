# Test Step T-0 - Setup · Mocha + Web Test Runner

Welcome to the **testing track**. This is one where we practice on how to test each type of component that we built in
the 'step-N' examples.

> **Before you start:** [getting-started.md](./getting-started.md) · Test hub flow: [
`how-to-test.md`](../how-to-test.md)

### Async / solo

This testing track works with pairs or as async/solo work. If you work in pairs, please still document your learnings in
the `learning-log.md` file. And for solo work, let that be your pairing partner and use that as rubber duck and document
your thinking. What I have heard from participants is, that the learning log is the most crucial part of the process.

---

## Learning goal

By the end of T-0 you can:

- Run tests using `@web/test-runner` using npm scripts.
- Explain why it's running the tests in a **real browser**
- Explain why JSDOM (and hence Jest) is a poor fit for Custom Elements

---

## 1) Connections

Do these **in order**; write in [your T-0 learning log](./learning-log.md).

1. **Why not Jest?** - [Guess before Concepts](./learning-log.md#t-0-connections-jest-guess)
2. **Topic link** - [Your testing background](./learning-log.md#t-0-connections-topic)

---

## 2) Concepts

### @web/test-runner ??

**`@web/test-runner`** is a modern, lightweight testing tool specifically designed for web applications.

Unlike traditional runners that fake a browser environment inside Node.js, it spins up **real, actual browsers** to run
your tests.

### How it works?

To run the tests in a real browser, it needs a web server to serve the test files which contains the components that are
being tested. It does that by following the following steps:

1. **Launching a Dev Server**: It starts a local web server that reads your project files natively using standard
   browser ES Modules. There is no bundle or compile step.
2. **Opening Real Browsers**: It uses browser automation tools (like Playwright or Puppeteer) to launch real, headless
   instances of Chrome, Firefox, or Safari.
3. **Executeing Locally**: Your test code is loaded into a real browser page via a standard script tag, running exactly
   like it would for an end-user.
4. **Reporting to Terminal**: The browser passes the test outcomes, console logs, and errors straight back to your
   terminal interface.

You can also see the tests running in browser, by instructing the tests to happen in `--manual` mode, when you can open
the browser and see the tests running. This is also a great way to both debug the tests and to see the actual components
rendering in the browser.

### Manual mode!

By default, `@web/test-runner` runs your tests invisibly in "headless" browsers. However, adding the --manual flag
changes the behavior completely: instead of automation, it gives you a live interactive web page to visually inspect and
debug your components. In [test-5](../test-5/README.md), you can see this in action where you can even see the animation
as part of the test execution.

**how does it work?**

1. When you run the tests in `--manual` mode, the runner boots up the server, but pauses the execution
2. It displays the address of the test page in the terminal (often `http://localhost:8000`)
3. You can open that page in **any browser** and see the tests running
4. You can open each test file (test suites) in the browser and see the tests running in isolation, and debug them using
   the browser's DevTools

**Why this is nice.**

- **See Your Animations**: For things like your card-flip animation, you can watch it execute in slow motion using the
  browser's native DevTools performance tab.
- **Real UI Debugging**: You can open DevTools, use the DOM inspector element picker, tweak the global Light DOM CSS
  styles live on the page, and see instantly why a component's layout is breaking.
- **Cross-Device Testing**: Because it serves over a standard local IP, you can open the test suite URL on an actual
  physical iPhone or Android device to test true mobile touch events and responsiveness.

### Why not JSDOM / Jest?

Coming from React/Vue etc, you most likely have used Jest to test your components. Jest runs tests on JSDOM, while as we
have learned, `@web/test-runner` runs tests on real browsers. If you are building core Vanilla Web Components that live
in the Light DOM, Jest introduces unnecessary complexity and false confidence. Here is why `@web/test-runner` is the
right choice:

- **It tests reality, not a simulation**: Your Light DOM components interact directly with the page's global styles,
  form submissions, and layout engine. Jest uses JSDOM, which forces you to write mocks for basic browser
  features like animations (requestAnimationFrame), element dimensions (offsetWidth), and native form validation.
  `@web/test-runner` runs your code in a real browser, executing your card-flip animations and form states flawlessly
  without a single mock.
- **A purely native workflow**: Your components are written using modern, browser-native ES Modules (ESM). Because Jest
  runs inside Node.js, it forces you to set up complex build tools (Babel, Vite, or Webpack) just to transpile your code
  so Node can read it. `@web/test-runner serves` your native files straight to the browser over standard HTTP. There is
  zero compilation, zero build configuration, and zero risk of a build tool altering your code's behavior between
  testing and production.

| Feature                   | Jest + JSDOM (Node.js Simulation)                               | @web/test-runner (Real Browser Execution)                            |
|:--------------------------|:----------------------------------------------------------------|:---------------------------------------------------------------------|
| **Execution Environment** | Fake browser simulated in Node.js.                              | Real browsers (Chrome, Firefox, Safari).                             |
| **Workflow Build Step**   | **Requires compilation** (transforms ESM to CommonJS).          | **Zero-build** (serves native ES Modules directly).                  |
| **User Interactions**     | **Synthetic events** (clicks work on hidden/disabled elements). | **Trusted events** (real mouse/keyboard engine via automation APIs). |
| **Form Integration**      | **Simulated & buggy** (fails on native validation APIs).        | **Native & flawless** (full support for validation states).          |
| **Layout & Geometry**     | **None** (`getBoundingClientRect()` always returns `0`).        | **Full** (calculates exact pixel sizes and positions).               |
| **Animations & Layout**   | **No support** (requires heavy mocking of frames/timers).       | **Full support** (runs CSS transitions and layout scripts).          |
| **Style Intersections**   | **Ignored** (cannot compute how global CSS affects elements).   | **Accurate** (tests true global CSS inheritance in Light DOM).       |

And, as Aki has a hate-hate relationship with **Jest** (for example it being super slow), having a tool that runs mocha
and uses sinon and chai, is only a plus.

Complete [Myth or fact](./learning-log.md#t-0-concepts-myth-fact) in your learning log after skimming the sections
below.

---

## 3) Concrete practice

Before you can test components, get one green dot on the screen.

This is initialized with all the necessary files and folders for the exercise. Your job is to run the tests, and update
the test to make it pass

### Steps to do

- [ ] install the dependencies in this folder (`npm install`, `yarn install`, `pnpm install` - whatever you prefer)
- [ ] run `npm run test` and see it fail
- [ ] fix the test,
- [ ] run `npm run test` again and see it pass

## Constraints

- Max **20 minutes** - this is pure tooling setup, not component work yet.
- No component code in this step.

Detailed setup: **[tips.md](./tips.md)** (scripts, config, import maps, smoke test, npm commands).

---

## 4) Conclusions

1. [Loop back - Jest/JSDOM guess](./learning-log.md#t-0-loop-back-jest)
2. [Ticket out](./learning-log.md#t-0-conclusions-ticket-out)
3. Add **one or two sentences** in the [test hub `learning-log-test.md`](../learning-log-test.md#t-0-key-takeaway)

---

## Extras

Should you finish early, here are some ideas to go deeper:

- [ ] **Second browser** - add `firefoxLauncher` or `webkitLauncher` from
  `@web/test-runner-playwright` to the `browsers` array and run tests in
  multiple engines at once
- [ ] **Coverage** - add `--coverage` to the test script and open the generated
  `coverage/` report in a browser
- [ ] **Import map swap** - add a fake module to `testImportMappings` and
  verify a test can import the fake instead of the real thing

---

## Demos

If you complete the challenge, share a short screen recording or paste your
terminal output here.

## Issues

If you get stuck, note the problem here so we can discuss it together.

---

### End result

After completing this step you will have learned:

- Why **browser-native test runners** matter for Web Components
- How `@web/test-runner` drives a real Chrome instance via **CDP** without
  Playwright - and when you would bring Playwright back
- How **import maps** let you swap a real module for a test fake without
  touching component code - a clean browser-native alternative to `jest.mock()`
- The role of `chai` - Chai compiled as an ES module so it loads
  directly in the browser without a build step
- Mocha's `describe` / `it` structure running **inside** a browser context
- The four `npm` scripts and when to reach for each one
