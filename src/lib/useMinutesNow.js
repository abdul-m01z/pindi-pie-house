import { useEffect, useState } from 'react'
import { minutesOfDay } from './time.js'

// Current time as minutes after midnight, refreshed every 30 seconds.
export function useMinutesNow() {
  const [minutes, setMinutes] = useState(() => minutesOfDay(new Date()))
  useEffect(() => {
    const timer = setInterval(() => setMinutes(minutesOfDay(new Date())), 30000)
    return () => clearInterval(timer)
  }, [])
  return minutes
}
