import { Header } from "./components/header";
import { Hero } from "./components/hero";
import { Footer } from "./components/footer";

export default function Home() {
  return (
    <>
      <Header />
      <main id="main" className="flex-1">
        <Hero />

        {/* Crawlable, answer-first copy for search engines and AI models —
            present in the static HTML, visually hidden. */}
        {/* Crawlable, answer-first copy for search engines and AI models —
            present in the static HTML, visually hidden. Kept short on purpose:
            the product is one sentence and padding it out only buries it. */}
        <section aria-label="About whiff" className="sr-only">
          <h2>What is whiff?</h2>
          <p>
            whiff puts you in a circle of six people who go out together the
            same night every week. You don&apos;t browse anything and you
            don&apos;t arrange anything — whiff works out who you belong with
            from a few questions, and then it&apos;s the same faces every week
            until they&apos;re yours. There is no feed, no swiping and no group
            chat. whiff is not a dating app. It launches in one city at a time,
            starting with Saint Paul.
          </p>
        </section>

      </main>
      <Footer />
    </>
  );
}
