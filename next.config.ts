import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "sd-style-images.wall-breaker-no4.xyz",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
