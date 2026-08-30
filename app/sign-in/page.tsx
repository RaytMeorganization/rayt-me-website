import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import { AuthForm } from '@/components/product/auth-form'
import { WEB_SIGN_IN_DISABLED } from '@/lib/web-sign-in'

export default function SignInPage() {
  if (WEB_SIGN_IN_DISABLED) redirect('/')
  return (
    <Suspense>
      <AuthForm mode="sign-in" />
    </Suspense>
  )
}
