import { cfbSessionRemoved } from './lib/events.js'
import getSessionFormatClass from '../step-4/lib/session-formats.js'

// Single responsibility: know about sessions.
// The flip animation lives in <cfb-flip-card>.
// The edit form lives in <cfb-edit-session-form>.
// This card just wires them together.
function escapeAttr(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/"/g, '&quot;')
}

export class CfbSessionCard extends HTMLElement {
  static elementName = 'cfb-session-card'
  static definedAttributes = { details: 'data-session-details' }

  #sessionDetails = null

  static get observedAttributes() {
    return [CfbSessionCard.definedAttributes.details]
  }

  connectedCallback() {
    // ✨ TODO: add event listeners here for Editing etc.
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (newValue === oldValue) return
    if (name === CfbSessionCard.definedAttributes.details) {
      this.#sessionDetails = JSON.parse(newValue)
      this.#render(this.#sessionDetails)
    }

    this.querySelectorAll('[data-action="remove"]').forEach(
      it => it.addEventListener('click', this.#removeSession)//.bind(this))
    )
  }

  disconnectedCallback() {
    // ✨ TODO: remove event listeners here for Editing etc.
  }

  // ── Render ────────────────────────────────────────────────────

  #render(sessionDetails) {
    this.querySelectorAll('[data-action="remove"]').forEach(
      it => it.removeEventListener('click', this.#removeSession.bind(this))
    )

    const tags = sessionDetails.tags
      .map(tag => `<cfb-tag data-label="${tag.label}" data-color="${tag.color}"></cfb-tag>`)

    const avatars = sessionDetails.attendees
      .map(attendee => `<div class="cfb-avatar" aria-label="${attendee.name}">${attendee.initials}</div>`)

    const sessionFormat = sessionDetails.sessionFormat?.trim() ?? ''
    const hasSessionFormat = Boolean(sessionFormat)
    const articleClasses = [
      'cfb-card',
      hasSessionFormat && 'cfb-card--session-format',
      getSessionFormatClass(sessionFormat)
    ].filter(Boolean).join(' ')

    const articleAria = hasSessionFormat
      ? ` aria-label="${escapeAttr(`${sessionDetails.title}. Session format: ${sessionFormat}.`)}"`
      : ''

    const titleAriaHidden = hasSessionFormat ? ' aria-hidden="true"' : ''

    this.innerHTML = `
    <cfb-flip-card>
      <article slot="front" class="${articleClasses}" ${articleAria} role="article">
        <header class="cfb-card__header">
          <span class="cfb-card__title"${titleAriaHidden}><span class="cfb-card__title-text">${sessionDetails.title}</span></span>
          <cfb-menu>
            <button class="cfb-card__dropdown-item" role="menuitem" data-action="edit">Edit</button>
            <button class="cfb-card__dropdown-item cfb-card__dropdown-item--danger" role="menuitem" data-action="remove">Remove</button>
          </cfb-menu>
        </header>
        <div class="cfb-card__tags"> ${tags.join('')} </div>
        <footer>
          <div class="cfb-avatars" aria-label="Attendees"> ${avatars.join('')} </div>
        </footer>
      </article>
      
      <cfb-edit-session-form slot="back"></cfb-edit-session-form>
    </cfb-flip-card>`

    this.querySelector('[data-action="edit"]').addEventListener('click', () => {
      // ✨ Populate the `cfb-edit-session-form` with the current session details.`
      // [ Code Here ]
      this.querySelector('cfb-flip-card').flip()
    })

    this.querySelector('[data-action="remove"]').addEventListener('click', () => {
      this.dispatchEvent(cfbSessionRemoved(this.#sessionDetails.id))
    })
  }

  #removeSession = (evt) => {
    this.dispatchEvent(cfbSessionRemoved(this.#sessionDetails.id))
  }

  // ── Edit outcome handlers ─────────────────────────────────────

  #onEditSaved = (evt) => {
    // ✨ if saved, unflitp, and then dispatch the `evt`
    this.querySelector('cfb-flip-card').unflip(() => {
      // ✨ reset the form here --> Implement a `reset()` method on the form element.
      // [ Code Here ]
      this.dispatchEvent(evt.detail.sessionUpdatedEvent)
    })
  }

  #onEditCancelled = () => {
    // ✨ if edit cancelled, just reset the form after unflipping.
    this.querySelector('cfb-flip-card').unflip(() => {
      // ✨ reset the form here --> Implement a `reset()` method on the form element.
      // [ Code Here ]
    })
  }
}
