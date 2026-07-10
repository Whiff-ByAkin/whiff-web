import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "terms of service · whiff",
  description:
    "the terms and conditions that apply to your use of whiff.",
  alternates: { canonical: "https://whiff-ai.com/terms" },
};

export default function TermsPage() {
  return (
    <div className="min-h-[100svh] h-[100svh] overflow-y-auto bg-black text-white">
      <main className="mx-auto max-w-3xl px-6 py-16 text-center">
        <h1 className="text-3xl sm:text-4xl font-serif mb-2">Terms of Service</h1>
        <p className="text-sm text-white/60 mb-10">Last updated: May 22, 2026</p>

        <section className="space-y-6 text-[15px] leading-relaxed text-white/90">
          <p>Hi, welcome to whiff.</p>
          <p>
            This page explains the terms and conditions that apply to your use
            of our service, including our website (
            <a
              href="https://whiff-ai.com"
              className="underline hover:text-white"
            >
              whiff-ai.com
            </a>
            ), any experiences or events you hear about through us
            (collectively, &ldquo;Experiences&rdquo;), and any software,
            content, and other services we make available (collectively, our
            &ldquo;Service&rdquo;). &ldquo;Terms&rdquo; refers to all of the
            terms and conditions on this page. &ldquo;whiff&rdquo;,
            &ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;us&rdquo; refers to
            whiff.
          </p>
          <p>
            By signing up, checking a box, clicking a button, or otherwise
            accessing or using our Service, you confirm that you have read,
            understood, and agree to be bound by these Terms and our{" "}
            <Link href="/privacy" className="underline hover:text-white">
              Privacy Notice
            </Link>
            . If you don&rsquo;t agree, please don&rsquo;t use the Service.
          </p>

          <p className="uppercase text-white/80 text-sm">
            Please read these Terms carefully. They contain an arbitration
            agreement and a class-action / jury-trial waiver (see &ldquo;Disputes&rdquo;
            below) that require, unless you opt out, the exclusive use of
            individual binding arbitration to resolve disputes between you and
            us.
          </p>

          <h2 className="text-xl font-serif pt-6">1. Eligibility</h2>
          <p>
            You must be at least 18 years old and able to form a legally
            binding contract to use the Service. By using the Service, you
            represent that you meet these requirements. We may refuse, suspend,
            or terminate access for anyone, at any time, in our discretion.
          </p>

          <h2 className="text-xl font-serif pt-6">2. Your Account</h2>
          <p>
            You are responsible for the activity that occurs through your
            account and credentials, and for keeping your information accurate
            and up to date. Don&rsquo;t share your credentials or impersonate
            anyone else. Notify us immediately at{" "}
            <a
              href="mailto:hello@whiff-ai.com"
              className="underline hover:text-white"
            >
              hello@whiff-ai.com
            </a>{" "}
            if you suspect unauthorized use of your account.
          </p>
          <p>
            You can delete your account at any time by contacting us. These
            Terms continue to apply to past activity even after your account is
            closed.
          </p>

          <h2 className="text-xl font-serif pt-6">3. Changes to the Service</h2>
          <p>
            We may add, modify, suspend, or discontinue any part of the Service
            at any time. We may also limit features or terminate access without
            notice or liability, including for violations of these Terms.
          </p>

          <h2 className="text-xl font-serif pt-6">
            4. Communications From whiff
          </h2>
          <p>
            By providing your phone number, you agree that we may contact you
            by call or text, including automated messages, for purposes such as
            verifying your identity, coordinating experiences, sending service
            updates, and providing security alerts. Message and data rates may
            apply. Reply STOP to opt out of promotional texts; transactional
            messages may continue while your account is active.
          </p>
          <p>
            By providing your email address, you agree to receive service and
            account-related emails. You can unsubscribe from marketing emails
            at any time via the link in those messages.
          </p>

          <h2 className="text-xl font-serif pt-6">5. Acceptable Use</h2>
          <p>You agree that you will not:</p>
          <ul className="space-y-3 list-none">
            <li>Violate any law, regulation, or third-party right (including IP and privacy rights).</li>
            <li>Impersonate another person, misrepresent your identity, or use the Service fraudulently.</li>
            <li>Share your credentials or attempt to bypass security controls.</li>
            <li>Harass, threaten, abuse, or harm other users, partners, or hosts.</li>
            <li>Post or share content that is unlawful, deceptive, hateful, sexually explicit, or otherwise objectionable.</li>
            <li>Reverse-engineer, scrape, or otherwise interfere with the Service.</li>
            <li>Use the Service for commercial purposes, benchmarking, or to build a competing product without our written consent.</li>
          </ul>
          <p>
            We reserve the right to investigate and respond to violations,
            including by removing content and suspending or terminating
            accounts.
          </p>

          <h2 className="text-xl font-serif pt-6">6. User Content</h2>
          <p>
            You retain ownership of content you submit through the Service
            (&ldquo;User Content&rdquo;). By submitting it, you grant whiff a
            worldwide, royalty-free, sublicensable license to host, store,
            reproduce, modify, display, and distribute that content for the
            purposes of operating, improving, and promoting the Service, and as
            otherwise described in our Privacy Notice.
          </p>
          <p>
            You represent that you have the rights necessary to submit your
            User Content, that it does not violate the law or any third-party
            right, and that you have obtained any necessary consents from
            people identifiable in it. Don&rsquo;t submit anything you wouldn&rsquo;t
            want to be made public.
          </p>
          <p>
            We may remove User Content or limit access for any reason,
            including to comply with the law or protect the safety of the
            community.
          </p>

          <h2 className="text-xl font-serif pt-6">7. Experiences and Safety</h2>
          <p>
            whiff introduces people for in-person experiences like coffee and
            running. <strong>Your safety is your responsibility.</strong> Use
            good judgment, meet in public, and tell someone you trust where
            you&rsquo;ll be. We do not conduct criminal background checks on
            users and do not guarantee the conduct of any user, host, or
            venue. You are solely responsible for your interactions with other
            users and with venues.
          </p>

          <h2 className="text-xl font-serif pt-6">
            8. Third-Party Services and Venues
          </h2>
          <p>
            Experiences may take place at venues owned and operated by third
            parties, and the Service may link to third-party websites and
            tools. We don&rsquo;t control these third parties and aren&rsquo;t
            responsible for their actions, content, or policies. You access
            them at your own risk.
          </p>

          <h2 className="text-xl font-serif pt-6">9. Fees and Payment</h2>
          <p>
            Some parts of the Service may require payment. If you sign up for
            a paid offering, you agree to pay all applicable fees and taxes and
            to provide accurate, current billing information. Payments are
            processed by Stripe under their{" "}
            <a
              href="https://stripe.com/legal"
              className="underline hover:text-white"
            >
              Services Agreement
            </a>{" "}
            and{" "}
            <a
              href="https://stripe.com/privacy"
              className="underline hover:text-white"
            >
              Privacy Policy
            </a>
            . All fees are non-refundable except where required by law or as
            we agree in writing.
          </p>

          <h2 className="text-xl font-serif pt-6">10. Subscriptions</h2>
          <p>
            If you sign up for a recurring subscription, it will{" "}
            <strong>automatically renew</strong> at the end of each billing
            period using your saved payment method until you cancel. You can
            cancel at any time through your account or by contacting us at{" "}
            <a
              href="mailto:hello@whiff-ai.com"
              className="underline hover:text-white"
            >
              hello@whiff-ai.com
            </a>
            . Cancellation takes effect at the end of the current billing
            period, and we do not provide refunds for unused time.
          </p>

          <h2 className="text-xl font-serif pt-6">11. Feedback</h2>
          <p>
            If you send us suggestions or feedback, you grant us a perpetual,
            royalty-free, worldwide license to use it without restriction.
            Feedback is provided voluntarily and is non-confidential.
          </p>

          <h2 className="text-xl font-serif pt-6">12. Our Intellectual Property</h2>
          <p>
            Other than your User Content, the Service, including our name,
            logo, software, and content, is owned by whiff or our licensors.
            You may not copy, modify, or use any part of it except as
            permitted by these Terms.
          </p>

          <h2 className="text-xl font-serif pt-6">13. Copyright (DMCA)</h2>
          <p>
            If you believe content on the Service infringes your copyright,
            please send a notice that complies with the DMCA to{" "}
            <a
              href="mailto:copyright@whiff-ai.com"
              className="underline hover:text-white"
            >
              copyright@whiff-ai.com
            </a>
            . We may terminate the accounts of repeat infringers.
          </p>

          <h2 className="text-xl font-serif pt-6">14. Privacy and Security</h2>
          <p>
            Your use of the Service is also subject to our{" "}
            <Link href="/privacy" className="underline hover:text-white">
              Privacy Notice
            </Link>
            . We take reasonable steps to protect your information, but no
            system is perfectly secure.
          </p>

          <h2 className="text-xl font-serif pt-6">15. Indemnification</h2>
          <p>
            You agree to defend, indemnify, and hold harmless whiff and its
            affiliates, officers, employees, and agents from any claims,
            damages, liabilities, and expenses (including reasonable
            attorneys&rsquo; fees) arising out of or related to your use of the
            Service, your User Content, your violation of these Terms, or your
            violation of any law or third-party right.
          </p>

          <h2 className="text-xl font-serif pt-6">
            16. Disclaimers
          </h2>
          <p className="uppercase text-white/80 text-sm">
            The service is provided &ldquo;as is&rdquo; and &ldquo;as
            available&rdquo; without warranties of any kind, express or
            implied, including warranties of merchantability, fitness for a
            particular purpose, and non-infringement. We do not warrant that
            the service will be uninterrupted, secure, or error-free, or that
            any content is accurate or reliable.
          </p>

          <h2 className="text-xl font-serif pt-6">
            17. Limitation of Liability
          </h2>
          <p className="uppercase text-white/80 text-sm">
            To the maximum extent permitted by law, whiff and its affiliates
            will not be liable for any indirect, incidental, special,
            consequential, exemplary, or punitive damages, or for any loss of
            profits, data, goodwill, or other intangible losses arising out of
            or related to your use of the service. Our total liability for any
            claim relating to the service will not exceed the greater of $100
            or the amounts you paid us in the 12 months before the claim.
          </p>

          <h2 className="text-xl font-serif pt-6">
            18. Governing Law and Disputes
          </h2>
          <p>
            These Terms are governed by the laws of the State of Delaware,
            without regard to its conflict-of-law principles. The Federal
            Arbitration Act governs the interpretation and enforcement of the
            arbitration agreement below.
          </p>
          <p>
            <strong>Informal resolution first:</strong> before filing a claim,
            you agree to try to resolve the dispute informally by contacting{" "}
            <a
              href="mailto:hello@whiff-ai.com"
              className="underline hover:text-white"
            >
              hello@whiff-ai.com
            </a>
            . If we can&rsquo;t resolve the dispute within 60 days, you and we
            agree to resolve any remaining dispute through{" "}
            <strong>binding individual arbitration</strong> administered by the
            American Arbitration Association under its consumer rules.
          </p>
          <p>
            <strong>Class-action and jury-trial waiver:</strong> claims must be
            brought in your individual capacity and not as a plaintiff or class
            member in any purported class, collective, or representative
            proceeding. You and we waive any right to a jury trial.
          </p>
          <p>
            <strong>Opt-out:</strong> you may opt out of the arbitration
            agreement within 30 days of first accepting these Terms by emailing{" "}
            <a
              href="mailto:hello@whiff-ai.com"
              className="underline hover:text-white"
            >
              hello@whiff-ai.com
            </a>{" "}
            with your name and the words &ldquo;arbitration opt-out.&rdquo;
          </p>

          <h2 className="text-xl font-serif pt-6">19. Changes to These Terms</h2>
          <p>
            We may update these Terms from time to time. If we make material
            changes, we will let you know through the Service or by email. By
            continuing to use the Service after the changes take effect, you
            agree to the updated Terms.
          </p>

          <h2 className="text-xl font-serif pt-6">20. Miscellaneous</h2>
          <p>
            These Terms are the entire agreement between you and whiff about
            your use of the Service. If any part of these Terms is found
            unenforceable, the rest will remain in effect. Our failure to
            enforce any part of these Terms is not a waiver of our right to do
            so later.
          </p>

          <h2 className="text-xl font-serif pt-6">21. Contact</h2>
          <p>
            Questions? Email us at{" "}
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
