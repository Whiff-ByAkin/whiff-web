import { Header } from "./components/header";
import { Footer } from "./components/footer";
import { HowItWorksSection } from "./components/how-it-works-section";
import { ABOUT, FAQ } from "./seo-content";

export default function Home() {
  return (
    <>
      <Header />
      <main id="main" className="h-[100svh] overflow-hidden">
        {/* ── the statement, how it works, and the invite — one screen, no scroll ── */}
        <HowItWorksSection />

        {/* Crawlable answer-first content for search engines and AI models.
            Mirrors the FAQPage JSON-LD and the in-dialog copy; visually hidden
            but present in the static HTML and the accessibility tree. */}
        <section aria-label="About whiff" className="sr-only">
          <h2>What is whiff?</h2>
          <p>{ABOUT}</p>
          <h2>whiff frequently asked questions</h2>
          <dl>
            {FAQ.map(({ q, a }) => (
              <div key={q}>
                <dt>{q}</dt>
                <dd>{a}</dd>
              </div>
            ))}
          </dl>
        </section>
      </main>
      <Footer />
    </>
  );
}
