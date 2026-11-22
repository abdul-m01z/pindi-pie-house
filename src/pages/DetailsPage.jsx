import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import FoodImage from '../components/FoodImage.jsx'
import AvailabilityBadge from '../components/AvailabilityBadge.jsx'
import NotFound from './NotFound.jsx'
import { formatMoney, priceWithGst, GST_PERCENT } from '../lib/pricing.js'

export default function DetailsPage({ menu }) {
  const { id } = useParams()
  const item = menu.find((m) => m.id === id)
  if (!item) return <NotFound what="dish" />
  return <ItemDetails key={item.id} item={item} />
}

function ItemDetails({ item }) {
  const [sizeId, setSizeId] = useState(item.sizes[0].id)
  const size = item.sizes.find((s) => s.id === sizeId)
  const price = priceWithGst(size.price)

  return (
    <>
      <p>
        <Link to="/menu">← Back to the menu</Link>
      </p>
      <div className="details">
        <FoodImage src={item.image} name={item.name} className="details__image" />
        <div className="details__body">
          <h1>{item.name}</h1>
          <p>{item.description}</p>
          <p className="menu-card__tags">
            {item.vegetarian && <span className="badge badge--veg">Vegetarian</span>}
            <span className="badge">Spice: {item.spice}</span>
            <AvailabilityBadge stock={item.stock} />
          </p>
          <p>
            <strong>Ingredients:</strong> {item.ingredients.join(', ')}
          </p>

          {item.sizes.length > 1 ? (
            <fieldset className="size-picker">
              <legend>Choose a size</legend>
              {item.sizes.map((s) => (
                <label key={s.id} className="size-option">
                  <input
                    type="radio"
                    name="size"
                    value={s.id}
                    checked={s.id === sizeId}
                    onChange={() => setSizeId(s.id)}
                  />
                  <span>
                    {s.label} <strong>{formatMoney(s.price * 100)}</strong>
                  </span>
                </label>
              ))}
            </fieldset>
          ) : (
            <p>
              <strong>Size:</strong> {size.label}
            </p>
          )}

          <dl className="price-box">
            <div>
              <dt>Price</dt>
              <dd>{formatMoney(price.net)}</dd>
            </div>
            <div>
              <dt>GST ({GST_PERCENT}%)</dt>
              <dd>{formatMoney(price.gst)}</dd>
            </div>
            <div className="price-box__total">
              <dt>Price with GST</dt>
              <dd>{formatMoney(price.gross)}</dd>
            </div>
          </dl>
        </div>
      </div>
    </>
  )
}
