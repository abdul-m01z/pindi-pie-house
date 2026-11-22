import { CATEGORIES } from '../data/menu.js'
import { SORT_OPTIONS } from '../lib/menuFilter.js'

// Controlled inputs: the values come from the URL query, changes go back through onChange.
export default function MenuControls({ values, onChange, onClear, hasActiveFilters }) {
  return (
    <form className="menu-controls" role="search" onSubmit={(e) => e.preventDefault()}>
      <div className="field">
        <label htmlFor="menu-search">Search the menu</label>
        <input
          id="menu-search"
          type="search"
          value={values.q}
          placeholder="e.g. tikka, mango, veg"
          onChange={(e) => onChange({ q: e.target.value })}
        />
      </div>
      <div className="field">
        <label htmlFor="menu-category">Category</label>
        <select id="menu-category" value={values.cat} onChange={(e) => onChange({ cat: e.target.value })}>
          <option value="all">All categories</option>
          {CATEGORIES.map((c) => (
            <option key={c.id} value={c.id}>
              {c.label}
            </option>
          ))}
        </select>
      </div>
      <div className="field">
        <label htmlFor="menu-sort">Sort by</label>
        <select id="menu-sort" value={values.sort} onChange={(e) => onChange({ sort: e.target.value })}>
          {SORT_OPTIONS.map((o) => (
            <option key={o.id} value={o.id}>
              {o.label}
            </option>
          ))}
        </select>
      </div>
      <div className="field field--check">
        <input
          id="menu-veg"
          type="checkbox"
          checked={values.veg}
          onChange={(e) => onChange({ veg: e.target.checked })}
        />
        <label htmlFor="menu-veg">Vegetarian only</label>
      </div>
      {hasActiveFilters && (
        <button type="button" className="btn btn--secondary" onClick={onClear}>
          Clear search and filters
        </button>
      )}
    </form>
  )
}
