import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental:{
    serverActions:{bodySizeLimit:"100mb"}
  },
  /* config options here */
  images:{
    remotePatterns: [
      {
        protocol: 'https',
        hostname: "cdn.sanity.io",
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: "images.unsplash.com",
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: "res.cloudinary.com",
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: "avatars.githubusercontent.com",
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: "lh3.googleusercontent.com",
        port: '',
        pathname: '/**',
      }
    ],
  }
};

export default nextConfig;
