import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ['pg', 'pgvector', '@neondatabase/serverless'],
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      "pg-native": false,
    };
    return config;
  },
};

export default nextConfig;