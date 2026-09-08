import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Runtime environment values and local preview notes never belong in a
  // deployable server bundle. Production persists wall notes in MongoDB.
  outputFileTracingExcludes: {
    "/*": ["./.data/**/*", "./.env*", "./tests/**/*", "./next.config.ts"],
  },
};

export default nextConfig;
