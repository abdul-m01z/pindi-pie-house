import { Link } from 'react-router-dom'
import FoodImage from './FoodImage.jsx'
import AvailabilityBadge from './AvailabilityBadge.jsx'
import { cheapest } from '../lib/menuFilter.js'
import { formatMoney, toPaisa, GST_PERCENT } from '../lib/pricing.js'

export default function MenuCard({ item }) {
  const soldOut = item.stock <= 0
  return (
    <article className={`menu-card${soldOut ? ' menu-card--sold-out' : ''}`}>
      <FoodImage src={item.image} name={item.name} className="menu-card__image" />
      <div className="menu-card__body">
        <h3 className="menu-card__title">
          {/* The link is stretched by CSS so the whole card is one large tap target. */}
          <Link to={`/menu/${item.id}`} className="menu-card__link">
            {item.name}
          </Link>
        </h3>
        <p className="menu-card__desc">{item.description}</p>
        <p className="menu-card__tags">
          {item.vegetarian && <span className="badge badge--veg">Vegetarian</span>}
          {item.spice !== 'None' && <span className="badge">Spice: {item.spice}</span>}
          <AvailabilityBadge stock={item.stock} />
        </p>
        <p className="menu-card__price">
          {item.sizes.length > 1 ? 'From ' : ''}
          <strong>{formatMoney(toPaisa(cheapest(item)))}</strong>
          <span className="muted"> + {GST_PERCENT}% GST</span>
        </p>
      </div>
    </article>
  )
}
