import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  compiler: {
    styledComponents: true,
  },
  images: {
    remotePatterns: [
      // Allow product images served from backend API storage
      {
        protocol: "https",
        hostname: "api.artlighthouse.ge",
        pathname: "/storage/**",
      },
      // Allow UI Avatars service for user avatars
      {
        protocol: "https",
        hostname: "ui-avatars.com",
        pathname: "/api/**",
      },
      // Allow product images served from backend API storage
      {
        protocol: "https",
        hostname: "api.artlighthouse.ge",
        pathname: "/storage/**",
      },
    ],
  },
};

export default nextConfig;
