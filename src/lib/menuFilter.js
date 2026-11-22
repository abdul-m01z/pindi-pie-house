const cheapest = (item) => Math.min(...item.sizes.map((size) => size.price))

const SORTERS = {
  popular: (a, b) => b.popularity - a.popularity,
  'price-asc': (a, b) => cheapest(a) - cheapest(b),
  'price-desc': (a, b) => cheapest(b) - cheapest(a),
  name: (a, b) => a.name.localeCompare(b.name),
}

export const SORT_OPTIONS = [
  { id: 'popular', label: 'Most popular' },
  { id: 'price-asc', label: 'Price: low to high' },
  { id: 'price-desc', label: 'Price: high to low' },
  { id: 'name', label: 'Name: A to Z' },
]

export { cheapest }

// Search, filter and sort work together: search narrows first, then filters, then sort.
export function filterMenu(menu, { q = '', cat = 'all', veg = false, sort = 'popular' }) {
  const needle = q.trim().toLowerCase()
  return menu
    .filter((item) => cat === 'all' || item.category === cat)
    .filter((item) => !veg || item.vegetarian)
    .filter((item) => {
      if (!needle) return true
      const haystack = [item.name, item.description, ...item.ingredients].join(' ').toLowerCase()
      return haystack.includes(needle)
    })
    .sort(SORTERS[sort] ?? SORTERS.popular)
}
