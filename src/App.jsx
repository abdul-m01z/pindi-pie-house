import { useEffect, useMemo, useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import StatusMessage from './components/StatusMessage.jsx'
import Home from './pages/Home.jsx'
import MenuPage from './pages/MenuPage.jsx'
import DetailsPage from './pages/DetailsPage.jsx'
import CartPage from './pages/CartPage.jsx'
import CheckoutPage from './pages/CheckoutPage.jsx'
import ConfirmationPage from './pages/ConfirmationPage.jsx'
import NotFound from './pages/NotFound.jsx'
import DemoPanel from './components/DemoPanel.jsx'
import Page from './components/Page.jsx'
import { PICKUP_POINT, findArea } from './data/areas.js'
import { loadMenu } from './lib/mockApi.js'
import { calculateSummary } from './lib/pricing.js'
import { addToCart, cartSubtotal, fixCart, removeLine, resolveCart, setQuantity } from './lib/cart.js'
import { getBlockingIssues } from './lib/checkout.js'
import { describeFulfilmentChange } from './lib/fulfilmentChange.js'
import { minutesOfDay } from './lib/time.js'
import { useLocalStorageState } from './lib/useLocalStorageState.js'
import { useMinutesNow } from './lib/useMinutesNow.js'

// Saved data is only trusted when it has the expected shape.
const isCart = (v) =>
  Array.isArray(v) &&
  v.every((l) => l && typeof l.itemId === 'string' && typeof l.sizeId === 'string' && Number.isInteger(l.quantity) && l.quantity > 0)
const NO_DEMO = { fail: false, empty: false, hidePhotos: false, time: null, stock: {} }
const isDemo = (v) =>
  v && typeof v.fail === 'boolean' && typeof v.empty === 'boolean' && typeof v.hidePhotos === 'boolean' && (v.time === null || Number.isInteger(v.time)) && typeof v.stock === 'object' && v.stock !== null
const isFulfilment = (v) =>
  v && (v.mode === 'delivery' || v.mode === 'pickup') && (v.areaId === null || typeof v.areaId === 'string')

export default function App() {
  // Menu data arrives through an asynchronous mock loader, so loading and failure are real states.
  const [menuState, setMenuState] = useState({ status: 'loading', menu: [], error: '' })
  const [loadCount, setLoadCount] = useState(0)
  const [cart, setCart] = useLocalStorageState('pph.cart', [], isCart)
  const [savedFulfilment, setFulfilment] = useLocalStorageState('pph.fulfilment', { mode: 'delivery', areaId: null }, isFulfilment)
  const [order, setOrder] = useState(null)
  const [fixMessages, setFixMessages] = useState([])
  const [notice, setNotice] = useState(null) // explains a delivery/pickup change and allows undo
  const [demo, setDemo] = useLocalStorageState('pph.demo', NO_DEMO, isDemo)
  const realMinutes = useMinutesNow()
  const nowMinutes = demo.time ?? realMinutes

  const reload = () => setLoadCount((n) => n + 1)

  useEffect(() => {
    let cancelled = false
    setMenuState({ status: 'loading', menu: [], error: '' })
    loadMenu({ fail: demo.fail, empty: demo.empty })
      .then((menu) => !cancelled && setMenuState({ status: 'ready', menu, error: '' }))
      .catch((err) => !cancelled && setMenuState({ status: 'error', menu: [], error: err.message }))
    return () => {
      cancelled = true // ignore a late response after unmount or a newer request
    }
  }, [loadCount, demo.fail, demo.empty])

  // Stock overrides from the demo panel stand in for availability changing during the day.
  const menu = useMemo(
    () =>
      menuState.menu.map((item) => ({
        ...item,
        stock: item.id in demo.stock ? demo.stock[item.id] : item.stock,
        image: demo.hidePhotos ? null : item.image, // simulates photos that fail to load
      })),
    [menuState.menu, demo.stock, demo.hidePhotos],
  )

  // A restored area must still be served today, otherwise it is treated as not chosen.
  const fulfilment = useMemo(
    () => ({ mode: savedFulfilment.mode, areaId: findArea(savedFulfilment.areaId)?.served ? savedFulfilment.areaId : null }),
    [savedFulfilment],
  )

  // Derived values: nothing below is stored, it is recalculated from cart, menu and settings.
  const lines = useMemo(() => resolveCart(cart, menu), [cart, menu])
  const subtotal = cartSubtotal(lines)
  const summary = calculateSummary(subtotal, fulfilment.mode)
  const itemCount = lines.reduce((sum, l) => sum + (l.item ? l.quantity : 0), 0)
  const issues = getBlockingIssues({ lines, subtotal, mode: fulfilment.mode, areaId: fulfilment.areaId, nowMinutes })

  // Changing delivery/pickup or area never empties the cart. The user is told what changed.
  function handleFulfilmentChange(next) {
    if (next.mode === fulfilment.mode && next.areaId === fulfilment.areaId) return
    setNotice(
      itemCount > 0
        ? { previous: savedFulfilment, lines: describeFulfilmentChange({ subtotal, itemCount, previous: fulfilment, next }) }
        : null,
    )
    setFulfilment(next)
  }
  function handleUndo() {
    setFulfilment(notice.previous)
    setNotice(null)
  }

  const orderBar = {
    fulfilment,
    summary,
    itemCount,
    onFulfilmentChange: handleFulfilmentChange,
    notice,
    onUndo: handleUndo,
    onDismissNotice: () => setNotice(null),
  }

  const handleAdd = (itemId, sizeId, quantity) => {
    setFixMessages([])
    setNotice(null)
    setCart((prev) => addToCart(prev, itemId, sizeId, quantity))
  }
  const handleSetQuantity = (key, quantity) => {
    setFixMessages([])
    setNotice(null)
    setCart((prev) => setQuantity(prev, key, quantity))
  }
  const handleRemove = (key) => {
    setFixMessages([])
    setNotice(null)
    setCart((prev) => removeLine(prev, key))
  }
  const handleFix = () => {
    const result = fixCart(cart, menu)
    setCart(result.cart)
    setFixMessages(result.changes)
  }

  // Runs every rule again at the moment of ordering: stock or time may have changed.
  function handlePlaceOrder(values) {
    const blocking = getBlockingIssues({
      lines,
      subtotal,
      mode: fulfilment.mode,
      areaId: fulfilment.areaId,
      nowMinutes: demo.time ?? minutesOfDay(new Date()),
    })
    if (blocking.length > 0) return { ok: false, issues: blocking }
    const area = findArea(fulfilment.areaId)
    setOrder({
      id: `PPH-${Math.floor(1000 + Math.random() * 9000)}`,
      customerName: values.name.trim().split(/\s+/)[0],
      mode: fulfilment.mode,
      address: values.address.trim(),
      areaName: area ? `${area.name}, ${area.city}` : '',
      pickupPoint: PICKUP_POINT.name,
      paymentLabel: values.payment === 'card' ? 'Card (simulated)' : fulfilment.mode === 'delivery' ? 'Cash on delivery' : 'Pay at the counter',
      items: lines.map((l) => ({ key: l.key, name: l.item.name, sizeLabel: l.size.label, quantity: l.quantity, total: l.total })),
      itemCount,
      summary,
    })
    setCart([])
    return { ok: true }
  }

  const needMenu = (page) => <Page>{withMenu(menuState, reload, page)}</Page>

  return (
    <Layout
      cartCount={cart.reduce((sum, l) => sum + l.quantity, 0)}
      footerExtra={
        <DemoPanel
          demo={demo}
          onChange={(changes) => setDemo((prev) => ({ ...prev, ...changes }))}
          onReset={() => setDemo(NO_DEMO)}
        />
      }
    >
      <Routes>
        <Route path="/" element={<Home menuState={{ ...menuState, menu }} onReload={reload} />} />
        <Route path="/menu" element={needMenu(<MenuPage menu={menu} onReload={reload} orderBar={orderBar} />)} />
        <Route path="/menu/:id" element={needMenu(<DetailsPage menu={menu} cart={cart} onAddToCart={handleAdd} orderBar={orderBar} />)} />
        <Route
          path="/cart"
          element={needMenu(
            <CartPage
              lines={lines}
              cart={cart}
              summary={summary}
              itemCount={itemCount}
              fulfilment={fulfilment}
              onFulfilmentChange={handleFulfilmentChange}
              issues={issues}
              nowMinutes={nowMinutes}
              onSetQuantity={handleSetQuantity}
              onRemove={handleRemove}
              onFixCart={handleFix}
              fixMessages={fixMessages}
              notice={notice}
              onUndo={handleUndo}
              onDismissNotice={() => setNotice(null)}
            />,
          )}
        />
        <Route
          path="/checkout"
          element={needMenu(
            <CheckoutPage
              lines={lines}
              summary={summary}
              itemCount={itemCount}
              fulfilment={fulfilment}
              issues={issues}
              nowMinutes={nowMinutes}
              onPlaceOrder={handlePlaceOrder}
            />,
          )}
        />
        <Route path="/confirmation" element={<Page><ConfirmationPage order={order} /></Page>} />
        <Route path="*" element={<Page><NotFound /></Page>} />
      </Routes>
    </Layout>
  )
}

// Pages that need menu data show loading and error states instead of the page itself.
function withMenu(menuState, reload, page) {
  if (menuState.status === 'loading') {
    return (
      <StatusMessage kind="loading" title="Loading the menu…">
        Fetching today’s dishes.
      </StatusMessage>
    )
  }
  if (menuState.status === 'error') {
    return (
      <StatusMessage
        kind="error"
        title="We could not load the menu"
        action={
          <button type="button" className="btn btn--primary" onClick={reload}>
            Try again
          </button>
        }
      >
        {menuState.error}
      </StatusMessage>
    )
  }
  return page
}
