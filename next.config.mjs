/** @type {import('next').NextConfig} */
const backend = (process.env.API_PROXY_TARGET || 'http://localhost:4000').replace(/\/$/, '')

const nextConfig = {
  async rewrites() {
    return [{ source: '/backend/:path*', destination: `${backend}/:path*` }]
  },
  // Temporary: remove this block when WEB_SIGN_IN_DISABLED is flipped in lib/web-sign-in.ts
  async redirects() {
    return [{ source: '/sign-in', destination: '/', permanent: false }]
  },
}

export default nextConfig
