(function () {
  const statusLabels = {
    active: "Active",
    released: "Released",
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
      action.dataset.track = "project_open";
      action.dataset.trackLabel = `${project.title} - ${action.textContent}`;
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
      action.dataset.track = "devlog_open";
      action.dataset.trackLabel = `${log.title} - ${action.textContent}`;
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

  function wireTerminalEasterEgg() {
    const widgets = document.querySelectorAll("[data-terminal-widget]");
    if (!widgets.length) return;

    const responses = {
      help: "Available commands: help, dir, ketchup, status, clear",
      dir: "home/\nabout/\nprojects/\ndev-logs/\ncontact/\nassets/\nclassified-condiments/",
      status: "Website: operational\nScope creep: contained\nMascot animation: pending\nCorporate fog: 0%",
      ketchup: "    __\n   /  \\\n  | IT |\n  | RY |\n  |____|\n   \\__/  secret sauce detected"
    };

    const aboutResponses = [
      "[BUG] Polish pass escaped containment. Re-apply ketchup sealant.",
      "[ERROR] Unicorn startup not found. Try: small-studio --honest",
      "[WARN] Blender grid alignment improved by 12%. Floor still judging us.",
      "[BUG] Mascot charm stat overflowed. Mystery remains suspiciously low.",
      "[ERROR] projects_REAL_v3 detected. Quarantining folder name.",
      "[WARN] GitHub account located. Business plan still loading.",
      "[BUG] Sauce pipeline clogged near final-final-maybe.",
      "[ERROR] Corporate fog machine unavailable. Public dev logs remain visible.",
      "[WARN] Cinematic ambition detected. Current build budget recommends patience.",
      "[BUG] Command succeeded emotionally, failed technically."
    ];

    function responseForAbout(command) {
      const normalized = command.toLowerCase();
      let hash = 0;
      for (const character of normalized) {
        hash = (hash + character.charCodeAt(0)) % aboutResponses.length;
      }
      return aboutResponses[hash];
    }

    function severityFor(response) {
      const match = response.match(/^\[(BUG|ERROR|WARN)\]/);
      return match ? match[1].toLowerCase() : "";
    }

    widgets.forEach((widget) => {
      const form = widget.querySelector("[data-terminal-form]");
      const input = widget.querySelector("[data-terminal-input]");
      const output = widget.querySelector("[data-terminal-output]");
      if (!form || !input || !output || widget.dataset.terminalWired === "true") return;

      const mode = widget.dataset.terminalMode || "home";
      const prompt = widget.dataset.terminalPrompt || "PS C:\\itryketchup-studio>";
      const maxEntries = Number.parseInt(widget.dataset.terminalMaxEntries || "8", 10);

      function appendOutput(command, response) {
        const entry = document.createElement("div");
        entry.className = "terminal-output__entry";

        const commandLine = document.createElement("div");
        commandLine.className = "terminal-output__command";
        commandLine.textContent = `${prompt} ${command}`;

        const responseBlock = document.createElement("pre");
        responseBlock.className = "terminal-output__response";
        const severity = severityFor(response);
        if (severity) {
          responseBlock.dataset.terminalSeverity = severity;
        }
        responseBlock.textContent = response;

        entry.append(commandLine, responseBlock);
        output.appendChild(entry);
        while (output.children.length > maxEntries) {
          output.removeChild(output.firstElementChild);
        }
        output.scrollTop = output.scrollHeight;
      }

      form.addEventListener("submit", (event) => {
        event.preventDefault();

        const rawCommand = input.value.trim();
        if (!rawCommand) return;

        const command = rawCommand.toLowerCase();
        input.value = "";

        if (mode !== "about" && command === "clear") {
          output.replaceChildren();
          return;
        }

        const response = mode === "about"
          ? responseForAbout(rawCommand)
          : responses[command] || `Command not recognized: ${rawCommand}\nTry 'help' before the condiment firewall notices.`;
        appendOutput(rawCommand, response);
      });

      input.addEventListener("keydown", (event) => {
        if (event.key !== "Enter") return;
        event.preventDefault();
        if (typeof form.requestSubmit === "function") {
          form.requestSubmit();
        } else {
          form.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
        }
      });

      widget.dataset.terminalWired = "true";
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
    wireTerminalEasterEgg();
  });
})();
