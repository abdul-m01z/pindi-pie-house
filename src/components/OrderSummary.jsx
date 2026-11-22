import { formatMoney, formatSigned, GST_PERCENT } from '../lib/pricing.js'

// Full price breakdown. Every row is shown, so the total can be checked by adding the rows.
export default function OrderSummary({ summary, mode, itemCount }) {
  return (
    <section className="summary" aria-labelledby="summary-heading">
      <h2 id="summary-heading">Order summary</h2>
      <dl className="summary__rows">
        <div>
          <dt>Food ({itemCount} {itemCount === 1 ? 'item' : 'items'})</dt>
          <dd>{formatMoney(summary.subtotal)}</dd>
        </div>
        <div>
          <dt>Delivery fee</dt>
          <dd>{mode === 'delivery' ? formatMoney(summary.deliveryFee) : 'None (pickup)'}</dd>
        </div>
        <div>
          <dt>GST ({GST_PERCENT}% of food and delivery)</dt>
          <dd>{formatMoney(summary.gst)}</dd>
        </div>
        <div>
          <dt>Rounding to whole rupees</dt>
          <dd>{formatSigned(summary.rounding)}</dd>
        </div>
        <div className="summary__total">
          <dt>Total to pay</dt>
          <dd>{formatMoney(summary.total)}</dd>
        </div>
      </dl>
    </section>
  )
}
