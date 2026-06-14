# iTryKetchup Studio Hub

## Purpose

iTryKetchup Studio Hub is the public website foundation for iTryKetchup Studio. It will provide a polished static site for studio information, projects, dev logs, contact details, and future content states while keeping the v1.0 scope small enough to ship.

## Current Status

v0.3 Documentation / Design Package Ready

No live URL yet.

## Project Details

| Field | Value |
|---|---|
| Project name | iTryKetchup Studio Hub |
| Repository name | itryketchup-hub |
| Public identity | iTryKetchup Studio |
| Target domain | itryketchup.com |
| Target deployment | GitHub Pages |
| GitHub repository status | Blocked: public GitHub repository creation is not available from this environment |
| GitHub Pages | Target, not deployed yet |
| YouTube | Coming Soon |
| Analytics | Disabled / not included in v1.0 |

## Local Folder Structure

```text
itryketchup-hub/
|-- docs/
|-- design/
|   |-- claude/
|   `-- references/
|-- src/
|   |-- css/
|   |-- js/
|   `-- assets/
|       |-- images/
|       |-- icons/
|       |-- mascots/
|       `-- social/
|-- deploy/
|-- archive/
|-- temp/
|-- README.md
|-- ParkingLot.md
`-- .gitignore
```

## Current Next Step

Phase 3 Page Build.

## GitHub Repository Setup Blocker

The local repository is initialized on `main`, but the public GitHub repository could not be created from this environment because GitHub CLI is not installed and the available GitHub integration does not expose repository creation.

Manual action needed:

```text
Create a public GitHub repository named itryketchup-hub.
Add it as the local origin remote.
Push main to origin.
```
