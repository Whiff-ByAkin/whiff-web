import Link from "next/link";
import { INSTAGRAM_URL, SITE_NAME } from "../config/site";

/* The home page cannot scroll, so it cannot afford a footer — a block of links
 * under the hero is exactly the thing that would create the scrollbar the page
 * is built to avoid.
 *
 * What is left is a single hairline of text pinned to the bottom of the one
 * screen: the legal links that have to be reachable, and nothing else. It is
 * sized in the same fluid clamps as the hero so it shrinks with everything else
 * rather than being the one fixed-height element that forces an overflow. */
export function HomeFootline() {
  return (
    <footer className="shrink-0 px-6 pb-[calc(env(safe-area-inset-bottom)+clamp(0.6rem,1.8vh,1.1rem))] pt-[clamp(0.3rem,1vh,0.6rem)]">
      <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[clamp(0.62rem,1.6vw,0.72rem)] text-ink-soft/70">
        <span>© 2026 {SITE_NAME}</span>
        <Dot />
        <FootLink href="/blog">blog</FootLink>
        <Dot />
        <FootLink href="/privacy">privacy</FootLink>
        <Dot />
        <FootLink href="/terms">terms</FootLink>
        <Dot />
        <a
          href={INSTAGRAM_URL}
          rel="me noopener"
          className="transition-colors hover:text-espresso"
        >
          instagram
        </a>
      </div>
    </footer>
  );
}

function Dot() {
  return (
    <span aria-hidden="true" className="text-ink-soft/35">
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
    <Link href={href} className="transition-colors hover:text-espresso">
      {children}
    </Link>
  );
}
