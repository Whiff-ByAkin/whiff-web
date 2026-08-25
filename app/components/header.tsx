import Link from "next/link";
import { BeginAction } from "./begin-action";
import { MobileNav } from "./mobile-nav";

const HEADER_ACTION =
  "header-action rounded-full border border-line bg-transparent px-4 py-2 font-display text-sm font-medium text-ink transition-colors hover:border-ink hover:bg-ground-lift focus-visible:bg-ground-lift";

// The one filled control in the header. It is the hero's button in miniature,
// and the only reason it exists is that the hero's now lives at the end of a
// deck someone has to play through.
const HEADER_BEGIN =
  "header-action btn-ink rounded-full px-4 py-2 font-display text-sm font-semibold";

// The wordmark is set in Fredoka, not an image — so it's crisp at any size and
// carries the brand font. The dot over the "i" is a fixed brand detail (no
// pulsing). The current brand uses one ink voice, including the mark.
export function Header({
  hideBlog = false,
  mobileSurface = false,
}: {
  hideBlog?: boolean;
  mobileSurface?: boolean;
}) {
  return (
    <header
      className={`site-header fade-up fixed inset-x-0 top-0 z-50 flex items-center justify-between px-3 py-3 min-[360px]:px-6 min-[360px]:py-5 md:px-10 ${
        mobileSurface
          ? "border-b border-line/80 bg-ground md:border-b-0 md:bg-transparent"
          : ""
      }`}
    >
      <Link
        href="/"
        aria-label="whiff home"
        className="group inline-flex items-end"
      >
        <span className="site-wordmark relative font-display text-xl font-semibold lowercase tracking-tight text-ink transition-transform duration-200 group-hover:-translate-y-0.5 min-[360px]:text-2xl md:text-3xl">
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
      <nav aria-label="Primary">
        <div className="hidden items-center gap-2 md:flex">
          {!hideBlog && (
            <Link href="/blog" className={HEADER_ACTION}>
              Blog
            </Link>
          )}
          {/* Both used to be dialogs. States earned a page (the dialog never
              had room for what the markets data actually says), and Contact
              was a thinner copy of what /support already is. */}
          <Link href="/states" className={HEADER_ACTION}>
            States
          </Link>
          <Link href="/support" className={HEADER_ACTION}>
            Contact
          </Link>
          <BeginAction className={HEADER_BEGIN} />
        </div>
        <MobileNav hideBlog={hideBlog} />
      </nav>
    </header>
  );
}
