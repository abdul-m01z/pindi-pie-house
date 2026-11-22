import { checkOrderHours } from '../rules/orderHours.js'
import { checkMinimumOrder } from '../rules/minimumOrder.js'

// Everything that stops an order from being placed, in the order the user should fix it.
export function getBlockingIssues({ lines, subtotal, mode, areaId, nowMinutes }) {
  if (lines.length === 0) return [{ id: 'empty', message: 'Your cart is empty.' }]
  const issues = []
  const hours = checkOrderHours(nowMinutes)
  if (!hours.ok) issues.push({ id: 'hours', message: hours.message })
  for (const line of lines) {
    line.issues.forEach((message, i) => issues.push({ id: `line-${line.key}-${i}`, message }))
  }
  if (mode === 'delivery' && !areaId) {
    issues.push({ id: 'area', message: 'Choose a delivery area, or switch to pickup.' })
  }
  const minimum = checkMinimumOrder(subtotal, mode)
  if (!minimum.ok) issues.push({ id: 'minimum', message: minimum.message })
  return issues
}
