'use server'

import { signIn } from '@/lib/auth'
import { AuthError } from 'next-auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db'
import { compare } from 'bcryptjs'

export async function loginAction(
  _prevState: string | null,
  formData: FormData
): Promise<string | null> {
  const email      = formData.get('email') as string
  const password   = formData.get('password') as string
  const callbackUrl = (formData.get('callbackUrl') as string) || ''

  // Rol tespiti için önce kullanıcıyı sorgula
  const user = await prisma.user.findUnique({ where: { email } })
  if (!user || !user.password) return 'E-posta veya şifre hatalı. Lütfen tekrar deneyin.'
  const valid = await compare(password, user.password)
  if (!valid) return 'E-posta veya şifre hatalı. Lütfen tekrar deneyin.'

  // Role göre yönlendirme hedefini belirle
  const destination =
    callbackUrl && callbackUrl.startsWith('/')
      ? callbackUrl
      : user.role === 'ADMIN'
        ? '/admin'
        : '/hesabim'

  try {
    await signIn('credentials', { email, password, redirectTo: destination })
  } catch (error) {
    if (error instanceof AuthError) {
      return 'E-posta veya şifre hatalı. Lütfen tekrar deneyin.'
    }
    // NEXT_REDIRECT — başarılı giriş
    throw error
  }
  redirect(destination)
}
