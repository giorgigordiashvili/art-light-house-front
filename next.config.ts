import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  compiler: {
    styledComponents: true,
  },
  images: {
    formats: ["image/avif", "image/webp"],
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
      {
        protocol: "https",
        hostname: "echodesk-spaces.fra1.digitaloceanspaces.com",
        pathname: "**",
      },
    ],
  },
  experimental: {
    optimizePackageImports: [
      "@mui/material",
      "@mui/x-date-pickers",
      "framer-motion",
      "swiper",
      "dayjs",
      "@vis.gl/react-google-maps",
      "@react-google-maps/api",
    ],
  },
};

export default nextConfig;
