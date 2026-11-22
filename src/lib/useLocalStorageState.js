import { useEffect, useState } from 'react'

// useState that is saved to localStorage. Bad or old saved data is ignored via `isValid`.
export function useLocalStorageState(key, initial, isValid) {
  const [value, setValue] = useState(() => {
    try {
      const raw = localStorage.getItem(key)
      if (raw === null) return initial
      const parsed = JSON.parse(raw)
      return isValid(parsed) ? parsed : initial
    } catch {
      return initial
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch {
      // Storage may be full or blocked: the app keeps working from memory.
    }
  }, [key, value])

  return [value, setValue]
}
