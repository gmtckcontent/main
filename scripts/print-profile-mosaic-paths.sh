#!/usr/bin/env sh
# images/profilepic 이하 이미지 상대 경로를 정렬 출력 → role-interviews.js 의 PROFILE_MOSAIC_REL_PATHS 에 반영
cd "$(dirname "$0")/.." || exit 1
find images/profilepic -type f \( \
  -iname '*.png' -o -iname '*.jpg' -o -iname '*.jpeg' -o -iname '*.webp' \
\) | sed 's|^images/profilepic/||' | LC_ALL=C sort
