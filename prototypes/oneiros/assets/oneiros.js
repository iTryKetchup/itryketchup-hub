(() => {
  "use strict";

  const conceptKey = (document.body.dataset.concept || "A").toUpperCase();
  const concepts = {
    A: {
      label: "Concept A",
      name: "Tactical Schematic",
      code: "ONEIROS / SYSTEM MAP / A",
      intro: "Read the dream like a field schematic: modules, routes, dependencies, and the empty spaces where evidence still belongs.",
      heroNote: "SYSTEM STATE · GOVERNED DREAM / LOCAL PROTOTYPE"
    },
    B: {
      label: "Concept B",
      name: "Cinematic Armor Workshop",
      code: "ONEIROS / ARMOR BAY / B",
      intro: "Stand in front of the suit without pretending it already exists: a cinematic frame for ambition, uncertainty, and the next experiment.",
      heroNote: "ARMOR BAY · PROVISIONAL VISUAL / NO INTEGRATED SUIT"
    },
    C: {
      label: "Concept C",
      name: "Engineering Workshop",
      code: "ONEIROS / BENCH NOTES / C",
      intro: "Pin the dream above the workbench: CAD notes, print gates, evidence cards, and honest lessons from making.",
      heroNote: "WORK ORDER · DIRECTOR REVIEW / NOT FOR FABRICATION"
    }
  };

  const components = {
    helmet: {
      title: "Helmet shell",
      status: "Fabricating",
      detail: "Digital preparation only. D001 is a verified 105% digital fabrication candidate with five shell sections and five detail parts. No print run exists.",
      purpose: "Carry the visual identity and provide a future removable test shell for stationary fit and optics studies.",
      dependencies: "Owner slicer review, separately authorized staged print, seam gate, empty-shell fit, pressure/visibility review.",
      milestone: "EngineeringLab D001 digital package · 2026-11-01",
      media: "Future print-progress and armor-assembly derivatives may attach here after exact-file approval; none are loaded."
    },
    glasses: {
      title: "AR glasses",
      status: "Dream / Concept",
      detail: "VITURE Beast is the named display target. Manufacturer specifications do not establish ONEIROS fit, usable field, transparency, or helmet clearance.",
      purpose: "Display browser-hosted HUDs while preserving independent real-world visibility.",
      dependencies: "Actual model/inventory confirmation, nose-pad fit, prescription needs, cable clearance, stationary optical test.",
      milestone: "D001 fit-test target · physical clearance pending",
      media: "Future stationary optics and helmet-clearance derivatives may attach here after exact-file approval; none are loaded."
    },
    armor: {
      title: "Chest and shoulder armor",
      status: "Dream / Concept",
      detail: "A generalized heavy-trooper-inspired shell is illustrated. No complete ONEIROS body armor is claimed fabricated or fitted.",
      purpose: "Provide a removable costume shell and future mounting surfaces without restricting breathing or joint movement.",
      dependencies: "Rights/asset selection, measurements, scale, print plan, ventilation, mobility, quick-release review.",
      milestone: "ONEIROS vision baseline · no print evidence",
      media: "Future armor-assembly and before/after derivatives may attach here after exact-file approval; none are loaded."
    },
    backpack: {
      title: "Computing backpack",
      status: "Dream / Concept",
      detail: "The laptop compartment, cooling, service access, and balance are architectural goals only.",
      purpose: "Carry primary compute, protected cables, and future modular interfaces.",
      dependencies: "Exact laptop, ports, mass, heat/load measurements, airflow design, strain relief, removal plan.",
      milestone: "ONEIROS architecture baseline",
      media: "Future electronics, enclosure, cooling, and bench-test derivatives may attach here after exact-file approval; none are loaded."
    },
    cable: {
      title: "Proposed cable route",
      status: "Dream / Concept",
      detail: "The green route is an illustrative signal/power path, not a wiring diagram or approved harness.",
      purpose: "Keep display, camera, control, and power runs organized and removable.",
      dependencies: "Actual connectors, bend radius, snag control, isolation, strain relief, emergency disconnect.",
      milestone: "Local prototype schematic only",
      media: "Future cable-routing test derivatives may attach here after exact-file approval; none are loaded."
    },
    forearm: {
      title: "Forearm keyboard",
      status: "Dream / Concept",
      detail: "A Rii compact keyboard/trackpad is the intended control idea; exact device, ownership, mount, and ergonomics are not established here.",
      purpose: "Provide local pointer and text control without relying on voice.",
      dependencies: "Device inventory, connection reliability, glove use, circulation, weight, quick release.",
      milestone: "ONEIROS input concept",
      media: "Future forearm-mount and ergonomics derivatives may attach here after exact-file approval; none are loaded."
    },
    cameras: {
      title: "Camera positions",
      status: "Dream / Concept",
      detail: "Rear and forward night-vision goals are separate. The diagram is not a live feed or proof of device selection.",
      purpose: "Provide supplemental rear awareness and a separately evaluated low-light forward sample.",
      dependencies: "Separate devices, mounts, latency/crop/failure tests, privacy indicators, independent visibility.",
      milestone: "Stationary bench tests not started",
      media: "Future separately validated camera-test derivatives may attach here after exact-file approval; none are loaded."
    },
    battery: {
      title: "Auxiliary battery module",
      status: "Dream / Concept",
      detail: "Future protected-power concept inside a strictly nonfunctional costume prop. No battery, capacity, runtime, wiring, or pack integration is claimed.",
      purpose: "Explore a removable auxiliary energy module without creating any weapon function.",
      dependencies: "Protected pack, isolation, overcurrent protection, rated wiring/connectors, thermal review, qualified electrical validation.",
      milestone: "Concept only · no weapon mechanisms",
      media: "Future protected-power bench evidence may attach here only after qualified review and exact-file approval; none is loaded."
    }
  };

  const benchCards = [
    ["ELEGOO Centauri Carbon 2 Combo", "Individually Tested", "Owned / physically verified equipment. No ONEIROS print, material profile, completed armor, or filament-consumption claim. ELEGOO is independently acknowledged; no sponsorship or endorsement is implied."],
    ["Helmet D001", "Fabricating", "Digital preparation only: mesh and oriented-envelope checks passed. Slicer, print, seams, fit, visibility, Beast clearance, and assembly remain pending."],
    ["Recon Scanner v0.7", "Individually Tested", "Existing public browser software milestone with responsive regression evidence. It remains simulated software, not a camera, radar, or suit integration."],
    ["VITURE Beast target", "Dream / Concept", "Named optics target. Actual usable field, wearer fit, transparency, cable route, and helmet clearance require stationary physical testing."],
    ["Laptop compute", "Dream / Concept", "Primary-compute intention only. Exact device, display compatibility, ports, load, cooling, mounting, and runtime are not evidenced for ONEIROS."],
    ["Rii forearm control", "Dream / Concept", "Compact keyboard/trackpad idea. Exact model, ownership, connection, mount, ergonomics, and quick release remain unverified."],
    ["Dual camera goals", "Dream / Concept", "Rear and forward/night-vision feeds must be independently bench-tested before any combined display experiment."],
    ["Auxiliary power prop module", "Dream / Concept", "Future protected-power concept in a nonfunctional costume prop. No weapon mechanism, battery runtime, or electrical design is approved."]
  ];

  const journalEntries = [
    {
      date: "2026-11-01",
      title: "Recon Scanner v0.7 holds the software line",
      categories: ["HUD Code", "Testing & Lessons Learned"],
      text: "The existing public browser HUD remains the tested software milestone. It is explicitly simulated, unchanged by these local prototypes, and not evidence of camera or suit integration."
    },
    {
      date: "2026-11-01",
      title: "The dream gets a name: PROJECT ONEIROS",
      categories: ["Armor & Fabrication", "Optics & Cameras"],
      text: "ONEIROS — from Ancient Greek for dream — becomes the governed identity for a long-term wearable-computer experiment with no fixed deadline or feature promise."
    },
    {
      date: "2026-11-01",
      title: "Activation and three local directions",
      categories: ["HUD Code", "3D Printing", "Testing & Lessons Learned"],
      text: "Governance activation and the Tactical, Cinematic, and Engineering local prototypes were completed for Director review. Nothing was published and no physical work was authorized."
    }
  ];

  const mediaPlaceholders = [
    {
      code: "SUIT INSPECTOR",
      title: "Component galleries",
      text: "Approved derivatives can attach to helmet, optics, armor, controls, cameras, compute, cable, and power modules."
    },
    {
      code: "3D PRINTING",
      title: "Progress evidence",
      text: "Future factual sequences can show preparation, print stages, parts, failures, and measured outcomes without inventing success."
    },
    {
      code: "ELECTRONICS / HUD",
      title: "Bench experiments",
      text: "Approved copies can document displays, controls, cables, and stationary tests without implying integrated hardware."
    },
    {
      code: "FIELD NOTES",
      title: "Failures and lessons",
      text: "Review-safe derivatives can support before/after comparisons and sanitized journal entries while private history stays private."
    }
  ];

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, (character) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
    })[character]);
  }

  function isApprovedPrototypeMedia(item) {
    if (!item || item.status !== "Approved for Web") return false;
    if (!["id", "src", "alt", "caption", "approvalRef"].every((key) => typeof item[key] === "string" && item[key].trim())) return false;
    if (!/^\.\.\/assets\/approved-media\/[A-Za-z0-9._/-]+\.(?:avif|webp|png|jpe?g)$/i.test(item.src)) return false;
    return !item.src.slice("../assets/approved-media/".length).includes("..");
  }

  const approvedMediaItems = Array.isArray(window.ONEIROS_APPROVED_MEDIA)
    ? window.ONEIROS_APPROVED_MEDIA.filter(isApprovedPrototypeMedia)
    : [];

  const approvedMediaLabel = approvedMediaItems.length + " approved media item" + (approvedMediaItems.length === 1 ? "" : "s") + " loaded";

  function statusClass(status) {
    return status.toLowerCase().replace(/[^a-z]+/g, "-").replace(/^-|-$/g, "");
  }

  function suitSvg(interactive) {
    const attrs = (key, label) => interactive
      ? ' data-component="' + key + '" tabindex="0" role="button" aria-label="' + label + '" aria-pressed="false"'
      : "";
    return [
      '<svg class="suit-diagram" viewBox="0 0 720 780" role="img" aria-label="Provisional code-drawn heavy trooper wearable computer concept">',
      '<g class="grid-lines" aria-hidden="true"><path d="M80 80H640M80 180H640M80 280H640M80 380H640M80 480H640M80 580H640M80 680H640"/><path d="M120 50V730M240 50V730M360 50V730M480 50V730M600 50V730"/></g>',
      '<g class="connection-lines" aria-hidden="true"><path d="M360 168C520 190 548 315 515 410S432 595 421 685"/><path d="M356 210C250 260 205 370 178 492"/><path d="M368 210C470 260 500 380 550 520"/><circle cx="360" cy="168" r="8"/><circle cx="515" cy="410" r="8"/><circle cx="178" cy="492" r="8"/><circle cx="550" cy="520" r="8"/></g>',
      '<g class="suit-part backpack" ' + attrs("backpack", "Select computing backpack") + '><path d="M438 260h92l26 245-94 22-36-152z"/><path d="M457 292h53M465 326h49M474 360h44"/></g>',
      '<g class="suit-part armor" ' + attrs("armor", "Select chest and shoulder armor") + '><path d="M268 246L205 292l34 110 50-20 10 174h122l10-174 50 20 34-110-63-46-38-28h-88z"/><path d="M299 262l61 45 61-45M286 390h148M322 322h76v42h-76z"/></g>',
      '<g class="suit-part helmet" ' + attrs("helmet", "Select helmet shell") + '><path d="M274 86q86-70 172 0l22 95-54 64H306l-54-64z"/><path d="M281 120h158l-19 72-60 30-60-30z"/><path d="M305 193l18 26M415 193l-18 26"/></g>',
      '<g class="suit-part glasses" ' + attrs("glasses", "Select AR glasses") + '><path d="M288 130h62l10 18 10-18h62l-12 43h-51l-9-13-9 13h-51z"/><path d="M288 139l-31 8M432 139l31 8"/></g>',
      '<g class="suit-part limb limb-left" aria-hidden="true"><path d="M251 386l-48 35-30 178 57 12 57-188z"/><path d="M289 552l-45 166h72l44-165z"/></g>',
      '<g class="suit-part limb limb-right" aria-hidden="true"><path d="M469 386l48 35 30 178-57 12-57-188z"/><path d="M431 552l45 166h72l-44-165z"/></g>',
      '<g class="suit-part forearm" ' + attrs("forearm", "Select forearm keyboard") + '><path d="M164 492l91 19-14 78-94-22z"/><rect x="169" y="515" width="61" height="34" rx="3"/><path d="M176 524h46M176 534h46M176 544h46"/></g>',
      '<g class="suit-part cameras" ' + attrs("cameras", "Select rear and forward camera positions") + '><rect x="457" y="115" width="42" height="28" rx="5"/><circle cx="478" cy="129" r="8"/><rect x="319" y="210" width="82" height="20" rx="4"/><circle cx="387" cy="220" r="6"/></g>',
      '<g class="suit-part cable" ' + attrs("cable", "Select proposed cable route") + '><path d="M468 147C525 216 512 294 514 375s-40 172-27 243"/><path d="M514 376C431 395 301 426 230 528"/></g>',
      '<g class="suit-part battery" ' + attrs("battery", "Select auxiliary battery module concept") + '><path d="M557 516h82v176h-82z"/><path d="M573 544h50v66h-50zM581 660h34"/><text x="598" y="640" text-anchor="middle">PROP</text></g>',
      '<g class="callout-labels" aria-hidden="true"><path d="M250 98H120"/><text x="112" y="102" text-anchor="end">HELMET / OPTICS</text><path d="M232 354H95"/><text x="87" y="358" text-anchor="end">ARMOR SHELL</text><path d="M530 332H620"/><text x="707" y="336" text-anchor="end">COMPUTE BAY</text><path d="M637 535h45"/><text x="707" y="539" text-anchor="end">AUX CONCEPT</text></g>',
      '</svg>'
    ].join("");
  }

  function benchMarkup() {
    return benchCards.map((card) => {
      return '<article class="bench-card"><span class="status status--' + statusClass(card[1]) + '">' + card[1] + '</span><h3>' + card[0] + '</h3><p>' + card[2] + '</p></article>';
    }).join("");
  }

  function journalMarkup() {
    return journalEntries.map((entry) => {
      return '<article class="journal-entry" data-categories="' + entry.categories.join("|") + '"><time datetime="' + entry.date + '">' + entry.date + '</time><h3>' + entry.title + '</h3><p>' + entry.text + '</p><ul class="tag-list">' + entry.categories.map((category) => '<li>' + category + '</li>').join("") + '</ul></article>';
    }).join("");
  }

  function mediaGalleryMarkup() {
    if (approvedMediaItems.length === 0) {
      return mediaPlaceholders.map((item) => {
        return '<article class="media-card media-card--placeholder" data-media-placeholder><div class="media-frame" aria-hidden="true"><span>NO APPROVED IMAGE</span></div><p class="eyebrow">' + item.code + '</p><h4>' + item.title + '</h4><p>' + item.text + '</p></article>';
      }).join("");
    }

    return approvedMediaItems.map((item) => {
      return '<figure class="media-card" data-media-id="' + escapeHtml(item.id) + '"><img src="' + escapeHtml(item.src) + '" alt="' + escapeHtml(item.alt) + '" loading="lazy" decoding="async"><figcaption><span class="status status--individually-tested">Approved derivative</span><h4>' + escapeHtml(item.component || item.category || "Workshop evidence") + '</h4><p>' + escapeHtml(item.caption) + '</p><small>Approval: ' + escapeHtml(item.approvalRef) + '</small></figcaption></figure>';
    }).join("");
  }

  function pageMarkup(meta) {
    return [
      '<div class="local-banner" role="note"><span>LOCAL DIRECTOR REVIEW</span><span>Not production · Not published · No hardware completion claim</span></div>',
      '<header class="site-header">',
      '<a class="brand" href="../" aria-label="Return to PROJECT ONEIROS comparison"><span class="brand-mark" aria-hidden="true">O</span><span><strong>PROJECT ONEIROS</strong><small>iTryKetchup Studio · Ketchup AR Lab</small></span></a>',
      '<nav class="concept-nav" aria-label="Prototype concepts"><a href="../concept-a/"' + (conceptKey === "A" ? ' aria-current="page"' : "") + '>A / Schematic</a><a href="../concept-b/"' + (conceptKey === "B" ? ' aria-current="page"' : "") + '>B / Cinematic</a><a href="../concept-c/"' + (conceptKey === "C" ? ' aria-current="page"' : "") + '>C / Workshop</a></nav>',
      '</header>',
      '<main id="main">',
      '<section class="hero section-shell" aria-labelledby="hero-title">',
      '<div class="hero-copy"><p class="eyebrow">' + meta.code + '</p><p class="concept-label">' + meta.label + ' · ' + meta.name + '</p><h1 id="hero-title"><span>BUILD THE SUIT.</span><span>LAUNCH THE HUD.</span></h1><p class="lede">' + meta.intro + '</p>',
      '<div class="pronunciation"><span><strong>ONEIROS</strong> · OH-neh-ross · <span lang="grc">ὄνειρος</span>, “dream”</span><button type="button" disabled aria-disabled="true" title="No reliable approved recording is bundled">Audio unavailable — guide only</button></div>',
      '<p class="dream-statement"><strong>A dream worth building, one experiment at a time.</strong> Personal, independent, long-term, and honest about uncertainty. No fixed timeline. No promise every feature will work.</p>',
      '<div class="hero-actions"><a class="button button--primary" href="https://www.itryketchup.com/hud/" target="_blank" rel="noopener">Launch Recon Scanner v0.7 <span aria-hidden="true">↗</span></a><button class="button button--secondary" type="button" data-suit-mode>Suit Mode / Fullscreen HUD</button></div>',
      '<p class="action-status" data-action-status aria-live="polite">Recon Scanner is the existing simulated browser HUD. Suit Mode is local and requires a user gesture.</p></div>',
      '<div class="hero-visual"><div class="hero-visual__frame">' + suitSvg(false) + '</div><p>' + meta.heroNote + '</p></div>',
      '</section>',
      '<section class="project-boundary section-shell" aria-label="Project boundary"><p><strong>PROJECT STATE</strong> Primary Active project for governed planning and local prototype review.</p><p><strong>PHYSICAL STATE</strong> No integrated suit. Helmet D001 is digital-only; every camera, control, compute, and power integration remains unverified.</p></section>',
      '<section class="section-shell explorer-section" id="explorer" aria-labelledby="explorer-title">',
      '<div class="section-heading"><p class="section-number">01 / EXTERIOR SUIT EXPLORER</p><h2 id="explorer-title">Inspect the proposed system, not a finished claim.</h2><p>Select modules with mouse, touch, Tab, Enter, or Space. Exploded spacing and connection routes are illustrative.</p></div>',
      '<div class="mode-tabs" role="group" aria-label="Suit explorer mode"><button type="button" data-mode="assembled" aria-pressed="true">Assembled</button><button type="button" data-mode="exploded" aria-pressed="false">Exploded</button><button type="button" data-mode="connections" aria-pressed="false">Connections</button></div>',
      '<div class="explorer" data-mode="assembled"><div class="explorer-canvas">' + suitSvg(true) + '<p class="illustration-note">Original provisional code drawing · not fabrication geometry</p></div>',
      '<aside class="component-panel" aria-live="polite"><p class="eyebrow">SELECTED MODULE</p><h3 data-detail-title>Helmet shell</h3><span class="status status--fabricating" data-detail-status>Fabricating</span><p data-detail-detail>Digital preparation only. D001 is a verified 105% digital fabrication candidate with five shell sections and five detail parts. No print run exists.</p><dl><div><dt>Purpose</dt><dd data-detail-purpose></dd></div><div><dt>Dependencies</dt><dd data-detail-dependencies></dd></div><div><dt>Evidence / milestone</dt><dd data-detail-milestone></dd></div><div class="component-media-hook"><dt>Future approved media</dt><dd data-detail-media>Future print-progress and armor-assembly derivatives may attach here after exact-file approval; none are loaded.</dd></div></dl></aside></div>',
      '<div class="status-legend" aria-label="Progress category legend"><span><b>1</b> Dream / Concept</span><span><b>2</b> Fabricating</span><span><b>3</b> Individually Tested</span><span><b>4</b> Integrated — none claimed</span></div>',
      '</section>',
      '<section class="section-shell pov-section" id="pov" aria-labelledby="pov-title">',
      '<div class="section-heading"><p class="section-number">02 / HELMET POV SIMULATOR</p><h2 id="pov-title">Three areas. One essential distinction.</h2><p>The center is the browser HUD. It is <strong>not</strong> the primary forward camera view.</p></div>',
      '<div class="pov-controls"><button type="button" data-transparency aria-pressed="false">Show illustrative transparency</button><button type="button" id="exitSuit" hidden>Exit Suit Mode</button><span data-pov-status aria-live="polite">Opaque black simulation</span></div>',
      '<div class="pov-simulator" data-transparent="false">',
      '<div class="pov-zone pov-zone--left"><div class="sample-feed sample-feed--rear"><span>REAR VIEW</span><strong>SAMPLE PLACEHOLDER</strong><i aria-hidden="true"></i></div><div class="sample-feed sample-feed--night"><span>FORWARD NIGHT VISION</span><strong>SAMPLE PLACEHOLDER</strong><i aria-hidden="true"></i></div></div>',
      '<div class="pov-zone pov-zone--center"><div class="hud-grid" aria-hidden="true"></div><span class="pov-label">CENTER · WEB HUD · SIMULATED</span><div class="hud-reticle" aria-hidden="true"></div><div class="hud-readout"><span>RECON / v0.7</span><span>LINK · SIM</span><span>FRAME · SAMPLE</span></div><strong class="center-warning">NOT FORWARD CAMERA VIDEO</strong></div>',
      '<div class="pov-zone pov-zone--right"><span class="pov-label">RIGHT · TOOL SAMPLES</span><div class="tool-sample"><b>AI ASSISTANT</b><span>Sample panel · unavailable</span></div><div class="tool-sample"><b>VOICE</b><span>Sample controls · inactive</span></div><div class="tool-sample"><b>INTERNET</b><span>No live data connected</span></div><div class="tool-sample"><b>DIAGNOSTICS</b><span>Illustrative values only</span></div></div>',
      '</div>',
      '<p class="safety-note"><strong>Transparency boundary:</strong> this toggle reveals a CSS-drawn illustrative scene. An ordinary monitor remains opaque. Actual VITURE optical behavior and usable field require separate stationary physical testing.</p>',
      '</section>',
      '<section class="section-shell bench-section" id="bench" aria-labelledby="bench-title"><div class="section-heading"><p class="section-number">03 / WORKSHOP & HARDWARE BENCH</p><h2 id="bench-title">Evidence cards before assembly fantasies.</h2><p>Ownership, digital verification, individual tests, and integration are different facts.</p></div><div class="bench-grid">' + benchMarkup() + '</div><div class="media-preview" id="media-preview" aria-labelledby="media-preview-title"><div class="media-preview__heading"><div><p class="section-number">03A / WORKSHOP MEDIA LIBRARY PREVIEW</p><h3 id="media-preview-title">A place for evidence, empty by design.</h3><p>These slots show how future Director-approved derivatives can support the suit inspector, hardware bench, and FIELD NOTES without loading private originals.</p></div><span class="media-count" data-media-count>' + approvedMediaLabel + '</span></div><div class="media-grid" data-media-gallery>' + mediaGalleryMarkup() + '</div><p class="media-policy"><strong>Local boundary:</strong> the prototype reads only its explicit approved-media data file. It never scans the private workshop library, and no file becomes public or approved automatically.</p></div></section>',
      '<section class="section-shell journal-section" id="journal" aria-labelledby="journal-title"><div class="journal-title-block"><p class="section-number">04 / ONEIROS FIELD NOTES</p><h2 id="journal-title">The experiment keeps its own journal.</h2><p>Proposed eventual route: <code>/ar-lab/dev-log/</code>. This local sample is sanitized and not published.</p><p class="journal-media-note" data-journal-media-status><strong>Approved derivative support:</strong> ' + approvedMediaLabel + '. Future images require a separately written, public-safe entry.</p></div>',
      '<div class="journal-filters" role="group" aria-label="Filter ONEIROS journal"><button type="button" data-filter="All" aria-pressed="true">All</button><button type="button" data-filter="HUD Code" aria-pressed="false">HUD Code</button><button type="button" data-filter="3D Printing" aria-pressed="false">3D Printing</button><button type="button" data-filter="Optics & Cameras" aria-pressed="false">Optics & Cameras</button><button type="button" data-filter="AI & Voice" aria-pressed="false">AI & Voice</button><button type="button" data-filter="Power" aria-pressed="false">Power</button><button type="button" data-filter="Armor & Fabrication" aria-pressed="false">Armor & Fabrication</button><button type="button" data-filter="Testing & Lessons Learned" aria-pressed="false">Testing & Lessons Learned</button></div>',
      '<p class="filter-status" data-filter-status aria-live="polite">Showing all 3 supported entries.</p><div class="journal-grid">' + journalMarkup() + '</div></section>',
      '<section class="section-shell home-integration" id="home-preview" aria-labelledby="home-preview-title"><div class="section-heading"><p class="section-number">05 / LOCAL HOMEPAGE INTEGRATION PREVIEW</p><h2 id="home-preview-title">A pinned drawing on the grayscale kitchen wall.</h2><p>This is a local composition only. The production homepage and navigation are unchanged.</p></div>',
      '<div class="kitchen-preview"><nav aria-label="Homepage preview navigation"><strong>iTryKetchup Studio</strong><span>Home</span><span>Projects</span><span>Dev Logs</span><span>About</span></nav><div class="kitchen-board"><article class="pinned-flyer"><span class="pin" aria-hidden="true"></span><p>FROM THE KETCHUP AR LAB</p><h3>PROJECT ONEIROS</h3><div class="flyer-drawing" aria-hidden="true"></div><strong>BUILD THE SUIT.<br>LAUNCH THE HUD.</strong><small>Long-term personal engineering experiment · no promised date</small><a href="#explorer">Open local project preview</a></article><div class="kitchen-caption"><p class="eyebrow">PROPOSED ENTRY</p><h3>Workshop flyer, not a launch ad.</h3><p>The grayscale-paper treatment connects to the current kitchen site while the technical drawing signals a new lab project.</p></div></div></div></section>',
      '<section class="section-shell safety-section" aria-labelledby="safety-title"><div><p class="section-number">06 / NON-NEGOTIABLES</p><h2 id="safety-title">The dream stays honest and removable.</h2></div><div class="safety-grid"><p><strong>Stationary first.</strong> Camera displays are supplemental samples and never validated primary walking vision.</p><p><strong>No weapon mechanisms.</strong> The heavy object is a nonfunctional costume prop; auxiliary power is a future protected electrical concept only.</p><p><strong>No invented evidence.</strong> No completed prints, battery runtime, live AI, live camera, or integrated behavior is claimed.</p><p><strong>No automatic publication.</strong> Private engineering history stays private; future public notes are separately sanitized and approved.</p></div></section>',
      '</main>',
      '<footer class="site-footer"><p>PROJECT ONEIROS · ' + meta.label + ' / ' + meta.name + ' · Local Director review</p><p>A dream worth building, one experiment at a time.</p></footer>'
    ].join("");
  }

  const app = document.getElementById("app");
  if (!app) return;
  const meta = concepts[conceptKey] || concepts.A;
  app.innerHTML = pageMarkup(meta);

  const explorer = document.querySelector(".explorer");
  const modeButtons = Array.from(document.querySelectorAll("[data-mode]"));
  modeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      explorer.dataset.mode = button.dataset.mode;
      modeButtons.forEach((candidate) => candidate.setAttribute("aria-pressed", String(candidate === button)));
    });
  });

  function selectComponent(key) {
    const data = components[key];
    if (!data) return;
    const title = document.querySelector("[data-detail-title]");
    const status = document.querySelector("[data-detail-status]");
    title.textContent = data.title;
    status.textContent = data.status;
    status.className = "status status--" + statusClass(data.status);
    document.querySelector("[data-detail-detail]").textContent = data.detail;
    document.querySelector("[data-detail-purpose]").textContent = data.purpose;
    document.querySelector("[data-detail-dependencies]").textContent = data.dependencies;
    document.querySelector("[data-detail-milestone]").textContent = data.milestone;
    document.querySelector("[data-detail-media]").textContent = data.media;
    document.querySelectorAll(".explorer [data-component]").forEach((node) => {
      const selected = node.dataset.component === key;
      node.classList.toggle("is-selected", selected);
      node.setAttribute("aria-pressed", String(selected));
    });
  }

  document.querySelectorAll(".explorer [data-component]").forEach((node) => {
    node.addEventListener("click", () => selectComponent(node.dataset.component));
    node.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        selectComponent(node.dataset.component);
      }
    });
  });
  selectComponent("helmet");

  const transparencyButton = document.querySelector("[data-transparency]");
  const pov = document.querySelector(".pov-simulator");
  const povStatus = document.querySelector("[data-pov-status]");
  transparencyButton.addEventListener("click", () => {
    const next = pov.dataset.transparent !== "true";
    pov.dataset.transparent = String(next);
    transparencyButton.setAttribute("aria-pressed", String(next));
    transparencyButton.textContent = next ? "Return to opaque black" : "Show illustrative transparency";
    povStatus.textContent = next ? "Illustrative scene visible — monitor remains opaque" : "Opaque black simulation";
  });

  const filterButtons = Array.from(document.querySelectorAll("[data-filter]"));
  const entries = Array.from(document.querySelectorAll(".journal-entry"));
  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const filter = button.dataset.filter;
      let visible = 0;
      entries.forEach((entry) => {
        const categories = entry.dataset.categories.split("|");
        const show = filter === "All" || categories.includes(filter);
        entry.hidden = !show;
        if (show) visible += 1;
      });
      filterButtons.forEach((candidate) => candidate.setAttribute("aria-pressed", String(candidate === button)));
      document.querySelector("[data-filter-status]").textContent = filter === "All"
        ? "Showing all " + visible + " supported entries."
        : "Showing " + visible + " supported entr" + (visible === 1 ? "y" : "ies") + " for " + filter + ".";
    });
  });

  const suitModeButton = document.querySelector("[data-suit-mode]");
  const exitSuit = document.getElementById("exitSuit");
  const actionStatus = document.querySelector("[data-action-status]");

  suitModeButton.addEventListener("click", async () => {
    document.getElementById("pov").scrollIntoView({ behavior: "smooth", block: "start" });
    try {
      if (!document.fullscreenEnabled || typeof pov.requestFullscreen !== "function") {
        actionStatus.textContent = "Fullscreen is unavailable in this browser. The local simulator remains fully usable in-page.";
        return;
      }
      await pov.requestFullscreen();
      actionStatus.textContent = "Suit Mode entered. Use Exit Suit Mode or the browser fullscreen exit control.";
    } catch (error) {
      actionStatus.textContent = "Fullscreen could not start. The local simulator remains fully usable in-page.";
    }
  });

  exitSuit.addEventListener("click", async () => {
    if (document.fullscreenElement && document.exitFullscreen) await document.exitFullscreen();
  });

  document.addEventListener("fullscreenchange", () => {
    const active = Boolean(document.fullscreenElement);
    exitSuit.hidden = !active;
    document.body.classList.toggle("is-suit-mode", active);
    if (!active) actionStatus.textContent = "Suit Mode exited. The local prototype remains in normal review mode.";
  });
})();
