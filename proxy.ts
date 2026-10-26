import { NextResponse, type NextRequest } from 'next/server'
import { isLocalizedPath, LOCALE_HEADER, splitLocalePath } from '@/lib/locale-routes'

// /ar/<page> renders the same page in Arabic: rewrite to the English route and tell
// the layout/pages the locale via a request header (always overwritten, never trusted from clients).
export function proxy(request: NextRequest) {
  const { locale, path } = splitLocalePath(request.nextUrl.pathname)
  const requestHeaders = new Headers(request.headers)
  if (locale === 'ar') {
    if (!isLocalizedPath(path)) {
      requestHeaders.set(LOCALE_HEADER, 'en')
      return NextResponse.next({ request: { headers: requestHeaders } })
    }
    requestHeaders.set(LOCALE_HEADER, 'ar')
    const url = request.nextUrl.clone()
    url.pathname = path
    return NextResponse.rewrite(url, { request: { headers: requestHeaders } })
  }
  requestHeaders.set(LOCALE_HEADER, 'en')
  return NextResponse.next({ request: { headers: requestHeaders } })
}

export const config = {
  matcher: ['/((?!_next/|backend/|\\.well-known/|.*\\.[A-Za-z0-9]+$).*)'],
}
