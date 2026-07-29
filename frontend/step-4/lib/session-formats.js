const SESSION_FORMAT_CLASS = new Map([
  ['Talk', 'cfb-card__session-format--talk'],
  ['Workshop', 'cfb-card__session-format--workshop'],
  ['Keynote', 'cfb-card__session-format--keynote'],
  ['Lightning Talk', 'cfb-card__session-format--lightning-talk'],
])

export default function getSessionFormatClass(type) {
  return SESSION_FORMAT_CLASS.get(type) ?? 'cfb-card__session-format--unknown'
}
