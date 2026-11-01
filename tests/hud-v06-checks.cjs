#!/usr/bin/env node
"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const http = require("node:http");
const path = require("node:path");
const { chromium } = require("playwright");

const repoRoot = path.resolve(__dirname, "..");
const sourceRoot = path.resolve(process.env.HUD_STATIC_ROOT || path.join(repoRoot, "src"));
const hudDir = path.resolve(process.env.HUD_SOURCE_DIR || path.join(sourceRoot, "hud"));
const hudPath = path.join(hudDir, "index.html");
const screenshotDir = process.env.HUD_SCREENSHOT_DIR ? path.resolve(process.env.HUD_SCREENSHOT_DIR) : null;
let checks = 0;

function check(condition, message) {
  assert.ok(condition, message);
  checks += 1;
}

function readPngDimensions(filePath) {
  const data = fs.readFileSync(filePath);
  check(data.subarray(1, 4).toString("ascii") === "PNG", `${path.basename(filePath)} has a PNG signature`);
  return { width: data.readUInt32BE(16), height: data.readUInt32BE(20) };
}

function runStaticChecks() {
  const html = fs.readFileSync(hudPath, "utf8");
  const scriptMatch = html.match(/<script>([\s\S]*?)<\/script>/i);
  check(Boolean(scriptMatch), "inline HUD script exists");
  // eslint-disable-next-line no-new-func
  new Function(scriptMatch[1]);
  checks += 1;

  for (const required of [
    "Ketchup HUD v0.6",
    "chooseCompassTarget",
    "updateCompass",
    "advanceCompassVerticalPlacement",
    "statusPanelLayout",
    "resetModeCycle",
    "updateLinkActivity",
    "updateFrameRate",
    "SCAN SHIFT · SIM X",
    "OLED SHIFT · X",
    '["CYCLE", cycleStatus.label',
    '["LINK", linkStatus.label',
    '["FRAME", frameStatus.label',
    'body.dataset.statusPanelAnchor = "right"',
    'body.dataset.linkTargetActivity = target.toFixed(4)',
    "commonRefreshRates",
    'body.dataset.visibleShiftSource = mode === "box" ? "scanner" : "display-care"',
    "randomModeDelay",
    'body.dataset.transition = "right-to-left"',
    "updatePixelShift",
    "updateBreak"
  ]) {
    check(html.includes(required), `source contains ${required}`);
  }

  for (const forbidden of [
    '["POWER"',
    "advanceStatusPanel",
    "statusPanelCandidates",
    "getUserMedia(",
    "geolocation.getCurrentPosition",
    "DeviceMotionEvent.requestPermission",
    "DeviceOrientationEvent.requestPermission",
    "https://cdn.",
    "googletagmanager",
    "google-analytics"
  ]) {
    check(!html.includes(forbidden), `source excludes ${forbidden}`);
  }

  const manifest = JSON.parse(fs.readFileSync(path.join(hudDir, "manifest.webmanifest"), "utf8"));
  check(manifest.start_url === "/hud/", "manifest start URL remains /hud/");
  check(manifest.scope === "/hud/", "manifest scope remains /hud/");
  check(manifest.display === "standalone", "manifest remains standalone");

  for (const [filename, expected] of [
    ["apple-touch-icon.png", 180],
    ["icon-192.png", 192],
    ["icon-512.png", 512]
  ]) {
    const dimensions = readPngDimensions(path.join(hudDir, "icons", filename));
    check(dimensions.width === expected && dimensions.height === expected, `${filename} remains ${expected}x${expected}`);
  }
}

function contentType(filePath) {
  const extension = path.extname(filePath).toLowerCase();
  return {
    ".html": "text/html; charset=utf-8",
    ".webmanifest": "application/manifest+json; charset=utf-8",
    ".png": "image/png",
    ".css": "text/css; charset=utf-8",
    ".js": "text/javascript; charset=utf-8"
  }[extension] || "application/octet-stream";
}

