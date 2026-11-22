// Small decorative icons drawn as inline SVG. They are hidden from screen readers because
// the visible text next to them already names the link.
const base = {
  width: 20,
  height: 20,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
  focusable: false,
}

export const HomeIcon = () => (
  <svg {...base}>
    <path d="M3 11l9-8 9 8" />
    <path d="M5 10v10h14V10" />
    <path d="M10 20v-6h4v6" />
  </svg>
)

// A pizza slice for the menu.
export const MenuIcon = () => (
  <svg {...base}>
    <path d="M3 5a18 18 0 0 1 18 0L12 21z" />
    <circle cx="10" cy="9" r="1.2" />
    <circle cx="14" cy="11" r="1.2" />
  </svg>
)

export const CartIcon = () => (
  <svg {...base}>
    <circle cx="9" cy="20" r="1.5" />
    <circle cx="18" cy="20" r="1.5" />
    <path d="M2 3h3l2.7 12.4a1 1 0 0 0 1 .8h8.8a1 1 0 0 0 1-.8L20 7H6" />
  </svg>
)
