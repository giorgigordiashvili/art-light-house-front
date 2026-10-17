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
      {
        // Hetzner object storage — EchoDesk media host since the June 2026
        // migration off DigitalOcean (gallery images live here now).
        protocol: "https",
        hostname: "echodesk-media.fsn1.your-objectstorage.com",
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
    ],
  },
};

export default nextConfig;
