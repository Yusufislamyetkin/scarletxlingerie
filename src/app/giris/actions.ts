'use server'

import { signIn } from '@/lib/auth'
import { AuthError } from 'next-auth'

export async function loginAction(
  _prevState: string | null,
  formData: FormData
): Promise<string | null> {
  try {
    await signIn('credentials', {
      email:      formData.get('email'),
      password:   formData.get('password'),
      redirectTo: (formData.get('callbackUrl') as string) || '/hesabim',
    })
  } catch (error) {
    if (error instanceof AuthError) {
      return 'E-posta veya şifre hatalı. Lütfen tekrar deneyin.'
    }
    // NEXT_REDIRECT — başarılı giriş, Next.js yönlendirme işlemi
    throw error
  }
  return null
}
