import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import { AuthForm } from '@/components/product/auth-form'
import { WEB_SIGN_UP_DISABLED } from '@/lib/web-sign-in'

export default function SignUpPage() {
  if (WEB_SIGN_UP_DISABLED) redirect('/')
  return (
    <Suspense>
      <AuthForm mode="sign-up" />
    </Suspense>
  )
}
