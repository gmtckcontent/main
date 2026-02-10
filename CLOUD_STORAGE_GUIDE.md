# 클라우드 스토리지 옵션 가이드

비디오 파일(22MB)을 클라우드 스토리지로 이동하여 GitHub 저장소 크기를 줄이고 로딩 속도를 개선할 수 있습니다.

## 추천 옵션

### 1. Cloudflare R2 (추천 ⭐)
**장점:**
- S3 호환 API
- 무료 티어: 10GB 저장소, 100만 건의 읽기/쓰기 작업
- 글로벌 CDN 통합
- CORS 설정 간단

**비용:** 무료 (사용량이 많지 않다면)

**설정 방법:**
1. Cloudflare 계정 생성
2. R2 버킷 생성
3. 비디오 파일 업로드
4. 공개 액세스 설정 및 CORS 구성
5. URL 가져오기 (예: `https://pub-xxxxx.r2.dev/main-video.mp4`)

### 2. AWS S3 + CloudFront
**장점:**
- 업계 표준
- 강력한 CDN
- 세밀한 제어 가능

**단점:**
- 비용 발생 가능 (S3 저장소 + 전송 비용)
- 설정이 복잡할 수 있음

### 3. GitHub Releases (간단한 방법)
**장점:**
- GitHub에 이미 있음
- 추가 설정 불필요

**단점:**
- 용량 제한 (릴리스당 2GB)
- CDN이 없어 속도가 느릴 수 있음

**설정 방법:**
1. GitHub 저장소의 Releases 페이지로 이동
2. 새 릴리스 생성
3. 비디오 파일을 첨부
4. 다운로드 URL 가져오기 (예: `https://github.com/username/repo/releases/download/v1.0/main-video.mp4`)

### 4. Google Cloud Storage
**장점:**
- Google 인프라
- 무료 티어 있음

**단점:**
- 설정 복잡
- GCP 계정 필요

## 현재 사용 중인 서비스
프로젝트에서 이미 `page.gensparksite.com`을 이미지용으로 사용 중입니다. 
동일한 서비스가 비디오도 지원하는지 확인해볼 수 있습니다.

## 적용 방법

클라우드 스토리지에 비디오를 업로드한 후:

1. `index.html`에서 비디오 경로 수정:
```html
<source src="YOUR_CLOUD_URL/main-video.mp4" type="video/mp4" />
```

2. Git에서 비디오 파일 제거 (선택사항):
```bash
git rm images/video/main-video.mp4
git commit -m "Move video to cloud storage"
```

3. `.gitignore`에 추가 (로컬에서만 유지하려면):
```
images/video/main-video.mp4
```

## 추천
**Cloudflare R2**를 가장 추천합니다:
- 무료 티어가 충분
- 설정이 비교적 간단
- 빠른 전 세계 CDN
- S3 호환이라 나중에 마이그레이션도 쉬움


