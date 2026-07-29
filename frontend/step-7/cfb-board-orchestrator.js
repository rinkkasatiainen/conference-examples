import { EventTypes as CfbEventTypes } from './lib/events.js'

export class CfbBoardOrchestrator extends HTMLElement {

  connectedCallback() {
    this.addEventListener('cfb-schedule-loaded', this.#onLoaderDone)
    this.addEventListener('cfb-sessions-loaded', this.#onLoaderDone)
    // TODO: Add an event listener that reacts to the fact that sessions have been updated in the backend
  }

  disconnectedCallback() {
    this.removeEventListener('cfb-schedule-loaded', this.#onLoaderDone)
    this.removeEventListener('cfb-sessions-loaded', this.#onLoaderDone)
    // TODO: remove the said event listener
  }

  #onLoaderDone = (e) => {
    // TODO: When both loaders have succeeded, we can update the UI.

    // Use the familiar pattern of triggering an action in a child component ('.listens-schedule-updates')
  }

  #onSessionUpdated = (e) => {
    // TODO: when session data is updated in the backend, we need to update the UI.

    // Now the backend has updated a session, we need to refresh the UI.
    // And that should make the UI to fetch the latest session data - now for simplicity could
    // retrieve all the sessions through cfb-session-loader.
    // To do that, use the familiar pattern of triggering an action in a child component
  }
}
