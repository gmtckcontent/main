// Thumbnail Carousel — 2-up desktop / 1-up mobile, reference layout
class ThumbnailCarousel {
  constructor() {
    this.container = document.getElementById("thumbnailCarouselSlides");
    this.wrapper = this.container
      ? this.container.closest(".thumbnail-carousel-viewport") ||
        this.container.closest(".thumbnail-carousel-wrapper")
      : null;
    this.slides = document.querySelectorAll(".thumbnail-slide");
    this.prevBtn = document.getElementById("thumbnailCarouselPrev");
    this.nextBtn = document.getElementById("thumbnailCarouselNext");
    this.currentIndex = 0;
    this.totalSlides = this.slides.length;
    this.isTransitioning = false;
    this.gapDesktop = 16;

    if (!this.container || this.slides.length === 0) {
      return;
    }

    this.slides.forEach((slide, index) => {
      slide.setAttribute("data-slide-index", index);
    });

    this.init();

    window.addEventListener("resize", () => {
      this.updateSlides();
    });
  }

  init() {
    // 이벤트 리스너 등록
    if (this.prevBtn) {
      this.prevBtn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.goToPrevious();
      });
    }

    if (this.nextBtn) {
      this.nextBtn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.goToNext();
      });
    }

    // 키보드 네비게이션
    document.addEventListener("keydown", (e) => {
      const section = document.getElementById("thumbnailCarousel");
      if (section && this.isElementInViewport(section)) {
        if (e.key === "ArrowLeft") {
          this.goToPrevious();
        } else if (e.key === "ArrowRight") {
          this.goToNext();
        }
      }
    });

    // 터치 스와이프 지원
    this.initTouchEvents();

    // 초기 슬라이드 설정
    this.updateSlides();
  }

  isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <=
        (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }

  goToSlide(index) {
    if (this.isTransitioning) {
      return;
    }

    const max = this.maxIndex();
    if (index < 0 || index > max) {
      return;
    }

    this.currentIndex = index;
    this.updateSlides();
  }

  goToNext() {
    this.goToSlide(this.currentIndex + 1);
  }

  goToPrevious() {
    this.goToSlide(this.currentIndex - 1);
  }

  maxIndex() {
    const isMobile = window.innerWidth <= 768;
    if (isMobile) {
      return Math.max(0, this.totalSlides - 1);
    }
    return Math.max(0, this.totalSlides - 2);
  }

  updateSlides() {
    if (this.isTransitioning) return;
    this.isTransitioning = true;

    this.slides.forEach((slide) => {
      slide.classList.remove("active");
    });
    if (this.slides[this.currentIndex]) {
      this.slides[this.currentIndex].classList.add("active");
    }

    const isMobile = window.innerWidth <= 768;
    const wrap = this.wrapper;
    if (!wrap || !this.container) {
      this.isTransitioning = false;
      this.updateNavButtons();
      return;
    }

    const w = wrap.offsetWidth;
    const gap = isMobile ? 0 : this.gapDesktop;
    let slideWidth;
    if (isMobile) {
      slideWidth = w;
    } else {
      slideWidth = (w - gap) / 2;
    }

    this.slides.forEach((slide) => {
      slide.style.flex = `0 0 ${slideWidth}px`;
      slide.style.width = `${slideWidth}px`;
      slide.style.minWidth = `${slideWidth}px`;
    });

    const capped = Math.min(this.currentIndex, this.maxIndex());
    if (capped !== this.currentIndex) {
      this.currentIndex = capped;
    }

    const step = slideWidth + gap;
    const translatePx = -this.currentIndex * step;
    this.container.style.transform = `translateX(${translatePx}px)`;

    this.updateNavButtons();

    setTimeout(() => {
      this.isTransitioning = false;
    }, 450);
  }

  updateNavButtons() {
    const max = this.maxIndex();
    const atStart = this.currentIndex <= 0;
    const atEnd = this.currentIndex >= max;

    if (this.prevBtn) {
      this.prevBtn.hidden = atStart;
      this.prevBtn.setAttribute("aria-hidden", atStart ? "true" : "false");
    }
    if (this.nextBtn) {
      this.nextBtn.hidden = atEnd;
      this.nextBtn.setAttribute("aria-hidden", atEnd ? "true" : "false");
    }
  }

  initTouchEvents() {
    let touchStartX = 0;
    let touchEndX = 0;
    const minSwipeDistance = 50;

    this.container.addEventListener(
      "touchstart",
      (e) => {
        touchStartX = e.touches[0].clientX;
      },
      { passive: true }
    );

    this.container.addEventListener(
      "touchend",
      (e) => {
        touchEndX = e.changedTouches[0].clientX;
        const swipeDistance = touchStartX - touchEndX;

        if (Math.abs(swipeDistance) > minSwipeDistance) {
          if (swipeDistance > 0) {
            this.goToNext();
          } else {
            this.goToPrevious();
          }
        }
      },
      { passive: true }
    );
  }
}

// 초기화
document.addEventListener("DOMContentLoaded", () => {
  new ThumbnailCarousel();
});
