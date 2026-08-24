import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "../components/header";
import { PageFootline } from "../components/doc-shell";
import { JsonLd } from "../components/json-ld";
import { LIVE_MARKETS, LIVE_STATES } from "../config/site";
import { organization, service } from "../lib/structured-data";
import { StateInterestForm } from "./state-interest-form";

/* The States dialog said one sentence and threw the rest away. The markets
   data has always carried more than a name: the neighbourhoods circles
   actually go to, what a season in that city looks like, and why making
   friends there is specifically hard. A dialog has no room for any of it, so
   the header now links here instead.

   The frame follows /support, and for the same reason it gives there: this is
   not a legal document, so there is no LegalShell card — a full-width masthead
   straight onto the paper, then one column per city so both halves of a
   desktop screen carry content. Every claim on the page renders from
   MARKETS/LIVE_STATES; nothing about coverage is written by hand, so the page
   cannot say a state the data does not back up.

   This page may scroll. Only the home page is one screen. */

const STATE_LINE = LIVE_STATES.join(" and ");
const CITY_LINE = LIVE_MARKETS.map((m) => m.city).join(" and ");

export const metadata: Metadata = {
  title: `States: live in ${STATE_LINE}`,
  description: `whiff is live in ${STATE_LINE}, in ${CITY_LINE}. See where circles meet, what a season of activities looks like, and tell whiff which state to open next.`,
  alternates: { canonical: "/states" },
};

export default function StatesPage() {
  return (
    <div className="relative flex min-h-[100svh] flex-col">
      {/* The Service node already carries the live cities as areaServed, and
          this page is the first one that visibly shows them — schema and
          served content finally match. */}
      <JsonLd nodes={[organization, service]} />

      <Header />

      <main className="mx-auto w-full max-w-7xl flex-1 px-6 pb-16 pt-28 md:px-10">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-muted transition-colors hover:text-ink"
        >
          <span aria-hidden="true">←</span> back home
        </Link>

        <div className="mt-6 max-w-2xl">
          <h1 className="font-display text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
            whiff is live in {STATE_LINE}
          </h1>
          <p className="mt-4 text-[15px] leading-relaxed text-ink/90 sm:text-base">
            whiff opens one city at a time, so each market has enough members
            to form good circles. This is where circles are meeting now, and
            at the bottom, how to ask for your state next.
          </p>
        </div>

        <hr className="mt-10 border-line" />

        {/* One column per city. `items-start` for the same reason /support
            gives: prose columns must not inherit each other's height. */}
        <div className="mt-10 grid items-start gap-x-16 gap-y-12 lg:grid-cols-2">
          {LIVE_MARKETS.map((market) => (
            <section key={market.slug} aria-labelledby={`city-${market.slug}`}>
              <p className="font-body text-xs font-bold uppercase tracking-[0.2em] text-ink-muted">
                {market.region} · {market.stateAbbr}
              </p>
              <h2
                id={`city-${market.slug}`}
                className="mt-1 font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl"
              >
                {market.city}
              </h2>

              <p className="mt-4 text-[15px] leading-relaxed text-ink/90">
                {market.localTension}
              </p>

              <dl className="mt-6 space-y-4">
                {market.seasons.map((season) => (
                  <div key={season.label}>
                    <dt className="font-display text-sm font-semibold text-ink">
                      {season.label}
                    </dt>
                    <dd className="mt-1 text-[15px] leading-relaxed text-ink-muted">
                      {season.activities}
                    </dd>
                  </div>
                ))}
              </dl>

              <p className="mt-6 text-sm leading-relaxed text-ink-faint">
                Circles meet in {market.neighborhoods.join(", ")}.
              </p>
            </section>
          ))}
        </div>

        <hr className="mt-12 border-line" />

        <section className="mt-10" aria-labelledby="next-state">
          <h2
            id="next-state"
            className="font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl"
          >
            not there yet?
          </h2>
          <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-ink/90">
            tell us where to come next. whiff picks the next state from where
            people ask, so this is the one form that actually moves a map.
          </p>
          <div className="mt-6">
            <StateInterestForm />
          </div>
        </section>

        <PageFootline />
      </main>
    </div>
  );
}
