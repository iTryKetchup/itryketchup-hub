(function () {
  const statusLabels = {
    active: "Active",
    planned: "Planned",
    "coming-soon": "Coming Soon",
    hidden: "Hidden",
    archive: "Archive",
    disabled: "Disabled",
    "fan-project": "Fan Project"
  };

  const publicItems = (items) => (items || []).filter((item) => item.visibility !== "hidden");

  function getRegistryImage(id, fallbackIdOverride) {
    const settings = window.SiteSettings || {};
    const assignments = settings.imageAssignments || {};
    const fallbackId = fallbackIdOverride || assignments.defaultMascotId || "default";
    const registry = window.MascotsData || {};
    return registry[id] || registry[fallbackId] || {
      src: "assets/mascots/mascot-placeholder.svg",
      alt: "iTryKetchup Studio mascot placeholder."
    };
  }

  function applyRegistryImages() {
    const assignments = (window.SiteSettings || {}).imageAssignments || {};
    document.querySelectorAll("[data-image-id]").forEach((image) => {
      const assignmentKey = image.getAttribute("data-image-assignment");
      const imageId = assignments[assignmentKey] || image.getAttribute("data-image-id");
      const asset = getRegistryImage(imageId);
      image.src = asset.src;
      image.alt = asset.alt;
      image.dataset.imageId = imageId;
      image.dataset.imageRole = asset.role || "";
    });
  }

  function createStatusBadge(status) {
    const badge = document.createElement("span");
    badge.className = `status-badge status-${status}`;
    badge.textContent = statusLabels[status] || status;
    return badge;
  }

  function renderProjectCard(project) {
    const article = document.createElement("article");
    article.className = "card project-card";

    const image = document.createElement("img");
    image.className = "card-image";
    const projectFallbackId = ((window.SiteSettings || {}).imageAssignments || {}).projectFallbackImageId;
    const asset = getRegistryImage(project.imageId, projectFallbackId);
    image.src = project.image || asset.src;
    image.alt = project.alt || asset.alt;
    image.dataset.imageId = project.imageId || "";
    article.appendChild(image);

    const meta = document.createElement("div");
    meta.className = "card-meta";
    meta.appendChild(createStatusBadge(project.status));

    const category = document.createElement("span");
    category.className = "category-label";
    category.textContent = project.category;
    meta.appendChild(category);
    article.appendChild(meta);

    const title = document.createElement("h3");
    title.textContent = project.title;
    article.appendChild(title);

    const summary = document.createElement("p");
    summary.textContent = project.summary;
    article.appendChild(summary);

    if (project.fanProject && project.disclaimer) {
      const disclaimer = document.createElement("p");
      disclaimer.className = "fan-disclaimer";
      disclaimer.textContent = project.disclaimer;
      article.appendChild(disclaimer);
    }

    const action = document.createElement(project.link ? "a" : "span");
    action.className = project.link ? "text-action" : "text-action is-disabled";
    action.textContent = project.actionLabel || "More";
    if (project.link) {
      action.href = project.link;
    } else {
      action.setAttribute("aria-disabled", "true");
    }
    article.appendChild(action);

    return article;
  }

  function renderDevLogCard(log) {
    const article = document.createElement("article");
    article.className = "card devlog-card";

    if (log.imageId) {
      const logFallbackId = ((window.SiteSettings || {}).imageAssignments || {}).projectFallbackImageId;
      const asset = getRegistryImage(log.imageId, logFallbackId);
      const image = document.createElement("img");
      image.className = "card-image";
      image.src = log.image || asset.src;
      image.alt = log.alt || asset.alt;
      image.dataset.imageId = log.imageId;
      article.appendChild(image);
    }

    const eyebrow = document.createElement("p");
    eyebrow.className = "eyebrow";
    eyebrow.textContent = `${log.projectCode} | ${formatDate(log.date)}`;
    article.appendChild(eyebrow);

    const title = document.createElement("h3");
    title.textContent = log.title;
    article.appendChild(title);

    const summary = document.createElement("p");
    summary.textContent = log.summary;
    article.appendChild(summary);

    const action = document.createElement(log.link ? "a" : "span");
    action.className = log.link ? "text-action" : "text-action is-disabled";
    action.textContent = log.link ? (log.actionLabel || "Read Log") : `${log.actionLabel || "Log"} - static preview`;
    if (log.link) {
      action.href = log.link;
    } else {
      action.setAttribute("aria-disabled", "true");
    }
    article.appendChild(action);

    return article;
  }

  function formatDate(dateString) {
    const date = new Date(`${dateString}T12:00:00`);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  }

  function renderProjects() {
    document.querySelectorAll("[data-project-list]").forEach((container) => {
      const mode = container.getAttribute("data-project-list");
      const projects = publicItems(window.ProjectsData);
      const selected = mode === "preview" ? projects.slice(0, 3) : projects;
      container.replaceChildren(...selected.map(renderProjectCard));
    });
  }

  function renderDevLogs() {
    document.querySelectorAll("[data-devlog-list]").forEach((container) => {
      const mode = container.getAttribute("data-devlog-list");
      const logs = publicItems(window.DevLogsData);
      const selected = mode === "preview" ? logs.slice(0, 1) : logs;
      container.replaceChildren(...selected.map(renderDevLogCard));
    });
  }

  function wireMobileNav() {
    const toggle = document.querySelector("[data-nav-toggle]");
    const nav = document.querySelector("[data-site-nav]");
    if (!toggle || !nav) return;

    toggle.addEventListener("click", () => {
      const expanded = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!expanded));
      nav.classList.toggle("is-open", !expanded);
    });
  }

  function markCurrentPage() {
    const current = document.body.getAttribute("data-page");
    document.querySelectorAll("[data-nav-link]").forEach((link) => {
      if (link.getAttribute("data-nav-link") === current) {
        link.setAttribute("aria-current", "page");
      }
    });
  }

  function fillYear() {
    document.querySelectorAll("[data-current-year]").forEach((node) => {
      node.textContent = new Date().getFullYear();
    });
  }

  function preventDisabledLinks() {
    document.querySelectorAll("[data-disabled-link]").forEach((link) => {
      link.addEventListener("click", (event) => event.preventDefault());
      link.setAttribute("aria-disabled", "true");
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    applyRegistryImages();
    renderProjects();
    renderDevLogs();
    wireMobileNav();
    markCurrentPage();
    fillYear();
    preventDisabledLinks();
  });
})();
