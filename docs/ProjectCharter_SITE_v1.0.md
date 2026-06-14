# Project Charter - iTryKetchup Studio Hub

> **Instructions:** Fill this out before writing a Scope of Work. This is a go / no-go document.
> Complete time: 10-15 minutes. One project per charter.

---

## 1. Project Information

| Field | Value |
|---|---|
| **Project Name** | iTryKetchup Studio Hub |
| **Project Code** | SITE |
| **Division** | Studio-wide / Operations |
| **Date Created** | 2026-06-13 |
| **Version** | v1.0 |
| **Status / Lane** | Active |
| **Target Domain** | itryketchup.com |
| **Target Host** | GitHub Pages |
| **Repository** | `itryketchup-hub` public GitHub repository |
| **Public Brand** | iTryKetchup Studio |

---

## 2. Project Summary

> One paragraph. What is this project? What does it do or contain? Write it like you're explaining it to someone who has never heard of it.

iTryKetchup Studio Hub is the public website foundation for iTryKetchup Studio. It presents the studio identity, current projects, dev logs, contact information, GitHub presence, and future content states in one organized static website hosted through GitHub Pages with the target domain itryketchup.com. The v1.0 goal is not to build every future idea, but to ship a polished, maintainable studio hub that can grow cleanly after launch.

---

## 3. Audience

> Who is this project for? Pick the main audience before scope decisions are made.

- [ ] Me only
- [x] Portfolio
- [x] YouTube viewers
- [x] Employers / Recruiters
- [ ] Gamers
- [x] Other: People discovering iTryKetchup Studio projects

**Primary Audience:** Portfolio visitors, recruiters, collaborators, and people discovering iTryKetchup Studio.

**Why:** The site needs to make the studio look real, organized, creative, and easy to explore before full project detail pages, a Videos page, or playable releases exist.

---

## 4. Why This Project Exists

> Check every box that applies. Add a one-line note under each checked item.

- [x] **Problem being solved** - What frustration, gap, or need does this address?
  > iTryKetchup Studio needs one clear public home instead of scattered links, unfinished placeholders, or project information spread across different locations.

- [x] **Skill being learned** - What does this teach you that you don't already know?
  > This project practices shipping a structured static site with maintainable files, responsive pages, deployment documentation, and public-facing polish.

- [x] **Portfolio value** - How does this demonstrate something to a future employer or collaborator?
  > It demonstrates planning discipline, brand presentation, static web development, documentation, deployment readiness, and maintainable project organization.

- [x] **Personal interest** - Do you actually want to build this?
  > Yes. The hub supports future games, dev logs, YouTube content, and studio projects without forcing each one to be built before the website can launch.

---

## 5. Success Definition

> What would make this project a clear win? Be specific. Vague = bad charter.

This project succeeds if:

1. The static HTML/CSS/JavaScript website foundation ships as a polished public studio hub at itryketchup.com through GitHub Pages, or has a documented deployment blocker.
2. Home, About, Projects, Dev Logs, Contact, and 404 pages are planned for v1.0 with clear scope boundaries and no blank public pages.
3. Project cards, project status states, dev log preview/listing structure, contact email, public GitHub link, and YouTube Coming Soon state are represented clearly.
4. The repository structure, documentation, deployment path, and maintenance path are clear enough for future Codex-assisted updates.

---

## 6. Failure Conditions

> What outcomes would make this project a failure? Name them now so you can watch for them.

This project fails if:

- [x] It never ships
- [x] It ships but doesn't meet the minimum success criteria above
- [x] It expands into unrelated website features before the v1.0 foundation is live
- [x] It shifts into game development, a Videos page, active YouTube/video infrastructure, or full project detail pages before the site foundation is complete
- [x] It uses real-name public identity copy instead of the iTryKetchup Studio public brand

---

## 7. Project Lane Assignment

> Where does this project sit right now?

- [ ] **Dream** - Idea only. No development or paperwork yet.
- [ ] **Planning** - Charter and SOW in progress. No active development.
- [x] **Active** - In development. This is the one project receiving build time.
- [ ] **Shipped** - Complete. Meets all ship criteria.

> Only one project can be Active at a time. See Master Plan Section 6.

---

## 8. Initial Scope

> Lock the edges early. Be specific about what is NOT included - that's where scope creep starts.

### Included in v1.0

