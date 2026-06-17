import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";
import { curriculum } from "@/lib/curriculum";
import { stems } from "@/lib/stems";

// Every indexable route: the marketing/orient pages, all curriculum modules,
// and all deep stems. Regenerated at build time from the same data the app
// renders, so it can never fall out of sync.
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const top: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/atlas`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE_URL}/stack`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/plan`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/deck`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
  ];

  const modules: MetadataRoute.Sitemap = curriculum.map((m) => ({
    url: `${SITE_URL}/learn/${m.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const stemRoutes: MetadataRoute.Sitemap = stems.map((s) => ({
    url: `${SITE_URL}/stem/${s.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...top, ...modules, ...stemRoutes];
}
