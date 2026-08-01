import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    experimental: {
    serverActions: {
      allowedOrigins: ['*.app.github.dev', '*.github.dev'],
    },
  },
  };

  export default nextConfig;
