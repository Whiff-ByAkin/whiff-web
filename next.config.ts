import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [{ source: "/owner/:path*", headers: [
      { key: "X-Robots-Tag", value: "noindex, nofollow" },
      { key: "Cache-Control", value: "private, no-store" },
      { key: "Referrer-Policy", value: "no-referrer" },
      { key: "X-Frame-Options", value: "DENY" },
    ] }];
  },
  // Runtime environment values and local preview notes never belong in a
  // deployable server bundle. Production persists wall notes in MongoDB.
  outputFileTracingExcludes: {
    "/*": ["./.data/**/*", "./.env*", "./tests/**/*", "./next.config.ts"],
  },
};

export default nextConfig;
