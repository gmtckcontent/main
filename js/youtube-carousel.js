// YouTube Carousel Helper Functions
class YouTubeCarouselHelper {
  constructor() {
    this.init();
  }

  init() {
    // YouTube URL에서 video ID 추출 및 썸네일 자동 설정
    this.setupYouTubeThumbnails();

    // YouTube API로 자동 로드 (선택사항)
    if (
      typeof YOUTUBE_CONFIG !== "undefined" &&
      YOUTUBE_CONFIG.API_KEY &&
      YOUTUBE_CONFIG.API_KEY !== "YOUR_API_KEY_HERE"
    ) {
      this.loadFromYouTubeAPI();
    }
  }

  // YouTube URL에서 video ID 추출
  extractVideoId(url) {
    if (!url) return null;

    // 다양한 YouTube URL 형식 지원
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
      /youtube\.com\/watch\?.*v=([^&\n?#]+)/,
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) {
        return match[1];
      }
    }

    return null;
  }

  // YouTube 썸네일 URL 생성
  getThumbnailUrl(videoId, quality = "maxresdefault") {
    if (!videoId) return null;
    return `https://img.youtube.com/vi/${videoId}/${quality}.jpg`;
  }

  // YouTube URL을 사용하여 썸네일 자동 설정
  setupYouTubeThumbnails() {
    const youtubeItems = document.querySelectorAll(".youtube-item");

    youtubeItems.forEach((item) => {
      const href = item.getAttribute("href");
      const videoId =
        item.getAttribute("data-youtube-id") || this.extractVideoId(href);

      if (!videoId) return;

      // data-youtube-id가 없으면 설정
      if (!item.getAttribute("data-youtube-id")) {
        item.setAttribute("data-youtube-id", videoId);
      }

      // href가 YouTube URL이 아니면 설정
      if (
        !href ||
        (!href.includes("youtube.com") && !href.includes("youtu.be"))
      ) {
        item.setAttribute("href", `https://www.youtube.com/watch?v=${videoId}`);
      }

      // 썸네일 이미지 자동 설정
      const img = item.querySelector(".thumbnail-img");
      if (img && (!img.src || img.src.includes("unsplash"))) {
        const thumbnailUrl = this.getThumbnailUrl(videoId);
        if (thumbnailUrl) {
          img.src = thumbnailUrl;
          img.alt = `YouTube Video: ${videoId}`;

          // 이미지 로드 실패 시 다른 품질 시도
          img.onerror = () => {
            img.src = this.getThumbnailUrl(videoId, "hqdefault");
          };
        }
      }

      // 재생 버튼이 없으면 추가
      if (!item.querySelector(".youtube-play-button")) {
        const playButton = document.createElement("div");
        playButton.className = "youtube-play-button";
        playButton.innerHTML = `
          <svg width="68" height="48" viewBox="0 0 68 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M66.52,7.74c-0.78-2.93-2.49-5.41-5.42-6.19C55.79,.13,34,0,34,0S12.21,.13,6.9,1.55 C3.97,2.33,2.27,4.81,1.48,7.74C0.06,13.05,0,24,0,24s0.06,10.95,1.48,16.26c0.78,2.93,2.49,5.41,5.42,6.19 C12.21,47.87,34,48,34,48s21.79-0.13,27.1-1.55c2.93-0.78,4.63-3.26,5.42-6.19C67.94,34.95,68,24,68,24S67.94,13.05,66.52,7.74z" fill="red"/>
            <path d="M 45,24 27,14 27,34" fill="white"/>
          </svg>
        `;
        const imageSection = item.querySelector(".thumbnail-image");
        if (imageSection) {
          imageSection.appendChild(playButton);
        }
      }
    });
  }

  // YouTube API로 최근 영상 자동 로드 (선택사항)
  async loadFromYouTubeAPI() {
    try {
      if (typeof YouTubeAPIService === "undefined") {
        console.warn("YouTubeAPIService가 로드되지 않았습니다.");
        return;
      }

      const apiService = new YouTubeAPIService(
        YOUTUBE_CONFIG.API_KEY,
        YOUTUBE_CONFIG.CHANNEL_ID
      );

      // 최근 3개 영상 가져오기
      const videos = await apiService.getRecentVideos(3);
      const container = document.getElementById("thumbnailCarouselSlides");

      if (!container || videos.length === 0) return;

      // 기존 슬라이드 제거 또는 업데이트
      const slides = container.querySelectorAll(".thumbnail-slide");

      videos.forEach((video, index) => {
        let slide;
        if (slides[index]) {
          // 기존 슬라이드 업데이트
          slide = slides[index];
        } else {
          // 새 슬라이드 생성
          slide = document.createElement("div");
          slide.className = "thumbnail-slide";
          if (index === 0) slide.classList.add("active");
          container.appendChild(slide);
        }

        const videoUrl = `https://www.youtube.com/watch?v=${video.videoId}`;
        const thumbnailUrl = this.getThumbnailUrl(video.videoId);

        slide.innerHTML = `
          <a
            href="${videoUrl}"
            target="_blank"
            rel="noopener noreferrer"
            class="thumbnail-item youtube-item"
            data-youtube-id="${video.videoId}"
          >
            <div class="thumbnail-image">
              <img
                src="${thumbnailUrl}"
                alt="${video.title}"
                class="thumbnail-img"
              />
              <div class="youtube-play-button">
                <svg width="68" height="48" viewBox="0 0 68 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M66.52,7.74c-0.78-2.93-2.49-5.41-5.42-6.19C55.79,.13,34,0,34,0S12.21,.13,6.9,1.55 C3.97,2.33,2.27,4.81,1.48,7.74C0.06,13.05,0,24,0,24s0.06,10.95,1.48,16.26c0.78,2.93,2.49,5.41,5.42,6.19 C12.21,47.87,34,48,34,48s21.79-0.13,27.1-1.55c2.93-0.78,4.63-3.26,5.42-6.19C67.94,34.95,68,24,68,24S67.94,13.05,66.52,7.74z" fill="red"/>
                  <path d="M 45,24 27,14 27,34" fill="white"/>
                </svg>
              </div>
            </div>
            <div class="thumbnail-overlay">
              <h4 class="thumbnail-title">${this.truncateText(
                video.title,
                50
              )}</h4>
            </div>
          </a>
        `;
      });

      // 캐러셀 다시 초기화
      if (typeof ThumbnailCarousel !== "undefined") {
        // 기존 인스턴스가 있다면 재초기화
        const carousel = new ThumbnailCarousel();
      }

      console.log(`YouTube 영상 ${videos.length}개를 캐러셀에 로드했습니다.`);
    } catch (error) {
      console.error("YouTube API에서 영상 로드 실패:", error);
    }
  }

  // 텍스트 자르기 (긴 제목/설명 처리)
  truncateText(text, maxLength) {
    if (!text) return "";
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  }
}

// 초기화
document.addEventListener("DOMContentLoaded", () => {
  new YouTubeCarouselHelper();
});
