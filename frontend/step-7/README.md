# Step 7 - Load from Backend · `fetch`

In earlier steps the board got data from **generators**, **forms**, and **IndexedDB** seeds. Real products would get the
data from a backend call by loading **schedule metadata** and **sessions** over **HTTP**, persist them somewhere, then
render in the page.

In this step the frontend makes a **`fetch`** call to the backend (here via a thin
**[`lib/api/backend-api.js`](./lib/api/backend-api.js)** helper), saves the data to **IDB**, and signals the existence of
data with **bubbling `CustomEvent`s**. This is a natural next step in making the board more production-like.

This build step talks to the **real `step-7-be` backend**. Intercepting `fetch` with a mock service worker (MSW) is a
**testing-track** concern — you meet it in [`test-7`](../test-7/README.md), not here.

**Before you start:** branch, HTTP server from **`frontend/`**, **`step-7-be`** running ->
see [getting-started.md](./getting-started.md).

**Testing companion (optional):** [Test step T-7 · fetch stubbing](../test-7/README.md)

### Async / solo

Use [your Step 7 learning log](./learning-log.md), a short note to your facilitator, or a sync when the README says
“compare.” **Timeboxes** beat polish.

---

## Learning goal

By the end of this step, you can:

- Explain how the frontend makes a **`fetch`** call to backend and saves the data to **IDB**.
- Demonstrate a clear split of responsibility between _loading data_ and _tracking what needs to be updated_
- Build a **realistic** **orchestrator** that **coordinates** and **tracks** multiple async sources and only then
  updates the UI.

---

## 1) Connections

Do these **in order**; capture answers in [your Step 7 learning log](./learning-log.md).

