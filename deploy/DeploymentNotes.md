# Deployment Notes - iTryKetchup Studio Hub

| Field | Status |
|---|---|
| Deployment target | GitHub Pages |
| Domain | itryketchup.com |
| Repository | itryketchup-hub |
| Repo visibility | Public |
| Repository setup | Created and pushed |
| Remote URL | https://github.com/iTryKetchup/itryketchup-hub.git |
| GitHub Pages | Custom domain and HTTPS verified |
| DNS | Configured and verified for GitHub Pages |
| HTTPS | Enforce HTTPS enabled and verified |
| CNAME | No repository CNAME file; DNS CNAME configured externally |
| Live URL | https://www.itryketchup.com/ |
| Custom domain target | www.itryketchup.com |

Do not include guessed DNS values. Fill in exact DNS, HTTPS, CNAME, and live URL details only after deployment setup has been performed and verified.

## Repository Setup

The public GitHub repository has been created and `main` has been pushed to `origin/main`.

Repository: https://github.com/iTryKetchup/itryketchup-hub

GitHub Pages is deployed from the Actions workflow. Custom domain DNS and HTTPS are verified for `www.itryketchup.com`. No repository CNAME file is used for the Actions workflow.

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

DNS is now configured for GitHub Pages. Public lookup shows `www.itryketchup.com` as a CNAME to `itryketchup.github.io`, and apex/root A records resolve to GitHub Pages IPs. HTTPS and custom-domain verification are complete.

## v0.9 Custom Domain and HTTPS Verification

| Field | Status |
|---|---|
| Custom domain configured | `www.itryketchup.com` |
| DNS check | Successful |
| Enforce HTTPS | Enabled |
| Final live URL | https://www.itryketchup.com/ |
| Default GitHub Pages URL | https://itryketchup.github.io/itryketchup-hub/ |
| Default URL role | Fallback / reference |
| Apex/root behavior | `itryketchup.com` redirects to `https://www.itryketchup.com/` |
| HTTP behavior | `http://www.itryketchup.com/` and `http://itryketchup.com/` redirect to HTTPS |
| Pages verified | Home, About, Projects, Dev Logs, Contact, 404 |
| CSS / JS / assets | Loaded from custom domain |
| Internal navigation | Passed |
| Footer GitHub link | Passed |
| Email link | `mailto:itryketchup@gmail.com` confirmed |
| YouTube | Coming Soon; no YouTube URL configured |
| Active analytics | None found |

Custom domain and HTTPS verification completed on June 14, 2026. No DNS, GitHub Pages setting, workflow, CNAME file, source, or design changes were made during this verification task.

## v1.0 Launch Readiness Audit

Launch readiness audit completed on June 15, 2026. Current live site: https://www.itryketchup.com/. Custom domain, DNS, and HTTPS remain verified. Default GitHub Pages URL remains available as fallback/reference: https://itryketchup.github.io/itryketchup-hub/.

Audit decision: ready with minor non-blocking notes. The v1.0 launch declaration, tag, and backup checkpoint should be completed in a separate approved phase.

## v1.0 Launch Declaration

v1.0 launch declared on June 15, 2026. Current live URL: https://www.itryketchup.com/.

Custom domain and HTTPS are verified. DNS is stable as of launch. No immediate deployment blockers are known. The default GitHub Pages URL remains available as fallback/reference: https://itryketchup.github.io/itryketchup-hub/.
