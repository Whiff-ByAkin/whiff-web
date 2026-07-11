import type { Metadata } from "next";
import Link from "next/link";
import { CreateFlow } from "./create-flow";
import { FeedbackWidget } from "@/app/components/feedback-widget";

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

// Answer-first copy about the game, shared by the FAQ JSON-LD and the crawlable
// on-page block so structured data and visible text never drift apart. Written
// plainly so answer engines (ChatGPT, Perplexity, Claude, Gemini) can quote it.
const GAME_ABOUT =
  "“Do you know me?” is a free, browser-based game from whiff. You pick one honest prompt and answer it, then send a private link to a friend or partner. They guess what you said, and the reveal shows your real answer next to their guess. It is a quick, no-pressure way to find out who actually gets you. whiff is an AI for real-life connection that helps you meet friends, community, or love without profiles or swiping.";

const GAME_FAQ: { q: string; a: string }[] = [
  {
    q: "How does the do you know me game work?",
    a: "You pick one honest prompt and answer it. You get a private link to send to a friend or partner. They guess what you said, and the reveal shows your real answer next to their guess.",
  },
  {
    q: "Is it free to play?",
    a: "Yes. It is a free, browser-based game from whiff. No app download or account is required to play.",
  },
  {
    q: "What is the magic word?",
    a: "When you create a game you name the person you are sending it to. Their own name becomes the magic word that unlocks the game, so only they can open it.",
  },
  {
    q: "Who is whiff?",
    a: "whiff is an AI for real-life connection. You talk to it and it introduces you to the people who should be in your life, with no profiles and no swiping. This game is a small, free taste of that idea.",
  },
];

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
      mainEntity: GAME_FAQ.map(({ q, a }) => ({
        "@type": "Question",
        name: q,
        acceptedAnswer: { "@type": "Answer", text: a },
      })),
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

      {/* Crawlable answer-first content for search engines and AI models.
          Mirrors the FAQPage JSON-LD; visually hidden but present in the static
          HTML and the accessibility tree. */}
      <section aria-label="About the do you know me game" className="sr-only">
        <h2>What is the &ldquo;do you know me?&rdquo; game?</h2>
        <p>{GAME_ABOUT}</p>
        <h2>do you know me — frequently asked questions</h2>
        <dl>
          {GAME_FAQ.map(({ q, a }) => (
            <div key={q}>
              <dt>{q}</dt>
              <dd>{a}</dd>
            </div>
          ))}
        </dl>
        <p>
          Read real <Link href="/blog">dating app stories and dating app fatigue</Link>, or
          learn how <Link href="/">whiff helps you meet people without swiping</Link>.
        </p>
      </section>

      {/* helping us build whiff? a quiet feedback entry, always available */}
      <footer className="mt-16 flex flex-col items-center gap-3 border-t border-forest/10 pt-8 text-center sm:mt-20">
        <p className="font-serif text-sm italic text-forest/60">
          whiff is being built right now. what would you change?
        </p>
        <FeedbackWidget source="do-you-know-me" label="share your thoughts on whiff" />
      </footer>
    </main>
  );
}
