/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  env: {
    YAHOO_API_KEY: process.env.YAHOO_API_KEY
  }
}

module.exports = nextConfig
