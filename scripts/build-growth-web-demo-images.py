#!/usr/bin/env python3
"""Build responsive AVIF/WebP images for the Growth Web demo (/services/growth-web/demo).

The originals are Unsplash photos (Unsplash License) downloaded at 2400px wide.
They are NOT committed. Put them in one folder and run:

    python3 scripts/build-growth-web-demo-images.py --src /path/to/originals

Each output is a crop of the original; children are shown from behind, from the
chest down or at a distance so no child's face is identifiable. The hero's
background wall (graffiti) is softened with a blur so its lettering is unreadable.
Credits and license notes: public/images/growth-web-demo/CREDITS.md
"""
from __future__ import annotations

import argparse
import os

from PIL import Image, ImageDraw, ImageFilter

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "public", "images", "growth-web-demo")

# name -> (source file, crop box on the 2400px original, output widths)
JOBS = {
    "hero-wide": ("hero-dribble-cones_ocroZaKaoyI.jpg", (300, 360, 2400, 1600), (1280, 1920)),
    "hero-tall": ("hero-dribble-cones_ocroZaKaoyI.jpg", (500, 360, 1760, 1600), (480, 720, 828)),
    "coach": ("coach-shoelace_yndHHu2kJAw.jpg", (700, 200, 2380, 1460), (640, 1200)),
    "class-movement": ("preschool-field_WtpTVeCXcAg.jpg", (0, 1300, 2400, 3100), (320, 480)),
    "class-u9": ("dribble-pair_0axqBrI8Or4.jpg", (130, 0, 2263, 1600), (320, 480)),
    "class-indoor": ("indoor-futsal-feet_3EBaEQ0mKPk.jpg", (300, 400, 1900, 1600), (320, 480)),
    "class-u12": ("throwin-back_PDbr_bFHvL4.jpg", (500, 0, 2400, 1425), (320, 480)),
    "class-weekend": ("ball-closeup_RuFuCkow5uw.jpg", (0, 700, 2400, 2500), (320, 480)),
}


# Small logos / printed names to blur on the original (left, top, right, bottom).
BLUR_BOXES = {
    "indoor-futsal-feet_3EBaEQ0mKPk.jpg": [(1500, 480, 1660, 640)],
    "dribble-pair_0axqBrI8Or4.jpg": [(1820, 80, 2020, 280)],
    "throwin-back_PDbr_bFHvL4.jpg": [(1980, 40, 2400, 280)],
}


def blur_boxes(img: Image.Image, boxes: list[tuple[int, int, int, int]]) -> Image.Image:
    if not boxes:
        return img
    blurred = img.filter(ImageFilter.GaussianBlur(14))
    mask = Image.new("L", img.size, 0)
    for box in boxes:
        ImageDraw.Draw(mask).ellipse(box, fill=255)
    return Image.composite(blurred, img, mask.filter(ImageFilter.GaussianBlur(12)))


# Printed badges to cover with the surrounding fabric colour (box, sample point).
COVER_BOXES = {
    "coach-shoelace_yndHHu2kJAw.jpg": [((1792, 862, 1842, 930), (1870, 900))],
}


def cover_boxes(img: Image.Image, boxes) -> Image.Image:
    for box, sample in boxes:
        patch = Image.new("RGB", (box[2] - box[0], box[3] - box[1]), img.getpixel(sample))
        mask = Image.new("L", patch.size, 0)
        ImageDraw.Draw(mask).rounded_rectangle((0, 0, patch.width - 1, patch.height - 1), radius=5, fill=255)
        img.paste(patch, box[:2], mask.filter(ImageFilter.GaussianBlur(2)))
    return img


def soften_wall(img: Image.Image) -> Image.Image:
    """Blur the graffiti wall behind the player (right of the standing leg, above the ball)."""
    blurred = img.filter(ImageFilter.GaussianBlur(9))
    mask = Image.new("L", img.size, 0)
    ImageDraw.Draw(mask).rectangle((1420, 860, 2400, 1330), fill=255)
    ImageDraw.Draw(mask).rectangle((1600, 1300, 2400, 1460), fill=255)
    mask = mask.filter(ImageFilter.GaussianBlur(30))
    return Image.composite(blurred, img, mask)


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--src", required=True)
    args = ap.parse_args()
    os.makedirs(OUT, exist_ok=True)
    cache: dict[str, Image.Image] = {}
    for name, (file, box, widths) in JOBS.items():
        if file not in cache:
            img = Image.open(os.path.join(args.src, file)).convert("RGB")
            if file.startswith("hero-"):
                img = soften_wall(img)
            img = blur_boxes(img, BLUR_BOXES.get(file, []))
            img = cover_boxes(img, COVER_BOXES.get(file, []))
            cache[file] = img
        crop = cache[file].crop(box)
        for w in widths:
            h = round(crop.height * w / crop.width)
            out = crop.resize((w, h), Image.LANCZOS)
            q = (32 if name == "hero-tall" else 40) if name.startswith("hero") else 52
            out.save(os.path.join(OUT, f"{name}-{w}.avif"), "AVIF", quality=q, speed=4)
            out.save(os.path.join(OUT, f"{name}-{w}.webp"), "WEBP", quality=72, method=6)
            print(f"{name}-{w}: {w}x{h}")


if __name__ == "__main__":
    main()
