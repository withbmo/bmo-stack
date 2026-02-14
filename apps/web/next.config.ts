import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: [
    '@pytholit/contracts',
    '@pytholit/validation',
    '@pytholit/config',
    '@pytholit/utils',
    '@pytholit/ui',
  ],
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
