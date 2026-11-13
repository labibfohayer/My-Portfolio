# Feature Specification: Exhaustive Eradication of "Full-Stack"

**Feature Short Name**: `eradicate-fullstack`  
**Status**: In Progress  
**Created**: 2026-11-13  

## 1. Problem Statement
The user found that previous text replacements had missed or retained instances of "Full-Stack" or "Full Stack" (such as on the Resume page under the "Curriculum Vitae" heading). The user requires complete, 100% exhaustive eradication of any variation of "Full-Stack" across all pages, components, templates, and static outputs of the project.

## 2. Scope & Target Invariants
1. **Resume Page Subtitle**:
   - Location: Under `<h1>Curriculum Vitae</h1>` in `src/app/resume/page.tsx` and static outputs.
   - Text target: `Full-Stack Developer • AI Automation Engineer • Reverse Engineer`
   - Required update: `Web Developer • AI Automation Engineer • Reverse Engineer`
2. **Global Codebase Eradication**:
   - Across `src/`, `public/`, `out/`, and deployment repositories.
   - Replace any remaining `Full-Stack Developer` / `Full Stack Developer` with `Web Developer`.
   - Replace any remaining `Full-Stack Development` / `Full Stack Development` with `Web Development`.
   - Replace any remaining internal keys like `id: "full-stack-engineer"` with `id: "web-engineer"`.
3. **No-Touch Invariants**:
   - Keep other titles ("AI Automation Engineer", "Reverse Engineer") 100% untouched.
   - Preserve all HTML layout, CSS classes, GSAP animations, SVG icons, and button styling.
   - Zero visual regressions across desktop and mobile.

## 3. Verification Criteria
- Automated regex scan of entire `src/` directory confirms 0 occurrences of `full-stack` / `full stack`.
- Automated regex scan of all static output files in `github-io-portfolio` confirms 0 occurrences of `full-stack` / `full stack` in visible HTML or titles.
- Full TypeScript typecheck passes (`npx tsc --noEmit`).
- Static build succeeds (`npm run build`).
- Cache-busting script updates all generated static HTML files.
- Live git repository (`main` and `source` branches) committed and pushed.
