import { useCallback, useEffect, useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import StatusMessage from './components/StatusMessage.jsx'
import Home from './pages/Home.jsx'
import MenuPage from './pages/MenuPage.jsx'
import DetailsPage from './pages/DetailsPage.jsx'
import NotFound from './pages/NotFound.jsx'
import { loadMenu } from './lib/mockApi.js'

export default function App() {
  // Menu data arrives through an asynchronous mock loader, so loading and failure are real states.
  const [menuState, setMenuState] = useState({ status: 'loading', menu: [], error: '' })
  const [loadCount, setLoadCount] = useState(0)

  const reload = useCallback(() => {
    setMenuState({ status: 'loading', menu: [], error: '' })
    setLoadCount((n) => n + 1)
  }, [])

  useEffect(() => {
    let cancelled = false
    loadMenu()
      .then((menu) => !cancelled && setMenuState({ status: 'ready', menu, error: '' }))
      .catch((err) => !cancelled && setMenuState({ status: 'error', menu: [], error: err.message }))
    return () => {
      cancelled = true // ignore a late response after unmount or a newer request
    }
  }, [loadCount])

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/menu" element={withMenu(menuState, reload, <MenuPage menu={menuState.menu} onReload={reload} />)} />
        <Route path="/menu/:id" element={withMenu(menuState, reload, <DetailsPage menu={menuState.menu} />)} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  )
}

// Pages that need menu data show loading and error states instead of the page itself.
function withMenu(menuState, reload, page) {
  if (menuState.status === 'loading') {
    return <StatusMessage kind="loading" title="Loading the menu…">Fetching today’s dishes.</StatusMessage>
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
