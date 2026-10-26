import { Suspense } from 'react'
import { buildPublicPageMetadata } from '@/lib/seo'
import { redirect } from 'next/navigation'
import { AuthForm } from '@/components/product/auth-form'
import { WEB_SIGN_IN_DISABLED } from '@/lib/web-sign-in'

export const metadata = buildPublicPageMetadata({
  title: 'Sign in',
  description: 'Sign in to your RaytME account.',
  path: '/sign-in',
  noindex: true,
})

export default function SignInPage() {
  if (WEB_SIGN_IN_DISABLED) redirect('/')
  return (
    <Suspense>
      <AuthForm mode="sign-in" />
    </Suspense>
  )
}
