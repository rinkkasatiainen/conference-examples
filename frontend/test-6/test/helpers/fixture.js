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
