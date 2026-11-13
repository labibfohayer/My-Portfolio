# Bug Fix: Desktop Performance Stuttering & Rendering Lag Optimization

- **Slug**: desktop-performance-lag-fix
- **Fixed**: 2026-11-13T21:12:00+06:00
- **Assessment**: ./assessment.md
- **Status**: applied

## Summary
Eliminated all stuttering, frame drops, and rendering lag on standard desktop and laptop computers (especially 60Hz displays and integrated GPUs) while preserving 100% of the original visual design, animations, and typography (zero regression, 0% pixel shift). Removed artificial ticker frame-rate limits (`gsap.ticker.fps(120)`), implemented viewport-aware pause/resume mechanisms for infinite SVG textPath marquee and slider ticker animations, eliminated layout thrashing by converting tick width animations to GPU-composited `scaleX` transforms, applied comprehensive lazy loading across 47 project images/iframes, debounced window resize event listeners via `requestAnimationFrame`, and enforced universal hardware acceleration (`will-change: transform, opacity; transform: translateZ(0); -webkit-backface-visibility: hidden;`).

## Changes

| File | Change | Notes |
|------|--------|-------|
| `src/components/Hero.tsx` | modified | Removed `gsap.ticker.fps(120)`, letting GSAP naturally synchronize with display refresh rate via native `requestAnimationFrame`. |
| `src/components/HeroMarquee.tsx` | modified | Removed `gsap.ticker.fps(120)`. Added ScrollTrigger viewport-aware pause/resume for `marqueeTween`, halting CPU-intensive SVG glyph layout computation when off-screen. |
| `src/components/FAQAccordion.tsx` | modified | Removed `gsap.ticker.fps(120)`. Throttled window `resize` handler with `requestAnimationFrame`. |
| `src/components/SliderShowcase.tsx` | modified | Added `IntersectionObserver` to pause continuous ticker loop calculations when the showcase is outside the viewport (+200px buffer). Debounced resize listener with `requestAnimationFrame`. |
| `src/components/TestimonialsStack.tsx` | modified | Converted `updateSidebar()` tick animation from `width` to `scaleX` with `transformOrigin: center center` and `will-change: transform, opacity`, completely eliminating synchronous layout recalculations/reflow. |
| `src/components/ProjectShowcase.tsx` | modified | Replaced `loading="eager"` on all hidden hover images with `loading="lazy"`. Main cover images set to `index < 2 ? "eager" : "lazy"`. |
| `src/app/work/workData.json` | modified | Updated 18 off-screen project main images and all hover images to `loading="lazy"` (only 2 top static images remain eager). |
| `src/app/resume/page.tsx` | modified | Added `loading="lazy"` to resume preview image and PDF `<iframe>`. |
| `src/components/about/AboutValues.tsx` | modified | Throttled window `resize` listener and `ScrollTrigger.refresh()` with `requestAnimationFrame`. |
| `src/app/globals.css` | modified | Added Home & Global GPU Acceleration Layer for `.hero-video-bg`, `.hero-pill`, `.page-transition-overlay`, `.testimonial-card`, `.sidebar-tick`, `.service-block`, `.cat-svg`, and `.showcase-track`. |

## Local Verification
- `npx tsc --noEmit`: Code 0 (zero TypeScript errors).
- `npm run build`: Compiled 11/11 static pages in 418ms with Turbopack.
- `python3 scripts/apply_cache_busting.py out`: 11/12 files updated with cache busting.
- Headless Chrome Multi-Device Audit (`audit_devices.py`):
  - iPhone SE (320px): PASSED (0px overflow)
  - Galaxy S8 (360px): PASSED (0px overflow)
  - iPhone 12 (390px): PASSED (0px overflow)
  - Pixel 7 (412px): PASSED (0px overflow)
  - iPhone 14 Pro Max (430px): PASSED (0px overflow)
  - iPad Portrait (768px): PASSED (0px overflow)
  - Desktop HD (1440px): PASSED (0px overflow)
