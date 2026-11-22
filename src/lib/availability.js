export const LOW_STOCK_AT = 5

// Text label for stock level. The tone is only a styling hint, the text carries the meaning.
export function describeStock(stock) {
  if (stock <= 0) return { label: 'Sold out today', tone: 'out' }
  if (stock <= LOW_STOCK_AT) return { label: `Only ${stock} left today`, tone: 'low' }
  return { label: 'Available', tone: 'ok' }
}
