# Tips

## Implementing BackendApi

To implement backend API, you might want to have a few helper methods for sending POST/PUT/DELETE calls and one for GET.

An example of the easiest way to do it is to use `fetch` API:

```javascript
async function fetchJson(path) {
  const res = await fetch(`${path}`)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}

async function sendJson(method, path, payload) {
  const res = await fetch(`${path}`, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!res.ok) throw new Error(`${method} failed: HTTP ${res.status}`)
}
```

Now these methods can be used in the BackendApi class: 
```javascript
getSchedule(eventId) {
  return fetchJson(`/api/schedule/${eventId}`)
}
```

## Stable orchestrator listeners

```js
#onLoaderDone = (e) => { /* … */
}

connectedCallback()
{
  this.addEventListener('scheduleLoaded', this.#onLoaderDone)
  this.addEventListener('sessionsLoaded', this.#onLoaderDone)
}

disconnectedCallback()
{
  this.removeEventListener('scheduleLoaded', this.#onLoaderDone)
  this.removeEventListener('sessionsLoaded', this.#onLoaderDone)
}
```

## Dispatch pattern (loaders)

```js
this.dispatchEvent(new CustomEvent('sessionsLoaded', {
  bubbles: true,
  composed: true,
  detail: { eventId, updatedAt: Date.now() },
}))
```

### HTML shell (core trio)

```html

<cfb-board-orchestrator>
    <cfb-schedule-loader data-event-id="codefreeze-2025"></cfb-schedule-loader>
    <cfb-session-loader data-event-id="codefreeze-2025"></cfb-session-loader>
    <cfb-schedule
            data-event-id="codefreeze-2025"
            class="listens-schedule-updates">
    </cfb-schedule>
</cfb-board-orchestrator>
```

This repo adds **header**, **updates** wrapper, and **loader status** UI around that idea - see [
`index.html`](./index.html).

---
