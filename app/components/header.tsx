import Link from "next/link";
import type { ReactNode } from "react";
import { BeginAction } from "./begin-action";
import { MobileNav } from "./mobile-nav";
import { PRIMARY_LINKS } from "./navigation";
import "./header.css";

/** The same navigation and controls on every public page. */
export function Header({ flow = false, onBegin, action }: { flow?: boolean; onBegin?: () => void; action?: ReactNode }) {
  return (
    <header className={`whiff-site-header ${flow ? "whiff-site-header--flow" : "site-header whiff-site-header--fixed"}`}>
      <Link href="/" aria-label="Whiff home" className="whiff-site-wordmark">whiff</Link>
      <nav className="whiff-desktop-nav" aria-label="Primary">
        {PRIMARY_LINKS.map(link => <Link key={link.href} href={link.href}>{link.label}</Link>)}
      </nav>
      <div className="whiff-header-controls">
        {action ?? <BeginAction className="whiff-header-invite" onBegin={onBegin} />}
        <MobileNav />
      </div>
    </header>
  );
}
