// Checkout form rules. Each returns a specific message, or '' when the value is fine.
export const NOTES_MAX = 140

export function validateName(value) {
  const name = value.trim()
  if (!name) return 'Enter your name.'
  if (name.length < 2) return 'Your name needs at least 2 letters.'
  if (!/^[\p{L} .'-]+$/u.test(name)) return 'Use letters only in your name, no numbers or symbols.'
  return ''
}

// Pakistani mobile numbers: 03XX XXXXXXX (11 digits). Spaces and dashes are allowed.
export function validatePhone(value) {
  const digits = value.replace(/[\s-]/g, '')
  if (!digits) return 'Enter a phone number so the rider can reach you.'
  if (!/^\d+$/.test(digits)) return 'Use digits only, for example 0300 1234567.'
  if (!digits.startsWith('03')) return 'Mobile numbers start with 03, for example 0300 1234567.'
  if (digits.length !== 11) return `Mobile numbers have 11 digits. You entered ${digits.length}.`
  return ''
}

export function validateAddress(value) {
  const address = value.trim()
  if (!address) return 'Enter your house, street or landmark so the rider can find you.'
  if (address.length < 8) return 'Add a little more detail, at least 8 characters (house, street, landmark).'
  return ''
}

export function validateNotes(value) {
  return value.length > NOTES_MAX ? `Notes can be up to ${NOTES_MAX} characters. You have ${value.length}.` : ''
}

export function validateCheckout(values, mode) {
  const errors = {
    name: validateName(values.name),
    phone: validatePhone(values.phone),
    notes: validateNotes(values.notes),
  }
  if (mode === 'delivery') errors.address = validateAddress(values.address)
  return Object.fromEntries(Object.entries(errors).filter(([, message]) => message))
}
