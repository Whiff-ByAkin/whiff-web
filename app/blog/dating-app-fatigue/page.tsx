import type { Metadata } from "next";
import Link from "next/link";
import {
  FEATURED_ESSAY_URL,
  OG_IMAGE,
  PUBLISHED_DATE,
  TWITTER_IMAGE,
  sources,
} from "../data";
import { FeaturedEssayJsonLd } from "../structured-data";
import { EssayInteractionDeck } from "./essay-interactions";

const TITLE = "Why Dating Apps Feel So Exhausting (And It's Not Your Fault)";
const DESCRIPTION =
  "Why dating apps feel exhausting, from swiping fatigue and ghosting to choice overload and first-date pressure, and why that burnout is not your fault.";

const sectionLinks = [
  { href: "#broken-promise", label: "The Broken Promise" },
  { href: "#choice-overload", label: "Too Many Options" },
  { href: "#first-date-pressure", label: "First Date Pressure" },
  { href: "#real-exhaustion", label: "The Real Exhaustion" },
  { href: "#real-problem", label: "The Real Problem" },
] as const;

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: FEATURED_ESSAY_URL },
  keywords: [
    "dating app fatigue",
    "dating app burnout",
    "dating apps exhausting",
    "why dating apps are exhausting",
    "why dating apps feel like work",
    "online dating burnout",
    "dating app decision fatigue",
    "swiping fatigue",
    "choice overload dating apps",
    "ghosting burnout",
    "dating app mental health",
    "dating app alternative",
    "meet people without swiping",
    "whiff dating app alternative",
  ],
  openGraph: {
    type: "article",
    url: FEATURED_ESSAY_URL,
    siteName: "whiff",
    title: TITLE,
    description: DESCRIPTION,
    publishedTime: PUBLISHED_DATE,
    modifiedTime: PUBLISHED_DATE,
    authors: ["whiff"],
    tags: [
      "dating app fatigue",
      "dating app burnout",
      "online dating",
      "real-life connection",
    ],
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "Essay about dating app fatigue and burnout",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: [
      {
        url: TWITTER_IMAGE,
        alt: "Essay about dating app fatigue and burnout",
      },
    ],
  },
};

