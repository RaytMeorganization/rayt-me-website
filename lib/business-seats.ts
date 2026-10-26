/** Business is a team plan: checkout and seat pickers never go below this many employees. */
export const BUSINESS_MIN_SEATS = 3
export const BUSINESS_MAX_SEATS = 10000

export function clampBusinessSeats(value: number): number {
  const n = Math.floor(Number(value) || BUSINESS_MIN_SEATS)
  return Math.max(BUSINESS_MIN_SEATS, Math.min(BUSINESS_MAX_SEATS, n))
}
