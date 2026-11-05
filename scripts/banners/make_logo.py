"""Builds the website logo files from the clinic's logo artwork (white art on indigo #3B3C7F).

    python scripts/banners/make_logo.py <logo.jpg> public/img/brand

Outputs:
  logo-white.png      white artwork on a transparent background (for the blue nav bar / footer)
  logo-tooth.png      just the tooth mark, white on transparent
  favicon.png / apple-touch-icon.png   tooth on the site's royal blue, for browser tabs and home screens
"""
import sys
from pathlib import Path
from PIL import Image, ImageDraw

src, out = Path(sys.argv[1]), Path(sys.argv[2])
out.mkdir(parents=True, exist_ok=True)
BG_R = 59           # red channel of the indigo background
INSET = 16          # skip the thin white frame drawn 6–8px inside the edge
BRAND = (26, 86, 167)  # site primary #1a56a7

img = Image.open(src).convert("RGB")
img = img.crop((INSET, INSET, img.width - INSET, img.height - INSET))

# Brightness → opacity: background becomes fully transparent, white art fully opaque,
# anti-aliased edges keep their partial transparency so curves stay smooth.
r = img.getchannel("R")
alpha = r.point(lambda v: max(0, min(255, round((v - BG_R) * 255 / (255 - BG_R)))))
alpha = alpha.point(lambda a: 0 if a < 18 else a)  # drop JPEG noise in the background
white = Image.new("RGBA", img.size, (255, 255, 255, 0))
white.putalpha(alpha)

def trim(im: Image.Image, pad: int) -> Image.Image:
    box = im.getchannel("A").getbbox()
    im = im.crop(box)
    canvas = Image.new("RGBA", (im.width + pad * 2, im.height + pad * 2), (255, 255, 255, 0))
    canvas.paste(im, (pad, pad))
    return canvas

logo = trim(white, 6)
# 2x the largest display height (≈70px) keeps it sharp on retina screens.
h = 180
logo.resize((round(logo.width * h / logo.height), h), Image.LANCZOS).save(out / "logo-white.png", optimize=True)

# Tooth mark only (top part of the artwork, above the text).
tooth_region = white.crop((440, 0, 840, 340))
tooth = trim(tooth_region, 0)
tooth.resize((round(tooth.width * 256 / tooth.height), 256), Image.LANCZOS).save(out / "logo-tooth.png", optimize=True)

def icon(size: int, radius_ratio: float) -> Image.Image:
    canvas = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    ImageDraw.Draw(canvas).rounded_rectangle((0, 0, size - 1, size - 1), radius=round(size * radius_ratio), fill=BRAND + (255,))
    t = tooth.copy()
    th = round(size * 0.72)
    t = t.resize((round(t.width * th / t.height), th), Image.LANCZOS)
    canvas.alpha_composite(t, ((size - t.width) // 2, (size - th) // 2))
    return canvas

icon(64, 0.22).save(out / "favicon.png", optimize=True)
icon(180, 0.0).convert("RGB").save(out / "apple-touch-icon.png", optimize=True)  # iOS rounds corners itself
print("logo", Image.open(out / "logo-white.png").size, "| tooth", Image.open(out / "logo-tooth.png").size)
