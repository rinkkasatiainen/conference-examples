# Step 4 - Load from IndexedDB

In Steps 1–3 you built UI and **in-memory** flows. Refreshing the page dropped session state. In this step, you'll learn
the next step: how to **persist** the data in the browser using **IndexedDB**, while still building on top of the
_Events up, state down_ pattern

> **Before you start:** branch, HTTP server, **same origin** for IDB - see [getting-started.md](./getting-started.md).

**Testing companion (optional):** [Test step T-4 · IndexedDB](../test-4/README.md)

### Async / solo

Use [your Step 4 learning log](./learning-log.md), a short message to your facilitator or team, or a brief sync when the
README says “pair.” **Short timeboxes** matter more than the format.

---

## Learning goal

By the end of this step, you can:

- Open (or upgrade) an **IndexedDB** database with a `sessions` object store and **Promise**-based helpers.
- Describe **who reads/writes** session rows (`session-store.js`) vs **who only reacts** to signals
- Explain how `cfb-sessions-loaded-to-idb` triggers a **downward “poke”** via `data-latest-updated-at` so
  `cfb-schedule` **pulls fresh rows from IDB** instead of receiving a giant JSON blob from the orchestrator.
- Demonstrate how to compose components with clear data flow (using structured inputs, storage, parent-to-child
  rendering, etc.)

---

## 1) Connections

Do these **in order**; capture answers in [your Step 4 learning log](./learning-log.md).

