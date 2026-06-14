# Scope of Work - iTryKetchup Studio Hub

> **What this document is:** The SOW locks exactly what gets built in this version.
> Fill this out before writing a single line of code or creating any assets.
> One project per SOW. One version per SOW.
>
> **What this document is not:** A wish list. A brainstorm. A character bible.
> New ideas go to ParkingLot.md - not here.
>
> **Requires:** An approved Project Charter must exist before this SOW is written.
> Reference the Charter in Section 2.

---

## 1. Project Information

| Field | Value |
|---|---|
| **Project Name** | iTryKetchup Studio Hub |
| **Project Code** | SITE |
| **Division** | Studio-wide / Operations (Custom Category) |
| **SOW Version** | v1.0 |
| **Target Build Version** | v1.0 |
| **Date Created** | 2026-06-13 |
| **Last Updated** | 2026-06-13 |
| **Current Lane** | Active |
| **GitHub Repo** | `itryketchup-hub` |

---

## 2. Related Charter

> Every SOW must reference an approved Project Charter. Do not proceed without one.

| Field | Value |
|---|---|
| **Charter Filename** | `ProjectCharter_SITE_v1.0.md` |
| **Charter Approved Date** | 2026-06-13 |
| **Charter Status** | Approved |

---

## 3. Project Purpose

iTryKetchup Studio Hub is a centralized, production-grade portfolio and brand-distribution platform for iTryKetchup projects, dev logs, videos, and playable work. The site presents the studio as organized, creative, and execution-focused while giving visitors a clear way to explore projects, watch content, access GitHub work, and understand the roadmap for future updates. It should feel like a serious solo creator studio building real products: polished, practical, memorable, approachable, creative, cute, and funny where appropriate without becoming overly corporate.

---

## 4. Version Goal

**Version Goal:** Ship a polished, maintainable static website foundation for iTryKetchup Studio that is live at itryketchup.com and ready to support projects, dev logs, YouTube content, and future playable work.

**Done looks like:** The site is live, navigable, mobile-friendly, and has real launch-day content on the Home, About, Projects, Dev Logs, and Contact pages. Unfinished sections are clearly marked as Coming Soon, Hidden, or Disabled instead of being left blank or broken. The codebase also has a strict file system, reusable patterns, shared data/config files, placeholder asset support, and maintenance documentation so future updates are frictionless.

**Estimated Completion Target:** 2026-06-20

---

## 5. Success Criteria

This project succeeds if:

1. The website is live at itryketchup.com and accessible without login.
2. The site looks polished and presents iTryKetchup like a real solo creator studio.
3. Home, About, Projects, Dev Logs, Contact, and 404 pages exist and work on desktop and mobile widths.
4. Core features work, future features are clearly marked as Coming Soon, Hidden, or Disabled, and the site includes a clear next-stage update path.
5. The repository structure is clean, maintenance-first, and ready for future updates without requiring a backend.
6. The README, deployment notes, maintenance guide, and project documentation are complete enough to support future Codex-assisted updates.

---

## 6. Ship Criteria

> These are the hard gates. Every box must be checked before the project is declared shipped.
> Per Master Plan Section 16 - Ship Criteria are required in every SOW.
> Add project-specific criteria below the required ones.

**Required for all projects:**
- [ ] Website is accessible at a public URL with no login required.
- [ ] No critical broken pages, broken navigation, or blocking layout issues.
- [ ] README completed in GitHub repository (`itryketchup-hub`).
- [ ] At least one website Dev Log posted or prepared covering the build.
- [ ] Project presence live on itryketchup.com.
- [ ] Practical testing completed on at least 3 browser/device conditions or by 3 external reviewers.
- [ ] Deployment Checklist completed and signed off, or deployment blocker documented.

