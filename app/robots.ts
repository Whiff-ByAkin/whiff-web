import type { MetadataRoute } from "next";
import { SITE_URL } from "./config/site";

/* Two crawler families matter now, and they are not the same thing:

   - Search crawlers (Googlebot, Bingbot) build the index.
   - AI crawlers split into *training* crawlers (GPTBot, ClaudeBot, Google-
     Extended) and *retrieval* crawlers that fetch a page to answer a live user
     question and cite it (OAI-SearchBot, ChatGPT-User, PerplexityBot,
     Claude-SearchBot). Blocking the retrieval crawlers is what removes a brand
     from AI answers, and it is commonly done by accident with a blanket rule.

   whiff wants to be cited, so everything is allowed explicitly rather than
   relying on a wildcard that a future edit might narrow. */
const AI_CRAWLERS = [
  // OpenAI
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  // Anthropic
  "ClaudeBot",
  "Claude-SearchBot",
  "Claude-User",
  "anthropic-ai",
  // Perplexity
  "PerplexityBot",
  "Perplexity-User",
  // Google (Gemini / AI Overviews grounding)
  "Google-Extended",
  // Microsoft Copilot
  "BingBot",
  // Common Crawl — the corpus a great many models are trained from
  "CCBot",
  // Others
  "Applebot",
  "Applebot-Extended",
  "Amazonbot",
  "meta-externalagent",
  "cohere-ai",
  "DuckAssistBot",
  "YouBot",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Next.js internals: no value to a crawler, and they waste crawl budget.
        disallow: ["/_next/static/chunks/", "/api/"],
      },
      { userAgent: AI_CRAWLERS, allow: "/" },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
