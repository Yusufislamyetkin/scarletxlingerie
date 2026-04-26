// Strips HTML tags and trims whitespace from user-supplied strings.
// Use on all user-facing string inputs before persisting or displaying.
export function sanitizeString(value: unknown): string {
  if (typeof value !== 'string') return ''
  return value
    .replace(/<[^>]*>/g, '')   // strip HTML tags
    .replace(/[<>'"]/g, '')    // strip remaining angle brackets and quotes
    .trim()
    .slice(0, 2000)             // hard length cap
}

export function sanitizeEmail(value: unknown): string {
  if (typeof value !== 'string') return ''
  return value.toLowerCase().trim().slice(0, 254)
}

export function sanitizePhone(value: unknown): string {
  if (typeof value !== 'string') return ''
  // Keep only digits, +, spaces, dashes, parens
  return value.replace(/[^0-9+\s\-()]/g, '').trim().slice(0, 20)
}
