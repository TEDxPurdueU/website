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

MAX_EDGE = 600  # roster tiles cap around 300px, so this covers 2x displays
QUALITY = 80

EXTS = {'.jpg', '.jpeg', '.png', '.webp'}

# Each entry is (centre x, centre y, side) as fractions: the first two locate
# the middle of the square within the frame, the third sizes it against the
# shorter edge. 1.0 is therefore the largest square the photo can give up, and
# anything less zooms in.
#
# Hand-set per photo because submissions are not headshots. Two of these are
# holiday snaps where the person is a small part of a large landscape, so no
# single rule crops them all to a face of roughly the same size — which is the
# thing that makes the roster read as one grid rather than six loose photos.
# The rule of thumb: head from crown to chin filling a bit under half the tile.
DEFAULT_CROP = (0.5, 0.42, 1.0)

CROPS = {
    # Step-and-repeat portraits: full width, nudged up off the floor.
    'aayan-agarwal': (0.49, 0.427, 1.0),
    'alaina-salsaa': (0.50, 0.393, 1.0),
    'sophia-smith': (0.50, 0.420, 1.0),
    # Selfie on a hiking trail, face around a fifth of the frame height.
    'ben-packer': (0.52, 0.545, 0.60),
    # Full-body street photo — the tightest crop here by some distance, and
    # the only one that ends up under 600px as a result.
    'gia-sareen': (0.50, 0.685, 0.32),
    # Already close to a headshot; full width is as wide as it goes.
    'laiba-farooqi': (0.50, 0.550, 1.0),
}


def square(im, crop):
    """Cut the square described by `crop`, then size it for the roster."""
    cx, cy, frac = crop
    side = round(min(im.width, im.height) * frac)

    # Clamp rather than reject: a centre near an edge is easier to eyeball
    # from the photo than one corrected for the square's own width, and
    # sliding it back inside the frame is what a person would do anyway.
    x = min(max(round(im.width * cx) - side // 2, 0), im.width - side)
    y = min(max(round(im.height * cy) - side // 2, 0), im.height - side)
    out = im.crop((x, y, x + side, y + side))

    # Never upscale. One source is small enough that MAX_EDGE would invent
    # detail, and a soft 490px tile beats a soft 600px one.
    edge = min(MAX_EDGE, side)
    return out.resize((edge, edge), Image.LANCZOS)


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
        square(im, CROPS.get(slug, DEFAULT_CROP)).save(
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
