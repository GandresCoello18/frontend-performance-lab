#!/usr/bin/env python3
"""Genera ilustraciones de producto (licencia propia del demo) en JPEG pesado y WebP ligero."""

from __future__ import annotations

import math
import os
import random
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageEnhance

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "public" / "images"
OUT.mkdir(parents=True, exist_ok=True)

W, H = 2400, 1600


def noise(img: Image.Image, amount: int = 18) -> Image.Image:
    rnd = random.Random(42)
    px = img.load()
    w, h = img.size
    step = 2
    for y in range(0, h, step):
        for x in range(0, w, step):
            r, g, b = px[x, y][:3]
            d = rnd.randint(-amount, amount)
            px[x, y] = (
                max(0, min(255, r + d)),
                max(0, min(255, g + d)),
                max(0, min(255, b + d)),
            )
    return img


def bg(c1: tuple[int, int, int], c2: tuple[int, int, int]) -> Image.Image:
    img = Image.new("RGB", (W, H), c1)
    draw = ImageDraw.Draw(img)
    for y in range(H):
        t = y / H
        col = tuple(int(c1[i] * (1 - t) + c2[i] * t) for i in range(3))
        draw.line([(0, y), (W, y)], fill=col)
    # mesa
    table = (186, 149, 112)
    draw.polygon(
        [(0, int(H * 0.62)), (W, int(H * 0.56)), (W, H), (0, H)],
        fill=table,
    )
    for y in range(int(H * 0.58), H):
        shade = int(20 * (y - H * 0.58) / (H * 0.42))
        draw.line(
            [(0, y), (W, y)],
            fill=(max(0, table[0] - shade), max(0, table[1] - shade), max(0, table[2] - shade)),
        )
    return img


def shadow(draw: ImageDraw.ImageDraw, box: tuple[int, int, int, int], r: int = 40) -> None:
    x0, y0, x1, y1 = box
    draw.ellipse([x0, y0, x1, y1], fill=(40, 28, 18, 70))


def headphones(img: Image.Image) -> Image.Image:
    d = ImageDraw.Draw(img, "RGBA")
    cx, cy = W // 2, int(H * 0.46)
    shadow(d, (cx - 380, cy + 280, cx + 380, cy + 360))
    # diadema
    d.arc([cx - 280, cy - 320, cx + 280, cy + 80], 200, 340, fill=(62, 44, 32, 255), width=48)
    d.arc([cx - 250, cy - 290, cx + 250, cy + 50], 200, 340, fill=(214, 176, 128, 255), width=18)
    # copas
    for s in (-1, 1):
        x = cx + s * 250
        d.rounded_rectangle([x - 90, cy - 40, x + 90, cy + 200], 40, fill=(48, 36, 28, 255))
        d.rounded_rectangle([x - 70, cy - 10, x + 70, cy + 170], 32, fill=(28, 22, 18, 255))
        d.ellipse([x - 50, cy + 40, x + 50, cy + 130], fill=(196, 122, 64, 255))
    return img


def speaker(img: Image.Image) -> Image.Image:
    d = ImageDraw.Draw(img, "RGBA")
    cx, cy = W // 2, int(H * 0.48)
    shadow(d, (cx - 260, cy + 300, cx + 260, cy + 360))
    d.rounded_rectangle([cx - 180, cy - 260, cx + 180, cy + 300], 90, fill=(232, 228, 220, 255))
    d.rounded_rectangle([cx - 160, cy - 240, cx + 160, cy + 280], 80, fill=(40, 40, 38, 255))
    d.ellipse([cx - 110, cy - 150, cx + 110, cy + 70], fill=(70, 70, 68, 255))
    d.ellipse([cx - 50, cy - 90, cx + 50, cy + 10], fill=(20, 20, 18, 255))
    d.ellipse([cx - 70, cy + 120, cx + 70, cy + 250], fill=(70, 70, 68, 255))
    d.ellipse([cx - 28, cy + 162, cx + 28, cy + 218], fill=(20, 20, 18, 255))
    return img


