(function () {
  const indexPath = "logs/devlogs-index.json";
  const indexRequestPath = `${indexPath}?v=20260707-site-v25-devlogs-carousel-controls`;
  const logBasePath = "logs/";

  const selectors = {
    list: "[data-devlog-list]",
    count: "[data-devlog-count]",
    viewer: "[data-devlog-viewer]",
    path: "[data-devlog-viewer-path]",
    meta: "[data-devlog-viewer-meta]",
    title: "[data-devlog-viewer-title]",
    content: "[data-devlog-viewer-content]",
    close: "[data-devlog-close]"
  };

  let currentButton = null;
  let logsByKey = new Map();
  let loadedLogs = [];

  function prefersReducedMotion() {
    return window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function formatDate(dateString) {
    if (!dateString) return "Undated";
    const date = new Date(`${dateString}T12:00:00`);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  }

  function normalizeLog(rawLog) {
    const session = rawLog.session || "";
    const area = rawLog.area || rawLog.projectCode || "LOG";
    const title = rawLog.title || `Dev Log ${session}`.trim();

    return {
      session,
      area,
      date: rawLog.date || "",
      title,
      version: rawLog.version || "",
      summary: rawLog.summary || "Public session notes copied into the website archive.",
      filename: rawLog.filename || "",
      publicReady: rawLog.publicReady === true,
      tags: Array.isArray(rawLog.tags) ? rawLog.tags : []
    };
  }

  function sessionLabel(log) {
    return [log.area, log.session ? `SESSION ${log.session}` : "", formatDate(log.date)]
      .filter(Boolean)
      .join(" - ");
  }

  function logSlug(log) {
    return String(log.filename || log.title || log.session || "dev-log")
      .replace(/\.md$/i, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  function registerLogKeys(log) {
    const keys = [
      log.session,
      log.filename,
      log.filename.replace(/\.md$/i, ""),
      logSlug(log),
      `${log.area}-${log.session}`
    ];

    keys.forEach((key) => {
      const normalized = String(key || "").trim().toLowerCase();
      if (normalized) logsByKey.set(normalized, log);
    });
  }

  function getRequestedLog(logs) {
    const params = new URLSearchParams(window.location.search);
    const queryValue = params.get("log");
    const hash = window.location.hash.replace(/^#/, "");
    const hashValue = hash.startsWith("log=") ? hash.slice(4) : hash;
    const requested = decodeURIComponent(queryValue || hashValue || "").trim().toLowerCase();

    if (!requested || requested === "entries-title" || requested === "devlog-viewer") {
      return null;
    }

    return logsByKey.get(requested) || logs.find((log) => logSlug(log) === requested) || null;
  }

  function findLogButton(log) {
    if (!log) return null;
    return document.querySelector(`[data-log-slug="${logSlug(log)}"]`);
  }

  function loadRequestedFromUrl(options) {
    const requestedLog = getRequestedLog(loadedLogs);
    if (!requestedLog || !requestedLog.publicReady || !requestedLog.filename) {
      setSelectedButton(null);
      setViewerState("empty");
      return false;
    }

    loadLog(requestedLog, findLogButton(requestedLog), Object.assign({ focusViewer: true, updateUrl: false }, options || {}));
    return true;
  }

  function updateLogUrl(log) {
    if (!window.history || !log) return;

    const url = new URL(window.location.href);
    url.searchParams.delete("log");
    url.hash = `log=${encodeURIComponent(logSlug(log))}`;
    window.history.pushState({ devlog: logSlug(log) }, "", url);
  }

  function clearLogUrl() {
    if (!window.history) return;

    const url = new URL(window.location.href);
    url.searchParams.delete("log");
    url.hash = "";
    window.history.pushState({}, "", url);
  }

  function renderTagList(tags) {
    if (!tags.length) return null;

    const tagList = document.createElement("ul");
    tagList.className = "devlog-tag-list";
    tagList.setAttribute("aria-label", "Dev log tags");

    tags.forEach((tag) => {
      const item = document.createElement("li");
      item.textContent = tag;
      tagList.appendChild(item);
    });

    return tagList;
  }

  function createDevLogCard(log) {
    const canOpen = log.publicReady && Boolean(log.filename);
    const card = document.createElement("button");
    card.className = "card devlog-card devlog-card-button";
    card.type = "button";
    card.disabled = !canOpen;
    card.dataset.filename = log.filename;
    card.dataset.logSlug = logSlug(log);
    card.setAttribute("aria-label", canOpen ? `Open ${log.title}` : `${log.title} is pending public release`);

    if (!canOpen) {
      card.classList.add("is-pending");
      card.setAttribute("aria-disabled", "true");
    }

    const eyebrow = document.createElement("span");
    eyebrow.className = "eyebrow";
    eyebrow.textContent = sessionLabel(log);
    card.appendChild(eyebrow);

    const title = document.createElement("span");
    title.className = "devlog-card__title";
    title.textContent = log.title;
    card.appendChild(title);

    if (log.version) {
      const version = document.createElement("span");
      version.className = "devlog-card__version";
      version.textContent = log.version;
      card.appendChild(version);
    }

    const summary = document.createElement("span");
    summary.className = "devlog-card__summary";
    summary.textContent = log.summary;
    card.appendChild(summary);

    const tagList = renderTagList(log.tags);
    if (tagList) card.appendChild(tagList);

    const action = document.createElement("span");
    action.className = canOpen ? "text-action" : "text-action is-disabled";
    action.textContent = canOpen ? "OPEN PAPER READER" : "PENDING PUBLIC COPY";
    card.appendChild(action);

    if (canOpen) {
      card.addEventListener("click", () => loadLog(log, card, { updateUrl: true }));
    }

    return card;
  }

  function setCount(logs) {
    const publicCount = logs.filter((log) => log.publicReady).length;
    document.querySelectorAll(selectors.count).forEach((count) => {
      count.textContent = `${publicCount}/${logs.length}`;
    });
  }

  function setViewerState(state, details) {
    const viewer = document.querySelector(selectors.viewer);
    const path = document.querySelector(selectors.path);
    const meta = document.querySelector(selectors.meta);
    const title = document.querySelector(selectors.title);
    const content = document.querySelector(selectors.content);
    const close = document.querySelector(selectors.close);

    if (!viewer || !path || !meta || !title || !content || !close) return;

    if (state === "loading") {
      viewer.hidden = false;
      path.textContent = `${logBasePath}${details.filename}`;
      meta.textContent = sessionLabel(details);
      title.textContent = details.title;
      content.innerHTML = '<p class="devlog-viewer__state">Loading paper copy...</p>';
      close.hidden = false;
      return;
    }

    if (state === "error") {
      viewer.hidden = false;
      path.textContent = details.filename ? `${logBasePath}${details.filename}` : indexPath;
      meta.textContent = "reader fallback note";
      title.textContent = "Log Could Not Load";
      content.innerHTML = `<p class="devlog-viewer__state devlog-viewer__state--error">${escapeHtml(details.message)}</p>`;
      close.hidden = false;
      return;
    }

    if (state === "loaded") {
      viewer.hidden = false;
      path.textContent = `${logBasePath}${details.log.filename}`;
      meta.textContent = sessionLabel(details.log);
      title.textContent = details.log.title;
      content.innerHTML = details.html;
      close.hidden = false;
      return;
    }

    path.textContent = "logs/";
    meta.textContent = "select a pinned card";
    title.textContent = "Paper Reader";
    content.innerHTML = "<p>Selected public Markdown appears here as a paper copy.</p>";
    close.hidden = true;
    viewer.hidden = true;
  }

  function sanitizeHref(url) {
    const trimmed = String(url || "").trim();
    if (!trimmed) return "";

    const lower = trimmed.toLowerCase();
    if (lower.startsWith("javascript:") || lower.startsWith("data:")) return "";
    return trimmed;
  }

  function renderInline(value) {
    let html = escapeHtml(value);

    html = html.replace(/`([^`]+)`/g, "<code>$1</code>");
    html = html.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
    html = html.replace(/\*([^*]+)\*/g, "<em>$1</em>");
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, function (_match, label, rawUrl) {
      const href = sanitizeHref(rawUrl.replace(/&amp;/g, "&"));
      if (!href) return label;
      return `<a href="${escapeHtml(href)}" target="_blank" rel="noopener noreferrer">${label}</a>`;
    });

    return html;
  }

  function renderTable(rows) {
    const normalizedRows = rows.map((row) => row.trim().replace(/^\|/, "").replace(/\|$/, "").split("|").map((cell) => cell.trim()));
    if (normalizedRows.length < 2) return "";

    const [headings, _divider, ...bodyRows] = normalizedRows;
    const headerHtml = headings.map((heading) => `<th>${renderInline(heading)}</th>`).join("");
    const bodyHtml = bodyRows.map((row) => {
      const cells = row.map((cell) => `<td>${renderInline(cell)}</td>`).join("");
      return `<tr>${cells}</tr>`;
    }).join("");

    return `<div class="devlog-table-scroll"><table><thead><tr>${headerHtml}</tr></thead><tbody>${bodyHtml}</tbody></table></div>`;
  }

  function renderMarkdown(markdown) {
    const lines = String(markdown || "").replace(/\r\n/g, "\n").split("\n");
    const output = [];
    let paragraph = [];
    let listType = "";
    let inCode = false;
    let codeLines = [];

    function flushParagraph() {
      if (!paragraph.length) return;
      output.push(`<p>${renderInline(paragraph.join(" "))}</p>`);
      paragraph = [];
    }

    function closeList() {
      if (!listType) return;
      output.push(`</${listType}>`);
      listType = "";
    }

    function openList(type) {
      if (listType === type) return;
      closeList();
      listType = type;
      output.push(`<${type}>`);
    }

    for (let index = 0; index < lines.length; index += 1) {
      const line = lines[index];
      const trimmed = line.trim();

      if (trimmed.startsWith("```")) {
        flushParagraph();
        closeList();

        if (inCode) {
          output.push(`<pre><code>${escapeHtml(codeLines.join("\n"))}</code></pre>`);
          codeLines = [];
          inCode = false;
        } else {
          inCode = true;
        }
        continue;
      }

      if (inCode) {
        codeLines.push(line);
        continue;
      }

      if (!trimmed) {
        flushParagraph();
        closeList();
        continue;
      }

      if (trimmed.includes("|") && lines[index + 1] && /^\s*\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)+\|?\s*$/.test(lines[index + 1])) {
        flushParagraph();
        closeList();
        const tableRows = [line, lines[index + 1]];
        index += 2;
        while (index < lines.length && lines[index].trim().includes("|")) {
          tableRows.push(lines[index]);
          index += 1;
        }
        index -= 1;
        output.push(renderTable(tableRows));
        continue;
      }

      const heading = /^(#{1,6})\s+(.+)$/.exec(trimmed);
      if (heading) {
        flushParagraph();
        closeList();
        const level = Math.min(heading[1].length + 1, 6);
        output.push(`<h${level}>${renderInline(heading[2])}</h${level}>`);
        continue;
      }

      if (/^---+$/.test(trimmed)) {
        flushParagraph();
        closeList();
        output.push("<hr>");
        continue;
      }

      const quote = /^>\s?(.+)$/.exec(trimmed);
      if (quote) {
        flushParagraph();
        closeList();
        output.push(`<blockquote>${renderInline(quote[1])}</blockquote>`);
        continue;
      }

      const unordered = /^[-*]\s+(.+)$/.exec(trimmed);
      if (unordered) {
        flushParagraph();
        openList("ul");
        output.push(`<li>${renderInline(unordered[1])}</li>`);
        continue;
      }

      const ordered = /^\d+\.\s+(.+)$/.exec(trimmed);
      if (ordered) {
        flushParagraph();
        openList("ol");
        output.push(`<li>${renderInline(ordered[1])}</li>`);
        continue;
      }

      paragraph.push(trimmed);
    }

    if (inCode) {
      output.push(`<pre><code>${escapeHtml(codeLines.join("\n"))}</code></pre>`);
    }

    flushParagraph();
    closeList();

    return output.join("\n");
  }

  function setSelectedButton(button) {
    if (currentButton) {
      currentButton.removeAttribute("aria-pressed");
      currentButton.classList.remove("is-selected");
    }

    currentButton = button || null;

    if (currentButton) {
      currentButton.setAttribute("aria-pressed", "true");
      currentButton.classList.add("is-selected");
    }
  }

  function getCarouselStep(carousel) {
    const card = carousel.querySelector(".devlog-card-button");
    const styles = window.getComputedStyle(carousel);
    const gap = parseFloat(styles.columnGap || styles.gap || "0") || 0;
    return card ? card.getBoundingClientRect().width + gap : Math.min(360, carousel.clientWidth * 0.86);
  }

  function updateCarouselControls(shell) {
    const carousel = shell.querySelector(".log-carousel");
    const previous = shell.querySelector("[data-log-carousel-prev]");
    const next = shell.querySelector("[data-log-carousel-next]");
    if (!carousel || !previous || !next) return;

    const edgeTolerance = 16;
    const hasOverflow = carousel.scrollWidth > carousel.clientWidth + 1;
    const atStart = carousel.scrollLeft <= edgeTolerance;
    const atEnd = carousel.scrollLeft + carousel.clientWidth >= carousel.scrollWidth - edgeTolerance;

    previous.setAttribute("aria-disabled", String(!hasOverflow || atStart));
    next.setAttribute("aria-disabled", String(!hasOverflow || atEnd));
    shell.dataset.carouselAtStart = String(!hasOverflow || atStart);
    shell.dataset.carouselAtEnd = String(!hasOverflow || atEnd);
  }

  function updateAllCarouselControls() {
    document.querySelectorAll("[data-log-carousel-shell]").forEach(updateCarouselControls);
  }

  function scrollCarousel(shell, direction) {
    const carousel = shell.querySelector(".log-carousel");
    if (!carousel) return;
    const control = direction < 0
      ? shell.querySelector("[data-log-carousel-prev]")
      : shell.querySelector("[data-log-carousel-next]");
    if (control && control.getAttribute("aria-disabled") === "true") return;

    carousel.scrollTo({
      left: carousel.scrollLeft + (getCarouselStep(carousel) * direction),
      behavior: prefersReducedMotion() ? "auto" : "smooth"
    });

    window.setTimeout(() => updateCarouselControls(shell), prefersReducedMotion() ? 0 : 220);
  }

  async function loadLog(log, button, options) {
    const viewer = document.querySelector(selectors.viewer);
    if (!viewer) return;
    const settings = Object.assign({ focusViewer: true, updateUrl: false }, options || {});

    setSelectedButton(button);

    setViewerState("loading", log);
    if (button && button.closest(".log-carousel")) {
      button.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
      window.setTimeout(updateAllCarouselControls, prefersReducedMotion() ? 0 : 220);
    }

    if (settings.updateUrl) {
      updateLogUrl(log);
    }

    if (settings.focusViewer) {
      viewer.focus({ preventScroll: true });
      viewer.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    try {
      const response = await fetch(`${logBasePath}${encodeURIComponent(log.filename)}`);
      if (!response.ok) {
        throw new Error(`Missing public markdown copy (${response.status}).`);
      }

      const markdown = await response.text();
      setViewerState("loaded", {
        log,
        html: renderMarkdown(markdown)
      });
    } catch (error) {
      setViewerState("error", {
        filename: log.filename,
        message: `This log is listed, but the markdown file could not be loaded. ${error.message}`
      });
    }
  }

  async function loadIndex() {
    const containers = Array.from(document.querySelectorAll(selectors.list));
    if (!containers.length) return;

    containers.forEach((container) => {
      container.innerHTML = '<p class="devlog-viewer__state">Loading public Dev Log index...</p>';
    });

    try {
      const response = await fetch(indexRequestPath);
      if (!response.ok) {
        throw new Error(`Index returned ${response.status}.`);
      }

      const data = await response.json();
      const logs = data.map(normalizeLog).sort((a, b) => {
        const dateSort = String(b.date).localeCompare(String(a.date));
        if (dateSort !== 0) return dateSort;
        return String(b.session).localeCompare(String(a.session));
      });
      logsByKey = new Map();
      loadedLogs = logs;
      loadedLogs.forEach(registerLogKeys);

      setCount(logs);
      containers.forEach((container) => {
        if (!logs.length) {
          container.innerHTML = '<p class="devlog-viewer__state">No public Dev Logs are ready yet.</p>';
          return;
        }

        container.replaceChildren(...logs.map(createDevLogCard));
      });
      updateAllCarouselControls();

      if (!loadRequestedFromUrl({ focusViewer: true })) {
        setSelectedButton(null);
        setViewerState("empty");
      }
    } catch (error) {
      setCount([]);
      containers.forEach((container) => {
        container.innerHTML = `<p class="devlog-viewer__state devlog-viewer__state--error">The public Dev Log index could not load. ${escapeHtml(error.message)}</p>`;
      });
      setViewerState("error", {
        filename: "",
        message: "The archive is still here, but the index file is unavailable right now."
      });
    }
  }

  function wireClose() {
    const close = document.querySelector(selectors.close);
    if (!close) return;

    close.addEventListener("click", () => {
      setSelectedButton(null);
      setViewerState("empty");
      clearLogUrl();
      const firstCard = document.querySelector(".devlog-card-button:not(:disabled)");
      if (firstCard) firstCard.focus();
    });
  }

  function wireCarouselWheel() {
    document.querySelectorAll(".log-carousel").forEach((carousel) => {
      carousel.addEventListener("wheel", (event) => {
        const hasHorizontalOverflow = carousel.scrollWidth > carousel.clientWidth;
        const verticalIntent = Math.abs(event.deltaY) > Math.abs(event.deltaX);
        if (!hasHorizontalOverflow || !verticalIntent) return;

        event.preventDefault();
        carousel.scrollLeft += event.deltaY;
        updateAllCarouselControls();
      }, { passive: false });
    });
  }

  function wireCarouselControls() {
    document.querySelectorAll("[data-log-carousel-shell]").forEach((shell) => {
      const carousel = shell.querySelector(".log-carousel");
      const previous = shell.querySelector("[data-log-carousel-prev]");
      const next = shell.querySelector("[data-log-carousel-next]");
      if (!carousel || !previous || !next) return;
      const handleControlKey = (event, direction) => {
        if (event.key !== "Enter" && event.key !== " ") return;
        event.preventDefault();
        scrollCarousel(shell, direction);
      };

      previous.addEventListener("click", () => scrollCarousel(shell, -1));
      next.addEventListener("click", () => scrollCarousel(shell, 1));
      previous.addEventListener("keydown", (event) => handleControlKey(event, -1));
      next.addEventListener("keydown", (event) => handleControlKey(event, 1));
      carousel.addEventListener("scroll", () => updateCarouselControls(shell), { passive: true });
      updateCarouselControls(shell);
    });

    window.addEventListener("resize", updateAllCarouselControls);
  }

  document.addEventListener("DOMContentLoaded", () => {
    if (document.body.getAttribute("data-page") !== "devlogs") return;
    wireClose();
    wireCarouselControls();
    wireCarouselWheel();
    loadIndex();
    window.addEventListener("hashchange", () => loadRequestedFromUrl({ focusViewer: true }));
    window.addEventListener("popstate", () => loadRequestedFromUrl({ focusViewer: true }));
  });
})();
