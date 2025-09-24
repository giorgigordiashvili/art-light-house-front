import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  compiler: {
    styledComponents: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "testapi.artlighthouse.ge",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "art-light-house-images.fra1.cdn.digitaloceanspaces.com",
        pathname: "**",
      },
    ],
  },
};

export default nextConfig;
