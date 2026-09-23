/** Live public site origin. Override with NEXT_PUBLIC_SITE_URL if needed. */
export const SITE_ORIGIN =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') || 'https://raytme.me'

export function siteUrl(path = '/') {
  if (!path || path === '/') return SITE_ORIGIN
  return `${SITE_ORIGIN}${path.startsWith('/') ? path : `/${path}`}`
}
