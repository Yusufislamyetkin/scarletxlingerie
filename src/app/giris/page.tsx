'use client'

import { useActionState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import Link from 'next/link'
import { Loader2, Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'
import { loginAction } from './actions'

function LoginForm() {
  const searchParams  = useSearchParams()
  const callbackUrl   = searchParams.get('callbackUrl') || '/hesabim'
  const [showPass, setShowPass] = useState(false)
  const [error, formAction, isPending] = useActionState(loginAction, null)

  return (
    <div className="min-h-screen bg-ivory flex items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-8">
        {/* Logo */}
        <div className="text-center space-y-3">
          <Link href="/" className="inline-block font-serif text-3xl text-charcoal">
            Scarlet<span className="text-scarlet">X</span>
          </Link>
          <span className="gold-divider" />
          <h1 className="font-serif text-2xl text-charcoal">Giriş Yapın</h1>
          <p className="text-sm font-light text-stone">Hesabınıza erişmek için e-posta ve şifrenizi girin.</p>
        </div>

        {/* Form */}
        <form action={formAction} className="space-y-4" noValidate>
          <input type="hidden" name="callbackUrl" value={callbackUrl} />

          <div className="space-y-1.5">
            <label htmlFor="email" className="block text-[11px] font-sans font-medium tracking-widest uppercase text-stone">
              E-posta
            </label>
            <input
              id="email"
              type="email"
              name="email"
              required
              autoComplete="email"
              placeholder="ornek@email.com"
              className="w-full px-4 py-3 text-sm font-sans font-light border border-border bg-warm-white text-charcoal placeholder:text-pebble focus:outline-none focus:border-charcoal transition-colors"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="block text-[11px] font-sans font-medium tracking-widest uppercase text-stone">
                Şifre
              </label>
              <Link href="/sifremi-unuttum" className="text-[11px] font-light text-stone hover:text-charcoal transition-colors">
                Şifremi Unuttum
              </Link>
            </div>
            <div className="relative">
              <input
                id="password"
                type={showPass ? 'text' : 'password'}
                name="password"
                required
                autoComplete="current-password"
                placeholder="••••••••"
                className="w-full px-4 py-3 pr-11 text-sm font-sans font-light border border-border bg-warm-white text-charcoal placeholder:text-pebble focus:outline-none focus:border-charcoal transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPass(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-pebble hover:text-charcoal transition-colors"
                tabIndex={-1}
                aria-label={showPass ? 'Şifreyi gizle' : 'Şifreyi göster'}
              >
                {showPass ? <EyeOff size={16} strokeWidth={1.5} /> : <Eye size={16} strokeWidth={1.5} />}
              </button>
            </div>
          </div>

          {error && (
            <p className="text-xs text-scarlet font-light bg-scarlet/5 border border-scarlet/20 px-3 py-2.5">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="btn-primary w-full mt-2"
          >
            {isPending ? <Loader2 size={16} className="animate-spin" /> : 'Giriş Yap'}
          </button>
        </form>

        {/* Kayıt */}
        <p className="text-center text-xs font-sans font-light text-stone">
          Hesabınız yok mu?{' '}
          <Link href="/kayit" className="text-charcoal font-medium hover:text-scarlet transition-colors underline underline-offset-2">
            Ücretsiz Üye Olun
          </Link>
        </p>
      </div>
    </div>
  )
}

export default function GirisPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-scarlet border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <LoginForm />
    </Suspense>
  )
}
