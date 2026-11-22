import { describeStock } from '../lib/availability.js'

export default function AvailabilityBadge({ stock }) {
  const { label, tone } = describeStock(stock)
  return <span className={`badge badge--${tone}`}>{label}</span>
}
