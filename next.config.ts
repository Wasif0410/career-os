import type { NextConfig } from "next";
import createMDX from "@next/mdx";

const nextConfig: NextConfig = {
  pageExtensions: ["ts", "tsx", "md", "mdx"],
  // AGENTS.md / CLAUDE.md in this repo are hand-written. Stop `next dev` from rewriting them.
  agentRules: false,
  poweredByHeader: false,
};

const withMDX = createMDX({
  options: {
    // Plugin names as strings so Turbopack can load them.
    remarkPlugins: ["remark-gfm"],
  },
});

export default withMDX(nextConfig);
