/**
 * Web account flows. Set `NEXT_PUBLIC_WEB_SIGN_IN_DISABLED=true` to pause sign-in.
 * Sign-up is off unless `NEXT_PUBLIC_WEB_SIGN_UP_DISABLED=false`.
 */
export const WEB_SIGN_IN_DISABLED =
  process.env.NEXT_PUBLIC_WEB_SIGN_IN_DISABLED === 'true'
export const WEB_SIGN_UP_DISABLED =
  process.env.NEXT_PUBLIC_WEB_SIGN_UP_DISABLED !== 'false'
