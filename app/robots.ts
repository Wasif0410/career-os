import type { MetadataRoute } from "next";
import { appNav, accountNav } from "@/components/app/nav-items";
import { site, vercelEnv } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  // Preview deployments are public URLs. Keep crawlers off them.
  if (vercelEnv && vercelEnv !== "production") {
    return { rules: { userAgent: "*", disallow: "/" } };
  }
  return {
    // The student app is private. Its pages also send noindex.
    rules: { userAgent: "*", allow: "/", disallow: [...appNav, ...accountNav].map((item) => item.href) },
    sitemap: `${site.url}/sitemap.xml`,
  };
}
