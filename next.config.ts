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
    ],
  },
};

export default nextConfig;
