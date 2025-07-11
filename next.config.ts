/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Use remotePatterns instead of domains for Next.js 13+
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '**', // Allow any path for Cloudinary
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        port: '',
        pathname: '**', // Allow any path for Google user content
      },
      {
        protocol: 'https',
        hostname: 'placehold.co', // ADDED: Allow images from placehold.co
        port: '',
        pathname: '**', // Allow any path for placehold.co
      },
      // Add other remote patterns as needed
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
  // Other Next.js configurations can go here
};

module.exports = nextConfig;
