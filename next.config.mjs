/** @type {import('next').NextConfig} */
const backend = (process.env.API_PROXY_TARGET || 'http://localhost:4000').replace(/\/$/, '')

const nextConfig = {
  transpilePackages: ['@rayt-me/plan-pricing'],
  async rewrites() {
    return [{ source: '/backend/:path*', destination: `${backend}/:path*` }]
  },
  async redirects() {
    const signInOff = process.env.NEXT_PUBLIC_WEB_SIGN_IN_DISABLED === 'true'
    const signUpOff = process.env.NEXT_PUBLIC_WEB_SIGN_UP_DISABLED === 'true'
    return [
      ...(signInOff
        ? [{ source: '/sign-in', destination: '/', permanent: false }]
        : []),
      ...(signUpOff
        ? [{ source: '/sign-up', destination: '/', permanent: false }]
        : []),
    ]
  },
}

export default nextConfig
