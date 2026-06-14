# Deployment Notes - iTryKetchup Studio Hub

| Field | Status |
|---|---|
| Deployment target | GitHub Pages |
| Domain | itryketchup.com |
| Repository | itryketchup-hub |
| Repo visibility | Public |
| Repository setup | Created and pushed |
| Remote URL | https://github.com/iTryKetchup/itryketchup-hub.git |
| GitHub Pages | Default GitHub Pages deployment verified |
| DNS | Not configured yet |
| HTTPS | Default GitHub Pages HTTPS live; custom domain HTTPS not verified |
| CNAME | Not configured |
| Live URL | https://itryketchup.github.io/itryketchup-hub/ |
| Custom domain target | www.itryketchup.com |

Do not include guessed DNS values. Fill in exact DNS, HTTPS, CNAME, and live URL details only after deployment setup has been performed and verified.

## Repository Setup

The public GitHub repository has been created and `main` has been pushed to `origin/main`.

Repository: https://github.com/iTryKetchup/itryketchup-hub

GitHub Pages is deployed from the Actions workflow. DNS is not configured yet. Custom domain HTTPS is not verified yet. CNAME is not configured.

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

The first workflow run failed during `actions/configure-pages` because GitHub Pages was not yet enabled/configured for this repository. The repository Pages source was then set to GitHub Actions and the workflow rerun successfully.

## v0.9 Default GitHub Pages Deployment Verification

| Field | Status |
|---|---|
| Pages source | GitHub Actions |
| Latest workflow run | Success |
| Workflow run | https://github.com/iTryKetchup/itryketchup-hub/actions/runs/27507506182 |
| Default Pages URL | https://itryketchup.github.io/itryketchup-hub/ |
| Default Pages verification | Passed |
| Pages tested | Home, About, Projects, Dev Logs, Contact, 404 |
| CSS / JS / assets | Loaded from default Pages URL |
| Link checks | Passed |
| Email link | `mailto:itryketchup@gmail.com` confirmed |
| Public repo link | https://github.com/iTryKetchup/itryketchup-hub |
| YouTube | Coming Soon; no YouTube URL configured |
| Pages API check | Public API check returned 404, but workflow and default URL verified |
| Custom domain | Not configured |
| DNS | Not configured |
| HTTPS / custom domain verification | Not verified for custom domain |

Default GitHub Pages deployment was verified on June 14, 2026. Do not configure custom domain, DNS, or CNAME until the dedicated custom-domain phase.

## v0.9 Privacy Remediation

Safe current-file privacy remediation was performed before custom domain setup. No git history rewrite was performed. Custom domain is still not configured, DNS is still not configured, and no CNAME has been added.

## v0.9 Custom Domain Planning

Phase 7A custom domain plan created at `deploy\CustomDomainPlan_v0.9.md`. No custom domain, DNS, CNAME, workflow, deployment, or source changes were made in Phase 7A. Next step: Phase 7B approved custom domain setup.

## v0.9 GitHub Custom Domain Setting

Target custom domain: `www.itryketchup.com`.

GitHub custom domain was not set from this local environment because GitHub CLI is not installed and no authenticated GitHub API token is available. Manual setup required:

1. Open https://github.com/iTryKetchup/itryketchup-hub
2. Go to Settings > Pages.
3. In Custom domain, enter `www.itryketchup.com`.
4. Save.

DNS is still not configured for GitHub Pages. Current public lookup shows `www.itryketchup.com` as a CNAME to `itryketchup.com`, not to the required GitHub Pages target. Next expected DNS record: CNAME `www` -> `iTryKetchup.github.io`. Apex/root DNS for `itryketchup.com` is still pending. HTTPS and custom-domain verification are pending until the GitHub custom domain setting and DNS records are in place.
