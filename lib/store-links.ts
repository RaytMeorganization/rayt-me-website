/** Public iOS App Store listing. Used only for Apple devices / App Store CTAs. */
export const IOS_APP_STORE_APP_ID = '6821832114'
export const IOS_APP_STORE_LISTING = `https://apps.apple.com/kr/app/rayt-me/id${IOS_APP_STORE_APP_ID}`

const ANDROID_PLAY_LISTING = 'https://play.google.com/store/apps/details?id=com.raytme.app'

function iosStoreUrl() {
  const fromEnv = process.env.NEXT_PUBLIC_APP_STORE_URL?.trim()
  if (fromEnv && fromEnv !== 'https://apps.apple.com/' && fromEnv !== 'https://apps.apple.com') {
    return fromEnv
  }
  return IOS_APP_STORE_LISTING
}

function androidStoreUrl() {
  return process.env.NEXT_PUBLIC_PLAY_STORE_URL?.trim() || ANDROID_PLAY_LISTING
}

const IOS = iosStoreUrl()
const ANDROID = androidStoreUrl()

export function storeUrlForUserAgent(userAgent: string | null | undefined): string {
  const ua = userAgent ?? ''
  if (/iPhone|iPad|iPod/i.test(ua)) return IOS
  if (/Android/i.test(ua)) return ANDROID
  return IOS
}

export { IOS as APP_STORE_URL, ANDROID as PLAY_STORE_URL }
