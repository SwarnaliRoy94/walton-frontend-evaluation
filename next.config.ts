import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.waltonplaza.com.bd",
      },
      {
        protocol: "https",
        hostname: "devcdn.waltonplaza.com.bd",
      },
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
