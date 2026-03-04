import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Fix workspace root detection warning
  outputFileTracingRoot: require('path').join(__dirname, '../'),

  // Performance optimizations
  reactStrictMode: true,

  // Optimize compilation
  swcMinify: true,



  // Enable experimental features for better performance
  experimental: {
    optimizePackageImports: ['lucide-react', 'recharts', '@radix-ui/react-avatar', '@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu'],
  },
};

export default nextConfig;
