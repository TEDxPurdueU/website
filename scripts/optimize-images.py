#!/usr/bin/env python3
"""Turn the raw camera files in _originals into web assets.

Originals run 7-12MB each and 300MB+ in total, which is far too heavy to
commit or to serve. This resizes each one twice — a full size for the
lightbox and a thumbnail for grids — converts to WebP, bakes in EXIF
rotation (13 of the originals are stored sideways) and drops all other
metadata.

Re-runnable: it rewrites static/img from scratch each time, so adding a
photo to _originals/ and running `npm run images` is the whole
workflow.
"""

from PIL import Image, ImageOps
from pathlib import Path
import shutil
import sys

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / '_originals'
OUT = ROOT / 'static' / 'img'

FULL_EDGE = 1600  # longest edge for the lightbox
THUMB_EDGE = 600  # longest edge for grid tiles
QUALITY = 80

# Photos that fill a specific slot get a stable, meaningful name. Everything
# else is numbered in sorted order.
NAMED = {
    'landing_page/big.jpg': 'conference-group',
    'landing_page/small.JPG': 'audience',
    'landing_page/speakers/aastha.JPG': 'speaker-aastha',
    'landing_page/speakers/bo.jpg': 'speaker-bo',
    'landing_page/speakers/chase.JPG': 'speaker-chase',
    'landing_page/speakers/nicole.JPG': 'speaker-nicole',
    'landing_page/speakers/prady.jpg': 'speaker-prady',
    'landing_page/speakers/sid.JPG': 'speaker-sid',
    'student_speaker/2026/DSC_7481.JPG': 'winner-2026',
    'student_speaker/2025/speaker_1.JPG': 'winner-2025-a',
    'student_speaker/2025/speaker_2.JPG': 'winner-2025-b',
    'DSC_7722.jpg': 'stage-group',
}

# Byte-identical copy of student_speaker/2026/DSC_7481.JPG.
SKIP = {'student_speaker/DSC_7481.JPG'}

EXTS = {'.jpg', '.jpeg', '.png', '.webp'}


def encode(im, path, edge):
    out = ImageOps.contain(im, (edge, edge), Image.LANCZOS)
    out.save(path, 'WEBP', quality=QUALITY, method=6)
    return path.stat().st_size


def main():
    if not SRC.is_dir():
        sys.exit(f'no originals at {SRC}')

    if OUT.exists():
        shutil.rmtree(OUT)
    OUT.mkdir(parents=True)

    files = sorted(
        p for p in SRC.rglob('*')
        if p.is_file() and p.suffix.lower() in EXTS
    )

    seq = 0
    total_in = total_out = 0
    rows = []

    for path in files:
        rel = path.relative_to(SRC).as_posix()
        if rel in SKIP:
            continue

        if rel in NAMED:
            slug = NAMED[rel]
        else:
            seq += 1
            slug = f'gallery-{seq:02d}'

        # Rotation lives in EXIF on 13 of these; applying it before we strip
        # metadata is what keeps them upright once the tags are gone.
        im = ImageOps.exif_transpose(Image.open(path)).convert('RGB')

        total_in += path.stat().st_size
        total_out += encode(im, OUT / f'{slug}.webp', FULL_EDGE)
        total_out += encode(im, OUT / f'{slug}-thumb.webp', THUMB_EDGE)
        rows.append((slug, rel))

    for slug, rel in rows:
        print(f'  {slug:20s} <- {rel}')
    print(f'\n{len(rows)} photos: {total_in/1048576:.0f} MB -> {total_out/1048576:.1f} MB')


if __name__ == '__main__':
    main()
