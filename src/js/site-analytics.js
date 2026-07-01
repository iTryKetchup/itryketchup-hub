(function () {
  const config = window.ITK_SUPABASE_CONFIG || {};
  const allowedEvents = new Set([
    "page_view",
    "click",
    "outbound_link",
    "project_open",
    "devlog_open",
    "game_open",
    "download",
    "audio_play",
    "video_open",
    "other"
  ]);
  const textMax = {
    pagePath: 300,
    pageTitle: 200,
    elementId: 120,
    elementLabel: 200,
    targetUrl: 500,
    referrer: 500,
    sessionId: 120
  };

  function isDoNotTrackEnabled() {
    return navigator.doNotTrack === "1" || window.doNotTrack === "1" || navigator.msDoNotTrack === "1";
  }

  if (!config.url || !config.publishableKey || isDoNotTrackEnabled()) {
    return;
  }

  const endpoint = `${String(config.url).replace(/\/$/, "")}/rest/v1/site_events`;
  const sessionStorageKey = "itk_site_analytics_session";

  function trim(value, maxLength) {
    return String(value || "").replace(/\s+/g, " ").trim().slice(0, maxLength);
  }

  function currentPath() {
    return trim(window.location.pathname || "/", textMax.pagePath);
  }

  function cleanUrl(value) {
    if (!value) return "";
    try {
      const parsed = new URL(value, window.location.href);
      if (parsed.protocol === "mailto:") {
        return trim(`mailto:${parsed.pathname}`, textMax.targetUrl);
      }
      if (parsed.origin === window.location.origin) {
        return trim(parsed.pathname || "/", textMax.targetUrl);
      }
      return trim(`${parsed.origin}${parsed.pathname || "/"}`, textMax.targetUrl);
    } catch (error) {
      return "";
    }
  }

  function getSessionId() {
    try {
      const existing = window.sessionStorage.getItem(sessionStorageKey);
      if (existing) return trim(existing, textMax.sessionId);
      const value = window.crypto && typeof window.crypto.randomUUID === "function"
        ? window.crypto.randomUUID()
        : `session-${Date.now()}-${Math.random().toString(36).slice(2, 12)}`;
      window.sessionStorage.setItem(sessionStorageKey, value);
      return trim(value, textMax.sessionId);
    } catch (error) {
      return "";
    }
  }

  function labelForElement(element) {
    if (!element) return "";
    return trim(
      element.getAttribute("data-track-label") ||
        element.getAttribute("aria-label") ||
        element.textContent ||
        element.getAttribute("title") ||
        element.id ||
        element.tagName.toLowerCase(),
      textMax.elementLabel
    );
  }

  function normalizeEventType(value) {
    const normalized = trim(value, 40).toLowerCase().replace(/[^a-z0-9_]+/g, "_");
    return allowedEvents.has(normalized) ? normalized : "";
  }

  function isExternalLink(url) {
    try {
      const parsed = new URL(url, window.location.href);
      return parsed.origin !== window.location.origin && parsed.protocol !== "mailto:";
    } catch (error) {
      return false;
    }
  }

  function isDownloadLink(anchor, href) {
    if (anchor && anchor.hasAttribute("download")) return true;
    try {
      return /\.(pdf|zip|mp3|wav|m4a|mp4|mov|webm|png|jpe?g|webp|svg)$/i.test(new URL(href, window.location.href).pathname);
    } catch (error) {
      return false;
    }
  }

  function classifyClick(element, anchor) {
    const explicit = normalizeEventType(element.getAttribute("data-track"));
    if (explicit) return explicit;
    if (!anchor || !anchor.href) return "click";

    let parsed;
    try {
      parsed = new URL(anchor.href, window.location.href);
    } catch (error) {
      return "click";
    }

    if (isDownloadLink(anchor, anchor.href)) return "download";
    if (/youtube\.com|youtu\.be/i.test(parsed.hostname)) return "video_open";
    if (anchor.closest(".project-card")) return "project_open";
    if (anchor.closest(".devlog-card") || parsed.pathname.startsWith("/dev-logs") || parsed.pathname.startsWith("/logs/")) return "devlog_open";
    if (parsed.pathname.startsWith("/games/")) return "game_open";
    if (isExternalLink(anchor.href) || parsed.protocol === "mailto:") return "outbound_link";
    return "click";
  }

  function sendEvent(eventType, details) {
    const normalizedType = allowedEvents.has(eventType) ? eventType : "other";
    const payload = {
      event_type: normalizedType,
      page_path: currentPath(),
      page_title: trim(document.title, textMax.pageTitle),
      element_id: trim(details && details.elementId, textMax.elementId),
      element_label: trim(details && details.elementLabel, textMax.elementLabel),
      target_url: trim(details && details.targetUrl, textMax.targetUrl),
      referrer: cleanUrl(document.referrer),
      session_id: getSessionId(),
      metadata: details && details.metadata ? details.metadata : {},
      created_at: new Date().toISOString()
    };
    const body = JSON.stringify(payload);
    window.fetch(endpoint, {
      method: "POST",
      headers: {
        apikey: config.publishableKey,
        "Content-Type": "application/json",
        Prefer: "return=minimal"
      },
      body,
      keepalive: body.length < 60000
    }).catch(function () {});
  }

  function trackPageView() {
    sendEvent("page_view", {
      metadata: {
        analytics_version: "site-v1.6",
        path_only: true
      }
    });
  }

  function trackClick(event) {
    const element = event.target.closest && event.target.closest("[data-track], a, button");
    if (!element) return;
    const anchor = element.closest("a");
    const type = classifyClick(element, anchor);
    sendEvent(type, {
      elementId: element.id || "",
      elementLabel: labelForElement(element),
      targetUrl: anchor ? cleanUrl(anchor.href) : "",
      metadata: {
        tag: element.tagName.toLowerCase()
      }
    });
  }

  function trackMediaPlay(event) {
    const media = event.target;
    if (!media || !/^(audio|video)$/i.test(media.tagName)) return;
    sendEvent(media.tagName.toLowerCase() === "audio" ? "audio_play" : "video_open", {
      elementId: media.id || "",
      elementLabel: labelForElement(media) || "media",
      targetUrl: cleanUrl(media.currentSrc || media.getAttribute("src") || ""),
      metadata: {
        tag: media.tagName.toLowerCase()
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", trackPageView, { once: true });
  } else {
    trackPageView();
  }

  document.addEventListener("click", trackClick, { capture: true });
  document.addEventListener("play", trackMediaPlay, true);
})();
