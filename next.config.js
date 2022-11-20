/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  images: {
    domains: ['media-waterdeep.cursecdn.com']
  },
}

module.exports = nextConfig
