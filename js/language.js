// 다국어 지원 (한국어/영어)
class LanguageToggle {
  constructor() {
    this.currentLanguage = localStorage.getItem("language") || "kr";
    this.toggleButton = document.getElementById("languageToggle");
    this.languageLabel = document.getElementById("languageLabel");

    this.init();
  }

  init() {
    // 초기 언어 설정
    this.setLanguage(this.currentLanguage);

    // 토글 버튼 이벤트
    if (this.toggleButton) {
      this.toggleButton.addEventListener("click", (e) => {
        this.currentLanguage = this.currentLanguage === "kr" ? "en" : "kr";
        this.setLanguage(this.currentLanguage);
        localStorage.setItem("language", this.currentLanguage);
        // 모바일에서 포커스 제거하여 배경색이 남지 않도록
        this.toggleButton.blur();
      });
    }
  }

  setLanguage(lang) {
    // 언어 레이블 업데이트
    if (this.languageLabel) {
      this.languageLabel.textContent = lang === "kr" ? "EN" : "KR";
    }

    // 모든 다국어 요소 업데이트
    const elements = document.querySelectorAll("[data-kr][data-en]");
    elements.forEach((element) => {
      // hq-nav-link는 약어 사용
      if (element.classList.contains("hq-nav-link") && element.dataset.abbrKr) {
        const text = lang === "kr" ? element.dataset.abbrKr : element.dataset.abbrEn;
        element.textContent = text;
      } else {
        const text = lang === "kr" ? element.dataset.kr : element.dataset.en;
        element.textContent = text;
      }
    });

    // 섹션 타이틀 업데이트
    this.updateSectionTitles(lang);

    // 섹션 설명 업데이트
    this.updateDescriptions(lang);

    // 서비스 카드 업데이트
    this.updateServiceCards(lang);

    // About 섹션 업데이트
    this.updateAboutSection(lang);

    // 카루셀 업데이트
    this.updateCarousel(lang);

    // 스토리 섹션 업데이트
    this.updateStories(lang);

    // HQ 페이지 업데이트
    this.updateHQPage(lang);

    // 언어 변경 이벤트 발송
    document.dispatchEvent(
      new CustomEvent("languageChange", {
        detail: { language: lang },
      })
    );
  }

  updateCarousel(lang) {
    const headerTitle = document.querySelector(".carousel-header-title");
    const headerSubtitle = document.querySelector(".carousel-header-subtitle");
    const carouselTexts = document.querySelectorAll(".carousel-text-kr");
    const carouselDescriptions = document.querySelectorAll(
      ".carousel-description"
    );

    if (headerTitle && headerTitle.dataset.kr && headerTitle.dataset.en) {
      headerTitle.textContent =
        lang === "kr" ? headerTitle.dataset.kr : headerTitle.dataset.en;
    }

    if (
      headerSubtitle &&
      headerSubtitle.dataset.kr &&
      headerSubtitle.dataset.en
    ) {
      headerSubtitle.textContent =
        lang === "kr" ? headerSubtitle.dataset.kr : headerSubtitle.dataset.en;
    }

    carouselTexts.forEach((text) => {
      if (text.dataset.kr && text.dataset.en) {
        text.textContent = lang === "kr" ? text.dataset.kr : text.dataset.en;
      }
    });

    carouselDescriptions.forEach((desc) => {
      if (desc.dataset.kr && desc.dataset.en) {
        desc.textContent = lang === "kr" ? desc.dataset.kr : desc.dataset.en;
      }
    });
  }

