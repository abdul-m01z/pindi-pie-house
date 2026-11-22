import { BUSINESS } from '../data/business.js'
import { checkOrderHours } from '../rules/orderHours.js'
import { formatMinutes } from '../lib/time.js'

// Tells the user up front whether the kitchen is taking orders (rule 2).
export default function KitchenStatus({ nowMinutes }) {
  const { ok } = checkOrderHours(nowMinutes)
  return (
    <p className={`kitchen-status kitchen-status--${ok ? 'open' : 'closed'}`}>
      <strong>{ok ? 'Kitchen open' : 'Kitchen closed'}</strong>: orders {formatMinutes(BUSINESS.openMinutes)} to{' '}
      {formatMinutes(BUSINESS.lastOrderMinutes)}. It is {formatMinutes(nowMinutes)} now.
    </p>
  )
}
