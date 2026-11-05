"""Builds a 1920x1080 hero banner from a portrait photo: smile-centred face on the right,
brand-blue gradient panel on the left (behind the headline), joined by a soft feathered edge."""
import sys
from PIL import Image, ImageDraw, ImageEnhance, ImageFilter

src, out = sys.argv[1], sys.argv[2]
W, H = 1920, 1080
MOUTH_X, MOUTH_Y = 245, 505  # smile position in the 640x1351 source
CROP_H = 760                 # forehead to necklace

img = Image.open(src).convert("RGB")
img = ImageEnhance.Brightness(img).enhance(1.1)
img = ImageEnhance.Contrast(img).enhance(1.06)
img = ImageEnhance.Color(img).enhance(1.05)

# Left panel: horizontal gradient in the site's blues.
left, right = (14, 52, 104), (26, 86, 167)  # #0e3468 -> #1a56a7
bg = Image.new("RGB", (W, H))
d = ImageDraw.Draw(bg)
for x in range(W):
    t = min(1, x / 1100)
    d.line([(x, 0), (x, H)], fill=tuple(round(a + (b - a) * t) for a, b in zip(left, right)))

# Face crop with the smile vertically centred.
y0 = MOUTH_Y - CROP_H // 2
face = img.crop((0, y0, img.width, y0 + CROP_H))
s = H / CROP_H
fw = round(face.width * s)
face = face.resize((fw, H), Image.LANCZOS).filter(ImageFilter.UnsharpMask(radius=2, percent=50, threshold=2))

# Feathered left edge so the photo melts into the gradient.
x0 = W - fw + 100  # shift right; trims only background on the far right
feather = 200
mask = Image.new("L", (fw, H), 255)
md = ImageDraw.Draw(mask)
for i in range(feather):
    md.line([(i, 0), (i, H)], fill=round(255 * (i / feather) ** 1.6))
bg.paste(face, (x0, 0), mask)

bg.save(out, "JPEG", quality=86, optimize=True, progressive=True)
mx = x0 + MOUTH_X * s
print(f"saved {out}: smile at x={mx:.0f} ({mx / W:.0%}), y={(MOUTH_Y - y0) * s:.0f}")
