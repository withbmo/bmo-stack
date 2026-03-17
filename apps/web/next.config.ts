import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: [
    '@pytholit/contracts',
    '@pytholit/validation',
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
  /**
   * Proxy API requests to the backend in development.
   * This eliminates cross-origin cookie issues.
   */
  async rewrites() {
    return [
      {
        source: '/api/v1/:path*',
        destination: 'http://localhost:3001/api/v1/:path*',
      },
    ];
  },
};

export default nextConfig;
