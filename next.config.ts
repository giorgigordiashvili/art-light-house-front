import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  compiler: {
    styledComponents: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img.clerk.com",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "images.clerk.dev",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "cdn.clerk.dev",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "cdn.clerk.app",
        pathname: "**",
      },
    ],
  },
};

export default nextConfig;
