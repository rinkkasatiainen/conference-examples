// Layout shell for the conference
// conference header row. All visible content is slotted from outside:
//
//   <* slot="meta">     - conference title / location / date (e.g. cfb-schedule-meta)
//   <* slot="actions">  - optional controls; multiple nodes are supported

const SHADOW_CSS = `
    :host {
        display: block;
    }

    .cfb-schedule__header {
        display:               grid;
        grid-template-columns: 1fr auto;
        align-items:           center;
        gap:                   1rem;
    }

    .cfb-schedule__actions {
        display:     flex;
        flex-wrap:   wrap;
        gap:         0.5rem;
        justify-content: flex-end;
    }

    @media (max-width: 40rem) {
        .cfb-schedule__header {
            grid-template-columns: 1fr;
        }

        .cfb-schedule__actions {
            justify-content: stretch;
        }
    }
`

export class CfbHeader extends HTMLElement {
    static elementName = 'cfb-header'

    constructor() {
        super()
        const root = this.attachShadow({ mode: 'open' })
        root.innerHTML = `
            <style>${SHADOW_CSS}</style>
            <header class="cfb-schedule__header">
                <slot name="meta"></slot>
                <div class="cfb-schedule__actions">
                    <slot name="actions"></slot>
                </div>
            </header>
        `
    }
}
