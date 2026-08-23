/** @type {import('next').NextConfig} */
const backend = (process.env.API_PROXY_TARGET || 'http://localhost:4000').replace(/\/$/, '')

const nextConfig = {
  async rewrites() {
    return [{ source: '/backend/:path*', destination: `${backend}/:path*` }]
  },
}

export default nextConfig