- Static HTML/CSS/JavaScript website foundation for iTryKetchup Studio Hub.
- GitHub Pages deployment path with target domain `itryketchup.com`.
- Public GitHub repository setup for `itryketchup-hub`.
- Home page.
- About page.
- Projects page.
- Dev Logs page.
- Contact page with [itryketchup@gmail.com](mailto:itryketchup@gmail.com).
- Custom 404 page.
- Shared navigation and footer.
- Project cards and project status states.
- Dev log preview/listing structure.
- YouTube marked Coming Soon.
- Placeholder mascot and project images.
- Favicon placeholder.
- Social preview placeholder.
- Page titles, meta descriptions, and Open Graph metadata.
- README.
- ParkingLot.md.
- DeploymentNotes.md.
- Website maintenance guide.

### Not Included in v1.0

> Everything else goes to ParkingLot.md once the SOW is written.

- CMS.
- Login system.
- Store or payments.
- Comments.
- Database.
- Backend contact form.
- Active analytics tracking.
- Full blog engine.
- Videos page.
- Full project detail pages.
- Kitchen Wars: The Door development.
- Complex animations.
- Final mascot branding polish if placeholders are enough to ship.
- Any real-name public identity copy.

---

## 9. Deliverables

> List every expected output. Playable file, GitHub repo, project page, dev log - name them.

- [x] `docs/ProjectCharter_SITE_v1.0.md`
- [x] `docs/SOW_SITE_v1.0.md`
- [x] `docs/Website_ProjectPlan_v1.0.docx`
- [ ] Website foundation files for the v1.0 static site, only after documentation approval
- [ ] Public GitHub repository: `itryketchup-hub`
- [ ] README
- [ ] ParkingLot.md
- [ ] DeploymentNotes.md
- [ ] Website maintenance guide
- [ ] Live public website at itryketchup.com through GitHub Pages, or documented deployment blocker

---

## 10. Risks and Concerns

> Don't skip this. Name the risks now before they surprise you mid-build.

### Technical Risks
> Tools you haven't used, integrations that might break, unknown complexity.

- Domain, DNS, HTTPS, GitHub Pages hosting, favicon, 404, and Open Graph behavior may need deployment-specific testing.
- Asset paths could break if local absolute paths are accidentally used in public files.
- Responsive layout and accessibility checks may need extra review before launch.
- The GitHub repository must be public for GitHub Pages unless another deliberate hosting path is approved.

### Time Risks
> Competing priorities, unclear scope, underestimated effort.

- Deployment setup may take longer than expected.
- Polishing visuals too early could delay the actual foundation.
- Switching focus into unrelated projects could slow the website launch.

### Scope Risks
> Features that could expand without a firm boundary.

- Adding a Videos page before v1.0.
- Adding full project detail pages before v1.0.
- Expanding into Kitchen Wars: The Door instead of keeping the website as the active project.
- Adding CMS, backend, store, comments, login, database, payments, active analytics, full blog engine, or complex animations before the static foundation ships.
- Publishing real-name public identity copy instead of iTryKetchup Studio brand language.

---

## 11. Resource Requirements

> What do you need before you can build this?

| Category | What's Needed | Status |
|---|---|---|
| **Software** | VS Code, Codex, Git, browser testing tools, GitHub, GitHub Pages workflow | Have it |
| **Assets** | Placeholder mascot images, project images, favicon placeholder, and social preview placeholder until final branding is locked | Need it |
| **Hardware** | Development computer and at least one browser/mobile-width test path | Have it |
| **Budget** | Estimated: $0 for v1.0 static build beyond existing domain/hosting needs | TBD |

---

## 12. Next Step

> What happens immediately after this charter is approved?

- [x] **Write SOW** - Scope of Work is the logical next step for most projects
- [ ] **Research first** - Specific unknown that must be resolved before SOW
- [ ] **Pause** - Project is valid but not the right time
- [ ] **Cancel** - Project does not pass the go / no-go check below

Notes:

The SOW has been created as `docs/SOW_SITE_v1.0.md`. The next practical step after the documentation foundation is confirmed is to complete the remaining planning documents before any HTML, CSS, or JavaScript build work begins.

---

## 13. Approval

> Read the charter top to bottom. Make a decision.

**Decision:**
- [x] **Proceed** - Charter is solid. Move to SOW.
- [ ] **Hold** - Good idea, wrong time. Park it.
- [ ] **Cancel** - Not worth pursuing. Log the reason and move on.

**Reason:**

> iTryKetchup Studio Hub passes the go / no-go check because it creates the necessary public foundation for the studio without requiring future projects, videos, full project pages, or game development to be completed first.

**Approved by:** iTryKetchup Studio  
**Date:** 2026-06-13

---

*iTryKetchup Studio - Build it. Ship it. Log it.*  
*Filename: ProjectCharter_SITE_v1.0.md*  
*Store: docs\*
