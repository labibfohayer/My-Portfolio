# Labib Fohayer - Developer Portfolio and Digital Showcase

A modern, high-performance personal portfolio website showcasing web applications, workflow automation engines, and interactive web experiences engineered by Labib Fohayer. Deployed via GitHub Pages at [labibfohayer.github.io](https://labibfohayer.github.io).

---

## Project Overview

This repository hosts the static export and production assets for Labib Fohayer's official developer portfolio. The platform highlights real-world commercial applications, AI-driven automation systems, and bespoke web interfaces. It combines precision editorial typography with hardware-accelerated motion choreography to deliver a responsive, accessible, and fast-loading web experience across all modern desktop and mobile browsers.

---

## Key Features

- Dynamic Project Showcase: Curated case studies featuring interactive hover previews, technical specifications, and production links for commercial applications such as NAWABIYAAT, AMMS, BD Mess, Coffee Peyala, and Webpulse Automation.
- Hardware-Accelerated Animation Pipeline: Fluid micro-interactions, split-text typography animations, and scroll-linked timeline sequences powered by GSAP and ScrollTrigger.
- Inertial Smooth Scrolling: Integrated Lenis smooth scroll engine providing unified scroll kinematics across touchpads, mice, and mobile touch surfaces.
- Modular Routing Architecture: Fully static pre-rendered routes including Home (`/`), About Me (`/about-me`), Projects (`/projects`), Work History (`/work`), Personal Interests (`/off-the-clock`), and Resume (`/resume`).
- Integrated Resume Viewer: Fast client-side resume viewing and direct PDF download pipeline (`Labib_Fohayer_Resume.pdf`).
- Optimized Static Delivery: Zero-runtime server overhead utilizing optimized static bundles, WebP/SVG vector assets, and `.nojekyll` bypass configuration for GitHub Pages CDN distribution.

---

## Tech Stack

- Core Framework: Next.js (Static Export / SSG), React
- Motion and Animation: GSAP 3, ScrollTrigger, SplitText, DrawSVGPlugin, MotionPathPlugin, Lenis Smooth Scroll
- Styling: Tailwind CSS, Custom Utility CSS, CSS Keyframe Animations
- Media and Assets: Scalable Vector Graphics (SVG), WebP image compression, MP4 video preview clips
- Infrastructure: GitHub Pages, GitHub Actions CI/CD pipeline

---

## Directory Structure

```
labibfohayer.github.io/
├── .nojekyll                  # GitHub Pages Jekyll bypass flag
├── 404.html                   # Static fallback error page
├── index.html                 # Main landing page
├── about-me.html              # Professional background and biography
├── projects.html              # Comprehensive project index
├── work.html                  # Work history and professional experience
├── off-the-clock.html         # Personal interests and creative projects
├── resume.html                # Online resume viewer page
├── Labib_Fohayer_Resume.pdf   # Downloadable technical CV
├── _next/                     # Pre-rendered Next.js static chunks and assets
├── cdn-assets/                # Project media, video loops, and case study posters
├── images/                    # Profile portraits, client references, and icons
├── js/                        # Vendor libraries (GSAP, Lenis, Webflow bundles)
├── media/                     # Embedded video reels and visual demonstrations
├── projects/                  # Project static thumbnails and hover states
└── svgs/                      # Vector UI icons and decorative background patterns
```

---

## Installation and Setup Guide

To inspect or serve the static build locally on your development machine:

### 1. Clone the Repository
```bash
git clone https://github.com/labibfohayer/labibfohayer.github.io.git
cd labibfohayer.github.io
```

### 2. Run a Local Static HTTP Server
Using Python:
```bash
python3 -m http.server 8000
```
Or using Node.js `serve` / `npx`:
```bash
npx serve . -p 8000
```

### 3. Open in Browser
Navigate to `http://localhost:8000` to review pages, asset loading, and animation timelines.

---

## Deployment Workflow

The repository is configured for automated hosting on GitHub Pages:
1. Production builds are generated via static export (`next export` / `output: 'export'`).
2. Build artifacts are committed directly to the `main` branch.
3. The `.nojekyll` file ensures that GitHub Pages does not filter directories starting with underscores (such as `_next`).
4. Updates pushed to the `main` branch deploy globally across GitHub Pages CDN edges within minutes.

---

## Author & Contact

Developed and maintained by **Labib Fohayer**.

- Portfolio: [https://labibfohayer.github.io](https://labibfohayer.github.io)
- GitHub: [https://github.com/labibfohayer](https://github.com/labibfohayer)
- LinkedIn: [https://linkedin.com/in/labib-fohayer](https://linkedin.com/in/labib-fohayer)
- Email: Contact available via portfolio contact portal

---

## License

Copyright (c) 2026 Labib Fohayer. All source code and intellectual assets are reserved. Open for technical inspection and code reference.