**Project-specific criteria:**
- [ ] itryketchup.com loads publicly.
- [ ] Home, About, Projects, Dev Logs, Contact, and 404 pages exist.
- [ ] Navigation works across all public pages.
- [ ] Site works on desktop and mobile width.
- [ ] Contact email uses [itryketchup@gmail.com](mailto:itryketchup@gmail.com).
- [ ] GitHub link points to the correct repository or is clearly marked until repo URL is finalized.
- [ ] YouTube link works or is clearly marked Coming Soon until handle is claimed.
- [ ] No empty placeholder pages are live.
- [ ] Coming Soon, Hidden, and Disabled states are handled clearly.
- [ ] Open Graph / social sharing meta tags are included on the Home page.
- [ ] Browser favicon is created, mapped, and loads correctly.
- [ ] Custom 404.html page exists and links visitors back to the Hub.
- [ ] All public images include descriptive alt text.
- [ ] Public pages have page titles and meta descriptions.
- [ ] Analytics is intentionally disabled or documented as not included in v1.0.
- [ ] README includes project purpose, local run instructions, current status, file structure, deployment notes, and live URL once deployed.
- [ ] Deployment Checklist completed and signed off, or deployment blocker documented.

> Do not declare shipped until every box above is checked.
> If a box cannot be checked, document why and decide deliberately.

---

## 7. Included Features

| # | Feature | Notes |
|---|---|---|
| 1 | Home page | Big Mascot Hero, short studio intro, current focus, and links to Projects, Dev Logs, GitHub, YouTube, and Contact. |
| 2 | About page | Explains iTryKetchup Studio, what is being built, and the current learning/build direction. |
| 3 | Projects page | Project cards or sections for active, planned, Coming Soon, Hidden, and Disabled states. No full project pages for every future idea. |
| 4 | Dev Logs page | Static dev log landing page with launch-day content or a clear first entry. No full blog engine. |
| 5 | Contact page | Contact email [itryketchup@gmail.com](mailto:itryketchup@gmail.com), purpose statement, response expectation, GitHub link, and YouTube link or Coming Soon state. |
| 6 | Custom 404 page | Friendly 404.html page that routes visitors back to the Hub. |
| 7 | Shared navigation | Consistent navigation across public pages. |
| 8 | Shared footer | Consistent footer across public pages with relevant studio links and status. |
| 9 | Responsive layout | Mobile-friendly layout for core pages. |
| 10 | Strict file system | Use the required structure listed in Section 10. |
| 11 | Maintenance-first structure | Use reusable patterns, shared data/config files where practical, and clean file organization. |
| 12 | Placeholder asset support | Support placeholder images until final mascot branding is locked. |
| 13 | Coming Soon / Hidden / Disabled states | Unfinished sections must be deliberate states, not broken blanks. |
| 14 | Claude design package support | Include folders and expected docs for PageBlueprints.md, ComponentInventory.md, and CopyDeck.md. |
| 15 | README | Project purpose, status, local run instructions, file structure, deployment notes, and live URL once deployed. |
| 16 | ParkingLot.md | Project parking lot for future ideas and out-of-scope items. |
| 17 | Deployment notes | DeploymentNotes.md and deployment checklist/blocker notes. |
| 18 | Maintenance guide | Website_MaintenanceGuide_v1.0.md as a required planning deliverable. |
| 19 | Open Graph / social metadata | Home page social sharing metadata and social preview placeholder support. |
| 20 | Favicon | Favicon file and page mapping. |
| 21 | Basic accessibility foundation | Semantic HTML, descriptive alt text, keyboard focus states, readable contrast, and useful page titles. |
| 22 | Page metadata | Page titles and meta descriptions for public pages. |
| 23 | Analytics-ready placeholder only | Analytics may be documented as future-ready, disabled, or Parking Lot only. No active tracking script in v1.0. |

---

## 8. Excluded Features

