import test from 'node:test'
import assert from 'node:assert/strict'
import { checkMinimumOrder } from '../src/rules/minimumOrder.js'

// Amounts are paisa: PKR 800 = 80000. The same function runs in the cart and checkout screens.
test('delivery order above the minimum is accepted', () => {
  const result = checkMinimumOrder(120000, 'delivery') // PKR 1,200
  assert.equal(result.ok, true)
  assert.equal(result.shortfall, 0)
  assert.equal(result.message, '')
})

test('delivery order of exactly PKR 800 is accepted', () => {
  const result = checkMinimumOrder(80000, 'delivery')
  assert.equal(result.ok, true)
  assert.equal(result.shortfall, 0)
})

test('delivery order of PKR 799 is rejected with the amount still needed', () => {
  const result = checkMinimumOrder(79900, 'delivery')
  assert.equal(result.ok, false)
  assert.equal(result.shortfall, 100) // PKR 1.00 short
  assert.match(result.message, /PKR 1\.00 more/)
})

test('pickup has no minimum', () => {
  assert.equal(checkMinimumOrder(10000, 'pickup').ok, true)
})
