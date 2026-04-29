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

/* ── Menu Slider — Slick Carousel ─────────────────────────── */
$(function () {
  const $menuTrack = $("#menuSlider .menu-slider-track");
  if (!$menuTrack.length) return;

  $menuTrack.slick({
    slidesToShow: 4,
    slidesToScroll: 1,
    arrows: true,
    dots: false,
    infinite: false,
    autoplay: true,
    autoplaySpeed: 2600,
    pauseOnHover: true,
    pauseOnFocus: true,
    speed: 420,
    swipe: true,
    touchThreshold: 10,
    prevArrow: "#menuSlider .menu-slider-prev",
    nextArrow: "#menuSlider .menu-slider-next",
    appendDots: "#menuSlider .menu-slider-dots",
    dotsClass: "slick-dots",
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
      // You can unslick at a given breakpoint now by adding:
      // settings: "unslick"
      // instead of a settings object
    ],
  });
});

/* ── Reels Slider — Slick Carousel ────────────────────────── */
$(function () {
  $("#reelsSlider").slick({
    slidesToShow: 3,
    slidesToScroll: 1,
    dots: false,
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

/* ── Floating Action Buttons: Scroll-to-top + WhatsApp ───── */
(function () {
  const scrollBtn = document.getElementById("scrollTopBtn");
  const whatsappBtn = document.getElementById("whatsappBtn");
  const visibleClass = "is-visible";
  if (!scrollBtn || !whatsappBtn) return;

  function updateFabVisibility() {
    const shouldShow = window.scrollY > 200;
    // Only toggle the scroll-to-top button. WhatsApp should remain visible by default.
    scrollBtn.classList.toggle(visibleClass, shouldShow);
  }

  // Smooth scroll to top when clicked
  scrollBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    // brief feedback
    scrollBtn.animate(
      [
        { transform: "translateY(0) scale(1)" },
        { transform: "translateY(-6px) scale(1.02)" },
        { transform: "translateY(0) scale(1)" },
      ],
      { duration: 320, easing: "ease-out" },
    );
  });

  // Small attention animation for WhatsApp button on click
  whatsappBtn.addEventListener("click", () => {
    whatsappBtn.animate(
      [
        { transform: "scale(1)" },
        { transform: "scale(0.96)" },
        { transform: "scale(1)" },
      ],
      { duration: 260, easing: "ease-in-out" },
    );
  });

  // Update visibility on load and scroll
  updateFabVisibility();
  window.addEventListener("scroll", updateFabVisibility, { passive: true });
})();
