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
      {
        protocol: "https",
        hostname: "testapi.artlighthouse.ge",
        pathname: "**",
      },
    ],
  },
};

export default nextConfig;
