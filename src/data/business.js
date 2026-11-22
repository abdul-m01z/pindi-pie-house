// Business facts and the numbers used by the three operating rules.
export const BUSINESS = {
  name: 'Pindi Pie House',
  tagline: 'Hand-stretched pizza for Islamabad and Rawalpindi students.',
  maxPerItem: 6, // Rule 1: availability
  openMinutes: 12 * 60, // Rule 2: orders accepted from 12:00 PM...
  lastOrderMinutes: 23 * 60 + 30, // ...until 11:30 PM (inclusive)
  minDeliveryOrderPkr: 800, // Rule 3: minimum subtotal for delivery
}
