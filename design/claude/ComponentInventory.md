# Component Inventory - iTryKetchup Studio Hub

## Purpose

This inventory lists reusable website components for the future static build. It is a design/build reference only and does not create source files.

## Component List

### Site Shell

**Purpose:** Wrap every public page in consistent structure.

**Used on:** Home, About, Projects, Dev Logs, Contact, 404.

**Content/data needed:** Page title, page metadata, nav items, footer items, main content.

**Behavior:** Provides consistent layout width, background, and page rhythm.

**Accessibility notes:** Main content should use a `main` landmark later in build.

**Build notes:** Keep global shell simple and static.

### Browser-Frame Container / Panel Style

**Purpose:** Provide the wireframe/browser-inspired visual identity.

**Used on:** Hero, major page sections, contact card, 404 block.

**Content/data needed:** Section title, optional controls/dots, body content.

**Behavior:** Frames content without hiding it inside overly decorative UI.

**Accessibility notes:** Decorative browser controls should be ignored by assistive tech if implemented visually.

**Build notes:** Use restrained borders and off-white panels.

### Header/Nav

**Purpose:** Primary site navigation.

**Used on:** Home, About, Projects, Dev Logs, Contact.

**Content/data needed:** Page links, GitHub status/link, YouTube Coming Soon label.

**Behavior:** Shows current page and routes to existing pages only.

**Accessibility notes:** Use semantic navigation and visible focus states.

**Build notes:** Do not include Videos page.

### Mobile Nav

**Purpose:** Mobile-friendly version of primary nav.

**Used on:** All public pages except optionally simplified 404.

**Content/data needed:** Same as Header/Nav.

**Behavior:** Stacks or collapses cleanly at mobile widths.

**Accessibility notes:** Tap targets must be large enough and keyboard usable.

**Build notes:** Keep simple; no complex menu animation in v1.0.

### Footer

**Purpose:** Provide repeated closing links and site status.

**Used on:** Home, About, Projects, Dev Logs, Contact.

**Content/data needed:** Studio name, contact email, GitHub status, YouTube Coming Soon.

**Behavior:** Stays consistent across pages.

**Accessibility notes:** Footer links need meaningful labels.

**Build notes:** Keep compact.

### Hero Block

**Purpose:** First-screen identity and routing area.

**Used on:** Home.

**Content/data needed:** Headline, mission statement, mascot image, CTAs.

**Behavior:** Introduces iTryKetchup Studio and sends visitors to Projects/Dev Logs/Contact.

**Accessibility notes:** Mascot image needs descriptive alt text or empty alt if decorative.

**Build notes:** Use browser-frame panel and avoid marketing-page bloat.

### Section Header

**Purpose:** Label major page sections.

**Used on:** All pages.

**Content/data needed:** Heading, optional short description.

**Behavior:** Separates content clearly.

**Accessibility notes:** Preserve semantic heading order.

**Build notes:** Handwritten-style headings allowed.

### Project Card

**Purpose:** Show a project summary without a full detail page.

**Used on:** Home preview, Projects.

**Content/data needed:** Title, category, status, visibility, summary, image, alt text, link state, badges.

**Behavior:** Displays card if public state allows it; avoids broken links.

**Accessibility notes:** Card links need meaningful text.

**Build notes:** Fan projects must include disclaimer. No full detail pages in v1.0.

### Dev Log Card

**Purpose:** Show a static dev log preview.

**Used on:** Home preview, Dev Logs.

**Content/data needed:** Title, date, project code, summary, link state, optional image/icon.

**Behavior:** Shows launch-day entries and future Coming Soon state.

**Accessibility notes:** Dates should be readable text.

**Build notes:** Do not build a full blog engine in v1.0.

### Status Badge

**Purpose:** Communicate project/content state.

**Used on:** Project cards, dev log cards, status rows.

**Content/data needed:** State label.

**Behavior:** Shows Active, Planned, Coming Soon, Hidden, Archive, Disabled, or Fan Project.

**Accessibility notes:** Do not rely on color alone.

**Build notes:** Keep labels short.

### Coming Soon Label

**Purpose:** Mark unfinished but intentional content.

**Used on:** YouTube, future projects, future logs.

**Content/data needed:** Label text and optional note.

**Behavior:** Prevents unfinished items from looking broken.

**Accessibility notes:** Text must be visible and readable.

**Build notes:** Do not link to missing destinations.

### Fan Project Disclaimer Block

**Purpose:** Clarify non-original IP status.

**Used on:** Projects page and fan project cards.

**Content/data needed:** Disclaimer text.

**Behavior:** Appears near fan project card content.

**Accessibility notes:** Must be readable and not hidden in tiny text.

**Build notes:** Required for Skynet vs Star Wars fan project.

### CTA Button

**Purpose:** Primary action link.

**Used on:** Home, About, Projects, Dev Logs, Contact, 404.

**Content/data needed:** Label, target URL, state.

**Behavior:** Navigates to existing pages or email.

**Accessibility notes:** Visible focus state and meaningful text required.

**Build notes:** Disabled/Coming Soon buttons must not create broken links.

### Link Button

**Purpose:** Secondary action link.

**Used on:** Cards, footer, contact, hero.

**Content/data needed:** Label, target URL, state.

**Behavior:** Supports quieter navigation.

**Accessibility notes:** Must be keyboard reachable.

**Build notes:** Use for GitHub or Coming Soon status.

### Contact Card

**Purpose:** Present contact email and response expectation.

**Used on:** Contact page, optional footer/home CTA.

**Content/data needed:** Email, purpose statement, response note, social status.

**Behavior:** Uses mailto email link.

**Accessibility notes:** Link text should include the email address.

**Build notes:** No backend contact form in v1.0.

### 404 Block

**Purpose:** Friendly missing-page recovery.

**Used on:** 404.

**Content/data needed:** Headline, message, mascot placeholder, return links.

**Behavior:** Routes visitor back to Home or Projects.

**Accessibility notes:** Use clear heading and links.

**Build notes:** Keep lightweight.

### Placeholder Image Block

**Purpose:** Provide deliberate visual placeholders.

**Used on:** Hero, cards, dev logs, contact, 404.

**Content/data needed:** Placeholder label, image path, alt text.

**Behavior:** Keeps layout complete until final assets are ready.

**Accessibility notes:** Alt text must describe what the placeholder represents.

**Build notes:** Broken image slots are not allowed.

### Mascot Image Slot

**Purpose:** Reserve space for mascot skins as brand identity.

**Used on:** Home hero, About, Contact, 404.

**Content/data needed:** Mascot image path, alt text, optional state/theme.

**Behavior:** Displays final or placeholder mascot image.

**Accessibility notes:** Use descriptive alt text if meaningful.

**Build notes:** Final mascot polish is future work if placeholders ship.

### Metadata Pattern

**Purpose:** Keep page titles, descriptions, and Open Graph consistent.

**Used on:** All public pages; Home needs Open Graph.

**Content/data needed:** Title, description, OG title, OG description, OG image, OG URL.

**Behavior:** Improves sharing and page clarity.

**Accessibility notes:** Page title should clearly identify the page.

**Build notes:** Do not use metadata that overpromises unfinished work.

### Accessibility/Focus Pattern

**Purpose:** Ensure keyboard and readability basics are present.

**Used on:** All interactive elements.

**Content/data needed:** Focus styles, link labels, alt text, semantic headings.

**Behavior:** Visible focus and usable navigation.

**Accessibility notes:** Required for v1.0.

**Build notes:** Include in CSS build later; no active build in this phase.
