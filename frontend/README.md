# CodeFreeze Board - Weekly Frontend Challenges

Welcome! This is a friendly, low-pressure series of weekly frontend challenges built around a real-world conference
scheduling board. Each week you get one small, focused task that fits comfortably inside **30–45 minutes** - no need to
block out your whole evening.

The goal is to learn by doing. Every step introduces one idea, builds on the last, and leaves you with something you can
actually open in a browser and show off.

This is now fully with JS and ES Modules, but the same principles can be applied if this would be done with TypeScript.
In fact, there is a planned advanced topic that focuses on introducing TypeScript to the project.

---

## What we're building

The end result is a fully interactive **conference board** - a weekly schedule grid where you can browse sessions, add
new ones, load and persist data, and receive live updates over the network.

We get there gradually:

- **Steps 0–2** lay the visual and structural foundation using plain HTML, CSS, and your first Web Components.
- **Steps 3–6** add behaviour: pub/sub events, IndexedDB, HTML forms, and form-associated custom elements.
- **Steps 7–8** integrate with the outside world: `fetch` from a real backend, then WebSocket live updates.

The shared stylesheet (`styles.css` and its `css/` imports) is yours from day one - you never have to worry about
styling from scratch. Use [`index.html`](./index.html) at the repo root of `frontend/` as the visual reference for the
finished board. Each challenge is about **HTML structure and JavaScript behaviour**.

---

## The story of this track — why these steps, in this order

This isn't eight unrelated widgets. It's **one app growing one capability at a time**, and every step plugs its new
capability into the **same skeleton** without rewriting what came before.

That skeleton is a single rule you first meet in Step 3 and reuse to the end:

> **Events travel up. State travels down. Every data source refreshes the board through the _same_ pipeline — never a
> second render path.**

Read the arc as **capabilities**, not components:

| Step | Capability it adds          | The move                                                          |
|------|-----------------------------|-------------------------------------------------------------------|
| 0    | Structure                   | Semantic HTML — the shape everything else must produce            |
| 1    | Encapsulation               | Wrap markup + behaviour into your first custom element            |
| 2    | Composition                 | Render a component from data                                      |
| 3    | **Decoupling** _(the hinge)_ | Components talk through DOM events, not imports                    |
| 4    | Persistence                 | State moves out of components into IndexedDB; the board _pulls_ on a signal |
| 5    | Input                       | A real form feeds the **same** create pipeline                    |
| 6    | Extending the platform      | A form-associated custom element in the **same** submit path      |
| 7    | Network (pull)              | `fetch` + loaders + an orchestrator that waits for both           |
| 8    | Network (push)              | A WebSocket pushes into the **same** store-and-refresh path       |

**Step 3 is the hinge of the whole track.** Before it, components reach for each other directly; after it, they only
ever communicate through the DOM — events bubbling up, attributes pushed down. Every later step (persistence, forms,
`fetch`, WebSocket) is just a new _source_ feeding that same decoupled pipeline. Get Step 3, and Steps 4–8 are variations
on a theme. The testing track's [T-3](./test-3/README.md) is the mirror hinge: it's where you start testing the
**contract between** components instead of one component in isolation.

The payoff: by Step 8 you can add live server push to a running app and touch **almost none** of the existing render
code — because what you've really been building is the architecture, not the feature count.

---

## Atomic Design - a lens for placing components

Alongside the capability arc above, every component also fits into a layered design system called **Atomic Design**,
introduced by Brad Frost. Atomic Design doesn't drive the _order_ of the steps (the capability arc does) — it's a lens
for deciding **where a component sits** and what it should know about. Think of it as a hierarchy from the tiniest UI
pieces up to full page layouts:

```
Atoms  ──►  Molecules  ──►  Organisms  ──►  Templates
```

**Atoms** are the smallest indivisible building blocks - a coloured tag badge, a person's avatar chip, a form-associated
session-format picker.

**Molecules** are groups of atoms working together as one reusable unit - a session card (title + tags + avatars), the
add-session form.

**Organisms** are complete, self-contained sections of the UI assembled from molecules - the schedule grid, the board
orchestrator, live-update wiring.

**Templates** are the page-level skeletons that arrange organisms into a layout - the `<body>`, `<header>`, and `<main>`
structure.

Keeping this hierarchy in mind makes it easy to decide where a new component belongs, what it should know about, and
what it should leave to its parent. A tag shouldn't know about the card that contains it; a card shouldn't know about
the board.

---

## BEM - how we name CSS classes

All CSS classes in this project follow **BEM** (Block, Element, Modifier), prefixed with `cfb-` to keep everything
scoped to this design system.

