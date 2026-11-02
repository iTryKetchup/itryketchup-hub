#!/usr/bin/env node
"use strict";

const assert = require("node:assert/strict");
const crypto = require("node:crypto");
const fs = require("node:fs");
const http = require("node:http");
const os = require("node:os");
const path = require("node:path");
const { spawn } = require("node:child_process");

const repoRoot = path.resolve(__dirname, "..");
const srcRoot = path.join(repoRoot, "src");
const arLabRoot = path.join(srcRoot, "ar-lab");
const screenshotRoot = path.join(repoRoot, "evidence", "oneiros-v1");
let checks = 0;

function check(condition, message) {
  assert.ok(condition, message);
  checks += 1;
}

function sha256(filePath) {
  return crypto.createHash("sha256").update(fs.readFileSync(filePath)).digest("hex").toUpperCase();
}

function runStaticChecks() {
  const required = [
    "index.html", "dev-log/index.html", "assets/oneiros.css", "assets/oneiros.js",
    "assets/journal-data.js", "assets/journal.js", "assets/approved-media.js",
    "assets/oneiros-hero-concept-codex-v1.jpg", "assets/oneiros-helmet-hud-concept-codex-v1.jpg"
  ];
  required.forEach((relative) => check(fs.existsSync(path.join(arLabRoot, ...relative.split("/"))), `exists: src/ar-lab/${relative}`));

  const hudHashes = {
    "index.html": "4E945EC829101053E2F5A9BB4BAB4D5BB557AAC64969C6CDBD9A38BE06F874CD",
    "manifest.webmanifest": "139295B91D15D8E49A612EBC8F20C4F76C4FBF5A3F6E6AC8F3ACDF14F5EA3A00",
    "icons/apple-touch-icon.png": "C26C3631509ECABAE23E6BAAE70309805E3DE29AD4283620267B602C202D7A32",
    "icons/icon-192.png": "2AB818B4EA325C9C8CDBB4985673E437CC86E2BC0068ACE3CE0D95E076A5F0B4",
    "icons/icon-512.png": "DBAF1AAFF42C1559830B668296E1D59CAC6DBF6557686BB88719EB190D3861E4"
  };
  Object.entries(hudHashes).forEach(([relative, expected]) => {
    check(sha256(path.join(srcRoot, "hud", ...relative.split("/"))) === expected, `Recon Scanner unchanged: ${relative}`);
  });

  const unrelatedHashes = {
    "projects.html": "2C0D375101040F371627E9BBE1D314A98EE95C1ABA177FED6117A1CA1BE42F0D",
    "dev-logs/index.html": "2B5D95082283D3B4BE2270791AFF4DF1D1AB79223D21D730B69B725DF9A97FE3",
    "about.html": "78B2EBD7708961BCC886D764792C6CED570BDABC713918BF7B2D61043C20D624"
  };
  Object.entries(unrelatedHashes).forEach(([relative, expected]) => {
    check(sha256(path.join(srcRoot, ...relative.split("/"))) === expected, `unrelated SITE route unchanged: ${relative}`);
  });

  const workflow = fs.readFileSync(path.join(repoRoot, ".github", "workflows", "pages.yml"), "utf8");
  check(/path:\s*\.\/src\b/.test(workflow), "Pages workflow still publishes only src");
  check(!workflow.includes("prototypes/oneiros"), "prototype tree remains outside publication workflow");

  const mainHtml = fs.readFileSync(path.join(arLabRoot, "index.html"), "utf8");
  const journalHtml = fs.readFileSync(path.join(arLabRoot, "dev-log", "index.html"), "utf8");
  const homeHtml = fs.readFileSync(path.join(srcRoot, "index.html"), "utf8");
  const css = fs.readFileSync(path.join(arLabRoot, "assets", "oneiros.css"), "utf8");
  const mainJs = fs.readFileSync(path.join(arLabRoot, "assets", "oneiros.js"), "utf8");
  const journalJs = fs.readFileSync(path.join(arLabRoot, "assets", "journal.js"), "utf8");
  const journalData = fs.readFileSync(path.join(arLabRoot, "assets", "journal-data.js"), "utf8");
  const mediaData = fs.readFileSync(path.join(arLabRoot, "assets", "approved-media.js"), "utf8");

  [mainJs, journalJs, journalData, mediaData].forEach((source, index) => {
    new Function(source);
    checks += 1;
    check(!/[A-Za-z]:\\/.test(source), `public JavaScript ${index + 1} contains no absolute Windows path`);
  });
  [mainHtml, journalHtml, css].forEach((source, index) => {
    check(!/[A-Za-z]:\\/.test(source), `public page source ${index + 1} contains no absolute Windows path`);
  });

  [
    "Project ONEIROS", "ὄνειρος", "OH-neh-ross", "BUILD THE SUIT.", "LAUNCH THE HUD.",
    "A dream worth building, one experiment at a time.", "no fixed timeline", "no guaranteed final result",
    "Rear-facing live camera goal", "Forward-facing night-vision camera goal", "Browser-hosted HUD",
    "AI assistant", "Rii forearm", "VITURE Beast", "ELEGOO Centauri Carbon 2 Combo",
    "No complete wearable system is claimed", "No company sponsors or endorses"
  ].forEach((text) => check((mainHtml + mainJs).includes(text), `ONEIROS source contains required claim: ${text}`));

  [
    "Assembled", "Exploded", "Connections", "NOT FORWARD CAMERA VIDEO", "Illustrative only",
    "never treated as validated primary walking vision", "No ONEIROS print", "No print run exists",
    "No pack, capacity, runtime", "No camera bench test", "no weapon mechanism"
  ].forEach((text) => check((mainHtml + mainJs).toLowerCase().includes(text.toLowerCase()), `evidence boundary present: ${text}`));

  check(mainHtml.includes('href="../hud/"'), "main route launches same-origin Recon Scanner");
  check(mainHtml.includes('href="dev-log/"'), "main route links dedicated Field Notes");
  check(mainHtml.includes('src="assets/oneiros-hero-concept-codex-v1.jpg"'), "main route includes generated hero concept derivative");
  check(mainHtml.includes('src="assets/oneiros-helmet-hud-concept-codex-v1.jpg"'), "main route includes generated helmet HUD concept derivative");
  check((mainHtml.match(/data-oneiros-concept=/g) || []).length === 2, "main route includes exactly two concept illustrations");
  check((mainHtml.match(/<figcaption>/g) || []).length >= 2, "concept illustrations include visible captions");
  check(mainHtml.includes("it is not a photograph, fabrication drawing, or claim that the integrated suit exists"), "hero caption preserves concept boundary");
  check(mainHtml.includes("remain future goals and are not live here"), "HUD caption preserves future-integration boundary");
  check(homeHtml.includes('class="home-oneiros-entrance"'), "homepage contains one bounded ONEIROS entrance");
  check((homeHtml.match(/href="ar-lab\/"/g) || []).length === 1, "homepage contains exactly one ONEIROS route link");
  check(journalHtml.includes("No invented prints, photographs, integrations, dates, or test results."), "journal states factual boundary");
  check(journalData.includes("Tactical Schematic selected for Website v1"), "journal includes Director design decision");
  check(journalData.includes("Nothing is approved or published automatically."), "journal preserves media approval boundary");
  check(!journalData.includes("Session00") && !journalData.includes("Governance"), "journal data contains no private log identifiers or governance detail");

  check(mediaData.includes('window.ONEIROS_APPROVED_MEDIA = Object.freeze([])'), "approved media starts empty");
  check(mediaData.includes('allowedStatus: "Approved for Web"'), "media contract requires approved status");
  check(mediaData.includes('assetPrefix: "/ar-lab/assets/approved-media/"'), "media contract uses governed same-origin path");
  check(!mediaData.includes("Incoming") && !mediaData.includes("01_Incoming"), "public media contract does not reference private intake folders");

  [
    "getUserMedia(", "geolocation.", "DeviceMotionEvent", "DeviceOrientationEvent", "speechSynthesis",
    "fetch(", "XMLHttpRequest", "WebSocket(", "EventSource(", "supabase", "analytics"
  ].forEach((forbidden) => check(!mainJs.includes(forbidden), `ONEIROS runtime excludes ${forbidden}`));

  const remoteResource = /<(?:script|link|img|source)\b[^>]+(?:src|href)=["']https?:/i;
  check(!remoteResource.test(mainHtml), "ONEIROS page has no remote runtime subresource");
  check(!remoteResource.test(journalHtml), "Field Notes page has no remote runtime subresource");
  check(css.includes("@media (prefers-reduced-motion: reduce)"), "stylesheet supports reduced motion");
  check(css.includes(":focus-visible"), "stylesheet exposes visible focus");
  check(css.includes("@media (max-width: 620px)"), "stylesheet includes phone layout");
}

function createServer() {
  const mime = new Map([
    [".html", "text/html; charset=utf-8"], [".css", "text/css; charset=utf-8"],
    [".js", "text/javascript; charset=utf-8"], [".png", "image/png"], [".webp", "image/webp"],
    [".jpg", "image/jpeg"], [".jpeg", "image/jpeg"], [".svg", "image/svg+xml"],
    [".ico", "image/x-icon"], [".json", "application/json"]
  ]);
  const server = http.createServer((request, response) => {
    const url = new URL(request.url || "/", "http://127.0.0.1");
    let pathname = decodeURIComponent(url.pathname);
    if (pathname.endsWith("/")) pathname += "index.html";
    const candidate = path.resolve(srcRoot, pathname.replace(/^\/+/, ""));
    if (!candidate.startsWith(srcRoot + path.sep) || !fs.existsSync(candidate) || !fs.statSync(candidate).isFile()) {
      response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      response.end("Not found");
      return;
    }
    response.writeHead(200, { "Content-Type": mime.get(path.extname(candidate)) || "application/octet-stream", "Cache-Control": "no-store" });
    fs.createReadStream(candidate).pipe(response);
  });
  return new Promise((resolve) => server.listen(0, "127.0.0.1", () => {
    resolve({ server, origin: `http://127.0.0.1:${server.address().port}` });
  }));
}

class Cdp {
  constructor(socket) {
    this.socket = socket;
    this.nextId = 1;
    this.pending = new Map();
    this.listeners = new Map();
    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.id) {
        const pending = this.pending.get(message.id);
        if (!pending) return;
        this.pending.delete(message.id);
        if (message.error) pending.reject(new Error(message.error.message));
        else pending.resolve(message.result);
        return;
      }
      (this.listeners.get(message.method) || []).forEach((listener) => listener(message.params || {}));
    };
  }

  static connect(url) {
    return new Promise((resolve, reject) => {
      const socket = new WebSocket(url);
      socket.onopen = () => resolve(new Cdp(socket));
      socket.onerror = () => reject(new Error("Could not connect to Chrome DevTools"));
    });
  }

  send(method, params) {
    return new Promise((resolve, reject) => {
      const id = this.nextId++;
      this.pending.set(id, { resolve, reject });
      this.socket.send(JSON.stringify({ id, method, params: params || {} }));
    });
  }

  on(method, listener) {
    const listeners = this.listeners.get(method) || [];
    listeners.push(listener);
    this.listeners.set(method, listeners);
  }

  once(method) {
    return new Promise((resolve) => {
      const wrapper = (params) => {
        const listeners = this.listeners.get(method) || [];
        this.listeners.set(method, listeners.filter((listener) => listener !== wrapper));
        resolve(params);
      };
      this.on(method, wrapper);
    });
  }

  close() {
    this.socket.close();
  }
}

