/**
 * #hqDivisionIntro — 상단이 뷰포트 ~80%에 도달하면 .hq-division-intro--in-view + 배경 미세 패럴랙스
 */
(function () {
  "use strict";

  var section = null;
  var parallaxRaf = null;
  /* 값이 클수록(>1) 스크롤을 덜 내려도 등장 — 랜딩 핀 전환과 맞춤 */
  var TRIGGER_TOP_RATIO = 1.22;
  var PARALLAX_STRENGTH = 0.09;

  function prefersReducedMotion() {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  function shouldReveal() {
    if (!section) {
      return false;
    }
    var rect = section.getBoundingClientRect();
    return rect.top <= window.innerHeight * TRIGGER_TOP_RATIO;
  }

  function applyReveal() {
    if (!section || section.classList.contains("hq-division-intro--in-view")) {
      return;
    }
    if (shouldReveal()) {
      section.classList.add("hq-division-intro--in-view");
    }
  }

  function updateParallax() {
    parallaxRaf = null;
    if (
      !section ||
      !section.classList.contains("hq-division-intro--in-view") ||
      prefersReducedMotion()
    ) {
      return;
    }
    var medias = section.querySelectorAll(".hq-division-intro__media");
    var vh = window.innerHeight || 1;
    var i;
    var media;
    var rect;
    var center;
    var norm;
    var y;
    for (i = 0; i < medias.length; i++) {
      media = medias[i];
      rect = media.getBoundingClientRect();
      center = rect.top + rect.height * 0.5;
      norm = (center - vh * 0.5) / vh;
      y = norm * vh * PARALLAX_STRENGTH * -1;
      media.style.setProperty("--hq-di-parallax", y.toFixed(2) + "px");
    }
  }

  function requestParallax() {
    if (parallaxRaf != null) {
      return;
    }
    parallaxRaf = window.requestAnimationFrame(updateParallax);
  }

  function onMediaTransitionEnd(e) {
    var t = e.target;
    if (
      !t ||
      !t.classList ||
      !t.classList.contains("hq-division-intro__media")
    ) {
      return;
    }
    if (e.propertyName !== "opacity") {
      return;
    }
    t.classList.add("hq-division-intro__media--entered");
  }

  function onScrollOrResize() {
    applyReveal();
    requestParallax();
  }

  function init() {
    section = document.getElementById("hqDivisionIntro");
    if (!section) {
      return;
    }

    /* 직무 랜딩(#hqLanding): 핀 progress로 등장,패럴랙스는 hq-landing-scrolltrigger.js가 전담 */
    if (document.getElementById("hqLanding") && !prefersReducedMotion()) {
      return;
    }

    section.addEventListener("transitionend", onMediaTransitionEnd, false);

    if (prefersReducedMotion()) {
      section.classList.add("hq-division-intro--in-view");
      section
        .querySelectorAll(".hq-division-intro__media")
        .forEach(function (el) {
          el.classList.add("hq-division-intro__media--entered");
        });
      return;
    }

    window.addEventListener("scroll", onScrollOrResize, {
      passive: true,
      capture: true,
    });
    window.addEventListener("resize", onScrollOrResize, { passive: true });
    onScrollOrResize();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
