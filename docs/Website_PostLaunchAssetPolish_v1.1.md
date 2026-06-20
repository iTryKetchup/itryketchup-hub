# Website Post-Launch Asset Polish v1.1

## Scope

This note records the completed SITE v1.1 favicon and social preview asset polish facts. It is limited to favicon status, social preview status, metadata wiring, and regression results.

## Asset Decision

| Asset | Decision | Source |
|---|---|---|
| Favicon | Existing branded favicon confirmed and retained. | `src/assets/icons/favicon.svg` |
| Social preview | New 1200x630 PNG created from approved website-local SOCIAL mascot asset and existing site brand styling. | `src/assets/social/social-preview.png` derived from `src/assets/mascots/itry/ITRY-MASCOT-004-SOCIAL_SocialC.webp` |

The previous social preview placeholder remains in the repo as legacy/static fallback material, but Home metadata and the `socialPreview` registry entry now point to the v1.1 PNG.

## Metadata Verification

| Check | Result |
|---|---|
| Favicon reference | Page heads continue to use `assets/icons/favicon.svg`. |
| Open Graph title | Home uses `iTryKetchup Studio Hub`. |
| Open Graph description | Home uses `Projects, dev logs, and creative experiments from iTryKetchup Studio.` |
| Open Graph image | Home uses `https://www.itryketchup.com/assets/social/social-preview.png`. |
| Open Graph URL | Home uses `https://www.itryketchup.com/`. |
| Twitter/X metadata | Not present in the existing site pattern; no new Twitter/X pattern was added. |
| Canonical link | Not present in the existing site pattern; no new canonical link pattern was added. |

## Regression Notes

The v1.1 check covered the changed metadata and directly affected static paths: home page, favicon path, social preview path, 404 page, contact path, Dev Logs route, GitHub link, and YouTube Coming Soon state. No layout, CSS, navigation structure, or page content was changed, so mobile-width behavior remained outside the edited surface. No backend, CMS, analytics, Videos page, project detail pages, Door build, or unrelated feature work was added.
