/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  images: {
    domains: ['media-waterdeep.cursecdn.com']
  },
  // remotePatterns: [
  //   {
  //     protocol: 'https',
  //     hostname: 'media-waterdeep.cursecdn.com',
  //     port: '',
  //     pathname: '/avatars/thumbnails/**',
  //   },
  // ],
}

module.exports = nextConfig
