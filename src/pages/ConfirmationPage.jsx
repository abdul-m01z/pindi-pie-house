import { Link } from 'react-router-dom'
import OrderSummary from '../components/OrderSummary.jsx'
import StatusMessage from '../components/StatusMessage.jsx'
import { formatMoney } from '../lib/pricing.js'

export default function ConfirmationPage({ order }) {
  if (!order) {
    return (
      <>
        <h1>Order confirmation</h1>
        <StatusMessage
          kind="empty"
          title="No recent order"
          action={
            <Link to="/menu" className="btn btn--primary">
              Start an order
            </Link>
          }
        >
          There is no order to show. Confirmations are not saved, so refreshing this page clears it.
        </StatusMessage>
      </>
    )
  }
  return (
    <>
      <h1>Thank you, {order.customerName}</h1>
      <div className="status-message status-message--success" role="status">
        <h2 className="status-message__title">Order {order.id} received (simulated)</h2>
        <p>
          {order.mode === 'delivery'
            ? `Delivery to ${order.address}, ${order.areaName}.`
            : `Pickup at ${order.pickupPoint}.`}{' '}
          Nothing was charged and nothing will be delivered: this is a demonstration.
        </p>
        <p>Payment choice: {order.paymentLabel}</p>
      </div>
      <h2>What you ordered</h2>
      <ul className="summary-items">
        {order.items.map((i) => (
          <li key={i.key}>
            {i.quantity} × {i.name} ({i.sizeLabel}): {formatMoney(i.total)}
          </li>
        ))}
      </ul>
      <OrderSummary summary={order.summary} mode={order.mode} itemCount={order.itemCount} />
      <Link to="/menu" className="btn btn--primary">
        Order something else
      </Link>
    </>
  )
}
