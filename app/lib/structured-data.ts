import {
  CONTACT_EMAIL,
  FOUNDED_YEAR,
  INSTAGRAM_URL,
  LIVE_MARKETS,
  SITE_NAME,
  SITE_URL,
} from "@/app/config/site";
import { ANSWER, PROMISE } from "@/app/seo-content";

/* The site is a single page, so this is the whole graph: who whiff is, the
   website itself, and what it does. It is emitted once, on `/`.

   The file used to also build FAQPage, HowTo, DefinedTermSet, BreadcrumbList,
   per-city Service and Event nodes. Those described pages that no longer
   exist, and structured data for a URL you do not serve is worse than none —
   it is a mismatch a crawler will hold against the domain. They went with the
   pages. Restoring them means restoring the pages first.

   Stable @ids are kept: if content pages ever return, every node already has a
   canonical identity to merge against. */
export const ORG_ID = `${SITE_URL}/#organization`;
export const WEBSITE_ID = `${SITE_URL}/#website`;
export const SERVICE_ID = `${SITE_URL}/#service`;

export const abs = (path = "/") => new URL(path, SITE_URL).toString();

type Node = Record<string, unknown>;

export const organization: Node = {
  "@type": "Organization",
  "@id": ORG_ID,
  name: SITE_NAME,
  alternateName: "Whiff",
  url: SITE_URL,
  description: ANSWER,
  slogan: PROMISE,
  foundingDate: FOUNDED_YEAR,
  logo: {
    "@type": "ImageObject",
    url: abs("/whiff-mascot.png"),
    width: 2160,
    height: 3870,
  },
  image: abs("/opengraph-image"),
  sameAs: [INSTAGRAM_URL],
  email: CONTACT_EMAIL,
  contactPoint: [
    {
      "@type": "ContactPoint",
      contactType: "customer support",
      email: CONTACT_EMAIL,
      availableLanguage: ["English"],
      areaServed: "US",
    },
  ],
  areaServed: LIVE_MARKETS.map((m) => ({
    "@type": "City",
    name: m.city,
    address: {
      "@type": "PostalAddress",
      addressLocality: m.city,
      addressRegion: m.stateAbbr,
      addressCountry: "US",
    },
  })),
  knowsAbout: [
    "making friends as an adult",
    "activity-based social groups",
    "friendship circles",
    "meeting people after moving to a new city",
    "social connection for remote workers",
  ],
};

export const website: Node = {
  "@type": "WebSite",
  "@id": WEBSITE_ID,
  url: SITE_URL,
  name: SITE_NAME,
  description: ANSWER,
  publisher: { "@id": ORG_ID },
  inLanguage: "en-US",
};

export const service: Node = {
  "@type": "Service",
  "@id": SERVICE_ID,
  name: "whiff friendship circles",
  serviceType: "Activity-first friendship matching and group experiences",
  description: ANSWER,
  url: SITE_URL,
  provider: { "@id": ORG_ID },
  audience: {
    "@type": "Audience",
    audienceType:
      "Adults who recently moved to a new city, remote workers, and people seeking a friend group or activity partners",
  },
  areaServed: LIVE_MARKETS.map((m) => ({
    "@type": "City",
    name: m.city,
  })),
  category: "Social connection",
};

/** An FAQPage for a page that really answers those questions on screen.
 *
 *  The header of this file warns that structured data for a URL you do not
 *  serve is worse than none. The same applies within a page: every question
 *  passed here must be visible in the HTML with the same answer text, which is
 *  why `/support` builds both from one array rather than writing the schema
 *  twice. */
export function faqPage(
  path: string,
  items: { question: string; answer: string }[],
): Node {
  return {
    "@type": "FAQPage",
    "@id": `${abs(path)}#faq`,
    url: abs(path),
    isPartOf: { "@id": WEBSITE_ID },
    publisher: { "@id": ORG_ID },
    mainEntity: items.map(({ question, answer }) => ({
      "@type": "Question",
      name: question,
      acceptedAnswer: { "@type": "Answer", text: answer },
    })),
  };
}

/** Wraps nodes into a single @graph. One script tag per page keeps the graph
 *  unambiguous rather than making a crawler reconcile several. */
export function graph(nodes: Node[]) {
  return { "@context": "https://schema.org", "@graph": nodes };
}
