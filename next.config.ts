import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  distDir: 'dist',
  images: {
    unoptimized: true,
  },
  // Disable API routes in static export
  trailingSlash: true,
};

export default nextConfig;