1. **Solo, ~2 min - Think → ink (first fetch)**  
   [First fetch](./learning-log.md#step-7-connections-first-fetch) *(revisit
   in [Loop back](./learning-log.md#step-7-loop-back-first-fetch)).*

2. **Solo, ~4 min - Bridge from Step 4–6**  
   [Bridge from Step 4–6](./learning-log.md#step-7-bridge-step-4-6).

3. **Optional pair / async, ~3 min**  
   [Surprise / compare](./learning-log.md#step-7-connections-surprise).

4. **Solo, ~2 min - Topic link**  
   [Topic link](./learning-log.md#step-7-topic-link): answer **A** or **B**.

---

## 2) Concepts

### `fetch` and errors

when fetching data from backend, there are 2 things to await for: first the fetch, then the JSON parsing.

- First check that the fetch was successful.
- Then parse the JSON.

Centralising **`fetch`** in **`backend-api.js`** keeps URLs, **`baseUrl`**, and JSON parsing in **one** place;
loaders call **`getBackendApi().getSchedule(eventId)`** / **`getSessions(eventId)`** so they stay small. This is
also useful because the backendApi can be initialized with baseUrl etc. only once.

The way the `backend-api.js` is implemented is that it returns a singleton object - a single backendApi instance for
anyone who's using the api. This way the backend can be configured only once with base url, necessary headers, etc. This
is a very useful pattern in modern frontend development. Also - this makes it easy to mock the backend in tests, but
that's a topic of 'test-7'.

In this step, your job is also to implement the `backend-api.js`, but if you wish, in [tips.md](./tips.md), there is an
example of how to implement it with a real HTTP call.

### Loader vs schedule

This is following already established patterns in earlier steps. We split the responsibility of loading data from
displaying it. And because the loaders and schedule are not descendants, we use an orchestrator to coordinate the two.
This also shows another great benefit of pub/sub in the frontend: retrieving data & displaying it is **two**
different tasks, and they do not need to know of the existence of the other. Having an orchestrator to coordinate the
flow just works. See [index.html](./index.html)

Later, in Step-8, we will split these responsibilities even further, but for now we keep this simpler.

```html

<cfb-board-orchestrator>
    <div class="loader-status">
        <cfb-schedule-loader data-event-id="codefreeze-2025"></cfb-schedule-loader>
        <cfb-session-loader class="listens-session-reloads" data-event-id="codefreeze-2025"></cfb-session-loader>
    </div>
    <!--[...omitted for brevity]-->
    <!-- Not using cfb-session-store here, but a element that interacts with backend -->
    <cfb-updates-sessions class="listens-event-changes" data-event-id="codefreeze-2025">
        <cfb-add-session-form></cfb-add-session-form>
        <cfb-schedule class="listens-schedule-updates" data-event-id="codefreeze-2025">
        </cfb-schedule>
    </cfb-updates-sessions>
</cfb-board-orchestrator>
```

| Piece                                                    | Responsibility                                                         |
|----------------------------------------------------------|------------------------------------------------------------------------|
| ✨ [`<cfb-schedule-loader>`](./cfb-schedule-loader.js)    | make an HTTP call, write to IDB, dispatch event on success             |
| ✨ [`<cfb-session-loader>`](./cfb-session-loader.js)      | make an HTTP call, write to IDB, dispatch event on success             |
| ✅ [`<cfb-schedule>`](../step-4/cfb-schedule.js) (Step-4) | same as before - isn't it beautiful that these changes have no effect? |

### Events up, state down - retrieving the data from Backend to the UI

we see the same structure as in Step-3, in the pub/sub pattern.

The two loader classes dispatch **`cfb-schedule-loaded`** and **`cfb-sessions-loaded`** events, which the `CfbBoardOrchestrator`
listens to. Once both events are received, it informs the `CfbSchedule` component that it can render the schedule. It
does it similarly as in Step-4, informing the Schedule that 'new data exists in IndexedDB'.

The change from step-4 is that now the Orchestrator is listening different events, and has a bit more responsibility -
to also inform the correct parties of any change in the data.

### End-to-end flow (reference)

Legend:

- [ ] ✨ implement these
- [ ] 🚧 Partially done
- [ ] ✅ These are done already

```
User opens page
        │
        ▼
        ├─────────── in parallel ───────────┐
        ⎪                                   ⎪ 
        ▼.                                  ▼
✨ cfb-schedule-loader          ✨ cfb-session-loader
   → getBackendApi().getSchedule   → getBackendApi().getSessions
   → schedule-store (IDB)          → session-store (IDB)
   → dispatch cfb-schedule-loaded       → dispatch cfb-sessions-loaded
        │                                   │
        └──────────── bubbles ──────────────┘
                          ▼
🚧 cfb-board-orchestrator
   when both received for same eventId
   → set data-latest-updated-at on .listens-schedule-updates
                          ⎪  
                          ▼
✅ cfb-schedule
   attributeChangedCallback → read IDB → render <cfb-session-card>…
```

### Updating session information using backend calls

This is the most complex part of the UI, but it follows the pub/sub pattern we have been seeing so far.

In step-4, the data lived only in the IndexedDB. Now, data lives in the backend, and there are specific new component
that updates data to IndexedDB. That's why the `CfbSessionStore` is no longer needed, but is replaced by a new
`CfbUpdatesSessions` component.

The responsibility of the said component is to provide the behavior of CrUD operations on the session (add, update and
remove sessions). It does that by listening to `EventTypes.SESSION_CREATED`, `EventTypes.SESSION_UPDATED` and
`EventTypes.SESSION_REMOVED` events that the child components dispatch. When these events are received, the component
will make the appropriate backend calls to add/update/remove the sessions.

Because the data is shown in the UI from the IndexedDB, making the call to backend does not change the visible UI. This
is by design. Next thing to do is to:

1. update the IndexedDB with the new data and then
2. inform the UI that the data has changed.

The second part is already implemented by the `CfbBoardOrchestrator` and how it updates the schedule when the data is in
the IndexedDB.

One way to integrate into this flow is to make sure that once a successful backend call to modify the sessions is done,
some component will:

1. fetch the latest data from the backend
2. store it in the IndexedDB
3. inform the `CfbBoardOrchestrator` that the data has changed. (using `cfb-sessions-loaded` event)

This looks a lot like the responsibility of `CfbSessionLoader` component, right? So - how would we implement this,
looking at the HTML structure:

```html

<cfb-board-orchestrator>
    <!-- unnecessary components omitted for brevity -->
    <cfb-session-loader class="listens-session-reloads" data-event-id="codefreeze-2025"></cfb-session-loader>
    <cfb-updates-sessions class="listens-event-changes" data-event-id="codefreeze-2025">
        <!-- omitted for brevity -->
    </cfb-updates-sessions>
</cfb-board-orchestrator>
```

There is no way for `CfbUpdatesSessions` to inform `CfbSessionLoader` that it should fetch the latest data from the
backend (well, technically it can, but that would be a bit of a hack and would tie the implementation details too
closely to the `CfbSessionLoader` component). So, the way we solve this is by having the orchestrator to listen to the
relevant event from the `CfbUpdatesSessions` component and triggering an action in the `CfbSessionLoader` component that
then would retrieve the latest data from the backend and do the behavior that is part of that said component.

In Step-8, we'll revisit this problem by introducing WebSockets - and then we'll solve it in a more elegant way. (And we
remove this way of 'implicit fetch' from the UI). Also, if you think that `CfbSessionLoader` is having too many
responsibilities, I'd be with you on your assessment. This, too, is somethign we'll revisit in Step-8.

---

### One-minute review (~1 min)

Complete [One-minute review](./learning-log.md#step-7---concepts-one-minute-review) in your learning log.

---

### Concept check

Do **two** short activities in your [learning log](./learning-log.md).

1. **Mini quiz** - [Mini quiz](./learning-log.md#step-7---concept-check-mini-quiz): answer from memory first.
2. **Flow sketch** - [Flow sketch](./learning-log.md#step-7---concept-check-flow-sketch-visual): boxes + arrow labels.

When both are done, move on to **Concrete practice**.

---

## 3) Concrete practice

### Files to read (and trace or implement)

| File                                                                                                                          | Role                                                                                                |
|-------------------------------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------|
| [`cfb-schedule-loader.js`](./cfb-schedule-loader.js)                                                                          | Schedule **`fetch`** path, IDB write, **`cfb-schedule-loaded`** / **`cfb-loader-error`**                      |
| [`cfb-session-loader.js`](./cfb-session-loader.js)                                                                            | Sessions **`fetch`** path, **`data-reload-token`**, **`cfb-sessions-loaded`**                            |
| [`cfb-board-orchestrator.js`](./cfb-board-orchestrator.js)                                                                    | Waits for loader events; sets **`data-latest-updated-at`**; extension: **`cfb-sessions-backend-updated`** |
| [`../step-4/cfb-schedule.js`](../step-4/cfb-schedule.js)                                                                      | **`data-latest-updated-at`** → pull sessions from IDB → render                                      |
| [`lib/api/backend-api.js`](./lib/api/backend-api.js)                                                                          | **`fetch`** + **`res.ok`** + JSON                                                                   |
| [`lib/store/session-store.js`](./lib/store/session-store.js) / [`lib/store/schedule-store.js`](./lib/store/schedule-store.js) | Persistence helpers loaders call                                                                    |
| [`mocks/handlers.js`](./mocks/handlers.js)                                                                                    | _Optional_ MSW handlers — testing-track material (see `test-7`)                                                  |
| [`index.js`](./index.js)                                                                                                      | **`configureBackendApi`**, optional **`worker.start()`**, element registration                      |
| [`index.html`](./index.html)                                                                                                  | Loader markup, **`.listens-schedule-updates`**, event switcher buttons                              |

This folder ships as a **reference implementation** - your job is to **understand and demo** the pipeline, then adapt or
rebuild in your own branch if your facilitator assigns implementation from scratch.

**Build / trace until you can show:**

- [ ] Swapping **`data-event-id`** (buttons in [`index.html`](./index.html)) triggers **two** parallel loads and ends
  with an updated board for that event.
- [ ] You can name the **two** success event types the orchestrator waits for and the **attribute** it sets on the
  schedule.
- [ ] You can point to **where** **`fetch`** is called and **where** the backend base URL is configured (two different files).
- [ ] With **`res.ok === false`**, the loader surfaces an **error** state and dispatches **`cfb-loader-error`** (trace in [
  `cfb-session-loader.js`](./cfb-session-loader.js)).

**Constraints**

- HTML, JavaScript, and CSS only - **no** frameworks inside the custom elements.
- **`step-7-be`** is the backend for this step; mocking `fetch` (MSW) is left to the **testing track**.
- Target about **45 minutes** for core tracing + log activities.

**Definition of done**

- You can draw the flow from **`fetch`** to **cards** without peeking.
- You complete [Question for your facilitator](./learning-log.md#step-7-concrete-facilitator-question) with one genuine
  question.

---

## 4) Conclusions

### 1) Quick check

Answer in [your learning log - Quick check](./learning-log.md#step-7-conclusions-quick-check).

### 2) Loop back

Update [First fetch](./learning-log.md#step-7-loop-back-first-fetch).

### 3) PLAN prompts

- [Mocks live at the edge, not inside components](./learning-log.md#step-7-conclusions-msw-benefit)
- [True / False - coordination](./learning-log.md#step-7-conclusions-tf-coordination)
- [True / False - mocks removed](./learning-log.md#step-7-conclusions-tf-mocks-removed)

### 4) Key takeaway (journey hub)

Add **one or two sentences** in the [journey hub `learning-log.md`](../learning-log.md#step-7-key-takeaway).

---

### Demos / issues

- Share a short screen recording (event switcher + Network panel) if you want feedback.
- If you get stuck, note it in your learning log or ping your facilitator.

---

## Extras

If you finish early:

- [ ] Add **`<cfb-loader-status>`** driven only by **`cfb-schedule-loaded`** / **`cfb-sessions-loaded`** / **`cfb-loader-error`** - no
  direct imports of loader classes.
- [ ] Cache **`updatedAt`** in IDB and **skip** **`fetch`** when data is fresher than **60** seconds.

> The MSW-based extras (return **500** from a handler, `passthrough` one `eventId`, prove **`cfb-loader-error`**
> surfaces) live in the **testing track** — see [`test-7`](../test-7/README.md).

---

### End result (skills you can demonstrate)

- **`fetch`**, **`res.ok`**, and **`try`/`catch`** around network + JSON
- **Loader** vs **display** component split
- **`CustomEvent`** bubbling as a **completion** signal
- **Orchestrator** coordinating **multiple async** sources without cross-imports
- **`attributeChangedCallback`** as a **pull** trigger from IDB
- The **backend** (real, or a mock in tests) at the **edge**, not inside feature components
