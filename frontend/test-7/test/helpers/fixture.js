export async function fixture(html) {
  const container = document.createElement('div')
  container.id = 'testRoot'
  container.innerHTML = html
  document.body.appendChild(container)
  const el = container.firstElementChild
  if (el?.localName.includes('-')) {
    await customElements.whenDefined(el.localName)
  }
  return el
}

export function cleanup() {
  const root = document.getElementById('testRoot')
  if (root) root.remove()
}

/**
 * Mount html and wait for the named event to bubble from the fixture root.
 * Listener is registered before innerHTML so async loader events are not missed.
 */
export async function fixtureAndWaitFor(html, eventType) {
  const container = document.createElement('div')
  container.id = 'testRoot'

  const eventPromise = new Promise((resolve) => {
    container.addEventListener(eventType, (e) => resolve(e), { once: true })
  })

  container.innerHTML = html
  document.body.appendChild(container)

  const el = container.firstElementChild
  if (el?.localName.includes('-')) {
    await customElements.whenDefined(el.localName)
  }

  const event = await eventPromise
  return { el, event }
}

export function dropDb(name) {
  return new Promise((resolve, reject) => {
    const req = indexedDB.deleteDatabase(name)
    req.onsuccess = resolve
    req.onerror = (e) => reject(e.target.error)
  })
}
