/** Lagos landmarks used for the generated route name on the end card. */
export const LANDMARKS = [
  'Ojuelegba',
  'Mile 2',
  'Yaba',
  'Ikeja',
  'Surulere',
  'Agege',
  'Maryland',
  'Ketu',
  'Victoria Island',
  'Apapa',
  'Mushin',
  'Ikorodu',
  'Computer Village',
  'Ajegunle',
  'Abule Egba',
  'Oshodi',
  'Bariga',
  'Isale Eko',
  'Ojota',
  'Satellite Town',
]

/**
 * Route name for the end card. Longer runs start further "east" and end
 * further "north", so the route reads like a real Lagos journey.
 */
export function routeFor(distanceUnits: number): string {
  const startIndex = Math.floor(distanceUnits * 1.7) % LANDMARKS.length
  const span = 2 + Math.min(7, Math.floor(distanceUnits * 0.9))
  const endIndex = (startIndex + span) % LANDMARKS.length
  return `${LANDMARKS[startIndex]} → ${LANDMARKS[endIndex]}`
}

/** Earnings tiers. */
export function titleFor(cash: number): string {
  if (cash >= 9000) return 'Oga at the Top'
  if (cash >= 6000) return 'Mile 2 Legend'
  if (cash >= 3800) return 'Ojuelegba Operator'
  if (cash >= 2000) return "Agbero's Accountant"
  if (cash >= 900) return 'Danfo Graduate'
  return 'Danfo Intern'
}

export function formatNaira(value: number): string {
  return `₦${Math.max(0, Math.round(value)).toLocaleString('en-NG')}`
}
