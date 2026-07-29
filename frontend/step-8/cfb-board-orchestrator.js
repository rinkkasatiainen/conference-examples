export class CfbBoardOrchestrator extends HTMLElement {
  static elementName = 'cfb-board-orchestrator'

  /** @type {Set<string>} */
  #loaded = new Set()
  #currentEventId = null

  connectedCallback() {
    this.addEventListener('cfb-schedule-loaded', this.#onLoaderDone)
    this.addEventListener('cfb-sessions-loaded', this.#onLoaderDone)
    this.addEventListener('cfb-sessions-backend-updated', this.#onSessionsBackendUpdated)
  }

  disconnectedCallback() {
    this.removeEventListener('cfb-schedule-loaded', this.#onLoaderDone)
    this.removeEventListener('cfb-sessions-loaded', this.#onLoaderDone)
    this.removeEventListener('cfb-sessions-backend-updated', this.#onSessionsBackendUpdated)
  }

  #onLoaderDone = (e) => {
    const { eventId, updatedAt } = e.detail

    this.#notifyEventListeners(eventId)

    if (eventId !== this.#currentEventId) {
      this.#loaded.clear()
      this.#currentEventId = eventId
    }

    this.#loaded.add(e.type)

    if (this.#loaded.has('cfb-schedule-loaded') && this.#loaded.has('cfb-sessions-loaded')) {
      this.#notifyScheduleOnly(eventId, updatedAt)
      this.#loaded.clear()
      return
    }

    if (e.type === 'cfb-sessions-loaded' && this.#currentEventId === eventId) {
      this.#notifyScheduleOnly(eventId, updatedAt)
    }
  }

  #notifyEventListeners(eventId) {
    this.querySelectorAll('.listens-event-changes').forEach((el) => {
      el.dataset.eventId = eventId
    })
  }

  #onSessionsBackendUpdated = (e) => {
    const { eventId, updatedAt } = e.detail
    console.log('cfb-sessions-backend-updated', eventId, updatedAt)
    console.log('this could show a toast or something')
  }

  #notifyScheduleOnly(eventId, updatedAt) {
    this.querySelectorAll('.listens-schedule-updates').forEach((el) => {
      el.dataset.eventId = eventId
      el.setAttribute('data-latest-updated-at', String(updatedAt))
    })
  }
}
