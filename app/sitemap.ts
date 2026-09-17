import type { MetadataRoute } from "next";
import { ROLES } from "./config/roles";
import { SITE_URL } from "./config/site";

// A fixed date keeps this sitemap statically generated and deterministic.
// Bump it when page content meaningfully changes — a lastmod that silently
// tracks the build date teaches crawlers to ignore the field.
const CONTENT_UPDATED = new Date("2026-09-08");
const HOME_UPDATED = new Date("2026-09-17");
const LEGAL_UPDATED = new Date("2026-09-15");
const STATES_ADDED = new Date("2026-09-08");
const ROLES_ADDED = new Date("2026-09-08");

export default function sitemap(): MetadataRoute.Sitemap {
  const url = (path: string) => new URL(path, SITE_URL).toString();

  return [
    {
      url: url("/"),
      lastModified: HOME_UPDATED,
      changeFrequency: "weekly",
      priority: 1,
    },
    { url: url("/mn"), lastModified: HOME_UPDATED, changeFrequency: "monthly", priority: 0.9 },
    {
      url: url("/blog"),
      lastModified: CONTENT_UPDATED,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: url("/roast"),
      lastModified: new Date("2026-09-08"),
      changeFrequency: "weekly",
      priority: 0.7,
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
