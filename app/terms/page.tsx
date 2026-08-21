import type { Metadata } from "next";
import { DocShell, type DocSection } from "../components/doc-shell";
import { CONTACT_EMAIL } from "../config/site";

/* This document is doing two jobs at once, and the second one is why it is
   shaped the way it is.

   It is whiff's terms of service. It is also the **Terms of Use (EULA)** that
   App Store Review Guideline 3.1.2 requires an auto-renewable subscription app
   to link from its paywall, its settings, and its App Store description. A
   custom EULA has to carry the ten minimum terms from Apple's own Licensed
   Application End User License Agreement or the app is rejected — those are
   the "The App Store" section at the bottom, and none of them may be dropped.
   The alternative is to use Apple's standard EULA and link that instead, which
   is not available to us: it says nothing about real-world meetings between
   strangers, which is the entire liability surface of this product.

   The subscription section states the price, the period, the renewal, and how
   to cancel, in that order. Those four facts are the ones review looks for. */

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "The terms that govern your use of whiff, including the whiff app, subscriptions, and in-person activities.",
  alternates: { canonical: "/terms" },
};

const INTRO = (
  <>
    <p>
      These Terms of Service (“<strong>Terms</strong>”) are a binding agreement
      between you and <strong>Whiff LLC</strong>, a Delaware limited liability
      company (“whiff,” “we,” “us,” “our”). They govern your use of the whiff
      website, the whiff mobile application, and every activity, circle, and
      service we provide (together, the “<strong>Service</strong>”).
    </p>
    <p>
      They also serve as the <strong>end user license agreement</strong> for the
      whiff app. By creating an account, starting a free trial, buying a
      subscription, or using the Service, you agree to these Terms. If you do
      not agree, do not use whiff.
    </p>
    <p>
      <strong>
        Please read section 9 (Assumption of risk) and section 16 (Dispute
        resolution) carefully. Section 9 describes real risks of meeting people
        in person. Section 16 requires most disputes to be resolved by
        individual arbitration and waives your right to a jury trial and to
        participate in a class action, unless you opt out within 30 days.
      </strong>
    </p>
  </>
);

