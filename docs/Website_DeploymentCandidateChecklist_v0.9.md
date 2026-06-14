# Website Deployment Candidate Checklist v0.9

## Candidate Summary

| Field | Value |
|---|---|
| Project | iTryKetchup Studio Hub |
| Current version | v0.9 Deployment Candidate Preparation |
| Repository | `https://github.com/iTryKetchup/itryketchup-hub` |
| Branch | `main` |
| Static site source | `src\` |
| Candidate status | Ready for deployment configuration |

## Current Deployment Status

| Item | Status |
|---|---|
| GitHub Pages | Not configured yet |
| DNS | Not configured yet |
| HTTPS | Not verified yet |
| Custom domain | Not connected yet |
| Live URL | Not live yet |

## Recommended Deployment Method

- Use GitHub Pages via GitHub Actions.
- Publish the `src\` folder only.
- Do not publish `docs\`, `design\`, `archive\`, `temp\`, or project planning files.
- Do not create the GitHub Actions workflow until the approved deployment setup phase.

## Required Production Files

| File or folder | Status |
|---|---|
| `src\index.html` | Present |
| `src\about.html` | Present |
| `src\projects.html` | Present |
| `src\devlogs.html` | Present |
| `src\contact.html` | Present |
| `src\404.html` | Present |
| `src\css\styles.css` | Present |
| `src\js\site-settings.js` | Present |
| `src\js\mascots-data.js` | Present |
| `src\js\projects-data.js` | Present |
| `src\js\devlogs-data.js` | Present |
| `src\js\main.js` | Present |
| `src\assets\` | Present |

## Pre-Deployment Checks

| Check | Result |
|---|---|
| All required pages exist | Passed |
| All nav links work | Passed in v0.7 local testing |
| CSS loads | Passed in v0.7 local testing |
| JS syntax checks pass | Passed |
| Assets resolve | Passed |
| Favicon resolves | Passed |
| Social preview asset resolves | Passed |
| No absolute Windows paths in `src` | Passed |
| No raw design-reference syntax in `src` | Passed |
| No real-name public copy in `src` | Passed |
| No active analytics | Passed |
| No Videos page | Passed |
| No project detail pages | Passed |
| No backend, CMS, login, store, comments, database, payment system, or backend contact form | Passed |
| Kitchen Wars not built or implied playable | Passed |

## GitHub Pages Setup Plan

1. Create a GitHub Actions workflow in a later approved deployment phase.
2. Configure repository Pages source to GitHub Actions in GitHub repository settings.
3. Verify the default GitHub Pages URL first.
4. Only after the default GitHub Pages URL works, connect `itryketchup.com`.

## Custom Domain Plan

| Item | Plan |
|---|---|
| Domain | `itryketchup.com` |
| DNS values | Not known yet |
| DNS rule | Do not guess DNS values |
| Custom domain setup | Use GitHub repository Pages settings |
| HTTPS | Verify after DNS resolves |

## Go / Hold Decision

Candidate status: Ready for deployment configuration.

Blockers: None found during Phase 5B preparation.

Next step: Phase 6A GitHub Pages Actions Setup.
