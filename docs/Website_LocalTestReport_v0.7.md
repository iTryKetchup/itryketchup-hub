# Website Local Test Report v0.7

## Project

| Field | Value |
|---|---|
| Project name | iTryKetchup Studio Hub |
| Version tested | v0.7 local readiness |
| Test date/time | 2026-06-14 10:36:54 -07:00 |
| Test status | Passed for v0.7 local readiness |

## Local Test Method

```powershell
cd src
python -m http.server 8080
```

Local URL:

<http://localhost:8080/>

## Pages Tested

- Home: `src/index.html`
- About: `src/about.html`
- Projects: `src/projects.html`
- Dev Logs: `src/devlogs.html`
- Contact: `src/contact.html`
- 404: `src/404.html`

## Desktop Checks

| Check | Result |
|---|---|
| Pages load | Passed |
| Navigation works | Passed |
| CSS loads | Passed |
| JS loads | Passed |
| Assets load | Passed |
| No broken visible layout | Passed |
| No browser console errors | Passed |

## Mobile Checks

| Check | Result |
|---|---|
| 390px viewport | Passed |
| 430px viewport | Passed |
| 768px viewport | Passed |
| Mobile nav works | Passed |
| No horizontal overflow | Passed |
| Cards stack cleanly | Passed |
| Buttons remain tappable | Passed |
| Images remain contained | Passed |

## Scope Checks

| Check | Result |
|---|---|
| No Videos page | Passed |
| No project detail pages | Passed |
| No backend, CMS, login, store, comments, database, backend contact form, or payment system | Passed |
| No active analytics | Passed |
| Kitchen Wars not built or implied playable | Passed |
| No full blog engine | Passed |

## Content Checks

| Check | Result |
|---|---|
| Public identity is iTryKetchup Studio | Passed |
| No real-name public copy in `src` | Passed |
| Contact email is [itryketchup@gmail.com](mailto:itryketchup@gmail.com) | Passed |
| YouTube is Coming Soon | Passed |
| No active YouTube link exists before channel approval | Passed |
| Skynet vs Star Wars is labeled as a fan project | Passed |

## Technical Checks

| Check | Result |
|---|---|
| No absolute Windows paths in `src` | Passed |
| No raw design-reference syntax in `src` | Passed |
| JS syntax checks passed | Passed |
| Image paths resolve | Passed |
| Placeholder assets resolve | Passed |
| Favicon path resolves | Passed |

## Known Issues

No known local issues from Phase 4B mobile pass.

## Deployment Readiness Decision

Local testing status: Passed for v0.7 local readiness.

Next step: v0.9 deployment candidate preparation.
