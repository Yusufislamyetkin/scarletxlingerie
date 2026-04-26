import { createHash } from 'crypto'
import type { CartItem } from '@/types'

const PIXEL_ID = process.env.META_PIXEL_ID!
const ACCESS_TOKEN = process.env.META_CAPI_ACCESS_TOKEN!
const API_URL = `https://graph.facebook.com/v19.0/${PIXEL_ID}/events`

function sha256(value: string) {
  return createHash('sha256').update(value.toLowerCase().trim()).digest('hex')
}

export interface CapiUserData {
  email?: string
  phone?: string
  ip?: string
  userAgent?: string
  fbc?: string   // _fbc cookie
  fbp?: string   // _fbp cookie
}

interface CapiEventOptions {
  eventName: string
  eventId: string
  sourceUrl: string
  userData: CapiUserData
  customData?: Record<string, unknown>
  testEventCode?: string
}

export async function sendCapiEvent(opts: CapiEventOptions) {
  if (!PIXEL_ID || !ACCESS_TOKEN) return

  const user_data: Record<string, string | undefined> = {
    client_ip_address: opts.userData.ip,
    client_user_agent: opts.userData.userAgent,
    fbc: opts.userData.fbc,
    fbp: opts.userData.fbp,
  }

  if (opts.userData.email) user_data.em = sha256(opts.userData.email)
  if (opts.userData.phone) user_data.ph = sha256(opts.userData.phone.replace(/\D/g, ''))

  const payload: Record<string, unknown> = {
    data: [
      {
        event_name:       opts.eventName,
        event_time:       Math.floor(Date.now() / 1000),
        event_id:         opts.eventId,
        event_source_url: opts.sourceUrl,
        action_source:    'website',
        user_data,
        custom_data:      opts.customData,
      },
    ],
    access_token: ACCESS_TOKEN,
  }

  if (opts.testEventCode) {
    payload.test_event_code = opts.testEventCode
  }

  try {
    const res = await fetch(API_URL, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(payload),
    })
    if (!res.ok) {
      const err = await res.text()
      console.error('[META CAPI] Error:', err)
    }
  } catch (e) {
    console.error('[META CAPI] Fetch error:', e)
  }
}

export function capiContents(items: CartItem[]) {
  return items.map(i => ({
    id:         i.variantId,
    quantity:   i.quantity,
    item_price: i.price,
  }))
}
