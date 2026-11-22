import { useState } from 'react'
import { BUSINESS } from '../data/business.js'
import { checkItemQuantity } from '../rules/maxPerItem.js'

// Minus / number / plus control. The limit is always written next to it.
// A typed value outside the rule is not applied: the specific rule message is shown instead.
export default function QuantityControl({ id, label, value, stock, alreadyInCart = 0, onChange }) {
  const [draft, setDraft] = useState(null) // text typed but not valid yet
  const shown = draft ?? String(value)
  const draftRule = draft === null ? null : checkItemQuantity({ quantity: Number(draft), stock, alreadyInCart })
  const plusRule = checkItemQuantity({ quantity: value + 1, stock, alreadyInCart })

  const limitText =
    stock <= 0
      ? 'Sold out today'
      : stock < BUSINESS.maxPerItem
        ? `Only ${stock} left today`
        : `Max ${BUSINESS.maxPerItem} per order`

  function handleType(e) {
    const raw = e.target.value
    const rule = checkItemQuantity({ quantity: Number(raw), stock, alreadyInCart })
    if (raw !== '' && rule.ok) {
      setDraft(null)
      onChange(Number(raw))
    } else {
      setDraft(raw)
    }
  }

  return (
    <div className="qty">
      <span className="qty__label" id={`${id}-label`}>
        {label}
      </span>
      <div className="qty__row">
        <button
          type="button"
          className="btn btn--secondary qty__btn"
          aria-label={`Decrease ${label}`}
          disabled={value <= 1}
          onClick={() => {
            setDraft(null)
            onChange(value - 1)
          }}
        >
          −
        </button>
        <input
          id={id}
          className="qty__input"
          type="number"
          inputMode="numeric"
          min="1"
          step="1"
          value={shown}
          aria-labelledby={`${id}-label`}
          aria-describedby={`${id}-hint`}
          aria-invalid={draftRule ? true : undefined}
          onChange={handleType}
          onBlur={() => setDraft(null)}
        />
        <button
          type="button"
          className="btn btn--secondary qty__btn"
          aria-label={`Increase ${label}`}
          disabled={!plusRule.ok}
          onClick={() => {
            setDraft(null)
            onChange(value + 1)
          }}
        >
          +
        </button>
        <span className="qty__limit">{limitText}</span>
      </div>
      <p id={`${id}-hint`} className="field__error" role="alert">
        {draftRule?.message}
      </p>
    </div>
  )
}
