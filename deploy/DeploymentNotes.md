# Deployment Notes - iTryKetchup Studio Hub

| Field | Status |
|---|---|
| Deployment target | GitHub Pages |
| Domain | itryketchup.com |
| Repository | itryketchup-hub |
| Repo visibility | Public |
| Repository setup | Created and pushed |
| Remote URL | https://github.com/iTryKetchup/itryketchup-hub.git |
| GitHub Pages | GitHub Actions workflow created; repository Pages source not enabled yet |
| DNS | Not configured yet |
| HTTPS | Not verified yet |
| CNAME | Not configured |
| Live URL | Not live yet |

Do not include guessed DNS values. Fill in exact DNS, HTTPS, CNAME, and live URL details only after deployment setup has been performed and verified.

## Repository Setup

The public GitHub repository has been created and `main` has been pushed to `origin/main`.

Repository: https://github.com/iTryKetchup/itryketchup-hub

GitHub Pages has a workflow file, but the repository Pages source still needs to be set to GitHub Actions. DNS is not configured yet. HTTPS is not verified yet. CNAME is not configured.

## v0.9 Deployment Candidate Preparation

| Field | Status |
|---|---|
| Deployment method recommendation | GitHub Pages via GitHub Actions publishing `src\` |
| GitHub Pages | Not configured yet |
| DNS | Not configured yet |
| HTTPS | Not verified yet |
| CNAME / custom domain | Pending |
| Next deployment action | Create Pages workflow and configure repository Pages settings |

The recommended deployment path is to publish only the `src\` folder through a GitHub Actions workflow in a later approved deployment phase. Do not publish `docs\`, `design\`, `archive\`, `temp\`, or project planning files.

## v0.9 GitHub Pages Actions Setup

| Field | Status |
|---|---|
| Workflow created | Yes |
| Workflow file | `.github\workflows\pages.yml` |
| Artifact path | `src\` |
| Build step | None |
| Secrets required | None |
| Default Pages URL | Not live yet |
| Workflow status | Failed until repository Pages source is enabled |
| GitHub Pages source setting | Not configured; Pages API returned not found |
| Custom domain | Not configured |
| DNS | Not configured |
| HTTPS / custom domain verification | Not verified |

The workflow deploys the static site from `src\` only using GitHub Pages Actions. It does not publish `docs\`, `design\`, `archive\`, `temp\`, or repository planning files.

The first workflow run failed during `actions/configure-pages` because GitHub Pages is not yet enabled/configured for this repository. Required manual step: in the GitHub repository, open Settings > Pages, set Build and deployment Source to GitHub Actions, then rerun the Deploy GitHub Pages workflow.