async function createServer() {
  const server = http.createServer((request, response) => {
    try {
      const requestUrl = new URL(request.url, "http://127.0.0.1");
      let relative = decodeURIComponent(requestUrl.pathname).replace(/^\/+/, "");
      let filePath = path.resolve(sourceRoot, relative);
      if (!filePath.startsWith(sourceRoot + path.sep) && filePath !== sourceRoot) {
        response.writeHead(403).end("Forbidden");
        return;
      }
      if (requestUrl.pathname.endsWith("/")) {
        filePath = path.join(filePath, "index.html");
      }
      if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
        response.writeHead(404).end("Not found");
        return;
      }
      response.writeHead(200, {
        "Content-Type": contentType(filePath),
        "Cache-Control": "no-store"
      });
      fs.createReadStream(filePath).pipe(response);
    } catch (error) {
      response.writeHead(500).end(String(error));
    }
  });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const address = server.address();
  return { server, origin: `http://127.0.0.1:${address.port}` };
}

function angularDistance(left, right) {
  return Math.abs(((right - left + 540) % 360) - 180);
}

function overlaps(left, right, padding = 0) {
  return !(
    left.right + padding <= right.left ||
    left.left >= right.right + padding ||
    left.bottom + padding <= right.top ||
    left.top >= right.bottom + padding
  );
}

async function diagnostics(page) {
  return page.evaluate(() => {
    const data = { ...document.body.dataset };
    const rect = (prefix) => ({
      left: Number(data[prefix + "Left"]),
      right: Number(data[prefix + "Right"]),
      top: Number(data[prefix + "Top"]),
      bottom: Number(data[prefix + "Bottom"])
    });
    return {
      data,
      frame: rect("frame"),
      compass: rect("compass"),
      radar: rect("radar"),
      panel: rect("statusPanel"),
      readout: rect("readout"),
      scanner: {
        left: Number(data.boxLeft),
        right: Number(data.boxRight),
        top: Number(data.boxTop),
        bottom: Number(data.boxBottom)
      },
      viewport: { width: innerWidth, height: innerHeight },
      pageOverflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      tools: (() => {
        const bounds = document.getElementById("hudTools").getBoundingClientRect();
        return { left: bounds.left, right: bounds.right, top: bounds.top, bottom: bounds.bottom };
      })()
    };
  });
}

function checkRegion(region, viewport, label) {
  check(Object.values(region).every(Number.isFinite), `${label} diagnostics are finite`);
  check(region.left >= -0.5 && region.top >= -0.5, `${label} starts inside viewport`);
  check(region.right <= viewport.width + 0.5 && region.bottom <= viewport.height + 0.5, `${label} ends inside viewport`);
}

async function waitForDatasetChange(page, key, initial, timeout = 6000) {
  await page.waitForFunction(
    ([datasetKey, start]) => document.body.dataset[datasetKey] !== start,
    [key, initial],
    { timeout }
  );
}

