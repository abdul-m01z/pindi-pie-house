import { AREAS } from '../data/areas.js'
import { DELIVERY_FEE_PKR } from '../lib/pricing.js'

// First version: plain radio buttons and an area list.
export default function FulfilmentPanel({ fulfilment, onChange }) {
  const served = AREAS.filter((a) => a.served)
  return (
    <fieldset className="panel">
      <legend>How do you want your order?</legend>
      <label className="size-option">
        <input
          type="radio"
          name="mode"
          checked={fulfilment.mode === 'delivery'}
          onChange={() => onChange({ ...fulfilment, mode: 'delivery' })}
        />
        <span>Delivery (PKR {DELIVERY_FEE_PKR} fee)</span>
      </label>
      <label className="size-option">
        <input
          type="radio"
          name="mode"
          checked={fulfilment.mode === 'pickup'}
          onChange={() => onChange({ ...fulfilment, mode: 'pickup' })}
        />
        <span>Pickup (no fee)</span>
      </label>
      {fulfilment.mode === 'delivery' && (
        <div className="field">
          <label htmlFor="area">Delivery area</label>
          <select
            id="area"
            value={fulfilment.areaId ?? ''}
            onChange={(e) => onChange({ ...fulfilment, areaId: e.target.value || null })}
          >
            <option value="">Choose an area</option>
            {served.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name}, {a.city}
              </option>
            ))}
          </select>
        </div>
      )}
    </fieldset>
  )
}
