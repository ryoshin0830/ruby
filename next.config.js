/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  env: {
    YAHOO_API_KEY: process.env.YAHOO_API_KEY
  },
  async rewrites() {
    return [
      {
        source: '/api/furigana',
        destination: '/api/furigana'
      }
    ]
  }
}

module.exports = nextConfig