  updateHQPage(lang) {
    // Update HQ navigation links (use abbreviation for nav links)
    const navLinks = document.querySelectorAll(".hq-nav-link");
    navLinks.forEach((link) => {
      if (link.dataset.abbrKr && link.dataset.abbrEn) {
        link.textContent = lang === "kr" ? link.dataset.abbrKr : link.dataset.abbrEn;
      } else if (link.dataset.kr && link.dataset.en) {
        link.textContent = lang === "kr" ? link.dataset.kr : link.dataset.en;
      }
    });

    document.querySelectorAll(".hq-landing-card-abbr").forEach((el) => {
      if (el.dataset.abbrKr && el.dataset.abbrEn) {
        el.textContent = lang === "kr" ? el.dataset.abbrKr : el.dataset.abbrEn;
      } else if (el.dataset.kr && el.dataset.en) {
        el.textContent = lang === "kr" ? el.dataset.kr : el.dataset.en;
      }
    });

    // Update HQ main title
    const mainTitle = document.getElementById("hqMainTitle");
    if (mainTitle && mainTitle.dataset.kr && mainTitle.dataset.en) {
      mainTitle.textContent = lang === "kr" ? mainTitle.dataset.kr : mainTitle.dataset.en;
    }

    const backToLanding = document.getElementById("hqBackToLanding");
    if (backToLanding && backToLanding.dataset.ariaKr && backToLanding.dataset.ariaEn) {
      backToLanding.setAttribute(
        "aria-label",
        lang === "kr" ? backToLanding.dataset.ariaKr : backToLanding.dataset.ariaEn
      );
    }

    // Update sidebar links
    const sidebarLinks = document.querySelectorAll(".hq-sidebar-link");
    sidebarLinks.forEach((link) => {
      if (link.dataset.abbrKr && link.dataset.abbrEn) {
        link.textContent = lang === "kr" ? link.dataset.abbrKr : link.dataset.abbrEn;
      } else if (link.dataset.kr && link.dataset.en) {
        link.textContent = lang === "kr" ? link.dataset.kr : link.dataset.en;
      }
    });

    // Update content sections
    const contentTitles = document.querySelectorAll(".hq-content-title");
    contentTitles.forEach((title) => {
      if (title.dataset.kr && title.dataset.en) {
        title.textContent = lang === "kr" ? title.dataset.kr : title.dataset.en;
      }
    });

    const contentDescriptions = document.querySelectorAll(".hq-content-description");
    contentDescriptions.forEach((desc) => {
      if (desc.dataset.kr && desc.dataset.en) {
        desc.textContent = lang === "kr" ? desc.dataset.kr : desc.dataset.en;
      }
    });

    const interviewLinks = document.querySelectorAll(".hq-interview-link span");
    interviewLinks.forEach((link) => {
      if (link.dataset.kr && link.dataset.en) {
        link.textContent = lang === "kr" ? link.dataset.kr : link.dataset.en;
      }
    });
  }

  updateStories(lang) {
    const storyTitles = document.querySelectorAll(".story-title");
    const storyDescriptions = document.querySelectorAll(".story-description");
    const storyLinks = document.querySelectorAll(".story-link span");

    storyTitles.forEach((title) => {
      if (title.dataset.kr && title.dataset.en) {
        title.textContent = lang === "kr" ? title.dataset.kr : title.dataset.en;
      }
    });

    storyDescriptions.forEach((desc) => {
      if (desc.dataset.kr && desc.dataset.en) {
        desc.textContent = lang === "kr" ? desc.dataset.kr : desc.dataset.en;
      }
    });

    storyLinks.forEach((link) => {
      if (link.dataset.kr && link.dataset.en) {
        link.textContent = lang === "kr" ? link.dataset.kr : link.dataset.en;
      }
    });
  }

  updateSectionTitles(lang) {
    const titles = {
      capabilities: {
        kr: "Core Capabilities",
        en: "Core Capabilities",
      },
      capabilitiesDesc: {},
      innovation: {
        kr: "Zero Crashes Zero Emissions Zero Congestion",
        en: "Zero Crashes Zero Emissions Zero Congestion",
      },
      innovationDesc: {
        kr: "Zero Crashes Zero Emissions Zero Congestion",
        en: "Zero Crashes Zero Emissions Zero Congestion",
      },
      about: {
        kr: "About GMTCK",
        en: "About GMTCK",
      },
      aboutDesc: {
        kr: "GMTCK는 GM의 글로벌 기술 네트워크의 핵심 거점입니다",
        en: "GMTCK is a key hub of GM's global technology network",
      },
    };

    // Capabilities 섹션
    const capTitle = document.querySelector("#capabilities .section-title");
    if (capTitle) capTitle.textContent = titles.capabilities[lang];

    // const capDesc = document.querySelector(
    //   "#capabilities .section-description"
    // );
    // if (capDesc) capDesc.innerHTML = titles.capabilitiesDesc[lang];

    // Innovation 섹션 - Zero Crashes Zero Emissions Zero Congestion
    // HTML 구조를 유지하기 위해 textContent 대신 title-line 요소들만 업데이트
    const titleLines = document.querySelectorAll("#innovation .title-line");
    if (titleLines.length >= 3) {
      const zeroText = `<span class="zero-text" style="color: #0078d4 !important; display: inline;">Zero</span>`;
      titleLines[0].innerHTML = `${zeroText} Crashes`;
      titleLines[1].innerHTML = `${zeroText} Emissions`;
      titleLines[2].innerHTML = `${zeroText} Congestion`;
    }

    // About 섹션
    const aboutTitle = document.querySelector("#about .section-title");
    if (aboutTitle) aboutTitle.textContent = titles.about[lang];

    const aboutDesc = document.querySelector("#about .section-description");
    if (aboutDesc) aboutDesc.textContent = titles.aboutDesc[lang];
  }

