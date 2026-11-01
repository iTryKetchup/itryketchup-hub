# PROJECT ONEIROS Local Website Prototypes

Three dependency-free, local-only website directions for Director review.

## Run

From the canonical website repository:

```powershell
node prototypes\oneiros\serve-oneiros.cjs
```

Open:

- Comparison: <http://127.0.0.1:4177/>
- Concept A — Tactical Schematic: <http://127.0.0.1:4177/concept-a/>
- Concept B — Cinematic Armor Workshop: <http://127.0.0.1:4177/concept-b/>
- Concept C — Engineering Workshop: <http://127.0.0.1:4177/concept-c/>

The server binds only to `127.0.0.1` and serves only this prototype directory.

## Production Isolation

- GitHub Pages publishes `src\` only.
- This tree lives at repository-root `prototypes\oneiros\` and is not part of the deployment artifact.
- Production Home, Projects, Dev Logs, About, analytics, and `src\hud\` are unchanged.
- These concepts are not approved final designs and are not public journal content.

## Evidence And Claim Boundaries

- The suit illustration is original code-drawn SVG created for this local comparison. It is provisional visual design, not fabrication geometry.
- Purchased armor meshes and EngineeringLab renders were reviewed in place but were not copied into this repository.
- Helmet D001 is a digitally verified fabrication candidate. No print run, fit result, VITURE clearance, or integrated suit exists.
- Camera, AI, voice, internet, diagnostics, and optical transparency views are explicitly simulated samples.
- Camera passthrough is not walking vision.
- The auxiliary battery module is a future protected-power concept inside a strictly nonfunctional costume prop; no weapon mechanism is designed.
- ELEGOO is independently acknowledged. No sponsorship or endorsement is implied.

## Pronunciation

`ONEIROS` derives from Ancient Greek `ὄνειρος` (“dream”). The readable guide is **OH-neh-ross**, an approximate English rendering of 5th-century BCE Attic `/ó.neː.ros/`.

Reference: <https://en.wiktionary.org/wiki/%E1%BD%84%CE%BD%CE%B5%CE%B9%CF%81%CE%BF%CF%82>

No audio is bundled. Browser speech synthesis is not presented as an Ancient Greek recording.

## Verify

```powershell
node prototypes\oneiros\tests\oneiros-checks.cjs
```

The test uses the already-installed local Playwright/Chromium tooling. It installs nothing, starts a temporary loopback-only server, checks all concepts and viewports, and writes screenshot evidence under `evidence\screenshots\`.

## Files

- `index.html` — comparison index.
- `concept-a/`, `concept-b/`, `concept-c/` — three concept entry points.
- `assets/oneiros.css` — shared responsive theme system.
- `assets/oneiros.js` — shared accessible interactions and content.
- `serve-oneiros.cjs` — loopback-only review server.
- `tests/oneiros-checks.cjs` — focused static/browser verification.
- `ONEIROS_Prototype_Comparison.md` — concise review comparison.
- `evidence/screenshots/` — generated local browser captures.
