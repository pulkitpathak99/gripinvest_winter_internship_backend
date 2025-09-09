/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable standalone build for Docker
  output: 'standalone',
  
  // Fix turbopack workspace root warning
  turbopack: {
    root: '/app'
  },
  
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  
  typescript: {
    // Warning: This allows production builds to successfully complete even if
    // your project has type errors.
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;