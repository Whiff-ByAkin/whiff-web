"""Badge email delivery via SMTP.

Defaults target Microsoft 365 client SMTP submission. Delivery stays dormant
until SMTP_USER + SMTP_PASSWORD are set, so issuing a badge never fails on
email delivery while credentials are still being configured.
"""

import os
import smtplib
import ssl
from email.message import EmailMessage


def smtp_configured():
    return bool(os.getenv("SMTP_USER") and os.getenv("SMTP_PASSWORD"))


def send_badge_email(to_email, png_bytes, founder_label, hidden_code):
    if not smtp_configured():
        print(
            f"[badge] SMTP not configured — skipping send to {to_email} "
            f"(founder #{founder_label}, code {hidden_code}). Delivery TODO."
        )
        return False

    host = os.getenv("SMTP_HOST", "smtp.office365.com")
    port = int(os.getenv("SMTP_PORT", "587"))
    user = os.environ["SMTP_USER"]
    password = os.environ["SMTP_PASSWORD"]
    sender = os.getenv("SMTP_FROM", user)

    msg = EmailMessage()
    msg["Subject"] = f"You're founder #{founder_label} — your whiff badge"
    msg["From"] = sender
    msg["To"] = to_email
    msg.set_content(
        f"You're one of the first.\n\n"
        f"Founder #{founder_label}. Your badge is attached.\n\n"
        f"— whiff"
    )
    msg.add_alternative(
        f"""
        <div style="font-family:Georgia,serif;color:#2d2623">
          <p>You're one of the first.</p>
          <p><strong>Founder #{founder_label}.</strong> Your badge is attached.</p>
          <p style="color:#6f665f">— whiff</p>
        </div>
        """,
        subtype="html",
    )
    msg.add_attachment(
        png_bytes,
        maintype="image",
        subtype="png",
        filename=f"whiff_founding_witness_badge_{founder_label}.png",
    )

    context = ssl.create_default_context()
    with smtplib.SMTP(host, port) as server:
        server.starttls(context=context)
        server.login(user, password)
        server.send_message(msg)

    print(f"[badge] sent founder #{founder_label} badge to {to_email}")
    return True
