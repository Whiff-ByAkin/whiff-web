import { Header } from "./components/header";
import { Hero } from "./components/hero";
import { HomeFootline } from "./components/footer";
import { JsonLd } from "./components/json-ld";
import { organization, service, website } from "./lib/structured-data";

/* One screen. No scrolling — with one deliberate exception.
 *
 * From 768px up this is literal: `h-[100svh]` plus `overflow-hidden`, svh (not
 * vh) so a collapsing address bar cannot leave a strip below the fold.
 * Everything inside is sized in fluid clamps against the viewport, so the hero
 * shrinks to fit instead of pushing past the bottom edge.
 *
 * On a phone it is `min-h-[100svh]` and the page may scroll. It looks
 * identical — the content fits, so there is nothing to scroll to — but the
 * moment a visitor taps the email field, the on-screen keyboard takes a third
 * of the screen, and a page that physically cannot scroll is a page where the
 * browser cannot bring the field back into view. Most of the people who see
 * this site are on a phone; the rule is worth less than the field being
 * reachable while they type in it.
 *
 * The consequence, stated plainly: on a short desktop window something has to
 * give, and there what gives is scale, not overflow. Content will get small
 * before it gets cut off. */
export default function Home() {
  return (
    <div className="flex min-h-[100svh] flex-col overflow-x-clip md:h-[100svh] md:overflow-hidden">
      {/* Invisible to a visitor, and the only thing telling a crawler or an
          answer engine what whiff is now that the explanatory copy lives on
          /blog. It costs nothing on the page and it is the one defence against
          being filed under "dating app". */}
      <JsonLd nodes={[organization, website, service]} />

      <Header hideBegin />

      {/* Two heights, one element. From 768px up `min-h-0` lets this shrink
          below its content, which is how the composition scales down to fit
          one screen on a short desktop window.

          On a phone it is `min-h-max` instead, and the `max` is load-bearing:
          `main` carries `overflow-x: clip` (see globals.css), and an element
          whose overflow is not visible has its automatic minimum size resolve
          to zero — so on a 640px-tall phone this shrank below its content and
          clipped the handwritten line off the top of the hero. max-content
          puts the floor back (fit-content does not: it resolves to the
          available height when that is smaller), and the page grows and
          scrolls those last pixels instead. */}
      <main id="main" className="flex min-h-max flex-1 flex-col md:min-h-0">
        <Hero />
      </main>

      <HomeFootline />
    </div>
  );
}
