// Resend entegrasyonu — RESEND_API_KEY env var gerekiyor
// Şu an stub modda; key geldiğinde aşağıdaki yorum satırlarını etkinleştirin:
// npm install resend

const FROM_ADDRESS = process.env.EMAIL_FROM ?? 'ScarletX Lingerie <noreply@scarletxlingerie.com>'

interface OrderEmailData {
  to:          string
  orderNumber: string
  fullName:    string
  items:       { name: string; size: string; color: string; quantity: number; price: number }[]
  total:       number
  shippingLabel: string
  address:     { addressLine1: string; city: string; district: string }
}

interface ShippingEmailData {
  to:          string
  orderNumber: string
  fullName:    string
  trackingCode?: string
  carrier?:    string
}

async function send(to: string, subject: string, html: string): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    console.log(`[EMAIL STUB] To: ${to} | Subject: ${subject}`)
    return
  }

  const res = await fetch('https://api.resend.com/emails', {
    method:  'POST',
    headers: {
      Authorization:  `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ from: FROM_ADDRESS, to, subject, html }),
  })

  if (!res.ok) {
    const err = await res.text()
    console.error('[EMAIL] Resend error:', err)
  }
}

export async function sendOrderConfirmation(data: OrderEmailData): Promise<void> {
  const itemRows = data.items
    .map(
      (i) =>
        `<tr>
          <td style="padding:8px 0;border-bottom:1px solid #e5e0d8;">${i.name} — ${i.color} / ${i.size}</td>
          <td style="padding:8px 0;border-bottom:1px solid #e5e0d8;text-align:right;">x${i.quantity}</td>
          <td style="padding:8px 0;border-bottom:1px solid #e5e0d8;text-align:right;">${(i.price * i.quantity).toLocaleString('tr-TR')} ₺</td>
        </tr>`
    )
    .join('')

  const html = `
<!DOCTYPE html>
<html lang="tr">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#FAF7F2;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;color:#2C2C2C;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#FAF7F2;padding:40px 0;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#fff;border:1px solid #e5e0d8;">
        <!-- Header -->
        <tr><td style="background:#2C2C2C;padding:32px 40px;text-align:center;">
          <p style="margin:0;color:#C9A96E;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;">ScarletX Lingerie</p>
          <h1 style="margin:8px 0 0;color:#FAF7F2;font-size:24px;font-weight:300;">Siparişiniz Alındı</h1>
        </td></tr>
        <!-- Body -->
        <tr><td style="padding:40px;">
          <p style="margin:0 0 24px;font-size:14px;line-height:1.6;color:#5C5C5C;">
            Merhaba ${data.fullName},<br>
            <strong>#${data.orderNumber}</strong> numaralı siparişiniz başarıyla alındı. Hazırlandıktan sonra kargoya verilecek ve size e-posta ile bildirim gönderilecektir.
          </p>

          <!-- Items -->
          <table width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid #e5e0d8;margin-bottom:24px;">
            ${itemRows}
          </table>

          <!-- Total -->
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td style="font-size:13px;color:#5C5C5C;">${data.shippingLabel}</td>
              <td style="font-size:13px;text-align:right;color:#5C5C5C;">—</td>
            </tr>
            <tr>
              <td style="padding-top:8px;font-size:16px;font-weight:600;">Toplam</td>
              <td style="padding-top:8px;font-size:16px;font-weight:600;text-align:right;">${data.total.toLocaleString('tr-TR')} ₺</td>
            </tr>
          </table>

          <!-- Address -->
          <div style="margin-top:32px;padding:16px;background:#FAF7F2;border:1px solid #e5e0d8;font-size:13px;color:#5C5C5C;line-height:1.6;">
            <strong style="display:block;margin-bottom:4px;color:#2C2C2C;">Teslimat Adresi</strong>
            ${data.address.addressLine1}<br>
            ${data.address.district} / ${data.address.city}
          </div>
        </td></tr>
        <!-- Footer -->
        <tr><td style="padding:24px 40px;border-top:1px solid #e5e0d8;text-align:center;">
          <p style="margin:0;font-size:11px;color:#9C9C9C;letter-spacing:0.1em;">
            Sorularınız için <a href="mailto:destek@scarletxlingerie.com" style="color:#C9A96E;">destek@scarletxlingerie.com</a>
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`

  await send(data.to, `Siparişiniz Alındı — #${data.orderNumber}`, html)
}

export async function sendShippingNotification(data: ShippingEmailData): Promise<void> {
  const html = `
<!DOCTYPE html>
<html lang="tr">
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#FAF7F2;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;color:#2C2C2C;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#FAF7F2;padding:40px 0;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#fff;border:1px solid #e5e0d8;">
        <tr><td style="background:#2C2C2C;padding:32px 40px;text-align:center;">
          <p style="margin:0;color:#C9A96E;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;">ScarletX Lingerie</p>
          <h1 style="margin:8px 0 0;color:#FAF7F2;font-size:24px;font-weight:300;">Siparişiniz Kargoya Verildi</h1>
        </td></tr>
        <tr><td style="padding:40px;">
          <p style="margin:0 0 16px;font-size:14px;line-height:1.6;color:#5C5C5C;">
            Merhaba ${data.fullName},<br>
            <strong>#${data.orderNumber}</strong> numaralı siparişiniz kargoya verildi.
            ${data.carrier ? `Kargo firması: <strong>${data.carrier}</strong>` : ''}
          </p>
          ${data.trackingCode
            ? `<div style="padding:16px;background:#FAF7F2;border:1px solid #e5e0d8;text-align:center;">
                <p style="margin:0;font-size:11px;letter-spacing:0.15em;text-transform:uppercase;color:#9C9C9C;">Takip Numarası</p>
                <p style="margin:8px 0 0;font-size:20px;font-weight:600;letter-spacing:0.1em;">${data.trackingCode}</p>
              </div>`
            : ''}
        </td></tr>
        <tr><td style="padding:24px 40px;border-top:1px solid #e5e0d8;text-align:center;">
          <p style="margin:0;font-size:11px;color:#9C9C9C;">
            <a href="mailto:destek@scarletxlingerie.com" style="color:#C9A96E;">destek@scarletxlingerie.com</a>
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`

  await send(data.to, `Siparişiniz Kargoya Verildi — #${data.orderNumber}`, html)
}
