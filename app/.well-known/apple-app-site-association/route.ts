import { NextResponse } from 'next/server'

/** Universal Links for Rayt Me on https://raytme.me (not api.raytme.me). */
export function GET() {
  const teamId = process.env.APPLE_TEAM_ID?.trim()
  const details = teamId
    ? [
        {
          appID: `${teamId}.me.rate.rayt`,
          paths: ['/p/*'],
        },
      ]
    : []

  return NextResponse.json(
    {
      applinks: {
        apps: [],
        details,
      },
    },
    {
      headers: {
        'content-type': 'application/json',
        'cache-control': 'public, max-age=3600',
      },
    },
  )
}
