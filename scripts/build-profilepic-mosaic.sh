#!/usr/bin/env bash
# images/profilepic → images/profilepic-mosaic (max 256px PNG, 알파 유지 — 모자이크 전용)
# JPEG로 내보내면 투명 배경이 흰색 등으로 박혀 타일 경계가 들쭉날쭉해 보임.
# macOS sips 사용. 원본 갱신 후 재실행하고 js/role-interviews.js 의 MOSAIC_THUMB_VERSION 을 올리면 됨.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SRC="$ROOT/images/profilepic"
DST="$ROOT/images/profilepic-mosaic"

if [[ ! -d "$SRC" ]]; then
  echo "Missing $SRC" >&2
  exit 1
fi

if ! command -v sips >/dev/null 2>&1; then
  echo "sips not found (macOS only)" >&2
  exit 1
fi

mkdir -p "$DST"
count=0
while IFS= read -r -d '' f; do
  rel="${f#"$SRC"/}"
  stem="${rel%.*}"
  out="$DST/$stem.png"
  mkdir -p "$(dirname "$out")"
  if sips -s format png -Z 256 "$f" --out "$out" >/dev/null 2>&1; then
    count=$((count + 1))
  fi
done < <(find "$SRC" -type f \( -iname '*.png' -o -iname '*.jpg' -o -iname '*.jpeg' -o -iname '*.webp' \) -print0)

# 이전 JPEG 산출물 제거(경로는 동일 stem, 확장자만 png로 통일)
find "$DST" -type f -iname '*.jpg' -delete

echo "profilepic-mosaic: wrote $count PNGs (alpha preserved for RGBA sources) → $DST"
