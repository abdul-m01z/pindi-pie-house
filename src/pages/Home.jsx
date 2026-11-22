import { Link } from 'react-router-dom'
import ScrollHero from '../components/ScrollHero.jsx'
import MenuCard from '../components/MenuCard.jsx'
import StatusMessage from '../components/StatusMessage.jsx'
import { BUSINESS } from '../data/business.js'
import { AREAS } from '../data/areas.js'
import { DELIVERY_FEE_PKR, GST_PERCENT } from '../lib/pricing.js'
import { filterMenu } from '../lib/menuFilter.js'
import { formatMinutes } from '../lib/time.js'

const POPULAR_COUNT = 4

export default function Home({ menuState, onReload }) {
  const served = AREAS.filter((a) => a.served)
  const popular = filterMenu(menuState.menu, { sort: 'popular' }).slice(0, POPULAR_COUNT)

  return (
    <>
      <ScrollHero />
      <div className="container page">
        <section aria-labelledby="popular-heading">
          <div className="section-head">
            <h2 id="popular-heading">Popular dishes</h2>
            <Link to="/menu" className="touch-link">
              See the full menu →
            </Link>
          </div>
          {menuState.status === 'loading' && (
            <StatusMessage kind="loading" title="Loading dishes…">
              Fetching today’s dishes.
            </StatusMessage>
          )}
          {menuState.status === 'error' && (
            <StatusMessage
              kind="error"
              title="We could not load the menu"
              action={
                <button type="button" className="btn btn--primary" onClick={onReload}>
                  Try again
                </button>
              }
            >
              {menuState.error}
            </StatusMessage>
          )}
          {menuState.status === 'ready' && popular.length > 0 && (
            <ul className="menu-grid">
              {popular.map((item) => (
                <li key={item.id}>
                  <MenuCard item={item} />
                </li>
              ))}
            </ul>
          )}
        </section>

        <section aria-labelledby="how-heading">
          <h2 id="how-heading">How ordering works</h2>
          <ul className="info-grid">
            <li className="info-card">
              <h3>Hours</h3>
              <p>
                We take orders from {formatMinutes(BUSINESS.openMinutes)} to{' '}
                {formatMinutes(BUSINESS.lastOrderMinutes)}.
              </p>
            </li>
            <li className="info-card">
              <h3>Delivery</h3>
              <p>
                PKR {DELIVERY_FEE_PKR} flat fee, minimum order PKR {BUSINESS.minDeliveryOrderPkr}. Pickup has
                no minimum and no fee.
              </p>
            </li>
            <li className="info-card">
              <h3>Prices</h3>
              <p>Menu prices exclude {GST_PERCENT}% GST. The full breakdown is shown before checkout.</p>
            </li>
            <li className="info-card">
              <h3>Limits</h3>
              <p>Up to {BUSINESS.maxPerItem} of any one dish per order, while stock lasts.</p>
            </li>
          </ul>
        </section>

        <section aria-labelledby="areas-heading">
          <h2 id="areas-heading">Where we deliver</h2>
          <p>{served.map((a) => `${a.name}, ${a.city}`).join(' · ')}</p>
        </section>
      </div>
    </>
  )
}
