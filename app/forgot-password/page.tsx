import type { Metadata } from 'next'

import { ForgotPasswordForm } from '@/components/product/forgot-password-form'
import { buildPublicPageMetadata } from '@/lib/seo'

export const metadata = buildPublicPageMetadata({
  title: 'Forgot password',
  description: 'Reset your RaytME password with a one-time code sent to your email.',
  path: '/forgot-password',
})

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />
}
