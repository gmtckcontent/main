// ===========================
// Navigation Scroll Effect
// ===========================
const navbar = document.getElementById("navbar");
const heroSection = document.querySelector(".hero");
const subpageHeroSection = document.querySelector(".subpage-hero");
const hqIntroSection = document.querySelector(".hq-intro-section");
let lastScroll = 0;

// Determine which hero section exists (check hq-intro-section if no subpage-hero)
const activeHeroSection = heroSection || subpageHeroSection || hqIntroSection;

window.addEventListener("scroll", () => {
  const currentScroll = window.pageYOffset;
  
  // Check if we're on interviews page - always show background
  const isInterviewsPage = window.location.pathname.includes('team-tck-interviews.html') || 
                           window.location.href.includes('team-tck-interviews.html');
  
  // If on interviews page, always show scrolled state (with background)
  if (isInterviewsPage) {
    navbar.classList.remove("over-hero");
    navbar.classList.add("scrolled");
    lastScroll = currentScroll;
    return;
  }
  
  // If at top of page (scroll position 0), always show over-hero state (no background)
  if (currentScroll === 0) {
    navbar.classList.add("over-hero");
    navbar.classList.remove("scrolled");
    lastScroll = currentScroll;
    return;
  }
  
  // For subpage, always show scrolled state after initial hero section
  if (subpageHeroSection && !heroSection) {
    const heroHeight = subpageHeroSection.offsetHeight;
    if (currentScroll < heroHeight - 80) {
      navbar.classList.add("over-hero");
      navbar.classList.remove("scrolled");
    } else {
      navbar.classList.remove("over-hero");
      navbar.classList.add("scrolled");
    }
  } else if (hqIntroSection && !heroSection && !subpageHeroSection) {
    // For team-tck-hq.html with hq-intro-section and banner
    const banner = document.querySelector(".hq-intro-banner");
    const bannerHeight = banner ? banner.offsetHeight : 0;
    const threshold = Math.max(bannerHeight - 80, 0);
    if (currentScroll < threshold) {
      navbar.classList.add("over-hero");
      navbar.classList.remove("scrolled");
    } else {
      navbar.classList.remove("over-hero");
      navbar.classList.add("scrolled");
    }
  } else if (heroSection) {
    // Original logic for main page with .hero section
    const heroHeight = heroSection.offsetHeight;
    if (currentScroll < heroHeight - 80) {
      navbar.classList.add("over-hero");
      navbar.classList.remove("scrolled");
    } else {
      navbar.classList.remove("over-hero");
      navbar.classList.add("scrolled");
    }
  } else {
    // No hero section found, always show scrolled state
    navbar.classList.remove("over-hero");
    navbar.classList.add("scrolled");
  }

  lastScroll = currentScroll;
});

// Check initial state on load and DOMContentLoaded
function setInitialNavbarState() {
  const currentScroll = window.pageYOffset;
  
  // Check if we're on interviews page - always show background
  const isInterviewsPage = window.location.pathname.includes('team-tck-interviews.html') || 
                           window.location.href.includes('team-tck-interviews.html');
  
  // If on interviews page, always show scrolled state (with background)
  if (isInterviewsPage) {
    navbar.classList.remove("over-hero");
    navbar.classList.add("scrolled");
    return;
  }
  
  // If at top of page (scroll position 0), always show over-hero state (no background)
  if (currentScroll === 0) {
    navbar.classList.add("over-hero");
    navbar.classList.remove("scrolled");
    return;
  }
  
  // For subpage, check subpage-hero
  if (subpageHeroSection && !heroSection) {
    const heroHeight = subpageHeroSection.offsetHeight;
    if (currentScroll < heroHeight - 80) {
      navbar.classList.add("over-hero");
      navbar.classList.remove("scrolled");
    } else {
      navbar.classList.remove("over-hero");
      navbar.classList.add("scrolled");
    }
  } else if (hqIntroSection && !heroSection && !subpageHeroSection) {
    // For team-tck-hq.html with hq-intro-section and banner
    const banner = document.querySelector(".hq-intro-banner");
    const bannerHeight = banner ? banner.offsetHeight : 0;
    const threshold = bannerHeight - 80;
    if (currentScroll < threshold) {
      navbar.classList.add("over-hero");
      navbar.classList.remove("scrolled");
    } else {
      navbar.classList.remove("over-hero");
      navbar.classList.add("scrolled");
    }
  } else if (heroSection) {
    // Original logic for main page
    const heroHeight = heroSection.offsetHeight;
    if (currentScroll < heroHeight - 80) {
      navbar.classList.add("over-hero");
      navbar.classList.remove("scrolled");
    } else {
      navbar.classList.remove("over-hero");
      navbar.classList.add("scrolled");
    }
  } else {
    // No hero section, always scrolled
    navbar.classList.remove("over-hero");
    navbar.classList.add("scrolled");
  }
}