```
cfb-block
cfb-block__element
cfb-block--modifier
cfb-block__element--modifier
```

**Block** is a standalone, self-contained component - e.g. `cfb-card`, `cfb-tag`, `cfb-column`.

**Element** (double underscore `__`) is a part of a block that has no meaning on its own - e.g. `cfb-card__title`,
`cfb-card__footer`.

**Modifier** (double dash `--`) describes a variation in appearance or state - e.g. `cfb-tag--blue`, `cfb-tag--red`,
`cfb-card--travel`.

A real example from the board:

```html

<article class="cfb-card cfb-card--travel">
  <header class="cfb-card__header">
    <h3 class="cfb-card__title">Opening Keynote</h3>
  </header>
  <div class="cfb-card__tags">
    <span class="cfb-tag cfb-tag--blue">Keynote</span>
  </div>
</article>
```

The modifier `cfb-card--travel` adds the blue left-border variant without touching the base `cfb-card` styles. The
element classes `cfb-card__header`, `cfb-card__title`, and `cfb-card__tags` describe parts that only make sense inside a
card.

This naming convention pays off as the component tree grows: you always know at a glance which block a class belongs to,
and modifiers never accidentally bleed into unrelated components.

---

Here's how each core step maps to a layer:

| Step | What you build                                                              | Layer                   |
|------|-----------------------------------------------------------------------------|-------------------------|
| 0    | Static HTML board                                                           | Template                |
| 1    | `<cfb-tag>`                                                                 | Atom                    |
| 2    | `<cfb-session-card>`                                                        | Molecule                |
| 3    | `<cfb-board-orchestrator>`, `<cfb-schedule>`, `<cfb-session-generator>`     | Organism                |
| 4    | `<cfb-session-store>` IndexedDB store + schedule rendering from persistence | Storage + Organism      |
| 5    | `<cfb-add-session-form>`                                                    | Molecule                |
| 6    | `<cfb-session-format>` (form-associated element)                              | Atom                    |
| 7    | `<cfb-session-loader>` + `<cfb-schedule-loader>` loaders, orchestrator      | Organism / side-effects |
| 8    | `<cfb-live-session-updates>` (WebSocket)                                    | Organism                |

> The layers deliberately **revisit** — a molecule in Step 5, then an atom in Step 6 — because the arc is driven by
> _capability_, not by climbing the hierarchy in order. Step 6's atom refines a control _inside_ Step 5's form molecule.

Each step has its own folder (`step-0/`, `step-1/`, … `step-8/`) with a **`README.md`** (goal, deliverables,
constraints, optional extras) and often a **`getting-started.md`** (branch, local server, first browser check).

| Step | One-line focus                                                            |
|------|---------------------------------------------------------------------------|
| 0    | Replace custom tags with semantic HTML; no JavaScript.                    |
| 1    | First custom element: reactive `data-label` / `data-color`.               |
| 2    | Compose `<cfb-tag>` inside a session card from JSON data.                 |
| 3    | Custom events bubble up; orchestrator pushes state down via attributes.   |
| 4    | Seed and read sessions from IndexedDB; render the board from storage.     |
| 5    | Native form validation and `FormData`; dispatch into the existing pipeline. |
| 6    | Form-associated custom control with `ElementInternals`.                   |
| 7    | Loaders `fetch` schedule + sessions             |
| 8    | WebSocket pushes updates; same orchestrator refresh path as Step 7.       |

### Learning logs

- [`how-to.md`](./how-to.md) - how to move between each step’s **README** (guide) and **learning-log** (your answers)
  through the 4C flow.
- [`learning-log.md`](./learning-log.md) in `frontend/` is the **hub**: a short **key takeaway** per step plus links to
  every detailed log.
- Each `step-N/` folder has its own `learning-log.md` for longer notes and session prompts (Training from the Back of
  the Room style).

### Learning goals summary

A one-page summary of the measurable learning outcome for every step lives in
[`learning-goals.md`](./learning-goals.md).

---

## Advanced topics (optional)

After the core arc (Steps 0–8), It comes in **two tiers**, and they work differently.

### Journeys - architecture, multi-session

Steps 0–8 leave you with a working board and a **flat folder**: one `EventTypes` enum, one session store, one
backend module, all imported by everything. The journeys are the refactor that turns that into a set of
**independently packaged business capabilities** - the shape you can see in
[`example-app/`](../example-app/). They introduce no new browser API at all.

| Journey | Title                          | Sessions | The question it answers            |
|---------|--------------------------------|----------|------------------------------------|
| A       | Find the Business Capabilities | A1–A3    | Where do the boundaries go?        |
| B       | Package a Capability to npm    | B1–B3    | How does a boundary become a package? |

