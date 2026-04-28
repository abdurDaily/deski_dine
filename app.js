const revealItems = document.querySelectorAll(
  ".reveal, .reveal-left, .reveal-right, .reveal-scale, .reveal-fade",
);

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      entry.target.classList.toggle("visible", entry.isIntersecting);
    });
  },
  { threshold: 0.16 },
);

revealItems.forEach((item) => observer.observe(item));

const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll(
  ".side-nav .nav-link, .offcanvas .nav-link, .desktop-nav .nav-link",
);
const desktopNavbar = document.querySelector("#desktopNavbar");
const mobileMenuToggle = document.querySelector("#mobileMenuToggle");
const mobileMenu = document.querySelector("#mobileMenu");
const mobileMenuLinks = document.querySelectorAll(
  "#mobileMenu .nav-link[href^='#']",
);
let mobileOffcanvas = null;

if (mobileMenuToggle && mobileMenu && window.bootstrap?.Offcanvas) {
  mobileOffcanvas = bootstrap.Offcanvas.getOrCreateInstance(mobileMenu);
  mobileMenuToggle.addEventListener("click", () => {
    mobileOffcanvas.toggle();
  });
}

mobileMenuLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    const href = link.getAttribute("href");
    if (!href || !href.startsWith("#")) {
      return;
    }

    const target = document.querySelector(href);
    if (!target) {
      return;
    }

    event.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
    if (mobileOffcanvas) {
      mobileOffcanvas.hide();
    }
    window.history.replaceState(null, "", href);
  });
});

const syncNavbarState = () => {
  if (desktopNavbar) {
    desktopNavbar.classList.toggle("is-scrolled", window.scrollY > 24);
  }
};

window.addEventListener("scroll", () => {
  syncNavbarState();

  const current = Array.from(sections).find((section) => {
    const top = section.offsetTop - 120;
    const bottom = top + section.offsetHeight;
    return window.scrollY >= top && window.scrollY < bottom;
  });

  if (!current) {
    return;
  }

  navLinks.forEach((link) => {
    const href = link.getAttribute("href");
    link.classList.toggle("active", href === `#${current.id}`);
  });
});

syncNavbarState();

/* ── Menu Slider (3 visible, scroll 1 at a time) ────────── */
(function () {
  const slider = document.querySelector("#menuSlider");
  if (!slider) return;

  const viewport = slider.querySelector(".menu-slider-viewport");
  const track = slider.querySelector(".menu-slider-track");
  const items = slider.querySelectorAll(".menu-slide-item");
  const prevBtn = slider.querySelector(".menu-slider-prev");
  const nextBtn = slider.querySelector(".menu-slider-next");
  const dotsEl = slider.querySelector(".menu-slider-dots");
  const swipeThreshold = 42;
  let currentIndex = 0;
  let touchStartX = 0;
  let touchCurrentX = 0;
  let touchActive = false;

  function getVisible() {
    if (window.innerWidth >= 992) return 3;
    if (window.innerWidth >= 576) return 2;
    return 1;
  }

  function getMax() {
    return Math.max(0, items.length - getVisible());
  }

  function buildDots() {
    dotsEl.innerHTML = "";
    const count = getMax() + 1;
    for (let i = 0; i < count; i++) {
      const btn = document.createElement("button");
      btn.className = "menu-dot" + (i === currentIndex ? " active" : "");
      btn.setAttribute("aria-label", "Go to slide " + (i + 1));
      btn.addEventListener("click", () => goTo(i));
      dotsEl.appendChild(btn);
    }
  }

  function syncDots() {
    dotsEl.querySelectorAll(".menu-dot").forEach((dot, i) => {
      dot.classList.toggle("active", i === currentIndex);
    });
  }

  function goTo(index) {
    currentIndex = Math.max(0, Math.min(index, getMax()));
    const cardWidth = viewport.offsetWidth / getVisible();
    track.style.transform = "translateX(-" + currentIndex * cardWidth + "px)";
    syncDots();
    if (prevBtn) {
      prevBtn.disabled = currentIndex === 0;
    }
    if (nextBtn) {
      nextBtn.disabled = currentIndex >= getMax();
    }
  }

  if (prevBtn) {
    prevBtn.addEventListener("click", () => goTo(currentIndex - 1));
  }
  if (nextBtn) {
    nextBtn.addEventListener("click", () => goTo(currentIndex + 1));
  }

  function handleSwipeEnd() {
    const deltaX = touchCurrentX - touchStartX;
    if (Math.abs(deltaX) < swipeThreshold) {
      return;
    }

    if (deltaX < 0) {
      goTo(currentIndex + 1);
    } else {
      goTo(currentIndex - 1);
    }
  }

  viewport.addEventListener(
    "touchstart",
    (event) => {
      if (event.touches.length !== 1) {
        return;
      }
      touchStartX = event.touches[0].clientX;
      touchCurrentX = touchStartX;
      touchActive = true;
    },
    { passive: true },
  );

  viewport.addEventListener(
    "touchmove",
    (event) => {
      if (!touchActive || event.touches.length !== 1) {
        return;
      }
      touchCurrentX = event.touches[0].clientX;
    },
    { passive: true },
  );

  viewport.addEventListener("touchend", () => {
    if (!touchActive) {
      return;
    }
    handleSwipeEnd();
    touchActive = false;
  });

  viewport.addEventListener("touchcancel", () => {
    touchActive = false;
  });

  window.addEventListener("resize", () => {
    if (currentIndex > getMax()) currentIndex = getMax();
    buildDots();
    goTo(currentIndex);
  });

  buildDots();
  goTo(0);
})();

/* ── Reels Slider — Slick Carousel ────────────────────────── */
$(function () {
  $("#reelsSlider").slick({
    slidesToShow: 3,
    slidesToScroll: 1,
    dots: true,
    arrows: true,
    infinite: true,
    speed: 420,
    swipe: true,
    touchThreshold: 10,
    prevArrow:
      '<button class="slick-prev reels-slick-prev" aria-label="Previous reel">' +
      '<span class="menu-control-icon"><i class="bi bi-chevron-left"></i></span>' +
      "</button>",
    nextArrow:
      '<button class="slick-next reels-slick-next" aria-label="Next reel">' +
      '<span class="menu-control-icon"><i class="bi bi-chevron-right"></i></span>' +
      "</button>",
    responsive: [
      {
        breakpoint: 1200,
        settings: { slidesToShow: 2 },
      },
      {
        breakpoint: 768,
        settings: { slidesToShow: 1, arrows: false },
      },
    ],
  });
});
