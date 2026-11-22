import { Link } from 'react-router-dom'
import FulfilmentPanel from './FulfilmentPanel.jsx'
import ChangeNotice from './ChangeNotice.jsx'
import { findArea } from '../data/areas.js'
import { BUSINESS } from '../data/business.js'
import { DELIVERY_FEE_PKR, GST_PERCENT, formatMoney } from '../lib/pricing.js'

// Shown on the menu and details pages so fees, minimum and tax are known before the cart.
export default function OrderBar({ fulfilment, summary, itemCount, onFulfilmentChange, notice, onUndo, onDismissNotice }) {
  const area = findArea(fulfilment.areaId)
  const delivery = fulfilment.mode === 'delivery'
  return (
    <section className="order-bar" aria-label="Your order settings">
      <p className="order-bar__line">
        <strong>{delivery ? (area ? `Delivery to ${area.name}` : 'Delivery: area not chosen yet') : 'Pickup'}</strong>
        {delivery
          ? ` · fee PKR ${DELIVERY_FEE_PKR} · food minimum PKR ${BUSINESS.minDeliveryOrderPkr}`
          : ' · no fee, no minimum'}{' '}
        · prices exclude {GST_PERCENT}% GST
      </p>
      {itemCount > 0 && (
        <p className="order-bar__line">
          Cart: {itemCount} {itemCount === 1 ? 'item' : 'items'}, total so far{' '}
          <strong>{formatMoney(summary.total)}</strong> including fee and GST.{' '}
          <Link to="/cart" className="touch-link">View cart</Link>
        </p>
      )}
      <ChangeNotice notice={notice} onUndo={onUndo} onDismiss={onDismissNotice} />
      <details className="order-bar__change">
        <summary>Change delivery, pickup or area</summary>
        <FulfilmentPanel fulfilment={fulfilment} onChange={onFulfilmentChange} idPrefix="bar" />
      </details>
    </section>
  )
}