| Feature | Why Excluded | Where It Lives |
|---|---|---|
| CMS | Static launch does not need content management infrastructure. | ParkingLot.md / future version |
| Login system | Not needed for a public studio hub. | ParkingLot.md / future version |
| Store | No products or monetization in v1.0. | ParkingLot.md / future version |
| Comments | Adds moderation and backend scope. | ParkingLot.md / future version |
| Database | Static files are enough for launch. | ParkingLot.md / future version |
| Complex animation | Polish comes after the foundation is live. | ParkingLot.md / future version |
| Overbuilt filtering | Simple project states and sections are enough for v1.0. | ParkingLot.md / future version |
| Full blog engine | Static dev log content is enough for v1.0. | ParkingLot.md / future version |
| Full project pages for every future idea | Cards/stubs are enough for launch. | ParkingLot.md / future version |
| User accounts | Not needed for the v1.0 public site. | ParkingLot.md / future version |
| Payment / donations | Not needed for v1.0. | ParkingLot.md / future version |
| Backend contact form | Mailto contact is enough for v1.0. | ParkingLot.md / future version |
| Kitchen Wars: The Door development | The Door is planning / idea capture only while the website is the Active project. | The Door planning documents / future active lane |
| Active analytics tracking | Analytics is disabled in v1.0 unless deliberately approved later. | ParkingLot.md / future version |

> Every new idea that comes up during development goes to ParkingLot.md.
> The SOW does not expand mid-build without a deliberate decision.

---

## 9. Deliverables

**Planning / documentation:**
- [ ] `docs/ProjectCharter_SITE_v1.0.md`
- [ ] `docs/SOW_SITE_v1.0.md`
- [ ] `docs/Website_ProjectPlan_v1.0.md`
- [ ] `docs/Website_ContentMap_v1.0.md`
- [ ] `docs/Website_StyleGuide_v1.0.md`
- [ ] `docs/Website_MaintenanceGuide_v1.0.md`
- [ ] Website Dev Log
- [ ] Deployment Checklist completed or deployment blocker documented

**Repository / root:**
- [ ] GitHub repository: `itryketchup-hub`
- [ ] `README.md`
- [ ] `ParkingLot.md`
- [ ] `.gitignore`
- [ ] Live website at itryketchup.com

**Source files:**
- [ ] `src/index.html`
- [ ] `src/about.html`
- [ ] `src/projects.html`
- [ ] `src/devlogs.html`
- [ ] `src/contact.html`
- [ ] `src/404.html`
- [ ] `src/css/styles.css`
- [ ] `src/js/main.js`
- [ ] `src/js/site-settings.js`
- [ ] `src/js/projects-data.js`
- [ ] `src/js/devlogs-data.js`

**Assets:**
- [ ] `src/assets/images/`
- [ ] `src/assets/icons/`
- [ ] `src/assets/icons/favicon.ico` or equivalent favicon file
- [ ] `src/assets/mascots/`
- [ ] `src/assets/social/`
- [ ] Social preview image placeholder
- [ ] Placeholder images included or documented
- [ ] External asset licenses tracked if external assets are used

**Deployment:**
- [ ] `deploy/CNAME` if required
- [ ] `deploy/DeploymentNotes.md`
- [ ] GitHub Pages / hosting settings documented
- [ ] GoDaddy DNS settings documented once configured
- [ ] HTTPS status documented once available

---

## 10. Technical Requirements

