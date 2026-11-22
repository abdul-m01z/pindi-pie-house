import { MENU } from '../data/menu.js'
import { formatMinutes } from '../lib/time.js'

const TIMES = [
  { value: '', label: 'Real time' },
  { value: String(11 * 60 + 59), label: '11:59 AM (just before opening)' },
  { value: String(12 * 60), label: '12:00 PM (opening, accepted)' },
  { value: String(23 * 60 + 30), label: '11:30 PM (last order, accepted)' },
  { value: String(23 * 60 + 31), label: '11:31 PM (too late, rejected)' },
]

// Clearly labelled demonstration controls so loading failure, an empty menu, changed
// availability and the kitchen hours can be checked without waiting or editing code.
export default function DemoPanel({ demo, onChange, onReset }) {
  const stockOf = (id) => demo.stock[id]
  return (
    <details className="demo-panel">
      <summary>Demonstration controls (for testing the edge cases)</summary>
      <p className="muted">These only change this browser. They do not exist in a real shop.</p>
      <div className="demo-panel__grid">
        <div className="field field--check">
          <input
            id="demo-fail"
            type="checkbox"
            checked={demo.fail}
            onChange={(e) => onChange({ fail: e.target.checked })}
          />
          <label htmlFor="demo-fail">Make menu loading fail (then use “Try again”)</label>
        </div>
        <div className="field field--check">
          <input
            id="demo-empty"
            type="checkbox"
            checked={demo.empty}
            onChange={(e) => onChange({ empty: e.target.checked })}
          />
          <label htmlFor="demo-empty">Load an empty menu</label>
        </div>
        <div className="field field--check">
          <input
            id="demo-photos"
            type="checkbox"
            checked={demo.hidePhotos}
            onChange={(e) => onChange({ hidePhotos: e.target.checked })}
          />
          <label htmlFor="demo-photos">Hide dish photos (tests the missing-image fallback)</label>
        </div>
        <div className="field">
          <label htmlFor="demo-time">Pretend the time is</label>
          <select
            id="demo-time"
            value={demo.time === null ? '' : String(demo.time)}
            onChange={(e) => onChange({ time: e.target.value === '' ? null : Number(e.target.value) })}
          >
            {TIMES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
          {demo.time !== null && <p className="field__hint">Using {formatMinutes(demo.time)}.</p>}
        </div>
        <div className="field">
          <label htmlFor="demo-stock-item">Change today’s stock of a dish</label>
          <select
            id="demo-stock-item"
            value=""
            onChange={(e) => {
              const id = e.target.value
              if (id) onChange({ stock: { ...demo.stock, [id]: 0 } })
            }}
          >
            <option value="">Sell out a dish…</option>
            {MENU.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name} {stockOf(m.id) === 0 ? '(sold out)' : ''}
              </option>
            ))}
          </select>
          <label htmlFor="demo-stock-low" className="demo-panel__second">
            Leave only 2 of a dish
          </label>
          <select
            id="demo-stock-low"
            value=""
            onChange={(e) => {
              const id = e.target.value
              if (id) onChange({ stock: { ...demo.stock, [id]: 2 } })
            }}
          >
            <option value="">Choose a dish…</option>
            {MENU.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      <button type="button" className="btn btn--secondary" onClick={onReset}>
        Reset all demonstration settings
      </button>
    </details>
  )
}