1. **Solo, ~2 min - Refresh the page**  
   [Refresh the page](./learning-log.md#step-4-connections-refresh) *(revisit in Conclusions).*

2. **Solo, ~5 min - Orchestrator vs Step 3**  
   [Orchestrator from Step 3](./learning-log.md#step-4-connections-orchestrator-step3).

3. **Solo, ~3 min - Bridge from Step 3**  
   [Bridge from Step 3](./learning-log.md#step-4-bridge-step-3).

4. **Solo, ~2 min - Topic link**  
   [Topic link](./learning-log.md#step-4-topic-link): **A** or **B**.

---

## 2) Concepts

In this session, we'll explore **IndexedDB**, **storage vs UI**, and we continue to learn pub/sub with **events** going
up triggering actions/state down.

### IndexedDB in one paragraph

IndexedDB is a browser-based NoSQL database built into modern browsers that lets you store and retrieve structured
data (including files and blobs) on the client side. Unlike `localStorage` (which only stores strings and has a small
size limit), IndexedDB supports complex data types, indexes for fast querying, transactions for data integrity, and can
handle much larger amounts of data. It's asynchronous and event-driven (or Promise-based via wrappers like idb),
organized around **databases** containing **object stores** (similar to tables), where each record is identified by a
key. It's ideal for offline-capable web apps that need to persist significant structured data locally.

### IndexedDB and Atomic Design - how it all relates

In Atomic Design, of atoms, molecules and organisms, often the organisms are the ones that have the more complex
behavior. Storing data in IndexedDB is a good example of this (like is the 'Orchestrator' in Step 3). And with
organisms, there is often a risk for it to have more than one responsibility, making it easier to introduce accidental
complexity and thus making the flow more difficult to understand and maintain. To mitigate this risk, we introduce two
new components - and that will be a pattern we'll see more and more in the future.

### The Data flow with IndexedDB

### Events (`events.js`)

[`events.js`](./lib/events.js) is the **single place** for Step 4 event constants. As seen also earlier, this follows
the pattern of using event factories to create and agree on event shapes.

| Constant                | String                           | Typical use                                                               |
|-------------------------|----------------------------------|---------------------------------------------------------------------------|
| `SESSION_CREATED`       | `cfb-session-created`        | Re-exported from Step 3 - generator → store                               |
| `SESSION_REMOVED`       | `cfb-session-removed`        | Remove menu → store                                                       |
| `SESSION_LOADED_TO_IDB` | `cfb-sessions-loaded-to-idb` | Loader finished seeding **or** store finished mutating IDB → orchestrator |

Factories used in this step are: `cfbSessionsLoadedToIDB()`, `cfbSessionRemoved(...)`, plus *
*`cfbSessionCreated`** from Step 3.

### DOM layout (this repo)

The HTML DOM changes in this stepa a bit, see [`index.html`](./index.html). This time, we add a few components, one for
loading the data from IndexedDB on page load (`cfb-session-loader`), and another for making changes to the data in
IndexedDB (`cfb-session-store`). This is also seen below:

```html

<cfb-board-orchestrator>
    <cfb-session-loader></cfb-session-loader>
    <cfb-session-store>
        <cfb-session-generator></cfb-session-generator>
        <cfb-schedule class="listens-schedule-updates"></cfb-schedule>
    </cfb-session-store>
</cfb-board-orchestrator>
```

We added a `cfb-session-loader` to the dom, and wrapped the contents of board in step-3 with a `cfb-session-store`.
These two changes displays the pattern we'll get more and more used to in the future. The orchestrator is the 'main'
component that coordinates the main flow of data and events in the application in general, while the other two new
components are _organisms_ that take care of a bit smaller parts of the flow. (later, the `cfb-session-generator` will
not live inside the `cfb-session-store`)

The component hierarchies are crucial to understand the data flow - if behavior of the organism is to react to events,
the source element of the events must be directly descended from the organism. This is why `cfb-session-store` is
wrapping the _generator_ and _schedule_ components. That's because these components are the ones that trigger a change
in the IndexedDB (either create a random session, or delete a session).

The orchestrator remains the one component whose main responsibility remains to coordinate when the schedule should
update (without storing any data internally)

### Events Up, triggers Down

In step-3, we learned to use **pub/sub** to communicate between components. In that step, we learned the pattern of
_events up, state down_. Now we extend the pattern a bit more - in this step, we don't only push state down, but also
trigger actions down. How that works is that the _orchestrator_ triggers _Schedule_ to trigger a re-render when the data
changes.

A trigger often is a change in one of the observed attributes of the component. In this step, we use
`data-latest-updated-at` to trigger a re-render of the schedule. We do that instead of pushing the JSON array of
sessions from the orchestrator - and this is the pattern we'll see more and more in the future. This is another way
of sharing data between components without storing it internally, like in step-3.

`data-latest-updated-at` exists instead of pushing `data-sessions` JSON from the orchestrator because the
orchestrator **does not ship the array** - it only signals **“re-read from IDB”**; `cfb-schedule` pulls
`getAllSessions()` after the timestamp changes. This way the orchestrator does not even need to know about the shape
and structure of the data in the IndexedDB, it only needs to now the contract - "When this event happens, children
with these classnames should be informed that something has changed."

Session cards still render as `<cfb-session-card data-session-details='…'>` using `sessionDetails` shape from
[`../step-3/lib/builds-session-details.js`](../step-3/lib/builds-session-details.js). (in theory, this could also be
read
from IndexedDB, but that would be too big change for this step.)

The list of the events for this example are in [`events.js`](./lib/events.js) and explained below:

Legend:
- [ ]: ✅ This is already provided
- [ ]: 🚧 Partly done, part of this exercise
- [ ]: ✨ New features, core of the exercise

| Constant                | Typical use                                                                                          |
|-------------------------|------------------------------------------------------------------------------------------------------|
| `SESSION_LOADED_TO_IDB` | ✨ Informing the orchestrator that the IndexedDB is updated with latest data. Emitted by 2 components | 
| `SESSION_CREATED`       | ✅ Emitted when a random session is generated                                                         |
| `SESSION_REMOVED`       | ✅ Emitted when clicking 'remove' button on the menu card (this is new feature in this card)          |

### Storage vs UI (`session-store.js`)

Rule of thumb is: Component is has only one write operation (and optionally can dispatch events). A write operation is
either **saving** data to the storage, **re-rendering** the UI or making a **backend api call**. That means - a
component that renders UI, does not write anything to the storage. Hence, we need another component.

Also, it's useful to have a **single place** for the storage, in this case it's `session-store.js` (see below). This
is a library function that **wraps** the IndexedDB API, **providing** a **single place** for the storage that the other
components can use.

In this step, we implement few session store methods: `getAllSessions()`, `saveSessions()`, `deleteSession()`, etc.

### End-to-end flow (reference)

This flow has two interesting end-2-end flow. One on page (re)load, and another when a new session is created/or
existing removed. Both are defined below.

Legend:

- ✅ This is already provided
- 🚧 Partly done, part of this exercise
- ✨ New features, core of the exercise

**Initial load**

```
✅ index.js - registers custom elements on **page load**
    │
    ▼
✨ cfb-session-loader
    [connectedCallback: This mimics a call to backend to fetch data, and stores them to IndexedDB]
    On page load, seeds IndexedDB with SEED_SESSIONS, if IndexedDB is empty
           |
           ▼
          ✨ session-store.js ✨
          Stores data to session-store. 
    And dispatches an event saying 'all data is loaded into IndexedDB'
    |
    ▼
🚧 cfb-board-orchestrator
    listens to 'cfb-sessions-loaded-to-idb' (registered in connectedCallback)
    informs all children that have 'listens-schedule-updates' that 'now there is new data in IndexedDb'.
    !! Does not read IndexedDB / pass the data down - that will be done by the components directly.
    │  attribute change goes DOWN
    ▼
🚧 cfb-schedule
    observedAttributes → data-latest-updated-at
    → ✨ Reads data from IndexedDB 
    → ✅ re-renders session cards
```

For the flow of editing the sessions (adding or removing), see below.

```
✅ cfb-session-generator → cfb-session-created   ─┐
✅ cfb-session-card menu → cfb-session-removed   ─┤ 
                                                  │
✨ cfb-session-store                              │                         
    listens to both the events                    │
    → Updates IndexedDB                           │ 
    → Dispatches an event UP                      │
    │ bubbles UP                                  │
    ▼                                             │
                                                  │
🚧 cfb-board-orchestrator (same as initial load) ◄┘
    ... in the end updates 'data-latest-updated-at' on the cfb-schedule
```

---

### One-minute review (~1 min)

Complete [One-minute review](./learning-log.md#step-4-concepts-one-minute) in your learning log.

---

### Concept check - two parts

Do this in your [learning log](./learning-log.md):

1. **[Mini quiz](./learning-log.md#step-4-concept-quiz)** - three short questions *before* you lean only on copy-paste.

Then continue to **Concrete practice**.

---

## 3) Concrete practice

Now it's time to make the the board storing the data!
Work **in reading order** (matches [`index.html`](./index.html) comment block):

| File                                                          | Focus                                                                    |
|---------------------------------------------------------------|--------------------------------------------------------------------------|
| ✨ [`session-store.js`](./session-store.js)                    | implement IndexedDb functionality to save & retrieve sessions            |
| ✅ [`events.js`](./lib/events.js)                              | See how events are created & types made reusable                         |
| ✨ [`cfb-session-loader.js`](./cfb-session-loader.js)          | when attached to DOM, initializes store                                  |
| 🚧 [`cfb-board-orchestrator.js`](./cfb-board-orchestrator.js) | orchestrating the flow between events.                                   |
| 🚧 [`cfb-schedule.js`](./cfb-schedule.js)                     | `data-latest-updated-at` → `getAllSessions()` → render           |
| ✨ [`cfb-session-store.js`](./cfb-session-store.js)            | listens to 'session generated'/'session removed' and stores to indexedDB |

**Below is step-by-step guidance for each file.**

### ✨ `session-store.js` - Promise-based IDB wrapper

This is the main part of this exercise. The goal is to learn how to write an IndexedDB connection

- [ ] `openDb()` - open (or create) a database named `cfb-db` at version 1
- [ ] On `onupgradeneeded`: create a `sessions` object store keyed on `id`
- [ ] `saveSessions(sessions[])` - write (or overwrite) a batch of sessions
- [ ] `getAllSessions()` - return all sessions as an array

### 🚧 `cfb-session-loader.js` - Organism

- [ ] when attached to dom, seed the IndexedDB with initial data (if it has no data)
- [ ] Dispatches an event to inform that 'there is data in IndexedDB'

### 🚧 `cfb-board-orchestrator.js` - Organism

- [ ] when attached to dom, register event listeners
- [ ] listen to 'there is data in IndexedDB'
- [ ] informs the relevant children that 'btw, new data in IndexedDB'
    - Might use a `data-latest-updated-at` attribure with timestamp

### 🚧 `cfb-schedule.js` - Organism

- [ ] change listening from 'data-session-details' to 'data-latest-updated-at'
- [ ] read sessions from IDB, and re-render

### 🚧 `cfb-session-store.js` - Organism

- [ ] listen to 'session generated'/'session removed' events
- [ ] update (save or delete) data in IDB
- [ ] dispatch event 'cfbSessionsLoadedToIDB' for orchestrator to hear

### After building these, you can:

- [ ] Build a component that **loads** sessions from IDB on page load
- [ ] Add event listener for **adding a new session** to IDB.
- [ ] And seeing how this can be gradually added to the previous steps.

**Constraints**

- HTML, JavaScript, and CSS only - no frameworks.
- Aim for about **30–45 minutes** on the core challenge.

**Definition of done**

- You can point to `session-store.js` as the **only** module that calls `indexedDB.open` for sessions.
- You can explain `cfb-sessions-loaded-to-idb` vs `cfb-session-created` in one sentence each.

In [Question for your facilitator](./learning-log.md#step-4-facilitator-question), ask one question and capture the
answer.

---

## 4) Conclusions

In this step, you learned how to use IndexedDB to store data locally. Answer the following:

### 1) Quick check

Answer in [your learning log - Quick check](./learning-log.md#step-4-conclusions-quick-check).

### 2) Ticket out

Complete [Ticket out](./learning-log.md#step-4-conclusions-ticket-out): one best insight from this step + one
improvement idea for your next IDB practice.

### 3) Loop back

Update [Refresh the page](./learning-log.md#step-4-loop-back-refresh).

### 4) Key takeaway (journey hub)

Add **one or two sentences** in the [journey hub `learning-log.md`](../learning-log.md#step-4-key-takeaway).

---

### Demos / issues

- Share a short screen recording if you want feedback.
- If you get stuck, note it in your learning log or ping your facilitator.

---

## Tips

### Opening and versioning the database

```js
const req = indexedDB.open('cfb-db', 1)

req.onupgradeneeded = (e) => {
  const db = e.target.result
  if (!db.objectStoreNames.contains('sessions')) {
    db.createObjectStore('sessions', { keyPath: 'id' })
  }
}

req.onsuccess = (e) => {
  const db = e.target.result
  // use db here
}
```

`onupgradeneeded` only fires when the database does not exist yet (or the
version number increases). Your seed data goes here so it only runs once.

### Wrapping IDB in Promises

The raw IDB API is callback-based. Wrap each operation in a `Promise` to keep
your code readable:

```js
function getAllSessions() {
  return new Promise((resolve, reject) => {
    const req = db.transaction('sessions', 'readonly')
      .objectStore('sessions')
      .getAll()
    req.onsuccess = (e) => resolve(e.target.result)
    req.onerror = (e) => reject(e.target.error)
  })
}
```

### Session shape

[`sessionDetails`](../step-3/lib/builds-session-details.js) / Step 2 `data-session-details` JSON stay the **contract
** for cards.

---

## Extras

If you finish early:

- [ ] Ensure **every** new random session is **persisted** (trace `cfb-session-created` → store → IDB).
- [ ] Add `getSessionsByDay(day)` usage per column (index `by-day` already exists in `session-store.js`).
- [ ] Cursor / sorted `getAll` variants for title order.
- [ ] **Remove session path** *(wired in this repo)* - You can add a flow to remove session (see below)

### remove session

- Each session card has a `⋯` menu with a **Remove** button.
- Clicking it fires a `cfb-session-removed` event (defined in [events.js](./events.js)) that bubbles up to
  `<cfb-session-store>`.
- The store deletes the entry from IDB via `deleteSession(id)` (which you need to implement),
- and fires `cfb-sessions-loaded` the same path used for initial load and adding sessions.
- To see this working, refresh the page and the removed session stays gone.
- Key files: `cfb-session-card.js`, `events.js`, `cfb-session-store.js`, `session-store.js`

**Data flow:**

✅ cfb-menu (open menu)
│
▼
✅ cfb-session-card (press 'remove' button')
create new event
│ │
│ ▼
│ ✅ events.js
│ create the new event
▼
🚧 cfb-session-store
deletes session from session store
│ │
│ ▼
│ ✅ session-store
│ remove session from IndexedDB
And dispatches an event up the chain
▼
✅ cfb-board-orchestrator

---

### End result (skills you can demonstrate)

- **IndexedDB**: open, version, object store, `keyPath`, transactions, `getAll`
- **Promises** wrapping callback APIs
- **Separation**: `session-store.js` vs UI components
- **Signals**: `cfb-sessions-loaded-to-idb` + `data-latest-updated-at` refresh pattern
- `sessionDetails`-compatible rows end-to-end
