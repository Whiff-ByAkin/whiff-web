"""Badge email delivery via SMTP.

Defaults target Gmail (Google Workspace) SMTP submission: authenticate as the
real mailbox (SMTP_USER) with an App Password, and send from the "Send mail as"
alias (SMTP_FROM). Delivery stays dormant until SMTP_USER + SMTP_PASSWORD are
set, so issuing a badge never fails on email delivery while credentials are
still being configured.

Images (wordmark, badge, Instagram glyph) are embedded inline via CID so the
email renders the same everywhere with no external hosting to depend on.
"""

import os
import smtplib
import ssl
from email.message import EmailMessage
from functools import lru_cache
from pathlib import Path

ASSETS = Path(__file__).parent / "assets"

# Brand palette (kept in sync with the site / badge render).
OAT = "#fbf6ec"
CARD = "#ffffff"
INK = "#2e2723"
SIENNA = "#b85c38"
MUTED = "#6f665f"

INSTAGRAM_URL = "https://www.instagram.com/discover_whiff/"
INSTAGRAM_HANDLE = "@discover_whiff"
CONTACT_EMAIL = os.getenv("SMTP_FROM") or "hello@whi-ff.com"


def smtp_configured():
    return bool(os.getenv("SMTP_USER") and os.getenv("SMTP_PASSWORD"))


@lru_cache(maxsize=8)
def _asset(name):
    """Read a bundled image once. Returns bytes, or None if it isn't there so a
    missing asset degrades to no image instead of breaking the send."""
    try:
        return (ASSETS / name).read_bytes()
    except OSError as error:
        print(f"[badge] inline asset {name} unavailable: {error}")
        return None


def _plain_text(founder_label):
    return (
        "Hi there,\n\n"
        "You're one of the very first people to try whiff, so here's a little "
        f"something to mark it: a Founding Witness badge. You're founder "
        f"#{founder_label}, and it's yours to keep.\n\n"
        "whiff is about finding people who love the oddly specific stuff you "
        "love. Less swiping, more \"wait, you too?\"\n\n"
        "No sign-up, nothing you need to do. Just a thank-you for being here "
        "early.\n\n"
        f"Come say hi on Instagram: {INSTAGRAM_HANDLE} ({INSTAGRAM_URL})\n\n"
        "Founder & the whiff crew\n"
    )


def _html(founder_label):
    has_logo = _asset("whiff-wordmark.png") is not None
    has_ig = _asset("instagram.png") is not None

    logo = (
        '<img src="cid:whiff-logo" alt="whiff" width="150" height="54" '
        'style="display:block;border:0;outline:none;text-decoration:none;">'
        if has_logo
        else '<span style="font-family:Georgia,serif;font-size:34px;'
        f'color:{INK};font-style:italic;">whiff</span>'
    )

    ig_icon = (
        '<img src="cid:whiff-ig" alt="" width="20" height="20" '
        'style="display:inline-block;vertical-align:middle;border:0;">&nbsp;'
        if has_ig
        else ""
    )

    return f"""\
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background-color:{OAT};">
  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" bgcolor="{OAT}">
    <tr>
      <td align="center" style="padding:36px 16px;">
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width:520px;">
          <tr>
            <td align="center" style="padding:8px 0 28px;">
              {logo}
            </td>
          </tr>

          <tr>
            <td bgcolor="{CARD}" style="border-top:3px solid {SIENNA};border-radius:6px 6px 0 0;padding:40px 44px 8px;font-family:Georgia,serif;color:{INK};">
              <p style="margin:0 0 18px;font-size:24px;line-height:30px;">Hi there,</p>
              <p style="margin:0 0 18px;font-size:16px;line-height:27px;">
                You're one of the very first people to try whiff, so here's a
                little something to mark it: a <strong>Founding Witness</strong>
                badge. You're founder #{founder_label}, and it's yours to keep.
              </p>
              <p style="margin:0 0 18px;font-size:16px;line-height:27px;">
                whiff is about finding people who love the oddly specific stuff
                you love. Less swiping, more &ldquo;wait, you too?&rdquo;
              </p>
              <p style="margin:0 0 20px;font-size:16px;line-height:27px;">
                No sign-up, nothing you need to do. Just a thank-you for being
                here early.
              </p>
              <p style="margin:0;font-size:16px;line-height:26px;">Founder &amp; the whiff crew</p>
            </td>
          </tr>

          <tr>
            <td bgcolor="{CARD}" align="center" style="border-radius:0 0 6px 6px;padding:32px 44px 40px;">
              <img src="cid:whiff-badge" alt="Founding Witness badge" width="210" height="210" style="display:block;margin:0 auto 14px;border:0;">
              <p style="margin:0;font-family:Georgia,serif;font-size:13px;letter-spacing:1px;text-transform:uppercase;color:{SIENNA};">
                Founder #{founder_label}
              </p>
            </td>
          </tr>

          <tr>
            <td align="center" style="padding:28px 20px 8px;">
              <a href="{INSTAGRAM_URL}" style="text-decoration:none;color:{SIENNA};font-family:Georgia,serif;font-size:15px;">
                {ig_icon}<span style="vertical-align:middle;border-bottom:1px solid {SIENNA};">Follow along {INSTAGRAM_HANDLE}</span>
              </a>
            </td>
          </tr>

          <tr>
            <td align="center" style="padding:14px 24px 8px;">
              <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:19px;color:{MUTED};">
                You're receiving this as proof of your Founding Witness badge.
                <br>
                Questions? <a href="mailto:{CONTACT_EMAIL}" style="color:{MUTED};text-decoration:underline;">Get in touch</a> any time.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
"""


def send_badge_email(to_email, png_bytes, founder_label, hidden_code):
    if not smtp_configured():
        print(
            f"[badge] SMTP not configured — skipping send to {to_email} "
            f"(founder #{founder_label}, code {hidden_code}). Delivery TODO."
        )
        return False

    host = os.getenv("SMTP_HOST", "smtp.gmail.com")
    port = int(os.getenv("SMTP_PORT", "587"))
    user = os.environ["SMTP_USER"]
    password = os.environ["SMTP_PASSWORD"]
    sender = os.getenv("SMTP_FROM", user)

    msg = EmailMessage()
    msg["Subject"] = f"Your Founding Witness badge from whiff (#{founder_label})"
    msg["From"] = sender
    msg["To"] = to_email

    msg.set_content(_plain_text(founder_label))
    msg.add_alternative(_html(founder_label), subtype="html")

    # Embed images the HTML references by CID. add_related attaches them to the
    # HTML part (multipart/related) so they render inline, not as attachments.
    html_part = msg.get_payload()[1]
    logo_bytes = _asset("whiff-wordmark.png")
    if logo_bytes:
        html_part.add_related(logo_bytes, maintype="image", subtype="png", cid="whiff-logo")
    html_part.add_related(png_bytes, maintype="image", subtype="png", cid="whiff-badge")
    ig_bytes = _asset("instagram.png")
    if ig_bytes:
        html_part.add_related(ig_bytes, maintype="image", subtype="png", cid="whiff-ig")

    # Also attach the badge so the recipient can save it.
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
