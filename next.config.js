/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['media-waterdeep.cursecdn.com']
  },
}

module.exports = nextConfig
