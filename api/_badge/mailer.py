"""Gmail delivery. Fully wired for Gmail SMTP with an app password — it just
stays dormant until you set GMAIL_USER + GMAIL_APP_PASSWORD. Until then it logs
the intent and returns False, so issuing a badge never fails on delivery."""

import os
import smtplib
import ssl
from email.message import EmailMessage


def gmail_configured():
    return bool(os.getenv("GMAIL_USER") and os.getenv("GMAIL_APP_PASSWORD"))


def send_badge_email(to_email, png_bytes, founder_label, hidden_code):
    if not gmail_configured():
        print(
            f"[badge] Gmail not configured — skipping send to {to_email} "
            f"(founder #{founder_label}, code {hidden_code}). Delivery TODO."
        )
        return False

    user = os.environ["GMAIL_USER"]
    password = os.environ["GMAIL_APP_PASSWORD"]
    sender = os.getenv("GMAIL_FROM", user)

    msg = EmailMessage()
    msg["Subject"] = f"You're founder #{founder_label} — your alair badge"
    msg["From"] = sender
    msg["To"] = to_email
    msg.set_content(
        f"You're one of the first.\n\n"
        f"Founder #{founder_label}. Your badge is attached.\n\n"
        f"— alair"
    )
    msg.add_alternative(
        f"""
        <div style="font-family:Georgia,serif;color:#2d2623">
          <p>You're one of the first.</p>
          <p><strong>Founder #{founder_label}.</strong> Your badge is attached.</p>
          <p style="color:#6f665f">— alair</p>
        </div>
        """,
        subtype="html",
    )
    msg.add_attachment(
        png_bytes,
        maintype="image",
        subtype="png",
        filename=f"whiff_founder_badge_{founder_label}.png",
    )

    context = ssl.create_default_context()
    with smtplib.SMTP_SSL("smtp.gmail.com", 465, context=context) as server:
        server.login(user, password)
        server.send_message(msg)

    print(f"[badge] sent founder #{founder_label} badge to {to_email}")
    return True
