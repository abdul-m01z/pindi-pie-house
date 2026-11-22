import { MENU } from '../data/menu.js'

// Simulated network call. The demo panel can force a failure or an empty menu.
export function loadMenu({ fail = false, empty = false } = {}) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (fail) {
        reject(new Error('The menu could not be loaded (simulated failure).'))
        return
      }
      resolve(empty ? [] : MENU)
    }, 600)
  })
}
