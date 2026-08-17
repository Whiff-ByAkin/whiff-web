import type { MetadataRoute } from "next";
import { SITE_URL } from "./config/site";

// A fixed date keeps this sitemap statically generated and deterministic.
// Bump it when page content meaningfully changes — a lastmod that silently
// tracks the build date teaches crawlers to ignore the field.
const CONTENT_UPDATED = new Date("2026-08-15");
const LEGAL_UPDATED = new Date("2026-07-22");

export default function sitemap(): MetadataRoute.Sitemap {
  const url = (path: string) => new URL(path, SITE_URL).toString();

  return [
    {
      url: url("/"),
      lastModified: CONTENT_UPDATED,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: url("/blog"),
      lastModified: CONTENT_UPDATED,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: url("/privacy"),
      lastModified: LEGAL_UPDATED,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: url("/terms"),
      lastModified: LEGAL_UPDATED,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];
}
