import Link from "next/link";
import { Contact } from "./contact";
import { StatesWhiffIsIn } from "./states-whiff-is-in";

// The wordmark is set in Fredoka, not an image — so it's crisp at any size and
// carries the brand font. The dot over the "i" is a fixed brand detail (no
// pulsing) and is the one place the espresso→sienna gradient is allowed on this
// page — it's the mark. "whiff" stays lowercase, the way the app writes it.
export function Header() {
  return (
    <header className="fade-up fixed inset-x-0 top-0 z-50 flex items-center justify-between px-6 py-5 md:px-10">
      <Link
        href="/"
        aria-label="whiff home"
        className="group inline-flex items-end"
      >
        <span className="relative font-display text-2xl font-semibold lowercase tracking-tight text-ink transition-transform duration-200 group-hover:-translate-y-0.5 md:text-3xl">
          wh
          {/* the dotless i + a static dot carrying the brand gradient */}
          <span className="relative">
            <span aria-hidden="true">ı</span>
            <span
              aria-hidden="true"
              className="brand-gradient absolute left-1/2 top-[0.08em] h-[0.18em] w-[0.18em] -translate-x-1/2 rounded-full"
            />
          </span>
          ff
        </span>
      </Link>

      {/* The home page cannot scroll, so this link is the only route to the
          explanatory content. It is a real link rather than a dialog because
          it is also the one internal edge a crawler can follow off the home
          page. */}
      <nav aria-label="Primary" className="flex items-center gap-2">
        <Link
          href="/blog"
          className="rounded-full border border-line bg-card px-4 py-2 font-display text-sm font-medium text-ink transition-colors hover:border-espresso hover:text-espresso"
        >
          Blog
        </Link>
        <StatesWhiffIsIn />
        <Contact />
      </nav>
    </header>
  );
}
