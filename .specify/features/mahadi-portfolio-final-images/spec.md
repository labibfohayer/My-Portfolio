# Feature Specification: Final Images Replacement for Mahadi's Portfolio

## Feature Description
Replace placeholder images for the 11th project ("Mahadi's Portfolio") on the internal Works / Portfolio pages with final permanent assets provided by user:
- Primary / default image: Attachment 1 (`image_41.png`)
- Secondary / hover image: Attachment 2 (`image_42.png`)
- Logo: Square MH emblem cropped from Attachment 1 (`mahadi-portfolio-logo.png`)

## Strict Invariants
1. Main Homepage (`index.html` / `page.tsx`) strictly LOCKED to 6 projects; ZERO modifications to Homepage.
2. Only the 11th card on the internal Works page is modified.
3. Card title remains "Mahadi's Portfolio".
4. Card subtitle remains "PROFESSIONAL PORTFOLIO WEBSITE".
5. Card URL remains `https://mahadihasan.pages.dev/`.
6. Interactive classes and GSAP hover triggers preserved 100%.
