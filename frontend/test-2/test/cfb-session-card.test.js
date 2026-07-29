import { CfbSessionCard } from '../../step-2/cfb-session-card.js'
import { sessionWith } from './helpers/session-builder.js'

customElements.define(CfbSessionCard.elementName, CfbSessionCard)

// This small helper function might be useful. Use it, or delete it.
const sessionHtml = (session = sessionWith()) =>
  `<cfb-session-card data-session-details='${JSON.stringify(session)}'></cfb-session-card>`

describe('<cfb-session-card>', () => {
  // TODO: Add your tests here.
})
