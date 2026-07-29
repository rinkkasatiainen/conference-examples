// Form-associated custom element - session format as selectable tiles.
// Uses ElementInternals so the value joins FormData and participates in
// constraint validation (required + native reportValidity).

const OPTIONS = [
  { value: 'Talk',           label: 'Talk',           emoji: '💬' },
  { value: 'Workshop',       label: 'Workshop',       emoji: '🔧' },
  { value: 'Keynote',        label: 'Keynote',        emoji: '🎤' },
  { value: 'Lightning Talk', label: 'Lightning Talk', emoji: '⚡' },
]

const VALIDATION_MESSAGE = 'Please select a session format.'


export class CfbSessionFormat extends HTMLElement {
  static elementName = 'cfb-session-format'
  // TODO: This is your magic


  // Here is example of the styled component that has emojis for session formats
  #render() {
    this.innerHTML = `
            <div class="cfb-session-format__group" role="radiogroup" aria-label="Session format">
                ${OPTIONS.map(t => `
                    <button type="button" role="radio" class="cfb-session-format__tile"
                        data-value="${escapeAttr(t.value)}"
                        aria-checked="false"
                        tabindex="-1">
                        <span class="cfb-session-format__emoji" aria-hidden="true">${t.emoji}</span>
                        <span class="cfb-session-format__label">${t.label}</span>
                    </button>
                `).join('')}
            </div>
        `
  }
}
