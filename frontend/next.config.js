/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Disable ESLint for production build
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Disable TypeScript check during build
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;
