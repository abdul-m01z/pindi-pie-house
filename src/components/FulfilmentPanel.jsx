import { useState } from 'react'
import { AREAS, PICKUP_POINT, findArea } from '../data/areas.js'
import { BUSINESS } from '../data/business.js'
import { DELIVERY_FEE_PKR } from '../lib/pricing.js'

// Choose delivery or pickup, and a delivery area from a searchable list.
// Picking a served area applies at once (no extra confirm button). Picking an area we do not serve
// explains why and offers the nearest served areas or pickup, instead of a dead end.
export default function FulfilmentPanel({ fulfilment, onChange, idPrefix = 'fp' }) {
  const [search, setSearch] = useState('')
  const [unservedId, setUnservedId] = useState(null)

  const needle = search.trim().toLowerCase()
  const matches = AREAS.filter((a) => `${a.name} ${a.city}`.toLowerCase().includes(needle))
  const current = findArea(fulfilment.areaId)
  const unserved = findArea(unservedId)

  function chooseArea(area) {
    if (area.served) {
      setUnservedId(null)
      onChange({ ...fulfilment, areaId: area.id })
    } else {
      setUnservedId(area.id)
    }
  }

  function chooseMode(mode) {
    setUnservedId(null)
    onChange({ ...fulfilment, mode })
  }

  return (
    <section className="panel" aria-labelledby={`${idPrefix}-heading`}>
      <h2 id={`${idPrefix}-heading`}>Delivery or pickup</h2>
      <fieldset className="mode-picker">
        <legend className="visually-hidden">Order type</legend>
        <label className="mode-option">
          <input type="radio" name={`${idPrefix}-mode`} checked={fulfilment.mode === 'delivery'} onChange={() => chooseMode('delivery')} />
          <span>
            <strong>Delivery</strong>
            <small>PKR {DELIVERY_FEE_PKR} fee, food minimum PKR {BUSINESS.minDeliveryOrderPkr}</small>
          </span>
        </label>
        <label className="mode-option">
          <input type="radio" name={`${idPrefix}-mode`} checked={fulfilment.mode === 'pickup'} onChange={() => chooseMode('pickup')} />
          <span>
            <strong>Pickup</strong>
            <small>No fee, no minimum</small>
          </span>
        </label>
      </fieldset>

      {fulfilment.mode === 'pickup' ? (
        <p>
          Pick up at <strong>{PICKUP_POINT.name}</strong>.
        </p>
      ) : (
        <>
          <p>
            Delivering to: <strong>{current ? `${current.name}, ${current.city}` : 'no area chosen yet'}</strong>
          </p>
          <div className="field">
            <label htmlFor={`${idPrefix}-search`}>Find your area</label>
            <input
              id={`${idPrefix}-search`}
              type="search"
              value={search}
              placeholder="e.g. G-11 or Saddar"
              autoComplete="off"
              onChange={(e) => {
                setSearch(e.target.value)
                setUnservedId(null)
              }}
            />
          </div>

          {unserved && (
            <div className="not-served" role="status">
              <p>
                <strong>We do not deliver to {unserved.name} yet.</strong>
                {current && ` Your chosen area, ${current.name}, is unchanged.`} The closest areas we serve:
              </p>
              <ul className="nearby-list">
                {unserved.nearby.map((near) => {
                  const area = findArea(near.id)
                  return (
                    <li key={near.id}>
                      <button type="button" className="btn btn--secondary" onClick={() => chooseArea(area)}>
                        Deliver to {area.name} (about {near.km} km away)
                      </button>
                    </li>
                  )
                })}
                <li>
                  <button type="button" className="btn btn--secondary" onClick={() => chooseMode('pickup')}>
                    Pick up instead
                  </button>
                </li>
              </ul>
            </div>
          )}

          {matches.length === 0 ? (
            <div className="not-served" role="status">
              <p>
                <strong>No area matches “{search}”.</strong> We deliver to{' '}
                {AREAS.filter((a) => a.served).map((a) => a.name).join(', ')}.
              </p>
              <button type="button" className="btn btn--secondary" onClick={() => setSearch('')}>
                Show all areas
              </button>{' '}
              <button type="button" className="btn btn--secondary" onClick={() => chooseMode('pickup')}>
                Switch to pickup
              </button>
            </div>
          ) : (
            <ul className="area-list">
              {matches.map((area) => {
                const selected = area.id === fulfilment.areaId
                return (
                  <li key={area.id}>
                    <button
                      type="button"
                      className={`area-option${selected ? ' area-option--selected' : ''}`}
                      aria-pressed={selected}
                      onClick={() => chooseArea(area)}
                    >
                      <span>
                        {area.name}, {area.city}
                      </span>
                      <span className="area-option__state">
                        {selected ? 'Selected' : area.served ? '' : 'Not served yet'}
                      </span>
                    </button>
                  </li>
                )
              })}
            </ul>
          )}

        </>
      )}
    </section>
  )
}
