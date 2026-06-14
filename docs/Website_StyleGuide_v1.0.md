# Website Style Guide - iTryKetchup Studio Hub

## Brand Summary

iTryKetchup Studio is a small, organized, creative studio identity for projects, dev logs, and future playable work. The site should feel like a serious solo creator studio with enough charm to be memorable: cute, practical, clear, and a little funny where it helps.

The public brand is iTryKetchup Studio. Do not use real-name public identity copy.

## Tone Rules

- Clear before clever.
- Friendly without becoming sloppy.
- Slightly funny is allowed; goofy enough to hurt trust is not.
- Talk like a builder documenting real work.
- Do not overpromise playable work that is not live.
- Label unfinished areas honestly with Coming Soon, Planned, Hidden, Archive, Disabled, or Fan Project states.
- Do not make the site overly corporate.
- Do not make the site messy.

## Visual Direction

- Off-white canvas as the main background.
- Browser-frame / wireframe-inspired layout language.
- Handwritten-style headings are allowed for personality.
- Readable body font is required.
- Ketchup red/orange accent color.
- Mascot skins are a core visual identity idea.
- Placeholder-safe image system.
- Mobile stacked layout.
- Simple card-based project and dev log presentation.
- Function first, style second.

## Color Roles

Exact hex values are not locked yet. Use descriptive roles during design/build:

| Role | Description | Usage |
|---|---|---|
| Off-white canvas | Warm neutral page background | Main page background |
| Ink text | Dark readable text | Body copy and headings |
| Soft panel line | Light border color | Browser frames, cards, dividers |
| Ketchup red | Primary accent | Buttons, links, important labels |
| Ketchup orange | Secondary accent | Highlights, hover states, decorative marks |
| Pickle green | Optional supporting accent | Success or active status |
| Mustard yellow | Optional supporting accent | Planned or coming soon status |
| Disabled gray | Muted neutral | Disabled/hidden/archive labels |

Avoid a one-note palette. The site should not become all red/orange or all beige.

## Typography Direction

- Handwritten-style headings are allowed for major page titles and select section headings.
- Body copy must use a readable sans-serif or similarly legible font.
- Fallback fonts are required for every font stack.
- Do not use tiny body text.
- Do not use font-size scaling that depends directly on viewport width.
- Letter spacing should normally stay at `0`.
- Keep compact UI labels readable.

Suggested font roles:

| Role | Direction |
|---|---|
| Display/headings | Handwritten-style or friendly display face with safe fallback |
| Body | Clean readable sans-serif |
| UI labels | Body font or compact sans-serif |
| Code/file labels | Monospace only where useful |

## Layout Rules

- Use a constrained content width for readable text.
- Use full-width page bands or unframed layouts; avoid nesting cards inside cards.
- Browser-frame panels may frame major content blocks, but should stay functional and not become clutter.
- Mobile layout stacks vertically.
- Navigation must be easy to scan.
- Every page should have a clear first-screen purpose.
- No empty live pages.

## Card Rules

- Cards are for repeated items such as projects and dev logs.
- Keep border radius modest.
- Use consistent spacing, title, status badge, summary, and action area.
- Cards may include placeholder image slots.
- Cards must not resize unpredictably when badges or labels change.
- Do not create full project detail pages in v1.0.

## Button Rules

- Buttons are for clear actions.
- Primary button uses ketchup red or orange accent.
- Secondary/link button can be quieter.
- Disabled or Coming Soon buttons must not look clickable unless they are intentionally linked.
- Button text must fit cleanly on mobile and desktop.
- Every interactive button/link needs a visible focus state.

## Badge and Status Label Rules

Use badges for project and content state:

- Active
- Planned
- Coming Soon
- Hidden
- Archive
- Disabled
- Fan Project

Badges should be short, readable, and visually distinct. Fan Project badges must be paired with disclaimer copy.

## Image Rules

- Use mascot images and project placeholders intentionally.
- Every public image needs descriptive alt text.
- Placeholder images are acceptable if they look deliberate.
- Do not use broken image links.
- Avoid absolute local file paths in public source.
- Optimize image sizes before public launch.

## Placeholder Rules

- Placeholders are allowed for mascot, project, favicon, and social preview assets.
- Placeholders must not look like missing content.
- Placeholder labels should communicate status without apologizing too much.
- Final mascot branding polish is future work if placeholders are enough to ship.

## Accessibility Rules

- Maintain readable contrast between text and backgrounds.
- Provide visible keyboard focus states.
- Use descriptive alt text for images.
- Use semantic heading order.
- Keep pages usable on mobile widths.
- Do not rely on color alone to communicate status.
- Links must have meaningful text.
- Page titles and meta descriptions are required.

## Animation Rule

Animation should be minimal in v1.0. Use simple hover/focus transitions only if they support clarity. Do not add complex animation before v1.0.

## Public Identity Rule

All public-facing copy should use iTryKetchup Studio. Do not include real names in public site copy.
