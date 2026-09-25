"""Android launcher icons and splash screens, rendered from public/favicon.svg.

The stock Capacitor artwork shipped in the first build; this replaces every density with the
real mark. Written as a script rather than @capacitor/assets so the output is deterministic and
needs no extra dependency - `cap add` would overwrite these, so re-run after that.
"""
import io, os
import cairosvg
from PIL import Image, ImageDraw

ROOT = "/Users/abcom/Documents/GitHub/ikan2"
RES  = f"{ROOT}/android/app/src/main/res"
SVG  = open(f"{ROOT}/public/favicon.svg", "rb").read()

PLATE  = (250, 250, 250)   # the svg's own plate colour
SPLASH = (251, 251, 253)   # --background

def mark(px):
    """The black ring-and-asterisk on transparency, with the svg's light plate removed."""
    im = Image.open(io.BytesIO(
        cairosvg.svg2png(bytestring=SVG, output_width=px, output_height=px))).convert("RGBA")
    p = im.load()
    for y in range(px):
        for x in range(px):
            r, g, b, a = p[x, y]
            if a and r > 235 and g > 235 and b > 235:
                p[x, y] = (r, g, b, 0)
    return im

def centred(canvas_px, mark_frac, bg=None, circle=False):
    base = Image.new("RGBA", (canvas_px, canvas_px), (0, 0, 0, 0))
    if bg:
        if circle:
            d = ImageDraw.Draw(base)
            d.ellipse([0, 0, canvas_px - 1, canvas_px - 1], fill=bg + (255,))
        else:
            base.paste(Image.new("RGBA", (canvas_px, canvas_px), bg + (255,)), (0, 0))
    m_px = max(1, round(canvas_px * mark_frac))
    m = mark(m_px)
    base.paste(m, ((canvas_px - m_px) // 2, (canvas_px - m_px) // 2), m)
    return base

DENSITIES = {"mdpi": 48, "hdpi": 72, "xhdpi": 96, "xxhdpi": 144, "xxxhdpi": 192}

for d, size in DENSITIES.items():
    out = f"{RES}/mipmap-{d}"
    # Legacy square icon: plate + mark, the mark generous because the launcher masks the corners.
    centred(size, 0.86, bg=PLATE).convert("RGB").save(f"{out}/ic_launcher.png")
    # Round icon: same, clipped to a circle.
    centred(size, 0.86, bg=PLATE, circle=True).save(f"{out}/ic_launcher_round.png")
    # Adaptive foreground is 108dp but only the middle 72dp is guaranteed visible, so the mark
    # is kept inside that safe zone - 0.58 of the canvas, a touch under 72/108.
    centred(size * 9 // 4, 0.58).save(f"{out}/ic_launcher_foreground.png")
    print("mipmap-" + d, size)

SPLASHES = {
    "drawable": (480, 320),
    "drawable-port-mdpi": (320, 480), "drawable-land-mdpi": (480, 320),
    "drawable-port-hdpi": (480, 800), "drawable-land-hdpi": (800, 480),
    "drawable-port-xhdpi": (720, 1280), "drawable-land-xhdpi": (1280, 720),
    "drawable-port-xxhdpi": (960, 1600), "drawable-land-xxhdpi": (1600, 960),
    "drawable-port-xxxhdpi": (1280, 1920), "drawable-land-xxxhdpi": (1920, 1280),
}
for folder, (w, h) in SPLASHES.items():
    os.makedirs(f"{RES}/{folder}", exist_ok=True)
    img = Image.new("RGB", (w, h), SPLASH)
    m_px = round(min(w, h) * 0.22)
    m = mark(m_px)
    img.paste(m, ((w - m_px) // 2, (h - m_px) // 2), m)
    img.save(f"{RES}/{folder}/splash.png")
    print(folder, w, h)

# Source artwork, kept in the repo so this is reproducible.
Image.open(io.BytesIO(cairosvg.svg2png(bytestring=SVG, output_width=1024, output_height=1024))) \
    .convert("RGB").save(f"{ROOT}/assets/icon.png")
print("assets/icon.png 1024")
