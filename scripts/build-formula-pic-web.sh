#!/usr/bin/env bash
# images/formula_pic → images/formula_pic-web (웹용 JPEG, 긴 변 최대 1920px)
# role-interviews.js 의 FORMULA_PIC_BACKGROUNDS 와 동일 파일명이어야 함.
# 갱신 후 getFormulaPicBackgroundUrl 의 ?fv= 버전을 올리면 캐시 무효화.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SRC="$ROOT/images/formula_pic"
DST="$ROOT/images/formula_pic-web"
MAX_EDGE=1920

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
  out="$DST/$stem.jpg"
  mkdir -p "$(dirname "$out")"
  if sips -s format jpeg -Z "$MAX_EDGE" "$f" --out "$out" >/dev/null 2>&1; then
    count=$((count + 1))
  fi
done < <(find "$SRC" -type f \( -iname '*.png' -o -iname '*.jpg' -o -iname '*.jpeg' -o -iname '*.JPG' \) -print0)

echo "formula_pic-web: wrote $count JPEGs (max ${MAX_EDGE}px) → $DST"
du -sh "$DST" 2>/dev/null || true
