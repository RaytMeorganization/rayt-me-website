import { requestLocale } from '@/lib/request-locale'
import RateMeLanding from '@/components/rate-me/landing-page'
import { buildHomePageMetadata } from '@/lib/seo'

export async function generateMetadata() {
  return buildHomePageMetadata(await requestLocale())
}

export default function Page() {
  return <RateMeLanding />
}
