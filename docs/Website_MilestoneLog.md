# Website Milestone Log

This log records major iTryKetchup Studio Hub website milestones and backup checkpoints.

| Milestone | Date | Commit | Status | Notes |
|---|---|---|---|---|
| v0.3 Documentation / Design Package Ready | 2026-06-14 | `7d7e84b` | Complete | Planning documents, content map, style guide, maintenance guide, and Claude design package foundation completed. |
| v0.5 Local Static Site Build | 2026-06-14 | `8308a64` | Complete | Static Home, About, Projects, Dev Logs, Contact, and 404 pages created with shared CSS/JS and placeholder assets. |
| v0.6 Mascot Registry Alignment | 2026-06-14 | `e89222a` | Complete | Mascot/image registry added and page/card image assignments wired through IDs. |
| v0.6 Design Reference Tracked | 2026-06-14 | `ab13fec` | Complete | Raw mascot design reference preserved in `design/references/` with reference-only README guidance. |
| v0.7 Data Wiring Audit | 2026-06-14 | `65d1760` | Complete | Data/config wiring audited; image assignment resolution and fallback behavior tightened. |
| v0.7 Mobile Layout Check | 2026-06-14 | `65d1760` | Complete | Mobile layout checked at 390px, 430px, and 768px; no source changes required after the data wiring audit. |
| v0.7 Local Testing Passed | 2026-06-14 | `f10c3ca` | Complete | Local testing report created and pushed. Tagged as `SITE-v0.7-local-testing-passed`. |
| v0.9 Deployment Candidate Prepared | 2026-06-14 | `3e96677` | Complete | Deployment checklist complete and GitHub Pages Actions strategy selected. Tagged as `SITE-v0.9-deployment-candidate-prepared`. Dev Log will be created separately in the dedicated Dev Log conversation. |
| v0.9 Privacy Remediation | 2026-06-14 | Phase 6D commit | Complete | Safe current-file privacy remediation performed before custom domain setup. No git history rewrite performed. |
| v0.9 Custom Domain and HTTPS Verified | 2026-06-14 | `375a2e7` | Complete | Tagged as `SITE-v0.9-custom-domain-https-verified`. Live URL: https://www.itryketchup.com/. HTTPS enforced; apex/root domain redirects to the primary `www` domain. Dev Log will be created separately in the dedicated Dev Log conversation. |
| v1.0 Launch Readiness Audit | 2026-06-15 | Phase 8A commit | Complete | Launch readiness audit completed. Decision: ready with minor non-blocking notes. v1.0 declaration/tag should be a separate backup step if approved. |
| v1.0 Launch Declared | 2026-06-15 | Phase 8B commit | Complete | Tag: `SITE-v1.0-launch`. Live URL: https://www.itryketchup.com/. Dev Log will be created separately in the dedicated Dev Log conversation. |

## Backup Rule

Every major milestone should have:

- Git commit.
- Push to `origin/main`.
- Git tag when appropriate.
- Local test/report document when appropriate.
- `DeploymentNotes.md` or README update when appropriate.

## Current Checkpoint

`SITE-v1.0-launch` marks the v1.0 Launch Declared milestone commit. The current approved project lane is post-launch Dev Log Session006 and future v1.1 planning.
