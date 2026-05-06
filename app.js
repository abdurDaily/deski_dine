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
const mobileMenuLinks = document.querySelectorAll("#mobileMenu .nav-link");
let mobileOffcanvas = null;

if (mobileMenuToggle && mobileMenu && window.bootstrap?.Offcanvas) {
  mobileOffcanvas = bootstrap.Offcanvas.getOrCreateInstance(mobileMenu);
  mobileMenuToggle.addEventListener("click", () => {
    mobileOffcanvas.toggle();
  });
}

const getNavbarOffset = () => {
  const mobileTopbar = document.querySelector(".mobile-topbar");
  const activeNavbar =
    window.innerWidth < 992
      ? mobileTopbar
      : document.querySelector("#desktopNavbar");
  const navHeight = activeNavbar ? activeNavbar.offsetHeight : 0;
  return navHeight + 12;
};

mobileMenuLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    const href = link.getAttribute("href");
    if (!href || href === "#") {
      return;
    }

    const linkUrl = new URL(href, window.location.href);
    const isSamePage =
      linkUrl.origin === window.location.origin &&
      linkUrl.pathname === window.location.pathname;

    if (isSamePage && linkUrl.hash) {
      const target = document.querySelector(linkUrl.hash);
      if (!target) {
        return;
      }

      event.preventDefault();
      const top =
        target.getBoundingClientRect().top + window.scrollY - getNavbarOffset();
      window.scrollTo({ top: Math.max(top, 0), behavior: "smooth" });
      if (mobileOffcanvas) {
        mobileOffcanvas.hide();
      }
      window.history.replaceState(null, "", linkUrl.hash);
      return;
    }

    event.preventDefault();
    if (mobileOffcanvas) {
      mobileOffcanvas.hide();
      window.setTimeout(() => {
        window.location.assign(linkUrl.href);
      }, 220);
      return;
    }

    window.location.assign(linkUrl.href);
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

/* ── Featured Dishes Card Slider ──────────────────────────── */
$(function () {
  const $mcSlider = $("#mcSlider");
  if (!$mcSlider.length) return;

  $mcSlider.slick({
    slidesToShow: 4,
    slidesToScroll: 1,
    arrows: true,
    dots: false,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: true,
    pauseOnFocus: true,
    speed: 420,
    swipe: true,
    touchThreshold: 10,
    prevArrow: ".mc-nav-prev",
    nextArrow: ".mc-nav-next",
    responsive: [
      {
        breakpoint: 1200,
        settings: { slidesToShow: 3, slidesToScroll: 1 },
      },
      {
        breakpoint: 992,
        settings: { slidesToShow: 2, slidesToScroll: 1 },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          arrows: false,
          dots: true,
        },
      },
      {
        breakpoint: 576,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          arrows: false,
          dots: false,
          centerMode: true,
          centerPadding: "16px",
        },
      },
    ],
  });
});

/* ── Featured Dishes Quick View Modal ─────────────────────── */
(function () {
  const modalEl = document.getElementById("mcQuickViewModal");

  if (!modalEl || !window.bootstrap?.Modal) {
    return;
  }

  const modal = bootstrap.Modal.getOrCreateInstance(modalEl);
  const modalImage = document.getElementById("mcQuickViewImage");
  const modalBadge = document.getElementById("mcQuickViewBadge");
  const modalTitle = document.getElementById("mcQuickViewTitle");
  const modalDesc = document.getElementById("mcQuickViewDesc");
  const modalServe = document.getElementById("mcQuickViewServe");
  const modalPrice = document.getElementById("mcQuickViewPrice");

  const openQuickView = (card) => {
    const img = card.querySelector(".mc-img");
    const badge = card.querySelector(".mc-badge");
    const title = card.querySelector(".mc-title");
    const desc = card.querySelector(".mc-desc");
    const serve = card.querySelector(".mc-serve-info");
    const price = card.querySelector(".mc-price");

    if (!img || !badge || !title || !desc || !serve || !price) {
      return;
    }

    modalImage.src = img.getAttribute("src") || "";
    modalImage.alt =
      img.getAttribute("alt") || title.textContent?.trim() || "Dish preview";
    modalBadge.textContent = badge.textContent?.trim() || "Dish";
    modalBadge.classList.toggle(
      "mc-badge--gold",
      badge.classList.contains("mc-badge--gold"),
    );
    modalTitle.textContent = title.textContent?.trim() || "";
    modalDesc.textContent = desc.textContent?.trim() || "";
    modalServe.innerHTML = serve.innerHTML;
    modalPrice.textContent = price.textContent?.trim() || "";

    modal.show();
  };

  document.addEventListener("click", (event) => {
    const card = event.target.closest(".mc-card-trigger");
    if (!card) {
      return;
    }

    // Ignore drag-end clicks from Slick while the slider is being swiped.
    if (card.closest(".slick-slider")?.querySelector(".slick-list.dragging")) {
      return;
    }

    openQuickView(card);
  });

  document.addEventListener("keydown", (event) => {
    const card = event.target.closest(".mc-card-trigger");
    if (!card) {
      return;
    }

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openQuickView(card);
    }
  });
})();

/* ── Menu Slider — Slick Carousel ─────────────────────────── */
$(function () {
  const $menuTrack = $("#menuSlider .menu-slider-track");
  if (!$menuTrack.length) return;

  $menuTrack.slick({
    slidesToShow: 4,
    slidesToScroll: 1,
    arrows: true,
    dots: false,
    infinite: true,
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
        breakpoint: 1200,
        settings: { slidesToShow: 3, slidesToScroll: 1 },
      },
      {
        breakpoint: 992,
        settings: { slidesToShow: 2, slidesToScroll: 1 },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          arrows: false,
          dots: false,
        },
      },
      {
        breakpoint: 576,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          arrows: false,
          dots: false,
          centerMode: true,
          centerPadding: "16px",
        },
      },
    ],
  });
});

/* ── Reels Slider — Slick Carousel ────────────────────────── */
$(function () {
  $("#reelsSlider").slick({
    slidesToShow: 4,
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
        settings: { slidesToShow: 2, dots: false },
      },
      {
        breakpoint: 992,
        settings: { slidesToShow: 2, arrows: false, dots: false },
      },
      {
        breakpoint: 768,
        settings: { slidesToShow: 1, arrows: false, dots: false },
      },
      {
        breakpoint: 576,
        settings: {
          slidesToShow: 1,
          arrows: false,
          dots: false,
          centerMode: true,
          centerPadding: "14px",
        },
      },
    ],
  });
});

/* ── Floating Action Button: WhatsApp ────────────────────── */
(function () {
  const whatsappBtn = document.getElementById("whatsappBtn");
  if (!whatsappBtn) return;

  // Click feedback animation.
  whatsappBtn.addEventListener("click", () => {
    whatsappBtn.animate(
      [
        { transform: "translateY(0) scale(1)" },
        { transform: "translateY(-2px) scale(0.95)" },
        { transform: "translateY(0) scale(1.05)" },
        { transform: "translateY(0) scale(1)" },
      ],
      { duration: 320, easing: "cubic-bezier(0.34, 1.56, 0.64, 1)" },
    );
  });

  // Periodic nudge to draw attention without being distracting.
  setInterval(() => {
    whatsappBtn.classList.add("is-nudging");
    setTimeout(() => whatsappBtn.classList.remove("is-nudging"), 700);
  }, 7000);
})();
