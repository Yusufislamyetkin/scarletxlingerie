// In-memory sliding window rate limiter.
// On Vercel each instance is isolated; for multi-instance scale use Upstash Redis.
interface WindowEntry {
  count:     number
  resetTime: number
}

const store = new Map<string, WindowEntry>()

// Prune stale entries every 5 minutes to prevent unbounded growth
setInterval(() => {
  const now = Date.now()
  for (const [key, entry] of store) {
    if (entry.resetTime < now) store.delete(key)
  }
}, 5 * 60 * 1000)

interface RateLimitOptions {
  windowMs: number  // window size in ms
  max:      number  // max requests per window
}

export function checkRateLimit(
  identifier: string,
  { windowMs, max }: RateLimitOptions
): { allowed: boolean; remaining: number; resetTime: number } {
  const now    = Date.now()
  const entry  = store.get(identifier)

  if (!entry || entry.resetTime < now) {
    store.set(identifier, { count: 1, resetTime: now + windowMs })
    return { allowed: true, remaining: max - 1, resetTime: now + windowMs }
  }

  if (entry.count >= max) {
    return { allowed: false, remaining: 0, resetTime: entry.resetTime }
  }

  entry.count++
  return { allowed: true, remaining: max - entry.count, resetTime: entry.resetTime }
}
