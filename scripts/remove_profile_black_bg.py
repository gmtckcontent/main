#!/usr/bin/env python3
"""
Remove solid near-black studio background via edge flood-fill (PNG alpha).

Use only on portraits with uniform dark edges — pass explicit file paths:
  .venv-img/bin/python scripts/remove_profile_black_bg.py images/profilepic/itpe/photo.png

Do NOT run blindly on the whole tree (can damage natural photos with dark edges).
"""
from __future__ import annotations

import argparse
import math
import sys
from collections import deque
from pathlib import Path

from PIL import Image


def _dist(a: tuple[int, int, int], b: tuple[int, int, int]) -> float:
    return math.sqrt(sum((x - y) ** 2 for x, y in zip(a, b)))


def process_file(path: Path, tol: float = 40.0) -> str:
    img = Image.open(path).convert("RGBA")
    w, h = img.size
    if w < 8 or h < 8:
        return "skip-small"

    px = img.load()
    corners = [
        px[0, 0][:3],
        px[w - 1, 0][:3],
        px[0, h - 1][:3],
        px[w - 1, h - 1][:3],
    ]
    cr = sum(c[0] for c in corners) // 4
    cg = sum(c[1] for c in corners) // 4
    cb = sum(c[2] for c in corners) // 4
    ref = (cr, cg, cb)

    # Strict: only typical #000–#222 studio backdrops
    if max(ref) > 40:
        return "skip-light-corners"

    max_corner_spread = max(
        _dist(corners[i], corners[j]) for i in range(4) for j in range(i + 1, 4)
    )
    if max_corner_spread > 45:
        return "skip-corner-mismatch"

    def match(rgb: tuple[int, int, int]) -> bool:
        return _dist(rgb, ref) <= tol

    def opaque_enough(a: int) -> bool:
        """Do not seed/flood through already-transparent pixels (safe re-run)."""
        return a > 220

    vis = [[False] * w for _ in range(h)]
    q: deque[tuple[int, int]] = deque()

    for x in range(w):
        for y in (0, h - 1):
            r, g, b, a = px[x, y]
            if opaque_enough(a) and match((r, g, b)):
                vis[y][x] = True
                q.append((x, y))
    for y in range(h):
        for x in (0, w - 1):
            if not vis[y][x]:
                r, g, b, a = px[x, y]
                if opaque_enough(a) and match((r, g, b)):
                    vis[y][x] = True
                    q.append((x, y))

    if not q:
        return "skip-already-transparent"

    removed = 0
    while q:
        x, y = q.popleft()
        r, g, b, _ = px[x, y]
        px[x, y] = (r, g, b, 0)
        removed += 1
        for dx, dy in ((0, 1), (0, -1), (1, 0), (-1, 0)):
            nx, ny = x + dx, y + dy
            if 0 <= nx < w and 0 <= ny < h and not vis[ny][nx]:
                r, g, b, a = px[nx, ny]
                if opaque_enough(a) and match((r, g, b)):
                    vis[ny][nx] = True
                    q.append((nx, ny))

    if removed < 500:
        return "skip-few-pixels"

    img.save(path, optimize=True)
    return f"ok-{removed}"


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument(
        "paths",
        nargs="+",
        type=Path,
        help="PNG files to process (explicit paths only)",
    )
    args = ap.parse_args()
    for path in args.paths:
        path = path.resolve()
        if not path.is_file():
            print(f"skip-missing\t{path}", file=sys.stderr)
            continue
        try:
            result = process_file(path)
            print(f"{result}\t{path}")
        except OSError as e:
            print(f"ERR\t{path}\t{e}", file=sys.stderr)


if __name__ == "__main__":
    main()
