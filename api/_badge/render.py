"""Founder badge rendering.

This keeps the API flow one-badge-at-a-time while using the current square
"founding witness" template and placement settings.
"""

import io
import os
import secrets
import string
from functools import lru_cache
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

# ---- template + output (override with env) ----
TEMPLATE_PATH = os.getenv(
    "BADGE_TEMPLATE_PATH",
    str(Path(__file__).parent / "assets" / "whiff-badge-no-number.png"),
)
OUTPUT_DIR = os.getenv(
    "BADGE_OUTPUT_DIR",
    str(Path(__file__).parent / "generated_whiff_badges"),
)

# Fonts are BUNDLED (assets/fonts/) so rendering is identical on macOS and on
# Vercel's Linux — no reliance on system fonts. Arimo is metric-compatible with
# Arial (the number); Cousine is a clean monospace standing in for Menlo (the
# hidden code). Both are OFL-licensed. Override via env if you want.
_FONTS_DIR = Path(__file__).parent / "assets" / "fonts"
NUMBER_FONT_PATH = os.getenv("BADGE_NUMBER_FONT", str(_FONTS_DIR / "Arimo-Regular.ttf"))
HIDDEN_FONT_PATH = os.getenv("BADGE_HIDDEN_FONT", str(_FONTS_DIR / "Cousine-Regular.ttf"))

NUMBER_FONT_SIZE = 72
HIDDEN_FONT_SIZE = 16

NUMBER_COLOR = "#b85c38"
HIDDEN_CODE_COLOR = (111, 102, 95, 165)

CODE_PREFIX = "WHF-FND"

# ----- Visible number placement -----
NUMBER_CENTER_OFFSET_FROM_BADGE_BOTTOM = 160
NUMBER_RIGHT_SHIFT = 42

# ----- Hidden code placement -----
HIDDEN_CODE_CENTER_OFFSET_FROM_BADGE_TOP = 435
HIDDEN_CODE_RIGHT_SHIFT = 0

# Only needed if a template still has a baked-in number.
COVER_EXISTING_NUMBER = False
COVER_WIDTH = 170
COVER_HEIGHT = 80
COVER_FILL_COLOR = (244, 235, 222, 255)

# Preserve transparency for the square badge template.
SAVE_TRANSPARENT = True
BACKGROUND_FILL = (255, 255, 255, 255)


def create_hidden_code():
    chars = string.ascii_uppercase + string.digits
    random_part = "".join(secrets.choice(chars) for _ in range(6))
    return f"{CODE_PREFIX}-{random_part}"


def _load_template(path):
    path = Path(path)

    if path.suffix.lower() == ".svg":
        try:
            import cairosvg
        except ImportError as error:
            raise ImportError(
                "SVG support requires cairosvg. Install it with: pip install cairosvg"
            ) from error

        png_bytes = cairosvg.svg2png(
            url=str(path),
            output_width=1080,
            output_height=1080,
        )
        return Image.open(io.BytesIO(png_bytes)).convert("RGBA")

    return Image.open(path).convert("RGBA")


def _load_font(path, size):
    try:
        return ImageFont.truetype(str(path), size)
    except OSError:
        print(f"[badge] font not found at {path}; falling back to default font")
        return ImageFont.load_default()


def _color_distance(c1, c2):
    return sum((a - b) ** 2 for a, b in zip(c1, c2)) ** 0.5


def _find_badge_bbox(img):
    """Find the badge itself, not the full canvas.

    Works for transparent or non-transparent images.
    """
    rgba = img.convert("RGBA")
    width, height = rgba.size

    alpha = rgba.getchannel("A")
    if alpha.getextrema()[0] < 255:
        mask = alpha.point(lambda a: 255 if a > 10 else 0)
        bbox = mask.getbbox()
        if bbox:
            return bbox

    background_color = rgba.getpixel((0, 0))[:3]
    mask = Image.new("L", rgba.size, 0)
    mask_pixels = mask.load()
    pixels = rgba.load()

    for y in range(height):
        for x in range(width):
            r, g, b, a = pixels[x, y]
            if a <= 10:
                continue
            if _color_distance((r, g, b), background_color) > 35:
                mask_pixels[x, y] = 255

    bbox = mask.getbbox()
    if not bbox:
        raise ValueError("Could not detect badge area. Check the template image.")

    return bbox


