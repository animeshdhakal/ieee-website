import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
  images: {
    // Serve modern formats and cache optimized variants for 30 days.
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60 * 60 * 24 * 30,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "jqzszcxikvyoblrwheif.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;
