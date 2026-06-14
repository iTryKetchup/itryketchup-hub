# iTryKetchup Studio Hub

## Purpose

iTryKetchup Studio Hub is the public website foundation for iTryKetchup Studio. It will provide a polished static site for studio information, projects, dev logs, contact details, and future content states while keeping the v1.0 scope small enough to ship.

## Current Status

v0.9 GitHub Pages Actions setup

Default GitHub Pages URL is not live yet.

## Project Details

| Field | Value |
|---|---|
| Project name | iTryKetchup Studio Hub |
| Repository name | itryketchup-hub |
| Public identity | iTryKetchup Studio |
| Target domain | itryketchup.com |
| Target deployment | GitHub Pages |
| GitHub repository status | Created and pushed |
| Remote URL | https://github.com/iTryKetchup/itryketchup-hub.git |
| GitHub Pages | Actions workflow created; source setting not enabled yet |
| YouTube | Coming Soon |
| Analytics | Disabled / not included in v1.0 |

## Local Run / Open Instructions

This is a static HTML/CSS/JavaScript site. Open `src/index.html` in a browser to review the local site, then navigate through the shared header links.

For local server testing:

```powershell
cd C:\Projects\Websites\itryketchup-hub\src
python -m http.server 8080
```

Then open <http://localhost:8080/>.

No backend, database, CMS, analytics, or build step is required for v0.7. A local static server is recommended for final local testing.

## Local Folder Structure

```text
itryketchup-hub/
|-- docs/
|-- design/
|   |-- claude/
|   `-- references/
|-- src/
|   |-- css/
|   |-- js/
|   `-- assets/
|       |-- images/
|       |-- icons/
|       |-- mascots/
|       `-- social/
|-- deploy/
|-- archive/
|-- temp/
|-- README.md
|-- ParkingLot.md
`-- .gitignore
```

## Current Next Step

Verify default GitHub Pages deployment after repository Pages source is set to GitHub Actions.

## Local Testing

The local testing report has been created at `docs/Website_LocalTestReport_v0.7.md`.

## Deployment Candidate

The deployment candidate checklist has been created at `docs/Website_DeploymentCandidateChecklist_v0.9.md`.

Default Pages URL: not live yet.

Custom domain: not live yet.

## Source File Summary

- `src/index.html` - Home page with mascot hero, project preview, dev log preview, and v1.0 CTAs.
- `src/about.html` - Studio overview, build direction, and philosophy.
- `src/projects.html` - Data-rendered project cards with status labels and fan project disclaimer.
- `src/devlogs.html` - Static dev log list rendered from data.
- `src/contact.html` - Contact email, GitHub link, response expectation, and YouTube Coming Soon state.
- `src/404.html` - Friendly recovery page.
- `src/css/styles.css` - Shared responsive layout, browser-frame styling, cards, badges, buttons, and focus states.
- `src/js/site-settings.js` - Studio settings, contact, GitHub, YouTube Coming Soon state, domain target, and feature flags.
- `src/js/mascots-data.js` - Mascot and image registry for page, card, fallback, and social preview image IDs.
- `src/js/projects-data.js` - Project card data.
- `src/js/devlogs-data.js` - Dev log card data.
- `src/js/main.js` - Registry image resolution, card rendering, hidden visibility filtering, mobile nav, current nav state, and disabled-link handling.
- `src/assets/` - Safe placeholder SVG assets for mascot, project images, social preview, and favicon.

## GitHub Repository Setup

The public GitHub repository has been created and `main` has been pushed to `origin/main`.

Repository: https://github.com/iTryKetchup/itryketchup-hub

GitHub Pages is the target host. The Actions workflow has been created at `.github/workflows/pages.yml` and publishes `src/`, but the repository Pages source still needs to be set to GitHub Actions before the default Pages URL can go live.
