import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "../components/header";
import { PageFootline } from "../components/doc-shell";
import { JsonLd } from "../components/json-ld";
import { CONTACT_EMAIL, INSTAGRAM_URL } from "../config/site";
import { PRICING } from "../seo-content";
import { faqPage, organization } from "../lib/structured-data";

/* Apple asks for a support URL for every app, and a mailto: on a landing page
   is not one. This is that page.

   Every answer here is a fact taken from the engine, not marketing copy: four
   seats and no accept/decline (`formation/seats.ts`), a quorum of four with a
   guest as the only rescue (`MIN_ATTENDANCE`), two silent activities before a
   seat is released (`MISSED_ACTIVITIES_BEFORE_PAUSE`), and one sheet that is
   both the block and the report (`POST /v1/me/blocks`). A support page that
   describes a product the app does not have is worse than no support page —
   it is a promise a reviewer can check in five minutes.

   The four questions are the ones somebody actually writes in: how the thing
   works, what happens when life gets in the way, how to make somebody stop,
   and how to leave. Billing is the fifth because it is the one whiff cannot
   do for you — cancellation lives with Apple.

   ## Why this does not use LegalShell

   It did, and it was wrong twice. A support page is not a legal document: the
   white card reads as a contract, and the single 42rem column left two thirds
   of a desktop screen empty while the reader scrolled. So this page carries
   its own frame — no card, straight onto the paper.

   **The width is used by the ANSWERS, not by the lines.** The first attempt
   put the ask in a left rail and the questions in a right column, which fixed
   the empty screen for one viewport height and then reproduced it: the rail
   runs out after 400px and the remaining 1,200px of scroll is a column of
   prose with half a page of nothing beside it. What is here instead is a
   full-width masthead over a two-column grid of questions, so both halves of
   the screen carry content the whole way down, and each answer sits at a
   column width that is a comfortable measure by construction.

   Below `lg` the grid collapses to one column and the masthead stacks, which
   is the narrow layout the reader wanted on a phone anyway. */

const FAQS: { question: string; answer: string[]; extra?: React.ReactNode }[] =
  [
    {
      question: "How do circles form?",
      answer: [
        "whiff places you. There is no browsing, no swiping, and no accept or decline. When you join you answer five questions in your own words; whiff reads them and builds a picture of you, and when it finds people in your city who fit you, and fit each other, it seats you together.",
        "A circle is four people, and it fills one seat at a time. You watch it happen: seat by seat, with the other seats sealed until the fourth one is taken. No names, no photos, nothing to judge strangers by before you have met them. When the fourth seat fills, the circle starts, and the four of you meet every fortnight for six activities.",
        "How long the wait is depends on how many people are waiting in your city. In a young market it can be weeks. whiff would rather leave a seat open than fill it with somebody who does not belong at that table, so a circle that has not formed yet is usually a circle still short of the right fourth person.",
      ],
    },
    {
      question: "What if I can't make a night?",
      answer: [
        "Answer the invitation in the app and say no. It matters more than it looks: an evening needs four people at the table, so if your circle is short, whiff goes looking for a guest to fill the seat. If it cannot find one, the evening is cancelled rather than run with three.",
        "Missing one night costs you nothing. A holiday, a deadline, a bad week is a bad week. What does cost you is silence: go quiet on two activities in a row and your seat is released and you go back into the pool to be placed again. Three people waiting on a fourth who never answers is the one thing a circle cannot survive.",
        "There is deliberately no way to opt out of an evening because it is not your kind of thing. You say yes or you say nothing, and the reasons the app collects are the ways a night can be impossible (wrong day, wrong time, just busy), never the ways it can be unappealing. If everybody could hold out for the perfect evening, the four of you would never actually meet.",
      ],
    },
    {
      question: "How do I report someone?",
      answer: [
        "In the app, open your circle, press and hold the person's name, and choose Report or block. You can add a note in your own words. That note is the report: a person at whiff reads it, and it is never scored by software and never shown to the person it is about. The note is optional. You never have to explain yourself to make something stop.",
        "Blocking is permanent unless you lift it, and whiff will never place you in a circle with somebody you have blocked. Depending on what we find, we may warn a member, remove them from a circle, suspend them, or close their account.",
        "You can also email us, whether or not you have blocked them. Tell us what happened and roughly when.",
        "If you are in immediate danger, contact your local emergency services first. whiff is not an emergency service and cannot intervene in real time.",
      ],
    },
    {
      question: "How do I delete my account?",
      answer: [
        "In the app: You → Account → Delete account. It signs you out on every device, takes you out of any circle you are in, and stops any future placement.",
        "Your profile, your onboarding answers, and everything whiff inferred about you are deleted within 30 days. We keep only what we are required to keep (safety records about reports, and financial records), and where an internal audit record has to survive, the personal details in it are stripped so it no longer identifies you.",
        "Deleting your account does not cancel your Apple subscription. Nothing on whiff's side can. Cancel it separately in Settings → your name → Subscriptions, or we will keep being paid for an account that no longer exists.",
        "If you would rather we did it for you, email us from the address on the account and we will.",
      ],
      extra: (
        <p className="mt-3 leading-relaxed text-ink-muted">
          The full detail is in{" "}
          <Link
            href="/privacy#section-10"
            className="font-medium text-ink underline"
          >
            section 10 of the Privacy Policy
          </Link>
          .
        </p>
      ),
    },
    {
      question: "How does billing work, and how do I cancel?",
      answer: [
        `whiff is ${PRICING.perMonth} a month, billed through Apple. New subscribers get a ${PRICING.trialDays}-day free trial that includes one real activity, and we email you on day ${PRICING.reminderDay}, before anything is charged.`,
        "Cancel any time in Settings → your name → Subscriptions on your device. Cancelling stops the next charge; it does not refund the period you are already in, and you keep your access until that period ends. We do that on purpose: cutting somebody off mid-circle takes three other people's evening with it.",
      ],
      extra: (
        <p className="mt-3 leading-relaxed text-ink-muted">
          Refunds are handled by Apple rather than by us, at{" "}
          <a
            href="https://reportaproblem.apple.com"
            className="font-medium text-ink underline"
          >
            reportaproblem.apple.com
          </a>
          . You can also manage the subscription at{" "}
          <a
            href="https://apps.apple.com/account/subscriptions"
            className="font-medium text-ink underline"
          >
            apps.apple.com/account/subscriptions
          </a>
          .
        </p>
      ),
    },
    {
      /* The bet is now stated on the home page and on the share card, which
         makes this the page somebody lands on when they want the terms of it.
         What is deliberately not answered here yet: what "together" means when
         a seat is released mid-run and refilled, and how the payment reaches
         the circle. Both are product decisions, and inventing them in a
         support answer is how a support answer becomes wrong. */
      question: "Is the sixth activity really free?",
      answer: [
        "Yes. whiff calls it the bet: keep the four of you together through all six activities and whiff pays for the sixth one. Members cover the cost of the activities themselves — the class, the table, the tickets — so the last night of a completed run is on whiff, on top of the subscription that was already covering the placement.",
        "It is there because it is the claim whiff is willing to be wrong about in public: four compatible people who keep showing up stop being strangers. The payout lands on the night that claim has either held or it has not.",
      ],
    },
  ];