async function launchChrome() {
  const candidates = [
    process.env.ONEIROS_CHROME_PATH,
    "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe"
  ].filter(Boolean);
  const executable = candidates.find((candidate) => fs.existsSync(candidate));
  check(Boolean(executable), "installed Chrome or Edge executable is available");
  const userDataDir = fs.mkdtempSync(path.join(os.tmpdir(), "oneiros-v1-chrome-"));
  const chrome = spawn(executable, [
    "--headless=new", "--disable-gpu", "--no-first-run", "--no-default-browser-check",
    "--disable-background-networking", "--disable-component-update", "--disable-sync",
    "--remote-debugging-port=0", `--user-data-dir=${userDataDir}`, "about:blank"
  ], { stdio: ["ignore", "ignore", "pipe"], windowsHide: true });
  const debuggerUrl = await new Promise((resolve, reject) => {
    let output = "";
    const timer = setTimeout(() => reject(new Error(`Chrome DevTools endpoint timeout: ${output}`)), 10000);
    chrome.stderr.on("data", (chunk) => {
      output += chunk.toString();
      const match = output.match(/DevTools listening on (ws:\/\/127\.0\.0\.1:\d+\/devtools\/browser\/[^\s]+)/);
      if (match) {
        clearTimeout(timer);
        resolve(match[1]);
      }
    });
    chrome.on("exit", (code) => {
      clearTimeout(timer);
      reject(new Error(`Chrome exited before DevTools was ready: ${code} ${output}`));
    });
  });
  const endpoint = new URL(debuggerUrl);
  const targets = await (await fetch(`http://127.0.0.1:${endpoint.port}/json/list`)).json();
  const pageTarget = targets.find((target) => target.type === "page");
  check(Boolean(pageTarget), "Chrome page target is available");
  const cdp = await Cdp.connect(pageTarget.webSocketDebuggerUrl);
  await cdp.send("Page.enable");
  await cdp.send("Runtime.enable");
  await cdp.send("Network.enable");
  return { chrome, cdp, userDataDir };
}

