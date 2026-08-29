import { Suspense } from 'react'
import { AuthForm } from '@/components/product/auth-form'

export default function SignUpPage() {
  return <Suspense><AuthForm mode="sign-up" /></Suspense>
}