export const metadata: Metadata = {
  title: "Support",
  description:
    "Get help with whiff: how circles form, what happens when you can't make a night, how to report a member, how to delete your account, how to cancel, and how the bet on the sixth activity works.",
  alternates: { canonical: "/support" },
};

export default function SupportPage() {
  return (
    <div className="relative flex min-h-[100svh] flex-col">
      <JsonLd
        nodes={[
          organization,
          faqPage(
            "/support",
            FAQS.map(({ question, answer }) => ({
              question,
              answer: answer.join(" "),
            })),
          ),
        ]}
      />

      <Header />

      <main className="mx-auto w-full max-w-7xl flex-1 px-6 pb-16 pt-28 md:px-10">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-muted transition-colors hover:text-ink"
        >
          <span aria-hidden="true">←</span> back home
        </Link>

        {/* The masthead. The ask sits at the end of the row on desktop so the
            email address is the rightmost thing on the first screen rather
            than something the eye has to come back for. */}
        <div className="mt-6 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between lg:gap-16">
          <div className="max-w-xl">
            <h1 className="font-display text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
              Support
            </h1>
            <p className="mt-4 text-[15px] leading-relaxed text-ink/90 sm:text-base">
              Something wrong, something confusing, or something you want a
              person to look at? Write to us. One of the people who built whiff
              reads every email, and we answer within two business days.
            </p>
          </div>

          <div className="shrink-0 lg:text-right">
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="btn-ink inline-flex items-center justify-center rounded-full px-6 py-3 font-display font-semibold tracking-wide"
            >
              {CONTACT_EMAIL}
            </a>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-ink-muted lg:ml-auto">
              Writing about a specific evening or a specific member? Tell us
              your city and roughly when it happened. That is enough for us to
              find it.
            </p>
            {/* The Contact dialog this page replaced also offered Instagram.
                It stays a quiet secondary: email is the channel we promise an
                answer on. */}
            <p className="mt-2 text-sm text-ink-muted">
              Or message us{" "}
              <a
                href={INSTAGRAM_URL}
                rel="noopener"
                className="font-medium text-ink underline"
              >
                on Instagram
              </a>
              .
            </p>
          </div>
        </div>

        <hr className="mt-10 border-line" />

        {/* `items-start` so a short answer does not inherit the height of the
            long one beside it, which is what turns a two-column grid of prose
            into a table of ragged boxes. */}
        <div className="mt-10 grid items-start gap-x-16 gap-y-12 lg:grid-cols-2 lg:gap-y-14">
          {FAQS.map(({ question, answer, extra }) => (
            <section key={question}>
              <h2 className="font-display text-xl font-semibold tracking-tight text-ink sm:text-2xl">
                {question}
              </h2>
              {answer.map((paragraph) => (
                <p
                  key={paragraph}
                  className="mt-3 text-[15px] leading-relaxed text-ink/90"
                >
                  {paragraph}
                </p>
              ))}
              {extra}
            </section>
          ))}

          <section>
            <h2 className="font-display text-xl font-semibold tracking-tight text-ink sm:text-2xl">
              Anything else
            </h2>
            <p className="mt-3 text-[15px] leading-relaxed text-ink/90">
              If it is not here, it is an email.{" "}
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="font-medium text-ink underline"
              >
                {CONTACT_EMAIL}
              </a>
              .
            </p>
            <p className="mt-3 text-[15px] leading-relaxed text-ink/90">
              What whiff collects and how to get it deleted is in the{" "}
              <Link href="/privacy" className="font-medium text-ink underline">
                Privacy Policy
              </Link>
              . The rules of the service (community standards, subscriptions,
              and what happens at real-world activities) are in the{" "}
              <Link href="/terms" className="font-medium text-ink underline">
                Terms of Service
              </Link>
              .
            </p>
          </section>
        </div>

        <PageFootline />
      </main>
    </div>
  );
}
