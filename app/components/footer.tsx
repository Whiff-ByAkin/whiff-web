import Link from "next/link";

export function Footer() {
  return (
    <footer className="fixed bottom-0 inset-x-0 z-40 px-6 py-3 text-center text-xs text-muted">
      <div className="flex items-center justify-center gap-3">
        <Link href="/do-you-know-me" className="hover:text-forest transition-colors">
          do you know me?
        </Link>
        <span aria-hidden="true" className="text-muted/50">
          |
        </span>
        <Link href="/blog" className="hover:text-forest transition-colors">
          blog
        </Link>
        <span aria-hidden="true" className="text-muted/50">
          |
        </span>
        <Link href="/privacy" className="hover:text-forest transition-colors">
          privacy policy
        </Link>
        <span aria-hidden="true" className="text-muted/50">
          |
        </span>
        <Link href="/terms" className="hover:text-forest transition-colors">
          terms of service
        </Link>
      </div>
    </footer>
  );
}
