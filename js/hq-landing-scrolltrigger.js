/**
 * 직무소개 랜딩: 섹션 스태킹(sticky 그리드 + 스크롤 덮개) + 타일 흑백/컬러 휠 웨이브
 *
 * - 휠 누적 QUANTUM px마다 + 휠 1회마다 버스트로 탁탁 끊기는 반짝임
 * - 누적 THRESHOLD 도달 시 잠금 해제(타일 로직)
 * - 스크롤 진행도는 #hqDivisionIntro 위치 기반(getPinProgress)
 */
(function () {
  "use strict";

  var stInstance = null;
  var faceCells = [];
  /** @type {boolean[]} */
  var isColor = [];

  /** 휠 누적 목표(px) — 높을수록 다음 섹션까지 더 많이 굴려야 함 (예: ~5000) */
  var THRESHOLD = 5000;
  /** 휠 1회당 누적량 스케일 — 상향 시 잠금 해제,반응이 가벼워짐 */
  var WHEEL_ACCUM_SCALE = 0.92;
  /** 이 누적(px)마다 한 번 양자 플립(탁) */
  var WHEEL_QUANTUM = 175;
  var accumulated = 0;
  var unlocked = false;
  var sectionComplete = false;
  /** 마지막으로 처리한 floor(accumulated / WHEEL_QUANTUM) */
  var lastQuantumFloor = 0;

  /** 레거시 export용(외부 디버그) */
  var PIN_SCROLL_VH = 5.2;

  /**
   * 흰 덮개 포화(핀 progress, getRevealProgress 완료 후): ease-out으로 접근.
   */
  var REVEAL_MOTION_SATURATE_MAX = 0.72;

  /** 0~1 클램프(구형 브라우저 호환; Math.clamp 대체) */
  function clamp01(x) {
    return Math.min(1, Math.max(0, x));
  }

  /** x∈[0,1] → 끝에서 미분 0으로 자연스럽게 포화 */
  function easeOutCubic(x) {
    x = clamp01(x);
    return 1 - Math.pow(1 - x, 3);
  }

  /** 선형 진행 x에 포화 상한 적용(끝 구간에서 천천히 목표치에 닿음) */
  function saturateProgress(x) {
    return REVEAL_MOTION_SATURATE_MAX * easeOutCubic(x);
  }

  var sparkleTimerId = null;
  /** 타이머 보조 깜빡임 간격(ms) — 길게 잡아 슬로모션 느낌 완화 */
  /** 스크롤,휠이 있을 때만 타이머 플립 사용 — 간격을 넓혀 과한 깜빡임 완화 */
  var SPARKLE_INTERVAL_MIN = 260;
  var SPARKLE_INTERVAL_MAX = 520;
  /** 초반 0~30% 구간 빈도 배율 */
  var EARLY_SPARKLE_FREQ_MULT = 0.55;
  /** 마지막 휠/터치/핀 스크롤 시각 — 가만히 있을 때는 타이머가 타일을 바꾸지 않음 */
  var lastWheelAt = 0;
  var SCROLL_ACTIVE_MS = 520;

  var wheelHandler = null;
  /** 리사이즈 후 ScrollTrigger,오버랩 재동기화(디바운스) */
  var hqLandingResizeTimer = null;
  var hqLandingResizeHandler = null;
  var touchStartY = null;
  var touchHandlerStart = null;
  var touchHandlerMove = null;
  var touchHandlerEnd = null;

  var lastPinProgress = 0;

  var MAX_DELTA_REF = 100;
  /** 큰 휠 델타로 한 번에 많이 쌓이지 않게 */
  var MAX_SPEED_MULT = 1.48;

  function speedMultiplier(absDelta) {
    var t = Math.min(1, absDelta / MAX_DELTA_REF);
    return 1 + t * (MAX_SPEED_MULT - 1);
  }

  function initIsColorArray() {
    var n = faceCells.length;
    isColor = new Array(n);
    for (var i = 0; i < n; i++) {
      isColor[i] = false;
    }
  }

  function syncCellDom(i) {
    var el = faceCells[i];
    if (!el) {
      return;
    }
    el.classList.toggle("is-active", !!isColor[i]);
  }

  function syncAllDom() {
    for (var i = 0; i < faceCells.length; i++) {
      syncCellDom(i);
    }
  }

  /** 휠 1회(또는 터치 제스처)마다 전체의 약 15~20%는 강제로 상태 변화 */
  function burstFlipFromInput() {
    var n = faceCells.length;
    if (!n || sectionComplete) {
      return;
    }
    var w = getWheelProgress();
    var targetBias = unlocked ? 0.55 + getPinProgress() * 0.4 : 0.25 + w * 0.7;
    var count = Math.max(
      Math.floor(n * 0.15),
      Math.min(n, Math.floor(n * (0.15 + Math.random() * 0.06))),
    );
    var picked = Object.create(null);
    var tries = 0;
    var maxTries = n * 20;
    while (count > 0 && tries < maxTries) {
      tries++;
      var i = (Math.random() * n) | 0;
      if (picked[i]) {
        continue;
      }
      picked[i] = true;
      if (Math.random() < 0.62) {
        isColor[i] = !isColor[i];
      } else {
        isColor[i] = Math.random() < targetBias;
      }
      syncCellDom(i);
      count--;
    }
  }

  /** 누적이 QUANTUM 경계를 넘을 때마다 추가로 큰 덩어리 플립 */
  function applyQuantumFlips(prevFloor, nextFloor) {
    var n = faceCells.length;
    if (!n || sectionComplete || nextFloor <= prevFloor) {
      return;
    }
    var w = getWheelProgress();
    var steps = nextFloor - prevFloor;
    var q;
    var count;
    var picked;
    var tries;
    var maxTries;
    var i;
    for (q = 0; q < steps; q++) {
      count = Math.max(4, Math.floor(n * (0.12 + Math.random() * 0.08)));
      count = Math.min(count, n);
      picked = Object.create(null);
      tries = 0;
      maxTries = n * 24;
      while (count > 0 && tries < maxTries) {
        tries++;
        i = (Math.random() * n) | 0;
        if (picked[i]) {
          continue;
        }
        picked[i] = true;
        if (Math.random() < 0.7) {
          isColor[i] = !isColor[i];
        } else {
          isColor[i] = Math.random() < 0.2 + w * 0.75;
        }
        syncCellDom(i);
        count--;
      }
    }
  }

  /** 표시용 lerp 대신 실제 누적(accumulated)으로 진행도 — 첫 휠 직후 바로 깜빡임 가중 */
  function getWheelProgress() {
    return Math.min(1, Math.max(0, accumulated / THRESHOLD));
  }

  /**
   * Section stacking: #hqDivisionIntro 상단이 뷰포트 아래에서 위로 올라오는 진행도(0~1).
   * (구 GSAP pin progress 대신 문서 스크롤,getBoundingClientRect 기반)
   */
  function getPinProgress() {
    var intro = document.getElementById("hqDivisionIntro");
    if (!intro) {
      return 0;
    }
    var vh = window.innerHeight || 1;
    var top = intro.getBoundingClientRect().top;
    var p = 1 - top / vh;
    return Math.min(1, Math.max(0, p));
  }

  /** 본부 흰 레이어와 동일 픽셀만큼 Our Story 레이어를 위로 밀기 */
  function updateStackSync() {
    var landing = getLanding();
    var intro = document.getElementById("hqDivisionIntro");
    if (!landing || !intro || landing.hidden) {
      return;
    }
    var vh = window.innerHeight || 1;
    var top = intro.getBoundingClientRect().top;
    var lift = Math.max(0, Math.min(vh, vh - top));
    landing.style.setProperty("--hq-stack-lift", lift + "px");
    landing.style.setProperty("--hq-stack-progress", String(getPinProgress()));
  }

  /**
   * 0~1: 휠 누적. 잠금 해제 후 핀 진행과 결합.
   */
  function getSectionProgress() {
    var w = getWheelProgress();
    var pinP = getPinProgress();
    if (!unlocked) {
      return w;
    }
    return Math.min(1, Math.max(w, pinColorCurve(pinP)));
  }

  /** 핀 진행만으로 기대 컬러 비율: pinP=0.5 → 약 0.8, 끝에서 1 */
  function pinColorCurve(pinP) {
    var p = Math.min(1, Math.max(0, pinP));
    if (p <= 0.5) {
      return 0.8 * (p / 0.5);
    }
    return 0.8 + 0.2 * ((p - 0.5) / 0.5);
  }

  /**
   * 타이머 샘플링용 컬러 경향(0~1). 잠금 전은 휠만, 잠금 후는 핀 곡선으로 빠르게 상승.
   */
  function getTargetProbability() {
    if (sectionComplete) {
      return 1;
    }
    var w = getWheelProgress();
    var pinP = getPinProgress();
    if (!unlocked) {
      if (w <= 0) {
        return 0;
      }
      return Math.min(0.92, 0.08 + Math.pow(w, 0.75) * 0.88);
    }
    var pinT = pinColorCurve(pinP);
    return Math.min(1, Math.max(pinT, 0.15 + w * 0.85));
  }

  function isScrollRecentlyActive() {
    return Date.now() - lastWheelAt < SCROLL_ACTIVE_MS;
  }

  function randomIntervalMs() {
    var s = getSectionProgress();
    var min = SPARKLE_INTERVAL_MIN;
    var max = SPARKLE_INTERVAL_MAX;
    if (s > 0 && s < 0.3) {
      min = Math.round(min * EARLY_SPARKLE_FREQ_MULT);
      max = Math.round(max * EARLY_SPARKLE_FREQ_MULT);
    }
    if (isScrollRecentlyActive()) {
      min = Math.round(min * 0.85);
      max = Math.round(max * 0.85);
    }
    if (min < 1) {
      min = 1;
    }
    if (max < min) {
      max = min;
    }
    return min + Math.floor(Math.random() * (max - min + 1));
  }

  function stopSparkleTimer() {
    if (sparkleTimerId != null) {
      clearTimeout(sparkleTimerId);
      sparkleTimerId = null;
    }
  }

  /** 입력이 없을 때는 긴 간격으로만 깨어남(타일은 batchSparkleTick에서 건너뜀) */
  function sparkleDelayMs() {
    return isScrollRecentlyActive() ? randomIntervalMs() : 3200;
  }

  function scheduleNextSparkleTick() {
    stopSparkleTimer();
    if (sectionComplete || !faceCells.length) {
      return;
    }
    sparkleTimerId = window.setTimeout(function onSparkleTimeout() {
      sparkleTimerId = null;
      batchSparkleTick();
      if (!sectionComplete && faceCells.length) {
        sparkleTimerId = window.setTimeout(onSparkleTimeout, sparkleDelayMs());
      }
    }, sparkleDelayMs());
  }

  function startSparkleTimer() {
    if (sectionComplete || !faceCells.length) {
      return;
    }
    scheduleNextSparkleTick();
  }

  /**
   * 일부 타일만 골라 갱신. 스크롤 중에는 플립,재샘플로 정적 느낌 완화.
   */
  function batchSparkleTick() {
    if (!faceCells.length || sectionComplete) {
      return;
    }

    /* 가만히 있을 때는 휠/스크롤 입력이 없으면 타일 상태를 바꾸지 않음 */
    if (!isScrollRecentlyActive()) {
      return;
    }

    var pinP = getPinProgress();
    if (unlocked && pinP >= 0.97) {
      finalizeSection();
      return;
    }

    var targetP = getTargetProbability();
    if (targetP >= 0.97) {
      finalizeSection();
      return;
    }

    var s = getSectionProgress();
    var n = faceCells.length;
    var batch = Math.max(10, Math.floor(n * (0.08 + Math.random() * 0.1)));
    if (s > 0 && s < 0.35) {
      batch = Math.floor(batch * (1.45 + Math.random() * 0.45));
    }
    if (isScrollRecentlyActive()) {
      batch = Math.floor(batch * (1.5 + Math.random() * 0.35));
    }
    batch = Math.min(Math.max(batch, 8), n);

    var active = isScrollRecentlyActive();
    var flipChaos = active && targetP < 0.95 ? 0.58 : active ? 0.35 : 0.22;

    var picked = Object.create(null);
    var tries = 0;
    var maxTries = batch * 14;
    while (batch > 0 && tries < maxTries) {
      tries++;
      var i = (Math.random() * n) | 0;
      if (picked[i]) {
        continue;
      }
      picked[i] = true;
      if (Math.random() < flipChaos) {
        isColor[i] = !isColor[i];
      } else {
        isColor[i] = Math.random() < targetP;
      }
      syncCellDom(i);
      batch--;
    }
  }

  function finalizeSection() {
    if (sectionComplete || !faceCells.length) {
      return;
    }
    sectionComplete = true;
    stopSparkleTimer();
    for (var i = 0; i < faceCells.length; i++) {
      isColor[i] = true;
      var el = faceCells[i];
      el.classList.add("is-active");
    }
  }

  function setAllGrayscaleDarkInstant() {
    for (var i = 0; i < faceCells.length; i++) {
      var el = faceCells[i];
      isColor[i] = false;
      el.classList.add("hq-landing-face-cell--instant");
      el.classList.remove("is-active");
    }
    requestAnimationFrame(function () {
      for (var j = 0; j < faceCells.length; j++) {
        faceCells[j].classList.remove("hq-landing-face-cell--instant");
      }
    });
  }

  function setAllGrayscaleDarkSmooth() {
    sectionComplete = false;
    for (var i = 0; i < faceCells.length; i++) {
      isColor[i] = false;
      faceCells[i].classList.remove("is-active");
    }
  }

  function resetAccumulation() {
    if (accumulated === 0 && !unlocked) {
      return;
    }
    accumulated = 0;
    lastQuantumFloor = 0;
    unlocked = false;
    sectionComplete = false;
    lastWheelAt = 0;
    var lg = getLanding();
    if (lg) {
      lg.style.setProperty("--hq-overlap", "0");
      lg.style.setProperty("--hq-compress", "0");
      lg.style.setProperty("--hq-stack-lift", "0px");
    }
    clearOurStoryRevealTopPad();
    clearDivisionIntroPinStyles();
    stopSparkleTimer();
    initIsColorArray();
    setAllGrayscaleDarkInstant();
    syncAllDom();
    startSparkleTimer();
    clearOurStoryHeroStyles();
  }

  function getLanding() {
    return document.getElementById("hqLanding");
  }

  /**
   * 덮개,Our Story 공통 진행(0~1)에 쓰는 휠 누적 구간(px) — THRESHOLD의 2배로 느리게 상승.
   */
  var LIFT_FULL_ACCUM_PX = 10000;
  /**
   * 휠 진행 → 리프트 진행. 1=선형, >1이면 초반 더 천천히.
   */
  var LIFT_EASE_POWER = 1.38;
  /** 타이틀 getBoundingClientRect.top: 이 값 이상이면 opacity 1, 이 값 이하로 올라가며 서서히 0 */
  var TITLE_FADE_TOP_START = 100;
  var TITLE_FADE_TOP_END = -32;
  /**
   * THRESHOLD 초과분(0 ~ POST_THRESHOLD_PX) → 0~1. 본부 패널,Our Story 동시 구동에만 사용.
   */
  /** THRESHOLD 이후 이 px만큼 휠하면 --hq-compress 0→1 (그리드 압축,인트로 상승 1:1) */
  var POST_THRESHOLD_PX = 420;

  /**
   * 덮개,Our Story 동일 progress — overlap * 100vh == 타이틀 translateY(-overlap*100vh) (픽셀 동일 이동).
   */
  function getLiftProgress01() {
    var wLift = clamp01(accumulated / LIFT_FULL_ACCUM_PX);
    return clamp01(Math.pow(wLift, LIFT_EASE_POWER));
  }

  /**
   * THRESHOLD를 넘은 누적 초과분만 0~1로 선형 매핑 (실시간 스크롤 물리감).
   */
  /** THRESHOLD 초과분만 0~1 (엄격히 accumulated > THRESHOLD 일 때만 >0) */
  function getRevealProgress() {
    if (accumulated <= THRESHOLD) {
      return 0;
    }
    return clamp01((accumulated - THRESHOLD) / POST_THRESHOLD_PX);
  }

  /**
   * 흰 덮개 --hq-overlap — getLiftProgress01()과 동일(히어로는 CSS로 -overlap*100vh).
   */
  function getCoverOverlapProgress() {
    var liftP = getLiftProgress01();
    var p2 = getRevealProgress();
    var pinP = getPinProgress();
    if (p2 >= 1 - 1e-5) {
      return Math.max(1, saturateProgress(pinP));
    }
    if (accumulated <= THRESHOLD) {
      return liftP;
    }
    return Math.max(liftP, p2);
  }

  /** Our Story 타이틀: 화면 위로 밀려 올라갈수록 서서히 투명(덮개에 의한 가림 아님) */
  function getOurStoryTitleFadeOpacity() {
    var title = document.querySelector("#hqLanding .hq-landing-title");
    if (!title) {
      return 1;
    }
    var top = title.getBoundingClientRect().top;
    if (top >= TITLE_FADE_TOP_START) {
      return 1;
    }
    if (top <= TITLE_FADE_TOP_END) {
      return 0;
    }
    return clamp01(
      (top - TITLE_FADE_TOP_END) / (TITLE_FADE_TOP_START - TITLE_FADE_TOP_END),
    );
  }
  function getOurStoryInnerEl() {
    return (
      document.getElementById("hqLandingOurStory") ||
      document.querySelector("#hqLanding .hq-landing-hero-cinematic-inner")
    );
  }

  function clearOurStoryHeroStyles() {
    var el = getOurStoryInnerEl();
    if (!el) {
      return;
    }
    el.style.removeProperty("transition");
    el.style.removeProperty("opacity");
    el.style.removeProperty("will-change");
    el.style.removeProperty("pointer-events");
    el.style.removeProperty("position");
    el.style.removeProperty("top");
    el.style.removeProperty("left");
    el.style.removeProperty("right");
    el.style.removeProperty("width");
    el.style.removeProperty("maxWidth");
    el.style.removeProperty("zIndex");
    el.style.removeProperty("boxSizing");
    el.style.removeProperty("paddingLeft");
    el.style.removeProperty("paddingRight");
    el.style.removeProperty("marginTop");
    el.style.removeProperty("marginLeft");
    el.style.removeProperty("marginRight");
    el.style.removeProperty("visibility");
    el.classList.remove("hq-landing-hero-cinematic-inner--on-light");
    var titleEl = el.querySelector(".hq-landing-title");
    if (titleEl) {
      titleEl.style.removeProperty("opacity");
    }
  }

  function clearOurStoryRevealTopPad() {
    var container = document.querySelector(
      "#hqDivisionIntro .hq-division-intro__container",
    );
    if (container) {
      container.style.removeProperty("padding-top");
    }
  }

  function clearDivisionIntroPinStyles() {
    var intro = document.getElementById("hqDivisionIntro");
    if (!intro) {
      return;
    }
    intro.classList.remove("hq-division-intro--in-view");
    intro.style.removeProperty("display");
    intro.style.removeProperty("opacity");
    intro.style.removeProperty("transform");
    intro.style.removeProperty("transition");
    intro.style.removeProperty("pointer-events");
    intro.style.removeProperty("visibility");
    var introContainer = intro.querySelector(".hq-division-intro__container");
    if (introContainer) {
      introContainer.style.removeProperty("opacity");
      introContainer.style.removeProperty("transform");
      introContainer.style.removeProperty("transition");
      introContainer.style.removeProperty("padding-top");
    }
    intro
      .querySelectorAll(".hq-division-intro__media--entered")
      .forEach(function (el) {
        el.classList.remove("hq-division-intro__media--entered");
      });
  }

  /**
   * Our Story: overlap,compress는 CSS. 큰 타이틀만 압축 구간에서 투명도 동기화.
   */
  function syncOurStoryToPin() {
    var el = getOurStoryInnerEl();
    if (!el) {
      return;
    }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      clearOurStoryRevealTopPad();
      clearOurStoryHeroStyles();
      return;
    }

    clearOurStoryRevealTopPad();
    /* transform은 CSS var(--hq-stack-lift)로만 제어 — 인라인 제거하지 않음 */

    var fadeOp = getOurStoryTitleFadeOpacity();
    var stackP = getPinProgress();
    var titleEl = el.querySelector(".hq-landing-title");
    el.style.transition = "none";
    el.style.setProperty("opacity", "1", "important");
    el.style.willChange = "transform";
    el.style.removeProperty("visibility");
    el.style.removeProperty("pointer-events");
    if (titleEl) {
      titleEl.style.transition = "none";
      titleEl.style.opacity = String(
        Math.min(1, Math.max(0, fadeOp * (1 - stackP))),
      );
    }
  }

  /**
   * #hqDivisionIntro: 문서 흐름 + z-index 스택(레이아웃은 CSS). 스크롤 진행도에 따라 in-view,미디어.
   */
  function syncDivisionIntroFromMotion() {
    var intro = document.getElementById("hqDivisionIntro");
    var landing = getLanding();
    if (!intro) {
      return;
    }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }
    var introContainer = intro.querySelector(".hq-division-intro__container");
    if (!landing || landing.hidden) {
      intro.style.display = "none";
      intro.style.visibility = "hidden";
      intro.style.pointerEvents = "none";
      intro.classList.remove("hq-division-intro--in-view");
      if (introContainer) {
        introContainer.style.opacity = "0";
      }
      intro
        .querySelectorAll(".hq-division-intro__media--entered")
        .forEach(function (el) {
          el.classList.remove("hq-division-intro__media--entered");
        });
      return;
    }
    intro.style.removeProperty("display");
    intro.style.removeProperty("transition");
    intro.style.removeProperty("opacity");
    intro.style.visibility = "visible";
    var p2c = clamp01(getPinProgress());
    intro.style.pointerEvents = p2c > 0.02 ? "" : "none";
    intro.classList.add("hq-division-intro--in-view");
    if (introContainer) {
      introContainer.style.removeProperty("transition");
      introContainer.style.removeProperty("opacity");
      introContainer.style.transform = "none";
    }
    if (p2c > 0.06) {
      intro
        .querySelectorAll(".hq-division-intro__media")
        .forEach(function (med) {
          med.classList.add("hq-division-intro__media--entered");
        });
    } else {
      intro
        .querySelectorAll(".hq-division-intro__media--entered")
        .forEach(function (med) {
          med.classList.remove("hq-division-intro__media--entered");
        });
    }
  }

  function updateOverlap() {
    var landing = getLanding();
    if (!landing) {
      clearOurStoryHeroStyles();
      clearDivisionIntroPinStyles();
      return;
    }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      landing.style.setProperty("--hq-overlap", "0");
      landing.style.setProperty("--hq-compress", "0");
      landing.style.setProperty("--hq-stack-lift", "0px");
      clearOurStoryHeroStyles();
      clearDivisionIntroPinStyles();
      return;
    }
    if (landing.hidden) {
      return;
    }
    updateStackSync();
    landing.style.setProperty("--hq-compress", "0");
    landing.style.setProperty(
      "--hq-overlap",
      String(getCoverOverlapProgress()),
    );
    syncDivisionIntroFromMotion();
    syncOurStoryToPin();
    maybeFinalizeFacesWhenDivisionIntroStackOnScreen();
    enforceFullColorMosaicWhenLocked();
  }

  /**
   * 휠 누적(첫 페이지 ↔ 잠금 전 구간): 핀 맨 앞이거나, 되돌아와서 0<누적<THRESHOLD 인 동안은
   * 핀 progress와 무관하게 휠로 누적을 조절해야 함(그렇지 않으면 압축 해제 후 위로 못 감).
   */
  function shouldHandleLockPhaseWheel() {
    if (unlocked) {
      return false;
    }
    if (accumulated > 0 && accumulated < THRESHOLD) {
      return true;
    }
    return (window.scrollY || 0) < 8;
  }

  /**
   * 본부 인트로 스택(#hqDivisionIntro)이 화면에 보일 때는 휠로 흑백/컬러 누적,preventDefault 하지 않음.
   */
  function isHqDivisionIntroStackWheelPassthrough() {
    var intro = document.getElementById("hqDivisionIntro");
    if (!intro) {
      return false;
    }
    if (
      !intro.classList.contains("hq-division-intro--stack") ||
      !intro.classList.contains("hq-division-intro--in-view")
    ) {
      return false;
    }
    var r = intro.getBoundingClientRect();
    var vh = window.innerHeight || 1;
    return r.bottom > 8 && r.top < vh - 8;
  }

  /** 전체 컬러 전환 후, 인트로 스택이 화면에 있는 동안 흑백으로 되돌리지 않음 */
  function shouldLockFullColorMosaicWhileIntroVisible() {
    return sectionComplete && isHqDivisionIntroStackWheelPassthrough();
  }

  function maybeFinalizeFacesWhenDivisionIntroStackOnScreen() {
    var landing = getLanding();
    if (!landing || landing.hidden || !faceCells.length || sectionComplete) {
      return;
    }
    if (!isHqDivisionIntroStackWheelPassthrough()) {
      return;
    }
    finalizeSection();
  }

  function enforceFullColorMosaicWhenLocked() {
    if (!shouldLockFullColorMosaicWhileIntroVisible()) {
      return;
    }
    var i;
    for (i = 0; i < faceCells.length; i++) {
      isColor[i] = true;
      faceCells[i].classList.add("is-active");
    }
  }

  function onWheel(e) {
    var landing = getLanding();
    /* sectionComplete 는 여기서 막지 않음: 핀 끝에서 finalize 후에도 위로 휠해 첫 화면으로 돌아가야 함 */
    if (!landing || landing.hidden || !faceCells.length) {
      return;
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    if (isHqDivisionIntroStackWheelPassthrough()) {
      return;
    }

    var dy = e.deltaY;
    if (dy === 0) {
      return;
    }

    lastWheelAt = Date.now();

    if (
      unlocked &&
      accumulated >= THRESHOLD &&
      accumulated <= THRESHOLD + POST_THRESHOLD_PX
    ) {
      if (dy > 0 && accumulated >= THRESHOLD + POST_THRESHOLD_PX - 1e-6) {
        return;
      }
      if (dy > 0) {
        var absPost = Math.abs(dy);
        var addPost = absPost * speedMultiplier(absPost) * WHEEL_ACCUM_SCALE;
        accumulated = Math.min(
          THRESHOLD + POST_THRESHOLD_PX,
          accumulated + addPost,
        );
        if (!sectionComplete) {
          burstFlipFromInput();
        }
        var qfPost = Math.floor(accumulated / WHEEL_QUANTUM);
        if (qfPost > lastQuantumFloor) {
          applyQuantumFlips(lastQuantumFloor, qfPost);
          lastQuantumFloor = qfPost;
        } else {
          lastQuantumFloor = Math.floor(accumulated / WHEEL_QUANTUM);
        }
        e.preventDefault();
        syncDivisionIntroFromMotion();
        syncOurStoryToPin();
        updateOverlap();
        return;
      }
      var absPostUp = Math.abs(dy);
      var subPost =
        absPostUp * speedMultiplier(absPostUp) * WHEEL_ACCUM_SCALE * 0.85;
      if (sectionComplete && !shouldLockFullColorMosaicWhileIntroVisible()) {
        setAllGrayscaleDarkSmooth();
        syncAllDom();
        startSparkleTimer();
      }
      var plannedPost = accumulated - subPost;
      if (plannedPost <= THRESHOLD) {
        unlocked = false;
        accumulated = Math.max(0, plannedPost);
      } else {
        accumulated = plannedPost;
      }
      lastQuantumFloor = Math.floor(accumulated / WHEEL_QUANTUM);
      e.preventDefault();
      syncDivisionIntroFromMotion();
      syncOurStoryToPin();
      updateOverlap();
      return;
    }

    if (!shouldHandleLockPhaseWheel()) {
      return;
    }

    if (dy > 0) {
      var absD = Math.abs(dy);
      var add = absD * speedMultiplier(absD) * WHEEL_ACCUM_SCALE;
      var next = accumulated + add;
      if (next >= THRESHOLD - 0.5) {
        unlocked = true;
        accumulated = Math.min(THRESHOLD + POST_THRESHOLD_PX, next);
        burstFlipFromInput();
        var qf = Math.floor(accumulated / WHEEL_QUANTUM);
        if (qf > lastQuantumFloor) {
          applyQuantumFlips(lastQuantumFloor, qf);
          lastQuantumFloor = qf;
        } else {
          lastQuantumFloor = Math.floor(accumulated / WHEEL_QUANTUM);
        }
        e.preventDefault();
        syncDivisionIntroFromMotion();
        syncOurStoryToPin();
        updateOverlap();
        return;
      }
      accumulated = Math.min(THRESHOLD, next);
      burstFlipFromInput();
      var qf2 = Math.floor(accumulated / WHEEL_QUANTUM);
      if (qf2 > lastQuantumFloor) {
        applyQuantumFlips(lastQuantumFloor, qf2);
        lastQuantumFloor = qf2;
      }
      e.preventDefault();
      syncDivisionIntroFromMotion();
      syncOurStoryToPin();
      updateOverlap();
    } else {
      accumulated = Math.max(
        0,
        accumulated -
          Math.abs(dy) *
            speedMultiplier(Math.abs(dy)) *
            0.85 *
            WHEEL_ACCUM_SCALE,
      );
      lastQuantumFloor = Math.floor(accumulated / WHEEL_QUANTUM);
      e.preventDefault();
      syncDivisionIntroFromMotion();
      syncOurStoryToPin();
      updateOverlap();
    }
  }

  function onTouchStart(e) {
    if (e.touches.length !== 1) {
      return;
    }
    touchStartY = e.touches[0].clientY;
  }

  function onTouchMove(e) {
    var landing = getLanding();
    if (
      !landing ||
      landing.hidden ||
      !faceCells.length ||
      touchStartY == null
    ) {
      return;
    }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    if (isHqDivisionIntroStackWheelPassthrough()) {
      return;
    }

    var y = e.touches[0].clientY;
    var dy = touchStartY - y;
    touchStartY = y;

    if (Math.abs(dy) < 0.5) {
      return;
    }

    lastWheelAt = Date.now();

    var absD = Math.abs(dy);
    var add = absD * speedMultiplier(absD) * WHEEL_ACCUM_SCALE;

    if (
      unlocked &&
      accumulated >= THRESHOLD &&
      accumulated <= THRESHOLD + POST_THRESHOLD_PX
    ) {
      if (dy > 0 && accumulated >= THRESHOLD + POST_THRESHOLD_PX - 1e-6) {
        return;
      }
      if (dy > 0) {
        accumulated = Math.min(
          THRESHOLD + POST_THRESHOLD_PX,
          accumulated + add,
        );
        if (!sectionComplete) {
          burstFlipFromInput();
        }
        var qfTp = Math.floor(accumulated / WHEEL_QUANTUM);
        if (qfTp > lastQuantumFloor) {
          applyQuantumFlips(lastQuantumFloor, qfTp);
          lastQuantumFloor = qfTp;
        } else {
          lastQuantumFloor = Math.floor(accumulated / WHEEL_QUANTUM);
        }
        e.preventDefault();
        syncDivisionIntroFromMotion();
        syncOurStoryToPin();
        updateOverlap();
        return;
      }
      if (sectionComplete && !shouldLockFullColorMosaicWhileIntroVisible()) {
        setAllGrayscaleDarkSmooth();
        syncAllDom();
        startSparkleTimer();
      }
      var plannedT = accumulated - add * 0.85;
      if (plannedT <= THRESHOLD) {
        unlocked = false;
        accumulated = Math.max(0, plannedT);
      } else {
        accumulated = plannedT;
      }
      lastQuantumFloor = Math.floor(accumulated / WHEEL_QUANTUM);
      e.preventDefault();
      syncDivisionIntroFromMotion();
      syncOurStoryToPin();
      updateOverlap();
      return;
    }

    if (!shouldHandleLockPhaseWheel()) {
      return;
    }

    if (dy > 0) {
      var nextT = accumulated + add;
      if (nextT >= THRESHOLD - 0.5) {
        unlocked = true;
        accumulated = Math.min(THRESHOLD + POST_THRESHOLD_PX, nextT);
        burstFlipFromInput();
        var qfT = Math.floor(accumulated / WHEEL_QUANTUM);
        if (qfT > lastQuantumFloor) {
          applyQuantumFlips(lastQuantumFloor, qfT);
          lastQuantumFloor = qfT;
        } else {
          lastQuantumFloor = Math.floor(accumulated / WHEEL_QUANTUM);
        }
        e.preventDefault();
        syncDivisionIntroFromMotion();
        syncOurStoryToPin();
        updateOverlap();
        return;
      }
      accumulated = Math.min(THRESHOLD, nextT);
      burstFlipFromInput();
      var qfT2 = Math.floor(accumulated / WHEEL_QUANTUM);
      if (qfT2 > lastQuantumFloor) {
        applyQuantumFlips(lastQuantumFloor, qfT2);
        lastQuantumFloor = qfT2;
      }
      e.preventDefault();
      syncDivisionIntroFromMotion();
      syncOurStoryToPin();
      updateOverlap();
    } else {
      accumulated = Math.max(0, accumulated - add * 0.85);
      lastQuantumFloor = Math.floor(accumulated / WHEEL_QUANTUM);
      e.preventDefault();
      syncDivisionIntroFromMotion();
      syncOurStoryToPin();
      updateOverlap();
    }
  }

  function onTouchEnd() {
    touchStartY = null;
  }

  function attachWheel() {
    if (wheelHandler) {
      return;
    }
    wheelHandler = onWheel;
    window.addEventListener("wheel", wheelHandler, {
      passive: false,
      capture: true,
    });

    touchHandlerStart = onTouchStart;
    touchHandlerMove = onTouchMove;
    touchHandlerEnd = onTouchEnd;
    window.addEventListener("touchstart", touchHandlerStart, {
      passive: true,
      capture: true,
    });
    window.addEventListener("touchmove", touchHandlerMove, {
      passive: false,
      capture: true,
    });
    window.addEventListener("touchend", touchHandlerEnd, {
      passive: true,
      capture: true,
    });
  }

  function scheduleHqLandingLayoutRefresh() {
    if (hqLandingResizeTimer) {
      clearTimeout(hqLandingResizeTimer);
    }
    hqLandingResizeTimer = window.setTimeout(function () {
      hqLandingResizeTimer = null;
      if (typeof ScrollTrigger === "undefined") {
        return;
      }
      ScrollTrigger.refresh();
      updateOverlap();
    }, 150);
  }

  function detachWheel() {
    if (wheelHandler) {
      window.removeEventListener("wheel", wheelHandler, { capture: true });
      wheelHandler = null;
    }
    if (touchHandlerMove) {
      window.removeEventListener("touchstart", touchHandlerStart, {
        capture: true,
      });
      window.removeEventListener("touchmove", touchHandlerMove, {
        capture: true,
      });
      window.removeEventListener("touchend", touchHandlerEnd, {
        capture: true,
      });
      touchHandlerStart = null;
      touchHandlerMove = null;
      touchHandlerEnd = null;
    }
  }

  /**
   * @param {{ preserveInteractionState?: boolean }} [opts] — true면 휠 누적,잠금,압축 진행 유지(그리드 리사이즈 재바인딩용)
   */
  function init(opts) {
    opts = opts || {};
    var preserve = opts.preserveInteractionState === true;

    var track = document.getElementById("hqLandingStickyTrack");
    var stackEl = document.getElementById("hqLandingStack");
    var container = document.getElementById("hqLandingBgFaces");
    var landing = getLanding();

    if (!track || !stackEl || !container || !landing) {
      return;
    }
    if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    stopSparkleTimer();
    detachWheel();

    faceCells = gsap.utils.toArray(
      container.querySelectorAll(".hq-landing-face-cell"),
    );
    if (!faceCells.length) {
      return;
    }

    if (!preserve) {
      sectionComplete = false;
      resetAccumulation();
    } else {
      initIsColorArray();
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setAllGrayscaleDarkInstant();
      if (stInstance) {
        stInstance.kill();
        stInstance = null;
      }
      stInstance = ScrollTrigger.create({
        id: "hqLandingStackScroll",
        trigger: stackEl,
        start: "top top",
        end: "bottom bottom",
        onUpdate: function () {
          updateOverlap();
        },
        onRefresh: function () {
          updateOverlap();
        },
      });
      window.__hqLandingScrollTrigger = stInstance;
      if (hqLandingResizeHandler) {
        window.removeEventListener("resize", hqLandingResizeHandler);
      }
      hqLandingResizeHandler = scheduleHqLandingLayoutRefresh;
      window.addEventListener("resize", hqLandingResizeHandler, {
        passive: true,
      });
      requestAnimationFrame(function () {
        ScrollTrigger.refresh();
        updateOverlap();
      });
      return;
    }

    var prevPinProgress = 0;
    if (preserve) {
      prevPinProgress = getPinProgress();
    }
    if (stInstance) {
      stInstance.kill();
      stInstance = null;
    }

    setAllGrayscaleDarkInstant();
    syncAllDom();

    lastPinProgress = preserve ? prevPinProgress : 0;

    stInstance = ScrollTrigger.create({
      id: "hqLandingStackScroll",
      trigger: stackEl,
      start: "top top",
      end: "bottom bottom",
      invalidateOnRefresh: true,
      onUpdate: function () {
        if (landing.hidden) {
          return;
        }
        var p = getPinProgress();
        if (Math.abs(p - lastPinProgress) > 1e-5) {
          lastWheelAt = Date.now();
        }
        lastPinProgress = p;
        if (unlocked && !sectionComplete && p >= 0.97) {
          finalizeSection();
        }
        updateOverlap();
      },
      onRefresh: function () {
        updateOverlap();
      },
      onLeave: function () {
        if (shouldLockFullColorMosaicWhileIntroVisible()) {
          return;
        }
        setAllGrayscaleDarkSmooth();
      },
      onLeaveBack: function () {
        if (shouldLockFullColorMosaicWhileIntroVisible()) {
          return;
        }
        setAllGrayscaleDarkSmooth();
      },
    });

    attachWheel();
    startSparkleTimer();

    if (hqLandingResizeHandler) {
      window.removeEventListener("resize", hqLandingResizeHandler);
    }
    hqLandingResizeHandler = scheduleHqLandingLayoutRefresh;
    window.addEventListener("resize", hqLandingResizeHandler, {
      passive: true,
    });

    window.__hqLandingScrollTrigger = stInstance;
    window.__hqLandingThresholdPx = THRESHOLD;
    window.__hqLandingWheelAccumScale = WHEEL_ACCUM_SCALE;
    window.__hqLandingPinScrollVh = PIN_SCROLL_VH;
    window.__hqLandingPostThresholdPx = POST_THRESHOLD_PX;
    window.__hqLandingLiftFullAccumPx = LIFT_FULL_ACCUM_PX;

    requestAnimationFrame(function () {
      ScrollTrigger.refresh();
      updateOverlap();
    });
  }

  window.initHqLandingScrollTrigger = init;

  window.refreshHqLandingScrollTrigger = function () {
    if (typeof ScrollTrigger === "undefined") {
      return;
    }
    ScrollTrigger.refresh();
  };

  /**
   * 인터뷰 셸에서 랜딩으로 돌아올 때: 휠 누적,덮개,압축,리프트 CSS를 초기화.
   * landing이 hidden일 때는 updateOverlap이 스킵되어 변수가 남아 모자이크가 1/3만 보이는 등 깨짐이 난다.
   */
  window.resetHqLandingInteractionState = function () {
    resetAccumulation();
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        if (typeof ScrollTrigger !== "undefined") {
          ScrollTrigger.refresh();
        }
        updateOverlap();
      });
    });
  };
})();