async function runViewport(browser, baseUrl, spec) {
  const context = await browser.newContext({
    viewport: { width: spec.width, height: spec.height },
    deviceScaleFactor: spec.scale || 1,
    reducedMotion: "no-preference"
  });
  const page = await context.newPage();
  const consoleErrors = [];
  const runtimeErrors = [];
  const requestOrigins = new Set();
  page.on("console", (message) => {
    if (message.type() === "error") consoleErrors.push(message.text());
  });
  page.on("pageerror", (error) => runtimeErrors.push(String(error)));
  page.on("request", (request) => requestOrigins.add(new URL(request.url()).origin));

  const target = new URL(baseUrl);
  target.searchParams.set("hudTest", "1");
  const response = await page.goto(target.href, { waitUntil: "networkidle" });
  check(response && response.ok(), `${spec.name} HUD document loads`);
  check((await page.title()).includes("v0.6"), `${spec.name} title reports v0.6`);
  check(await page.locator("#controls").isVisible(), `${spec.name} entry/settings panel is visible`);
  check(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth), `${spec.name} has no page-level horizontal overflow`);

  const actionSizes = await page.locator("#actions button").evaluateAll((buttons) => buttons.map((button) => {
    const bounds = button.getBoundingClientRect();
    return { width: bounds.width, height: bounds.height };
  }));
  check(actionSizes.every((size) => size.width >= 44 && size.height >= 44), `${spec.name} settings actions meet 44px touch size`);

  await page.locator("#hide").click();
  await page.waitForFunction(() => (
    document.body.dataset.settings === "closed" &&
    document.body.dataset.compassHeading &&
    document.body.dataset.frameRateFresh === "true"
  ));
  let state = await diagnostics(page);
  check(state.pageOverflow <= 0, `${spec.name} HUD has no horizontal overflow`);
  checkRegion(state.frame, state.viewport, `${spec.name} safe frame`);
  checkRegion(state.compass, state.viewport, `${spec.name} compass`);
  checkRegion(state.radar, state.viewport, `${spec.name} radar`);
  checkRegion(state.panel, state.viewport, `${spec.name} status panel`);
  checkRegion(state.readout, state.viewport, `${spec.name} readout`);
  check(!overlaps(state.compass, state.panel, 1), `${spec.name} compass and status panel do not overlap`);
  check(!overlaps(state.compass, state.radar, 1), `${spec.name} compass and radar do not overlap`);
  check(!overlaps(state.compass, state.readout, 1), `${spec.name} compass and readout do not overlap`);
  check(!overlaps(state.panel, state.readout, 1), `${spec.name} panel and readout do not overlap`);
  checkRegion(state.tools, state.viewport, `${spec.name} touch tools`);
  check(
    Math.abs(Number(state.data.compassCenterX) - (state.frame.left + state.frame.right) / 2) <= 0.2,
    `${spec.name} compass is horizontally centered in the safe frame`
  );
  check(state.data.statusPanelAnchor === "right", `${spec.name} status panel declares its fixed right anchor`);
  check(
    state.frame.right - state.panel.right >= 7 && state.frame.right - state.panel.right <= 13,
    `${spec.name} status panel keeps its responsive right margin`
  );
  check(Number(state.data.frameRate) > 0, `${spec.name} FRAME reports measured browser FPS`);
  check(Number(state.data.frameRateReference) >= 60, `${spec.name} FRAME uses a sensible refresh reference`);
  check(Number(state.data.frameRateFill) > 0 && Number(state.data.frameRateFill) <= 1, `${spec.name} FRAME fill reflects measured performance`);

  const initialHeading = Number(state.data.compassHeading);
  const initialRadarAngle = Number(state.data.radarAngle);
  const initialCompassMoves = Number(state.data.compassVerticalMoveCount);
  const initialPanel = { ...state.panel };
  const initialCycleRemaining = Number(state.data.cycleRemainingMs);
  const initialCycleProgress = Number(state.data.cycleProgress);
  const initialLinkActivity = Number(state.data.linkActivity);
  check(Number(state.data.cycleDurationMs) > 0, `${spec.name} CYCLE uses the active automatic duration`);
  check(/^\d{2} MM$/.test(state.data.cycleDisplay), `${spec.name} CYCLE uses the MM readout format`);
  check(state.data.linkPhase === "radar", `${spec.name} LINK begins in simulated radar phase`);
  await page.waitForTimeout(450);
  state = await diagnostics(page);
  check(Number(state.data.cycleRemainingMs) < initialCycleRemaining, `${spec.name} CYCLE remaining time follows the scheduler`);
  check(Number(state.data.cycleProgress) > initialCycleProgress, `${spec.name} CYCLE fills from empty toward full`);
  check(Math.abs(Number(state.data.linkActivity) - initialLinkActivity) > 0.002, `${spec.name} LINK pulses with radar scanning`);

  if (spec.name === "desktop-1440x900") {
    await page.waitForFunction(() => document.body.dataset.transition === "right-to-left", null, { timeout: 5000 });
    const automaticWipe = await diagnostics(page);
    check(Number(automaticWipe.data.cycleRemainingMs) === 0, "desktop automatic transition starts at zero remaining");
    check(Number(automaticWipe.data.cycleProgress) >= 0.999, "desktop CYCLE reaches full before the wipe");
    await page.waitForFunction(() => document.body.dataset.transition === "none" && document.body.dataset.sensor === "box", null, { timeout: 5000 });
    const resetCycle = await diagnostics(page);
    check(Number(resetCycle.data.cycleRemainingMs) > Number(resetCycle.data.cycleDurationMs) * 0.75, "desktop CYCLE resets when the new mode becomes active");
    check(Number(resetCycle.data.cycleProgress) < 0.25, "desktop new mode begins with an almost-empty CYCLE bar");
  }

  await page.evaluate(() => {
    const cycle = document.getElementById("cycle");
    cycle.value = "off";
    cycle.dispatchEvent(new Event("change", { bubbles: true }));
  });
  await page.waitForFunction(() => document.body.dataset.cycleState === "off" && document.body.dataset.cycleDisplay === "OFF");
  state = await diagnostics(page);
  check(Number(state.data.cycleDurationMs) === 0 && Number(state.data.cycleRemainingMs) === 0, `${spec.name} CYCLE OFF has no misleading countdown`);
  check(Number(state.data.cycleProgress) === 0, `${spec.name} CYCLE OFF empties the bar`);

  await page.waitForFunction(
    (start) => Number(document.body.dataset.compassVerticalMoveCount) > start,
    initialCompassMoves,
    { timeout: 6000 }
  );
  await page.waitForFunction(
    (start) => Math.abs(((Number(document.body.dataset.compassHeading) - start + 540) % 360) - 180) > 0.35,
    initialHeading,
    { timeout: 3000 }
  );
  state = await diagnostics(page);
  check(angularDistance(initialHeading, Number(state.data.compassHeading)) > 0.35, `${spec.name} simulated heading changes smoothly`);
  check(Math.abs(Number(state.data.compassHeading) - Number(state.data.compassScaleHeading)) < 0.01, `${spec.name} compass scale stays aligned to heading`);
  check(Number(state.data.compassVerticalMoveCount) > initialCompassMoves, `${spec.name} compass receives minor vertical OLED-care movement`);
  check(
    Math.abs(Number(state.data.compassCenterX) - (state.frame.left + state.frame.right) / 2) <= 0.2,
    `${spec.name} compass remains centered after vertical OLED-care movement`
  );
  check(
    ["left", "right", "top", "bottom"].every((edge) => Math.abs(state.panel[edge] - initialPanel[edge]) <= 0.2),
    `${spec.name} right status panel does not relocate`
  );
  check(Number(state.data.radarAngle) > initialRadarAngle, `${spec.name} radar animation remains active`);
  check(!overlaps(state.compass, state.panel, 1), `${spec.name} centered compass and fixed panel remain separate`);

  if (state.data.sensor !== "box") {
    await page.locator("#quickSensor").click();
  }
  await page.waitForFunction(() => document.body.dataset.sensor === "box" && document.body.dataset.transition === "none", null, { timeout: 5000 });
  await page.waitForFunction(() => (
    document.body.dataset.visibleShiftSource === "scanner" &&
    document.body.dataset.visibleShiftX === document.body.dataset.scannerX &&
    document.body.dataset.visibleShiftY === document.body.dataset.scannerY
  ));
  state = await diagnostics(page);
  checkRegion(state.scanner, state.viewport, `${spec.name} scanner square`);
  const expectedX = Math.round(Number(state.data.boxX) - Number(state.data.scannerOriginX));
  const expectedY = Math.round(Number(state.data.boxY) - Number(state.data.scannerOriginY));
  check(
    Math.abs(Number(state.data.scannerX) - expectedX) <= 1 && Math.abs(Number(state.data.scannerY) - expectedY) <= 1,
    `${spec.name} scanner coordinates match targeting-square center within display rounding`
  );
  check(state.data.visibleShiftSource === "scanner", `${spec.name} box mode visible SHIFT uses scanner coordinates`);
  check(
    state.data.visibleShiftX === state.data.scannerX && state.data.visibleShiftY === state.data.scannerY,
    `${spec.name} visible SHIFT values match scanner diagnostics`
  );
  check(!overlaps(state.scanner, state.compass, 1), `${spec.name} scanner avoids compass region`);
  check(!overlaps(state.scanner, state.panel, 1), `${spec.name} scanner avoids status panel`);
  check(!overlaps(state.scanner, state.readout, 1), `${spec.name} scanner avoids readout`);

  const movingX = state.data.scannerX;
  const movingY = state.data.scannerY;
  await page.waitForFunction(
    ([x, y]) => document.body.dataset.scannerX !== x || document.body.dataset.scannerY !== y,
    [movingX, movingY],
    { timeout: 6000 }
  );
  state = await diagnostics(page);
  check(state.data.visibleShiftX === state.data.scannerX && state.data.visibleShiftY === state.data.scannerY, `${spec.name} SHIFT follows scanner while moving`);

  for (let sample = 0; sample < 5; sample += 1) {
    await page.waitForTimeout(220);
    state = await diagnostics(page);
    checkRegion(state.scanner, state.viewport, `${spec.name} moving scanner sample ${sample + 1}`);
    checkRegion(state.panel, state.viewport, `${spec.name} moving panel sample ${sample + 1}`);
    checkRegion(state.readout, state.viewport, `${spec.name} moving readout sample ${sample + 1}`);
    check(!overlaps(state.scanner, state.panel, 1), `${spec.name} moving scanner avoids panel sample ${sample + 1}`);
    check(!overlaps(state.scanner, state.readout, 1), `${spec.name} moving scanner avoids readout sample ${sample + 1}`);
    check(state.data.visibleShiftX === state.data.scannerX && state.data.visibleShiftY === state.data.scannerY, `${spec.name} moving SHIFT sync sample ${sample + 1}`);
  }

  if (spec.name === "desktop-1440x900") {
    await page.waitForFunction(() => document.body.dataset.boxPhase === "slow", null, { timeout: 12000 });
    const slow = await diagnostics(page);
    check(slow.data.visibleShiftSource === "scanner", "desktop slow phase retains scanner SHIFT source");
    check(Number(slow.data.linkTargetActivity) >= 0.6, "desktop LINK rises while scanner alignment slows");
    await page.waitForFunction(() => document.body.dataset.boxPhase === "inspect", null, { timeout: 6000 });
    const inspectStart = await diagnostics(page);
    check(Number(inspectStart.data.linkTargetActivity) >= 0.9, "desktop LINK target is strongest while inspecting");
    await page.waitForTimeout(350);
    const inspectAfter = await diagnostics(page);
    if (inspectAfter.data.boxPhase === "inspect" && inspectAfter.data.boxMoveCount === inspectStart.data.boxMoveCount) {
      check(inspectAfter.data.scannerX === inspectStart.data.scannerX && inspectAfter.data.scannerY === inspectStart.data.scannerY, "desktop inspect pause holds scanner SHIFT values");
      check(Number(inspectAfter.data.linkActivity) > Number(slow.data.linkActivity), "desktop LINK smoothly strengthens during inspection");
    }
    await page.waitForFunction(() => document.body.dataset.boxPhase === "reposition", null, { timeout: 5000 });
    const reposition = await diagnostics(page);
    check(reposition.data.visibleShiftX === reposition.data.scannerX && reposition.data.visibleShiftY === reposition.data.scannerY, "desktop reposition phase keeps SHIFT synchronized");
    check(Number(reposition.data.linkTargetActivity) <= 0.25, "desktop LINK target drops during repositioning");
  }

  await page.evaluate(() => {
    const cycle = document.getElementById("cycle");
    cycle.value = "auto";
    cycle.dispatchEvent(new Event("change", { bubbles: true }));
  });
  await page.waitForFunction(() => Number(document.body.dataset.cycleDurationMs) > 0);
  await page.locator("#quickPause").click();
  await page.waitForFunction(() => document.body.dataset.paused === "true");
  const pausedState = await diagnostics(page);
  await page.waitForTimeout(1400);
  const pausedAfter = await diagnostics(page);
  check(pausedAfter.data.boxX === pausedState.data.boxX && pausedAfter.data.boxY === pausedState.data.boxY, `${spec.name} scanner stops while paused`);
  check(pausedAfter.data.scannerX === pausedState.data.scannerX && pausedAfter.data.scannerY === pausedState.data.scannerY, `${spec.name} scanner SHIFT stops while paused`);
  check(pausedAfter.data.compassHeading === pausedState.data.compassHeading, `${spec.name} compass stops while paused`);
  check(pausedAfter.data.cycleRemainingMs === pausedState.data.cycleRemainingMs, `${spec.name} CYCLE countdown stops while paused`);
  check(pausedAfter.data.linkActivity === "0.0000", `${spec.name} LINK activity pauses without flashing`);
  check(pausedAfter.data.frameRateFresh === "false" && pausedAfter.data.frameRate === "stale", `${spec.name} FRAME does not show stale FPS while paused`);
  check(
    ["left", "right", "top", "bottom"].every((edge) => Math.abs(pausedAfter.panel[edge] - pausedState.panel[edge]) <= 0.2),
    `${spec.name} fixed right panel remains anchored while paused`
  );

  await page.locator("#quickPause").click();
  await page.waitForFunction(() => document.body.dataset.paused === "false" && document.body.dataset.frameRateFresh === "true");
  const resumedState = await diagnostics(page);
  check(Number(resumedState.data.cycleRemainingMs) < Number(pausedState.data.cycleRemainingMs), `${spec.name} CYCLE resumes from its paused value`);
  check(Number(resumedState.data.frameRate) > 0, `${spec.name} FRAME rebuilds a fresh FPS reading after resume`);
  await page.evaluate(() => {
    const cycle = document.getElementById("cycle");
    cycle.value = "off";
    cycle.dispatchEvent(new Event("change", { bubbles: true }));
  });
  const oledBefore = (await diagnostics(page)).data.oledShiftX + "," + (await diagnostics(page)).data.oledShiftY;
  await page.waitForFunction(
    (initial) => document.body.dataset.oledShiftX + "," + document.body.dataset.oledShiftY !== initial,
    oledBefore,
    { timeout: 3000 }
  );
  state = await diagnostics(page);
  check(state.data.visibleShiftSource === "scanner", `${spec.name} OLED movement does not replace scanner SHIFT source`);
  check(state.data.oledShiftX !== undefined && state.data.oledShiftY !== undefined, `${spec.name} OLED shift diagnostics remain separate`);

  if (screenshotDir) {
    fs.mkdirSync(screenshotDir, { recursive: true });
    await page.screenshot({ path: path.join(screenshotDir, `${spec.name}-box.png`) });
  }

  await page.evaluate(() => {
    const cycle = document.getElementById("cycle");
    cycle.value = "auto";
    cycle.dispatchEvent(new Event("change", { bubbles: true }));
  });
  await page.waitForFunction(() => Number(document.body.dataset.cycleDurationMs) > 0);
  await page.locator("#quickBlank").click();
  await page.waitForFunction(() => document.body.dataset.blank === "true");
  const blankStart = await diagnostics(page);
  check(await page.locator("#wake").isVisible(), `${spec.name} blank screen wake control appears`);
  await page.waitForTimeout(600);
  const duringBlank = await diagnostics(page);
  check(duringBlank.data.cycleRemainingMs === blankStart.data.cycleRemainingMs, `${spec.name} CYCLE countdown stops during blank mode`);
  check(duringBlank.data.frameRateFresh === "false", `${spec.name} blank mode invalidates the visible FPS sample`);
  await page.locator("#wake").click();
  await page.waitForFunction(() => document.body.dataset.blank === "false" && document.body.dataset.frameRateFresh === "true");
  check(await page.locator("#hudTools").isVisible(), `${spec.name} HUD controls restore after blank`);
  await page.evaluate(() => {
    const cycle = document.getElementById("cycle");
    cycle.value = "off";
    cycle.dispatchEvent(new Event("change", { bubbles: true }));
  });

  await page.keyboard.press("s");
  await page.waitForFunction(() => document.body.dataset.settings === "open");
  check(await page.locator("#controls").isVisible(), `${spec.name} settings restore by keyboard`);
  await page.keyboard.press("h");
  await page.waitForFunction(() => document.body.dataset.settings === "closed");

  await page.locator("#quickSensor").click();
  await page.waitForFunction(() => (
    document.body.dataset.transition === "right-to-left" &&
    Number(document.body.dataset.transitionX) > innerWidth * 0.7
  ));
  const wipeStart = Number((await diagnostics(page)).data.transitionX);
  await page.waitForTimeout(350);
  const wipeLater = Number((await diagnostics(page)).data.transitionX);
  check(wipeLater < wipeStart, `${spec.name} static wipe still travels right to left`);
  await page.waitForFunction(() => document.body.dataset.transition === "none", null, { timeout: 5000 });
  check((await diagnostics(page)).data.sensor === "radar", `${spec.name} wipe completes into radar mode`);

  const cornersAreBlack = await page.evaluate(() => {
    const canvas = document.getElementById("hud");
    const context = canvas.getContext("2d");
    const points = [[0, 0], [canvas.width - 1, 0], [0, canvas.height - 1], [canvas.width - 1, canvas.height - 1]];
    return points.every(([x, y]) => {
      const pixel = context.getImageData(x, y, 1, 1).data;
      return pixel[0] === 0 && pixel[1] === 0 && pixel[2] === 0 && pixel[3] === 255;
    });
  });
  check(cornersAreBlack, `${spec.name} canvas corners remain opaque black`);
  check(consoleErrors.length === 0, `${spec.name} has no console errors: ${consoleErrors.join(" | ")}`);
  check(runtimeErrors.length === 0, `${spec.name} has no runtime errors: ${runtimeErrors.join(" | ")}`);
  check(requestOrigins.size === 1 && requestOrigins.has(target.origin), `${spec.name} makes no cross-origin runtime request`);

  if (screenshotDir) {
    fs.mkdirSync(screenshotDir, { recursive: true });
    await page.screenshot({ path: path.join(screenshotDir, `${spec.name}.png`) });
  }
  await context.close();
}

async function main() {
  runStaticChecks();
  let localServer = null;
  let hudUrl = process.env.HUD_TEST_URL;
  if (!hudUrl) {
    localServer = await createServer();
    hudUrl = `${localServer.origin}/hud/`;
  }

  const executablePath = process.env.HUD_CHROME_PATH || undefined;
  const browser = await chromium.launch({ headless: true, executablePath });
  try {
    for (const spec of [
      { name: "desktop-1440x900", width: 1440, height: 900 },
      { name: "phone-portrait-390x844", width: 390, height: 844, scale: 2 },
      { name: "phone-landscape-844x390", width: 844, height: 390, scale: 2 },
      { name: "ipad-portrait-768x1024", width: 768, height: 1024, scale: 2 },
      { name: "ipad-landscape-1024x768", width: 1024, height: 768, scale: 2 }
    ]) {
      await runViewport(browser, hudUrl, spec);
    }
  } finally {
    await browser.close();
    if (localServer) {
      await new Promise((resolve) => localServer.server.close(resolve));
    }
  }
  console.log(JSON.stringify({ result: "pass", checks, hudUrl }, null, 2));
}

main().catch((error) => {
  console.error(error.stack || error);
  process.exitCode = 1;
});
