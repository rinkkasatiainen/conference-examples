export async function fixture(html) {
  const container = document.createElement('div')
  container.id = 'testRoot'
  container.innerHTML = html
  document.body.appendChild(container)
  return container.firstElementChild
}

export function cleanup() {
  const root = document.getElementById('testRoot')
  if (root) root.remove()
}
