import { cfbSessionRemoved } from './lib/events.js'
import getSessionFormatClass from './lib/session-formats.js'

function escapeAttr(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/"/g, '&quot;')
}

// The change from step 2:
//   - The hamburger menu is now a custom element, and the card now has a dropdown menu.
//   - Clicking on the 'Remove' button dispatches a custom event.'
export class CfbSessionCard extends HTMLElement {
  static elementName = 'cfb-session-card'
  static definedAttributes = { details: 'data-session-details' }

  #sessionDetails = null

  static get observedAttributes() {
    return [CfbSessionCard.definedAttributes.details]
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (newValue === oldValue) {
      return
    }

    if (name === CfbSessionCard.definedAttributes.details) {
      this.#sessionDetails = JSON.parse(newValue)
      this.#render(this.#sessionDetails)
    }
  }

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

    this.innerHTML =
      `<article class="${articleClasses}"${articleAria} role="article">
        <header class="cfb-card__header">
          <span class="cfb-card__title"${titleAriaHidden}><span class="cfb-card__title-text">${sessionDetails.title}</span></span>
          <cfb-menu>
            <button class="cfb-card__dropdown-item" role="menuitem" data-action="edit">Edit</button>
            <button class="cfb-card__dropdown-item cfb-card__dropdown-item--danger" role="menuitem" data-action="remove">Remove</button>
          </cfb-menu>
        </header>
        <!-- ATOM: tags row -->
        <div class="cfb-card__tags">
          ${tags.join('')}
        </div>
        <footer>
          <div class="cfb-avatars" aria-label="Attendees">
            ${avatars.join('')}
          </div>
        </footer>
      </article>`

    if (hasSessionFormat) {
      // OMG this is nice.
      this.querySelector('article.cfb-card').style.setProperty(
        '--cfb-session-format-suffix',
        JSON.stringify(` (${sessionFormat})`),
      )
    }

    this.querySelector('[data-action="remove"]').addEventListener('click', () => {
      this.dispatchEvent(cfbSessionRemoved(this.#sessionDetails.id))
    })
  }

  #removeSession = (evt) => {
    this.dispatchEvent(cfbSessionRemoved(this.#sessionDetails.id))
  }
}
