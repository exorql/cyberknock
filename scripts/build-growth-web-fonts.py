#!/usr/bin/env python3
"""Build glyph subsets for the Growth Web LP (/services/growth-web).

Why: the LP's headings use a mincho display face. Serving the full font would
cost several MB; the heading copy is static, so we ship only the glyphs it uses
(~10 KB) and keep the `palt` feature for Japanese spacing. Prices and labels use
a Latin-only Inter subset. Body text uses system Japanese fonts (no download).

Run after changing any LP copy (tests/growth-web-lp.test.mjs fails if a
character is missing from the subsets):

    pip install fonttools brotli
    python3 scripts/build-growth-web-fonts.py            # downloads sources into .cache/
    python3 scripts/build-growth-web-fonts.py --src DIR  # or use local copies

Sources (SIL Open Font License 1.1, from github.com/google/fonts):
  ofl/shipporimincho/ShipporiMincho-ExtraBold.ttf
  ofl/inter/Inter[opsz,wght].ttf
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
OUT = os.path.join(ROOT, "public", "fonts", "growth-web")
RAW = "https://raw.githubusercontent.com/google/fonts/main/ofl/"
SOURCES = {
    "mincho": ("ShipporiMincho-ExtraBold.ttf", RAW + "shipporimincho/ShipporiMincho-ExtraBold.ttf"),
    "inter": ("Inter[opsz,wght].ttf", RAW + "inter/Inter%5Bopsz,wght%5D.ttf"),
}

SERIF_SOURCE = "lib/growth-web/lp-content.ts"


def read(rel: str) -> str:
    with open(os.path.join(ROOT, rel), encoding="utf-8") as f:
        return f.read()


def serif_text() -> str:
    block = re.search(r"export const SERIF_TEXT = \{(.*?)\} as const", read(SERIF_SOURCE), re.S)
    if not block:
        raise SystemExit("SERIF_TEXT block not found in " + SERIF_SOURCE)
    strings = re.findall(r'"([^"]*)"', block.group(1))
    return "".join(sorted(set("".join(strings)) | set("、。")))


def source(key: str, src_dir: str) -> str:
    name, url = SOURCES[key]
    path = os.path.join(src_dir, name)
    if not os.path.exists(path):
        os.makedirs(src_dir, exist_ok=True)
        print(f"downloading {name}")
        urllib.request.urlretrieve(url, path)
    return path


def write_subset(font: TTFont, text: str, filename: str, features: list[str]) -> str:
    opts = subset.Options()
    opts.flavor = "woff2"
    opts.layout_features = features
    opts.name_IDs = [0, 1, 2, 13, 14]  # keep copyright + OFL license fields
    opts.hinting = False
    opts.desubroutinize = True
    sub = subset.Subsetter(opts)
    sub.populate(text=text)
    sub.subset(font)
    font.flavor = "woff2"
    font.save(os.path.join(OUT, filename))
    covered = {chr(cp) for cp in font.getBestCmap()}
    return "".join(sorted(covered))


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--src", default=os.path.join(ROOT, ".cache", "growth-web-fonts"))
    args = parser.parse_args()
    os.makedirs(OUT, exist_ok=True)

    manifest: dict[str, str] = {}
    serif = serif_text()
    manifest["gw-mincho-800.woff2"] = write_subset(TTFont(source("mincho", args.src)), serif, "gw-mincho-800.woff2", ["palt", "kern"])

    latin = "".join(chr(c) for c in range(0x20, 0x100)) + "‐‑‒–—―‘’“”•…→←↑↓↗"
    for weight in (700,):
        static = instancer.instantiateVariableFont(TTFont(source("inter", args.src)), {"wght": weight, "opsz": 14})
        manifest[f"inter-latin-{weight}.woff2"] = write_subset(static, latin, f"inter-latin-{weight}.woff2", ["kern", "tnum"])

    with open(os.path.join(OUT, "manifest.json"), "w", encoding="utf-8") as f:
        json.dump(manifest, f, ensure_ascii=False, indent=1, sort_keys=True)
        f.write("\n")
    for name in sorted(manifest):
        size = os.path.getsize(os.path.join(OUT, name))
        print(f"{name}: {len(manifest[name])} glyphs, {size / 1024:.1f} KB")


if __name__ == "__main__":
    main()
