# DESKI DINE 

A fully responsive, single-page restaurant website built with **Bootstrap 5**, **vanilla JavaScript**, and custom CSS. Designed with a formal warm color palette and smooth scroll-reveal animations throughout.

---

## Live Preview

Open `index.html` directly in your browser — no build step or server required.

---

## Project Structure

```
new/
├── index.html       # Main single-page site
├── styles.css       # All custom styles
├── app.js           # Scroll animations, navbar, mobile menu, menu slider
└── images/
    └── logo.webp    # Restaurant logo
```

---

## Sections

| Section        | ID              | Description                                                          |
| -------------- | --------------- | -------------------------------------------------------------------- |
| Hero           | `#home`         | Full-screen background video with overlay, headline, and CTA buttons |
| About          | `#about`        | Restaurant story, feature highlights, and about image                |
| Signature Menu | `#menu`         | 3-visible card slider (scrolls 1 at a time)                          |
| Experience     | `#experience`   | Private Dining, Chef's Table, Live Piano features                    |
| Guest Reviews  | `#testimonials` | Three review cards with star ratings and featured center card        |
| Reservation    | `#reservation`  | Two-panel booking form with contact details                          |
| Location       | `#location`     | Embedded Google Maps iframe                                          |
| Footer         | `#contact`      | Logo, links, contact info, newsletter signup                         |

---

## Tech Stack

| Technology                                         | Version | Purpose                                 |
| -------------------------------------------------- | ------- | --------------------------------------- |
| [Bootstrap](https://getbootstrap.com/)             | 5.3.3   | Layout, grid, utilities, offcanvas      |
| [Bootstrap Icons](https://icons.getbootstrap.com/) | 1.11.3  | UI icons                                |
| [Iconify](https://iconify.design/)                 | 1.0.8   | Mobile hamburger menu icon              |
| [Google Fonts](https://fonts.google.com/)          | —       | Fraunces (headings) + Manrope (body)    |
| Vanilla JS                                         | ES6+    | Animations, slider, navbar, mobile menu |

---

## Features

- **Responsive design** — Mobile-first, tested across all breakpoints
- **Animated sticky navbar** — Transparent on top, glassy blur on scroll (desktop only)
- **Mobile sidebar** — Bootstrap Offcanvas with smooth close on link click
- **Hero video** — Autoplay, muted, looping background video with overlay
- **Custom menu slider** — 3 cards visible, scrolls 1 at a time, dot indicators
- **Scroll reveal animations** — 5 variants: fade-up, slide-left, slide-right, scale, fade — re-animate every scroll pass
- **Reviews section** — Featured center card with maroon gradient
- **Reservation form** — Two-panel layout with brand-color styling
- **Google Maps embed** — Full-width iframe with rounded corners
- **Rich footer** — Logo, social links, quick links, contact info, newsletter form

---

## Color Palette

| Variable       | Value     | Usage                            |
| -------------- | --------- | -------------------------------- |
| `--brand`      | `#ef8b1f` | Orange — primary brand accent    |
| `--brand-gold` | `#f0ac23` | Gold — highlights, hover, stars  |
| `--brand-dark` | `#7f2430` | Maroon — headings, dark panels   |
| `--brand-red`  | `#d63a2f` | Red — accents                    |
| `--bg-main`    | `#fbf7f0` | Warm cream page background       |
| `--bg-accent`  | `#f6e7d0` | Amber tint — section backgrounds |
| `--text-main`  | `#341820` | Dark maroon text                 |
| `--text-muted` | `#7b4a4f` | Muted body text                  |

---

## Fonts

- **Fraunces** — Serif, used for all headings and display text
- **Manrope** — Sans-serif, used for body text, navigation, and UI elements

---

## Getting Started

1. Clone or download this repository
2. Place your logo at `images/logo.webp`
3. Open `index.html` in any modern browser

No npm, no bundler, no dependencies to install.

---

## Customization

- **Colors** — Edit CSS variables at the top of `styles.css` under `:root`
- **Content** — All text and images are inline in `index.html`
- **Map** — Replace the `src` attribute of the `<iframe>` in the Location section with your own Google Maps embed URL
- **Hero video** — Replace the `<source>` URLs inside the `<video>` tag in the Hero section

---

## Browser Support

Works in all modern browsers (Chrome, Firefox, Safari, Edge). Requires JavaScript enabled for animations and mobile menu.