export default function DatingAppFatiguePage() {
  return (
    <>
      <FeaturedEssayJsonLd />

      <main id="article" className="relative min-h-[100svh] px-4 py-6 sm:px-5 md:px-8">
        <Link
          href="/blog"
          className="fixed left-4 top-4 z-50 rounded-full border border-forest/15 bg-oat/80 px-4 py-2 font-serif text-sm italic text-forest backdrop-blur-md transition hover:bg-forest hover:text-oat md:left-8 md:top-7"
        >
          back to stories
        </Link>

        <div className="mx-auto max-w-[96rem] pt-20 md:pt-24">
          <header className="grid gap-5 lg:grid-cols-[minmax(0,1.08fr)_minmax(22rem,0.92fr)] lg:items-end">
            <div className="space-y-5">
              <h1 className="max-w-5xl text-balance font-serif text-[clamp(2.7rem,7vw,6.8rem)] font-semibold leading-[0.96] tracking-tight text-forest">
                Why Dating Apps Feel So Exhausting
              </h1>
              <p className="max-w-4xl text-balance font-serif text-xl leading-snug text-forest/76 md:text-3xl">
                The endless scrolling, fizzled matches, and first-date pressure
                are not proof that you are doing dating wrong.
              </p>
              <div className="flex flex-wrap gap-2 text-sm text-forest/70">
                <span>Published July 8, 2026</span>
                <span aria-hidden="true">/</span>
                <span>6 minute read</span>
                <span aria-hidden="true">/</span>
                <span>dating app fatigue</span>
              </div>
            </div>

            <div className="grid gap-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <InfoCard label="What people reported" value="78%">
                  of dating app users in a Forbes Health survey reported feeling
                  emotionally, mentally, or physically exhausted by them
                  sometimes, often, or always.
                  <SourceLink source={sources[0]} />
                </InfoCard>
                <InfoCard label="The point" value="It is not you">
                  The system asks people to evaluate connection faster than real
                  connection usually forms.
                </InfoCard>
              </div>
              <EssayInteractionDeck />
            </div>
          </header>

          <div className="mt-8 grid gap-5 lg:grid-cols-[18rem_minmax(0,1fr)]">
            <aside className="hidden h-fit rounded-[8px] border border-forest/15 bg-card/70 p-4 shadow-[0_24px_70px_-52px_rgba(46,39,35,0.5)] backdrop-blur-md lg:sticky lg:top-24 lg:block">
              <p className="text-[10px] uppercase tracking-[0.22em] text-forest/60">
                In this essay
              </p>
              <nav aria-label="Essay sections" className="mt-4 grid gap-2">
                {sectionLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    className="rounded-[8px] border border-forest/10 bg-oat/50 px-3 py-2 font-serif text-sm font-semibold text-forest/72 transition hover:-translate-y-0.5 hover:border-sienna/30 hover:text-forest"
                  >
                    {link.label}
                  </a>
                ))}
              </nav>
            </aside>

            <div className="grid gap-5 xl:grid-cols-2">
              <ArticleCard span>
                <p>
                  You&rsquo;ve probably felt it. That creeping sense of dread
                  when you open the app. The endless scrolling that goes
                  nowhere. The matches that fizzle. The whole thing starting to
                  feel less like meeting people and more like work.
                </p>
                <p>That is not because you&rsquo;re picky or doing something wrong.</p>
                <p>
                  It is because something fundamental shifted in how these apps
                  actually work.
                </p>
              </ArticleCard>

              <ArticleCard id="broken-promise" title="The Broken Promise">
                <p>
                  Dating apps didn&rsquo;t start as evil. The original idea was
                  genuinely good: what if technology could help you meet people
                  you&rsquo;d never encounter otherwise?
                </p>
                <p>
                  But somewhere between then and now, the apps stopped caring
                  about getting you off the app. They started caring about
                  keeping you on it.
                </p>
                <p>
                  Public filings from major dating-app companies describe
                  revenue that comes directly from subscriptions and one-off
                  paid features.
                  <SourceLink source={sources[1]} /> In plain English: opening,
                  checking, upgrading, and coming back are part of the model.
                </p>
              </ArticleCard>

              <ArticleCard id="choice-overload" title="Too Many Options, Too Much Pressure">
                <p>
                  Dating apps created the illusion of infinite options. There is
                  always another profile. Another person who might be funnier,
                  taller, closer, or more perfect.
                </p>
                <p>
                  Research on online dating choice overload has found that
                  larger pools of potential partners can reduce satisfaction and
                  make people more likely to keep rejecting options.
                  <SourceLink source={sources[2]} />
                  <SourceLink source={sources[3]} />
                </p>
                <p>
                  Someone can be kind, interesting, and warm. But on a dating
                  app, they&rsquo;re skippable because the interface tells you
                  someone better is waiting.
                </p>
              </ArticleCard>

              <ArticleCard id="first-date-pressure" title="The First Date Pressure">
                <p>On paper, it&rsquo;s just a coffee. A walk. A casual dinner.</p>
                <p>In your head, it is so much heavier.</p>
                <p>
                  You are asking: could this be my future partner? Am I missing
                  someone better? What if there is someone more perfect
                  somewhere else?
                </p>
                <p>
                  Instead of being present, you&rsquo;re evaluating. The future
                  gets so loud that the present becomes impossible to enjoy.
                </p>
              </ArticleCard>

              <ArticleCard id="real-exhaustion" title="The Real Exhaustion">
                <p>
                  Common causes of dating app burnout include ghosting,
                  catfishing, repetitive conversations, and swiping fatigue.
                  <SourceLink source={sources[0]} />
                </p>
                <p>
                  The quieter part is what people often notice later: they open
                  the app out of habit, close it feeling worse, and then blame
                  themselves for not having more energy for the next conversation.
                </p>
                <p>
                  Our brains were not designed to process hundreds of potential
                  partners in a single evening. After enough swiping, even a
                  normal conversation can start to feel like another task.
                </p>
              </ArticleCard>

              <ArticleCard id="real-problem" title="The Real Problem" span>
                <p>You are not exhausted because you are bad at dating.</p>
                <p>You are exhausted because the system is designed to exhaust you.</p>
                <p>
                  Maybe the goal should not be to find the one as fast as
                  possible. Maybe the goal should be to build a life where you
                  are already doing things you love, surrounded by people who
                  care about the same things.
                </p>
                <p>
                  And when you do that, the right people have a much better
                  chance of finding you.
                </p>
              </ArticleCard>
            </div>
          </div>

          <footer className="mt-6 grid gap-4 border-t border-forest/15 py-8 lg:grid-cols-[18rem_minmax(0,1fr)]">
            <div>
              <h2 className="font-serif text-3xl font-semibold text-forest">
                Sources
              </h2>
              <p className="mt-2 text-sm leading-[1.7] text-forest/72">
                Research and further reading used for this essay.
              </p>
            </div>
            <ol className="grid gap-3 md:grid-cols-2">
              {sources.map((source) => (
                <li key={source.href}>
                  <a
                    href={source.href}
                    target="_blank"
                    rel="noreferrer"
                    className="block h-full rounded-[8px] border border-forest/15 bg-card/70 p-4 text-sm leading-[1.7] text-forest/76 transition hover:-translate-y-0.5 hover:border-sienna/35 hover:text-forest"
                  >
                    {source.title}
                  </a>
                </li>
              ))}
            </ol>
          </footer>
        </div>
      </main>
    </>
  );
}

function InfoCard({
  label,
  value,
  children,
}: {
  label: string;
  value: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-[8px] border border-forest/15 bg-card/75 p-4 shadow-[0_24px_70px_-52px_rgba(46,39,35,0.5)] backdrop-blur-md">
      <p className="text-[10px] uppercase tracking-[0.22em] text-forest/60">
        {label}
      </p>
      <p className="mt-2 font-serif text-3xl font-semibold leading-none text-sienna">
        {value}
      </p>
      <p className="mt-3 text-sm leading-[1.75] text-forest/76">{children}</p>
    </div>
  );
}

function ArticleCard({
  id,
  title,
  span = false,
  children,
}: {
  id?: string;
  title?: string;
  span?: boolean;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className={`scroll-mt-24 rounded-[8px] border border-forest/15 bg-card/72 p-5 shadow-[0_24px_70px_-54px_rgba(46,39,35,0.48)] backdrop-blur-md md:p-6 ${
        span ? "xl:col-span-2" : ""
      }`}
    >
      {title && (
        <h2 className="text-balance font-serif text-3xl font-semibold leading-tight tracking-tight text-forest md:text-4xl">
          {title}
        </h2>
      )}
      <div className="mt-4 space-y-5 text-lg leading-[1.85] text-forest/82">
        {children}
      </div>
    </section>
  );
}

function SourceLink({ source }: { source: (typeof sources)[number] }) {
  return (
    <>
      {" "}
      <a
        href={source.href}
        target="_blank"
        rel="noreferrer"
        aria-label={`Source: ${source.title}`}
        className="align-super text-xs font-medium text-sienna underline decoration-sienna/30 underline-offset-2 transition hover:text-sienna-hover"
      >
        source
      </a>
    </>
  );
}
