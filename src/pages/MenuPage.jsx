import { useSearchParams } from 'react-router-dom'
import MenuControls from '../components/MenuControls.jsx'
import MenuCard from '../components/MenuCard.jsx'
import StatusMessage from '../components/StatusMessage.jsx'
import OrderBar from '../components/OrderBar.jsx'
import { CATEGORIES } from '../data/menu.js'
import { filterMenu } from '../lib/menuFilter.js'

// Search, category, vegetarian filter and sort live in the URL query string.
// That keeps them when the user opens a dish and presses Back, and makes a view linkable.
export default function MenuPage({ menu, onReload, orderBar }) {
  const [params, setParams] = useSearchParams()
  const values = {
    q: params.get('q') ?? '',
    cat: params.get('cat') ?? 'all',
    veg: params.get('veg') === '1',
    sort: params.get('sort') ?? 'popular',
  }

  function update(changes) {
    const next = { ...values, ...changes }
    const query = {}
    if (next.q) query.q = next.q
    if (next.cat !== 'all') query.cat = next.cat
    if (next.veg) query.veg = '1'
    if (next.sort !== 'popular') query.sort = next.sort
    setParams(query, { replace: true })
  }

  const hasActiveFilters = Boolean(values.q) || values.cat !== 'all' || values.veg
  const results = filterMenu(menu, values)
  const categoryLabel = CATEGORIES.find((c) => c.id === values.cat)?.label

  return (
    <>
      <h1>Menu</h1>
      <OrderBar {...orderBar} />

      {menu.length === 0 ? (
        <StatusMessage
          kind="empty"
          title="The menu is empty right now"
          action={
            <button type="button" className="btn btn--primary" onClick={onReload}>
              Reload menu
            </button>
          }
        >
          Nothing has been published yet. This is not caused by your search.
        </StatusMessage>
      ) : (
        <>
          <MenuControls
            values={values}
            onChange={update}
            onClear={() => setParams({}, { replace: true })}
            hasActiveFilters={hasActiveFilters}
          />
          <p className="result-count" role="status">
            Showing {results.length} of {menu.length} dishes
          </p>
          {results.length === 0 ? (
            <StatusMessage kind="empty" title="No dishes match your search">
              {values.q && <>Nothing matches “{values.q}”</>}
              {values.q && (categoryLabel || values.veg) ? ' with ' : ''}
              {categoryLabel && <>category {categoryLabel}</>}
              {categoryLabel && values.veg ? ' and ' : ''}
              {values.veg && <>vegetarian only</>}
              {'. '}
              Try a shorter word, or clear the search and filters to see all {menu.length} dishes.
              <br />
              <button
                type="button"
                className="btn btn--primary"
                onClick={() => setParams({}, { replace: true })}
              >
                Show the full menu
              </button>
            </StatusMessage>
          ) : (
            <ul className="menu-grid">
              {results.map((item) => (
                <li key={item.id}>
                  <MenuCard item={item} />
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </>
  )
}
