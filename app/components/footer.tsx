import Link from "next/link";
import { INSTAGRAM_URL, SITE_NAME } from "../config/site";

/* The home page cannot scroll, so it cannot afford a footer — a block of links
 * under the hero is exactly the thing that would create the scrollbar the page
 * is built to avoid.
 *
 * What is left is a single hairline of text pinned to the bottom of the one
 * screen: the legal links that have to be reachable, and nothing else. It is
 * sized in the same fluid clamps as the hero so it shrinks with everything else
 * rather than being the one fixed-height element that forces an overflow.
 *
 * ## And on a phone, not even that
 *
 * Six links in 10px type across the bottom of a phone is a row nobody has
 * ever tapped on purpose, and it was costing the ask the room it needed to
 * sit where a thumb is. So below 768px this is not rendered at all and the
 * hero gets the pixels.
 *
 * Nothing becomes unreachable: the same links are in the mobile menu, one tap
 * behind the header, and /blog carries the full footline for anyone who wants
 * to read down the list. That matters for more than tidiness — /terms is the
 * EULA the App Store listing points at, so it has to be findable from the
 * home page on the device most people arrive on. */
export function HomeFootline() {
  return (
    <footer className="home-footline hidden shrink-0 px-3 md:block pb-[calc(env(safe-area-inset-bottom)+clamp(0.45rem,1.8vh,1.1rem))] pt-[clamp(0.2rem,1vh,0.6rem)] min-[360px]:px-6">
      <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-[clamp(0.58rem,1.6vw,0.72rem)] text-ink-muted min-[360px]:gap-x-3">
        <span>© 2026 {SITE_NAME}</span>
        <Dot />
        <FootLink href="/blog">blog</FootLink>
        <Dot />
        <FootLink href="/support">support</FootLink>
        <Dot />
        <FootLink href="/privacy">privacy</FootLink>
        <Dot />
        <FootLink href="/terms">terms</FootLink>
        <Dot />
        <a
          href={INSTAGRAM_URL}
          rel="me noopener"
          className="transition-colors hover:text-ink"
        >
          instagram
        </a>
      </div>
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

function FootLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link href={href} className="transition-colors hover:text-ink">
      {children}
    </Link>
  );
}
