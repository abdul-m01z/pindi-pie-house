import { Link } from 'react-router-dom'
import { BUSINESS } from '../data/business.js'
import { AREAS } from '../data/areas.js'
import { DELIVERY_FEE_PKR, GST_PERCENT } from '../lib/pricing.js'
import { formatMinutes } from '../lib/time.js'

export default function Home() {
  const served = AREAS.filter((a) => a.served)
  return (
    <>
      <section className="hero">
        <h1>{BUSINESS.name}</h1>
        <p className="hero__lead">{BUSINESS.tagline}</p>
        <Link to="/menu" className="btn btn--primary">
          See the menu
        </Link>
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
              PKR {DELIVERY_FEE_PKR} flat fee, minimum order PKR {BUSINESS.minDeliveryOrderPkr}.
              Pickup has no minimum and no fee.
            </p>
          </li>
          <li className="info-card">
            <h3>Prices</h3>
            <p>
              Menu prices exclude {GST_PERCENT}% GST. The full breakdown is shown before checkout.
            </p>
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
    </>
  )
}
