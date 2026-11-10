#!/usr/bin/env python3
"""Subset the system fonts to the glyphs the SVGs need and write TTFs to assets/src/fonts/.
woff2.mjs then wraps them as WOFF2 (Brotli) so the SVGs can inline them as base64."""
import os, sys
from fontTools import subset
from fontTools.ttLib import TTFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "assets", "src", "fonts")
os.makedirs(OUT, exist_ok=True)

GF = "/usr/share/fonts/truetype/google-fonts"
DJ = "/usr/share/fonts/truetype/dejavu"
FONTS = {
    "display": f"{GF}/Poppins-Bold.ttf",
    "body": f"{GF}/Poppins-Medium.ttf",
    "mono": f"{DJ}/DejaVuSansMono.ttf",
    "monob": f"{DJ}/DejaVuSansMono-Bold.ttf",
}
TEXT = "".join(chr(c) for c in range(0x20, 0x7F)) + "·•→←↗★☆—–…©●○✓×°’‘“”™"

for key, path in FONTS.items():
    opts = subset.Options()
    opts.layout_features = ["kern", "liga"]
    opts.hinting = False
    opts.desubroutinize = True
    opts.notdef_outline = True
    opts.name_IDs = [1, 2]
    f = TTFont(path)
    s = subset.Subsetter(opts)
    s.populate(text=TEXT)
    s.subset(f)
    out = os.path.join(OUT, f"{key}.ttf")
    f.save(out)
    print(key, os.path.getsize(out), "bytes ->", out)
