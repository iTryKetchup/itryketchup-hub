# Website Content Map - iTryKetchup Studio Hub

## Purpose

This content map defines the public page inventory for iTryKetchup Studio Hub v1.0. It locks what content belongs on each page, what calls to action each page needs, what assets are required, and which future ideas stay out of scope.

This document is a planning reference only. It does not create website pages or source files.

## Public Pages Included in v1.0

- Home
- About
- Projects
- Dev Logs
- Contact
- 404

## Public Pages Excluded from v1.0

- Videos page
- Full project detail pages
- Blog engine
- Store/payments
- Backend contact form

Excluded pages and systems belong in `ParkingLot.md` or a future SOW. They must not be added to v1.0 during the build.

## Global Content Rules

- Public identity is iTryKetchup Studio.
- Do not use any real-name public identity copy.
- YouTube is Coming Soon for v1.0.
- GitHub Pages is the deployment target.
- Target domain is `itryketchup.com`.
- Contact email is [itryketchup@gmail.com](mailto:itryketchup@gmail.com).
- No empty live pages. Every included page needs useful launch-day content or a deliberate Coming Soon state.
- Project and dev log content should be clear, compact, and easy to maintain.

## Visibility States

| State | Public Behavior | Link Rule | Notes |
|---|---|---|---|
| active | Display publicly with usable detail. | May link if destination exists. | Use for the website project and any ready public item. |
| planned | Display as planned work. | Usually no live link. | Good for roadmap-style project cards. |
| coming-soon | Display with Coming Soon label. | No broken link. | Use for YouTube and unfinished future content. |
| hidden | Do not render publicly. | No public link. | May exist in data later for maintenance. |
| disabled | Display only if useful for context. | No active link. | Use when a feature exists as a concept but is intentionally unavailable. |
| archive | Keep out of primary nav. | Optional direct link only if content exists. | For old or historical material. |
| fan-project | Display only with disclaimer. | Link only to safe public material if approved. | Must clearly separate fan work from original IP. |

## Fan Project Disclaimer Rule

Any fan project must include a visible disclaimer near the project title or card text:

> Fan project - not original IP, not affiliated with or endorsed by the original rights holders.

Fan projects must not be presented as original iTryKetchup Studio IP.

## YouTube Coming Soon Rule

YouTube may appear as a link-style item or CTA in v1.0 only if it is clearly marked Coming Soon until the public channel/handle is final. Do not create a Videos page in v1.0.

## Page Inventory

### Home

**Purpose:** Introduce iTryKetchup Studio and route visitors to the main areas of the hub.

**Required sections:**

- Shared navigation
- Browser-frame / wireframe-inspired hero
- Mascot image slot or placeholder-safe hero image
- Short studio introduction
- Current Focus section
- Project preview cards
- Dev log preview
- Shared footer

**Required CTAs:**

- View Projects
- Read Dev Logs
- Contact
- GitHub, or GitHub Coming Soon if repo URL is not ready
- YouTube Coming Soon

**Image/asset needs:**

- Hero mascot placeholder
- Project card placeholder images
- Dev log preview placeholder or icon
- Social preview placeholder for metadata

**Metadata needs:**

- Page title
- Meta description
- Open Graph title
- Open Graph description
- Open Graph image path
- Open Graph URL

### About

**Purpose:** Explain what iTryKetchup Studio is, what it builds, and why the site exists.

**Required sections:**

- Shared navigation
- Page header
- Studio overview
- What the studio builds
- Current learning/build direction
- Function-first build philosophy
- Shared footer

**Required CTAs:**

- View Projects
- Read Dev Logs
- Contact

**Image/asset needs:**

- Mascot or studio placeholder image

**Metadata needs:**

- Page title
- Meta description

### Projects

**Purpose:** Present project cards and clear project status states without creating full detail pages.

**Required sections:**

- Shared navigation
- Page header
- Short projects intro
- Project card grid
- Status labels for active, planned, coming-soon, hidden, disabled, archive, and fan-project entries
- Fan project disclaimer where needed
- Shared footer

**Required CTAs:**

- Contact
- GitHub, or GitHub Coming Soon if repo URL is not ready
- Read Dev Logs

**Image/asset needs:**

- Project image placeholders
- Mascot or badge-style placeholder if final images are missing

**Metadata needs:**

- Page title
- Meta description

### Dev Logs

**Purpose:** Show launch-day dev log previews and establish the future log structure without building a full blog engine.

**Required sections:**

- Shared navigation
- Page header
- Dev logs intro
- Dev log preview/listing cards
- Coming Soon note for future logs
- Shared footer

**Required CTAs:**

- View Projects
- Contact

**Image/asset needs:**

- Dev log placeholder image or icon

**Metadata needs:**

- Page title
- Meta description

### Contact

**Purpose:** Give visitors a clear way to reach iTryKetchup Studio and understand response expectations.

**Required sections:**

- Shared navigation
- Page header
- Contact purpose statement
- Email card using [itryketchup@gmail.com](mailto:itryketchup@gmail.com)
- Response expectation
- GitHub status
- YouTube Coming Soon note
- Shared footer

**Required CTAs:**

- Email iTryKetchup Studio
- GitHub, or GitHub Coming Soon if repo URL is not ready
- Back to Projects

**Image/asset needs:**

- Optional mascot/contact placeholder

**Metadata needs:**

- Page title
- Meta description

### 404

**Purpose:** Help visitors recover from a broken or missing URL.

**Required sections:**

- Friendly error headline
- Short explanation
- Mascot placeholder or simple visual
- Return to Hub button
- Optional footer link

**Required CTAs:**

- Return to Hub
- View Projects

**Image/asset needs:**

- Confused mascot placeholder or simple fallback image

**Metadata needs:**

- Page title
- Meta description

## Asset Summary

| Asset | Folder | Required for v1.0 | Placeholder Allowed |
|---|---|---|---|
| Hero mascot image | `src/assets/mascots/` | Yes | Yes |
| Project images | `src/assets/images/` | Yes | Yes |
| Dev log image/icon | `src/assets/images/` or `src/assets/icons/` | Yes | Yes |
| Favicon | `src/assets/icons/` | Yes before launch | Yes |
| Social preview image | `src/assets/social/` | Yes before launch | Yes |

All public images need descriptive alt text before launch. External asset licenses must be tracked before public use.
The asset folders are allowed to stay placeholder-ready during planning, but the launch still needs actual placeholder files for the mascot image, project card image, favicon, and social preview image before v1.0 is declared ready.

## Metadata Summary

Every public page needs:

- Page title
- Meta description

Home also needs:

- Open Graph title
- Open Graph description
- Open Graph image
- Open Graph URL

## Scope Guard

If a requested item is not listed in this content map, the SOW, or the approved design package, add it to `ParkingLot.md` instead of adding it to v1.0.
