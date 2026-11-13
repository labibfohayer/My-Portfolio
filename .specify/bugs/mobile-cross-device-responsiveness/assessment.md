# Bug Assessment: Cross-Device Mobile Responsiveness Distortion & Overflow

- **Slug**: mobile-cross-device-responsiveness
- **Date**: 2026-11-13
- **Status**: confirmed
- **Severity**: high

## Problem Description
The portfolio website looks fine on desktop and on one specific mobile test device, but the layout breaks, overflows horizontally, and distorts on other mobile devices with different aspect ratios and screen sizes (e.g., iPhone SE at 320px-375px, Pixel/Galaxy devices at 360px-412px, iPad/tablets at 768px).

## Root Cause Analysis
1. **Viewport Meta Tag Missing Exact Scale Constraints**: Next.js exports `<meta name="viewport" content="width=device-width, initial-scale=1">` without `initial-scale=1.0, maximum-scale=1.0, user-scalable=no`. Mobile Safari and Android browsers scale dynamically or zoom out unpredictably on devices with unusual aspect ratios.
2. **Hardcoded min-width and fixed px dimensions in webflow.css and globals.css**:
   - `webflow.css` lines 2761 and 2771: `.project-img` and `.project-img-hover` have hardcoded `min-width: 445px;`. On devices narrower than 445px, this causes horizontal overflow.
   - `webflow.css` line 2795: `.projects-end` has `min-width: 100vw;`.
   - `globals.css` lines 1807 & 2050: `.testimonial-item` has `min-width: 40em !important;` and `34em !important;`, causing element width to exceed screen width on smaller phones.
   - `globals.css` lines 1834 & 2080: `.cat-svg` has `width: 34em !important;` and `24em !important;`, causing horizontal page expansion.
3. **Multi-Column Grid Compression on Small Screens**:
   - `.projects-list` in `globals.css` forced a 2-column grid (`repeat(2, minmax(0, 1fr))`) across all mobile screens down to 320px. On small mobile screens, columns become under 140px wide, distorting project titles and meta text.
   - In accordance with user instruction 4: CSS grids should drop down to a single column (`grid-template-columns: 1fr;`) on mobile screens so project cards and text elements stack neatly instead of overlapping.
4. **Missing Container Overflow Shields**:
   - Main page wrappers (`.page`, `.main`, `#lenis-root`, section wrappers) lack strict `overflow-x: hidden !important; width: 100% !important; max-width: 100vw !important; box-sizing: border-box !important;`.

## Proposed Remediation
1. Update `src/app/layout.tsx` to export standard `Viewport` config with `width: "device-width", initialScale: 1.0, maximumScale: 1.0, userScalable: false` and explicit `<meta name="viewport" ...>` in `<head>`.
2. Update `scripts/apply_cache_busting.py` to ensure all exported HTML files strictly enforce `<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">`.
3. In `src/app/globals.css`, isolate ALL mobile fixes strictly under `@media screen and (max-width: 768px)`:
   - Apply `overflow-x: hidden !important; width: 100% !important; max-width: 100vw !important; box-sizing: border-box !important;` to `html`, `body`, `.page`, `.main`, `#lenis-root`, and all section containers.
   - Override `.project-img` and `.project-img-hover` with `min-width: 0 !important; width: 100% !important; max-width: 100% !important;`.
   - Ensure flex containers use `flex-wrap: wrap;` and CSS grids (`.projects-list`, `.more-works-list`, `.w-layout-grid`) use `grid-template-columns: 1fr !important;` on mobile so cards stack cleanly.
   - Make `.testimonial-item`, `.cat-svg`, `.projects-end`, and all fluid elements respect `max-width: 100% !important; box-sizing: border-box !important;`.
4. Ensure 0% desktop deviation: no styling outside `@media screen and (max-width: 768px)` will be touched.

## Files likely to change
- `src/app/layout.tsx`
- `scripts/apply_cache_busting.py`
- `src/app/globals.css`

## Risks & Considerations
- Desktop layout MUST remain 100% pixel-perfect identical.
- GSAP animations and scroll triggers must remain intact.