// Set initial state as early as possible
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", setInitialNavbarState);
} else {
  setInitialNavbarState();
}

window.addEventListener("load", () => {
  setInitialNavbarState();
  // Also check after images load (for banner image)
  const bannerImage = document.querySelector(".hq-intro-banner-image");
  if (bannerImage) {
    if (bannerImage.complete) {
      setInitialNavbarState();
    } else {
      bannerImage.addEventListener("load", setInitialNavbarState, { once: true });
    }
  }
});

// ===========================
// Mobile Menu Toggle
// ===========================
const hamburger = document.getElementById("hamburger");
const navMenu = document.getElementById("navMenu");

hamburger.addEventListener("click", () => {
  navMenu.classList.toggle("active");

  // Animate hamburger icon
  const spans = hamburger.querySelectorAll("span");
  if (navMenu.classList.contains("active")) {
    spans[0].style.transform = "rotate(45deg) translate(5px, 5px)";
    spans[1].style.opacity = "0";
    spans[2].style.transform = "rotate(-45deg) translate(7px, -6px)";
  } else {
    spans[0].style.transform = "none";
    spans[1].style.opacity = "1";
    spans[2].style.transform = "none";
  }
});

// Close menu when clicking on a link
navMenu.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navMenu.classList.remove("active");
    const spans = hamburger.querySelectorAll("span");
    spans[0].style.transform = "none";
    spans[1].style.opacity = "1";
    spans[2].style.transform = "none";
  });
});

// ===========================
// Smooth Scroll
// ===========================
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    // Don't prevent default for hash links on subpages (handled by subpage scripts)
    const href = this.getAttribute("href");
    if (href && href.startsWith("#") && document.querySelector(".hq-sidebar-link")) {
      // This is a subpage with sidebar navigation, let subpage handle it
      return;
    }
    
    e.preventDefault();
    const target = document.querySelector(href);

    if (target) {
      const offsetTop = target.offsetTop - 80;
      window.scrollTo({
        top: offsetTop,
        behavior: "smooth",
      });
    }
  });
});

// Handle navigation to team-tck-hq.html - scroll to hero section
document.querySelectorAll('a[href*="team-tck-hq.html"]').forEach((link) => {
  link.addEventListener("click", function (e) {
    // Store that we're navigating from index.html
    sessionStorage.setItem("fromNavigation", "true");
  });
});

// ===========================
// Stats Counter Animation
// ===========================
const stats = document.querySelectorAll(".stat-number");
let statsAnimated = false;

const animateStats = () => {
  stats.forEach((stat) => {
    const target = parseInt(stat.getAttribute("data-target"));
    const duration = 2000; // 2 seconds
    const increment = target / (duration / 16); // 60fps
    let current = 0;

    const formatNumber = (num) => {
      return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };

    const updateCounter = () => {
      current += increment;
      if (current < target) {
        stat.textContent = formatNumber(Math.floor(current));
        requestAnimationFrame(updateCounter);
      } else {
        stat.textContent = formatNumber(target);
      }
    };

    updateCounter();
  });
};

// Trigger animation when stats section is in view
const statsSection =
  document.querySelector(".stats") ||
  document.querySelector(".technology-stats-overlay") ||
  document.querySelector("#innovation");
const observerOptions = {
  threshold: 0.5,
};

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting && !statsAnimated) {
      animateStats();
      statsAnimated = true;
    }
  });
}, observerOptions);

if (statsSection) {
  statsObserver.observe(statsSection);
}

// ===========================
// Fade In Animation on Scroll
// ===========================
const observeElements = document.querySelectorAll(
  ".service-card, .tech-feature, .stat-item"
);

const fadeInObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.style.opacity = "1";
          entry.target.style.transform = "translateY(0)";
        }, index * 100);
      }
    });
  },
  {
    threshold: 0.1,
  }
);

observeElements.forEach((element) => {
  element.style.opacity = "0";
  element.style.transform = "translateY(30px)";
  element.style.transition = "opacity 0.6s ease, transform 0.6s ease";
  fadeInObserver.observe(element);
});

// ===========================
// Services Section Fade In Animation
// ===========================
const storySections = document.querySelectorAll(".story-section");

const storyObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("fade-in");
      }
    });
  },
  {
    threshold: 0.2,
    rootMargin: "0px 0px -50px 0px",
  }
);

storySections.forEach((section) => {
  storyObserver.observe(section);
});

// ===========================
// Contact Form Handling
// ===========================
const contactForm = document.querySelector(".contact-form");

contactForm.addEventListener("submit", (e) => {
  e.preventDefault();

  // Get form data
  const formData = new FormData(contactForm);
  const data = {};
  formData.forEach((value, key) => {
    data[key] = value;
  });

  // Show success message (you can customize this)
  alert("문의가 성공적으로 전송되었습니다!\n빠른 시일 내에 답변드리겠습니다.");

  // Reset form
  contactForm.reset();

  // Here you would normally send data to a server
  // Example:
  // fetch('/api/contact', {
  //     method: 'POST',
  //     headers: { 'Content-Type': 'application/json' },
  //     body: JSON.stringify(data)
  // });
});

// ===========================
// Parallax Effect for Hero
// ===========================
const heroContent = document.querySelector(".hero-content");

window.addEventListener("scroll", () => {
  const scrolled = window.pageYOffset;
  if (heroContent && scrolled < window.innerHeight) {
    heroContent.style.transform = `translateY(${scrolled * 0.3}px)`;
    heroContent.style.opacity = 1 - scrolled / 600;
  }
});

// ===========================
// Service Cards Hover Effect
// ===========================
const serviceCards = document.querySelectorAll(".service-card");

serviceCards.forEach((card) => {
  card.addEventListener("mouseenter", function () {
    this.style.borderRadius = "32px";
  });

  card.addEventListener("mouseleave", function () {
    this.style.borderRadius = "24px";
  });
});

// ===========================
// Add active state to navigation
// ===========================
const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll(".nav-menu a");

window.addEventListener("scroll", () => {
  let current = "";

  sections.forEach((section) => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;
    if (pageYOffset >= sectionTop - 200) {
      current = section.getAttribute("id");
    }
  });

  navLinks.forEach((link) => {
    link.classList.remove("active");
    if (link.getAttribute("href") === `#${current}`) {
      link.classList.add("active");
    }
  });
});

// ===========================
// Loading Animation
// ===========================
window.addEventListener("load", () => {
  document.body.style.opacity = "0";
  setTimeout(() => {
    document.body.style.transition = "opacity 0.5s ease";
    document.body.style.opacity = "1";
  }, 100);
});