def plant(img: Image.Image) -> Image.Image:
    d = ImageDraw.Draw(img, "RGBA")
    cx, cy = W // 2, int(H * 0.62)
    shadow(d, (cx - 220, cy + 180, cx + 240, cy + 240))
    d.polygon([(cx - 140, cy + 180), (cx + 140, cy + 180), (cx + 100, cy - 20), (cx - 100, cy - 20)], fill=(176, 92, 64, 255))
    d.polygon([(cx - 88, cy - 20), (cx + 88, cy - 20), (cx + 70, cy - 70), (cx - 70, cy - 70)], fill=(214, 186, 150, 255))
    greens = [(46, 107, 62), (62, 140, 78), (34, 84, 48), (88, 156, 92)]
    leaves = [
        (cx, cy - 80, -80, -420),
        (cx, cy - 80, 90, -400),
        (cx, cy - 60, -180, -280),
        (cx, cy - 60, 200, -260),
        (cx, cy - 40, -40, -340),
        (cx, cy - 50, 40, -360),
    ]
    for i, (x, y, dx, dy) in enumerate(leaves):
        d.ellipse([x + dx - 70, y + dy - 40, x + dx + 90, y + dy + 160], fill=(*greens[i % 4], 255))
    return img


def lamp(img: Image.Image) -> Image.Image:
    d = ImageDraw.Draw(img, "RGBA")
    cx, cy = W // 2, int(H * 0.7)
    shadow(d, (cx - 200, cy + 40, cx + 320, cy + 100))
    d.rectangle([cx - 160, cy, cx + 160, cy + 28], fill=(48, 36, 28, 255))
    d.rectangle([cx - 18, cy - 420, cx + 18, cy], fill=(196, 148, 74, 255))
    d.polygon([(cx + 10, cy - 400), (cx + 280, cy - 220), (cx + 240, cy - 180), (cx + 10, cy - 340)], fill=(196, 148, 74, 255))
    d.polygon([(cx + 240, cy - 210), (cx + 320, cy - 150), (cx + 200, cy - 90), (cx + 170, cy - 160)], fill=(245, 236, 214, 255))
    return img


def clock(img: Image.Image) -> Image.Image:
    d = ImageDraw.Draw(img, "RGBA")
    cx, cy = W // 2, int(H * 0.46)
    r = 340
    shadow(d, (cx - 300, cy + 300, cx + 340, cy + 360))
    d.ellipse([cx - r, cy - r, cx + r, cy + r], fill=(236, 230, 220, 255))
    d.ellipse([cx - r + 28, cy - r + 28, cx + r - 28, cy + r - 28], fill=(48, 42, 36, 255))
    d.ellipse([cx - r + 48, cy - r + 48, cx + r - 48, cy + r - 48], fill=(247, 243, 236, 255))
    for i in range(12):
        a = math.radians(i * 30 - 90)
        x0 = cx + int(math.cos(a) * 250)
        y0 = cy + int(math.sin(a) * 250)
        x1 = cx + int(math.cos(a) * 290)
        y1 = cy + int(math.sin(a) * 290)
        d.line([(x0, y0), (x1, y1)], fill=(48, 42, 36, 255), width=10)
    d.line([(cx, cy), (cx + 8, cy - 160)], fill=(48, 42, 36, 255), width=14)
    d.line([(cx, cy), (cx + 120, cy + 40)], fill=(196, 92, 48, 255), width=10)
    d.ellipse([cx - 16, cy - 16, cx + 16, cy + 16], fill=(196, 92, 48, 255))
    return img


def vase(img: Image.Image) -> Image.Image:
    d = ImageDraw.Draw(img, "RGBA")
    cx, cy = W // 2, int(H * 0.5)
    shadow(d, (cx - 200, cy + 340, cx + 220, cy + 400))
    d.polygon(
        [
            (cx - 70, cy - 280),
            (cx + 70, cy - 280),
            (cx + 90, cy - 200),
            (cx + 160, cy + 80),
            (cx + 130, cy + 340),
            (cx - 130, cy + 340),
            (cx - 160, cy + 80),
            (cx - 90, cy - 200),
        ],
        fill=(214, 186, 150, 255),
    )
    d.ellipse([cx - 80, cy - 300, cx + 80, cy - 250], fill=(196, 164, 122, 255))
    d.arc([cx - 40, cy - 40, cx + 120, cy + 200], 20, 160, fill=(196, 122, 64, 255), width=8)
    return img


