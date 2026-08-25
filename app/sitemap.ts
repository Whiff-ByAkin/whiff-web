import type { MetadataRoute } from "next";
import { ROLES } from "./config/roles";
import { SITE_URL } from "./config/site";

// A fixed date keeps this sitemap statically generated and deterministic.
// Bump it when page content meaningfully changes — a lastmod that silently
// tracks the build date teaches crawlers to ignore the field.
const CONTENT_UPDATED = new Date("2026-08-18");
const LEGAL_UPDATED = new Date("2026-08-21");
const STATES_ADDED = new Date("2026-08-24");
const ROLES_ADDED = new Date("2026-08-25");

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
      url: url("/states"),
      lastModified: STATES_ADDED,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    // The six role pages. They are share targets first and pages second, but
    // they carry real copy that exists nowhere else on the site, so they are
    // worth crawling. Below /blog and above /support in priority for that
    // reason: distinct content, no conversion job of their own.
    ...ROLES.map((role) => ({
      url: url(`/roles/${role.id}`),
      lastModified: ROLES_ADDED,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    {
      url: url("/support"),
      lastModified: LEGAL_UPDATED,
      changeFrequency: "monthly",
      priority: 0.5,
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