async function evaluate(cdp, expression) {
  const result = await cdp.send("Runtime.evaluate", { expression, returnByValue: true, awaitPromise: true });
  if (result.exceptionDetails) throw new Error(result.exceptionDetails.text || "Browser evaluation failed");
  return result.result.value;
}

async function setViewport(cdp, width, height, scale = 1) {
  await cdp.send("Emulation.setDeviceMetricsOverride", {
    width, height, deviceScaleFactor: scale, mobile: false, screenWidth: width, screenHeight: height
  });
}

async function navigate(cdp, url, readySelector) {
  const loaded = cdp.once("Page.loadEventFired");
  const result = await cdp.send("Page.navigate", { url });
  if (result.errorText) throw new Error(result.errorText);
  await loaded;
  for (let attempt = 0; attempt < 60; attempt += 1) {
    const ready = await evaluate(cdp, `document.readyState === "complete" && Boolean(document.querySelector(${JSON.stringify(readySelector)}))`);
    if (ready) return;
    await new Promise((resolve) => setTimeout(resolve, 50));
  }
  throw new Error(`Page did not become ready: ${url}`);
}

async function screenshot(cdp, fileName, selector) {
  let clip;
  if (selector) {
    clip = await evaluate(cdp, `(() => { const r = document.querySelector(${JSON.stringify(selector)}).getBoundingClientRect(); return { x: Math.max(0, r.left + scrollX), y: Math.max(0, r.top + scrollY), width: r.width, height: r.height, scale: 1 }; })()`);
  } else {
    const metrics = await cdp.send("Page.getLayoutMetrics");
    const size = metrics.cssContentSize || metrics.contentSize;
    clip = { x: 0, y: 0, width: Math.ceil(size.width), height: Math.ceil(size.height), scale: 1 };
  }
  const result = await cdp.send("Page.captureScreenshot", { format: "png", captureBeyondViewport: true, fromSurface: true, clip });
  fs.mkdirSync(screenshotRoot, { recursive: true });
  fs.writeFileSync(path.join(screenshotRoot, fileName), Buffer.from(result.data, "base64"));
}

