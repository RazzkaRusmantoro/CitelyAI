import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["@react-pdf/renderer"],
  eslint: {
    ignoreDuringBuilds: true
  }
};

export default nextConfig;
