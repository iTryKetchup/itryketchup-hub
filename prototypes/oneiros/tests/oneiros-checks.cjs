#!/usr/bin/env node
"use strict";

const assert = require("node:assert/strict");
const crypto = require("node:crypto");
const fs = require("node:fs");
const http = require("node:http");
const os = require("node:os");
const path = require("node:path");
const { execFileSync, spawn } = require("node:child_process");

const prototypeRoot = path.resolve(__dirname, "..");
const repoRoot = path.resolve(prototypeRoot, "..", "..");
const srcRoot = path.join(repoRoot, "src");
const screenshotRoot = path.join(prototypeRoot, "evidence", "screenshots");
let checks = 0;

function check(condition, message) {
  assert.ok(condition, message);
  checks += 1;
}

function sha256(filePath) {
  return crypto.createHash("sha256").update(fs.readFileSync(filePath)).digest("hex").toUpperCase();
}

function runStaticChecks() {
  check(path.relative(srcRoot, prototypeRoot).startsWith(".."), "prototype root is outside production src");
  const workflow = fs.readFileSync(path.join(repoRoot, ".github", "workflows", "pages.yml"), "utf8");
  check(/path:\s*\.\/src\b/.test(workflow), "Pages workflow still publishes only ./src");
  check(!workflow.includes("prototypes/oneiros"), "Pages workflow does not include ONEIROS prototypes");

  const productionHashes = {
    "index.html": "52DD533AF1231E1AE883753667ADE1E16C4AC6C8648D835E112E188A8D39788E",
    "projects.html": "2C0D375101040F371627E9BBE1D314A98EE95C1ABA177FED6117A1CA1BE42F0D",
    "dev-logs/index.html": "2B5D95082283D3B4BE2270791AFF4DF1D1AB79223D21D730B69B725DF9A97FE3",
    "about.html": "78B2EBD7708961BCC886D764792C6CED570BDABC713918BF7B2D61043C20D624"
  };
  Object.entries(productionHashes).forEach(([relative, expected]) => {
    check(sha256(path.join(srcRoot, ...relative.split("/"))) === expected, "production " + relative + " remains byte-identical");
  });
  const hudHashes = {
    "index.html": "4E945EC829101053E2F5A9BB4BAB4D5BB557AAC64969C6CDBD9A38BE06F874CD",
    "manifest.webmanifest": "139295B91D15D8E49A612EBC8F20C4F76C4FBF5A3F6E6AC8F3ACDF14F5EA3A00",
    "icons/apple-touch-icon.png": "C26C3631509ECABAE23E6BAAE70309805E3DE29AD4283620267B602C202D7A32",
    "icons/icon-192.png": "2AB818B4EA325C9C8CDBB4985673E437CC86E2BC0068ACE3CE0D95E076A5F0B4",
    "icons/icon-512.png": "DBAF1AAFF42C1559830B668296E1D59CAC6DBF6557686BB88719EB190D3861E4"
  };
  Object.entries(hudHashes).forEach(([relative, expected]) => {
    check(sha256(path.join(srcRoot, "hud", ...relative.split("/"))) === expected, "Recon Scanner baseline " + relative + " remains byte-identical");
  });

  const js = fs.readFileSync(path.join(prototypeRoot, "assets", "oneiros.js"), "utf8");
  const mediaData = fs.readFileSync(path.join(prototypeRoot, "assets", "approved-media.sample.js"), "utf8");
  const css = fs.readFileSync(path.join(prototypeRoot, "assets", "oneiros.css"), "utf8");
  new Function(js);
  new Function(mediaData);
  checks += 1;
  checks += 1;
  [
    "BUILD THE SUIT.", "A dream worth building, one experiment at a time.", "OH-neh-ross",
    "Audio unavailable — guide only", "Assembled", "Exploded", "Connections", "REAR VIEW",
    "FORWARD NIGHT VISION", "NOT FORWARD CAMERA VIDEO", "SAMPLE PLACEHOLDER",
    "Illustrative values only", "never validated primary walking vision", "No weapon mechanism",
    "no sponsorship or endorsement is implied", "https://www.itryketchup.com/hud/",
    "/ar-lab/dev-log/", "Home", "Projects", "Dev Logs", "About",
    "A place for evidence, empty by design.", "Future approved media",
    "Approved for Web", "approved-media data file", "none are loaded"
  ].forEach((text) => check(js.includes(text), "shared prototype source contains " + text));
  [
    "@media (prefers-reduced-motion: reduce)", ":focus-visible", "min-height: 44px",
    'body[data-theme="a"]', 'body[data-theme="b"]', 'body[data-theme="c"]',
    '.pov-simulator[data-transparent="true"]', '.explorer[data-mode="exploded"]',
    '.explorer[data-mode="connections"]', ".media-preview", ".media-grid",
    ".media-card--placeholder", ".journal-media-note", ".component-media-hook"
  ].forEach((text) => check(css.includes(text), "stylesheet contains " + text));
  [
    "ONEIROS_APPROVED_MEDIA_SCHEMA", "allowedStatus", "Approved for Web",
    "assetPrefix", "../assets/approved-media/", "approvalRef",
    "window.ONEIROS_APPROVED_MEDIA = Object.freeze([])"
  ].forEach((text) => check(mediaData.includes(text), "approved-media contract contains " + text));
  check(!/[A-Za-z]:\\/.test(mediaData), "approved-media contract contains no private absolute Windows path");
  check(!/[A-Za-z]:\\/.test(js), "shared prototype source contains no private absolute Windows path");
  [
    "getUserMedia(", "geolocation.", "DeviceMotionEvent", "DeviceOrientationEvent",
    "speechSynthesis", "EventSource(", "fetch(", "XMLHttpRequest", "supabase", "analytics"
  ].forEach((forbidden) => check(!js.includes(forbidden), "prototype has no runtime " + forbidden));

  const remoteResource = /<(?:script|link|img|source)\b[^>]+(?:src|href)=["']https?:/i;
  ["index.html", "concept-a/index.html", "concept-b/index.html", "concept-c/index.html"].forEach((relative) => {
    const html = fs.readFileSync(path.join(prototypeRoot, ...relative.split("/")), "utf8");
    check(!remoteResource.test(html), relative + " has no remote runtime subresource");
    if (relative.startsWith("concept-")) {
      check(html.includes("../assets/approved-media.sample.js"), relative + " loads the empty approved-media contract");
      check(html.indexOf("approved-media.sample.js") < html.indexOf("oneiros.js"), relative + " loads media data before the renderer");
    }
  });
  const status = execFileSync("git", ["-C", repoRoot, "status", "--porcelain=v1", "--untracked-files=all"], { encoding: "utf8" });
  status.split(/\r?\n/).filter(Boolean).forEach((line) => {
    const relative = line.slice(3).replaceAll("\\", "/");
    check(relative.startsWith("prototypes/oneiros/"), "website change is isolated to ONEIROS prototypes: " + relative);
  });
}

function createServer() {
  const mime = new Map([
    [".html", "text/html; charset=utf-8"], [".css", "text/css; charset=utf-8"],
    [".js", "text/javascript; charset=utf-8"], [".png", "image/png"], [".md", "text/markdown; charset=utf-8"]
  ]);
  const server = http.createServer((request, response) => {
    const url = new URL(request.url || "/", "http://127.0.0.1");
    let pathname = decodeURIComponent(url.pathname);
    if (pathname.endsWith("/")) pathname += "index.html";
    const candidate = path.resolve(prototypeRoot, pathname.replace(/^\/+/, ""));
    if (!candidate.startsWith(prototypeRoot + path.sep) || !fs.existsSync(candidate) || !fs.statSync(candidate).isFile()) {
      response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      response.end("Not found");
      return;
    }
    response.writeHead(200, { "Content-Type": mime.get(path.extname(candidate)) || "application/octet-stream", "Cache-Control": "no-store" });
    fs.createReadStream(candidate).pipe(response);
  });
  return new Promise((resolve) => server.listen(0, "127.0.0.1", () => {
    resolve({ server, origin: "http://127.0.0.1:" + server.address().port });
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
  const userDataDir = fs.mkdtempSync(path.join(os.tmpdir(), "oneiros-chrome-"));
  const chrome = spawn(executable, [
    "--headless=new", "--disable-gpu", "--no-first-run", "--no-default-browser-check",
    "--disable-background-networking", "--disable-component-update", "--disable-sync",
    "--remote-debugging-port=0", "--user-data-dir=" + userDataDir, "about:blank"
  ], { stdio: ["ignore", "ignore", "pipe"], windowsHide: true });
  const debuggerUrl = await new Promise((resolve, reject) => {
    let output = "";
    const timer = setTimeout(() => reject(new Error("Chrome DevTools endpoint timeout: " + output)), 10000);
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
      reject(new Error("Chrome exited before DevTools was ready: " + code + " " + output));
    });
  });
  const endpoint = new URL(debuggerUrl);
  const targets = await (await fetch("http://127.0.0.1:" + endpoint.port + "/json/list")).json();
  const pageTarget = targets.find((target) => target.type === "page");
  if (!pageTarget) throw new Error("Chrome page target was not found");
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

async function setViewport(cdp, width, height, scale) {
  await cdp.send("Emulation.setDeviceMetricsOverride", {
    width, height, deviceScaleFactor: scale || 1, mobile: false, screenWidth: width, screenHeight: height
  });
}

async function navigate(cdp, url) {
  const loaded = cdp.once("Page.loadEventFired");
  const result = await cdp.send("Page.navigate", { url });
  if (result.errorText) throw new Error(result.errorText);
  await loaded;
  for (let attempt = 0; attempt < 40; attempt += 1) {
    if (await evaluate(cdp, 'document.readyState === "complete" && Boolean(document.querySelector(".local-banner"))')) return;
    await new Promise((resolve) => setTimeout(resolve, 50));
  }
  throw new Error("Page did not become ready: " + url);
}

async function screenshot(cdp, fileName, selector) {
  let clip;
  if (selector) {
    clip = await evaluate(cdp, '(() => { const r = document.querySelector(' + JSON.stringify(selector) + ').getBoundingClientRect(); return { x: r.left + scrollX, y: r.top + scrollY, width: r.width, height: r.height, scale: 1 }; })()');
  } else {
    const metrics = await cdp.send("Page.getLayoutMetrics");
    const size = metrics.cssContentSize || metrics.contentSize;
    clip = { x: 0, y: 0, width: Math.ceil(size.width), height: Math.ceil(size.height), scale: 1 };
  }
  const result = await cdp.send("Page.captureScreenshot", { format: "png", captureBeyondViewport: true, fromSurface: true, clip });
  fs.mkdirSync(screenshotRoot, { recursive: true });
  fs.writeFileSync(path.join(screenshotRoot, fileName), Buffer.from(result.data, "base64"));
}

async function diagnostics(cdp, label, expectHeadline) {
  const data = await evaluate(cdp, '(() => ({ scrollWidth: document.documentElement.scrollWidth, clientWidth: document.documentElement.clientWidth, banner: document.querySelector(".local-banner")?.textContent || "", h1: document.querySelector("h1")?.textContent || "", controls: Array.from(document.querySelectorAll("button, a.button")).map((el) => { const r = el.getBoundingClientRect(); return { text: el.textContent.trim(), width: r.width, height: r.height }; }) }))()');
  check(data.scrollWidth <= data.clientWidth + 1, label + " has no horizontal overflow");
  check(data.banner.includes("LOCAL DIRECTOR REVIEW"), label + " displays local-only banner");
  if (expectHeadline) check(data.h1.includes("BUILD THE SUIT.") && data.h1.includes("LAUNCH THE HUD."), label + " displays approved headline");
  data.controls.filter((control) => control.width > 0).forEach((control) => check(control.height >= 38, label + " usable control: " + control.text));
}

async function testConcept(cdp, origin, concept, errors, requests) {
  const label = "concept-" + concept;
  requests.clear();
  errors.console.length = 0;
  errors.runtime.length = 0;
  await setViewport(cdp, 1440, 900, 1);
  await navigate(cdp, origin + "/" + label + "/");
  await diagnostics(cdp, label + " desktop", true);
  check(await evaluate(cdp, 'document.querySelector(\'[data-mode="assembled"]\').getAttribute("aria-pressed") === "true"'), label + " starts assembled");
  await evaluate(cdp, 'document.querySelector(\'[data-mode="exploded"]\').click()');
  check(await evaluate(cdp, 'document.querySelector(".explorer").dataset.mode === "exploded"'), label + " enters exploded mode");
  await evaluate(cdp, 'document.querySelector(\'[data-mode="connections"]\').click()');
  check(await evaluate(cdp, 'document.querySelector(".explorer").dataset.mode === "connections"'), label + " enters connections mode");
  await evaluate(cdp, 'document.querySelector(\'[data-mode="assembled"]\').click()');

  await evaluate(cdp, '(() => { const el = document.querySelector(\'.explorer [data-component="glasses"]\'); el.focus(); el.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true })); })()');
  check(await evaluate(cdp, 'document.querySelector("[data-detail-title]").textContent === "AR glasses"'), label + " keyboard-selects AR glasses");
  check(await evaluate(cdp, 'document.querySelector("[data-detail-detail]").textContent.includes("Manufacturer specifications do not establish")'), label + " shows evidence qualifier");
  await evaluate(cdp, 'document.querySelector(\'.explorer [data-component="battery"]\').dispatchEvent(new MouseEvent("click", { bubbles: true }))');
  check(await evaluate(cdp, 'document.querySelector("[data-detail-title]").textContent === "Auxiliary battery module"'), label + " pointer-selects battery concept");
  check(await evaluate(cdp, 'document.querySelector("[data-detail-detail]").textContent.includes("No battery, capacity, runtime")'), label + " avoids power claims");
  check(await evaluate(cdp, 'document.querySelector("[data-detail-media]").textContent.includes("exact-file approval")'), label + " connects selected components to future approved derivatives");

  check(await evaluate(cdp, 'Array.isArray(window.ONEIROS_APPROVED_MEDIA) && window.ONEIROS_APPROVED_MEDIA.length === 0'), label + " starts with an empty approved-media dataset");
  check(await evaluate(cdp, 'document.querySelectorAll("[data-media-placeholder]").length === 4'), label + " renders four non-public media placeholders");
  check(await evaluate(cdp, 'document.querySelector("[data-media-count]").textContent.includes("0 approved media items loaded")'), label + " reports the zero-approved-media state");
  check(await evaluate(cdp, 'document.querySelectorAll("[data-media-gallery] img").length === 0'), label + " loads no real photographs");
  check(await evaluate(cdp, 'document.querySelector(".media-policy").textContent.includes("never scans the private workshop library")'), label + " states the private-library boundary");
  check(await evaluate(cdp, 'document.querySelector("[data-journal-media-status]").textContent.includes("0 approved media items loaded")'), label + " connects FIELD NOTES to the empty approved-media state");

  await evaluate(cdp, 'document.querySelector("[data-transparency]").click()');
  check(await evaluate(cdp, 'document.querySelector(".pov-simulator").dataset.transparent === "true"'), label + " enables illustrative transparency");
  check(await evaluate(cdp, 'document.querySelector("[data-transparency]").getAttribute("aria-pressed") === "true"'), label + " exposes transparency state");
  check(await evaluate(cdp, 'document.querySelector(".safety-note").textContent.includes("ordinary monitor remains opaque")'), label + " preserves transparency disclaimer");

  await evaluate(cdp, 'document.querySelector(\'[data-filter="Armor & Fabrication"]\').click()');
  check(await evaluate(cdp, 'document.querySelectorAll(".journal-entry:not([hidden])").length === 1'), label + " filters journal");
  check(await evaluate(cdp, 'document.querySelector("[data-filter-status]").textContent.includes("1 supported entry")'), label + " announces filter");
  await evaluate(cdp, 'document.querySelector(\'[data-filter="All"]\').click()');
  check(await evaluate(cdp, 'document.querySelectorAll(".journal-entry:not([hidden])").length === 3'), label + " restores entries");

  check(await evaluate(cdp, 'document.querySelectorAll(\'a.button[href="https://www.itryketchup.com/hud/"]\').length === 1'), label + " links Recon Scanner");
  check(await evaluate(cdp, 'document.querySelector(".kitchen-preview nav").textContent === "iTryKetchup StudioHomeProjectsDev LogsAbout"'), label + " preserves homepage navigation");
  check(await evaluate(cdp, 'document.querySelector(".status-legend").textContent.includes("Integrated — none claimed")'), label + " denies integration claim");

  await evaluate(cdp, 'document.querySelector("[data-suit-mode]").click()');
  await new Promise((resolve) => setTimeout(resolve, 250));
  check(await evaluate(cdp, 'Boolean(document.fullscreenElement) || /unavailable|could not/.test(document.querySelector("[data-action-status]").textContent)'), label + " fullscreen enters or fails gracefully");
  await evaluate(cdp, 'document.fullscreenElement && document.exitFullscreen ? document.exitFullscreen() : true');

  await evaluate(cdp, 'document.activeElement?.blur(); window.scrollTo(0, 0)');
  await screenshot(cdp, label + "-desktop.png");
  await screenshot(cdp, label + "-armor-explorer.png", "#explorer");
  await screenshot(cdp, label + "-helmet-pov.png", "#pov");
  await screenshot(cdp, label + "-journal.png", "#journal");
  await screenshot(cdp, label + "-media-library.png", "#media-preview");
  check(errors.console.length === 0, label + " has no console errors: " + errors.console.join(" | "));
  check(errors.runtime.length === 0, label + " has no runtime errors: " + errors.runtime.join(" | "));
  check(requests.size === 1 && requests.has(origin), label + " makes no cross-origin runtime requests");

  const viewports = [
    ["mobile", 390, 844, 2, true], ["phone-landscape", 844, 390, 1, false],
    ["tablet-portrait", 768, 1024, 1, false], ["tablet-landscape", 1024, 768, 1, false]
  ];
  for (const viewport of viewports) {
    await setViewport(cdp, viewport[1], viewport[2], viewport[3]);
    await navigate(cdp, origin + "/" + label + "/");
    await diagnostics(cdp, label + " " + viewport[0], true);
    if (viewport[4]) {
      await evaluate(cdp, 'document.activeElement?.blur(); window.scrollTo(0, 0)');
      await screenshot(cdp, label + "-mobile.png");
    }
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
    fs.mkdirSync(screenshotRoot, { recursive: true });
    await setViewport(launched.cdp, 1440, 900, 1);
    await navigate(launched.cdp, local.origin + "/");
    await diagnostics(launched.cdp, "comparison index", false);
    check(await evaluate(launched.cdp, 'document.querySelectorAll(".concept-card").length === 3'), "comparison index links three concepts");
    await screenshot(launched.cdp, "comparison-index-desktop.png");
    for (const concept of ["a", "b", "c"]) await testConcept(launched.cdp, local.origin, concept, errors, requests);
  } finally {
    launched.cdp.close();
    const chromeClosed = new Promise((resolve) => launched.chrome.once("exit", resolve));
    launched.chrome.kill();
    await Promise.race([chromeClosed, new Promise((resolve) => setTimeout(resolve, 3000))]);
    await new Promise((resolve) => local.server.close(resolve));
    const resolvedTemp = path.resolve(launched.userDataDir);
    if (resolvedTemp.startsWith(path.resolve(os.tmpdir()) + path.sep)) {
      try { fs.rmSync(resolvedTemp, { recursive: true, force: true, maxRetries: 4, retryDelay: 250 }); } catch {}
    }
  }

  console.log(JSON.stringify({
    result: "pass", checks, concepts: 3, viewportsPerConcept: 5,
    screenshots: fs.readdirSync(screenshotRoot).filter((name) => name.endsWith(".png")).length,
    phaseZeroCoverage: "all original Phase 0 assertions retained and extended",
    browser: "installed Chrome via headless DevTools", server: "127.0.0.1 only"
  }, null, 2));
}

main().catch((error) => {
  console.error(error.stack || error);
  process.exitCode = 1;
});
