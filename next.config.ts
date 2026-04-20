import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "s3.ap-southeast-1.wasabisys.com" },
    ],
  },
};

export default nextConfig;