def blanket(img: Image.Image) -> Image.Image:
    d = ImageDraw.Draw(img, "RGBA")
    shadow(d, (400, 1180, 2000, 1320))
    pts = [(380, 420), (1680, 360), (1960, 980), (520, 1140)]
    d.polygon(pts, fill=(168, 64, 48, 255))
    d.polygon([(500, 500), (1580, 450), (1700, 900), (620, 980)], fill=(196, 92, 64, 255))
    for i in range(8):
        y = 560 + i * 50
        d.line([(560, y), (1640, y - 40)], fill=(140, 48, 36, 180), width=6)
    return img


def chair(img: Image.Image) -> Image.Image:
    d = ImageDraw.Draw(img, "RGBA")
    cx = W // 2
    shadow(d, (cx - 280, 1180, cx + 360, 1280))
    d.rounded_rectangle([cx - 220, 520, cx + 260, 860], 40, fill=(214, 176, 128, 255))
    d.rounded_rectangle([cx - 200, 280, cx + 40, 700], 36, fill=(186, 140, 92, 255))
    d.rectangle([cx - 180, 860, cx - 140, 1180], fill=(92, 64, 40, 255))
    d.rectangle([cx + 160, 860, cx + 200, 1180], fill=(92, 64, 40, 255))
    d.rectangle([cx - 200, 300, cx - 160, 860], fill=(92, 64, 40, 255))
    return img


def hero(img: Image.Image) -> Image.Image:
    d = ImageDraw.Draw(img, "RGBA")
    # pared
    for y in range(H):
        t = y / H
        col = (int(232 - t * 20), int(222 - t * 16), int(208 - t * 10))
        d.line([(0, y), (W, y)], fill=col)
    d.rectangle([0, int(H * 0.7), W, H], fill=(150, 118, 88, 255))
    d.rectangle([180, 220, 980, 980], fill=(214, 206, 190, 255))
    d.rectangle([220, 260, 940, 940], fill=(186, 210, 214, 255))
    d.rectangle([1400, 400, 2100, 1120], fill=(48, 40, 34, 255))
    d.ellipse([1580, 560, 1920, 900], fill=(90, 82, 70, 255))
    d.polygon([(1680, 1120), (1960, 1120), (1900, 700), (1740, 700)], fill=(168, 92, 58, 255))
    d.ellipse([420, 980, 860, 1280], fill=(62, 122, 74, 255))
    d.rectangle([560, 1180, 720, 1380], fill=(140, 78, 52, 255))
    return img


DRAWS = {
    "hero": (hero, ((40, 32, 26), (90, 70, 52))),
    "auriculares": (headphones, ((236, 226, 210), (214, 196, 170))),
    "altavoz": (speaker, ((228, 222, 214), (196, 188, 176))),
    "planta": (plant, ((220, 228, 214), (186, 196, 170))),
    "lampara": (lamp, ((240, 232, 214), (214, 198, 170))),
    "reloj": (clock, ((236, 230, 220), (200, 190, 176))),
    "jarron": (vase, ((240, 228, 210), (210, 186, 150))),
    "manta": (blanket, ((236, 220, 210), (200, 170, 150))),
    "silla": (chair, ((232, 224, 210), (196, 180, 150))),
}


def save_heavy(name: str, img: Image.Image) -> None:
    noisy = noise(img.copy(), 14)
    sharp = ImageEnhance.Contrast(noisy).enhance(1.08)
    sharp.save(OUT / f"{name}.jpg", "JPEG", quality=98, optimize=False, subsampling=0)
    print("jpg", name, (OUT / f"{name}.jpg").stat().st_size)


def save_light(name: str, img: Image.Image) -> None:
    small = img.resize((960, 640), Image.Resampling.LANCZOS).filter(ImageFilter.SMOOTH)
    small.save(OUT / f"{name}.webp", "WEBP", quality=72, method=6)
    print("webp", name, (OUT / f"{name}.webp").stat().st_size)


def main() -> None:
    random.seed(1)
    for name, (fn, colors) in DRAWS.items():
        img = bg(*colors)
        img = fn(img)
        save_heavy(name, img)
        save_light(name, img)


if __name__ == "__main__":
    main()