// ===========================
// Video Auto-Play with Enhanced Support (Safari Compatible)
// ===========================
const heroVideo = document.querySelector(".hero-video");
if (heroVideo) {
  // Detect Safari browser
  const isSafari =
    /^((?!chrome|android).)*safari/i.test(navigator.userAgent) ||
    (/iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream);

  // Ensure video is muted for autoplay (browser policy requirement)
  heroVideo.muted = true;
  heroVideo.setAttribute("muted", "");
  heroVideo.setAttribute("playsinline", "");
  heroVideo.setAttribute("webkit-playsinline", "");

  // Safari-specific: set volume to 0 explicitly
  heroVideo.volume = 0;

  // Hide all video controls and play buttons
  heroVideo.controls = false;
  heroVideo.removeAttribute("controls");
  heroVideo.setAttribute("controls", "false");

  // Disable pointer events to prevent control overlay
  heroVideo.style.pointerEvents = "none";

  // Safari-specific: Remove controls attribute completely
  if (isSafari) {
    heroVideo.removeAttribute("controls");
    // Force remove controls after a delay to ensure Safari respects it
    setTimeout(() => {
      heroVideo.controls = false;
      heroVideo.removeAttribute("controls");
    }, 100);
  }

  let playAttempted = false;
  let playPromise = null;

  // Function to play video with enhanced retry logic
  const playVideo = async (retryCount = 0) => {
    // Prevent multiple simultaneous play attempts
    if (playPromise) {
      return playPromise;
    }

    // Always ensure video is muted and ready
    heroVideo.muted = true;
    heroVideo.volume = 0;

    const maxRetries = isSafari ? 10 : 5;
    const retryDelay = isSafari ? 1000 : 500;

    playPromise = (async () => {
      try {
        // Only try to play if video has metadata loaded
        if (heroVideo.readyState >= 2) {
          // HAVE_CURRENT_DATA or higher
          await heroVideo.play();
          playAttempted = true;
          playPromise = null;
          return true;
        } else {
          throw new Error("Video not ready");
        }
      } catch (error) {
        playPromise = null;

        // Retry with exponential backoff
        if (retryCount < maxRetries) {
          const delay = retryDelay * Math.pow(1.5, retryCount);
          setTimeout(() => {
            playVideo(retryCount + 1);
          }, delay);
        }
        return false;
      }
    })();

    return playPromise;
  };

  // Monitor video playback status and resume if paused
  let playbackMonitor = null;
  const startPlaybackMonitor = () => {
    if (playbackMonitor) return;
    playbackMonitor = setInterval(() => {
      if (
        heroVideo &&
        heroVideo.paused &&
        !heroVideo.ended &&
        heroVideo.readyState >= 2
      ) {
        playVideo(0).catch(() => {});
      }
    }, 3000); // Check every 3 seconds
  };

  // Start monitoring after first successful play
  heroVideo.addEventListener("playing", () => {
    startPlaybackMonitor();
  });

  // Safari-specific: Wait for full page load
  const attemptPlayAfterLoad = () => {
    if (!playAttempted) {
      // Safari needs a bit more time
      setTimeout(
        () => {
          playVideo();
        },
        isSafari ? 500 : 100
      );
    }
  };

  // Try to play on multiple video events
  const videoEvents = [
    "loadeddata",
    "canplay",
    "canplaythrough",
    "loadedmetadata",
  ];

  videoEvents.forEach((event) => {
    heroVideo.addEventListener(
      event,
      () => {
        attemptPlayAfterLoad();
      },
      { once: true }
    );
  });

  // Safari-specific: Wait for window load event
  if (document.readyState === "complete") {
    attemptPlayAfterLoad();
  } else {
    window.addEventListener("load", () => {
      setTimeout(attemptPlayAfterLoad, isSafari ? 800 : 300);
    });
  }

  // Also try DOMContentLoaded for faster initial attempt
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      setTimeout(attemptPlayAfterLoad, 200);
    });
  }

  // Try to play immediately if video is already loaded
  if (heroVideo.readyState >= 2) {
    attemptPlayAfterLoad();
  }

  // Try to play when page becomes visible (handles tab switching)
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden && heroVideo.paused) {
      playVideo();
    }
  });

  // Safari: Handle focus event (when user switches back to tab)
  window.addEventListener("focus", () => {
    if (heroVideo.paused) {
      setTimeout(() => playVideo(), 100);
    }
  });

  // Enhanced error handling and video load detection
  let videoLoadTimeout;
  let videoLoaded = false;

  const checkVideoLoaded = () => {
    // Check if video actually loaded and can play
    if (heroVideo.readyState === 0 && heroVideo.networkState === 3) {
      // Network error or source not found
      if (!videoLoaded) {
        showFallback();
      }
      return;
    }

    // Set timeout to detect if video doesn't load within reasonable time
    clearTimeout(videoLoadTimeout);
    videoLoadTimeout = setTimeout(() => {
      if (heroVideo.readyState < 2 && !videoLoaded) {
        showFallback();
        // Keep trying to load and play
        heroVideo.load();
        setTimeout(() => playVideo(0), 1000);
      }
    }, 15000); // 15 second timeout - longer to allow video to load
  };

  const showFallback = () => {
    // Don't hide video, just show fallback as background
    // heroVideo.style.display = "none";
    // heroVideo.setAttribute("data-error", "true");
    const fallbackBg = document.querySelector(".hero-fallback-bg");
    if (fallbackBg) {
      fallbackBg.style.display = "block";
      fallbackBg.style.zIndex = "-1";
      // Force opacity to show fallback immediately
      setTimeout(() => {
        fallbackBg.style.opacity = "1";
      }, 100);
    }
    // Keep trying to play video
    setTimeout(() => {
      playVideo(0).catch(() => {});
    }, 2000);
  };

  // Error handling - network errors, CORS, format errors
  heroVideo.addEventListener("error", (e) => {
    const error = heroVideo.error;
    if (error) {
      // Error code meanings:
      // 1 = MEDIA_ERR_ABORTED
      // 2 = MEDIA_ERR_NETWORK (CORS, network, 403, 404, etc.)
      // 3 = MEDIA_ERR_DECODE
      // 4 = MEDIA_ERR_SRC_NOT_SUPPORTED

      // Error code 2 = NETWORK_ERROR, 3 = DECODE_ERROR, 4 = SRC_NOT_SUPPORTED
      if (error.code >= 2) {
        // Show fallback but keep trying video
        showFallback();
        // Retry loading video after delay
        setTimeout(() => {
          heroVideo.load();
          setTimeout(() => playVideo(0), 500);
        }, 3000);
      }
    }
  });

  // Check for stalled loading
  heroVideo.addEventListener("stalled", () => {
    checkVideoLoaded();
  });

  // Check for abort
  heroVideo.addEventListener("abort", () => {
    showFallback();
  });

  // Monitor loading progress
  heroVideo.addEventListener("loadstart", () => {
    checkVideoLoaded();
  });

  heroVideo.addEventListener("progress", () => {
    clearTimeout(videoLoadTimeout);
    if (heroVideo.readyState >= 2) {
      videoLoaded = true;
    }
  });

  // Check when video metadata is loaded
  heroVideo.addEventListener("loadedmetadata", () => {
    clearTimeout(videoLoadTimeout);
    videoLoaded = true;
    attemptPlayAfterLoad();
  });

  // Check when video can play through
  heroVideo.addEventListener("canplaythrough", () => {
    clearTimeout(videoLoadTimeout);
    videoLoaded = true;
    attemptPlayAfterLoad();
  });

  // Additional check: if video readyState is 4 (HAVE_ENOUGH_DATA), it's fully loaded
  heroVideo.addEventListener("loadeddata", () => {
    if (heroVideo.readyState >= 4) {
      videoLoaded = true;
      clearTimeout(videoLoadTimeout);
    }
  });

  // Play when video starts
  heroVideo.addEventListener("playing", () => {
    videoLoaded = true;
    clearTimeout(videoLoadTimeout);
  });

  // Initial check
  checkVideoLoaded();

  // Enhanced user interaction handling (critical for Safari)
  const handleUserInteraction = () => {
    if (heroVideo.paused) {
      playVideo();
    }
  };

  // Add multiple interaction events for Safari
  const interactionEvents = [
    "click",
    "touchstart",
    "touchend",
    "scroll",
    "mousemove",
    "keydown",
  ];
  interactionEvents.forEach((event) => {
    document.addEventListener(event, handleUserInteraction, {
      once: false,
      passive: true,
    });
  });

  // Ensure video loops continuously
  heroVideo.addEventListener("ended", () => {
    heroVideo.currentTime = 0;
    heroVideo.play().catch(() => {});
  });

  // Safari: Force play on first user interaction anywhere on page
  const firstInteraction = () => {
    if (!playAttempted || heroVideo.paused) {
      playVideo();
      // Remove listeners after first successful play
      interactionEvents.forEach((event) => {
        document.removeEventListener(event, firstInteraction, {
          passive: true,
        });
      });
    }
  };

  // Add first interaction listeners
  interactionEvents.forEach((event) => {
    document.addEventListener(event, firstInteraction, {
      once: true,
      passive: true,
    });
  });
}

// ===========================
// Performance Optimization
// ===========================
// Debounce scroll events
let scrollTimeout;
window.addEventListener(
  "scroll",
  () => {
    if (scrollTimeout) {
      window.cancelAnimationFrame(scrollTimeout);
    }
    scrollTimeout = window.requestAnimationFrame(() => {
      // Scroll-based animations here
    });
  },
  { passive: true }
);
