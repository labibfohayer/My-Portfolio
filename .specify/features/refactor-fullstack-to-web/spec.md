# Feature Specification: Project-Wide Refactor of "Full-Stack" to "Web"

- **Feature**: refactor-fullstack-to-web
- **Status**: draft
- **Author**: spec-kit-core
- **Date**: 2026-11-13

## 1. Overview & Context
The user is updating their professional title across their entire personal portfolio website. The term "Full-Stack" (including "Full Stack" without hyphen and case variations) must be completely removed from all visible user-facing text and replaced with "Web" (e.g. "Web Developer", "Web Development", "Web & AI Engineer").

## 2. Functional Requirements
1. **Developer Title**:
   - `Full-Stack Developer` / `Full Stack Developer` → `Web Developer`
   - Case matched: e.g. `FULL-STACK DEVELOPER` → `WEB DEVELOPER`
2. **Development Term**:
   - `Full-Stack Development` / `Full Stack Development` → `Web Development`
   - Case matched: e.g. `full-stack development` → `web development`
3. **Engineering & Systems Terms**:
   - `Full-Stack & AI Engineer` → `Web & AI Engineer`
   - `FULL-STACK & AI ENGINEER` → `WEB & AI ENGINEER`
   - `Full-Stack Systems` → `Web Systems`
   - `full-stack systems` → `web systems`
   - `full-stack architectures` → `web architectures`
   - `full-stack technologies` → `web technologies`
   - `full-stack website` → `web application`
4. **Catch-All Mentions**:
   - Any other standalone mentions of `Full-Stack` in visible prose → `Web`
5. **Zero Deviation & Invariants**:
   - DO NOT alter any CSS class names, HTML IDs, variable names, or internal code logic (e.g., `id: "full-stack-engineer"` in data objects).
   - DO NOT alter layout grids, spacing, or GSAP animations.
   - Retain 100% visual design integrity and formatting.

## 3. Scoped Target Files
- `src/app/resume/page.tsx`
- `src/components/ServicesSection.tsx`
- `src/components/FAQAccordion.tsx`
- `src/components/about/AboutCapabilities.tsx`
- `src/components/about/AboutHero.tsx`
- `src/components/about/AboutValues.tsx`
- `src/components/TestimonialsStack.tsx`
- `public/README.md`

## 4. Verification Gate
- `npx tsc --noEmit`: 0 errors.
- `npm run build`: Successful static generation of 11/11 pages.
- `python3 scripts/apply_cache_busting.py out`: Cache-busting hashes updated.
- Automated regex audit confirming 0 user-facing occurrences of "full-stack" remain in `src/` or `out/`.
- Headless Chrome audit verifying layout stability.
- Git push to `main` and `source` branches.
