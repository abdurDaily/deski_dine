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

const getCurrentPageFile = () => {
  const pathname = window.location.pathname;
  const file = pathname.substring(pathname.lastIndexOf("/") + 1);
  return file || "index.html";
};

const syncSharedNavigationAndFooter = () => {
  const currentPage = getCurrentPageFile();
  const isHomePage = currentPage === "index.html";
  const menuPages = [
    "menu.html",
    "complete-menu.html",
    "cart.html",
    "checkout.html",
  ];

  const activeKey = isHomePage
    ? "home"
    : currentPage === "privilege-card.html"
      ? "privilege"
      : menuPages.includes(currentPage)
        ? "menu"
        : "";

  const navItems = [
    {
      key: "home",
      label: "Home",
      homeHref: "#home",
      otherHref: "index.html#home",
    },
    {
      key: "menu",
      label: "Menu",
      homeHref: "menu.html",
      otherHref: "menu.html",
    },
    {
      key: "privilege",
      label: "Privilege Card",
      homeHref: "privilege-card.html",
      otherHref: "privilege-card.html",
    },
    {
      key: "reviews",
      label: "Reviews",
      homeHref: "#testimonials",
      otherHref: "index.html#testimonials",
    },
    {
      key: "about",
      label: "About",
      homeHref: "#about",
      otherHref: "index.html#about",
    },
  ];

  const quickLinks = [
    {
      label: "Home",
      homeHref: "#home",
      otherHref: "index.html#home",
    },
    {
      label: "About Us",
      homeHref: "#about",
      otherHref: "index.html#about",
    },
    {
      label: "Menu",
      homeHref: "menu.html",
      otherHref: "menu.html",
    },
    {
      label: "Privilege Card",
      homeHref: "privilege-card.html",
      otherHref: "privilege-card.html",
    },
    {
      label: "Video",
      homeHref: "#video",
      otherHref: "index.html#video",
    },
    {
      label: "Reviews",
      homeHref: "#testimonials",
      otherHref: "index.html#testimonials",
    },
    {
      label: "Location",
      homeHref: "#location",
      otherHref: "index.html#location",
    },
  ];

  const desktopNav = document.querySelector(".desktop-nav");
  if (desktopNav) {
    desktopNav.innerHTML = navItems
      .map((item) => {
        const href = isHomePage ? item.homeHref : item.otherHref;
        const activeClass = item.key === activeKey ? " active" : "";
        return `<li class="nav-item"><a class="nav-link${activeClass}" href="${href}">${item.label}</a></li>`;
      })
      .join("");
  }

  const sideNav = document.querySelector("#mobileMenu .side-nav");
  if (sideNav) {
    sideNav.innerHTML = navItems
      .map((item) => {
        const href = isHomePage ? item.homeHref : item.otherHref;
        return `<li class="nav-item"><a data-bs-dismiss="offcanvas" class="nav-link" href="${href}">${item.label}</a></li>`;
      })
      .join("");
  }

  const quickLinksHeading = Array.from(
    document.querySelectorAll(".footer-heading"),
  ).find(
    (heading) => heading.textContent.trim().toLowerCase() === "quick links",
  );

  const quickLinksList = quickLinksHeading?.nextElementSibling;
  if (quickLinksList?.classList.contains("footer-links")) {
    quickLinksList.innerHTML = quickLinks
      .map((item) => {
        const href = isHomePage ? item.homeHref : item.otherHref;
        return `<li><a href="${href}">${item.label}</a></li>`;
      })
      .join("");
  }
};

