import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  images: {
    // Admin can set logo / favicon / tech-stack / product image URLs from any host.
    remotePatterns: [{ protocol: "https", hostname: "**" }],
    formats: ["image/avif", "image/webp"],
  },
  experimental: {
    // Smaller client bundles → faster PageSpeed (tree-shakes icon/util barrels).
    optimizePackageImports: ["lucide-react", "lodash"],
  },
};

export default nextConfig;
