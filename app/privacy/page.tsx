import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "privacy notice · whiff",
  description:
    "how whiff collects, uses, and protects your personal information.",
  alternates: { canonical: "https://whiff-ai.com/privacy" },
};

export default function PrivacyPage() {
  return (
    <div className="min-h-[100svh] h-[100svh] overflow-y-auto bg-black text-white">
      <main className="mx-auto max-w-3xl px-6 py-16 text-center">
        <h1 className="text-3xl sm:text-4xl font-serif mb-2">Privacy Notice</h1>
        <p className="text-sm text-white/60 mb-10">Last updated: July 8, 2026</p>

        <section className="space-y-6 text-[15px] leading-relaxed text-white/90">
          <p>
            whiff is a platform that curates real-life experiences (coffee
            meetups and runs) to help foster meaningful connections. This
            Privacy Notice explains how whiff (&ldquo;whiff&rdquo;, &ldquo;we&rdquo;,
            &ldquo;us&rdquo; or &ldquo;our&rdquo;) collects your personal
            information and what we do with it, including how we use, share,
            and protect it. When we say &ldquo;personal information&rdquo; we
            mean information that identifies, relates to, describes, or could
            reasonably be associated with a person.
          </p>

          <p>
            Our services include our website (
            <a
              href="https://whiff-ai.com"
              className="underline hover:text-white"
            >
              www.whiff-ai.com
            </a>
            ), any other websites that link to this Privacy Notice, our mobile
            experiences, and the related content, platform, products, surveys,
            and matching features we offer (collectively, the
            &ldquo;Services&rdquo;).
          </p>

          <h2 className="text-xl font-serif pt-6">
            1. What Personal Information We Collect
          </h2>
          <p>
            The personal information we collect, the way we collect it, and how
            we use it depends on our relationship with you and how you interact
            with us.
          </p>

          <h3 className="text-lg font-serif pt-2">Information You Give Us</h3>
          <ul className="space-y-3 list-none">
            <li>
              <strong>Contact information:</strong> name, email address, phone
              number, and communication preferences when you reach out, sign up,
              or partner with us as a venue.
            </li>
            <li>
              <strong>Account information:</strong> first and last name, phone
              number, user ID, and credentials you create when joining whiff.
            </li>
            <li>
              <strong>Survey and profile information:</strong> answers you
              provide in our matching survey, such as age range, city, interests,
              lifestyle preferences, availability for coffee or runs, and any
              other information you choose to share.
            </li>
            <li>
              <strong>Order and payment information:</strong> if you book an
              experience or subscription, we collect billing details. Card
              numbers are processed directly by our third-party payment provider
              (Stripe); we never store full card numbers on our systems.
            </li>
            <li>
              <strong>Event information:</strong> details collected when you
              attend or check in to an experience.
            </li>
            <li>
              <strong>Feedback:</strong> ratings, reviews, and survey responses
              you share with us about our Services or experiences.
            </li>
            <li>
              <strong>Story submissions:</strong> dating app experiences you
              choose to share with the story wall, an optional nickname, and an
              optional email address if you want us to send a small digital
              gift. We do not use that optional story email for marketing.
            </li>
            <li>
              <strong>Job application information:</strong> if you apply to
              join our team: name, contact info, resume, and any details you
              share with us.
            </li>
          </ul>

          <h3 className="text-lg font-serif pt-2">
            Information Collected Automatically
          </h3>
          <p>
            When you use our Services, we (or our service providers) may
            automatically collect:
          </p>
          <ul className="space-y-3 list-none">
            <li>
              <strong>Device data:</strong> IP address, browser and device type,
              operating system, and unique identifiers.
            </li>
            <li>
              <strong>Usage data:</strong> pages you visit, links you click,
              time spent on the site, and other browsing behavior.
            </li>
            <li>
              <strong>Approximate location:</strong> derived from your IP
              address, used to suggest nearby experiences. We only collect
              precise location with your explicit permission.
            </li>
            <li>
              <strong>Cookies and similar technologies:</strong> we use cookies,
              pixels, and analytics tools to remember preferences and improve
              the Services.
            </li>
          </ul>

          <h3 className="text-lg font-serif pt-2">
            Information From Third Parties
          </h3>
          <ul className="space-y-3 list-none">
            <li>
              <strong>Social media:</strong> if you engage with us on Instagram,
              TikTok, or similar networks, we may receive limited profile
              information you have allowed those networks to share.
            </li>
            <li>
              <strong>Service providers:</strong> our vendors (e.g., survey
              tools, payment processors, analytics) may share information they
              collect on our behalf.
            </li>
            <li>
              <strong>Business partners:</strong> venues, coffee shops, and run
              clubs that partner with us may share relevant information about
              hosted experiences.
            </li>
          </ul>

          <h2 className="text-xl font-serif pt-6">
            2. How We Use Personal Information
          </h2>
          <ul className="space-y-3 list-none">
            <li>To provide the Services, including matching you with people and venues.</li>
            <li>To create and manage your account and process payments.</li>
            <li>To verify identity and help keep our community safe.</li>
            <li>To send service messages, security alerts, and policy updates.</li>
            <li>
              To send a small digital gift if you choose to provide an email
              with a story submission.
            </li>
            <li>To invite you to experiences based on your interests.</li>
            <li>To improve and personalize the Services, including improving our matching models.</li>
            <li>To conduct analytics, research, and product development.</li>
            <li>To detect, prevent, and respond to fraud, abuse, or security issues.</li>
            <li>To comply with legal obligations and enforce our terms.</li>
          </ul>

          <h2 className="text-xl font-serif pt-6">
            3. How We Share Personal Information
          </h2>
          <ul className="space-y-3 list-none">
            <li>
              <strong>Other users:</strong> limited profile details (such as
              first name) may be shared with people you are matched with so you
              can meet for coffee or a run.
            </li>
            <li>
              <strong>Service providers:</strong> vendors that help us run whiff
              (hosting, analytics, payment processing, customer support, and
              communications) under contracts that require them to protect
              your information.
            </li>
            <li>
              <strong>Business partners:</strong> we may share aggregated,
              de-identified data with venues to help them tailor experiences.
            </li>
            <li>
              <strong>Legal and safety:</strong> when required by law, to
              respond to lawful requests, to protect rights and safety, or to
              prevent fraud and abuse.
            </li>
            <li>
              <strong>Business transfers:</strong> in connection with a merger,
              acquisition, financing, or sale of assets.
            </li>
            <li>
              <strong>With your consent:</strong> any other sharing we describe
              to you at the time of collection.
            </li>
          </ul>
          <p>
            <strong>We do not sell your personal information.</strong> We do
            not share it for cross-context behavioral advertising as defined
            under applicable U.S. state privacy laws.
          </p>

          <h2 className="text-xl font-serif pt-6">4. Data Security</h2>
          <p>
            We use technical, administrative, and physical safeguards, such as
            encryption in transit, access controls, and regular reviews, to
            protect your personal information. No system is perfectly secure,
            but we work hard to reduce the risk of unauthorized access.
          </p>

          <h2 className="text-xl font-serif pt-6">5. Data Retention</h2>
          <p>
            We keep personal information only for as long as is necessary to
            provide the Services, comply with legal obligations, resolve
            disputes, and enforce our agreements. When information is no longer
            needed, we delete or de-identify it.
          </p>

          <h2 className="text-xl font-serif pt-6">6. Your Choices and Rights</h2>
          <ul className="space-y-3 list-none">
            <li>
              <strong>Email preferences:</strong> unsubscribe from marketing
              emails at any time using the link in our messages.
            </li>
            <li>
              <strong>SMS:</strong> reply STOP to any promotional text to opt
              out. Message and data rates may apply.
            </li>
            <li>
              <strong>Push notifications and location:</strong> manage in your
              device settings.
            </li>
            <li>
              <strong>Access, correction, and deletion:</strong> contact us to
              review, update, or delete your information. Some jurisdictions
              (including California, Virginia, Colorado, Connecticut, and the
              EEA/UK) grant additional rights; we will honor verified requests
              in line with applicable law.
            </li>
            <li>
              <strong>Cookies:</strong> most browsers let you block or delete
              cookies. Disabling cookies may affect site functionality.
            </li>
          </ul>

          <h2 className="text-xl font-serif pt-6">7. Children</h2>
          <p>
            Our Services are not directed to anyone under 18, and we do not
            knowingly collect personal information from minors. If you believe
            a minor has provided us information, please contact us so we can
            delete it.
          </p>

          <h2 className="text-xl font-serif pt-6">
            8. International Users
          </h2>
          <p>
            whiff is operated from the United States. If you access the Services
            from outside the U.S., your information may be transferred to,
            stored, and processed in the U.S. and other countries with
            different data protection laws than your own.
          </p>

          <h2 className="text-xl font-serif pt-6">
            9. Third-Party Links and Services
          </h2>
          <p>
            Our Services may link to third-party websites and apps. We are not
            responsible for the privacy practices of those third parties; we
            encourage you to read their notices.
          </p>

          <h2 className="text-xl font-serif pt-6">
            10. State-Specific Disclosures
          </h2>
          <p>
            <strong>California, Virginia, Colorado, Connecticut, and other
            U.S. states:</strong> you may have rights to know, access, correct,
            delete, and obtain a copy of your personal information, and to opt
            out of certain processing. We do not &ldquo;sell&rdquo; or
            &ldquo;share&rdquo; personal information as those terms are defined
            under the CCPA/CPRA.
          </p>
          <p>
            <strong>Nevada:</strong> we do not sell covered information as
            defined under Chapter 603A of the Nevada Revised Statutes.
          </p>

          <h2 className="text-xl font-serif pt-6">
            11. Updates to This Notice
          </h2>
          <p>
            We may update this Privacy Notice from time to time. When we do, we
            will revise the &ldquo;Last updated&rdquo; date above and, if the
            changes are material, notify you through the Services or by email.
          </p>

          <h2 className="text-xl font-serif pt-6">12. Contact Us</h2>
          <p>
            Questions or requests about this Privacy Notice? Email us at{" "}
            <a
              href="mailto:hello@whiff-ai.com"
              className="underline hover:text-white"
            >
              hello@whiff-ai.com
            </a>
            .
          </p>
        </section>

        <div className="mt-14">
          <Link
            href="/"
            className="inline-block underline text-white/70 hover:text-white text-sm"
          >
            ← back to whiff
          </Link>
        </div>
      </main>
    </div>
  );
}
