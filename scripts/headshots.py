#!/usr/bin/env python3
"""Turn the raw headshots in _originals/team into square web assets.

Separate from optimize-images.py on purpose. That script owns static/img and
wipes it on every run, so anything dropped there by hand disappears; headshots
get their own output directory, static/headshots, and their own re-runnable
script.

Sources are whatever organizers send in — phone portraits, DSLR frames, the
occasional landscape crop — so the shape has to be normalised here rather than
by the roster's CSS. Each one becomes a single square WebP, sized for the
largest the roster tile ever renders.
"""

from PIL import Image, ImageOps
from pathlib import Path
import shutil
import sys

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / '_originals' / 'team'
OUT = ROOT / 'static' / 'headshots'

EDGE = 600  # roster tiles cap around 300px, so this covers 2x displays
QUALITY = 80

EXTS = {'.jpg', '.jpeg', '.png', '.webp'}

# Where to put the square within the source, as a fraction of the leftover
# space on each axis: 0 is flush left/top, 0.5 centred, 1 flush right/bottom.
# The vertical default is well above centre because faces sit high in a
# portrait frame — a centred crop tends to take the chin off.
DEFAULT_ANCHOR = (0.5, 0.18)

# Per-photo overrides for the ones the default gets wrong.
ANCHORS = {
    # Full-body shot against the step-and-repeat: the default crop leaves too
    # much backdrop overhead, so pull the square down onto head-and-shoulders.
    'aayan-agarwal': (0.49, 0.28),
}


def square(im, anchor):
    """Crop the largest centred-on-anchor square, then resize to EDGE."""
    side = min(im.width, im.height)
    ax, ay = anchor
    x = round((im.width - side) * ax)
    y = round((im.height - side) * ay)
    out = im.crop((x, y, x + side, y + side))
    return out.resize((EDGE, EDGE), Image.LANCZOS)


def main():
    if not SRC.is_dir():
        sys.exit(
            f'no headshots at {SRC.relative_to(ROOT)} — drop one JPEG or PNG per\n'
            'organizer in there, named for them (e.g. ben-packer.jpg), and re-run.'
        )

    if OUT.exists():
        shutil.rmtree(OUT)
    OUT.mkdir(parents=True)

    files = sorted(p for p in SRC.iterdir() if p.suffix.lower() in EXTS)
    if not files:
        sys.exit(f'{SRC.relative_to(ROOT)} has no images in it')

    total_in = total_out = 0

    for path in files:
        slug = path.stem.lower()
        # exif_transpose first: phone photos carry their rotation in metadata,
        # and cropping before applying it would take the square off the wrong
        # edge. save() then writes none of that metadata through.
        im = ImageOps.exif_transpose(Image.open(path)).convert('RGB')

        dest = OUT / f'{slug}.webp'
        square(im, ANCHORS.get(slug, DEFAULT_ANCHOR)).save(
            dest, 'WEBP', quality=QUALITY, method=6
        )

        total_in += path.stat().st_size
        total_out += dest.stat().st_size
        print(f'  {slug:20s} <- {path.name}')

    print(
        f'\n{len(files)} headshots: {total_in/1048576:.0f} MB'
        f' -> {total_out/1024:.0f} KB in {OUT.relative_to(ROOT)}'
    )


if __name__ == '__main__':
    main()
