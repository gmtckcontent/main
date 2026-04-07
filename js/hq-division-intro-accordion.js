/**
 * 본부 소개 가로 아코디언: 짧은 스치기 호버 시 열리지 않도록 지연 후 확장
 * (hover: hover) + (pointer: fine) 에서만 동작
 */
(function () {
  "use strict";

  var OPEN_DELAY_MS = 160;

  function init() {
    var accordion = document.querySelector(".hq-division-intro__accordion");
    if (!accordion) {
      return;
    }

    var mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    if (!mq.matches) {
      return;
    }

    var cards = accordion.querySelectorAll(".hq-division-intro__card");
    if (!cards.length) {
      return;
    }

    accordion.classList.add("hq-division-intro__accordion--js");

    var openTimer = null;
    var pendingCard = null;

    function clearOpenTimer() {
      if (openTimer) {
        clearTimeout(openTimer);
        openTimer = null;
      }
    }

    function collapseAll() {
      clearOpenTimer();
      pendingCard = null;
      accordion.classList.remove("hq-division-intro__accordion--is-expanded");
      for (var i = 0; i < cards.length; i++) {
        cards[i].classList.remove("hq-division-intro__card--expanded");
      }
    }

    function expandCard(card) {
      for (var i = 0; i < cards.length; i++) {
        cards[i].classList.toggle("hq-division-intro__card--expanded", cards[i] === card);
      }
      accordion.classList.add("hq-division-intro__accordion--is-expanded");
    }

    function onEnter() {
      var card = this;
      clearOpenTimer();
      pendingCard = card;
      openTimer = setTimeout(function () {
        openTimer = null;
        if (pendingCard === card) {
          expandCard(card);
          pendingCard = null;
        }
      }, OPEN_DELAY_MS);
    }

    function onLeave() {
      var card = this;
      if (pendingCard === card) {
        clearOpenTimer();
        pendingCard = null;
      }
    }

    for (var c = 0; c < cards.length; c++) {
      cards[c].addEventListener("mouseenter", onEnter);
      cards[c].addEventListener("mouseleave", onLeave);
    }

    accordion.addEventListener("mouseleave", collapseAll);

    function onMqChange(e) {
      if (!e.matches) {
        collapseAll();
        accordion.classList.remove("hq-division-intro__accordion--js");
      }
    }

    if (mq.addEventListener) {
      mq.addEventListener("change", onMqChange);
    } else if (mq.addListener) {
      mq.addListener(onMqChange);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
