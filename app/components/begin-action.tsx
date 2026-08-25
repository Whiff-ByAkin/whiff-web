import Link from "next/link";

/* The header's way in, for the pages that need one.
 *
 * The home page does not, and it says so with a prop: `<Header hideBegin />`.
 * The field is on that page, in the open, and a header button labelled
 * "Begin" beside a form you can already type into is a second ask for the
 * same thing.
 *
 * That decision is deliberately made by the page rather than read from
 * `usePathname()` here. A prerendered page renders this on the server, where
 * the hook's value is not guaranteed to be the browser's — the mismatch shows
 * up as the header hydrating into a different shape than it was served in.
 * A prop is known at both ends, and it leaves this a plain server component.
 *
 * Every other page has no field at all, so the pill stays: it is a link home
 * carrying #begin, which puts the cursor in the field on arrival. */
export function BeginAction({ className }: { className: string }) {
  return (
    <Link href="/#begin" className={className}>
      Begin
    </Link>
  );
}
