import type { Metadata } from "next";
import { DocShell, type DocSection } from "../components/doc-shell";
import { CONTACT_EMAIL } from "../config/site";

/* The old version of this page described an email waitlist, because that was
   all the site did. The app collects a name, an email, a birth year, a sex, a
   city, coordinates, free-text answers about somebody's life, and then runs
   those answers through a language model to produce a profile that decides who
   they are seated with. A privacy policy that does not say so is not a
   privacy policy for this product.

   Guideline 5.1.1(i) requires this document to state what is collected, how,
   every use, that third parties give equivalent protection, and how somebody
   revokes consent or gets their data deleted. Section 5 is the one that
   matters most and the one most likely to be read closely: automated
   decision-making about a person is a named right under GDPR Article 22 and a
   disclosure obligation under several US state laws. */

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "What whiff collects, what it infers about you, who it shares data with, and how to get it deleted.",
  alternates: { canonical: "/privacy" },
};

const INTRO = (
  <>
    <p>
      This policy explains what <strong>Whiff LLC</strong> (“whiff,” “we,” “us”)
      collects about you, what we do with it, who else sees it, and how to get
      it back or deleted. It covers the whiff website and the whiff mobile app.
    </p>
    <p>
      The short version: whiff needs to know a fair amount about you in order to
      work, and it forms opinions about you automatically. We do not sell your
      data and we do not use it for advertising. Section 5 is the part most
      people will want to read.
    </p>
  </>
);

