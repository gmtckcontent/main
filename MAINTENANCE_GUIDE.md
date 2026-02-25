# 🔒 사이트 접근 차단 가이드 (Maintenance Mode)

gmtck.com 도메인으로 직접 접근을 차단하는 방법입니다.

## 🚀 빠른 시작

### 방법 1: Apache 서버 (.htaccess 사용)

1. `.htaccess` 파일을 열어주세요
2. 파일 상단의 주석 처리된 부분을 찾아주세요:
   ```apache
   # <IfModule mod_rewrite.c>
   #   RewriteEngine On
   #   RewriteBase /
   #   
   #   # 모든 요청 차단 (503 Service Unavailable)
   #   RewriteCond %{REQUEST_URI} !^/maintenance.html$
   #   RewriteRule ^(.*)$ - [R=503,L]
   # </IfModule>
   ```
3. 주석(`#`)을 제거하여 활성화하세요:
   ```apache
   <IfModule mod_rewrite.c>
     RewriteEngine On
     RewriteBase /
     
     # 모든 요청 차단 (503 Service Unavailable)
     RewriteCond %{REQUEST_URI} !^/maintenance.html$
     RewriteRule ^(.*)$ - [R=503,L]
   </IfModule>
   ```

### 방법 2: Netlify (_redirects 사용)

1. `_redirects` 파일을 열어주세요
2. 파일 상단의 주석 처리된 부분을 찾아주세요:
   ```
   # /* /maintenance.html 503
   ```
3. 주석(`#`)을 제거하여 활성화하세요:
   ```
   /* /maintenance.html 503
   ```

### 방법 3: 검색 엔진 차단 (robots.txt)

1. `robots.txt` 파일을 열어주세요
2. 파일 상단의 주석 처리된 부분을 찾아주세요:
   ```
   # User-agent: *
   # Disallow: /
   ```
3. 주석(`#`)을 제거하고, 아래의 `Allow: /` 부분을 주석 처리하세요:
   ```
   User-agent: *
   Disallow: /
   ```

## ✅ 접근 차단 활성화 체크리스트

- [ ] `.htaccess` 파일에서 주석 제거 (Apache 서버)
- [ ] `_redirects` 파일에서 주석 제거 (Netlify)
- [ ] `robots.txt` 파일에서 주석 제거 및 `Allow: /` 주석 처리
- [ ] 변경사항 커밋 및 배포

## 🔓 접근 차단 해제 방법

모든 주석을 다시 추가하고, `robots.txt`의 `Disallow: /`를 주석 처리한 후 `Allow: /`를 활성화하세요.

## 📝 참고사항

- **Apache 서버**: `.htaccess` 파일이 적용됩니다
- **Netlify**: `_redirects` 파일이 적용됩니다
- **검색 엔진**: `robots.txt`로 크롤링을 차단합니다
- **메인터넌스 페이지**: `maintenance.html` 파일이 생성되어 있습니다

## ⚠️ 주의사항

- 접근 차단 후에도 관리자 페이지(`/admin-*.html`)는 접근 가능할 수 있습니다
- 완전한 차단을 원하시면 추가 설정이 필요할 수 있습니다
- 배포 후 즉시 적용됩니다

