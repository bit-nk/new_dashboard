import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/crushbank_dashboard",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
