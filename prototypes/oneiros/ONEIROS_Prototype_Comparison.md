# PROJECT ONEIROS — Local Prototype Comparison

**Review state:** Three local concepts complete; no production design selected
**Date:** 2026-11-01

| Dimension | Concept A — Tactical Schematic | Concept B — Cinematic Armor Workshop | Concept C — Engineering Workshop |
|---|---|---|---|
| Primary impression | Precise systems console | Aspirational wearable experience | Personal fabrication notebook |
| Visual language | Black, green/white linework, module labels, grid/ticks | Atmospheric dark field, broad armor silhouette, luminous callouts | Warm grayscale paper, cutting mat, CAD notes, pinned workshop flyer |
| Strongest moment | Exploded and Connections suit modes | Hero and full-body armor presentation | Hardware bench and homepage integration preview |
| Content density | Highest | Lowest in hero, moderate below | Moderate, note-driven |
| Existing-site connection | Deliberately separate AR-lab identity | Deliberately separate cinematic identity | Strongest bridge to grayscale kitchen style |
| Mobile behavior | Stacks into compact technical panels | Preserves large type and focal figure | Reads like a vertical field notebook |
| Accessibility | High contrast; dense labels need Director review | Strong focus/contrast; atmosphere checked against legibility | Dark-on-paper legibility; green reserved for active controls |
| Performance | Static HTML/CSS/JS; no remote runtime assets | Same | Same |
| Functional completeness | Shared feature set complete | Shared feature set complete | Shared feature set complete |

## Shared Functional Result

All three concepts include the same:

- accessible pronunciation guide with honest audio-unavailable state;
- exterior suit explorer with Assembled, Exploded, and Connections modes;
- pointer, touch, and keyboard component selection;
- evidence-aware component detail panel;
- three-area Helmet POV simulator with opaque/illustrative-transparency toggle;
- Recon Scanner v0.7 launch link and user-gesture fullscreen Suit Mode;
- workshop/hardware bench with evidence qualifiers;
- filterable ONEIROS FIELD NOTES journal;
- local grayscale-kitchen homepage entry preview;
- dream statement, camera safety boundary, costume-prop boundary, and no-sponsorship acknowledgement.

## Responsiveness And Accessibility

- Designed for desktop, tablet, phone portrait, and short landscape layouts.
- Semantic landmarks and heading hierarchy.
- Skip link, visible focus, 44px minimum controls, `aria-pressed`, live status messages, and keyboard selection.
- Text accompanies all status colors.
- `prefers-reduced-motion` removes nonessential transforms/transitions.

## Known Limitations

- Illustrations are original code-drawn provisional SVG/CSS, not final art or fabrication geometry.
- The transparency view is illustrative; ordinary monitors remain opaque.
- No live cameras, sensors, AI, voice processing, internet data, or diagnostics are connected.
- Browser fullscreen support varies, especially on mobile/iPad browsers; fallback status is shown.
- Physical VITURE usable field, helmet fit, camera behavior, thermal behavior, cable routing, and power are unverified.
- The prototypes intentionally do not import the existing production site CSS or remote fonts so review stays self-contained and dependency-free.

## Director Choices Needed

1. Select A, B, C, a hybrid, or no current direction.
2. Choose whether architecture, cinematic aspiration, or maker process should lead the public story.
3. Choose a production-art direction and approve provenance/rights work before any deployable armor asset is created.
4. Decide whether the journal should eventually become a sanitized public route.
5. Decide whether to authorize a new production SITE SOW. This local package does not authorize publication.
