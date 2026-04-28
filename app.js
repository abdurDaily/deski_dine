const revealItems = document.querySelectorAll(
  ".reveal, .reveal-left, .reveal-right, .reveal-scale, .reveal-fade",
);

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
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
  let currentIndex = 0;

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
    prevBtn.disabled = currentIndex === 0;
    nextBtn.disabled = currentIndex >= getMax();
  }

  prevBtn.addEventListener("click", () => goTo(currentIndex - 1));
  nextBtn.addEventListener("click", () => goTo(currentIndex + 1));

  window.addEventListener("resize", () => {
    if (currentIndex > getMax()) currentIndex = getMax();
    buildDots();
    goTo(currentIndex);
  });

  buildDots();
  goTo(0);
})();
