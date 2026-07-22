import type { Metadata } from "next";
import { LegalShell } from "../components/legal-shell";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "The terms that govern your use of whiff.",
  alternates: { canonical: "/terms" },
};

const EMAIL = "hello@whiff-ai.com";

export default function TermsPage() {
  return (
    <LegalShell title="Terms of Service" updated="July 2026">
      <p>
        These Terms of Service (&ldquo;Terms&rdquo;) govern your use of whiff
        (&ldquo;whiff,&rdquo; &ldquo;we,&rdquo; &ldquo;us&rdquo;), an
        activity-first platform that helps people meet through real-world
        activities. By using our site or applying to join, you agree to these
        Terms. If you do not agree, please do not use whiff.
      </p>

      <h2>Who can use whiff</h2>
      <p>
        You must be at least 18 years old and able to form a binding contract to
        use whiff. whiff is a way to do activities alongside others who share
        your interests. It is <strong>not</strong> a dating service, an escort or
        introduction service for romantic or sexual purposes, or a background-check
        provider.
      </p>

      <h2>Applying and early access</h2>
      <p>
        whiff is launching in a limited capacity and may be invite-only.
        Submitting your email is an application, not a guarantee of access,
        placement in any activity, or any particular outcome. We may accept,
        decline, waitlist, or remove participants at our discretion.
      </p>

      <h2>Real-world activities and assumption of risk</h2>
      <p>
        whiff helps introduce people and surface activities, but{" "}
        <strong>
          activities take place in the real world, between independent people,
          and are not supervised, staffed, or controlled by whiff.
        </strong>{" "}
        We do not organize, lead, insure, or guarantee the safety of any
        activity, location, or participant, and we do not verify the identity,
        background, or conduct of other users.
      </p>
      <p>
        You participate <strong>voluntarily and at your own risk</strong>. You
        are responsible for your own safety and decisions, including assessing
        each activity, meeting in public where appropriate, telling someone you
        trust where you are going, and following all applicable laws and venue
        rules. Some activities (such as hiking, cycling, climbing, or sports)
        carry inherent risks of injury; you assume those risks.
      </p>

      <h2>Your conduct</h2>
      <ul>
        <li>Treat other people with respect. No harassment, threats, hate, or abuse.</li>
        <li>Do not use whiff for any unlawful, harmful, or deceptive purpose.</li>
        <li>Do not impersonate others or provide false information.</li>
        <li>Do not use whiff to solicit romantic, sexual, or commercial services.</li>
      </ul>
      <p>
        We may suspend or remove anyone who violates these Terms or who we
        believe poses a risk to others, at any time and without notice.
      </p>

      <h2>Release and waiver</h2>
      <p>
        To the fullest extent permitted by law, you release whiff and its
        founders, employees, and partners from any and all claims, demands,
        damages, and liabilities arising out of or related to your interactions
        with other users, your attendance at any activity, or the conduct of any
        third party, whether online or in person.
      </p>

      <h2>Disclaimers</h2>
      <p>
        whiff is provided &ldquo;as is&rdquo; and &ldquo;as available,&rdquo;
        without warranties of any kind, express or implied. We do not warrant
        that the service will be uninterrupted, error-free, or that any
        activity, match, or connection will meet your expectations.
      </p>

      <h2>Limitation of liability</h2>
      <p>
        To the fullest extent permitted by law, whiff will not be liable for any
        indirect, incidental, special, consequential, or punitive damages, or
        for any loss or injury arising from your use of the service or your
        participation in any activity. Where liability cannot be excluded, our
        total liability is limited to the amount you paid us (if any) in the 12
        months before the claim, or USD $100, whichever is greater.
      </p>

      <h2>Indemnification</h2>
      <p>
        You agree to indemnify and hold whiff harmless from any claims, losses,
        or expenses (including reasonable legal fees) arising out of your use of
        the service, your conduct, or your violation of these Terms.
      </p>

      <h2>Intellectual property</h2>
      <p>
        The whiff name, brand, site, and content are owned by whiff and may not
        be copied or used without our permission.
      </p>

      <h2>Termination</h2>
      <p>
        We may suspend or end your access to whiff at any time. You may stop
        using whiff at any time.
      </p>

      <h2>Governing law</h2>
      <p>
        These Terms are governed by the laws of the jurisdiction in which whiff
        is established, without regard to conflict-of-law rules.{" "}
        <strong>[Confirm your governing law and venue with counsel.]</strong>
      </p>

      <h2>Changes to these Terms</h2>
      <p>
        We may update these Terms from time to time. When we do, we will revise
        the &ldquo;Last updated&rdquo; date above. Continued use after changes
        means you accept the updated Terms.
      </p>

      <h2>Contact us</h2>
      <p>
        Questions about these Terms? Email{" "}
        <a href={`mailto:${EMAIL}`}>{EMAIL}</a>.
      </p>
    </LegalShell>
  );
}
