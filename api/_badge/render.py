"""Founder badge rendering — your original PIL logic, refactored to draw ONE
badge on demand. Constants and pixel offsets are unchanged so your hand-tuning
still holds; drop-in a different template and re-tune via the env overrides."""

import io
import os
import secrets
import string
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

# ---- template + output (override with env) ----
# Drop your PNG at badge-service/assets/whiff_founder_badge_template.png,
# or point BADGE_TEMPLATE_PATH somewhere else.
TEMPLATE_PATH = os.getenv(
    "BADGE_TEMPLATE_PATH",
    str(Path(__file__).parent / "assets" / "whiff_founder_badge_template.png"),
)
OUTPUT_DIR = os.getenv(
    "BADGE_OUTPUT_DIR",
    str(Path(__file__).parent / "generated_badges"),
)

# Fonts are BUNDLED (assets/fonts/) so rendering is identical on macOS and on
# Vercel's Linux — no reliance on system fonts. Arimo is metric-compatible with
# Arial (the number); Cousine is a clean monospace standing in for Menlo (the
# hidden code). Both are OFL-licensed. Override via env if you want.
_FONTS_DIR = Path(__file__).parent / "assets" / "fonts"
NUMBER_FONT_PATH = os.getenv("BADGE_NUMBER_FONT", str(_FONTS_DIR / "Arimo-Regular.ttf"))
HIDDEN_FONT_PATH = os.getenv("BADGE_HIDDEN_FONT", str(_FONTS_DIR / "Cousine-Regular.ttf"))

NUMBER_FONT_SIZE = 72
HIDDEN_FONT_SIZE = 18

TEXT_COLOR = "#2d2623"
HIDDEN_CODE_COLOR = (111, 102, 95, 215)

# Relative to the bottom of the dark badge border.
# Bigger number = text moves UP. Smaller = DOWN.
NUMBER_OFFSET_FROM_BADGE_BOTTOM = 126
HIDDEN_OFFSET_FROM_BADGE_BOTTOM = 31

# Nudge the visible 001 slightly right.
NUMBER_RIGHT_SHIFT = 18

# The template never changes at runtime, so load it (and find its bottom edge)
# exactly once, then copy per badge. The old per-image pixel scan was the slow
# part of your script — here it runs a single time per process.
_TEMPLATE_IMG = None
_BADGE_BOTTOM_Y = None


def create_hidden_code():
    chars = string.ascii_uppercase + string.digits
    random_part = "".join(secrets.choice(chars) for _ in range(6))
    return f"ALR-FND-{random_part}"


def _load_font(path, size):
    try:
        return ImageFont.truetype(path, size)
    except OSError:
        print(f"[badge] font not found at {path}; falling back to default font")
        return ImageFont.load_default()


def _find_badge_bottom_y(img):
    """Lowest dark pixel = bottom of the badge border. Scans bottom-up and
    returns on the first dark row found, so it's much faster than the original
    full-image sweep."""
    rgb = img.convert("RGB")
    width, height = rgb.size
    px = rgb.load()

    for y in range(height - 1, -1, -1):
        for x in range(width):
            r, g, b = px[x, y]
            if r < 70 and g < 70 and b < 70:
                return y
    return 0


def _template():
    global _TEMPLATE_IMG, _BADGE_BOTTOM_Y
    if _TEMPLATE_IMG is None:
        img = Image.open(TEMPLATE_PATH).convert("RGBA")
        _TEMPLATE_IMG = img
        _BADGE_BOTTOM_Y = _find_badge_bottom_y(img)
    return _TEMPLATE_IMG, _BADGE_BOTTOM_Y


def render_badge(founder_number, hidden_code=None):
    """Render a single badge. Pass an existing hidden_code to reproduce a badge
    from a stored record (deterministic); omit it to mint a fresh one.

    Returns (RGB image, founder_label, hidden_code)."""
    template, badge_bottom_y = _template()
    img = template.copy()
    draw = ImageDraw.Draw(img)

    number_font = _load_font(NUMBER_FONT_PATH, NUMBER_FONT_SIZE)
    hidden_font = _load_font(HIDDEN_FONT_PATH, HIDDEN_FONT_SIZE)

    founder_label = str(founder_number).zfill(3)
    hidden_code = hidden_code or create_hidden_code()

    number_y = badge_bottom_y - NUMBER_OFFSET_FROM_BADGE_BOTTOM
    hidden_code_y = badge_bottom_y - HIDDEN_OFFSET_FROM_BADGE_BOTTOM

    # ----- visible founder number -----
    number_bbox = draw.textbbox((0, 0), founder_label, font=number_font)
    number_width = number_bbox[2] - number_bbox[0]
    x_number = (img.width - number_width) // 2 + NUMBER_RIGHT_SHIFT
    draw.text((x_number, number_y), founder_label, font=number_font, fill=TEXT_COLOR)

    # ----- hidden code inside the dark border -----
    hidden_bbox = draw.textbbox((0, 0), hidden_code, font=hidden_font)
    hidden_width = hidden_bbox[2] - hidden_bbox[0]
    x_hidden = (img.width - hidden_width) // 2

    hidden_layer = Image.new("RGBA", img.size, (255, 255, 255, 0))
    hidden_draw = ImageDraw.Draw(hidden_layer)
    hidden_draw.text((x_hidden, hidden_code_y), hidden_code, font=hidden_font, fill=HIDDEN_CODE_COLOR)

    img = Image.alpha_composite(img, hidden_layer)
    return img.convert("RGB"), founder_label, hidden_code


def to_png_bytes(img):
    buf = io.BytesIO()
    img.save(buf, format="PNG")
    return buf.getvalue()


def save_png(img, founder_label):
    """Also drop a copy on disk (like your original script). Returns the filename."""
    out_dir = Path(OUTPUT_DIR)
    out_dir.mkdir(parents=True, exist_ok=True)
    filename = f"whiff_founder_badge_{founder_label}.png"
    img.save(out_dir / filename)
    return filename
