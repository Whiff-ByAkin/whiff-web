import type { MetadataRoute } from "next";

export const dynamic = "force-static";

const SITE_URL = "https://whiff-ai.com";

// AI assistants and answer engines we explicitly welcome, so whiff can be
// discovered and accurately cited by ChatGPT, Perplexity, Claude, Gemini, etc.
const AI_CRAWLERS = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "PerplexityBot",
  "Perplexity-User",
  "ClaudeBot",
  "Claude-User",
  "Claude-SearchBot",
  "anthropic-ai",
  "Google-Extended",
  "Applebot-Extended",
  "Amazonbot",
  "cohere-ai",
  "DuckAssistBot",
  "Meta-ExternalAgent",
  "CCBot",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/"],
      },
      {
        userAgent: AI_CRAWLERS,
        allow: "/",
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
