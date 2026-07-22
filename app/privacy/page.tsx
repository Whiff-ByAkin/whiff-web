import type { Metadata } from "next";
import { LegalShell } from "../components/legal-shell";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How whiff collects, uses, and protects your information.",
  alternates: { canonical: "/privacy" },
};

const EMAIL = "hello@whiff-ai.com";

export default function PrivacyPage() {
  return (
    <LegalShell title="Privacy Policy" updated="July 2026">
      <p>
        This Privacy Policy explains how whiff (&ldquo;whiff,&rdquo;
        &ldquo;we,&rdquo; &ldquo;us&rdquo;) collects, uses, and protects your
        information when you visit our website or ask to join. whiff is an
        activity-first platform that helps people meet through real-world
        activities. By using our site, you agree to this policy.
      </p>

      <h2>Information we collect</h2>
      <ul>
        <li>
          <strong>Your email address</strong>, when you apply to join or contact
          us. Providing it is voluntary, but it is how we reach you.
        </li>
        <li>
          <strong>Anything you choose to send us</strong>, such as the contents
          of a message when you get in touch.
        </li>
        <li>
          <strong>Basic technical data</strong> that most websites receive
          automatically, such as your browser type, device, and approximate
          region, used to keep the site secure and working.
        </li>
      </ul>
      <p>
        We do not ask for or intentionally collect sensitive personal
        information at this stage, and we do not build advertising profiles about
        you.
      </p>

      <h2>How we use your information</h2>
      <ul>
        <li>To contact you about your application, invites, and our launch.</li>
        <li>To respond to your questions and requests.</li>
        <li>To operate, secure, and improve the site.</li>
        <li>To comply with legal obligations.</li>
      </ul>

      <h2>How we share it</h2>
      <p>
        We do not sell your personal information. We share it only with service
        providers who help us run whiff, and only as needed. These currently
        include <a href="https://formspree.io/legal/privacy-policy/">Formspree</a>{" "}
        (which processes our join and contact form submissions) and our website
        hosting provider. We may also disclose information if required by law or
        to protect the rights and safety of whiff and its users.
      </p>

      <h2>Cookies</h2>
      <p>
        We keep this minimal. We do not currently use advertising or
        cross-site tracking cookies. If we add analytics in the future, we will
        update this policy.
      </p>

      <h2>Data retention and your choices</h2>
      <p>
        We keep your information only as long as needed for the purposes above.
        You can ask us to access, correct, or delete your information, or to stop
        contacting you, at any time by emailing{" "}
        <a href={`mailto:${EMAIL}`}>{EMAIL}</a>. Depending on where you live, you
        may have additional rights under laws such as the GDPR or CCPA; we honor
        applicable rights.
      </p>

      <h2>Security</h2>
      <p>
        We take reasonable measures to protect your information. However, no
        method of transmission or storage is completely secure, and we cannot
        guarantee absolute security.
      </p>

      <h2>Children</h2>
      <p>
        whiff is intended for adults 18 and older. It is not directed to
        children, and we do not knowingly collect information from anyone under
        18.
      </p>

      <h2>Changes to this policy</h2>
      <p>
        We may update this policy from time to time. When we do, we will revise
        the &ldquo;Last updated&rdquo; date above. Continued use of the site
        after changes means you accept the updated policy.
      </p>

      <h2>Contact us</h2>
      <p>
        Questions about privacy? Email{" "}
        <a href={`mailto:${EMAIL}`}>{EMAIL}</a>.
      </p>
    </LegalShell>
  );
}
