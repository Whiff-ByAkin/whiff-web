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
        <section aria-label="About whiff" className="sr-only">
          <h2>What is whiff?</h2>
          <p>
            whiff is an activity-first social platform. Plans, not profiles.
            Instead of browsing profiles or swiping through people, you see real
            activities happening near you — hiking, cycling, running, climbing,
            chess, tennis, museums, local events — and join the small group
            doing the one you like. Activities first, people second. whiff has
            an AI that gets to know you, learns what would actually get you out
            of the house, recommends activities you would enjoy, and sends you
            on little missions to try something new with people who are into it
            too. whiff is not a dating app: people may become friends or more
            after meeting, but you come to do the activity, not to search for a
            relationship. whiff launches in one city with a small set of curated
            activities you can join, and grows into an on-demand model where you
            tell whiff what you want to do and it helps form the group.
          </p>
        </section>
      </main>
      <Footer />
    </>
  );
}
