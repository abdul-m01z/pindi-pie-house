import { NavLink, Link } from 'react-router-dom'
import { BUSINESS } from '../data/business.js'

export default function Layout({ children, cartCount, footerExtra }) {
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to main content
      </a>
      <header className="site-header">
        <div className="container site-header__inner">
          <Link to="/" className="brand">
            {BUSINESS.name}
          </Link>
          <nav aria-label="Main">
            <ul className="nav-list">
              <li>
                <NavLink to="/" end>
                  Home
                </NavLink>
              </li>
              <li>
                <NavLink to="/menu">Menu</NavLink>
              </li>
              <li>
                <NavLink to="/cart">
                  Cart <span className="cart-count">{cartCount}<span className="visually-hidden"> items</span></span>
                </NavLink>
              </li>
            </ul>
          </nav>
        </div>
      </header>
      <main id="main" className="container main" tabIndex={-1}>
        {children}
      </main>
      <footer className="site-footer">
        <div className="container">
          <p>
            {BUSINESS.name} is a fictional business made for a university assignment. Orders are
            simulated: nothing is cooked, delivered or charged.
          </p>
          {footerExtra}
        </div>
      </footer>
    </>
  )
}
