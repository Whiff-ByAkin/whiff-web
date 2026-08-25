"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/* The header's way in.
 *
 * The hero's only button now sits on the last card of the deck, which a
 * visitor reaches by playing with it. That is the intended path, but it
 * cannot be the only one — someone who arrives on /support and decides has
 * nowhere to press. So the header carries the same ask, small.
 *
 * On the home page the form is already mounted under the deck and the page
 * cannot scroll, so this asks for it by event. Anywhere else it is a link
 * home, and the hash tells the form to open on arrival. */
export function BeginAction({ className }: { className: string }) {
  const home = usePathname() === "/";

  if (home) {
    return (
      <button
        type="button"
        className={className}
        onClick={() => window.dispatchEvent(new Event("whiff:begin"))}
      >
        Begin
      </button>
    );
  }

  return (
    <Link href="/#begin" className={className}>
      Begin
    </Link>
  );
}
