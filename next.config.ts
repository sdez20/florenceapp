import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Ship the knowledge-base markdown with the /api/chat serverless function so
  // Florence can read VOICE-RULES and the deep docs at runtime on Vercel.
  outputFileTracingIncludes: {
    "/api/chat": ["./florence-knowledge-base/**/*"],
    // The legal/safety pages read these markdown files at request time.
    "/legal/*": ["./src/content/legal/**/*"],
    "/safety": ["./src/content/legal/**/*"],
  },
};

export default nextConfig;
