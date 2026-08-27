# T-8 tips: WebSocket stub

## FakeWebSocket

Replace `window.WebSocket` in `beforeEach` and restore in `afterEach`. Keep `FakeWebSocket.last` pointing at the most recent instance so tests can call `.receive({ type, ... })`.

## Mount helper

Step 8 `connectedCallback` calls `#connect()` before `#wsBaseUrl` is set. In tests, use `mountLiveUpdates()` which sets `data-url` and `data-event-id` **after** the element is connected so `attributeChangedCallback` opens the socket.

## URL shape

The component connects to:

```
${data-url}/${encodeURIComponent(data-event-id)}
```

Example: `ws://localhost/ws/evt-a`

## Events to assert

From `step-8/lib/events.js`:

- `sessionUpdated` message → `cfb-session-updated` (`EventTypes.SESSION_UPDATED`)
- `sessionRemoved` message → `cfb-session-removed` (`EventTypes.SESSION_REMOVED`)

The live component does **not** dispatch `sessionsLoaded`, downstream store components handle IDB writes.

## Cleanup test

Remove the element from the DOM and assert `FakeWebSocket.last.readyState === WebSocket.CLOSED`.
