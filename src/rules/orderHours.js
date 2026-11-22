import { BUSINESS } from '../data/business.js'
import { formatMinutes } from '../lib/time.js'

// Rule 2 (time): orders are accepted from 12:00 PM until 11:30 PM, both times included.
export function checkOrderHours(minutes, open = BUSINESS.openMinutes, last = BUSINESS.lastOrderMinutes) {
  const ok = minutes >= open && minutes <= last
  return {
    ok,
    message: ok
      ? ''
      : `The kitchen is closed. We take orders from ${formatMinutes(open)} to ${formatMinutes(last)}.`,
  }
}
