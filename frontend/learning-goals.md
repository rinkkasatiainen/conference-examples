# Why should I take this challenge?

Below is a summary of the learning goals of each of the steps.

## Step 0 - The Static Board

### Learning Outcome (visible/measurable)
- Explain semantic HTML with Atomic design hierarchy used in the upcoming practices.
- Document personal learning goals for the journey.
- Make a git branch, and publish that on the chosen repository.

## Step 1 - `<cfb-tag>` · Basic Web Component

### Learning Outcome (visible/measurable)
- Build your first custom HTML element.
- Demonstrate how to see the behavior in the browser.

## Step 2 - `<cfb-session-card>` · Composite Component

### 1) Learning Outcome (visible/measurable)
- Build a composite component that builds semantic HTML.
- Show composition by rendering one or more `<cfb-tag>` elements inside the card.
- Demonstrate rendering from structured data.

## Step 3 - `<cfb-board-orchestrator>` · Pub/Sub

### 1) Learning Outcome (visible/measurable)
- Build a flow of event from child to parents
- Demonstrate pub/sub of listeners from parent to child (without parent knowing of the child)

## Step 4 - Load from IndexedDB

### 1) Learning Outcome (visible/measurable)
- Build your first IndexedDB-backed session store (`cfb-db`) and persist session records.
- Demonstrate how data coupling can be removed from organism
- Demonstrate the use branches of siblings (loader does not need to wrap store, etc)
- etc.
- sessions rendered from IndexedDB data instead of hardcoded arrays.
- Demonstrate board refresh triggered by a data-update signal.

## Step 5 - Add a Session · HTML Form Elements

### 1) Learning Outcome (visible/measurable)
- Build a custom element form that creates valid session objects.
- Show native browser validation blocking invalid submissions.

## Step 6 - `<cfb-session-type>` · Custom Form Element

### 1) Learning Outcome (visible/measurable)
- Build a form-associated `<cfb-session-type>` control using `ElementInternals`.
- Show selected value included in `FormData` from parent forms.
- Demonstrate required validation behavior equivalent to native form controls.

## Step 7 - Load from Backend · `fetch` + MSW

### 1) Learning Outcome (visible/measurable)
- Build loaders that fetch schedule/session data and store it in IndexedDB.
- Show the orchestrator waits for both loader completion signals before refreshing schedule.
- Demonstrate the same component code working with mocked API responses (MSW).

## Step 8 - Live Updates · WebSocket + MSW

### 1) Learning Outcome (visible/measurable)
- Build a live updates component that receives pushed session updates.
- Show incoming updates persisted to IndexedDB and reflected in the schedule.
- Demonstrate real-time refresh without polling.
