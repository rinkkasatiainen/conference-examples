export class FakeWebSocket extends EventTarget {
  static last = null

  readyState = WebSocket.OPEN

  constructor(url) {
    super()
    this.url = url
    FakeWebSocket.last = this
  }

  receive(data) {
    this.dispatchEvent(new MessageEvent('message', { data: JSON.stringify(data) }))
  }

  close() {
    this.readyState = WebSocket.CLOSED
    this.dispatchEvent(new CloseEvent('close'))
  }
}
