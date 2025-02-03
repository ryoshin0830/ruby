/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  env: {
    NEXT_PUBLIC_YAHOO_API_KEY: process.env.NEXT_PUBLIC_YAHOO_API_KEY
  }
}

module.exports = nextConfig
