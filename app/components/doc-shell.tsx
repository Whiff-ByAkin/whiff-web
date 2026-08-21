import Link from "next/link";
import { Header } from "./header";
import { CONTACT_EMAIL, INSTAGRAM_URL } from "../config/site";

/* The frame for the two long documents — /privacy and /terms — and the
   replacement for LegalShell, which put both of them in a 42rem card in the
   middle of the screen.

   ## A legal page is the one page that earns a sidebar

   /support could spread its answers across two columns because they are five
   independent things. A policy cannot: it is numbered, cross-referenced prose
   that has to be read in order, and setting it 120 characters wide would make
   it worse, not wider. What the space is for here is NAVIGATION — twenty-one
   sections nobody can find by scrolling, in a rail that stays put.

   ## The sections are data, not markup

   `sections` is the single source of both the contents rail and the document
   itself, so a heading cannot exist without an entry in the rail and an anchor
   cannot point at a section that was renamed. The ids are `section-N`, matching
   the numbers the prose already uses when it says "see section 5" — those
   cross-references are now links.

   ## Sticky needs `overflow-x: clip`, not `hidden`

   `globals.css` used `overflow-x: hidden` on `main` to stop the home page's
   ambient art widening the viewport. That makes `main` a scroll container, and
   a scroll container is the scrollport a sticky descendant resolves against —
   so a sticky rail inside it never sticks and merely renders low. `clip` does
   the same clipping without creating a scroller. */

export type DocSection = {
  /** `section-N`, so prose cross-references and external deep links are stable. */
  id: string;
  title: string;
  body: React.ReactNode;
};

/** The prose voice of both documents, kept in one place so they cannot drift
 *  apart. It is applied to a wrapper rather than written on every element,
 *  because the bodies are plain JSX written by hand. */
const PROSE =
  "text-base [&_a]:font-medium [&_a]:text-ink [&_a]:underline [&_li]:text-ink/90 [&_p]:mt-3 [&_p]:leading-relaxed [&_p]:text-ink/90 [&_strong]:font-bold [&_strong]:text-ink [&_table]:mt-4 [&_table]:w-full [&_table]:border-collapse [&_td]:border-t [&_td]:border-line [&_td]:py-2.5 [&_td]:pr-4 [&_td]:align-top [&_td]:leading-relaxed [&_td]:text-ink/90 [&_th]:border-b [&_th]:border-line [&_th]:pb-2 [&_th]:pr-4 [&_th]:text-left [&_th]:font-display [&_th]:text-sm [&_th]:font-semibold [&_th]:text-ink [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:space-y-1.5 [&_ul]:pl-5";

export function DocShell({
  title,
  updated,
  intro,
  sections,
}: {
  title: string;
  updated: string;
  intro: React.ReactNode;
  sections: DocSection[];
}) {
  return (
    <div className="relative flex min-h-[100svh] flex-col">
      <Header />

      <main className="mx-auto w-full max-w-7xl flex-1 px-6 pb-16 pt-28 md:px-10">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-muted transition-colors hover:text-ink"
        >
          <span aria-hidden="true">←</span> back home
        </Link>

        <div className="mt-6 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between lg:gap-16">
          <div>
            <h1 className="font-display text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
              {title}
            </h1>
            <p className="mt-3 text-sm text-ink-muted">
              Last updated: {updated}
            </p>
          </div>

          <p className="max-w-sm text-sm leading-relaxed text-ink-muted lg:text-right">
            Questions about any of this go to{" "}
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="font-medium text-ink underline"
            >
              {CONTACT_EMAIL}
            </a>
            , or start at{" "}
            <Link href="/support" className="font-medium text-ink underline">
              support
            </Link>
            .
          </p>
        </div>

        <hr className="mt-8 border-line" />

        <div className="mt-8 grid gap-x-16 gap-y-8 lg:grid-cols-[minmax(0,15rem)_minmax(0,1fr)]">
          <Contents sections={sections} />

          <div className={`max-w-[78ch] ${PROSE}`}>
            <div className="[&>p:first-child]:mt-0">{intro}</div>

            {sections.map((section) => (
              <section
                key={section.id}
                id={section.id}
                /* The header is fixed, so an anchor jump has to stop short of
                   it or the heading lands underneath the wordmark. */
                className="mt-10 scroll-mt-28"
              >
                <h2 className="font-display text-xl font-semibold tracking-tight text-ink">
                  {section.title}
                </h2>
                {section.body}
              </section>
            ))}
          </div>
        </div>

        <PageFootline />
      </main>
    </div>
  );
}

/** The contents rail. A `<details>` on small screens, because twenty-one links
 *  above the first paragraph is a page nobody scrolls past on a phone; a plain
 *  sticky list from `lg` up, where there is room beside the prose. */
function Contents({ sections }: { sections: DocSection[] }) {
  const list = (
    <ol className="space-y-2 text-sm leading-snug text-ink-muted">
      {sections.map((section) => (
        <li key={section.id}>
          <a
            href={`#${section.id}`}
            className="transition-colors hover:text-ink"
          >
            {section.title}
          </a>
        </li>
      ))}
    </ol>
  );

  return (
    <nav aria-label="Contents" className="lg:sticky lg:top-28 lg:self-start">
      <details className="rounded-2xl border border-line px-4 py-3 lg:hidden">
        <summary className="cursor-pointer font-display text-sm font-semibold text-ink">
          Contents
        </summary>
        <div className="mt-3">{list}</div>
      </details>

      <div className="hidden lg:block lg:max-h-[calc(100svh-9rem)] lg:overflow-y-auto lg:pr-2">
        <p className="font-display text-sm font-semibold text-ink">Contents</p>
        <div className="mt-3">{list}</div>
      </div>
    </nav>
  );
}

/** The in-flow footer every scrolling page carries. Shared with /support — a
 *  second copy of these four links is a second place to forget one. */
export function PageFootline() {
  return (
    <footer className="mt-12 flex flex-col items-center gap-1 text-center text-xs text-ink-muted">
      <div className="flex items-center gap-3">
        <Link href="/support" className="transition-colors hover:text-ink">
          support
        </Link>
        <Dot />
        <Link href="/privacy" className="transition-colors hover:text-ink">
          privacy
        </Link>
        <Dot />
        <Link href="/terms" className="transition-colors hover:text-ink">
          terms
        </Link>
        <Dot />
        <a href={INSTAGRAM_URL} className="transition-colors hover:text-ink">
          instagram
        </a>
      </div>
      <p className="text-ink-muted">© 2026 whiff. All rights reserved.</p>
    </footer>
  );
}

function Dot() {
  return (
    <span aria-hidden="true" className="text-ink-faint">
      ·
    </span>
  );
}
