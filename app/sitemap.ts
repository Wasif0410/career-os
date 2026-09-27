import type { MetadataRoute } from "next";
import { guides } from "@/lib/guides";
import { site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["", "/pricing", "/coaches", "/guides", "/privacy"].map((path) => ({
    url: `${site.url}${path}`,
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.7,
  }));
  const articles = guides.map((g) => ({
    url: `${site.url}/guides/${g.slug}`,
    lastModified: g.published,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));
  return [...pages, ...articles];
}
