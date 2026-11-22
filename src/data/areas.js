// Delivery areas. Unserved areas list nearby served areas (approximate km, fictional data).
export const PICKUP_POINT = {
  name: 'Pindi Pie House, G-13 Markaz, Islamabad',
  hours: 'Same hours as delivery',
}

export const AREAS = [
  { id: 'g-13', name: 'G-13', city: 'Islamabad', served: true },
  { id: 'g-11', name: 'G-11', city: 'Islamabad', served: true },
  { id: 'g-10', name: 'G-10', city: 'Islamabad', served: true },
  { id: 'f-10', name: 'F-10', city: 'Islamabad', served: true },
  { id: 'blue-area', name: 'Blue Area', city: 'Islamabad', served: true },
  { id: 'i-8', name: 'I-8', city: 'Islamabad', served: true },
  {
    id: 'saddar',
    name: 'Saddar',
    city: 'Rawalpindi',
    served: false,
    nearby: [
      { id: 'i-8', km: 6 },
      { id: 'g-10', km: 7 },
    ],
  },
  {
    id: 'bahria-4',
    name: 'Bahria Town Phase 4',
    city: 'Rawalpindi',
    served: false,
    nearby: [
      { id: 'g-13', km: 9 },
      { id: 'g-11', km: 11 },
    ],
  },
]

export function findArea(id) {
  return AREAS.find((area) => area.id === id) ?? null
}
