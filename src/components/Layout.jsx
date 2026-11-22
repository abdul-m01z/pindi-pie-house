import { NavLink, Link } from 'react-router-dom'
import { BUSINESS } from '../data/business.js'
import { CartIcon, HomeIcon, MenuIcon } from './Icons.jsx'

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
                  <HomeIcon /> Home
                </NavLink>
              </li>
              <li>
                <NavLink to="/menu">
                  <MenuIcon /> Menu
                </NavLink>
              </li>
              <li>
                <NavLink to="/cart">
                  <CartIcon /> Cart <span className="cart-count">{cartCount}<span className="visually-hidden">{cartCount === 1 ? ' item' : ' items'}</span></span>
                </NavLink>
              </li>
            </ul>
          </nav>
        </div>
      </header>
      <main id="main" className="main" tabIndex={-1}>
        {children}
      </main>
      <footer className="site-footer">
        <div className="container">
          <p>
            Demo project. Orders are simulated: nothing is cooked, delivered or charged. Dish photos
            are from Unsplash.
          </p>
          {footerExtra}
        </div>
      </footer>
    </>
  )
}
