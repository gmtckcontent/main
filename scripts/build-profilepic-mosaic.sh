#!/usr/bin/env bash
# images/profilepic → images/profilepic-mosaic (max 256px JPEG, ~모자이크 전용)
# macOS sips 사용. 원본 갱신 후 이 스크립트를 다시 실행하고 ?mv= 버전을 올리면 됨.
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
  out="$DST/$stem.jpg"
  mkdir -p "$(dirname "$out")"
  if sips -s format jpeg -Z 256 "$f" --out "$out" >/dev/null 2>&1; then
    count=$((count + 1))
  fi
done < <(find "$SRC" -type f \( -iname '*.png' -o -iname '*.jpg' -o -iname '*.jpeg' \) -print0)

echo "profilepic-mosaic: wrote $count JPEGs → $DST"