**A** is mostly writing, not coding - you card-sort your own components into capabilities, classify them as
core / supporting / generic, then grep your own imports to find the shared kernel you built without noticing.
**B** turns one of those capabilities into a real npm package: a single public entry point, resolved in the
browser by bare specifier via an import map, receiving its infrastructure by injection, shipping its contract
alongside. No bundler, no build step.

Unlike the topics below, **the journeys are sequential**: A produces the map that B packages, and the sessions
inside a journey build on each other.

### Topics - one browser API, 30 minutes

| Topic | Title                            | Browser API                         |
|-------|----------------------------------|-------------------------------------|
| C     | `<cfb-timeline>` - SVG           | Inline SVG, SMIL                    |
| D     | `<cfb-occupancy-chart>` - Canvas | Canvas 2D, `requestAnimationFrame`  |
| E     | Design Tokens & Theming          | CSS custom properties, `@layer`     |
| F     | Import Maps                      | Module resolution without a bundler |
| G     | Web Workers                      | Off-main-thread work                |
| H     | View Transitions                 | `document.startViewTransition`      |
| I     | Shadow dom                       | Working with shadow dom             |
| J     | Slots                            | Working with slots                  |
| K     | Typescript                       | Using TypeScript instead of JS      |

These do not block the main weekly path; tackle them in any order. Topic **F** is the mechanism Journey B runs
on, so it doubles as a warm-up for B1.

> **Renumbered.** Topics C–K were previously A–I, to make room for the journeys. The old **Topic C½ (Packaging
> & ES Modules)** is retired - Journey B covers the same ground with a real capability split behind it.

---

## Testing track

Running alongside the component steps is a **companion testing track** - challenges focused on testing the same
components you build, using a real browser test runner instead of JSDOM.

The testing steps live in their own folders (`test-0/`, `test-1/`, …) and can be tackled in parallel with the matching
component step or as a separate session.

| Test step | Title                                      | Mirrors | Extras           |
|-----------|--------------------------------------------|---------|------------------|
| T-0       | Setup - Web Test Runner                    | -       | -                |
| T-1       | Atom Behaviour - `<cfb-tag>`               | Step 1  | -                |
| T-2       | Molecule Behaviour - `<cfb-session-card>`  | Step 2  | -                |
| T-3       | Pub/Sub - `cfb-session-created` event flow | Step 3  | contract testing |
| T-4       | IndexedDB Store - async round-trips        | Step 4  | contract testing |
| T-5       | Form Validation - constraint API           | Step 5  | -                |
| T-6       | Custom Form Element - `ElementInternals`   | Step 6  | -                |
| T-7       | Loader Components - fetch stubbing         | Step 7  | -                |
| T-8       | Live Updates - WebSocket stub              | Step 8  | -                |

### Why test in a real browser?

JSDOM does not support Custom Elements or Shadow DOM, so standard Jest setups simply cannot run these tests.
`@web/test-runner` launches a real Chromium instance - the same engine your components run in - so
`customElements.define()`, `connectedCallback`, and Shadow DOM all work exactly as in production.

Start with **`test-0/`** to get the toolchain up and running (≈20 minutes), then pick up individual test steps as you
finish the matching component step.

---

## How to get started

Each step folder is self-contained. **Step 0** is HTML and CSS only - you can open `step-0/index.html` via a local
server or sometimes directly from disk. **From Step 1 onward**, serve the step folder over HTTP so ES modules load
correctly (`file://` blocks `type="module"`).

Every step’s **`getting-started.md`** has the exact commands for that week. The usual pattern:

**Install once** (requires Node.js) - optional if you prefer `npx`:

```bash
npm install -g http-server
```

**Run a step** (example - Step 1):

```bash
cd frontend
http-server . -o
```

That will open the static index.html in your browser. and that will have a quick access to any of the step-specific
pages for easy testing.

---

## A few friendly ground rules

- **Keep it to 30–45 minutes.** If you're not done, that's completely fine - pick it up next week or share what you
  have. The point is the learning, not the finish line.
- **No frameworks.** Each challenge uses plain HTML, CSS, and vanilla JavaScript only. This is intentional - it's how
  you build a solid understanding of the platform before layering abstractions on top.
- **Extras are optional.** Each step has a list of bonus tasks for those who finish early. They're there if you want
  them, not because you're expected to do them all.
- **Build on what you wrote.** Each step continues from the previous one. Keep your files week to week - by the end
  you'll have a working app you built yourself, piece by piece.
- **Share what you make.** A short screen recording or a CodePen link is always welcome. It's fun to see the same
  problem solved in different ways.

Happy coding!
