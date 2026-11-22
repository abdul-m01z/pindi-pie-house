import { findArea } from '../data/areas.js'
import { calculateSummary, formatMoney } from './pricing.js'
import { checkMinimumOrder } from '../rules/minimumOrder.js'

// Plain-language list of what changed when the user switches delivery/pickup or the area.
// The cart is never emptied by this change, so the first line tells the user their items are safe.
export function describeFulfilmentChange({ subtotal, itemCount, previous, next }) {
  const before = calculateSummary(subtotal, previous.mode)
  const after = calculateSummary(subtotal, next.mode)
  const lines = []

  if (previous.mode !== next.mode) {
    lines.push(next.mode === 'pickup' ? 'Switched to pickup.' : 'Switched to delivery.')
  } else if (previous.areaId !== next.areaId) {
    const area = findArea(next.areaId)
    lines.push(`Delivery area changed to ${area ? area.name : 'none'}.`)
  }
  lines.push(`Your ${itemCount} ${itemCount === 1 ? 'item was' : 'items were'} kept in the cart.`)

  if (before.deliveryFee !== after.deliveryFee) {
    lines.push(
      after.deliveryFee === 0
        ? `The ${formatMoney(before.deliveryFee)} delivery fee was removed.`
        : `A ${formatMoney(after.deliveryFee)} delivery fee was added.`,
    )
  }
  lines.push(
    before.total === after.total
      ? 'The total did not change.'
      : `Total changed from ${formatMoney(before.total)} to ${formatMoney(after.total)}.`,
  )
  const minimum = checkMinimumOrder(subtotal, next.mode)
  if (!minimum.ok) lines.push(minimum.message)
  return lines
}
