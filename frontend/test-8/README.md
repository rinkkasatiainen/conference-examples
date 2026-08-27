# Test Step T-8: Live Updates · WebSocket Stub

**Build companion:** [Step 8](../step-8/README.md)

> **Before you start:** [getting-started.md](./getting-started.md) · [T-8 learning log](./learning-log.md)

Test `<cfb-live-session-updates>` without a real server: inject **`FakeWebSocket`** via `window.WebSocket`, push JSON
messages, assert on **`cfb-session-updated`** and **`cfb-session-removed`**.

---

## Learning goal

By the end of T-8 you can:

- Replace `window.WebSocket` with a test double that extends `EventTarget`
- Simulate server pushes with `MessageEvent`
- Assert socket cleanup in `disconnectedCallback`

---

## 1) Connections

In [your T-8 learning log](./learning-log.md):

1. [WebSocket guess](./learning-log.md#t-8-connections-guess) *(before Concepts)*
2. [Bridge from Step 8](./learning-log.md#t-8-connections-bridge)

---

## 2) Concepts

| Piece                         | Role                                                                         |
|-------------------------------|------------------------------------------------------------------------------|
| `<cfb-live-session-updates>`  | WebSocket client, parses messages, dispatches DOM events                    |
| `<cfb-session-store-updates>` | Listens for session events, writes IDB (test in integration / Step 8 extras) |
| Orchestrator                  | Same `data-latest-updated-at` pull signal after store updates                |

T-7 faked the **network** with MSW, intercepting HTTP at the request boundary. A live socket is a different beast: a
long-lived, bidirectional connection opened by a **constructor** - `new WebSocket(url)`. Here the cleanest double is
to replace that constructor with a small fake that `extends EventTarget` - a genuine test double, not a global
monkey-patch - so the component's `new WebSocket(url)` receives your fake and you drive the "server" by hand. (MSW
also has a WebSocket API; a constructor-swapped `EventTarget` fake stays simpler for a focused unit test.)

### Replace a constructor, not a function

```js
let OriginalWebSocket
beforeEach(() => {
  OriginalWebSocket = window.WebSocket
  window.WebSocket = FakeWebSocket        // extends EventTarget, records the instance as .last
  FakeWebSocket.last = null
})
afterEach(() => {
  window.WebSocket = OriginalWebSocket
})
```

`FakeWebSocket` extends `EventTarget` so it can dispatch `message`/`open`/`close` events just like the real thing, and
it exposes the instance the component created (`FakeWebSocket.last`) plus the `url` it was opened with. First
assertion: the component opened the **right URL**, including the `eventId`.

### Simulate a server push

There is no server, so the test *is* the server. Push a message and assert the DOM events the component re-dispatches:

```js
FakeWebSocket.last.receive({ type: 'sessionUpdated', session })  // -> cfb-session-updated
FakeWebSocket.last.receive({ type: 'sessionRemoved', sessionId }) // -> cfb-session-removed
FakeWebSocket.last.receive({ type: 'ping' })                      // unknown -> nothing dispatched
```

The component's job is translation - socket message in, DOM event out - so you assert the **event out**, never the
parsing in between. (Events up, exactly as since T-3.)

### Test the cleanup - leaked sockets

A live connection that outlives its element is a real bug. `disconnectedCallback` must close the socket, and that is
testable: remove the element, assert the socket closed.

```js
el.remove()
expect(socket.readyState).to.equal(WebSocket.CLOSED)
```

This closes the lifecycle-cleanup thread that has been a `todo` since T-3 (`stops responding after
disconnectedCallback`) - here it finally has teeth.

Complete [Myth or fact](./learning-log.md#t-8-concepts-myth-fact) and the
[one-minute review](./learning-log.md#t-8-concepts-one-minute).

See **[tips.md](./tips.md)** for mount helper and URL shape.

---

## 3) Concrete practice

```bash
cd frontend/test-8
npm install
npm test          # or: npm run test:watch
```

### Read the test list, then make it green

`test/cfb-live-session-updates.test.js` ships as a `todo(...)` list; the `window.WebSocket` swap hooks and
`mountLiveUpdates()` are already there. Read a `todo`, promote it into a real `it(...)`, drive it green, move on.

- [ ] Opens the socket to the configured URL (incl. `eventId`).
- [ ] `sessionUpdated` message -> `cfb-session-updated`; `sessionRemoved` -> `cfb-session-removed`.
- [ ] An unknown message type dispatches nothing.
- [ ] `disconnectedCallback` closes the socket (no leak).

### Read for reference

- [ ] `test/helpers/fake-websocket.js` - the test double itself. Read how a small class extending `EventTarget`, with
  a `receive()` method, stands in for a whole server.

## Constraints

- Assert **observable output**: the dispatched DOM events and `socket.readyState`. Never the parsing in between.
- Restore `window.WebSocket` in `afterEach`.
- Max **30 minutes**.

See **[tips.md](./tips.md)**.

---

## 4) Conclusions

1. [Loop back: WebSocket guess](./learning-log.md#t-8-loop-back-guess)
2. [Ticket out](./learning-log.md#t-8-conclusions-ticket-out)
3. Hub takeaway → [`learning-log-test.md`](../learning-log-test.md#t-8-key-takeaway)

---

## Extras

- [ ] Assert `dataset.state` transitions (`connecting` → `open` → `closed`)
- [ ] Test reconnect when `data-event-id` changes
- [ ] Wire fake socket + store-updates + orchestrator in one integration test

---

### End result

- Global constructor replacement for async browser APIs
- Event-level assertions matching Step 8 `lib/events.js`
- Cleanup tests that catch leaked WebSockets