  updateDescriptions(lang) {
    const descriptions = {
      kr: {
        scroll: "Scroll",
      },
      en: {
        scroll: "Scroll",
      },
    };

    // Scroll indicator
    const scrollText = document.querySelector(".hero-scroll span");
    if (scrollText) scrollText.textContent = descriptions[lang].scroll;
  }

  updateServiceCards(lang) {
    const services = [
      {
        kr: {
          title: "차량 엔지니어링",
          description:
            "첨단 차량 설계 및 엔지니어링 솔루션으로 차세대 모빌리티를 구현합니다",
        },
        en: {
          title: "Vehicle Engineering",
          description:
            "Implementing next-generation mobility with advanced vehicle design and engineering solutions",
        },
      },
      {
        kr: {
          title: "전동화 기술",
          description:
            "전기차 및 하이브리드 시스템 개발을 통해 지속 가능한 미래를 만들어갑니다",
        },
        en: {
          title: "Electrification Technology",
          description:
            "Creating a sustainable future through EV and hybrid system development",
        },
      },
      {
        kr: {
          title: "자율주행 시스템",
          description:
            "안전하고 편리한 자율주행 기술로 모빌리티의 새로운 시대를 열어갑니다",
        },
        en: {
          title: "Autonomous Driving",
          description:
            "Opening a new era of mobility with safe and convenient autonomous driving technology",
        },
      },
    ];

    const serviceCards = document.querySelectorAll(".service-card");
    serviceCards.forEach((card, index) => {
      if (services[index]) {
        const title = card.querySelector(".service-title");
        const description = card.querySelector(".service-description");

        if (title) title.textContent = services[index][lang].title;
        if (description)
          description.textContent = services[index][lang].description;
      }
    });
  }

  updateAboutSection(lang) {
    const about = {
      kr: {
        intro:
          "GMTCK는 General Motors의 글로벌 기술 네트워크에서 핵심적인 역할을 수행하는 한국의 기술 센터입니다.",
        mission: "우리의 미션",
        missionText:
          "혁신적인 기술 개발을 통해 미래 모빌리티를 선도하고, 지속 가능한 자동차 산업의 발전에 기여합니다.",
        vision: "우리의 비전",
        visionText:
          "글로벌 자동차 산업을 이끄는 기술 혁신의 중심지가 되어, 더 안전하고 친환경적인 모빌리티 솔루션을 제공합니다.",
      },
      en: {
        intro:
          "GMTCK is a technology center in Korea that plays a key role in General Motors' global technology network.",
        mission: "Our Mission",
        missionText:
          "Leading future mobility through innovative technology development and contributing to the advancement of sustainable automotive industry.",
        vision: "Our Vision",
        visionText:
          "Becoming a center of technological innovation leading the global automotive industry, providing safer and more eco-friendly mobility solutions.",
      },
    };

    // About 섹션의 텍스트 업데이트
    const aboutIntro = document.querySelector("#about .about-intro");
    if (aboutIntro) aboutIntro.textContent = about[lang].intro;

    const missionTitle = document.querySelector("#about .mission-title");
    if (missionTitle) missionTitle.textContent = about[lang].mission;

    const missionText = document.querySelector("#about .mission-text");
    if (missionText) missionText.textContent = about[lang].missionText;

    const visionTitle = document.querySelector("#about .vision-title");
    if (visionTitle) visionTitle.textContent = about[lang].vision;

    const visionText = document.querySelector("#about .vision-text");
    if (visionText) visionText.textContent = about[lang].visionText;
  }
}

// 초기화 (다른 스크립트가 비동기로 본문을 붙인 뒤 setLanguage를 다시 호출할 수 있도록 노출)
document.addEventListener("DOMContentLoaded", () => {
  window.gmtckLanguageToggle = new LanguageToggle();
});
