import { Link } from 'react-router-dom'
import FoodImage from '../components/FoodImage.jsx'
import QuantityControl from '../components/QuantityControl.jsx'
import OrderSummary from '../components/OrderSummary.jsx'
import FulfilmentPanel from '../components/FulfilmentPanel.jsx'
import IssueList from '../components/IssueList.jsx'
import KitchenStatus from '../components/KitchenStatus.jsx'
import ChangeNotice from '../components/ChangeNotice.jsx'
import StatusMessage from '../components/StatusMessage.jsx'
import { formatMoney } from '../lib/pricing.js'
import { itemQuantity } from '../lib/cart.js'

export default function CartPage({
  lines,
  cart,
  summary,
  itemCount,
  fulfilment,
  onFulfilmentChange,
  issues,
  nowMinutes,
  onSetQuantity,
  onRemove,
  onFixCart,
  fixMessages,
  notice,
  onUndo,
  onDismissNotice,
}) {
  if (lines.length === 0) {
    return (
      <>
        <h1>Your cart</h1>
        <StatusMessage
          kind="empty"
          title="Your cart is empty"
          action={
            <Link to="/menu" className="btn btn--primary">
              Browse the menu
            </Link>
          }
        >
          Pick a dish from the menu and it will appear here.
        </StatusMessage>
      </>
    )
  }

  const hasLineIssues = lines.some((l) => l.issues.length > 0)

  return (
    <>
      <h1>Your cart</h1>
      <KitchenStatus nowMinutes={nowMinutes} />
      {fixMessages.length > 0 && (
        <div className="status-message" role="status">
          <h2 className="status-message__title">We updated your cart</h2>
          <ul>
            {fixMessages.map((m) => (
              <li key={m}>{m}</li>
            ))}
          </ul>
        </div>
      )}
      <div className="cart-layout">
        <section aria-labelledby="items-heading">
          <h2 id="items-heading">Items</h2>
          <ul className="cart-lines">
            {lines.map((line) => (
              <li key={line.key} className="cart-line">
                {line.item ? (
                  <>
                    <FoodImage src={line.item.image} name={line.item.name} className="cart-line__image" />
                    <div className="cart-line__body">
                      <h3>
                        <Link to={`/menu/${line.item.id}`} className="touch-link">{line.item.name}</Link>
                      </h3>
                      <p className="muted">
                        {line.size.label} · {formatMoney(line.size.price * 100)} each
                      </p>
                      <QuantityControl
                        id={`qty-${line.key}`}
                        label={`Quantity of ${line.item.name} (${line.size.label})`}
                        value={line.quantity}
                        stock={line.item.stock}
                        alreadyInCart={itemQuantity(cart, line.item.id, line.key)}
                        onChange={(n) => onSetQuantity(line.key, n)}
                      />
                    </div>
                    <p className="cart-line__total">{formatMoney(line.total)}</p>
                  </>
                ) : (
                  <div className="cart-line__body">
                    <h3>Unknown dish</h3>
                  </div>
                )}
                {line.issues.map((message) => (
                  <p key={message} className="cart-line__issue" role="alert">
                    {message}
                  </p>
                ))}
                <button type="button" className="btn btn--secondary" onClick={() => onRemove(line.key)}>
                  Remove<span className="visually-hidden"> {line.item?.name ?? 'dish'}</span>
                </button>
              </li>
            ))}
          </ul>
          {hasLineIssues && (
            <button type="button" className="btn btn--primary" onClick={onFixCart}>
              Fix my cart automatically
            </button>
          )}
        </section>

        <aside>
          <FulfilmentPanel fulfilment={fulfilment} onChange={onFulfilmentChange} />
          <ChangeNotice notice={notice} onUndo={onUndo} onDismiss={onDismissNotice} />
          <OrderSummary summary={summary} mode={fulfilment.mode} itemCount={itemCount} />
          <IssueList issues={issues} id="cart-issues" />
          {issues.length === 0 ? (
            <Link to="/checkout" className="btn btn--primary btn--block">
              Go to checkout
            </Link>
          ) : (
            <button type="button" className="btn btn--primary btn--block" aria-disabled="true" aria-describedby="cart-issues">
              Go to checkout
            </button>
          )}
        </aside>
      </div>
    </>
  )
}
