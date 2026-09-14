/**
 * Web account flows. Set `NEXT_PUBLIC_WEB_SIGN_IN_DISABLED=true` or
 * `NEXT_PUBLIC_WEB_SIGN_UP_DISABLED=true` to pause marketing CTAs and redirects.
 */
export const WEB_SIGN_IN_DISABLED =
  process.env.NEXT_PUBLIC_WEB_SIGN_IN_DISABLED === 'true'
export const WEB_SIGN_UP_DISABLED =
  process.env.NEXT_PUBLIC_WEB_SIGN_UP_DISABLED === 'true'
