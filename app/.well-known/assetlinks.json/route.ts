import { NextResponse } from 'next/server'

/**
 * Android App Links for Rayt Me on https://raytme.me (not api.raytme.me).
 * Mirrors the iOS AASA route: identity comes from env so no signing data lives in git.
 *
 * ANDROID_SHA256_CERT_FINGERPRINTS — comma-separated upload/app-signing SHA-256
 * fingerprints (Play Console → App integrity, or `eas credentials`).
 */
export function GET() {
  const fingerprints = (process.env.ANDROID_SHA256_CERT_FINGERPRINTS ?? '')
    .split(',')
    .map((value) => value.trim().toUpperCase())
    .filter(Boolean)

  const statements = fingerprints.length
    ? [
        {
          relation: ['delegate_permission/common.handle_all_urls'],
          target: {
            namespace: 'android_app',
            package_name: 'com.raytme.app',
            sha256_cert_fingerprints: fingerprints,
          },
        },
      ]
    : []

  return NextResponse.json(statements, {
    headers: {
      'content-type': 'application/json',
      'cache-control': 'public, max-age=3600',
    },
  })
}
