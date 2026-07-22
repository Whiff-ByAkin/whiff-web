// Minimal, out of the way — the whole page is one screen, so the footer just
// anchors the legal links and the copyright. Links draw a rust underline on hover.
export function Footer() {
  return (
    <footer className="fixed inset-x-0 bottom-0 z-40 flex flex-col items-center gap-1 px-6 py-3 text-center text-xs text-ink-soft">
      <div className="flex items-center justify-center gap-3">
        <FooterLink href="/privacy">privacy</FooterLink>
        <Dot />
        <FooterLink href="/terms">terms</FooterLink>
        <Dot />
        <FooterLink href="https://www.instagram.com/discover_whiff/">
          instagram
        </FooterLink>
      </div>
      <p className="text-ink-soft/70">© 2026 whiff. All rights reserved.</p>
    </footer>
  );
}

function Dot() {
  return (
    <span aria-hidden="true" className="text-ink-soft/40">
      ·
    </span>
  );
}

function FooterLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <a href={href} className="group relative transition-colors hover:text-ink">
      {children}
      <span className="absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-0 bg-rust transition-transform duration-300 ease-out group-hover:scale-x-100" />
    </a>
  );
}