async function diagnostics(cdp, label, expectHeadline = false) {
  const data = await evaluate(cdp, `(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
    h1: document.querySelector("h1")?.textContent || "",
    controls: Array.from(document.querySelectorAll("button, a.button")).map((el) => {
      const r = el.getBoundingClientRect();
      return { text: el.textContent.trim(), width: r.width, height: r.height };
    })
  }))()`);
  check(data.scrollWidth <= data.clientWidth + 1, `${label} has no horizontal overflow`);
  if (expectHeadline) check(data.h1.includes("BUILD THE SUIT.") && data.h1.includes("LAUNCH THE HUD."), `${label} displays approved headline`);
  data.controls.filter((control) => control.width > 0).forEach((control) => {
    check(control.height >= 40, `${label} has usable control: ${control.text}`);
  });
}

async function testMainPage(cdp, origin, errors, requests) {
  errors.console.length = 0;
  errors.runtime.length = 0;
  requests.clear();
  await setViewport(cdp, 1440, 900);
  await navigate(cdp, `${origin}/ar-lab/`, "[data-explorer-suit] .suit-diagram");
  await diagnostics(cdp, "ONEIROS desktop", true);

  check(await evaluate(cdp, 'document.querySelector(".lab-nav").textContent.replace(/\\s+/g, " ").trim().includes("Home Projects Dev Logs About")'), "ONEIROS preserves global nav order");
  check(await evaluate(cdp, "new URL(document.querySelector('.hero-actions a[href=\"../hud/\"]').href).pathname === '/hud/'"), "Recon Scanner action resolves to /hud/");
  const conceptImages = await evaluate(cdp, `Array.from(document.querySelectorAll("[data-oneiros-concept]")).map((image) => ({
    key: image.dataset.oneirosConcept,
    loaded: image.complete && image.naturalWidth === 1672 && image.naturalHeight === 941,
    alt: image.getAttribute("alt") || ""
  }))`);
  check(conceptImages.length === 2, "browser renders exactly two ONEIROS concept images");
  check(conceptImages.every((image) => image.loaded), "hero and helmet HUD concept images load at 1672 by 941");
  check(conceptImages.every((image) => image.alt.length >= 80), "concept images provide descriptive alt text");
  check(conceptImages.some((image) => image.key === "hero" && image.alt.includes("nonfunctional heavy prop")), "hero alt text identifies the nonfunctional prop");
  check(conceptImages.some((image) => image.key === "hud" && image.alt.includes("website-powered HUD")), "HUD alt text explains the center display");
  check(await evaluate(cdp, 'document.querySelector("[data-mode=assembled]").getAttribute("aria-pressed") === "true"'), "explorer starts assembled");
  await evaluate(cdp, 'document.querySelector("[data-mode=exploded]").click()');
  check(await evaluate(cdp, 'document.querySelector(".explorer").dataset.mode === "exploded"'), "explorer enters exploded mode");
  await evaluate(cdp, 'document.querySelector("[data-mode=connections]").click()');
  check(await evaluate(cdp, 'document.querySelector(".explorer").dataset.mode === "connections"'), "explorer enters connections mode");
  await evaluate(cdp, '(() => { const el = document.querySelector("[data-component=glasses]"); el.focus(); el.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true })); })()');
  check(await evaluate(cdp, 'document.querySelector("[data-detail-title]").textContent === "AR glasses"'), "keyboard selects AR glasses");
  check(await evaluate(cdp, 'document.querySelector("[data-detail-detail]").textContent.includes("do not establish ONEIROS fit")'), "optics claim remains qualified");
  await evaluate(cdp, 'document.querySelector("[data-component=battery]").dispatchEvent(new PointerEvent("click", { bubbles: true }))');
  check(await evaluate(cdp, 'document.querySelector("[data-detail-title]").textContent === "Auxiliary battery module"'), "pointer selects auxiliary power concept");
  check(await evaluate(cdp, 'document.querySelector("[data-detail-detail]").textContent.includes("No pack, capacity, runtime")'), "power card avoids unverified runtime claim");

  await evaluate(cdp, 'document.querySelector("[data-transparency]").click()');
  check(await evaluate(cdp, 'document.querySelector(".pov-simulator").dataset.transparent === "true"'), "POV enables illustrative transparency");
  check(await evaluate(cdp, 'document.querySelector("[data-transparency]").getAttribute("aria-pressed") === "true"'), "POV announces transparency state");
  check(await evaluate(cdp, 'document.querySelector(".safety-note").textContent.includes("regular monitor remains opaque")'), "POV preserves display disclaimer");

  check(await evaluate(cdp, 'Array.isArray(window.ONEIROS_APPROVED_MEDIA) && window.ONEIROS_APPROVED_MEDIA.length === 0'), "approved media collection starts empty");
  check(await evaluate(cdp, 'document.querySelector("[data-media-grid]").hidden === true'), "empty media gallery remains collapsed");
  check(await evaluate(cdp, 'document.querySelectorAll("[data-media-grid] img").length === 0'), "no real workshop image is loaded");
  check(await evaluate(cdp, 'document.querySelector("[data-media-state]").textContent.includes("No approved workshop photographs")'), "empty media state is concise");
  check(await evaluate(cdp, 'document.querySelectorAll("[data-journal-preview] .journal-card").length === 3'), "main page shows compact three-entry journal preview");
  check(await evaluate(cdp, 'document.querySelector(".status-legend").textContent.includes("Integrated — none claimed")'), "status legend denies integration claim");

  await screenshot(cdp, "ar-lab-desktop.png", ".hero");
  await screenshot(cdp, "ar-lab-system-map.png", "#system-map");
  await screenshot(cdp, "ar-lab-helmet-pov.png", "#helmet-pov");

  check(errors.console.length === 0, `ONEIROS page has no console errors: ${errors.console.join(" | ")}`);
  check(errors.runtime.length === 0, `ONEIROS page has no runtime errors: ${errors.runtime.join(" | ")}`);
  check(Array.from(requests).every((requestOrigin) => requestOrigin === origin), "ONEIROS page makes only same-origin runtime requests");

  const viewports = [
    ["mobile", 390, 844, 2, true], ["phone landscape", 844, 390, 1, false],
    ["tablet portrait", 768, 1024, 1, false], ["tablet landscape", 1024, 768, 1, false]
  ];
  for (const [label, width, height, scale, capture] of viewports) {
    errors.console.length = 0;
    errors.runtime.length = 0;
    await setViewport(cdp, width, height, scale);
    await navigate(cdp, `${origin}/ar-lab/`, "[data-explorer-suit] .suit-diagram");
    await diagnostics(cdp, `ONEIROS ${label}`, true);
    check(errors.console.length === 0, `ONEIROS ${label} has no console errors`);
    check(errors.runtime.length === 0, `ONEIROS ${label} has no runtime errors`);
    if (capture) await screenshot(cdp, "ar-lab-mobile.png");
  }
}

