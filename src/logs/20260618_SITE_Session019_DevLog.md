# Dev Log #019 - SITE - 2026-06-18

---

## 0. Project Status Before Session

**Current Version:** `Website v1.8 Home perspective viewport grid completed and deployed`

**Current Priority:**
- Document and publish the completed supporting-page Blender / workspace perspective floor rollout.
- Keep the public archive static, readable, and public-safe.
- Record the actual deployed build commit and Pages run.

**Known Blockers:**
- None for this supporting-page floor milestone.

**Ship Impact:**
- [ ] No visible progress
- [x] Progress made
- [x] Milestone reached
- [x] Ready for release

---

## 1. Session Goal

Document the supporting-page perspective floor rollout and publish this session as the newest public-ready entry in the website Dev Logs reader.

---

## 2. What I Did

- [x] Confirmed Session 019 was the correct next Dev Log number.
- [x] Confirmed the final deployed supporting-page floor commit and GitHub Pages run.
- [x] Preserved the already-deployed Home perspective viewport floor from Website v1.8.
- [x] Repaired the About floor first until it showed a visible full-width black floor, pushed-back wall, seam, and grounded HERO mascot.
- [x] Used the repaired About implementation as the pattern for Projects, Dev Logs, and Contact.
- [x] Added / kept floor helpers for `projects-hero__floor`, `devlogs-hero__floor`, and `contact-hero__floor`.
- [x] Added / tuned page-scoped CSS for About, Projects, Dev Logs, and Contact.
- [x] Updated stylesheet cache busting on changed pages.
- [x] Preserved Home behavior.
- [x] Preserved Projects cards and shelf / catalog visuals.
- [x] Preserved the Dev Logs reader, archive, and both Dev Logs routes.
- [x] Preserved Contact's SOCIAL mascot and Signal Router widget.
- [x] Preserved the static-site approach with no new backend, CMS, framework, or dependency.

---

## 3. What Worked

- About, Projects, Dev Logs, and Contact now read more like dark Blender / workspace rooms.
- About became the reliable supporting-page pattern after repair.
- Projects, Dev Logs, and Contact gained visible full-width black floor layers without disrupting their page content.
- Dev Logs kept the working markdown archive and reader.
- Contact kept a softer floor/base treatment that fits the SOCIAL mascot.
- Page-scoped selectors kept the rollout controlled.

---

## 4. What Got Stuck

- Copying Home exactly was not the right approach for supporting pages.
- About needed repair before it became the reusable pattern.
- The floor needed to stay a single flat room floor, not a cage, box, or wireframe cube.
- Contact needed a softer treatment because its mascot composition is cropped / profile-style.

---

## 5. Decisions Made

| Decision | Why |
|----------|-----|
| Treat this as Website v1.9. | The perspective floor visual system expanded from Home to supporting pages. |
| Use About as the reusable pattern. | The repaired About floor created the strongest supporting-page result. |
| Do not copy Home exactly. | Home's layout differs from the supporting-page heroes. |
| Keep floor selectors page-scoped. | The rollout should not change unrelated layouts. |
| Keep the floor as a flat room floor. | The goal was viewport depth, not a wireframe cube. |
| Keep Contact softer. | The SOCIAL mascot composition needs a cleaner base. |
| Preserve Dev Logs reader logic and data. | The archive is already live and should remain stable. |

---

## 6. Files / Repos / Links Changed

- Website repo: `itryketchup-hub`
- Public Dev Log folder: `src/logs`
- Live site: `https://www.itryketchup.com/`

**About repair commit documented:**
- `7c443eeb66bc134893ef997086f9aa0c43549edd`
- Commit message: `style(about): add perspective viewport floor`

**Final supporting-page rollout commit documented:**
- `a6147365eb29fc8377314075c3525eb79702b02a`
- Commit message: `style(site): add perspective floors to supporting pages`

**Final deployment documented:**
- GitHub Pages deployment completed successfully.
- Deployment run: `27785389912`
- Deployment URL: `https://github.com/iTryKetchup/itryketchup-hub/actions/runs/27785389912`

**Files changed across the milestone:**
- `src/about.html`
- `src/projects.html`
- `src/devlogs.html`
- `src/dev-logs/index.html`
- `src/contact.html`
- `src/css/styles.css`

**Implementation details verified in code:**
- About floor helper: `about-hero__floor`
- Projects floor helper: `projects-hero__floor`
- Dev Logs floor helper: `devlogs-hero__floor`
- Contact floor helper: `contact-hero__floor`
- About stylesheet cache bust: `css/styles.css?v=1.8-about-floor`
- Supporting-page stylesheet cache bust: `css/styles.css?v=1.8-supporting-floors`

**Live routes verified before publishing this log:**
- `https://www.itryketchup.com/`
- `https://www.itryketchup.com/about`
- `https://www.itryketchup.com/projects`
- `https://www.itryketchup.com/dev-logs/`
- `https://www.itryketchup.com/devlogs.html`
- `https://www.itryketchup.com/contact`
- `https://www.itryketchup.com/404.html`

**Checks documented before publishing this log:**
- Home loaded correctly.
- About, Projects, Dev Logs, and Contact showed the new floor treatment.
- Contact mascot was not sliced awkwardly.
- Dev Logs reader / archive still worked.
- Newest Dev Log loaded.
- Dev Log cards rendered.
- Clicking a log updated the reader.
- No visible failed image loads were found.
- No console errors were found.
- No horizontal overflow was found.
- Mobile menu worked.
- Active nav worked.
- HTTPS worked.

---

## 7. Next Actions

1. Verify Session 019 appears live as the newest public-ready Dev Log.
2. Keep future floor refinements page-scoped and visually tested.
3. Continue preserving the Dev Logs archive when visual-system work touches the Dev Logs page.

---

## 8. Parking Lot Ideas

- Add a lightweight visual QA checklist for viewport-room heroes.
- Review whether 404 ever needs matching floor depth.
- Keep public Dev Logs documenting design-system decisions.

---

## 9. Final Status

**Session complete?** Yes

**Project version after this session:** `Website v1.9 supporting-page perspective floors completed and deployed`

**Time spent (approx):** Not tracked

---

> *Filename: 20260618_SITE_Session019_DevLog.md*
