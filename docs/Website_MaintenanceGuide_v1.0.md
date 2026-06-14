# Website Maintenance Guide - iTryKetchup Studio Hub

## Purpose

This guide explains how to update the iTryKetchup Studio Hub after the v1.0 site build begins. The goal is to keep future changes safe, deliberate, and easy for Codex-assisted sessions to understand.

This is a planning document. It does not create or edit website source files.

## File Structure Overview

```text
C:\Projects\Websites\itryketchup-hub
|-- docs
|   |-- ProjectCharter_SITE_v1.0.md
|   |-- SOW_SITE_v1.0.md
|   |-- Website_ProjectPlan_v1.0.docx
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
|   |-- css
|   |-- js
|   `-- assets
|       |-- images
|       |-- icons
|       |-- mascots
|       `-- social
|-- deploy
|-- archive
|-- temp
|-- README.md
|-- ParkingLot.md
`-- .gitignore
```

## How to Update Site Settings

After the build phase creates `src/js/site-settings.js`, update global values there first:

- Studio name
- Tagline
- Contact email
- GitHub URL or Coming Soon state
- YouTube URL or Coming Soon state
- Feature flags
- Global labels
- Metadata defaults if included there

Do not duplicate global settings across HTML pages unless absolutely necessary.

## How to Add or Update a Project Card Later

After the build phase creates `src/js/projects-data.js`, update project cards through that data file first.

Each project should include:

- Title
- Category or division
- Status
- Visibility state
- Short description
- Image path
- Alt text
- Link, or empty/no link if not ready
- Fan project flag if applicable
- Disclaimer text if applicable

Do not create full project detail pages in v1.0. If a project needs more detail, add the idea to `ParkingLot.md`.

## How to Add or Update a Dev Log Later

After the build phase creates `src/js/devlogs-data.js`, update dev log previews through that data file first.

Each dev log should include:

- Title
- Date
- Project code
- Summary
- Visibility state
- Link, or no link if only a preview exists
- Optional image/icon path
- Alt text if an image is used

Do not turn v1.0 into a full blog engine.

## How to Mark Items Coming Soon, Hidden, Disabled, Archive, or Fan Project

Use these state rules consistently:

| State | Use When | Public Behavior |
|---|---|---|
| coming-soon | The item is planned but not ready. | Show label, avoid broken links. |
| hidden | The item should not be public. | Do not render publicly. |
| disabled | The item is intentionally unavailable. | Show only if useful for context; no active link. |
| archive | The item is old or historical. | Keep out of primary navigation. |
| fan-project | The item uses non-original IP. | Show disclaimer clearly. |

Fan project disclaimer:

> Fan project - not original IP, not affiliated with or endorsed by the original rights holders.

## How to Update Images Safely

- Keep public image assets inside `src/assets/`.
- Use `src/assets/images/` for general project/dev log images.
- Use `src/assets/icons/` for favicon and icons.
- Use `src/assets/mascots/` for mascot images.
- Use `src/assets/social/` for social preview images.
- Use relative public paths in source files.
- Do not use absolute local paths in public files.
- Add descriptive alt text for every public image.
- Track external asset licenses before public use.
- Placeholder images are allowed if they look deliberate.

## How to Update Contact and Social Links

- Contact email for v1.0 is [itryketchup@gmail.com](mailto:itryketchup@gmail.com).
- GitHub should point to the public `itryketchup-hub` repository once it exists.
- YouTube is Coming Soon for v1.0 unless a final public channel/handle is approved.
- If a link is not ready, mark it Coming Soon and do not create a broken link.

## How to Update Metadata

Every public page needs:

- Page title
- Meta description

Home also needs:

- Open Graph title
- Open Graph description
- Open Graph image
- Open Graph URL

Keep metadata accurate. Do not claim playable releases, videos, or features that are not live.

## What Not to Edit Unless Necessary

- Do not edit generated or already-tested page structure without a reason.
- Do not duplicate project/dev log content directly into multiple pages if data files can drive it.
- Do not edit `src` files during documentation-only phases.
- Do not add backend, CMS, login, store, comments, database, backend contact form, payment system, or active analytics in v1.0.
- Do not add a Videos page in v1.0.
- Do not add full project detail pages in v1.0.
- Do not build Kitchen Wars: The Door during the website sprint.

## ParkingLot Rule

Any new idea that is outside the approved v1.0 SOW goes into `ParkingLot.md`.

Do not expand the SOW mid-build because an idea is interesting. Capture it, then review it after v1.0 ships.

## Deployment Notes Rule

Use `deploy/DeploymentNotes.md` to record deployment facts only after they are known:

- GitHub Pages configuration
- Domain setup
- DNS records
- CNAME status
- HTTPS status
- Live URL
- Deployment blockers

Do not guess DNS values.

## Pre-Update Checklist

- [ ] Confirm the change belongs in v1.0.
- [ ] Check `ProjectCharter_SITE_v1.0.md`.
- [ ] Check `SOW_SITE_v1.0.md`.
- [ ] Check `Website_ContentMap_v1.0.md`.
- [ ] Confirm the change is not a Videos page, full project detail page, backend feature, or active analytics.
- [ ] Confirm public copy uses iTryKetchup Studio and no real names.
- [ ] Confirm fan projects have a disclaimer.
- [ ] Add out-of-scope ideas to `ParkingLot.md`.

## Pre-Deployment Checklist

- [ ] All six public pages exist.
- [ ] Navigation works across pages.
- [ ] No empty live pages.
- [ ] Contact email works.
- [ ] GitHub link works or is clearly marked Coming Soon.
- [ ] YouTube is marked Coming Soon if no final channel/handle is approved.
- [ ] Favicon is mapped.
- [ ] Home Open Graph metadata exists.
- [ ] Every page has a title and meta description.
- [ ] All public images have alt text.
- [ ] Mobile layout is usable.
- [ ] Keyboard focus states are visible.
- [ ] Analytics is disabled / not included in v1.0.
- [ ] DeploymentNotes.md is updated with verified facts only.

## Analytics Rule

No active analytics in v1.0 unless deliberately approved in a future version. Analytics may be documented as future-ready or parked in `ParkingLot.md`.