async function testJournal(cdp, origin, errors, requests) {
  errors.console.length = 0;
  errors.runtime.length = 0;
  requests.clear();
  await setViewport(cdp, 1440, 900);
  await navigate(cdp, `${origin}/ar-lab/dev-log/`, "[data-journal-list] .journal-card");
  await diagnostics(cdp, "ONEIROS Field Notes desktop");
  check(await evaluate(cdp, 'document.querySelectorAll("[data-journal-list] .journal-card").length === 4'), "Field Notes renders four supported entries");
  check(await evaluate(cdp, 'document.querySelector("[data-filter-status]").textContent.includes("all 4 supported entries")'), "Field Notes announces initial entry count");
  await evaluate(cdp, "document.querySelector('[data-filter=\"Workshop Media\"]').click()");
  check(await evaluate(cdp, 'document.querySelectorAll("[data-journal-list] .journal-card:not([hidden])").length === 1'), "Field Notes filters Workshop Media");
  check(await evaluate(cdp, 'document.querySelector("[data-filter-status]").textContent.includes("1 entry")'), "Field Notes announces filtered count");
  await evaluate(cdp, 'document.querySelector("[data-filter=All]").click()');
  check(await evaluate(cdp, 'document.querySelectorAll("[data-journal-list] .journal-card:not([hidden])").length === 4'), "Field Notes restores all entries");
  await screenshot(cdp, "ar-lab-dev-log.png");
  check(errors.console.length === 0, `Field Notes has no console errors: ${errors.console.join(" | ")}`);
  check(errors.runtime.length === 0, `Field Notes has no runtime errors: ${errors.runtime.join(" | ")}`);
  check(Array.from(requests).every((requestOrigin) => requestOrigin === origin), "Field Notes makes only same-origin runtime requests");

  await setViewport(cdp, 390, 844, 2);
  await navigate(cdp, `${origin}/ar-lab/dev-log/`, "[data-journal-list] .journal-card");
  await diagnostics(cdp, "ONEIROS Field Notes mobile");
}

