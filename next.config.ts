import type { NextConfig } from "next";
import createMDX from "@next/mdx";

const nextConfig: NextConfig = {
  pageExtensions: ["ts", "tsx", "md", "mdx"],
  // AGENTS.md / CLAUDE.md in this repo are hand-written. Stop `next dev` from rewriting them.
  agentRules: false,
  poweredByHeader: false,
  // Vercel already sends HSTS. These cover the rest of the basics without a CSP,
  // which would need nonces for the inline JSON-LD and Next's own scripts.
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), browsing-topics=()" },
        ],
      },
    ];
  },
};

const withMDX = createMDX({
  options: {
    // Plugin names as strings so Turbopack can load them.
    remarkPlugins: ["remark-gfm"],
  },
});

export default withMDX(nextConfig);
