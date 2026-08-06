import { Header } from "./components/header";
import { Hero } from "./components/hero";
import { HomeFootline } from "./components/footer";
import { JsonLd } from "./components/json-ld";
import { organization, service, website } from "./lib/structured-data";

/* One screen. No scrolling.
 *
 * `h-[100svh]` plus `overflow-hidden` is what makes that literal rather than
 * aspirational — svh (not vh) so the mobile browser's collapsing address bar
 * cannot leave a strip of the page below the fold. Everything inside is sized
 * in fluid clamps against the viewport, so the hero shrinks to fit instead of
 * pushing past the bottom edge.
 *
 * The consequence, stated plainly: on a very short window something has to
 * give, and here what gives is scale, not overflow. Content will get small
 * before it gets cut off. */
export default function Home() {
  return (
    <div className="flex h-[100svh] flex-col overflow-hidden">
      {/* Invisible to a visitor, and the only thing telling a crawler or an
          answer engine what whiff is now that the explanatory copy lives on
          /blog. It costs nothing on the page and it is the one defence against
          being filed under "dating app". */}
      <JsonLd nodes={[organization, website, service]} />

      <Header />

      <main id="main" className="flex min-h-0 flex-1 flex-col">
        <Hero />
      </main>

      <HomeFootline />
    </div>
  );
}
