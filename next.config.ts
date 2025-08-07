import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
    ],
    domains: [
      'res.cloudinary.com',
      'lemagdelaconso.ouest-france.fr',
      'example.com',
      'cdn.yourapp.com',
      'images.unsplash.com',
      'picsum.photos',
    ],
  },
};

export default nextConfig;
