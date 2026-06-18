# Dev Log #018 - SITE - 2026-06-18

---

## 0. Project Status Before Session

**Current Version:** `Website v1.7 visual cleanup completed and deployed`

**Current Priority:**
- Document and publish the completed Home-only perspective viewport grid pass.
- Keep the public archive static, readable, and public-safe.
- Record the actual deployed Home-grid commit and Pages run.

**Known Blockers:**
- None for this Home-grid milestone.

**Ship Impact:**
- [ ] No visible progress
- [x] Progress made
- [x] Milestone reached
- [x] Ready for release

---

## 1. Session Goal

Document the completed Home-only perspective viewport grid pass and publish this session as the newest public-ready entry in the website Dev Logs reader.

---

## 2. What I Did

- [x] Confirmed Session 018 was the correct next Dev Log number.
- [x] Confirmed the final deployed Home-grid commit and GitHub Pages run.
- [x] Added a Home-page-only perspective viewport grid proof-of-concept.
- [x] Kept the effect scoped to Home only.
- [x] Preserved About, Projects, Dev Logs, Contact, and 404 pages.
- [x] Preserved the Dev Logs reader and routes.
- [x] Started with a subtle CSS-only Home-scoped test.
- [x] Moved the effect to the Home hero viewport body so it reads as part of the Blender / workspace scene.
- [x] Added Home stylesheet cache busting so the browser loaded the latest CSS during testing.
- [x] Split the Home viewport into a back wall grid and a perspective floor plane.
- [x] Gave the floor its own dark / near-black surface so the wall grid does not bleed through it.
- [x] Tuned desktop, tablet, and mobile behavior.
- [x] Kept the mascot grounded and in front of the floor.
- [x] Kept text, buttons, axis widget, and transform widget readable.
- [x] Tuned cross-floor row lines so they span cleanly.
- [x] Preserved the static-site approach with no new dependencies.

---

## 3. What Worked

- The Home hero now reads more like a Blender-style viewport.
- The floor reads as a distinct dark surface.
- The back wall and floor read as separate planes.
- The floor does not look like a transparent wire cage.
- The mascot remains grounded and in front of the floor.
- Home text, buttons, and widgets remain readable.
- Other public pages were preserved.
- The Dev Logs reader continued working.

---

## 4. What Got Stuck

- The first CSS-only test was too subtle and too confined to the mascot visual column.
- The floor needed its own dark surface layer to prevent wall-grid bleed-through.
- No deployment blockers were found.

---

## 5. Decisions Made

| Decision | Why |
|----------|-----|
| Treat this as Website v1.8. | The Home hero gained a deployed perspective viewport floor after v1.7 cleanup. |
| Keep the grid Home-only. | The work was a focused proof-of-concept and should not affect other stable pages. |
| Use CSS only. | The static site does not need a 3D library for this visual effect. |
| Use the Home viewport body for the wall grid. | The scene needed to feel connected across the full hero. |
| Use `hero-grid::after` for the floor. | The floor needed to sit behind content while spanning the Home hero layout. |
| Give the floor a dark surface layer. | This prevents the wall grid from showing through. |
| Add Home-grid-specific cache busting. | It helps the deployed CSS refresh reliably. |

---

## 6. Files / Repos / Links Changed

- Website repo: `itryketchup-hub`
- Public Dev Log folder: `src/logs`
- Live site: `https://www.itryketchup.com/`

**Home-grid deployed commit documented:**
- `0c9748eb976b7203167d34268497eb7b03cd84bf`
- Commit message: `style(home): add perspective viewport floor grid`

**Home-grid deployment documented:**
- GitHub Pages deployment completed successfully.
- Deployment run: `27765100304`
- Deployment URL: `https://github.com/iTryKetchup/itryketchup-hub/actions/runs/27765100304`

**Website files changed during the Home-grid milestone:**
- `src/index.html`
- `src/css/styles.css`

**Final implementation details verified in code:**
- Main Home selector: `body[data-page="home"] .home-hero .browser-panel__body`
- Floor selector: `body[data-page="home"] .home-hero .hero-grid::after`
- Home stylesheet cache bust: `css/styles.css?v=1.7-home-grid-surface-edge-rows`

**Live routes verified before publishing this log:**
- `https://www.itryketchup.com/`
- `https://www.itryketchup.com/about`
- `https://www.itryketchup.com/projects`
- `https://www.itryketchup.com/dev-logs/`
- `https://www.itryketchup.com/devlogs.html`
- `https://www.itryketchup.com/contact`
- `https://www.itryketchup.com/404.html`

**Live checks documented before publishing this log:**
- Home perspective floor grid appeared live.
- Floor / wall separation looked correct.
- Floor behaved like a dark surface, not a transparent cage.
- Mascot was grounded.
- Text and buttons were readable.
- Dev Logs reader worked.
- Session 017 auto-loaded as the newest public-ready log before adding Session 018.
- No console errors were found.
- No horizontal overflow was found.
- No visible failed image loads were found.
- Mobile menu worked.
- Active nav worked.

---

## 7. Next Actions

1. Verify Session 018 appears live as the newest public-ready Dev Log.
2. Keep future viewport experiments scoped and reversible.
3. Decide later whether similar depth effects belong on any other page.

---

## 8. Parking Lot Ideas

- Add a small visual QA checklist for hero viewport effects.
- Revisit the Home grid after real viewing time on different screens.
- Keep public Dev Logs documenting these visual system decisions.

---

## 9. Final Status

**Session complete?** Yes

**Project version after this session:** `Website v1.8 Home perspective viewport grid completed and deployed`

**Time spent (approx):** Not tracked

---

> *Filename: 20260618_SITE_Session018_DevLog.md*
