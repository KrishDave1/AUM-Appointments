import { join } from "path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingIncludes: {
    "/api/**/*": [join(__dirname, "src", "prisma-client", "**", "*")],
  },
};

export default nextConfig;
