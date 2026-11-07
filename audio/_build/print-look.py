"""80s magazine print look: diffusion glow, faded warm grade, misregistration, halftone screen, grain, vignette."""
import sys, numpy as np
from PIL import Image, ImageFilter
src, dst = sys.argv[1], sys.argv[2]
rng = np.random.default_rng(7)
im = Image.open(src).convert("RGB")
a = np.asarray(im, dtype=np.float32) / 255.0
h, w, _ = a.shape

# 1. soft-focus diffusion (Hamilton-style glow in the highlights)
blur = np.asarray(im.filter(ImageFilter.GaussianBlur(10)), dtype=np.float32) / 255.0
hl = np.clip((blur.mean(2, keepdims=True) - 0.45) / 0.55, 0, 1)
a = 1 - (1 - a) * (1 - blur * 0.28 * hl)

# 2. faded print grade: lower saturation, warm cast, lifted inky blacks, creamy highlights
lum = (a @ np.array([0.299, 0.587, 0.114], np.float32))[..., None]
a = lum + (a - lum) * 0.82
a = a * np.array([1.04, 1.0, 0.90], np.float32)
a = a * a * (3 - 2 * a) * 0.35 + a * 0.65                      # gentle S-curve
shadow = np.array([0.10, 0.075, 0.08], np.float32); paper = np.array([0.975, 0.95, 0.88], np.float32)
a = shadow + np.clip(a, 0, 1) * (paper - shadow)

# 3. slight ink misregistration
a[..., 0] = np.roll(a[..., 0], 1, axis=1)
a[..., 2] = np.roll(a[..., 2], -1, axis=0)

# 4. halftone screen (45°) multiplied in lightly
yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
pitch = 4.2; c, s = np.cos(np.pi / 4), np.sin(np.pi / 4)
u, v = (xx * c - yy * s) * 2 * np.pi / pitch, (xx * s + yy * c) * 2 * np.pi / pitch
screen = (np.cos(u) + np.cos(v)) * 0.25 + 0.5
lum = (a @ np.array([0.299, 0.587, 0.114], np.float32))
dots = np.clip((lum - screen) * 6 + 0.5, 0, 1)[..., None]
a = a * (1 - 0.13 * (1 - dots))

# 5. film grain
a = a + rng.normal(0, 0.022, (h, w, 1)).astype(np.float32)

# 6. vignette
r = np.sqrt(((xx - w / 2) / (w / 2)) ** 2 + ((yy - h / 2) / (h / 2)) ** 2)
a = a * (1 - 0.22 * np.clip(r - 0.55, 0, 1) ** 1.6)[..., None]

Image.fromarray((np.clip(a, 0, 1) * 255).astype(np.uint8)).save(dst, quality=82, optimize=True, progressive=True)
