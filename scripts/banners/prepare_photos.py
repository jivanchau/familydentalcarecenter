"""Crops and compresses Unsplash photos for the site.

    python scripts/banners/prepare_photos.py <download_dir> public/img/photos

Each entry: output name -> (source file, crop box as fractions (left, top, right, bottom) or None).
All outputs are 3:2, 1200 px wide, progressive JPEG (~100–200 KB).
Sources, photographers and licences are listed in IMAGE_CREDITS.md.
"""
import sys
from pathlib import Path
from PIL import Image, ImageOps

src_dir, out_dir = Path(sys.argv[1]), Path(sys.argv[2])
out_dir.mkdir(parents=True, exist_ok=True)

PHOTOS = {
    "root-canal": ("root-canal-b.jpg", None),  # X-ray light box (the chair shot matched the cleaning photo too closely)
    "wisdom-tooth": ("wisdom-tooth.jpg", None),
    "gum-treatment": ("gum-treatment.jpg", None),
    "braces": ("braces.jpg", None),
    # crop below the aligner case (brand name) and left of the whitener bottle
    "clear-aligners": ("clear-aligners.jpg", (0.0, 0.30, 0.64, 0.95)),
    "veneers": ("veneers.jpg", None),
    "digital-smile": ("digital-smile.jpg", None),
    "teeth-whitening": ("teeth-whitening.jpg", None),
    "dental-implant": ("dental-implant.jpg", None),
    "crown-bridge": ("crown-bridge.jpg", None),
    "denture": ("denture.jpg", None),
    "full-mouth-rehab": ("full-mouth-rehab.jpg", None),
    "cavity-filling": ("cavity-filling.jpg", None),
    "kids-dental": ("kids-dental.jpg", None),
    "scaling-cleaning": ("scaling-cleaning.jpg", None),
    "clinic-interior": ("about-clinic.jpg", None),
    "dentist-patient": ("dentist-patient.jpg", None),
}

# Wide page banner (shown 300 px tall across the full width, under a blue tint)
WIDE = {"page-banner": ("page-banner.jpg", (0.30, 0.10, 1.0, 0.62))}  # right of the wall painting


def prepare(src: Path, box, out: Path, width=1200, ratio=3 / 2):
    im = ImageOps.exif_transpose(Image.open(src)).convert("RGB")
    if box:
        l, t, r, b = box
        im = im.crop((round(l * im.width), round(t * im.height), round(r * im.width), round(b * im.height)))
    im = ImageOps.fit(im, (width, round(width / ratio)), Image.LANCZOS, centering=(0.5, 0.5))
    im.save(out, "JPEG", quality=80, optimize=True, progressive=True)
    return out.stat().st_size


if __name__ == "__main__":
    for name, (file, box) in WIDE.items():
        if (src_dir / file).exists():
            print(f"{name:18} {prepare(src_dir / file, box, out_dir / f'{name}.jpg', width=1920, ratio=1920 / 700) // 1024} KB")
    for name, (file, box) in PHOTOS.items():
        if (src_dir / file).exists():
            print(f"{name:18} {prepare(src_dir / file, box, out_dir / f'{name}.jpg') // 1024} KB")
        else:
            print(f"{name:18} missing source {file}")
