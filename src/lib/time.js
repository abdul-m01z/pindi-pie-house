// Minutes after midnight, e.g. 12:00 PM = 720.
export function formatMinutes(minutes) {
  const h24 = Math.floor(minutes / 60)
  const m = minutes % 60
  const suffix = h24 >= 12 ? 'PM' : 'AM'
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12
  return `${h12}:${String(m).padStart(2, '0')} ${suffix}`
}

export function minutesOfDay(date) {
  return date.getHours() * 60 + date.getMinutes()
}