const SECTIONS: DocSection[] = [
  {
    id: "section-1",
    title: "1. What whiff is, and what it is not",
    body: (
      <>
        <p>
          whiff places you in a <strong>circle</strong> of four adults in your
          city and plans a run of real-world activities for those same four
          people over roughly twelve weeks. We use what you tell us during
          onboarding, and what happens at the activities afterward, to decide
          who belongs in a circle together.
        </p>
        <p>whiff is expressly not:</p>
        <ul>
          <li>
            a{" "}
            <strong>
              dating, romance, matchmaking, escort, or introduction service
            </strong>{" "}
            for romantic or sexual purposes;
          </li>
          <li>
            a{" "}
            <strong>background-check or identity-verification provider</strong>.
            We do not run criminal background checks, sex-offender registry
            checks, or identity verification on members, and you should not
            assume anyone has been vetted;
          </li>
          <li>
            an{" "}
            <strong>
              employer, event organizer, tour operator, guide, or venue
            </strong>
            . We do not staff, supervise, lead, insure, or control any activity;
          </li>
          <li>
            a provider of{" "}
            <strong>medical, legal, financial, or mental-health advice</strong>.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "section-2",
    title: "2. Who may use whiff",
    body: (
      <>
        <p>
          You must be <strong>18 years or older</strong> and able to form a
          binding contract. You must not be barred from using the Service under
          the laws of your country or the United States, and you must not be
          listed on any U.S. government list of prohibited or restricted
          parties. You may not use whiff if we have previously removed you.
        </p>
        <p>
          whiff operates city by city. A seat depends on there being enough
          people in your city to form a circle, and we do not promise one by any
          particular date.
        </p>
      </>
    ),
  },
  {
    id: "section-3",
    title: "3. Your account",
    body: (
      <>
        <p>
          You must give accurate information and keep it current. You are
          responsible for your password and for everything that happens under
          your account. Tell us at{" "}
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> straight away
          if you believe someone else has access to it.
        </p>
        <p>
          One person, one account. Do not create an account for anybody else,
          share your account, or make a new one to get around a suspension.
        </p>
      </>
    ),
  },
  {
    id: "section-4",
    title: "4. Subscriptions, free trial, and billing",
    body: (
      <>
        <p>
          whiff is a paid service sold as an{" "}
          <strong>auto-renewing subscription</strong>. When you subscribe
          through the whiff iOS app, the following applies:
        </p>
        <ul>
          <li>
            <strong>What you get.</strong> A whiff subscription is access to the
            whole service: placement into a circle, the activities planned for
            it, and everything whiff learns and does on your behalf while it is
            active. There are no tiers and no add-ons.
          </li>
          <li>
            <strong>Price and period.</strong> The subscription is{" "}
            <strong>$49.99 per month (USD)</strong>, billed monthly. A full
            twelve-week circle is three monthly charges. The price shown in the
            app at the time you subscribe is the price that governs; if it ever
            differs from the figure here, the in-app price controls.
          </li>
          <li>
            <strong>Free trial.</strong> New subscribers get a{" "}
            <strong>7-day free trial</strong>, which includes one real activity.
            We email you on day 5, before anything is charged. Your first charge
            is on day 7 unless you cancel before it. The free trial is offered
            once per person.
          </li>
          <li>
            <strong>Automatic renewal.</strong> Your subscription{" "}
            <strong>renews automatically</strong> at the then-current price
            unless you cancel it at least{" "}
            <strong>24 hours before the end of the current period</strong>.
            Payment is charged to your Apple Account at confirmation of
            purchase, and your account is charged for renewal within 24 hours
            before the end of the current period.
          </li>
          <li>
            <strong>How to cancel.</strong> You can manage or cancel your
            subscription at any time in your Apple Account settings:{" "}
            <strong>Settings → your name → Subscriptions</strong> on your
            device, or at{" "}
            <a href="https://apps.apple.com/account/subscriptions">
              apps.apple.com/account/subscriptions
            </a>
            . Cancelling stops the next charge. It does not refund the period
            you are already in.
          </li>
          <li>
            <strong>Cancelling mid-trial.</strong> If you cancel during the free
            trial, you keep access until the trial ends and are not charged. Any
            unused portion of a free trial is forfeited when you purchase a
            subscription.
          </li>
          <li>
            <strong>Access after cancellation.</strong> If you cancel a paid
            subscription, your access continues to the end of the period you
            have already paid for. We do this deliberately: cutting somebody off
            in the middle of a circle takes three other people’s evening with
            it.
          </li>
        </ul>
        <p>
          <strong>Refunds are handled by Apple, not by us.</strong> Purchases
          made through the App Store are subject to Apple’s terms and refund
          policy. Request a refund at{" "}
          <a href="https://reportaproblem.apple.com">
            reportaproblem.apple.com
          </a>
          . Except where the law requires otherwise, subscription fees are
          non-refundable and we do not provide partial refunds for unused time.
        </p>
        <p>
          We may change the price of a subscription. If we do, we will tell you
          beforehand and the change will apply to the next renewal, never to a
          period you have already paid for. Continuing after the change takes
          effect is your acceptance of it; if you do not accept it, cancel
          before the next renewal.
        </p>
      </>
    ),
  },
  {
    id: "section-5",
    title: "5. What whiff learns about you, and how",
    body: (
      <>
        <p>
          whiff works by forming a view of you. During onboarding you answer
          questions in your own words, and{" "}
          <strong>
            an automated system, including a third-party large language model,
            reads those answers
          </strong>{" "}
          and produces a structured profile: interests, traits, a personality
          type, and other inferences. Your attendance at activities and the
          feedback you give afterward add to it over time.
        </p>
        <p>
          <strong>
            That profile is used to make automated decisions about you
          </strong>{" "}
          — most importantly which circle you are placed in, who is placed with
          you, and what activities are planned. No human reviews each placement.
          You can see much of what whiff believes about you in the app, and
          correct it there. Section 5 of our{" "}
          <a href="/privacy">Privacy Policy</a> explains this in detail,
          including your rights over automated processing.
        </p>
        <p>
          whiff’s inferences are guesses, not facts about you, and it will be
          wrong sometimes. Do not treat them as an assessment of your character,
          health, or suitability for anything outside whiff.
        </p>
      </>
    ),
  },
  {
    id: "section-6",
    title: "6. Your content",
    body: (
      <>
        <p>
          You keep ownership of what you write in whiff — your onboarding
          answers, feedback, corrections, and messages. You grant us a
          worldwide, non-exclusive, royalty-free licence to host, store,
          reproduce, and process that content{" "}
          <strong>solely to operate and improve the Service</strong>, including
          running it through the automated systems described in section 5.
        </p>
        <p>
          Do not submit content you do not have the right to submit, and do not
          submit other people’s personal information.
        </p>
      </>
    ),
  },
  {
    id: "section-7",
    title: "7. Community standards",
    body: (
      <>
        <p>
          A circle only works if everybody in it is safe and behaves like an
          adult. You agree that you will not:
        </p>
        <ul>
          <li>
            harass, threaten, stalk, intimidate, defame, or discriminate against
            another member, on or off the Service;
          </li>
          <li>
            treat whiff as a dating or hookup service, or make unwanted romantic
            or sexual advances toward another member;
          </li>
          <li>
            share another member’s name, photo, contact details, location, or
            anything else they told you in confidence, outside the circle;
          </li>
          <li>
            attend an activity while impaired to a degree that endangers anyone,
            or pressure another member to drink or take anything;
          </li>
          <li>
            solicit, recruit, sell to, or promote anything to other members;
          </li>
          <li>
            impersonate anyone, misstate your age, or give false information
            during onboarding to influence who you are placed with;
          </li>
          <li>break the law, or a venue’s rules, at an activity;</li>
          <li>
            scrape, reverse-engineer, interfere with, or attempt to gain
            unauthorised access to the Service, or use it to train a competing
            model or product.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "section-8",
    title: "8. Reporting, blocking, and enforcement",
    body: (
      <>
        <p>
          If a member makes you uncomfortable or unsafe, you can{" "}
          <strong>report or block them from inside the app</strong>, and you can
          always email us at{" "}
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>. Blocking is
          permanent unless you lift it, and whiff will never place you in a
          circle with somebody you have blocked.
        </p>
        <p>
          We review reports and act on them. Depending on what we find, we may
          warn a member, remove them from a circle, suspend them, or terminate
          their account without refund. We may do any of this immediately and
          without notice where we believe somebody is at risk.
        </p>
        <p>
          <strong>
            If you are in immediate danger, contact your local emergency
            services first.
          </strong>{" "}
          We are not an emergency service and cannot intervene in real time.
        </p>
      </>
    ),
  },
  {
    id: "section-9",
    title: "9. Real-world activities and assumption of risk",
    body: (
      <>
        <p>
          <strong>
            Activities happen in the real world, between independent adults, and
            are not supervised, staffed, insured, or controlled by whiff.
          </strong>{" "}
          We suggest a place and a time. We do not attend, and we are not
          responsible for what happens there.
        </p>
        <p>
          <strong>
            We do not verify the identity, background, criminal history, or
            conduct of any member.
          </strong>{" "}
          Other members are strangers. Treat them the way you would treat any
          stranger you agreed to meet.
        </p>
        <p>
          You participate{" "}
          <strong>voluntarily and entirely at your own risk</strong>. You are
          responsible for your own safety and your own decisions, including
          judging each activity for yourself, meeting in public where that is
          sensible, telling somebody you trust where you are going, arranging
          your own transport, and following the law and the venue’s rules. Some
          activities — hiking, climbing, cycling, skating, water sports, and
          similar — carry inherent risks of serious injury or death. You
          knowingly assume those risks.
        </p>
        <p>
          To the fullest extent permitted by law, you release whiff from claims
          arising out of the conduct of other members, the condition of any
          venue, or anything that happens at or on the way to or from an
          activity.
        </p>
      </>
    ),
  },
  {
    id: "section-10",
    title: "10. Third-party venues, activities, and services",
    body: (
      <>
        <p>
          Activities take place at businesses and public places we do not own or
          control. Their prices, availability, accessibility, safety, and terms
          are theirs, not ours. Unless we say otherwise in the app, you pay the
          venue directly and your subscription does not cover the cost of an
          activity, food, drink, tickets, equipment, or travel.
        </p>
      </>
    ),
  },
  {
    id: "section-11",
    title: "11. Our intellectual property",
    body: (
      <>
        <p>
          The Service, including the whiff name, mascot, software, design, and
          copy, belongs to us and is protected by intellectual property law.
          Subject to these Terms we grant you a limited, personal,
          non-transferable, non-sublicensable, revocable licence to use the
          whiff app on Apple-branded devices that you own or control, as
          permitted by the App Store Usage Rules, for your own non-commercial
          use. That is the whole of what is granted; everything else is
          reserved.
        </p>
      </>
    ),
  },
  {
    id: "section-12",
    title: "12. Availability and changes to the Service",
    body: (
      <>
        <p>
          whiff is a young product and it changes. We may add, alter, suspend,
          or discontinue any part of the Service, including cities, activity
          types, and features. We try to give notice of material changes, but we
          may act immediately where we need to for security, legal, or safety
          reasons. We do not promise the Service will be uninterrupted or
          error-free.
        </p>
      </>
    ),
  },
  {
    id: "section-13",
    title: "13. Termination",
    body: (
      <>
        <p>
          <strong>You may stop at any time.</strong> Cancel your subscription in
          your Apple Account settings, and delete your account from inside the
          app (<strong>You → Account → Delete account</strong>) or by emailing{" "}
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>. Deleting your
          account does not by itself cancel your Apple subscription — you must
          do both.
        </p>
        <p>
          We may suspend or terminate your account if you breach these Terms, if
          we are required to by law, or if we reasonably believe it is necessary
          to protect another member. Sections 6, 9, 11, 14, 15, 16, and 17
          survive termination.
        </p>
      </>
    ),
  },
  {
    id: "section-14",
    title: "14. Disclaimers",
    body: (
      <>
        <p>
          <strong>
            The Service is provided “as is” and “as available,” without
            warranties of any kind, express or implied.
          </strong>{" "}
          To the fullest extent permitted by law we disclaim all implied
          warranties, including merchantability, fitness for a particular
          purpose, title, and non-infringement.
        </p>
        <p>
          We do not warrant that you will be placed in a circle, that a circle
          will form in your city, that you will get along with the people in it,
          that any friendship will result, or that any member or venue is safe,
          lawful, or as described. Some jurisdictions do not allow these
          exclusions, in which case they apply to you only as far as the law
          allows.
        </p>
      </>
    ),
  },
  {
    id: "section-15",
    title: "15. Limitation of liability",
    body: (
      <>
        <p>
          To the fullest extent permitted by law, whiff and its members,
          managers, employees, and agents{" "}
          <strong>
            will not be liable for any indirect, incidental, special,
            consequential, exemplary, or punitive damages
          </strong>
          , or for lost profits, lost data, or loss of goodwill, arising out of
          or relating to the Service or these Terms, whether in contract, tort,
          or any other theory, even if we were advised such damages were
          possible.
        </p>
        <p>
          <strong>
            Our total liability for all claims relating to the Service is
            limited to the greater of (a) the amount you paid us in the twelve
            months before the event giving rise to the claim, or (b) one hundred
            U.S. dollars ($100).
          </strong>
        </p>
        <p>
          Nothing in these Terms excludes liability that cannot lawfully be
          excluded, including for death or personal injury caused by our
          negligence, fraud, or fraudulent misrepresentation. Some jurisdictions
          do not allow limits on incidental or consequential damages, so parts
          of this section may not apply to you.
        </p>
      </>
    ),
  },
  {
    id: "section-16",
    title: "16. Dispute resolution, arbitration, and class action waiver",
    body: (
      <>
        <p>
          <strong>
            Please read this section carefully. It affects your legal rights.
          </strong>
        </p>
        <p>
          <strong>Talk to us first.</strong> Before starting anything formal,
          email <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> with a
          description of the dispute and what you want. We will try to resolve
          it with you for 60 days. Most things end here.
        </p>
        <p>
          <strong>Binding arbitration.</strong> If we cannot resolve it, you and
          whiff agree that any dispute arising out of or relating to these Terms
          or the Service will be resolved by{" "}
          <strong>binding individual arbitration</strong>, administered by the
          American Arbitration Association under its Consumer Arbitration Rules,
          rather than in court. The Federal Arbitration Act governs this
          section. Arbitration may take place in the county where you live or by
          video or telephone, at your choice. An arbitrator can award the same
          individual relief a court could.
        </p>
        <p>
          <strong>You give up the right to a jury trial.</strong>
        </p>
        <p>
          <strong>Class action waiver.</strong> You and whiff agree to bring
          claims only in an individual capacity, and{" "}
          <strong>
            not as a plaintiff or class member in any class, consolidated, or
            representative proceeding
          </strong>
          . An arbitrator may not consolidate more than one person’s claims. If
          this waiver is found unenforceable as to a particular claim, that
          claim — and only that claim — proceeds in court.
        </p>
        <p>
          <strong>Small claims.</strong> Either of us may bring an individual
          claim in small claims court instead, if it qualifies.
        </p>
        <p>
          <strong>Injunctive relief.</strong> Either of us may seek injunctive
          relief in court to stop infringement or misuse of intellectual
          property.
        </p>
        <p>
          <strong>How to opt out.</strong> You can opt out of this arbitration
          and class action waiver by emailing{" "}
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> with the
          subject line <strong>“Arbitration Opt-Out”</strong> and your name and
          account email, <strong>within 30 days</strong> of first accepting
          these Terms. Opting out costs you nothing and does not affect your use
          of whiff. If you opt out, the rest of these Terms still applies.
        </p>
      </>
    ),
  },
  {
    id: "section-17",
    title: "17. Governing law",
    body: (
      <>
        <p>
          These Terms are governed by the laws of the{" "}
          <strong>State of Delaware</strong>, without regard to its conflict of
          laws rules. Where a dispute is not subject to arbitration, you and
          whiff agree to the exclusive jurisdiction of the state and federal
          courts located in Delaware. If you are a consumer resident elsewhere,
          this does not deprive you of the protection of mandatory consumer laws
          in your place of residence.
        </p>
      </>
    ),
  },
  {
    id: "section-18",
    title: "18. The App Store",
    body: (
      <>
        <p>
          These terms apply to the whiff app obtained from Apple’s App Store,
          and are required by Apple:
        </p>
        <ul>
          <li>
            This agreement is between{" "}
            <strong>you and Whiff LLC only, and not with Apple</strong>. Apple
            is not responsible for the app or its content.
          </li>
          <li>
            The licence granted in section 11 is limited to a non-transferable
            licence to use the app on Apple-branded products you own or control,
            as permitted by the <strong>Usage Rules</strong> in the Apple Media
            Services Terms and Conditions.
          </li>
          <li>
            <strong>
              Apple has no obligation to provide maintenance or support
            </strong>{" "}
            for the app. Support is ours — email{" "}
            <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
          </li>
          <li>
            To the extent permitted by law, Apple has{" "}
            <strong>no warranty obligation</strong> for the app. If the app
            fails to conform to any applicable warranty, you may notify Apple
            and Apple will refund the purchase price of the app, if any. Apple
            has no other warranty obligation whatsoever.
          </li>
          <li>
            <strong>Whiff LLC, not Apple, is responsible</strong> for addressing
            any claim relating to the app, including product liability claims,
            any claim that the app fails to conform to a legal or regulatory
            requirement, and claims under consumer protection or privacy law.
          </li>
          <li>
            <strong>Whiff LLC, not Apple, is responsible</strong> for
            investigating and defending any third-party claim that the app
            infringes that party’s intellectual property rights.
          </li>
          <li>
            You represent that you are{" "}
            <strong>
              not located in a country subject to a U.S. Government embargo
            </strong>{" "}
            or designated as a “terrorist supporting” country, and that you are
            not on any U.S. Government list of prohibited or restricted parties.
          </li>
          <li>
            You must comply with applicable <strong>third-party terms</strong>{" "}
            when using the app.
          </li>
          <li>
            <strong>
              Apple and Apple’s subsidiaries are third-party beneficiaries of
              these Terms
            </strong>{" "}
            and, upon your acceptance, will have the right to enforce them
            against you.
          </li>
          <li>
            For questions or complaints about the app, contact Whiff LLC at{" "}
            <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "section-19",
    title: "19. General",
    body: (
      <>
        <p>
          If any part of these Terms is unenforceable, the rest stays in force.
          Our failure to enforce something is not a waiver of it. You may not
          assign these Terms; we may assign them in connection with a merger,
          acquisition, or sale of assets. These Terms, together with the{" "}
          <a href="/privacy">Privacy Policy</a>, are the entire agreement
          between us about the Service.
        </p>
      </>
    ),
  },
  {
    id: "section-20",
    title: "20. Changes to these Terms",
    body: (
      <>
        <p>
          We may update these Terms. When we make a material change we will
          revise the date at the top and give you notice in the app or by email
          before it takes effect. Continuing to use whiff after that means you
          accept the updated Terms. If you do not, cancel your subscription and
          delete your account.
        </p>
      </>
    ),
  },
  {
    id: "section-21",
    title: "21. Contact",
    body: (
      <>
        <p>
          <strong>Whiff LLC</strong>
          <br />
          Email: <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
        </p>
      </>
    ),
  },
];

export default function TermsPage() {
  return (
    <DocShell
      title="Terms of Service"
      updated="August 20, 2026"
      intro={INTRO}
      sections={SECTIONS}
    />
  );
}
