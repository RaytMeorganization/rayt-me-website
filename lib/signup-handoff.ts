/** Website account, then the app for ratings and the snapshot. */
export const SIGN_UP_PATH = '/sign-up'
export const SETTINGS_PLAN_PATH = '/settings?tab=plan'

export function signupHandoff() {
  return {
    getStarted: SIGN_UP_PATH,
    afterAccount: '/verify',
    plans: SETTINGS_PLAN_PATH,
    ratingsAndSnapshot: 'app' as const,
    iosSellsPlans: false,
    androidBillingHook: 'left-for-store-launch' as const,
  }
}
