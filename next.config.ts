import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingIncludes: {
    "/api/**/*": ["./src/prisma-client/**/*"],
  },
};

export default nextConfig;