async function testHomeEntrance(cdp, origin, errors) {
  errors.console.length = 0;
  errors.runtime.length = 0;
  await setViewport(cdp, 1440, 900);
  await navigate(cdp, `${origin}/`, ".home-oneiros-entrance");
  check(await evaluate(cdp, 'document.querySelector(".home-oneiros-entrance").getAttribute("href") === "ar-lab/"'), "homepage entrance links /ar-lab/");
  check(await evaluate(cdp, 'document.querySelector(".home-oneiros-entrance").textContent.includes("Project ONEIROS")'), "homepage entrance names Project ONEIROS");
  check(await evaluate(cdp, 'document.querySelectorAll(".home-oneiros-entrance").length === 1'), "homepage adds one entrance without redesign");
  await screenshot(cdp, "homepage-oneiros-entrance.png", ".home-oneiros-entrance");
  check(errors.runtime.length === 0, `homepage has no runtime errors: ${errors.runtime.join(" | ")}`);

  await setViewport(cdp, 390, 844, 2);
  await navigate(cdp, `${origin}/`, ".home-oneiros-entrance");
  await diagnostics(cdp, "homepage mobile");
}

async function verifyRoutes(origin) {
  const routes = ["/", "/ar-lab/", "/ar-lab/dev-log/", "/hud/", "/projects.html", "/dev-logs/", "/about.html", "/games/the-door/"];
  for (const route of routes) {
    const response = await fetch(origin + route);
    check(response.status === 200, `route returns HTTP 200: ${route}`);
  }
}

