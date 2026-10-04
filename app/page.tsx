import RateMeLanding from '@/components/rate-me/landing-page'
import { buildHomePageMetadata } from '@/lib/seo'

export const metadata = buildHomePageMetadata()

export default function Page() {
  return <RateMeLanding />
}
