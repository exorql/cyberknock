#!/usr/bin/env python3
"""Build glyph subsets for the Growth Web demo (/services/growth-web/demo).

Headings use Zen Kaku Gothic New Black. The heading copy is static, so only the
glyphs in DEMO_DISPLAY_TEXT (lib/growth-web/demo-content.ts) are shipped. Numbers
and Latin labels use an Archivo ExtraBold Latin subset. Body text uses system
Japanese fonts (no download).

Run after changing DEMO_DISPLAY_TEXT (tests/growth-web-demo.test.mjs fails if a
character is missing from the subset):

    pip install fonttools brotli
    python3 scripts/build-growth-web-demo-fonts.py            # downloads sources into .cache/
    python3 scripts/build-growth-web-demo-fonts.py --src DIR  # or use local copies

Sources (SIL Open Font License 1.1, from github.com/google/fonts):
  ofl/zenkakugothicnew/ZenKakuGothicNew-Black.ttf
  ofl/archivo/Archivo[wdth,wght].ttf
"""
from __future__ import annotations

import argparse
import json
import os
import re
import urllib.request

from fontTools import subset
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "public", "fonts", "growth-web-demo")
RAW = "https://raw.githubusercontent.com/google/fonts/main/ofl/"
SOURCES = {
    "zen": ("ZenKakuGothicNew-Black.ttf", RAW + "zenkakugothicnew/ZenKakuGothicNew-Black.ttf"),
    "archivo": ("Archivo[wdth,wght].ttf", RAW + "archivo/Archivo%5Bwdth,wght%5D.ttf"),
}
LATIN = "".join(chr(c) for c in range(0x20, 0x7F)) + "–·¥’"


def display_text() -> str:
    with open(os.path.join(ROOT, "lib/growth-web/demo-content.ts"), encoding="utf-8") as f:
        src = f.read()
    block = re.search(r"export const DEMO_DISPLAY_TEXT = \{(.*?)\} as const", src, re.S)
    if not block:
        raise SystemExit("DEMO_DISPLAY_TEXT block not found")
    strings = re.findall(r'"([^"]*)"', block.group(1))
    return "".join(sorted(set("".join(strings))))


def source(key: str, src_dir: str) -> str:
    name, url = SOURCES[key]
    path = os.path.join(src_dir, name)
    if not os.path.exists(path):
        os.makedirs(src_dir, exist_ok=True)
        urllib.request.urlretrieve(url, path)
    return path


def write_subset(font: TTFont, text: str, out: str) -> None:
    opts = subset.Options()
    opts.flavor = "woff2"
    opts.layout_features = ["palt", "kern", "liga", "tnum", "lnum"]
    opts.name_IDs = ["*"]
    opts.notdef_outline = True
    sub = subset.Subsetter(opts)
    sub.populate(text=text)
    sub.subset(font)
    font.flavor = "woff2"
    font.save(out)


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--src", default=os.path.join(ROOT, ".cache", "fonts"))
    args = ap.parse_args()
    os.makedirs(OUT, exist_ok=True)

    text = display_text()
    zen = TTFont(source("zen", args.src))
    write_subset(zen, text, os.path.join(OUT, "zen-kaku-gothic-new-900.woff2"))

    archivo = instancer.instantiateVariableFont(TTFont(source("archivo", args.src)), {"wght": 800, "wdth": 100})
    write_subset(archivo, LATIN, os.path.join(OUT, "archivo-800.woff2"))

    manifest = {
        "zen-kaku-gothic-new-900.woff2": {"glyphs": text, "count": len(text)},
        "archivo-800.woff2": {"glyphs": LATIN, "count": len(LATIN)},
    }
    with open(os.path.join(OUT, "manifest.json"), "w", encoding="utf-8") as f:
        json.dump(manifest, f, ensure_ascii=False, indent=1)
    for name in manifest:
        print(name, os.path.getsize(os.path.join(OUT, name)), "bytes")


if __name__ == "__main__":
    main()
