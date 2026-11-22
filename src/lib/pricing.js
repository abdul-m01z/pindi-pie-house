// All money maths uses integer paisa (1 PKR = 100 paisa) so totals always add up exactly.
export const DELIVERY_FEE_PKR = 120
export const GST_PERCENT = 15

export const toPaisa = (rupees) => Math.round(rupees * 100)

// Format paisa as "PKR 1,952.70". Always two decimals so every amount looks the same.
export function formatMoney(paisa) {
  const rupees = (paisa / 100).toLocaleString('en-PK', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
  return `PKR ${rupees}`
}

// Price breakdown for a basket. GST applies to items plus delivery fee.
// `rounding` is the visible adjustment that turns the exact total into whole rupees.
export function calculateSummary(subtotalPaisa, mode) {
  const deliveryFee = mode === 'delivery' && subtotalPaisa > 0 ? toPaisa(DELIVERY_FEE_PKR) : 0
  const gst = Math.round(((subtotalPaisa + deliveryFee) * GST_PERCENT) / 100)
  const exactTotal = subtotalPaisa + deliveryFee + gst
  const total = Math.round(exactTotal / 100) * 100
  return {
    subtotal: subtotalPaisa,
    deliveryFee,
    gst,
    rounding: total - exactTotal,
    total,
  }
}

// GST-inclusive price for a single price in rupees, used on the details page.
export function priceWithGst(rupees) {
  const net = toPaisa(rupees)
  const gst = Math.round((net * GST_PERCENT) / 100)
  return { net, gst, gross: net + gst }
}

// Signed amount for the rounding line, e.g. "+PKR 0.30" or "−PKR 0.20".
export function formatSigned(paisa) {
  const sign = paisa < 0 ? '−' : '+'
  return `${sign}${formatMoney(Math.abs(paisa))}`
}
