import Link from "next/link";
import type { Metadata } from "next";
import { Header } from "../components/header";
import { JsonLd } from "../components/json-ld";
import { BlogExplorer } from "./blog-explorer";
import { POSTS } from "./posts";
import { ANSWER, PROMISE } from "../seo-content";
import { CONTACT_EMAIL, INSTAGRAM_URL, SITE_NAME, SITE_URL } from "../config/site";
import { ORG_ID, abs, organization, service, website } from "../lib/structured-data";

/* The visible title is a title. The <title> tag is where the searchable words
   go — "what whiff is", "not a dating app" — because that string is matched
   against a query and read in a result, and nobody has ever clicked a result
   because it was called "The long version". The two jobs are different, so
   they get different strings. */
const H1 = "The long version";
/* Kept under ~55 characters so the template's " · whiff" still fits inside
   Google's ~600px title budget. The old one ran to 76 and was truncated in
   the result, which threw away the disqualifier at the end. */
const TITLE = "What whiff is, and why it is not a dating app";
const DESCRIPTION =
  "How whiff works: activity-first friend circles of six adults who keep meeting up, no profiles and no swiping. Three pieces on what it is, how friendships actually form, and who it is not for.";

/* BlogPosting wants dates. Without them a crawler has no freshness signal for
   the page at all, so this is the date the pieces were last rewritten — bump
   it with the sitemap's CONTENT_UPDATED when the copy changes. */
const UPDATED = "2026-08-06";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/blog" },
  openGraph: {
    type: "website",
    url: abs("/blog"),
    siteName: SITE_NAME,
    title: `${TITLE} · ${SITE_NAME}`,
    description: DESCRIPTION,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: `${TITLE} · ${SITE_NAME}`,
    description: DESCRIPTION,
  },
};

/* `Blog` + `BlogPosting`, not `FAQPage`.
   These stopped being questions when they became three pieces with titles, and
   FAQPage markup over prose that is not a question-and-answer pair is markup
   that does not describe the page. */
const blog = {
  "@type": "Blog",
  "@id": `${SITE_URL}/blog#blog`,
  name: `${SITE_NAME}: ${H1}`,
  description: DESCRIPTION,
  url: abs("/blog"),
  publisher: { "@id": ORG_ID },
  inLanguage: "en-US",
  blogPost: POSTS.map((p) => ({
    "@type": "BlogPosting",
    "@id": `${SITE_URL}/blog#${p.id}`,
    headline: p.title,
    description: p.standfirst,
    // Each piece is a fragment of one URL, not a page of its own, so `url`
    // carries the fragment and mainEntityOfPage points at the page that
    // actually exists. Claiming a URL per post would be a mismatch.
    url: `${abs("/blog")}#${p.id}`,
    mainEntityOfPage: { "@type": "WebPage", "@id": abs("/blog") },
    datePublished: UPDATED,
    dateModified: UPDATED,
    articleBody: [
      ...p.paragraphs,
      ...(p.asides?.flatMap((a) => a.items.map((i) => `${i.term}: ${i.body}`)) ??
        []),
      ...(p.pullquote ? [p.pullquote] : []),
    ].join(" "),
    author: { "@id": ORG_ID },
    publisher: { "@id": ORG_ID },
    isPartOf: { "@id": `${SITE_URL}/blog#blog` },
    inLanguage: "en-US",
  })),
};

export default function BlogPage() {
  return (
    <>
      <JsonLd
        nodes={[
          organization,
          website,
          service,
          blog,
          {
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: abs("/") },
              {
                "@type": "ListItem",
                position: 2,
                name: H1,
                item: abs("/blog"),
              },
            ],
          },
        ]}
      />

      <div className="relative flex min-h-[100svh] flex-col">
        <Header />

        <main
          id="main"
          className="flex-1 px-6 pb-20 pt-28 md:px-10 lg:px-14 xl:px-20"
        >
          {/* Centred on a phone, hard left from sm up. A page that stays
              centred on a wide screen wastes the width and reads as a poster
              rather than something written to be read. */}
          <header className="mx-auto mb-12 w-full max-w-[92rem] text-center sm:text-left">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-soft transition-colors hover:text-espresso"
            >
              <span aria-hidden="true">←</span> back home
            </Link>
            <h1 className="mt-5 text-balance font-display text-[clamp(2rem,5vw,3.4rem)] font-semibold leading-[1.08] tracking-tight text-ink">
              {H1}
            </h1>
            <p className="mx-auto mt-4 max-w-[58ch] text-[1.05rem] leading-relaxed text-ink-soft sm:mx-0">
              The home page is one screen and says one thing. This is
              everything it left out, in three pieces, in order. {PROMISE}
            </p>
          </header>

          <BlogExplorer />

          {/* The extractable definition, rendered plainly and unconditionally.
              The pieces are all in the HTML, but this one paragraph is the one
              a model should lift, so it is not behind a tab. */}
          <section className="mx-auto mt-20 w-full max-w-[92rem]">
            <h2 className="font-display text-sm font-semibold uppercase tracking-[0.14em] text-ink-soft">
              If you only read one paragraph
            </h2>
            <p className="mt-4 max-w-[72ch] text-[1.1rem] leading-relaxed text-ink/90">
              {ANSWER}
            </p>
            <p className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-ink-soft">
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="font-medium text-espresso underline underline-offset-2"
              >
                {CONTACT_EMAIL}
              </a>
              <a
                href={INSTAGRAM_URL}
                rel="me noopener"
                className="font-medium text-espresso underline underline-offset-2"
              >
                instagram
              </a>
              <Link
                href="/"
                className="font-medium text-espresso underline underline-offset-2"
              >
                join whiff
              </Link>
            </p>
          </section>
        </main>
      </div>
    </>
  );
}
