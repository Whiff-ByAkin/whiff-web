import { Header } from "./header";

// Shared frame for the legal pages: the site header, a readable ivory card of
// prose on the cream, and an in-flow footer (the home page's fixed footer would
// overlap long scrolling text, so these pages carry their own).
export function LegalShell({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-[100svh] flex-col">
      <Header />

      <main className="mx-auto w-full max-w-2xl flex-1 px-6 pb-16 pt-28">
        <a
          href="/"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-soft transition-colors hover:text-rust"
        >
          <span aria-hidden="true">←</span> back home
        </a>

        <article className="mt-5 rounded-3xl border border-line bg-card p-7 shadow-[0_30px_60px_-40px_rgba(63,45,34,0.35)] sm:p-10">
          <h1 className="font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            {title}
          </h1>
          <p className="mt-2 text-sm text-ink-soft">Last updated: {updated}</p>

          <div className="mt-7 text-[15px] [&_a]:font-medium [&_a]:text-rust [&_a]:underline [&_h2]:mt-8 [&_h2]:font-display [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-ink [&_li]:text-ink/90 [&_p]:mt-3 [&_p]:leading-relaxed [&_p]:text-ink/90 [&_strong]:font-bold [&_strong]:text-ink [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:space-y-1.5 [&_ul]:pl-5">
            {children}
          </div>
        </article>

        <footer className="mt-8 flex flex-col items-center gap-1 text-center text-xs text-ink-soft">
          <div className="flex items-center gap-3">
            <a href="/privacy" className="transition-colors hover:text-ink">
              privacy
            </a>
            <span aria-hidden="true" className="text-ink-soft/40">
              ·
            </span>
            <a href="/terms" className="transition-colors hover:text-ink">
              terms
            </a>
            <span aria-hidden="true" className="text-ink-soft/40">
              ·
            </span>
            <a
              href="https://www.instagram.com/discover_whiff/"
              className="transition-colors hover:text-ink"
            >
              instagram
            </a>
          </div>
          <p className="text-ink-soft/70">© 2026 whiff. All rights reserved.</p>
        </footer>
      </main>
    </div>
  );
}
