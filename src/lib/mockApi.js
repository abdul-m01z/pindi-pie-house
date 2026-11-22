import { MENU } from '../data/menu.js'

// Simulated network call. The demo panel can force a failure or an empty menu,
// and can override stock levels to show how the app reacts to changed availability.
export function loadMenu({ fail = false, empty = false, stockOverrides = {} } = {}) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (fail) {
        reject(new Error('The menu could not be loaded (simulated failure).'))
        return
      }
      if (empty) {
        resolve([])
        return
      }
      resolve(
        MENU.map((item) =>
          item.id in stockOverrides ? { ...item, stock: stockOverrides[item.id] } : item,
        ),
      )
    }, 600)
  })
}
