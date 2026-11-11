/** Public iOS App Store listing. Used only for Apple devices / App Store CTAs. */
export const IOS_APP_STORE_APP_ID = '6821832114'
export const IOS_APP_STORE_LISTING = `https://apps.apple.com/app/rayt-me/id${IOS_APP_STORE_APP_ID}`

/** Public Google Play listing for `com.raytme.app`. */
export const ANDROID_PLAY_PACKAGE = 'com.raytme.app'
export const ANDROID_PLAY_LISTING =
  `https://play.google.com/store/apps/details?id=${ANDROID_PLAY_PACKAGE}&hl=en`

function iosStoreUrl() {
  const fromEnv = process.env.NEXT_PUBLIC_APP_STORE_URL?.trim()
  if (fromEnv && fromEnv !== 'https://apps.apple.com/' && fromEnv !== 'https://apps.apple.com') {
    return fromEnv
  }
  return IOS_APP_STORE_LISTING
}

function androidStoreUrl() {
  const fromEnv = process.env.NEXT_PUBLIC_PLAY_STORE_URL?.trim()
  // Reject bare Play homepage / missing package so Docker defaults cannot break CTAs.
  if (
    fromEnv &&
    fromEnv !== 'https://play.google.com/store' &&
    fromEnv !== 'https://play.google.com/store/' &&
    fromEnv.includes(`id=${ANDROID_PLAY_PACKAGE}`)
  ) {
    return fromEnv
  }
  return ANDROID_PLAY_LISTING
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
