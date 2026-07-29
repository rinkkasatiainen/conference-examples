export function cleanup() {
  const root = document.getElementById('testRoot')
  if (root) root.remove()
}

/**
 * Mount live updates: start with empty event id, then set it so
 * attributeChangedCallback opens the WebSocket after both attrs exist.
 */
export async function mountLiveUpdates({ url = 'ws://localhost/ws', eventId = 'evt-a' } = {}) {
  const container = document.createElement('div')
  container.id = 'testRoot'
  container.innerHTML = `<cfb-live-session-updates data-url="${url}" data-event-id=""></cfb-live-session-updates>`
  document.body.appendChild(container)

  const el = container.firstElementChild
  await customElements.whenDefined('cfb-live-session-updates')

  el.setAttribute('data-event-id', eventId)
  await Promise.resolve()

  return el
}