async function main() {
  runStaticChecks();
  const local = await createServer();
  const launched = await launchChrome();
  const errors = { console: [], runtime: [] };
  const requests = new Set();
  launched.cdp.on("Runtime.consoleAPICalled", (event) => {
    if (event.type === "error") errors.console.push((event.args || []).map((arg) => arg.value || arg.description || "").join(" "));
  });
  launched.cdp.on("Runtime.exceptionThrown", (event) => errors.runtime.push(event.exceptionDetails?.text || "Runtime exception"));
  launched.cdp.on("Network.requestWillBeSent", (event) => {
    try { requests.add(new URL(event.request.url).origin); } catch {}
  });

  try {
    await verifyRoutes(local.origin);
    await testMainPage(launched.cdp, local.origin, errors, requests);
    await testJournal(launched.cdp, local.origin, errors, requests);
    await testHomeEntrance(launched.cdp, local.origin, errors);
  } finally {
    launched.cdp.close();
    const closed = new Promise((resolve) => launched.chrome.once("exit", resolve));
    launched.chrome.kill();
    await Promise.race([closed, new Promise((resolve) => setTimeout(resolve, 3000))]);
    await new Promise((resolve) => local.server.close(resolve));
    const resolvedTemp = path.resolve(launched.userDataDir);
    if (resolvedTemp.startsWith(path.resolve(os.tmpdir()) + path.sep)) {
      try { fs.rmSync(resolvedTemp, { recursive: true, force: true, maxRetries: 4, retryDelay: 250 }); } catch {}
    }
  }

  console.log(JSON.stringify({
    result: "pass",
    checks,
    routes: 8,
    oneirosViewports: 5,
    screenshots: fs.existsSync(screenshotRoot) ? fs.readdirSync(screenshotRoot).filter((name) => name.endsWith(".png")).length : 0,
    reconScanner: "exact SHA-256 preservation",
    privateMedia: "empty opt-in contract; no private path",
    browser: "installed Chrome via headless DevTools",
    server: "127.0.0.1 only"
  }, null, 2));
}

main().catch((error) => {
  console.error(error.stack || error);
  process.exitCode = 1;
});
