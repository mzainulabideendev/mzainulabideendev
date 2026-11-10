#!/usr/bin/env python3
"""Produce the hero frame sequence in assets/src/frames/f_00.jpg ... f_NN.jpg

 * If assets/src/wave.mp4 (or .mov/.webm) exists, every frame of it is extracted with ffmpeg
   (resampled to 15 fps so a 2-second clip becomes 30 frames).
 * Otherwise a 30-frame placeholder clip is synthesised from the portrait (slow push-in,
   gentle sway and a light sweep) so the whole pipeline still works. Drop your real clip in and re-run."""
import glob, math, os, subprocess, sys
from PIL import Image, ImageEnhance, ImageDraw, ImageChops

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, "assets", "src")
FR = os.path.join(SRC, "frames")
os.makedirs(FR, exist_ok=True)
for f in glob.glob(os.path.join(FR, "f_*.jpg")):
    os.remove(f)

SIZE = 256
N = 30
video = next((p for ext in ("mp4", "mov", "webm", "m4v") for p in glob.glob(os.path.join(SRC, f"wave.{ext}"))), None)

if video:
    print("extracting frames from", video)
    subprocess.check_call([
        "ffmpeg", "-y", "-loglevel", "error", "-i", video,
        "-vf", f"fps=15,scale={SIZE}:{SIZE}:force_original_aspect_ratio=increase,crop={SIZE}:{SIZE}",
        "-q:v", "5", os.path.join(FR, "f_%02d.jpg")])
    # ffmpeg numbers from 1; rename to zero-based
    files = sorted(glob.glob(os.path.join(FR, "f_*.jpg")))
    for i, p in enumerate(files):
        os.rename(p, os.path.join(FR, f"tmp_{i:02d}.jpg"))
    for i, p in enumerate(sorted(glob.glob(os.path.join(FR, "tmp_*.jpg")))):
        os.rename(p, os.path.join(FR, f"f_{i:02d}.jpg"))
else:
    print("no wave.mp4 found - synthesising placeholder motion from the portrait")
    img = Image.open(os.path.join(SRC, "portrait.jpg")).convert("RGB")
    W = img.size[0]
    for i in range(N):
        t = i / (N - 1)
        ease = t * t * (3 - 2 * t)
        scale = 1.0 + 0.10 * ease
        ang = 1.6 * math.sin(t * math.pi * 2)
        dx = 10 * math.sin(t * math.pi)
        big = img.resize((int(W * scale), int(W * scale)), Image.LANCZOS).rotate(ang, resample=Image.BICUBIC)
        L = (big.size[0] - W) // 2
        box = (L + int(dx), L, L + int(dx) + W, L + W)
        fr = big.crop(box).resize((SIZE, SIZE), Image.LANCZOS)
        # light sweep
        sweep = Image.new("L", (SIZE, SIZE), 0)
        d = ImageDraw.Draw(sweep)
        cx = int(-80 + (SIZE + 160) * ease)
        d.polygon([(cx, 0), (cx + 70, 0), (cx - 20, SIZE), (cx - 90, SIZE)], fill=70)
        white = Image.new("RGB", (SIZE, SIZE), (255, 236, 214))
        fr = Image.composite(white, fr, sweep.point(lambda v: v))
        fr = ImageEnhance.Brightness(fr).enhance(1.0 + 0.05 * math.sin(t * math.pi))
        fr.save(os.path.join(FR, f"f_{i:02d}.jpg"), quality=60, optimize=True)

files = sorted(glob.glob(os.path.join(FR, "f_*.jpg")))
print(len(files), "frames,", sum(os.path.getsize(f) for f in files) // 1024, "KB total")
