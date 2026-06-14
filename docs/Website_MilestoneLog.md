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

## Backup Rule

Every major milestone should have:

- Git commit.
- Push to `origin/main`.
- Git tag when appropriate.
- Local test/report document when appropriate.
- `DeploymentNotes.md` or README update when appropriate.

## Current Checkpoint

`SITE-v0.9-deployment-candidate-prepared` marks the v0.9 Deployment Candidate Prepared milestone commit. The current approved project lane is default Pages verification and safe privacy remediation before custom domain setup.
