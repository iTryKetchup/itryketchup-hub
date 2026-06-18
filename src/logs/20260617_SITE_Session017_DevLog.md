# Dev Log #017 - SITE - 2026-06-17

---

## 0. Project Status Before Session

**Current Version:** `Website v1.6 page-specific mascot assets completed and deployed`

**Current Priority:**
- Document and publish the completed Website v1.7 visual cleanup pass.
- Keep the public archive static, readable, and public-safe.
- Record the actual deployed v1.7 commit and Pages run.

**Known Blockers:**
- None for this visual cleanup milestone.

**Ship Impact:**
- [ ] No visible progress
- [x] Progress made
- [x] Milestone reached
- [x] Ready for release

---

## 1. Session Goal

Document the completed v1.7 visual cleanup pass and publish this session as the newest public-ready entry in the website Dev Logs reader.

---

## 2. What I Did

- [x] Confirmed the final deployed v1.7 cleanup commit before writing this log.
- [x] Confirmed the GitHub Pages deployment completed successfully.
- [x] Reworked `404.html` into the current dark black / white / red studio system.
- [x] Added clear 404 recovery buttons back to Home, Projects, and Dev Logs.
- [x] Tightened mobile hero vertical balance so mascots sit better in the first viewport.
- [x] Improved Home tablet axis widget spacing around the HERO mascot.
- [x] Fixed About hero selected-object tag overlap with the mascot.
- [x] Cleaned Contact by removing extra overlay boxes.
- [x] Kept Contact using the intended SOCIAL mascot state.
- [x] Kept the Contact Signal Router widget.
- [x] Cleaned Dev Logs by removing decorative overlay boxes above the real archive.
- [x] Preserved the DEVLOG mascot and the working Dev Logs reader.
- [x] Kept Projects using the GUIDE mascot.
- [x] Restored Projects shelf / catalog decoration because the hero felt too plain without it.
- [x] Preserved the real project cards below.
- [x] Added stylesheet cache-bust query `?v=1.7`.
- [x] Preserved `/dev-logs/`, `devlogs.html`, mobile menu, and active nav behavior.

---

## 3. What Worked

- The 404 page now feels like part of the same public studio system.
- The 404 page gives clear recovery paths to Home, Projects, and Dev Logs.
- Contact and Dev Logs heroes are cleaner after removing extra overlay panels.
- Contact still keeps the SOCIAL mascot and Signal Router identity.
- Dev Logs still keeps the DEVLOG mascot and the real markdown archive.
- Projects keeps enough shelf / catalog visual structure to feel intentional.
- The stylesheet cache-bust query helps the deployed visual cleanup load reliably.
- The Dev Logs reader continued working throughout the cleanup.

---

## 4. What Got Stuck

- No major blockers were found.
- The main design balance was removing visual clutter without making the pages feel empty.
- Projects needed some decoration restored after review.

---

## 5. Decisions Made

| Decision | Why |
|----------|-----|
| Treat this as Website v1.7. | It completed a deployed visual cleanup pass after the mascot and Dev Logs archive milestones. |
| Verify deployment before writing the log. | Public logs should document actual deployed commits and run IDs. |
| Align 404 with the dark studio system. | The fallback page should feel like part of the same site. |
| Remove extra Contact and Dev Logs overlay boxes. | They added clutter and competed with the mascot / page purpose. |
| Keep the Contact Signal Router widget. | It still fit cleanly after the cleanup. |
| Preserve the Dev Logs reader. | The cleanup should not risk the working archive. |
| Restore Projects shelf / catalog decoration. | Projects felt too plain without it. |
| Add `?v=1.7` to stylesheet links. | It helps refreshed CSS reach the deployed site reliably. |

---

## 6. Files / Repos / Links Changed

- Website repo: `itryketchup-hub`
- Public Dev Log folder: `src/logs`
- Live site: `https://www.itryketchup.com/`

**v1.7 deployed commit documented:**
- `7cff7cb78adaa6851f82a34999a75585d1271b86`
- Commit message: `fix(site): polish visual alignment and 404 page`

**v1.7 deployment documented:**
- GitHub Pages deployment completed successfully.
- Deployment run: `27739747816`
- Deployment URL: `https://github.com/iTryKetchup/itryketchup-hub/actions/runs/27739747816`

**Website files changed during the v1.7 cleanup milestone:**
- `src/404.html`
- `src/about.html`
- `src/contact.html`
- `src/css/styles.css`
- `src/dev-logs/index.html`
- `src/devlogs.html`
- `src/index.html`
- `src/projects.html`

**Live routes verified before publishing this log:**
- `https://www.itryketchup.com/`
- `https://www.itryketchup.com/about`
- `https://www.itryketchup.com/projects`
- `https://www.itryketchup.com/dev-logs/`
- `https://www.itryketchup.com/devlogs.html`
- `https://www.itryketchup.com/contact`
- `https://www.itryketchup.com/404.html`

**Live checks documented before publishing this log:**
- 404 page matched the current dark studio system.
- 404 page included recovery links to Home, Projects, and Dev Logs.
- Contact used SOCIAL.
- Contact overlay boxes were gone.
- Dev Logs used DEVLOG.
- Dev Logs overlay boxes were gone.
- Dev Logs reader worked.
- Session 016 auto-loaded as the newest public-ready log before adding Session 017.
- Existing Sessions 010-016 loaded successfully.
- No console errors were found.
- No horizontal overflow was found.
- No visible failed image loads were found.
- Mobile menu worked.
- Active nav worked.

---

## 7. Next Actions

1. Verify Session 017 appears live as the newest public-ready Dev Log.
2. Keep future visual cleanup passes scoped and deployment-verified.
3. Continue using the master-to-public-copy Dev Log workflow.

---

## 8. Parking Lot Ideas

- Add a lightweight route health checklist for future deployment logs.
- Consider a later accessibility pass on hero widgets and decorative labels.
- Review 404 recovery actions again after the site has more real traffic.

---

## 9. Final Status

**Session complete?** Yes

**Project version after this session:** `Website v1.7 visual cleanup completed and deployed`

**Time spent (approx):** Not tracked

---

> *Filename: 20260617_SITE_Session017_DevLog.md*
