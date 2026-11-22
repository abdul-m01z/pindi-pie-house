import { useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import OrderSummary from '../components/OrderSummary.jsx'
import IssueList from '../components/IssueList.jsx'
import KitchenStatus from '../components/KitchenStatus.jsx'
import StatusMessage from '../components/StatusMessage.jsx'
import { findArea } from '../data/areas.js'
import { PICKUP_POINT } from '../data/areas.js'
import { NOTES_MAX, validateCheckout, validateName, validatePhone, validateAddress, validateNotes } from '../lib/validation.js'

const EMPTY = { name: '', phone: '', address: '', notes: '', payment: 'cash' }
const VALIDATORS = { name: validateName, phone: validatePhone, address: validateAddress, notes: validateNotes }

export default function CheckoutPage({ lines, summary, itemCount, fulfilment, issues, nowMinutes, onPlaceOrder }) {
  const navigate = useNavigate()
  const formRef = useRef(null)
  const [values, setValues] = useState(EMPTY) // kept when errors appear: valid input is never cleared
  const [touched, setTouched] = useState({})
  const [submitIssues, setSubmitIssues] = useState([])
  const [submitted, setSubmitted] = useState(false)

  if (lines.length === 0) {
    return (
      <>
        <h1>Checkout</h1>
        <StatusMessage
          kind="empty"
          title="Your cart is empty"
          action={
            <Link to="/menu" className="btn btn--primary">
              Browse the menu
            </Link>
          }
        >
          Add something to your cart before checking out.
        </StatusMessage>
      </>
    )
  }

  const delivery = fulfilment.mode === 'delivery'
  const area = findArea(fulfilment.areaId)
  const errors = validateCheckout(values, fulfilment.mode)
  const visibleError = (name) => (touched[name] || submitted ? errors[name] : '')

  function setField(name, value) {
    setValues((prev) => ({ ...prev, [name]: value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    setSubmitted(true)
    const names = Object.keys(errors)
    if (names.length > 0) {
      formRef.current?.querySelector(`[name="${names[0]}"]`)?.focus()
      return
    }
    const result = onPlaceOrder(values)
    if (result.ok) navigate('/confirmation')
    else setSubmitIssues(result.issues)
  }

  function renderField({ name, label, hint, ...inputProps }) {
    const error = visibleError(name)
    const inputId = `field-${name}`
    return (
      <div className={`field${error ? ' field--invalid' : ''}`}>
        <label htmlFor={inputId}>{label}</label>
        {hint && (
          <p className="field__hint" id={`${inputId}-hint`}>
            {hint}
          </p>
        )}
        <input
          id={inputId}
          name={name}
          value={values[name]}
          aria-invalid={error ? true : undefined}
          aria-describedby={[hint && `${inputId}-hint`, error && `${inputId}-error`].filter(Boolean).join(' ') || undefined}
          onChange={(e) => setField(name, e.target.value)}
          onBlur={() => setTouched((t) => ({ ...t, [name]: true }))}
          {...inputProps}
        />
        {error && (
          <p className="field__error" id={`${inputId}-error`}>
            {error}
          </p>
        )}
      </div>
    )
  }

  const allIssues = [...issues, ...submitIssues.filter((s) => !issues.some((i) => i.id === s.id))]
  const errorList = Object.entries(errors)

  return (
    <>
      <h1>Checkout</h1>
      <p className="sim-note">Simulated order: nothing is charged, cooked or delivered. Use made-up details only.</p>
      <KitchenStatus nowMinutes={nowMinutes} />
      <div className="cart-layout">
        <form ref={formRef} onSubmit={handleSubmit} noValidate aria-label="Checkout details">
          {submitted && errorList.length > 0 && (
            <div className="issue-list" role="alert">
              <h3>Please fix {errorList.length} {errorList.length === 1 ? 'field' : 'fields'}</h3>
              <ul>
                {errorList.map(([name, message]) => (
                  <li key={name}>{message}</li>
                ))}
              </ul>
            </div>
          )}
          <h2>Your details</h2>
          {renderField({ name: 'name', label: 'Full name (required)', type: 'text', autoComplete: 'name' })}
          {renderField({
            name: 'phone',
            label: 'Mobile number (required)',
            hint: 'Example: 0300 1234567',
            type: 'tel',
            inputMode: 'numeric',
            autoComplete: 'tel',
          })}
          {delivery ? (
            <>
              <p>
                <strong>Delivering to:</strong> {area ? `${area.name}, ${area.city}` : 'no area chosen'}{' '}
                <Link to="/cart">Change</Link>
              </p>
              {renderField({
                name: 'address',
                label: 'House, street or landmark (required)',
                type: 'text',
                autoComplete: 'street-address',
              })}
            </>
          ) : (
            <p>
              <strong>Pickup at:</strong> {PICKUP_POINT.name} <Link to="/cart">Change</Link>
            </p>
          )}
          <div className={`field${visibleError('notes') ? ' field--invalid' : ''}`}>
            <label htmlFor="field-notes">Notes for the kitchen (optional)</label>
            <textarea
              id="field-notes"
              name="notes"
              rows={3}
              value={values.notes}
              aria-describedby="field-notes-count"
              onChange={(e) => setField('notes', e.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, notes: true }))}
            />
            <p id="field-notes-count" className={visibleError('notes') ? 'field__error' : 'field__hint'}>
              {visibleError('notes') || `${values.notes.length} of ${NOTES_MAX} characters`}
            </p>
          </div>
          <fieldset className="panel">
            <legend>Payment (simulated)</legend>
            <label className="size-option">
              <input type="radio" name="payment" checked={values.payment === 'cash'} onChange={() => setField('payment', 'cash')} />
              <span>{delivery ? 'Cash on delivery' : 'Pay at the counter'}</span>
            </label>
            <label className="size-option">
              <input type="radio" name="payment" checked={values.payment === 'card'} onChange={() => setField('payment', 'card')} />
              <span>Card (simulated, no card details are collected)</span>
            </label>
          </fieldset>

          <IssueList issues={allIssues} id="checkout-issues" />
          <button type="submit" className="btn btn--primary btn--block" disabled={allIssues.length > 0} aria-describedby={allIssues.length ? 'checkout-issues' : undefined}>
            Place simulated order
          </button>
        </form>
        <aside>
          <OrderSummary summary={summary} mode={fulfilment.mode} itemCount={itemCount} />
          <ul className="summary-items">
            {lines.map((l) => (
              <li key={l.key}>
                {l.quantity} × {l.item?.name} ({l.size?.label})
              </li>
            ))}
          </ul>
          <Link to="/cart">Edit cart</Link>
        </aside>
      </div>
    </>
  )
}
