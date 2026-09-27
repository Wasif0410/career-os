import type { MetadataRoute } from "next";
import { site, vercelEnv } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  // Preview deployments are public URLs. Keep crawlers off them.
  if (vercelEnv && vercelEnv !== "production") {
    return { rules: { userAgent: "*", disallow: "/" } };
  }
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${site.url}/sitemap.xml`,
  };
}
