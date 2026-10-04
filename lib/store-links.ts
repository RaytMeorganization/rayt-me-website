const IOS =
  process.env.NEXT_PUBLIC_APP_STORE_URL?.trim() || 'https://apps.apple.com/app/id0000000000'
const ANDROID =
  process.env.NEXT_PUBLIC_PLAY_STORE_URL?.trim() ||
  'https://play.google.com/store/apps/details?id=com.raytme.app'

export function storeUrlForUserAgent(userAgent: string | null | undefined): string {
  const ua = userAgent ?? ''
  if (/iPhone|iPad|iPod/i.test(ua)) return IOS
  if (/Android/i.test(ua)) return ANDROID
  return IOS
}

export { IOS as APP_STORE_URL, ANDROID as PLAY_STORE_URL }
