# Page Blueprints - iTryKetchup Studio Hub

## Purpose

This is the build blueprint Codex should use later when creating the static website. It defines page structure and behavior only. It does not create HTML, CSS, or JavaScript.

## Global Layout Rules

- Use an off-white canvas.
- Use browser-frame / wireframe-inspired panels for the main visual language.
- Use a mobile-stacked layout.
- Keep pages simple, readable, and maintenance-first.
- Use mascot/image slots as visual identity, with placeholder-safe fallbacks.
- Use cards for projects and dev log previews.
- No empty live pages.
- Use iTryKetchup Studio as the public identity.
- Do not use real-name public identity copy.
- Do not build a Videos page in v1.0.
- Do not build full project detail pages in v1.0.

## Shared Nav Blueprint

**Purpose:** Provide consistent navigation across all public pages.

**Items:**

- Home
- About
- Projects
- Dev Logs
- Contact

**Optional/action items:**

- GitHub, once the public repository URL exists
- YouTube Coming Soon

**Behavior:**

- Desktop: horizontal nav.
- Mobile: stacked or compact menu.
- Current page should be visually indicated.
- Coming Soon items should not create broken links.

## Shared Footer Blueprint

**Content:**

- iTryKetchup Studio name
- Short status line
- Contact email
- GitHub status/link
- YouTube Coming Soon
- No active analytics note is not required publicly, but may be documented.

**Behavior:**

- Appears on Home, About, Projects, Dev Logs, and Contact.
- 404 may use a lighter footer or return link.

## Home Page Blueprint

**Page goal:** Introduce the studio and route visitors.

**Section order:**

1. Shared nav
2. Hero browser-frame panel
3. Studio intro / mission
4. Current Focus
5. Project preview cards
6. Dev log preview
7. Shared footer

**Hero content:**

- Site name
- Short headline
- Mascot image slot
- One short mission paragraph

**CTA placement:**

- Primary: View Projects
- Secondary: Read Dev Logs
- Secondary: Contact
- Utility: GitHub or GitHub Coming Soon
- Utility: YouTube Coming Soon

**Placeholder asset notes:**

- Use a mascot placeholder if final mascot art is missing.
- Use descriptive alt text.

**Metadata notes:**

- Title
- Meta description
- Open Graph title
- Open Graph description
- Open Graph image
- Open Graph URL

## About Page Blueprint

**Page goal:** Explain what iTryKetchup Studio is and what it is building.

**Section order:**

1. Shared nav
2. Page header
3. Studio overview
4. What the studio builds
5. Current direction
6. Build philosophy
7. Shared footer

**CTA placement:**

- View Projects after studio overview
- Read Dev Logs near current direction
- Contact near end

**Placeholder asset notes:**

- Optional mascot/studio placeholder.

**Metadata notes:**

- Title
- Meta description

## Projects Page Blueprint

**Page goal:** Show project cards and status without full project detail pages.

**Section order:**

1. Shared nav
2. Page header
3. Projects intro
4. Project card grid
5. Fan project disclaimer area if needed
6. Shared footer

**Project cards:**

- iTryKetchup Studio Hub
- Kitchen Wars: The Door
- Kitchen Wars: The Crisper
- First Wolf
- Skynet vs Star Wars fan project
- Career Tracker

**States to support:**

- active
- planned
- coming-soon
- hidden
- disabled
- archive
- fan-project

**CTA placement:**

- Project cards may include disabled/coming-soon link areas.
- Page-level CTA to Contact.
- Page-level CTA to Dev Logs.

**Placeholder asset notes:**

- Use project image placeholders where final art is missing.
- Fan project card must show disclaimer.

**Metadata notes:**

- Title
- Meta description

## Dev Logs Page Blueprint

**Page goal:** Show launch-day dev log previews without building a full blog engine.

**Section order:**

1. Shared nav
2. Page header
3. Dev logs intro
4. Dev log card list
5. Future logs Coming Soon note
6. Shared footer

**Initial entries:**

- Week 1 Foundation Complete
- Website Charter and SOW Approved

**CTA placement:**

- View Projects
- Contact

**Placeholder asset notes:**

- Use a simple icon or placeholder image if needed.

**Metadata notes:**

- Title
- Meta description

## Contact Page Blueprint

**Page goal:** Make contact simple and clear.

**Section order:**

1. Shared nav
2. Page header
3. Contact purpose statement
4. Contact card
5. Response expectation
6. GitHub and YouTube status
7. Shared footer

**Required contact:**

- [itryketchup@gmail.com](mailto:itryketchup@gmail.com)

**CTA placement:**

- Email iTryKetchup Studio
- View Projects
- GitHub or GitHub Coming Soon

**Metadata notes:**

- Title
- Meta description

## 404 Page Blueprint

**Page goal:** Recover from missing pages gracefully.

**Section order:**

1. 404 headline
2. Friendly explanation
3. Confused mascot placeholder or simple visual
4. Return to Hub button
5. Optional Projects link

**CTA placement:**

- Primary: Return to Hub
- Secondary: View Projects

**Metadata notes:**

- Title
- Meta description

## Mobile Behavior Notes

- Stack navigation, hero content, cards, and CTAs vertically.
- Keep buttons large enough to tap.
- Avoid horizontal scrolling.
- Keep image placeholders responsive.
- Ensure card labels wrap cleanly.

## Placeholder Asset Notes

- Placeholder assets are allowed for v1.0.
- Missing final mascot branding must not block launch if placeholders are good enough.
- Broken image slots are not allowed.
- Every public image needs descriptive alt text.

## Scope Notes

- Do not build Videos page in v1.0.
- Do not build full project detail pages in v1.0.
- Do not add backend, CMS, login, store, comments, database, backend contact form, payment system, or active analytics.
- Do not build Kitchen Wars: The Door during the website sprint.
