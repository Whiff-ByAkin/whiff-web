import { Contact } from "./contact";
import { StatesWhiffIsIn } from "./states-whiff-is-in";

// The wordmark is set in Fredoka, not an image — so it's crisp at any size and
// carries the brand font. The rust dot over the "i" is a fixed brand detail
// (no pulsing). "whiff" stays lowercase, the way the app writes it.
export function Header() {
  return (
    <header className="fade-up fixed inset-x-0 top-0 z-50 flex items-center justify-between px-6 py-5 md:px-10">
      <a href="/" aria-label="whiff home" className="group inline-flex items-end">
        <span className="relative font-display text-2xl font-semibold lowercase tracking-tight text-ink transition-transform duration-200 group-hover:-translate-y-0.5 md:text-3xl">
          wh
          {/* the dotless i + a static rust dot */}
          <span className="relative">
            <span aria-hidden="true">ı</span>
            <span
              aria-hidden="true"
              className="absolute left-1/2 top-[0.08em] h-[0.18em] w-[0.18em] -translate-x-1/2 rounded-full bg-rust"
            />
          </span>
          ff
        </span>
      </a>

      <nav aria-label="Primary" className="flex items-center gap-2">
        <StatesWhiffIsIn />
        <Contact />
      </nav>
    </header>
  );
}
