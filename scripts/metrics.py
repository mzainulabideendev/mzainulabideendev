#!/usr/bin/env python3
"""Write advance widths (in em) for every subset font so the build can size pills, chips and names exactly."""
import json, os
from fontTools.ttLib import TTFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
D = os.path.join(ROOT, "assets", "src", "fonts")
out = {}
for key in ("display", "body", "mono", "monob"):
    f = TTFont(os.path.join(D, f"{key}.ttf"))
    upm = f["head"].unitsPerEm
    cmap = f.getBestCmap()
    hmtx = f["hmtx"]
    out[key] = {chr(cp): round(hmtx[g][0] / upm, 4) for cp, g in cmap.items()}
json.dump(out, open(os.path.join(D, "metrics.json"), "w"))
print({k: len(v) for k, v in out.items()})
