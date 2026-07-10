"""Vercel Python serverless function — runs ONCE per request, then exits.

Trigger: the Next app POSTs here when someone submits the do-you-know-me form
("we got an email"). This function checks the DB for the next founder number,
renders the badge, stores it, and emails it. No server sits idle between
requests — Vercel spins this up on demand and tears it down after.

Routes (file-based, so no rewrite config needed):
  POST /api/badge            {"email": "..."} -> mint one badge
  GET  /api/badge            -> health check
  GET  /api/badge?code=ALR-… -> regenerate a stored badge as a PNG
"""

import json
import os
import re
import sys
from http.server import BaseHTTPRequestHandler
from datetime import datetime, timezone
from urllib.parse import parse_qs, urlparse

# The rendering/DB/email helpers live in api/_badge/ (the underscore keeps
# Vercel from turning them into routes). Put that dir on the import path.
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), "_badge"))

try:  # local dev convenience; on Vercel, env comes from the dashboard
    from dotenv import load_dotenv

    load_dotenv()
except Exception:
    pass

import db
import mailer
import render

EMAIL_RE = re.compile(r"^[^\s@]+@[^\s@]+\.[^\s@]+$")


def _token_ok(headers):
    """Optional shared secret so only the Next app can mint badges."""
    expected = os.getenv("BADGE_SERVICE_TOKEN")
    return not expected or headers.get("X-Badge-Token") == expected


class handler(BaseHTTPRequestHandler):
    def _json(self, status, obj):
        body = json.dumps(obj).encode()
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def _png(self, png_bytes):
        self.send_response(200)
        self.send_header("Content-Type", "image/png")
        self.send_header("Content-Length", str(len(png_bytes)))
        self.end_headers()
        self.wfile.write(png_bytes)

    def do_GET(self):
        code = (parse_qs(urlparse(self.path).query).get("code") or [None])[0]
        if not code:
            return self._json(200, {"ok": True})
        doc = db.find_badge(code)
        if not doc:
            return self._json(404, {"error": "Unknown badge."})
        img, _, _ = render.render_badge(doc["founderNumber"], doc["hiddenCode"])
        return self._png(render.to_png_bytes(img))

    def do_POST(self):
        if not _token_ok(self.headers):
            return self._json(401, {"error": "Invalid badge token."})

        length = int(self.headers.get("Content-Length") or 0)
        try:
            payload = json.loads(self.rfile.read(length) or b"{}")
        except json.JSONDecodeError:
            return self._json(400, {"error": "Invalid JSON body."})

        email = str(payload.get("email", "")).strip().lower()
        if not EMAIL_RE.match(email):
            return self._json(400, {"error": "A valid email is required."})

        # One request = one badge. The counter is the "what was the last number"
        # lookup, done atomically so concurrent requests never collide.
        founder_number = db.next_founder_number()
        img, founder_label, hidden_code = render.render_badge(founder_number)
        png_bytes = render.to_png_bytes(img)

        # Best-effort local copy (Vercel's filesystem is read-only except /tmp;
        # the badge is regenerable from the DB anyway, so never block on this).
        try:
            badge_file = render.save_png(img, founder_label)
        except OSError as error:
            print(f"[badge] could not save local copy: {error}")
            badge_file = None

        db.save_badge(
            {
                "founderNumber": founder_number,
                "founderLabel": founder_label,
                "hiddenCode": hidden_code,
                "email": email,
                "badgeFile": badge_file,
                "sent": False,
                "sentAt": None,
                "createdAt": datetime.now(timezone.utc),
            }
        )

        sent = mailer.send_badge_email(email, png_bytes, founder_label, hidden_code)
        if sent:
            db.mark_sent(hidden_code)

        return self._json(
            200,
            {
                "founderNumber": founder_number,
                "founderLabel": founder_label,
                "hiddenCode": hidden_code,
                "sent": sent,
            },
        )
