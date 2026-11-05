"""Generic hero banner: brand-blue gradient on the left, photo on the right centred on a focus point.

usage: make_banner.py SRC OUT FOCUS_X FOCUS_Y CROP_H PHOTO_W [FEATHER]
  FOCUS_X/Y  point in the source image to centre in the photo area (e.g. the subject)
  CROP_H     source pixels of height to show (smaller = more zoom)
  PHOTO_W    width of the photo area on the 1920x1080 canvas (right-aligned)
"""
import sys
from PIL import Image, ImageDraw, ImageEnhance, ImageFilter

src, out = sys.argv[1], sys.argv[2]
fx, fy, crop_h, photo_w = (int(v) for v in sys.argv[3:7])
feather = int(sys.argv[7]) if len(sys.argv) > 7 else 280
W, H = 1920, 1080

img = Image.open(src).convert("RGB")
img = ImageEnhance.Contrast(img).enhance(1.04)

bg = Image.new("RGB", (W, H))
d = ImageDraw.Draw(bg)
left, right = (14, 52, 104), (26, 86, 167)  # #0e3468 -> #1a56a7, same as slide 1
for x in range(W):
    t = min(1, x / 1100)
    d.line([(x, 0), (x, H)], fill=tuple(round(a + (b - a) * t) for a, b in zip(left, right)))

crop_w = round(photo_w * crop_h / H)
x0 = max(0, min(img.width - crop_w, fx - crop_w // 2))
y0 = max(0, min(img.height - crop_h, fy - crop_h // 2))
photo = img.crop((x0, y0, x0 + crop_w, y0 + crop_h)).resize((photo_w, H), Image.LANCZOS)
photo = photo.filter(ImageFilter.UnsharpMask(radius=1.5, percent=40, threshold=2))

mask = Image.new("L", (photo_w, H), 255)
md = ImageDraw.Draw(mask)
for i in range(feather):
    md.line([(i, 0), (i, H)], fill=round(255 * (i / feather) ** 1.6))
bg.paste(photo, (W - photo_w, 0), mask)

bg.save(out, "JPEG", quality=86, optimize=True, progressive=True)
fx_canvas = W - photo_w + (fx - x0) * H / crop_h
print(f"saved {out}: focus at x={fx_canvas:.0f} ({fx_canvas / W:.0%})")