const setupPrivilegeCardForm = () => {
  const form = document.getElementById("privilegeCardForm");
  if (!form) {
    return;
  }

  const fields = {
    name: document.getElementById("applicantName"),
    email: document.getElementById("applicantEmail"),
    phone: document.getElementById("applicantPhone"),
  };

  const submitBtn = document.getElementById("privilegeSubmitBtn");
  const liveStatus = document.getElementById("privilegeLiveStatus");
  const thanksBox = document.getElementById("privilegeThanks");

  if (
    !fields.name ||
    !fields.email ||
    !fields.phone ||
    !submitBtn ||
    !thanksBox
  ) {
    return;
  }

  const getFieldNote = (fieldId) =>
    form.querySelector(`[data-note-for="${fieldId}"]`);

  const getValidationState = (field) => {
    const value = field.value.trim();

    if (field.id === "applicantName") {
      const isValid = value.length >= 3;
      return {
        isValid,
        message: isValid
          ? "Looks good."
          : "Please enter at least 3 characters.",
      };
    }

    if (field.id === "applicantEmail") {
      const isValid = field.checkValidity() && value.length > 0;
      return {
        isValid,
        message: isValid ? "Email is valid." : "Enter a valid email address.",
      };
    }

    if (field.id === "applicantPhone") {
      const digits = value.replace(/\D/g, "");
      const isValid = digits.length >= 10 && digits.length <= 14;
      return {
        isValid,
        message: isValid
          ? "Phone number is valid."
          : "Phone must contain 10 to 14 digits.",
      };
    }

    return { isValid: false, message: "This field is required." };
  };

  const updateFieldState = (field) => {
    const value = field.value.trim();
    const note = getFieldNote(field.id);

    if (!value) {
      field.classList.remove("is-valid", "is-invalid");
      if (note) {
        note.textContent = "Required";
        note.classList.remove("is-valid");
      }
      return false;
    }

    const { isValid, message } = getValidationState(field);
    field.classList.toggle("is-valid", isValid);
    field.classList.toggle("is-invalid", !isValid);

    if (note) {
      note.textContent = message;
      note.classList.toggle("is-valid", isValid);
      note.classList.toggle("is-invalid", !isValid);
    }

    return isValid;
  };

  const updateFormState = () => {
    const fieldList = [fields.name, fields.email, fields.phone];
    const validCount = fieldList.filter((field) =>
      updateFieldState(field),
    ).length;
    const allValid = validCount === fieldList.length;

    submitBtn.disabled = !allValid;
    if (liveStatus) {
      liveStatus.textContent = allValid
        ? "Everything looks good. You can submit now."
        : `Complete ${validCount} of ${fieldList.length} fields correctly.`;
    }

    return allValid;
  };

  [fields.name, fields.email, fields.phone].forEach((field) => {
    field.addEventListener("input", updateFormState);
    field.addEventListener("blur", updateFormState);
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!updateFormState()) {
      const firstInvalid = [fields.name, fields.email, fields.phone].find(
        (field) => !field.classList.contains("is-valid"),
      );
      firstInvalid?.focus();
      return;
    }

    submitBtn.classList.add("is-loading");
    submitBtn.disabled = true;

    window.setTimeout(() => {
      const applicantName = fields.name.value.trim();
      form.classList.add("d-none");
      if (liveStatus) {
        liveStatus.classList.add("d-none");
      }
      thanksBox.innerHTML = `<i class="bi bi-patch-check-fill me-2"></i>Thank you, ${applicantName}! Your privilege card application has been received.`;
      thanksBox.classList.remove("d-none");
      submitBtn.classList.remove("is-loading");
    }, 650);
  });

  updateFormState();
};

syncSharedNavigationAndFooter();

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
setupPrivilegeCardForm();

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

/* ==========================================================================
   05. HOUSE SIGNATURES & MAIN MENU SLIDER (FIXED INITIALIZATION)
   ========================================================================== */
$(function () {
  // Target the main slider shell instead of a nested track selector
  const $menuSlider = $("#menuSlider");
  if (!$menuSlider.length) return;

  // Find the slider viewport container holding the slide items directly
  const $sliderViewport = $menuSlider.find(".menu-slider-track");

  $sliderViewport.slick({
    slidesToShow: 4,
    slidesToScroll: 1,
    arrows: true,
    dots: false, // FIXED: Enabled dots so our custom CSS metric bars render properly
    infinite: true,
    autoplay: true,
    autoplaySpeed: 2600,
    pauseOnHover: true,
    pauseOnFocus: true,
    speed: 420,
    swipe: true,
    touchThreshold: 10,
    prevArrow: $menuSlider.find(".menu-slider-prev"), // Clean contextual selectors
    nextArrow: $menuSlider.find(".menu-slider-next"),
    appendDots: $menuSlider.find(".menu-slider-dots"),
    customPaging: function (slider, i) {
      // Formats slick dots into clean custom markup matching our CSS .menu-dot class
      return '<button class="menu-dot" aria-label="Go to slide ' + (i + 1) + '"></button>';
    },
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1
        }
      },
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          arrows: false,
          dots: true // Keeps the sleek custom dash bars active on mobile touch screens
        }
      },
      {
        breakpoint: 576,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          arrows: false,
          dots: true,
          centerMode: true,
          centerPadding: "20px" // Adjusted slightly for perfect geometric card balance
        }
      }
    ]
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

// review
$('.reviews-slider').slick({
  centerMode: true,
  centerPadding: '0px',
  slidesToShow: 3,
  infinite: true,
  speed: 900, // Slightly slower for a more "expensive" feel
  // This curve provides a very smooth, soft deceleration
  cssEase: 'cubic-bezier(0.23, 1, 0.32, 1)',
  autoplay: true,
  autoplaySpeed: 4000,
  dots: true,
  arrows: false,
  useTransform: true, // Forces GPU acceleration
  responsive: [
    {
      breakpoint: 768,
      settings: {
        slidesToShow: 1,
        centerMode: true,
        centerPadding: '20px'
      }
    }
  ]
});