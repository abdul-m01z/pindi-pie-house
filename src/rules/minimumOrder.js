import { BUSINESS } from '../data/business.js'
import { formatMoney } from '../lib/pricing.js'

// Rule 3 (fulfilment): delivery needs at least PKR 800 of food (before GST and delivery fee).
// Pickup has no minimum. Amounts are in paisa so the boundary is exact.
export function checkMinimumOrder(subtotalPaisa, mode, minimumPkr = BUSINESS.minDeliveryOrderPkr) {
  if (mode !== 'delivery') return { ok: true, minimum: 0, shortfall: 0, message: '' }
  const minimum = minimumPkr * 100
  const shortfall = Math.max(0, minimum - subtotalPaisa)
  return {
    ok: shortfall === 0,
    minimum,
    shortfall,
    message:
      shortfall === 0
        ? ''
        : `Delivery needs at least ${formatMoney(minimum)} of food. Add ${formatMoney(shortfall)} more, or switch to pickup.`,
  }
}
