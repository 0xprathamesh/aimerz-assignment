import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  serverExternalPackages: ["mongoose"],
  images: {
    domains: ["localhost"],
  },
  skipTrailingSlashRedirect: true,
  generateBuildId: async () => {
    return "build-" + Date.now();
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
  skipMiddlewareUrlNormalize: true,
  // Environment variables will be handled by the runtime environment
};

export default nextConfig;
