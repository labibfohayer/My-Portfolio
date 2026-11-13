# Bug Assessment: Desktop Performance Stuttering & Rendering Lag

- **Slug**: desktop-performance-lag-fix
- **Date**: 2026-11-13
- **Status**: confirmed
- **Severity**: high

## Problem Description
While the portfolio website runs smoothly on high-spec developer machines with high refresh-rate monitors, it stutters, drops frames, and lags heavily on standard desktop and laptop computers (especially standard 60Hz displays and machines with integrated GPUs). The goal is to achieve 60FPS fluid scrolling across all standard PCs without altering any visual design, layout, or animations.

## Root Cause Analysis
1. **Artificial Ticker Bottlenecks (`gsap.ticker.fps(120)`)**:
   - `Hero.tsx`, `HeroMarquee.tsx`, and `FAQAccordion.tsx` explicitly set `gsap.ticker.fps(120)`. On standard 60Hz displays, forcing GSAP to evaluate and tick at 120Hz creates frame budget overruns, thread contention with the browser's native `requestAnimationFrame`, and micro-stutter.
2. **Infinite Off-Screen Marquee Loop**:
   - `HeroMarquee.tsx` runs an infinite loop updating SVG `textPath` attribute `startOffset` every tick (`repeat: -1`). This CPU-intensive SVG glyph layout computation continues running even when the user has scrolled past the hero, keeping CPU/GPU utilization high across the entire page.
3. **Continuous Unthrottled Slider Ticker (`SliderShowcase.tsx`)**:
   - `SliderShowcase.tsx` adds a continuous ticker function (`tickFn`) to `gsap.ticker` that computes distance and scales for all slides every frame, even when the showcase section is completely scrolled out of the viewport.
4. **Layout Thrashing in Ticker / Timeline Animations**:
   - In `TestimonialsStack.tsx`, `updateSidebar()` animates `width` (`gsap.to(tick, { width: targetWidth })`), forcing synchronous layout recalculations during testimonial card transitions.
5. **Massive Eager Image Preloading & Decoding**:
   - In `src/app/work/workData.json`, 20 project images (both static covers and hover states) have `loading="eager"`.
   - In `src/components/ProjectShowcase.tsx`, all 10 projects have `loading="eager"` on both main and hover images (which are initially `display: none`).
   - In `src/app/resume/page.tsx`, the embedded PDF iframe and resume preview image lack `loading="lazy"`.
   - Decoding 20+ large images simultaneously on page load saturates GPU texture memory and freezes the main thread on standard PCs.
6. **Missing GPU Hardware Acceleration Layers**:
   - Key animated elements (hero video container, floating capsules, page transition overlay, testimonial stack cards, service blocks, cat SVG) lack universal hardware acceleration (`will-change: transform, opacity; transform: translateZ(0); -webkit-backface-visibility: hidden;`).
7. **Unthrottled Resize Handlers**:
   - `FAQAccordion.tsx`, `SliderShowcase.tsx`, and `AboutValues.tsx` listen to window `resize` without requestAnimationFrame or debouncing.

## Proposed Remediation
1. **Remove Artificial Ticker Rate Bottlenecks**:
   - Remove `gsap.ticker.fps(120)` from `Hero.tsx`, `HeroMarquee.tsx`, and `FAQAccordion.tsx`, allowing GSAP to synchronize natively with the display's native refresh rate via `requestAnimationFrame`.
2. **Viewport-Aware Marquee Pausing (`HeroMarquee.tsx`)**:
   - Use ScrollTrigger to pause `marqueeTween` when the marquee is scrolled off-screen and resume when visible.
3. **Viewport-Aware Slider Ticker (`SliderShowcase.tsx`)**:
   - Add an IntersectionObserver / viewport check to `tickFn` in `SliderShowcase.tsx` so calculation and transform updates only occur when the section is in or near the viewport.
4. **Refactor Layout-Triggering Animation in `TestimonialsStack.tsx`**:
   - Change `updateSidebar()` to animate `scaleX` instead of `width` on sidebar ticks (or utilize transform-based scaling) so no layout reflow is triggered.
5. **Implement Comprehensive Lazy Loading**:
   - In `src/components/ProjectShowcase.tsx`, set `loading="lazy"` on all hover images and on cards below the initial viewport.
   - In `src/app/work/workData.json`, set `loading="lazy"` on all off-screen project main images and all hover images.
   - In `src/app/resume/page.tsx`, add `loading="lazy"` to the resume preview `<img>` and the PDF `<iframe>`.
6. **Force Universal Hardware Acceleration in `globals.css`**:
   - Apply `will-change: transform, opacity; transform: translateZ(0); -webkit-backface-visibility: hidden; backface-visibility: hidden;` to `.hero-video-bg`, `.hero-video-loop`, `.hero-video-bg video`, `.hero-video-wrapper`, `.hero-pill`, `.about-pill`, `.hero-pill-inner`, `.page-transition-overlay`, `.testimonial-card`, `.testimonial-item`, `.service-block`, and `.cat-svg`.
7. **Debounce Resize Handlers**:
   - Wrap resize listeners in `FAQAccordion.tsx`, `SliderShowcase.tsx`, and `AboutValues.tsx` with `requestAnimationFrame`.

## Files to Change
- `src/components/Hero.tsx`
- `src/components/HeroMarquee.tsx`
- `src/components/FAQAccordion.tsx`
- `src/components/SliderShowcase.tsx`
- `src/components/TestimonialsStack.tsx`
- `src/components/ProjectShowcase.tsx`
- `src/app/work/workData.json`
- `src/app/resume/page.tsx`
- `src/components/about/AboutValues.tsx`
- `src/app/globals.css`

## Risks & Considerations
- Visual design, colors, typography, and DOM structure must remain 100% identical (0% visual deviation).
- Hero video autoplay, loop, muted, and playsinline must not be altered.
- All animations must remain intact; only execution timing, rendering layers, and off-screen pause states will be optimized.
