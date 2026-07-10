import type { Metadata } from "next";
import Link from "next/link";
import { CreateFlow } from "./create-flow";

const SITE_URL = "https://whiff-ai.com";
const PAGE_URL = `${SITE_URL}/do-you-know-me`;

const TITLE = "do you know me? a game about who really gets you";
const DESCRIPTION =
  "answer one honest prompt, send it to a friend or partner, and see if they can guess what you said. a quick free game from whiff about the people who actually get you.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: PAGE_URL },
  keywords: [
    "do you know me game",
    "how well do you know me game",
    "do you know me quiz",
    "how well do you know me quiz",
    "guess my answer game",
    "couples guessing game",
    "best friend test game",
    "friendship compatibility game",
    "relationship quiz for couples",
    "questions to ask your best friend",
    "fun games to play with friends online",
    "who knows me best game",
    "free online friendship game",
    "get to know each other game",
    "whiff",
    "are you with your people",
  ],
  openGraph: {
    type: "website",
    url: PAGE_URL,
    siteName: "whiff",
    title: TITLE,
    description: DESCRIPTION,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
    },
  },
};

// Structured data so search + answer engines understand this is a free,
// browser-based game, plus a small FAQ for rich results.
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": ["WebApplication", "Game"],
      "@id": `${PAGE_URL}#game`,
      name: "do you know me? by whiff",
      url: PAGE_URL,
      description: DESCRIPTION,
      applicationCategory: "GameApplication",
      operatingSystem: "Any (web browser)",
      browserRequirements: "Requires JavaScript. Runs in any modern browser.",
      inLanguage: "en-US",
      isAccessibleForFree: true,
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
      publisher: {
        "@type": "Organization",
        name: "whiff",
        url: SITE_URL,
        logo: { "@type": "ImageObject", url: `${SITE_URL}/whiff-icon.png` },
      },
      isPartOf: { "@id": `${SITE_URL}#website` },
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${PAGE_URL}#breadcrumb`,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "whiff", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "do you know me?", item: PAGE_URL },
      ],
    },
    {
      "@type": "FAQPage",
      "@id": `${PAGE_URL}#faq`,
      mainEntity: [
        {
          "@type": "Question",
          name: "How does the do you know me game work?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "You pick one honest prompt and answer it. You get a private link to send to a friend or partner. They guess what you said, and the reveal shows your real answer next to their guess.",
          },
        },
        {
          "@type": "Question",
          name: "Is it free to play?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes. It is a free, browser-based game from whiff. No app download or account is required to play.",
          },
        },
        {
          "@type": "Question",
          name: "What is the magic word?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "When you create a game you name the person you are sending it to. Their own name becomes the magic word that unlocks the game, so only they can open it.",
          },
        },
      ],
    },
  ],
};

export default function DoYouKnowMePage() {
  return (
    <main className="relative mx-auto w-full max-w-6xl px-6 py-8 sm:px-10 sm:py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Link href="/" aria-label="whiff home" className="group inline-flex items-center">
        {/* eslint-disable-next-line @next/next/no-img-element -- tiny logo asset, no responsive optimization needed */}
        <img
          src="/whiff-wordmark.png"
          alt="whiff"
          width={303}
          height={145}
          className="h-7 w-auto md:h-8 transition-transform duration-200 group-hover:scale-105"
        />
      </Link>
      <CreateFlow />
    </main>
  );
}
