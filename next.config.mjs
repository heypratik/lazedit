// import type { NextConfig } from "next";

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "replicate.delivery",
      },
    ],
  },
  /* config options here */
};

export default nextConfig;