const SECTIONS: DocSection[] = [
  {
    id: "section-1",
    title: "1. Information you give us",
    body: (
      <>
        <ul>
          <li>
            <strong>Account details</strong> — your name, email address, and
            password. We store passwords only as a salted hash; we never see the
            password itself.
          </li>
          <li>
            <strong>Basic profile</strong> — your birth year and, if you choose
            to give it, your sex. Sex is optional and{" "}
            <strong>“prefer not to say” is a real answer</strong> that costs you
            nothing in how whiff treats you. Your phone number, if you give one.
          </li>
          <li>
            <strong>Where you are</strong> — your city and time zone, which are
            required because circles are local. If you allow it, approximate
            coordinates, used to judge how far an activity is from you.{" "}
            <strong>
              whiff does not track your location in the background
            </strong>{" "}
            and does not follow you between activities.
          </li>
          <li>
            <strong>Your onboarding answers</strong> — free-text answers, in
            your own words, to questions about how you spend your time and what
            you are like. This is the most personal thing whiff holds, and it is
            the material section 5 is about.
          </li>
          <li>
            <strong>What happens at activities</strong> — whether you said you
            would come, whether you came, and the feedback and reflections you
            write afterward.
          </li>
          <li>
            <strong>Corrections</strong> — when you tell whiff it has got
            something wrong about you, we keep the correction.
          </li>
          <li>
            <strong>How you use the app</strong> — which screens you opened,
            which invitations you answered, how far you got through onboarding,
            and when. Apple’s privacy label calls this{" "}
            <strong>Product Interaction</strong>. It is tied to your account
            rather than anonymous, because the engine needs to know whether{" "}
            <em>you</em> answered, not whether somebody did.
          </li>
          <li>
            <strong>Reports and blocks</strong> — if you report or block another
            member, we keep a record of it, including who reported whom and why.
          </li>
          <li>
            <strong>Anything else you send us</strong>, such as an email to
            support.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "section-2",
    title: "2. Information we receive from others",
    body: (
      <>
        <ul>
          <li>
            <strong>From Apple</strong> — when you subscribe, Apple gives us a
            transaction identifier and tells us about renewals, cancellations,
            refunds, and billing failures.{" "}
            <strong>
              whiff never receives your card number, billing address, or Apple
              Account credentials.
            </strong>{" "}
            Payment is handled entirely by Apple.
          </li>
          <li>
            <strong>Technical data</strong> that any app or website receives:
            device type, operating system version, app version, IP address, and
            approximate region derived from it. We use this to keep the service
            working and secure.
          </li>
          <li>
            <strong>Diagnostics</strong> — crashes, freezes, slow screens, and
            failed requests, collected through <strong>Sentry</strong>. A report
            carries an <strong>opaque account identifier</strong> — the{" "}
            <strong>User ID</strong> on Apple’s label — so we can tell whether
            one person hit a bug ten times or ten people hit it once, and it
            says which screen and which onboarding question you were on when it
            happened.{" "}
            <strong>
              It never carries what you typed, your name, your email, a
              screenshot, or a session recording.
            </strong>{" "}
            Those are switched off deliberately, not by default.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "section-3",
    title: "3. What we do with it",
    body: (
      <>
        <ul>
          <li>
            <strong>To place you in a circle</strong> — the core of the service.
            This is described in section 5.
          </li>
          <li>
            <strong>To plan activities</strong> that suit the four people in
            your circle, in your city, at a time you can reach.
          </li>
          <li>
            <strong>To run your subscription</strong> — starting your trial,
            reminding you before the first charge, and knowing whether your
            access is active.
          </li>
          <li>
            <strong>To email you</strong> about your circle, upcoming
            activities, your trial, and account and security matters.
          </li>
          <li>
            <strong>To keep people safe</strong> — reviewing reports, enforcing
            our <a href="/terms">Terms</a>, and making sure blocked members are
            never placed together.
          </li>
          <li>
            <strong>To improve whiff</strong> — understanding, in aggregate,
            what makes circles work.
          </li>
          <li>
            <strong>To find and fix what is broken</strong> — reading crash and
            performance reports, and counting how often a fault happens and to
            how many people. Apple’s label calls this purpose{" "}
            <strong>Analytics</strong>; it means product analytics for us, and
            never advertising measurement.
          </li>
          <li>
            <strong>To meet legal obligations</strong> and to establish,
            exercise, or defend legal claims.
          </li>
        </ul>
        <p>
          <strong>
            We do not sell your personal information, we do not share it for
            cross-context behavioural advertising, and we do not build
            advertising profiles.
          </strong>{" "}
          We have never done so and have no plans to.
        </p>
      </>
    ),
  },
  {
    id: "section-4",
    title: "4. Our legal bases (if you are in the EEA or UK)",
    body: (
      <>
        <ul>
          <li>
            <strong>Performance of a contract</strong> — running your account,
            your subscription, and your circle.
          </li>
          <li>
            <strong>Legitimate interests</strong> — safety, fraud prevention,
            security, and improving the service, balanced against your rights.
          </li>
          <li>
            <strong>Consent</strong> — for optional things such as approximate
            location and any marketing email. You can withdraw consent at any
            time.
          </li>
          <li>
            <strong>Legal obligation</strong> — where the law requires us to
            keep or disclose something.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "section-5",
    title: "5. Automated profiling and how placement decisions are made",
    body: (
      <>
        <p>
          <strong>This is how whiff works, so please read it.</strong>
        </p>
        <p>
          When you answer whiff’s onboarding questions, your answers are sent to
          a{" "}
          <strong>third-party large language model provider (Anthropic)</strong>{" "}
          and read automatically. The result is a structured profile of you:
          interests, traits, an inferred personality type, and a set of
          statements whiff holds as beliefs about you, each with a confidence
          attached. Your attendance and your feedback after activities update
          those beliefs over time.
        </p>
        <p>
          <strong>That profile drives automated decisions about you.</strong> It
          determines which circle you are placed in, which three people are
          placed with you, how long you wait for a seat, and which activities
          are planned. These decisions are made by software, without a human
          reviewing each one.
        </p>
        <p>Some things we want to be explicit about:</p>
        <ul>
          <li>
            <strong>Your raw answers are not shown to other members.</strong>{" "}
            Neither are your beliefs, your confidence scores, or your
            personality type.
          </li>
          <li>
            <strong>
              While a circle is forming, the other seats are sealed.
            </strong>{" "}
            Names, personality types, shared interests, and identities are not
            revealed until all four seats are filled.
          </li>
          <li>
            <strong>
              Anthropic does not train its models on your answers.
            </strong>{" "}
            Its Commercial Terms — the ones that govern our use of it — state
            that Anthropic may not train models on customer content. It
            processes your answers to return a result to us and{" "}
            <strong>deletes them within 30 days</strong>. If its automated
            safety systems flag something as violating its usage policy, that
            content may be reviewed by a person and kept for up to two years.
          </li>
          <li>
            <strong>
              whiff’s inferences are guesses and will sometimes be wrong.
            </strong>{" "}
            They are not an assessment of your character, health, or worth.
          </li>
        </ul>
        <p>
          <strong>Your rights over this.</strong> You can see much of what whiff
          believes about you in the app, under{" "}
          <strong>You → What whiff believes</strong>, and correct it there. If
          you are in a jurisdiction that grants rights over automated
          decision-making — including{" "}
          <strong>Article 22 of the UK/EU GDPR</strong> — you have the right to
          ask for human review of a decision, to express your point of view, and
          to contest it. Email{" "}
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> and a person
          will look at it.
        </p>
      </>
    ),
  },
  {
    id: "section-6",
    title: "6. What other members can see",
    body: (
      <>
        <p>
          Once a circle is complete, the other three people see{" "}
          <strong>your display name</strong> and whatever you choose to tell
          them in person. They do not see your email address, your phone number,
          your exact location, your birth year, your onboarding answers, your
          feedback, or anything whiff has inferred about you.
        </p>
        <p>
          Feedback you give after an activity is used by whiff and is not shown
          to the people it is about.
        </p>
      </>
    ),
  },
  {
    id: "section-7",
    title: "7. Who we share it with",
    body: (
      <>
        <p>
          We share personal information only with service providers who help us
          run whiff, and only as much as they need.{" "}
          <strong>
            Each is contractually required to protect your data to at least the
            standard set out in this policy and to use it only on our
            instructions.
          </strong>{" "}
          They currently are:
        </p>
        <ul>
          <li>
            <strong>
              <a href="https://www.anthropic.com/legal/privacy">Anthropic</a>
            </strong>{" "}
            — the language model that reads your onboarding answers (section 5).
          </li>
          <li>
            <strong>
              <a href="https://railway.com/legal/privacy">Railway</a>
            </strong>{" "}
            — application hosting and database infrastructure.
          </li>
          <li>
            <strong>
              <a href="https://resend.com/legal/privacy-policy">Resend</a>
            </strong>{" "}
            — sending transactional email.
          </li>
          <li>
            <strong>
              <a href="https://www.apple.com/legal/privacy/">Apple</a>
            </strong>{" "}
            — subscription billing and App Store distribution.
          </li>
          <li>
            <strong>
              <a href="https://vercel.com/legal/privacy-policy">Vercel</a>
            </strong>{" "}
            — website hosting and privacy-friendly, cookieless analytics.
          </li>
          <li>
            <strong>
              <a href="https://formspree.io/legal/privacy-policy/">Formspree</a>
            </strong>{" "}
            — processing the invite form on this website.
          </li>
          <li>
            <strong>
              <a href="https://sentry.io/privacy/">Sentry</a>
            </strong>{" "}
            — crash and performance diagnostics (section 2).
          </li>
        </ul>
        <p>
          We may also disclose information if the law requires it, in response
          to a valid legal request, to enforce our <a href="/terms">Terms</a>,
          or where we believe in good faith that it is necessary to prevent
          serious harm to someone. If whiff is ever acquired or merged, your
          information may transfer as part of that, and we will tell you before
          it becomes subject to a different policy.
        </p>
      </>
    ),
  },
  {
    id: "section-8",
    title: "8. Cookies and tracking",
    body: (
      <>
        <p>
          The whiff app contains{" "}
          <strong>no advertising SDKs and no cross-app tracking</strong>, and
          does not ask for permission to track you, because it does not. The
          website uses no advertising or cross-site tracking cookies; our
          analytics are aggregate and cookieless.
        </p>
        <p>
          In Apple’s specific sense of the word,{" "}
          <strong>whiff does not track you</strong>: we do not link what you do
          in whiff with data from other companies’ apps or websites for
          advertising or measurement, and we do not share anything with a data
          broker. That is why the app never shows the{" "}
          <em>“Allow whiff to track you?”</em> prompt — there is nothing for it
          to ask about. Everything on our App Store privacy label is listed
          under <strong>“Data Linked to You”</strong> and nothing under “Data
          Used to Track You”. See <a href="#section-16">section 16</a>, which
          goes through the label item by item.
        </p>
      </>
    ),
  },
  {
    id: "section-9",
    title: "9. How long we keep it",
    body: (
      <>
        <p>
          We keep your information for as long as your account is open, and
          after that only as long as we need it for the purposes in this policy
          — typically to resolve disputes, meet legal and tax obligations, and
          keep safety records such as blocks and reports.
        </p>
        <p>
          Some records are kept in an internal audit log that we do not rewrite,
          so that decisions whiff made in the past can be explained. Where we
          keep such a record after you delete your account, we{" "}
          <strong>strip or pseudonymise the personal details in it</strong> so
          that it no longer identifies you.
        </p>
      </>
    ),
  },
  {
    id: "section-10",
    title: "10. Deleting your account and your data",
    body: (
      <>
        <p>
          <strong>
            You can delete your account from inside the app: You → Account →
            Delete account.
          </strong>{" "}
          You can also email{" "}
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> and we will do
          it for you.
        </p>
        <p>Deleting your account:</p>
        <ul>
          <li>
            removes you from any circle you are in and stops any future
            placement;
          </li>
          <li>
            deletes your profile, your onboarding answers, and everything whiff
            inferred about you, within <strong>30 days</strong>;
          </li>
          <li>
            keeps only what we are required to keep — safety records relating to
            reports about you, and financial records — for as long as the law
            requires;
          </li>
          <li>
            <strong>does not cancel your Apple subscription.</strong> You must
            cancel that separately in{" "}
            <strong>Settings → your name → Subscriptions</strong>, or we will
            keep charging you.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "section-11",
    title: "11. Your rights",
    body: (
      <>
        <p>
          Wherever you live, you can ask us to{" "}
          <strong>access, correct, export, or delete</strong> your personal
          information, and to stop sending you non-essential email. Email{" "}
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>. We answer
          within 30 days and we will not treat you differently for asking.
        </p>
        <p>
          <strong>If you are in the EEA, UK, or Switzerland</strong>, you also
          have rights to restrict or object to processing, to data portability,
          to withdraw consent, to the human review described in section 5, and
          to complain to your local data protection authority.
        </p>
        <p>
          <strong>
            If you are in California or another US state with a privacy law
          </strong>{" "}
          (including Colorado, Connecticut, Virginia, Texas, and others), you
          have rights to know, delete, correct, and obtain a portable copy of
          your information, and to opt out of sale or targeted advertising —
          although{" "}
          <strong>
            we do not sell your information or use it for targeted advertising
          </strong>
          , so there is nothing to opt out of. You may designate an authorised
          agent to make a request for you.
        </p>
      </>
    ),
  },
  {
    id: "section-12",
    title: "12. Where your data is held",
    body: (
      <>
        <p>
          whiff is operated from the United States and your information is
          stored and processed there. If you use whiff from outside the US, you
          understand that your information will be transferred to the US, where
          privacy laws may differ from those in your country. Where required, we
          rely on appropriate safeguards such as the European Commission’s
          Standard Contractual Clauses.
        </p>
      </>
    ),
  },
  {
    id: "section-13",
    title: "13. Security",
    body: (
      <>
        <p>
          We use encryption in transit, hashed passwords, access controls, and
          keep credentials on your device in the iOS Keychain, marked so they
          never leave it in a backup. No system is perfectly secure and we
          cannot guarantee absolute security. If a breach affects you, we will
          notify you as the law requires.
        </p>
      </>
    ),
  },
  {
    id: "section-14",
    title: "14. Children",
    body: (
      <>
        <p>
          whiff is for adults <strong>18 and over</strong>. It is not directed
          to children and we do not knowingly collect information from anyone
          under 18. If you believe a minor has given us information, email{" "}
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> and we will
          delete it.
        </p>
      </>
    ),
  },
  {
    id: "section-15",
    title: "15. Changes to this policy",
    body: (
      <>
        <p>
          We may update this policy. When we make a material change we will
          revise the date at the top and tell you in the app or by email before
          it takes effect.
        </p>
      </>
    ),
  },
  {
    id: "section-16",
    title: "16. Apple’s App Store privacy label, item by item",
    body: (
      <>
        <p>
          The App Store shows a privacy label on whiff’s product page. It is
          deliberately terse — ten data types and a purpose or two each — so
          this section says what each line of it actually refers to, and where
          in this policy the detail lives.{" "}
          <strong>Every item below is listed as “Data Linked to You”</strong>,
          because whiff has no anonymous mode: the whole product is a service
          that knows who you are in order to seat you with three specific
          people.
        </p>
        <table>
          <thead>
            <tr>
              <th>On the label</th>
              <th>What it is</th>
              <th>What it is for</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Name</td>
              <td>
                The display name you give when you sign up, and the only thing
                the other three people in your circle see (
                <a href="#section-6">section 6</a>).
              </td>
              <td>App functionality</td>
            </tr>
            <tr>
              <td>Email Address</td>
              <td>
                Your sign-in identity, and where circle, activity, trial, and
                security email is sent.
              </td>
              <td>App functionality</td>
            </tr>
            <tr>
              <td>Other User Contact Info</td>
              <td>Your phone number, if you choose to give one.</td>
              <td>App functionality</td>
            </tr>
            <tr>
              <td>Coarse Location</td>
              <td>
                Your city and time zone, and — only if you allow it —
                approximate coordinates. Never precise location, and never in
                the background (<a href="#section-1">section 1</a>).
              </td>
              <td>
                App functionality, and product personalisation: which circle is
                near enough to be yours, and which activities you can actually
                reach.
              </td>
            </tr>
            <tr>
              <td>Other User Content</td>
              <td>
                Your onboarding answers, your feedback after an activity, and
                your corrections. This is the material{" "}
                <a href="#section-5">section 5</a> is about.
              </td>
              <td>
                App functionality, and product personalisation: it is what whiff
                reads to decide who you are seated with.
              </td>
            </tr>
            <tr>
              <td>Customer Support</td>
              <td>What you write to us when you ask for help.</td>
              <td>
                App functionality, and product personalisation — if you email us
                that whiff has misread you, we may correct what it believes
                rather than only answering the email.
              </td>
            </tr>
            <tr>
              <td>User ID</td>
              <td>
                The opaque identifier for your account. It is what a diagnostic
                report carries instead of your name.
              </td>
              <td>App functionality</td>
            </tr>
            <tr>
              <td>Product Interaction</td>
              <td>
                Which screens you opened, which invitations you answered, and
                how far you got through onboarding.
              </td>
              <td>App functionality</td>
            </tr>
            <tr>
              <td>Crash Data</td>
              <td>
                Crashes and unhandled errors, through Sentry (
                <a href="#section-2">section 2</a>).
              </td>
              <td>Analytics, and app functionality</td>
            </tr>
            <tr>
              <td>Performance Data</td>
              <td>
                Freezes, slow screens, and failed requests, through Sentry.
              </td>
              <td>Analytics, and app functionality</td>
            </tr>
          </tbody>
        </table>
        <p>
          <strong>
            Nothing on the label is used for advertising, and nothing is used to
            track you
          </strong>{" "}
          in the sense Apple defines — see <a href="#section-8">section 8</a>.
          whiff has no advertising SDK, no data broker, and no third-party
          analytics that follows you anywhere else.
        </p>
        <p>
          If the label and this policy ever disagree,{" "}
          <strong>this policy is the one we will correct the label to</strong>,
          and you can hold us to it at{" "}
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
        </p>
      </>
    ),
  },
  {
    id: "section-17",
    title: "17. Contact",
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

export default function PrivacyPage() {
  return (
    <DocShell
      title="Privacy Policy"
      updated="August 21, 2026"
      intro={INTRO}
      sections={SECTIONS}
    />
  );
}
