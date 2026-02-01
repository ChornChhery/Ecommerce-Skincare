import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Configure image optimization
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: '**.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'berichthailand.com',
      },
      {
        protocol: 'https',
        hostname: 'yvescosmetic.com',
      },
    ],
    unoptimized: false, // Changed from conditional to false for consistency
  },
  
  // Experimental features for better performance
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
  
  // Webpack optimization
  webpack: (config, { isServer }) => {
    // Reduce bundle size
    if (!isServer) {
      // Only apply these optimizations on client builds
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              chunks: 'all',
            },
          },
        },
      };
    }
    
    return config;
  },
};

export default nextConfig;
