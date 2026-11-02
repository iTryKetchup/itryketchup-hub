(() => {
  "use strict";

  const entries = Array.isArray(window.ONEIROS_JOURNAL_ENTRIES) ? window.ONEIROS_JOURNAL_ENTRIES : [];
  const list = document.querySelector("[data-journal-list]");
  const filters = document.querySelector("[data-journal-filters]");
  const status = document.querySelector("[data-filter-status]");

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, (character) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
    })[character]);
  }

  function card(entry) {
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

  const categories = ["All", ...new Set(entries.flatMap((entry) => entry.categories))];
  if (list) list.innerHTML = entries.map(card).join("");
  if (filters) {
    filters.innerHTML = categories.map((category, index) => (
      `<button type="button" data-filter="${escapeHtml(category)}" aria-pressed="${index === 0 ? "true" : "false"}">${escapeHtml(category)}</button>`
    )).join("");
  }

  function applyFilter(filter) {
    let visible = 0;
    document.querySelectorAll(".journal-list .journal-card").forEach((entry) => {
      const show = filter === "All" || entry.dataset.categories.split("|").includes(filter);
      entry.hidden = !show;
      if (show) visible += 1;
    });
    document.querySelectorAll("[data-filter]").forEach((button) => {
      button.setAttribute("aria-pressed", String(button.dataset.filter === filter));
    });
    if (status) status.textContent = filter === "All"
      ? `Showing all ${visible} supported entries.`
      : `Showing ${visible} ${visible === 1 ? "entry" : "entries"} for ${filter}.`;
  }

  document.querySelectorAll("[data-filter]").forEach((button) => {
    button.addEventListener("click", () => applyFilter(button.dataset.filter));
  });

  const navToggle = document.querySelector("[data-nav-toggle]");
  const nav = document.querySelector("[data-site-nav]");
  if (navToggle && nav) {
    navToggle.addEventListener("click", () => {
      const open = !nav.classList.contains("is-open");
      nav.classList.toggle("is-open", open);
      navToggle.setAttribute("aria-expanded", String(open));
    });
  }

  applyFilter("All");
})();
