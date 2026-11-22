import { maxAllowed, checkItemQuantity } from '../rules/maxPerItem.js'

// The cart is a plain array of { itemId, sizeId, quantity }. Every function returns a new array.
export const lineKey = (itemId, sizeId) => `${itemId}:${sizeId}`
const keyOf = (line) => lineKey(line.itemId, line.sizeId)

export function addToCart(cart, itemId, sizeId, quantity) {
  const key = lineKey(itemId, sizeId)
  if (cart.some((line) => keyOf(line) === key)) {
    return cart.map((line) =>
      keyOf(line) === key ? { ...line, quantity: line.quantity + quantity } : line,
    )
  }
  return [...cart, { itemId, sizeId, quantity }]
}

export function setQuantity(cart, key, quantity) {
  if (quantity <= 0) return removeLine(cart, key)
  return cart.map((line) => (keyOf(line) === key ? { ...line, quantity } : line))
}

export const removeLine = (cart, key) => cart.filter((line) => keyOf(line) !== key)

// Quantity of one dish across all sizes, optionally leaving out one line.
export function itemQuantity(cart, itemId, exceptKey = null) {
  return cart
    .filter((line) => line.itemId === itemId && keyOf(line) !== exceptKey)
    .reduce((sum, line) => sum + line.quantity, 0)
}

export const cartCount = (cart) => cart.reduce((sum, line) => sum + line.quantity, 0)

// Joins cart lines with current menu data and finds conflicts (removed or sold-out dishes,
// quantities above today's stock or the per-order limit). Used for fresh and restored carts.
export function resolveCart(cart, menu) {
  const totals = {}
  for (const line of cart) totals[line.itemId] = (totals[line.itemId] ?? 0) + line.quantity

  return cart.map((line) => {
    const item = menu.find((m) => m.id === line.itemId) ?? null
    const size = item?.sizes.find((s) => s.id === line.sizeId) ?? null
    const key = keyOf(line)
    if (!item || !size) {
      return {
        key,
        item: null,
        size: null,
        quantity: line.quantity,
        total: 0,
        issues: ['This dish is no longer on the menu.'],
      }
    }
    const issues = []
    const rule = checkItemQuantity({ quantity: totals[item.id], stock: item.stock })
    if (!rule.ok) issues.push(`${item.name}: ${rule.message}`)
    return { key, item, size, quantity: line.quantity, total: size.price * 100 * line.quantity, issues }
  })
}

export const cartSubtotal = (lines) => lines.reduce((sum, line) => sum + line.total, 0)

// Repairs a cart: removes missing or sold-out dishes and lowers quantities to what is allowed.
// Returns the new cart and a plain-language list of what changed.
export function fixCart(cart, menu) {
  const used = {}
  const changes = []
  const fixed = []
  for (const line of cart) {
    const item = menu.find((m) => m.id === line.itemId)
    const size = item?.sizes.find((s) => s.id === line.sizeId)
    if (!item || !size) {
      changes.push('Removed a dish that is no longer on the menu.')
      continue
    }
    const room = maxAllowed(item.stock) - (used[item.id] ?? 0)
    const quantity = Math.min(line.quantity, Math.max(room, 0))
    if (quantity <= 0) {
      changes.push(`Removed ${item.name} (${size.label}): ${item.stock <= 0 ? 'sold out today' : 'no more can be ordered'}.`)
      continue
    }
    if (quantity < line.quantity) {
      changes.push(`Lowered ${item.name} (${size.label}) from ${line.quantity} to ${quantity}.`)
    }
    used[item.id] = (used[item.id] ?? 0) + quantity
    fixed.push({ ...line, quantity })
  }
  return { cart: fixed, changes }
}
