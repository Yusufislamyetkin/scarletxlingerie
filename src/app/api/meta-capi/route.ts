import { NextRequest, NextResponse } from 'next/server'
import { sendCapiEvent } from '@/lib/analytics/meta-capi'
import { checkRateLimit } from '@/lib/utils/rate-limit'
import { headers } from 'next/headers'

export async function POST(req: NextRequest) {
  // Rate limit: 30 events per minute per IP
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
  const rl = checkRateLimit(`capi:${ip}`, { windowMs: 60_000, max: 30 })
  if (!rl.allowed) {
    return NextResponse.json({ error: 'Too many requests' }, {
      status: 429,
      headers: { 'Retry-After': String(Math.ceil((rl.resetTime - Date.now()) / 1000)) },
    })
  }

  try {
    const body = await req.json()
    const { eventName, eventId, customData } = body

    if (!eventName || !eventId) {
      return NextResponse.json({ error: 'eventName and eventId required' }, { status: 400 })
    }

    const headersList = await headers()
    const ip        = headersList.get('x-forwarded-for')?.split(',')[0]?.trim()
                   ?? headersList.get('x-real-ip')
                   ?? undefined
    const userAgent = headersList.get('user-agent') ?? undefined
    const referer   = headersList.get('referer') ?? req.nextUrl.origin

    // Read _fbc / _fbp from cookies
    const fbc = req.cookies.get('_fbc')?.value
    const fbp = req.cookies.get('_fbp')?.value

    await sendCapiEvent({
      eventName,
      eventId,
      sourceUrl: referer,
      userData:  { ip, userAgent, fbc, fbp },
      customData,
    })

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'internal' }, { status: 500 })
  }
}