| Component | Decision | Notes |
|---|---|---|
| **Language** | HTML / CSS / JavaScript | Static website foundation. |
| **Framework / Engine** | None for v1.0 | Keep the launch simple, portable, and maintainable. |
| **Hosting** | GitHub Pages / static hosting path to be documented during deployment | Domain target is itryketchup.com. |
| **Version Control** | GitHub - `itryketchup-hub` | Required, but repository creation is not part of this SOW-writing task. |
| **Branch structure** | main / dev / feature/* | Per Master Plan Section 18.3 once repository exists. |
| **Other tools** | VS Code, Codex, browser testing, GitHub, hosting dashboard, GoDaddy/domain tools if needed | Use only what is needed to ship the public static site. |

### Required File System

The project must use this structure:

```text
Project repository root
|-- docs
|   |-- ProjectCharter_SITE_v1.0.md
|   |-- SOW_SITE_v1.0.md
|   |-- Website_ProjectPlan_v1.0.md
|   |-- Website_ContentMap_v1.0.md
|   |-- Website_StyleGuide_v1.0.md
|   `-- Website_MaintenanceGuide_v1.0.md
|-- design
|   |-- claude
|   |   |-- PageBlueprints.md
|   |   |-- ComponentInventory.md
|   |   `-- CopyDeck.md
|   `-- references
|-- src
|   |-- index.html
|   |-- about.html
|   |-- projects.html
|   |-- devlogs.html
|   |-- contact.html
|   |-- 404.html
|   |-- css
|   |   `-- styles.css
|   |-- js
|   |   |-- main.js
|   |   |-- site-settings.js
|   |   |-- projects-data.js
|   |   `-- devlogs-data.js
|   `-- assets
|       |-- images
|       |-- icons
|       |   `-- favicon.ico
|       |-- mascots
|       `-- social
|           `-- social-preview-placeholder.png
|-- deploy
|   |-- CNAME
|   `-- DeploymentNotes.md
|-- archive
|-- temp
|-- README.md
|-- ParkingLot.md
`-- .gitignore
```

---

## 11. Asset Plan

| Asset Type | Source | Status | License Tracked? |
|---|---|---|---|
| Mascot images | Placeholder mascot images until final branding is locked | Need final selections before public launch | Yes, if external assets are used |
| Project images | Placeholder images or documented temporary assets | Need launch-day placeholders | Yes, if external assets are used |
| Social preview image | Placeholder in `src/assets/social/` | Need placeholder for v1.0 | Yes, if external assets are used |
| Favicon | Placeholder or simple branded favicon for v1.0 | Need v1.0 file | Yes, if external assets are used |
| Icons | Local/simple icons or carefully licensed external icons | Create or select during build | Yes, if external assets are used |
| Sound FX | Not needed for v1.0 | Not applicable | Not applicable |
| Music | Not needed for v1.0 | Not applicable | Not applicable |

> Log every acquired external asset before public use. Placeholder assets are acceptable for v1.0 if they are clearly documented and legally safe to publish.

---

## 12. Testing Requirements

Testing is not optional. For this website SOW, playtesting means practical review of the live static site.

### Internal Testing

- [ ] Local site test
- [ ] Live URL test
- [ ] Navigation test
- [ ] GitHub link test
- [ ] YouTube link / Coming Soon test
- [ ] Mailto link test
- [ ] Desktop layout check
- [ ] Mobile layout check
- [ ] Favicon check
- [ ] 404 page check
- [ ] Open Graph / metadata check
- [ ] Alt text check
- [ ] Keyboard focus state check
- [ ] Analytics disabled / documented check
- [ ] No absolute local asset paths in public files
- [ ] Coming Soon / Hidden / Disabled states behave correctly

### External / Practical Testing

Because this is a static site, use one of these:

- [ ] Minimum 3 external people review the site.
- [ ] If external reviewers are not available before launch, test on 3 browser/device conditions and document this as a temporary website review substitute.

Recommended browser/device checks:

1. Desktop browser.
2. Mobile-width browser/dev tools.
3. Phone or alternate browser if available.

---

## 13. Risks

### Technical Risks

- Hosting / deployment setup could take longer than expected.
- Domain, DNS, HTTPS, or publishing configuration could slow down launch.
- Mobile layout may require extra testing.
- Image sizes could slow the site if not optimized.
- Asset paths may break after deployment if local absolute paths are used in public files.
- Open Graph, favicon, and 404 behavior may vary by host and should be tested after deployment.

### Scope Risks

- Adding too many animations before the site works.
- Adding too many project pages before the basic hub is live.
- Turning the site into a CMS or database project too early.
- Trying to make every image perfect before launch.
- Expanding into Kitchen Wars: The Door development before the website foundation is live.
- Adding active analytics before a deliberate approval decision.

### Time Risks

- Hosting / deployment troubleshooting could take longer than expected.
- Job search or capstone deadlines can override studio work.
- Too much time spent polishing could delay launch.
- Switching between website and Door planning could split focus.

### Burnout Risk

- Mitigation: Use a hard ship target. Function first. Style second. Polish can continue after v1.0.

---

## 14. Version Milestones

| Version | Milestone Name | What It Proves | Content Trigger |
|---|---|---|---|
| v0.1 | Foundation Files | Repository and required file structure exist locally. | Dev Log |
| v0.3 | Documentation Ready | Project plan, content map, style guide, and maintenance guide exist. | Progress update |
| v0.5 | Local Site Working | All public pages exist and navigation works locally. | Progress update / screenshot |
| v0.7 | Launch Content Filled | Launch-day copy, placeholder assets, metadata, 404, and favicon are in place. | Dev Log |
| v0.9 | Deployment Candidate | Content is in place, layout checked, links tested, and analytics is disabled/documented. | Website launch prep dev log |
| v1.0 | Live Website | itryketchup.com is public and usable, or deployment blocker is documented. | Launch dev log / short |

> Do not add features at v0.9 or later - bug fixes and polish only.

---

## 15. Parking Lot Rule

> **Any feature not listed in Included Features is automatically out of scope and belongs in ParkingLot.md.**

Every active project maintains a `ParkingLot.md` in its project root.

| Field | Detail |
|---|---|
| **Filename** | `ParkingLot.md` - one per project, lives in project root |
| **Project Location** | `ParkingLot.md` |
| **Format** | Date added \| Idea \| Category \| Notes |
| **Categories** | Mechanic / Character / Story / Website / Social / Tech / Other |
| **Review cycle** | Review at ship - promote to next SOW or discard |

When to add something to ParkingLot.md:

- A new idea comes up during a build session -> ParkingLot.md
- A feature request arrives that is not in the SOW -> ParkingLot.md
- You think "this would be cool to add" -> ParkingLot.md
- Anything not explicitly in Section 7 of this SOW -> ParkingLot.md

Starter entries for this project Parking Lot:

| Idea | Category | Notes |
|---|---|---|
| CMS / blog engine | Website | Future version only |
| More animations | Website | After v1.0 is live |
| Full project pages | Website | Future version only |
| Store / payments | Website | Not needed for v1.0 |
| Backend contact form | Website | Future version only |
| Active analytics tracking | Website | Future version only; no active tracking script in v1.0 |
| Final branded favicon | Website | Replace v1.0 placeholder later |
| Final social preview image | Website | Replace v1.0 placeholder later |

---

## 16. Approval

> Read the SOW top to bottom. Confirm it matches the Charter. Make a decision.

**Pre-approval check:**
- [x] Charter reviewed and referenced in Section 2
- [x] Included Features list is complete and specific
- [x] Excluded Features list names obvious scope risks
- [x] Ship Criteria are concrete and checkable
- [x] All deliverables listed
- [x] Technical stack locked
- [x] Asset sources identified
- [x] Risks named

**Decision:**
- [x] **Approved - proceed to build.** SOW is locked. New ideas go to ParkingLot.md.
- [ ] **Revise - not ready.** Reason: Not selected.
- [ ] **Hold - valid project, wrong time.** Park it.

**Project Status After Approval:**
- [ ] Planning
- [x] Active
- [ ] Shipped
- [ ] On Hold

**Approved by:** Project owner
**Date:** 2026-06-13

---

*iTryKetchup Studio - Build it. Ship it. Log it.*  
*Filename: SOW_SITE_v1.0.md*  
*Store: docs\*
