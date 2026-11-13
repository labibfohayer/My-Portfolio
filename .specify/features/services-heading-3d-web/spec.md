# Feature Specification: Update Services Section Heading to "3D WEB"

- **Feature**: services-heading-3d-web
- **Status**: draft
- **Author**: spec-kit-core
- **Date**: 2026-11-13

## 1. Overview & Context
In the Services section on the Home page, the third service item previously read "FULL-STACK" on the left, an interactive browser/cursor icon in the middle, and "DEVELOPMENT" on the right with tooltip "I build complete digital experiences that look great and run flawlessly.".
The user requires this specific section heading's left text to be updated strictly to "3D WEB" while keeping "DEVELOPMENT" on the right side of the icon intact.

## 2. Requirements & Invariants
1. **Target**: In `src/components/ServicesSection.tsx`, locate service item #3 (`numberClass: "three"`).
2. **Text Update**:
   - `word1`: Set to `"3D WEB"`.
   - `word2`: Keep as `"Development"`.
3. **No-Touch Rules**:
   - DO NOT alter the middle browser/cursor icon (`lottieSrc: "/cdn-assets/6aaad679fdb9d914f7f52079_Web design.json"`).
   - DO NOT alter the curvy orange background line/SVG paths.
   - DO NOT alter the tooltip text bubble (`description`).
   - DO NOT alter font families, weights, colors, or CSS layouts.
4. **Empirical Verification Gate**:
   - `npx tsc --noEmit`: 0 errors.
   - `npm run build`: Successful static generation of 11/11 pages.
   - `python3 scripts/apply_cache_busting.py out`: Cache-busting hashes updated.
   - Render page in headless Chrome and verify DOM contains "3D WEB" and "DEVELOPMENT".
   - Sync and push to `main` and `source` branches.