@lru_cache(maxsize=1)
def _template():
    img = _load_template(TEMPLATE_PATH)
    return img, _find_badge_bbox(img)


def _draw_centered_text(draw, text, font, center_x, center_y, fill):
    bbox = draw.textbbox((0, 0), text, font=font)
    text_width = bbox[2] - bbox[0]
    text_height = bbox[3] - bbox[1]

    x = center_x - text_width / 2 - bbox[0]
    y = center_y - text_height / 2 - bbox[1]

    draw.text((x, y), text, font=font, fill=fill)


def _cover_existing_number(img, number_center_x, number_center_y):
    draw = ImageDraw.Draw(img)

    left = number_center_x - COVER_WIDTH / 2
    top = number_center_y - COVER_HEIGHT / 2
    right = number_center_x + COVER_WIDTH / 2
    bottom = number_center_y + COVER_HEIGHT / 2

    draw.rectangle((left, top, right, bottom), fill=COVER_FILL_COLOR)


def render_badge(founder_number, hidden_code=None):
    """Render a single badge. Pass an existing hidden_code to reproduce a badge
    from a stored record (deterministic); omit it to mint a fresh one.

    Returns (RGBA image, founder_label, hidden_code)."""
    template, badge_bbox = _template()
    img = template.copy()
    draw = ImageDraw.Draw(img)

    number_font = _load_font(NUMBER_FONT_PATH, NUMBER_FONT_SIZE)
    hidden_font = _load_font(HIDDEN_FONT_PATH, HIDDEN_FONT_SIZE)

    founder_label = str(founder_number).zfill(3)
    hidden_code = hidden_code or create_hidden_code()

    badge_left, badge_top, badge_right, badge_bottom = badge_bbox
    badge_center_x = (badge_left + badge_right) / 2
    badge_bottom_y = badge_bottom - 1

    # ----- visible founder number -----
    number_center_x = badge_center_x + NUMBER_RIGHT_SHIFT
    number_center_y = badge_bottom_y - NUMBER_CENTER_OFFSET_FROM_BADGE_BOTTOM

    if COVER_EXISTING_NUMBER:
        _cover_existing_number(img, number_center_x, number_center_y)

    _draw_centered_text(
        draw=draw,
        text=founder_label,
        font=number_font,
        center_x=number_center_x,
        center_y=number_center_y,
        fill=NUMBER_COLOR,
    )

    # ----- hidden code: horizontal placement above FOUNDING -----
    hidden_center_x = badge_center_x + HIDDEN_CODE_RIGHT_SHIFT
    hidden_center_y = badge_top + HIDDEN_CODE_CENTER_OFFSET_FROM_BADGE_TOP

    _draw_centered_text(
        draw=draw,
        text=hidden_code,
        font=hidden_font,
        center_x=hidden_center_x,
        center_y=hidden_center_y,
        fill=HIDDEN_CODE_COLOR,
    )

    if SAVE_TRANSPARENT:
        return img, founder_label, hidden_code

    background = Image.new("RGBA", img.size, BACKGROUND_FILL)
    background.alpha_composite(img)
    return background.convert("RGB"), founder_label, hidden_code


def to_png_bytes(img):
    buf = io.BytesIO()
    img.save(buf, format="PNG")
    return buf.getvalue()


def save_png(img, founder_label):
    """Also drop a copy on disk (like your original script). Returns the filename."""
    out_dir = Path(OUTPUT_DIR)
    out_dir.mkdir(parents=True, exist_ok=True)
    filename = f"whiff_founding_witness_badge_{founder_label}.png"
    img.save(out_dir / filename)
    return filename
