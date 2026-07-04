# Dev Log #047 - SITE - 2026-07-04

---

## 0. Project Status Before Session

**Current Version:** `Kitchen Wars: The Door v1.1 live`

**Current Priority:**
- Deploy the verified Door v1.2 update to the public iTryKetchup website.
- Keep the release focused on the approved sound, juice, and fridge-door polish.
- Confirm the public page still works on desktop and mobile after deployment.

**Known Blockers:**
- None.

**Ship Impact:**
- [ ] No visible progress
- [x] Progress made
- [x] Milestone reached
- [x] Ready for release

---

## 1. What Shipped

Kitchen Wars: The Door v1.2 is live on iTryKetchup Studio:

- Play it here: `https://www.itryketchup.com/games/the-door/`

This update brings the public web version in line with the verified Door v1.2 build.

---

## 2. What Changed

- Added the v1.2 sound set to the live game.
- Added fridge ambience after player interaction.
- Added action sounds for movement, jump, duck, shooting, can hits, wire hits, and game over.
- Deployed the updated juice/fridge visual polish from the verified v1.2 build.
- Preserved the existing website page wrapper and tracking behavior.

The game still behaves like the same compact Canvas runner-shooter. This was a deployment and polish release, not a new gameplay expansion.

---

## 3. Sound Behavior

The Door now has browser-friendly audio behavior:

- No autoplay.
- Sound unlocks after player interaction.
- Fridge ambience starts during play.
- Game-over audio stops the ambience and plays the buzzer.

That keeps the page respectful while making the fridge-door setting feel much more alive.

---

## 4. Public Verification

After deployment, the public page was checked directly:

- Page loads at `https://www.itryketchup.com/games/the-door/`.
- Game script and stylesheet return successfully.
- All nine game audio files return successfully.
- Start, movement, jump, duck, shoot, game over, and restart flow were verified in-browser.
- Mobile-size layout was checked for canvas fit and horizontal overflow.
- Browser console stayed clean during verification.

---

## 5. What Stayed Out Of Scope

- No new gameplay features were added.
- No new levels, enemies, weapons, backend leaderboard, or progression system were added.
- No unrelated website pages were changed.
- No video, thumbnail, comment, metadata, or channel settings were changed.

This release is deliberately narrow: the Door v1.2 build is now public.

---

## 6. Final Status

**Session complete?** Yes

**Project version after this session:** `Kitchen Wars: The Door v1.2 live`

---

> *Filename: 20260704_SITE_Session047_DevLog.md*
