(() => {
  "use strict";

  const components = {
    helmet: {
      title: "Helmet shell",
      status: "Fabricating",
      detail: "Digital preparation only. Helmet D001 is a governed 105% fabrication candidate with recorded mesh and envelope checks. No print run exists.",
      purpose: "Carry the visual identity and provide a removable shell for future stationary fit and optics studies.",
      dependencies: "Owner slicer review, separately authorized staged print, seam gate, empty-shell fit, pressure, visibility, and removal review.",
      milestone: "D001 digital package verified; all physical gates pending."
    },
    glasses: {
      title: "AR glasses",
      status: "Dream / Concept",
      detail: "VITURE Beast is the named display target. Vendor specifications do not establish ONEIROS fit, usable field, optical behavior, or helmet clearance.",
      purpose: "Display browser-hosted HUDs while preserving independent real-world visibility.",
      dependencies: "Actual configuration confirmation, wearer fit, cable clearance, content placement, and stationary optical tests.",
      milestone: "Named test target only; ONEIROS compatibility unverified."
    },
    armor: {
      title: "Chest and shoulder armor",
      status: "Dream / Concept",
      detail: "A generalized Clone Heavy Trooper-inspired shell is illustrated. No complete ONEIROS body armor is claimed fabricated or fitted.",
      purpose: "Provide a removable costume shell and possible mounting surfaces without restricting breathing or movement.",
      dependencies: "Rights review, part selection, measurements, scale, slicing, ventilation, mobility, finishing, and quick release.",
      milestone: "Vision baseline only; no armor print evidence."
    },
    backpack: {
      title: "Computing backpack",
      status: "Dream / Concept",
      detail: "A laptop compartment, cooling, service access, and balanced mounting are architectural goals only.",
      purpose: "Carry primary compute, protected cables, cooling, and future modular interfaces.",
      dependencies: "Exact laptop, ports, mass, heat/load measurements, airflow, impact protection, strain relief, and removal plan.",
      milestone: "Architecture intention; no ONEIROS backpack test."
    },
    cable: {
      title: "Proposed cable route",
      status: "Dream / Concept",
      detail: "The green route is an illustrative signal and power path—not an approved wiring diagram or harness.",
      purpose: "Keep display, camera, control, and power runs organized, serviceable, and removable.",
      dependencies: "Actual connectors, bend radii, snag control, isolation, strain relief, and emergency disconnect.",
      milestone: "Website schematic only."
    },
    forearm: {
      title: "Rii forearm control",
      status: "Dream / Concept",
      detail: "A compact keyboard and trackpad is the intended control idea. Exact model, ownership, mount, and ergonomics are not established for ONEIROS.",
      purpose: "Provide local pointer and text control without relying on voice.",
      dependencies: "Device confirmation, connection reliability, glove use, circulation, weight, reach, and quick release.",
      milestone: "Input concept only."
    },
    cameras: {
      title: "Camera positions",
      status: "Dream / Concept",
      detail: "Rear and forward night-vision goals are separate. The diagram is not a live feed or proof of device selection.",
      purpose: "Explore supplemental rear awareness and a separately evaluated low-light forward view.",
      dependencies: "Separate devices, mounts, field-of-view, latency, crop, failure, privacy, and stationary validation tests.",
      milestone: "No camera bench test or wearable integration."
    },
    battery: {
      title: "Auxiliary battery module",
      status: "Dream / Concept",
      detail: "A future protected-power concept inside a strictly nonfunctional costume prop. No pack, capacity, runtime, wiring, or integration is claimed.",
      purpose: "Explore removable auxiliary energy without creating any weapon function.",
      dependencies: "Protected pack, isolation, overcurrent protection, rated wiring/connectors, thermal review, and qualified electrical validation.",
      milestone: "Concept only; no weapon mechanism and no electrical design."
    }
  };

  const benchCards = [
    {
      name: "Recon Scanner v0.7",
      status: "Individually Tested",
      copy: "Released and browser-tested as standalone simulated software. It is not a camera, radar, AI, or suit integration."
    },
    {
      name: "ELEGOO Centauri Carbon 2 Combo",
      status: "Individually Tested",
      copy: "Owned and physically verified equipment. No ONEIROS print, material profile, finished armor, or filament result is claimed. No sponsorship or endorsement is implied."
    },
    {
      name: "Helmet D001",
      status: "Fabricating",
      copy: "Digital preparation only. Mesh and oriented-envelope checks passed; slicing, printing, seams, fit, visibility, Beast clearance, and assembly remain pending."
    },
    {
      name: "Wearable integration",
      status: "Dream / Concept",
      copy: "VITURE fit, laptop/backpack cooling, Rii controls, both cameras, AI/voice tools, and auxiliary power all require separate evidence before combination."
    }
  ];

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, (character) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
    })[character]);
  }

  function statusClass(status) {
    return status.toLowerCase().replace(/[^a-z]+/g, "-").replace(/^-|-$/g, "");
  }

  function suitSvg(interactive) {
    const attrs = (key, label) => interactive
      ? ` data-component="${key}" tabindex="0" role="button" aria-label="${label}" aria-pressed="false"`
      : "";

    return [
      '<svg class="suit-diagram" viewBox="0 0 720 780" role="img" aria-label="Illustrative heavy trooper wearable computer system">',
      '<g class="grid-lines" aria-hidden="true"><path d="M80 80H640M80 180H640M80 280H640M80 380H640M80 480H640M80 580H640M80 680H640"/><path d="M120 50V730M240 50V730M360 50V730M480 50V730M600 50V730"/></g>',
      '<g class="connection-lines" aria-hidden="true"><path d="M360 168C520 190 548 315 515 410S432 595 421 685"/><path d="M356 210C250 260 205 370 178 492"/><path d="M368 210C470 260 500 380 550 520"/><circle cx="360" cy="168" r="8"/><circle cx="515" cy="410" r="8"/><circle cx="178" cy="492" r="8"/><circle cx="550" cy="520" r="8"/></g>',
      `<g class="suit-part backpack"${attrs("backpack", "Select computing backpack")}><path d="M438 260h92l26 245-94 22-36-152z"/><path d="M457 292h53M465 326h49M474 360h44"/></g>`,
      `<g class="suit-part armor"${attrs("armor", "Select chest and shoulder armor")}><path d="M268 246L205 292l34 110 50-20 10 174h122l10-174 50 20 34-110-63-46-38-28h-88z"/><path d="M299 262l61 45 61-45M286 390h148M322 322h76v42h-76z"/></g>`,
      `<g class="suit-part helmet"${attrs("helmet", "Select helmet shell")}><path d="M274 86q86-70 172 0l22 95-54 64H306l-54-64z"/><path d="M281 120h158l-19 72-60 30-60-30z"/><path d="M305 193l18 26M415 193l-18 26"/></g>`,
      `<g class="suit-part glasses"${attrs("glasses", "Select AR glasses")}><path d="M288 130h62l10 18 10-18h62l-12 43h-51l-9-13-9 13h-51z"/><path d="M288 139l-31 8M432 139l31 8"/></g>`,
      '<g class="suit-part limb limb-left" aria-hidden="true"><path d="M251 386l-48 35-30 178 57 12 57-188z"/><path d="M289 552l-45 166h72l44-165z"/></g>',
      '<g class="suit-part limb limb-right" aria-hidden="true"><path d="M469 386l48 35 30 178-57 12-57-188z"/><path d="M431 552l45 166h72l-44-165z"/></g>',
      `<g class="suit-part forearm"${attrs("forearm", "Select forearm keyboard")}><path d="M164 492l91 19-14 78-94-22z"/><rect x="169" y="515" width="61" height="34" rx="3"/><path d="M176 524h46M176 534h46M176 544h46"/></g>`,
      `<g class="suit-part cameras"${attrs("cameras", "Select planned camera positions")}><rect x="457" y="115" width="42" height="28" rx="5"/><circle cx="478" cy="129" r="8"/><rect x="319" y="210" width="82" height="20" rx="4"/><circle cx="387" cy="220" r="6"/></g>`,
      `<g class="suit-part cable"${attrs("cable", "Select proposed cable route")}><path d="M468 147C525 216 512 294 514 375s-40 172-27 243"/><path d="M514 376C431 395 301 426 230 528"/></g>`,
      `<g class="suit-part battery"${attrs("battery", "Select auxiliary battery concept")}><path d="M557 516h82v176h-82z"/><path d="M573 544h50v66h-50zM581 660h34"/><text x="598" y="640" text-anchor="middle">PROP</text></g>`,
      '<g class="callout-labels" aria-hidden="true"><path d="M250 98H120"/><text x="112" y="102" text-anchor="end">HELMET / OPTICS</text><path d="M232 354H95"/><text x="87" y="358" text-anchor="end">ARMOR SHELL</text><path d="M530 332H620"/><text x="707" y="336" text-anchor="end">COMPUTE BAY</text><path d="M637 535h45"/><text x="707" y="539" text-anchor="end">AUX CONCEPT</text></g>',
      "</svg>"
    ].join("");
  }

  function journalCard(entry) {
    return [
      `<article class="journal-card" data-categories="${escapeHtml(entry.categories.join("|"))}">`,
      `<time datetime="${escapeHtml(entry.date)}">${escapeHtml(entry.date)}</time>`,
      "<div>",
      `<h3>${escapeHtml(entry.title)}</h3>`,
      `<p>${escapeHtml(entry.summary)}</p>`,
      `<ul class="tag-list">${entry.categories.map((category) => `<li>${escapeHtml(category)}</li>`).join("")}</ul>`,
      "</div></article>"
    ].join("");
  }

  function isApprovedMedia(item) {
    if (!item || item.status !== "Approved for Web") return false;
    if (!["id", "src", "alt", "caption", "approvalRef"].every((key) => typeof item[key] === "string" && item[key].trim())) return false;
    if (!/^\/ar-lab\/assets\/approved-media\/[A-Za-z0-9._/-]+\.(?:avif|webp|png|jpe?g)$/i.test(item.src)) return false;
    return !item.src.slice("/ar-lab/assets/approved-media/".length).includes("..");
  }

  function renderMedia() {
    const media = Array.isArray(window.ONEIROS_APPROVED_MEDIA)
      ? window.ONEIROS_APPROVED_MEDIA.filter(isApprovedMedia)
      : [];
    const state = document.querySelector("[data-media-state]");
    const grid = document.querySelector("[data-media-grid]");
    if (!state || !grid || media.length === 0) return;

    state.textContent = `${media.length} approved workshop ${media.length === 1 ? "image" : "images"} published.`;
    grid.hidden = false;
    grid.innerHTML = media.map((item) => [
      `<figure data-media-id="${escapeHtml(item.id)}">`,
      `<img src="${escapeHtml(item.src)}" alt="${escapeHtml(item.alt)}" loading="lazy" decoding="async">`,
      `<figcaption>${escapeHtml(item.caption)}<br><small>Approval: ${escapeHtml(item.approvalRef)}</small></figcaption>`,
      "</figure>"
    ].join("")).join("");
  }

  const hero = document.querySelector("[data-hero-suit]");
  const explorerSuit = document.querySelector("[data-explorer-suit]");
  if (hero) hero.innerHTML = suitSvg(false);
  if (explorerSuit) explorerSuit.innerHTML = suitSvg(true);

  const bench = document.querySelector("[data-bench-grid]");
  if (bench) {
    bench.innerHTML = benchCards.map((card) => [
      '<article class="bench-card">',
      `<span class="status status--${statusClass(card.status)}">${escapeHtml(card.status)}</span>`,
      `<h3>${escapeHtml(card.name)}</h3>`,
      `<p>${escapeHtml(card.copy)}</p>`,
      "</article>"
    ].join("")).join("");
  }

  const preview = document.querySelector("[data-journal-preview]");
  if (preview && Array.isArray(window.ONEIROS_JOURNAL_ENTRIES)) {
    preview.innerHTML = window.ONEIROS_JOURNAL_ENTRIES.slice(0, 3).map(journalCard).join("");
  }

  const explorer = document.querySelector(".explorer");
  const modeButtons = Array.from(document.querySelectorAll("[data-mode]"));
  modeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      if (explorer) explorer.dataset.mode = button.dataset.mode;
      modeButtons.forEach((candidate) => candidate.setAttribute("aria-pressed", String(candidate === button)));
    });
  });

  function selectComponent(key) {
    const data = components[key];
    if (!data) return;
    const title = document.querySelector("[data-detail-title]");
    const status = document.querySelector("[data-detail-status]");
    if (!title || !status) return;
    title.textContent = data.title;
    status.textContent = data.status;
    status.className = `status status--${statusClass(data.status)}`;
    document.querySelector("[data-detail-detail]").textContent = data.detail;
    document.querySelector("[data-detail-purpose]").textContent = data.purpose;
    document.querySelector("[data-detail-dependencies]").textContent = data.dependencies;
    document.querySelector("[data-detail-milestone]").textContent = data.milestone;
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

  const transparency = document.querySelector("[data-transparency]");
  const pov = document.querySelector(".pov-simulator");
  const povStatus = document.querySelector("[data-pov-status]");
  if (transparency && pov && povStatus) {
    transparency.addEventListener("click", () => {
      const next = pov.dataset.transparent !== "true";
      pov.dataset.transparent = String(next);
      transparency.setAttribute("aria-pressed", String(next));
      transparency.textContent = next ? "Return to opaque black" : "Show illustrative transparency";
      povStatus.textContent = next ? "Illustrative workshop scene visible; display remains opaque" : "Opaque black illustration";
    });
  }

  const navToggle = document.querySelector("[data-nav-toggle]");
  const nav = document.querySelector("[data-site-nav]");
  if (navToggle && nav) {
    navToggle.addEventListener("click", () => {
      const open = !nav.classList.contains("is-open");
      nav.classList.toggle("is-open", open);
      navToggle.setAttribute("aria-expanded", String(open));
    });
  }

  renderMedia();
})();
