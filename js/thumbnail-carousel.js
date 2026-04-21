// Thumbnail Carousel — 2-up desktop / 모바일: 카드 폭 축소 + 옆 카드 피크, 스와이프·드래그 스냅
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
    /** 모바일: 슬라이드 사이 간격(JS translate와 CSS gap 동기화) */
    this.gapMobile = 10;
    /** 뷰포트 대비 카드 폭 비율 — 나머지로 다음 썸네일 피크 */
    this.mobileCardWidthRatio = 0.82;
    /** 피크 최소(px): 좁은 화면에서도 옆 카드가 보이도록 상한 */
    this.mobileMinPeekPx = 44;
    this._currentTranslate = 0;
    this._stepPx = 0;
    this.mobileMaxWidth = 768;

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

  isMobileLayout() {
    return window.innerWidth <= this.mobileMaxWidth;
  }

  maxIndex() {
    if (this.isMobileLayout()) {
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

    const isMobile = this.isMobileLayout();
    const wrap = this.wrapper;
    if (!wrap || !this.container) {
      this.isTransitioning = false;
      this.updateNavButtons();
      return;
    }

    const w = wrap.offsetWidth;
    const gap = isMobile ? this.gapMobile : this.gapDesktop;
    let slideWidth;
    if (isMobile) {
      const byRatio = Math.round(w * this.mobileCardWidthRatio);
      const byPeek = Math.max(0, w - this.mobileMinPeekPx);
      slideWidth = Math.max(220, Math.min(byRatio, byPeek));
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
    this._stepPx = step;
    const translatePx = -this.currentIndex * step;
    this._currentTranslate = translatePx;
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
    const minSwipeDistance = 44;
    let dragActive = false;
    let dragStartX = 0;
    let dragStartTranslate = 0;
    let lastTranslate = 0;
    const container = this.container;

    const endDrag = (e) => {
      if (!dragActive) {
        return;
      }
      dragActive = false;
      container.style.transition = "";
      if (!this.isMobileLayout() || !this._stepPx) {
        this.updateSlides();
        return;
      }
      const t = e.changedTouches && e.changedTouches[0];
      if (!t) {
        this.isTransitioning = false;
        this.updateSlides();
        return;
      }
      this.isTransitioning = false;
      const dx = dragStartX - t.clientX;
      if (dx > minSwipeDistance) {
        this.goToNext();
      } else if (dx < -minSwipeDistance) {
        this.goToPrevious();
      } else {
        const nearest = Math.round(-lastTranslate / this._stepPx);
        const i = Math.max(0, Math.min(this.maxIndex(), nearest));
        this.goToSlide(i);
      }
    };

    container.addEventListener(
      "touchstart",
      (e) => {
        if (!this.isMobileLayout()) {
          return;
        }
        dragActive = true;
        dragStartX = e.touches[0].clientX;
        dragStartTranslate = this._currentTranslate;
        lastTranslate = dragStartTranslate;
        container.style.transition = "none";
      },
      { passive: true },
    );

    container.addEventListener(
      "touchmove",
      (e) => {
        if (!dragActive || !this.isMobileLayout() || !this._stepPx) {
          return;
        }
        const x = e.touches[0].clientX;
        const dx = x - dragStartX;
        const minT = -this.maxIndex() * this._stepPx;
        const maxT = 0;
        let next = dragStartTranslate + dx;
        next = Math.max(minT, Math.min(maxT, next));
        lastTranslate = next;
        container.style.transform = `translateX(${next}px)`;
      },
      { passive: true },
    );

    container.addEventListener("touchend", endDrag, { passive: true });
    container.addEventListener("touchcancel", endDrag, { passive: true });
  }
}

// 초기화
document.addEventListener("DOMContentLoaded", () => {
  new ThumbnailCarousel();
});
