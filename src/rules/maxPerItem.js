import { BUSINESS } from '../data/business.js'

// Rule 1 (availability): at most 6 of any one dish per order, and never more than today's stock.
export function maxAllowed(stock) {
  return Math.max(0, Math.min(BUSINESS.maxPerItem, stock))
}

// `alreadyInCart` counts the same dish already in the cart (any size) on top of `quantity`.
export function checkItemQuantity({ quantity, stock, alreadyInCart = 0 }) {
  const max = maxAllowed(stock)
  if (stock <= 0) {
    return { ok: false, max, message: 'This dish is sold out today.' }
  }
  if (!Number.isInteger(quantity) || quantity < 1) {
    return { ok: false, max, message: `Enter a whole number from 1 to ${max}.` }
  }
  const total = quantity + alreadyInCart
  if (total > max) {
    const reason =
      stock < BUSINESS.maxPerItem
        ? `Only ${stock} left today.`
        : `You can order at most ${BUSINESS.maxPerItem} of one dish per order.`
    const extra = alreadyInCart > 0 ? ` You already have ${alreadyInCart} in your cart.` : ''
    return { ok: false, max, message: reason + extra }
  }
  return { ok: true, max, message: '' }
}
