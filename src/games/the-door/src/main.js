const canvas = document.querySelector("#gameCanvas");
const context = canvas.getContext("2d");
const startButton = document.querySelector("#startButton");

const CANVAS_WIDTH = canvas.width;
const CANVAS_HEIGHT = canvas.height;
const LANE_COUNT = 3;
const STARTING_LANE = 1;
const PLAYER_BASE_Y = 408;
const PLAYER_WIDTH = 66;
const PLAYER_HEIGHT = 82;
const DUCK_HEIGHT = 50;
const JUMP_DURATION_MS = 560;
const JUMP_HEIGHT = 88;
const DUCK_DURATION_MS = 360;
const PROJECTILE_SPEED = 0.58;
const SHOOT_COOLDOWN_MS = 220;
const MAX_PROJECTILES = 12;
const MAX_ACTIVE_THREATS = 1;
const BASE_THREAT_SPEED = 0.16;
const MAX_THREAT_SPEED = 0.3;
const SPEED_RAMP_PER_SECOND = 0.003;
const THREAT_START_Y = 150;
const THREAT_CLEANUP_Y = 590;
const INITIAL_SPAWN_DELAY_MS = 900;
const INITIAL_THREAT_SPAWN_COOLDOWN_MS = 850;
const MIN_THREAT_SPAWN_COOLDOWN_MS = 520;
const SPAWN_COOLDOWN_REDUCTION_PER_SECOND = 4;
const COLLISION_ZONE_TOP = PLAYER_BASE_Y - 46;
const COLLISION_ZONE_BOTTOM = PLAYER_BASE_Y + 48;
const PROJECTILE_HIT_PADDING = 24;
const LOCAL_STORAGE_LEADERBOARD_KEY = "primus-door-local-leaderboard-v1";
const LEADERBOARD_MAX_ENTRIES = 10;
const SCORE_PER_SECOND = 12;
const ENEMY_HIT_BONUS = 150;
const DEFAULT_PLAYER_NAME = "You";
const TOUCH_SWIPE_MIN_DISTANCE = 34;
const TOUCH_TAP_MAX_DISTANCE = 18;
const TOUCH_TAP_MAX_DURATION_MS = 280;

const THREAT_TYPES = ["enemy", "lowObstacle", "highObstacle"];
const THREAT_DIMENSIONS = {
  enemy: { width: 54, height: 74 },
  lowObstacle: { width: 86, height: 42 },
  highObstacle: { width: 96, height: 88 },
};

const game = {
  state: "ready",
  startedAt: 0,
  lastFrameTime: 0,
  nextSpawnAt: 0,
  lastThreatLane: -1,
  runTimeMs: 0,
  threatSpeed: BASE_THREAT_SPEED,
  spawnCooldown: INITIAL_THREAT_SPAWN_COOLDOWN_MS,
  score: 0,
  finalScore: 0,
  hasRecordedFinalScore: false,
};

const player = {
  lane: STARTING_LANE,
  jumpStartedAt: 0,
  duckStartedAt: 0,
  yOffset: 0,
  duckScale: 0,
  isJumping: false,
  isDucking: false,
  lastShotAt: -SHOOT_COOLDOWN_MS,
};

const touchGesture = {
  isTracking: false,
  startX: 0,
  startY: 0,
  startTime: 0,
};

const projectiles = [];
const threats = [];
let threatSpawnBag = [];
let leaderboardEntries = [];

const road = {
  horizonY: 150,
  topWidth: 280,
  bottomWidth: 820,
  bottomY: 520,
};

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function getRoadEdgeX(y, side) {
  const centerX = CANVAS_WIDTH / 2;
  const progress = clamp((y - road.horizonY) / (road.bottomY - road.horizonY), 0, 1);
  const halfWidth = (road.topWidth / 2) + ((road.bottomWidth - road.topWidth) / 2) * progress;
  return centerX + halfWidth * side;
}

function getLaneBoundaryX(boundaryIndex, y) {
  const leftX = getRoadEdgeX(y, -1);
  const rightX = getRoadEdgeX(y, 1);
  return leftX + ((rightX - leftX) / LANE_COUNT) * boundaryIndex;
}

function getLaneCenterX(laneIndex, y) {
  return (getLaneBoundaryX(laneIndex, y) + getLaneBoundaryX(laneIndex + 1, y)) / 2;
}

function getPlayerPosition() {
  const duckDrop = player.duckScale * 18;
  return {
    x: getLaneCenterX(player.lane, PLAYER_BASE_Y),
    y: PLAYER_BASE_Y + player.yOffset + duckDrop,
  };
}

function resetPlayerState() {
  player.lane = STARTING_LANE;
  player.jumpStartedAt = 0;
  player.duckStartedAt = 0;
  player.yOffset = 0;
  player.duckScale = 0;
  player.isJumping = false;
  player.isDucking = false;
  player.lastShotAt = -SHOOT_COOLDOWN_MS;
}

function setStartButton(label, isVisible) {
  startButton.textContent = label;
  startButton.classList.toggle("is-hidden", !isVisible);
}

function resetRunState(timestamp) {
  game.state = "playing";
  game.startedAt = timestamp;
  game.lastFrameTime = 0;
  game.nextSpawnAt = timestamp + INITIAL_SPAWN_DELAY_MS;
  game.lastThreatLane = -1;
  game.runTimeMs = 0;
  game.threatSpeed = BASE_THREAT_SPEED;
  game.spawnCooldown = INITIAL_THREAT_SPAWN_COOLDOWN_MS;
  game.score = 0;
  game.finalScore = 0;
  game.hasRecordedFinalScore = false;

  resetPlayerState();
  projectiles.length = 0;
  threats.length = 0;
  threatSpawnBag.length = 0;
}

function restartGame(timestamp = performance.now()) {
  resetRunState(timestamp);

  setStartButton("Restart", false);
  startButton.blur();
}

function startGame() {
  restartGame(performance.now());
}

function triggerGameOver() {
  if (game.state !== "playing") {
    return;
  }

  game.finalScore = Math.floor(game.score);
  recordFinalScore(game.finalScore);
  game.state = "gameOver";
  game.nextSpawnAt = Number.POSITIVE_INFINITY;
  setStartButton("Restart", true);
}

function moveLane(direction) {
  if (game.state !== "playing") {
    return;
  }

  player.lane = clamp(player.lane + direction, 0, LANE_COUNT - 1);
}

function jump(timestamp) {
  if (game.state !== "playing" || player.isJumping) {
    return;
  }

  player.isJumping = true;
  player.jumpStartedAt = timestamp;
}

function duck(timestamp) {
  if (game.state !== "playing" || player.isDucking) {
    return;
  }

  player.isDucking = true;
  player.duckStartedAt = timestamp;
}

function shoot(timestamp) {
  if (game.state !== "playing" || timestamp - player.lastShotAt < SHOOT_COOLDOWN_MS) {
    return;
  }

  const position = getPlayerPosition();

  if (projectiles.length >= MAX_PROJECTILES) {
    projectiles.shift();
  }

  projectiles.push({
    lane: player.lane,
    y: position.y - 52,
  });

  player.lastShotAt = timestamp;
}

function shuffleThreatTypes() {
  threatSpawnBag = [...THREAT_TYPES];

  for (let index = threatSpawnBag.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [threatSpawnBag[index], threatSpawnBag[swapIndex]] = [threatSpawnBag[swapIndex], threatSpawnBag[index]];
  }
}

function getNextThreatType() {
  if (threatSpawnBag.length === 0) {
    shuffleThreatTypes();
  }

  return threatSpawnBag.pop();
}

function cleanLeaderboardName(name) {
  if (typeof name !== "string") {
    return "";
  }

  return name.replace(/\s*\(fake\)\s*/gi, " ").replace(/\s+/g, " ").trim();
}

function spawnThreat(timestamp = performance.now()) {
  if (!canSpawnThreat(timestamp)) {
    return;
  }

  const type = getNextThreatType();
  const dimensions = THREAT_DIMENSIONS[type];
  let lane = Math.floor(Math.random() * LANE_COUNT);

  if (lane === game.lastThreatLane) {
    lane = (lane + 1 + Math.floor(Math.random() * (LANE_COUNT - 1))) % LANE_COUNT;
  }

  threats.push({
    type,
    lane,
    y: THREAT_START_Y,
    width: dimensions.width,
    height: dimensions.height,
    cleared: false,
  });

  game.lastThreatLane = lane;
}

function canSpawnThreat(timestamp) {
  return game.state === "playing" && threats.length < MAX_ACTIVE_THREATS && timestamp >= game.nextSpawnAt;
}

function scheduleNextThreat(timestamp) {
  if (threats.length < MAX_ACTIVE_THREATS) {
    game.nextSpawnAt = timestamp + game.spawnCooldown;
  }
}

function updateScore(deltaTime) {
  game.score += (deltaTime / 1000) * SCORE_PER_SECOND;
}

function getSeedLeaderboard() {
  return [
    { name: "Captain Ketchup", score: 900 },
    { name: "Professor Pickle", score: 720 },
    { name: "Samurai Sauce", score: 560 },
    { name: "Can Crusher", score: 430 },
    { name: "The Fridge", score: 300 },
  ];
}

function normalizeLeaderboard(entries) {
  const normalizedEntries = Array.isArray(entries) ? entries : [];

  return normalizedEntries
    .map((entry) => {
      const cleanedName = cleanLeaderboardName(entry.name);

      return {
        name: cleanedName !== "" ? cleanedName : DEFAULT_PLAYER_NAME,
        score: Number.isFinite(Number(entry.score)) ? Math.max(0, Math.floor(Number(entry.score))) : 0,
      };
    })
    .sort((leftEntry, rightEntry) => rightEntry.score - leftEntry.score)
    .slice(0, LEADERBOARD_MAX_ENTRIES);
}

function saveLeaderboard(entries) {
  leaderboardEntries = normalizeLeaderboard(entries);

  try {
    if (typeof localStorage !== "undefined") {
      localStorage.setItem(LOCAL_STORAGE_LEADERBOARD_KEY, JSON.stringify(leaderboardEntries));
    }
  } catch (error) {
    // Storage can be unavailable in private modes or local file contexts; memory fallback keeps play safe.
  }

  return leaderboardEntries;
}

function loadLeaderboard() {
  try {
    if (typeof localStorage !== "undefined") {
      const savedLeaderboard = localStorage.getItem(LOCAL_STORAGE_LEADERBOARD_KEY);

      if (savedLeaderboard) {
        const parsedLeaderboard = JSON.parse(savedLeaderboard);
        const normalizedLeaderboard = normalizeLeaderboard(parsedLeaderboard);

        if (normalizedLeaderboard.length > 0) {
          return saveLeaderboard(normalizedLeaderboard);
        }
      }

      return saveLeaderboard(getSeedLeaderboard());
    }
  } catch (error) {
    return normalizeLeaderboard(getSeedLeaderboard());
  }

  return normalizeLeaderboard(getSeedLeaderboard());
}

function recordFinalScore(score) {
  if (game.hasRecordedFinalScore) {
    return;
  }

  game.hasRecordedFinalScore = true;
  saveLeaderboard([
    ...leaderboardEntries,
    {
      name: DEFAULT_PLAYER_NAME,
      score: Math.max(0, Math.floor(score)),
    },
  ]);
}

function updateDifficulty(deltaTime) {
  game.runTimeMs += deltaTime;

  const elapsedSeconds = game.runTimeMs / 1000;
  game.threatSpeed = clamp(
    BASE_THREAT_SPEED + elapsedSeconds * SPEED_RAMP_PER_SECOND,
    BASE_THREAT_SPEED,
    MAX_THREAT_SPEED
  );
  game.spawnCooldown = clamp(
    INITIAL_THREAT_SPAWN_COOLDOWN_MS - elapsedSeconds * SPAWN_COOLDOWN_REDUCTION_PER_SECOND,
    MIN_THREAT_SPAWN_COOLDOWN_MS,
    INITIAL_THREAT_SPAWN_COOLDOWN_MS
  );
}

function updatePlayer(timestamp) {
  if (player.isJumping) {
    const jumpProgress = clamp((timestamp - player.jumpStartedAt) / JUMP_DURATION_MS, 0, 1);
    player.yOffset = -Math.sin(jumpProgress * Math.PI) * JUMP_HEIGHT;

    if (jumpProgress >= 1) {
      player.isJumping = false;
      player.yOffset = 0;
    }
  }

  if (player.isDucking) {
    const duckProgress = clamp((timestamp - player.duckStartedAt) / DUCK_DURATION_MS, 0, 1);
    player.duckScale = Math.sin(duckProgress * Math.PI);

    if (duckProgress >= 1) {
      player.isDucking = false;
      player.duckScale = 0;
    }
  }
}

function updateProjectiles(deltaTime) {
  for (let index = projectiles.length - 1; index >= 0; index -= 1) {
    projectiles[index].y -= PROJECTILE_SPEED * deltaTime;
  }

  cleanupProjectiles();
}

function cleanupProjectiles() {
  for (let index = projectiles.length - 1; index >= 0; index -= 1) {
    if (projectiles[index].y < -24) {
      projectiles.splice(index, 1);
    }
  }
}

function updateThreats(deltaTime, timestamp) {
  for (let index = threats.length - 1; index >= 0; index -= 1) {
    threats[index].y += game.threatSpeed * deltaTime;
  }

  cleanupThreats(timestamp);

  if (canSpawnThreat(timestamp)) {
    spawnThreat(timestamp);
  }
}

function cleanupThreats(timestamp) {
  let removedThreat = false;

  for (let index = threats.length - 1; index >= 0; index -= 1) {
    if (threats[index].y > THREAT_CLEANUP_Y) {
      threats.splice(index, 1);
      removedThreat = true;
    }
  }

  if (removedThreat) {
    scheduleNextThreat(timestamp);
  }
}

function isThreatInPlayerZone(threat) {
  const top = threat.y - threat.height / 2;
  const bottom = threat.y + threat.height / 2;
  return bottom >= COLLISION_ZONE_TOP && top <= COLLISION_ZONE_BOTTOM;
}

function isPlayerClearingLowObstacle() {
  return player.isJumping;
}

function isPlayerClearingHighObstacle() {
  return player.isDucking;
}

function checkProjectileHits(timestamp) {
  for (let threatIndex = threats.length - 1; threatIndex >= 0; threatIndex -= 1) {
    const threat = threats[threatIndex];

    if (threat.type !== "enemy") {
      continue;
    }

    for (let projectileIndex = projectiles.length - 1; projectileIndex >= 0; projectileIndex -= 1) {
      const projectile = projectiles[projectileIndex];
      const hitRange = threat.height / 2 + PROJECTILE_HIT_PADDING;

      if (projectile.lane === threat.lane && Math.abs(projectile.y - threat.y) <= hitRange) {
        threats.splice(threatIndex, 1);
        projectiles.splice(projectileIndex, 1);
        game.score += ENEMY_HIT_BONUS;
        scheduleNextThreat(timestamp);
        break;
      }
    }
  }
}

function checkPlayerThreatCollision() {
  threats.forEach((threat) => {
    if (game.state !== "playing" || threat.cleared || threat.lane !== player.lane || !isThreatInPlayerZone(threat)) {
      return;
    }

    if (threat.type === "enemy") {
      triggerGameOver();
      return;
    }

    if (threat.type === "lowObstacle") {
      if (isPlayerClearingLowObstacle()) {
        threat.cleared = true;
      } else {
        triggerGameOver();
      }

      return;
    }

    if (threat.type === "highObstacle") {
      if (isPlayerClearingHighObstacle()) {
        threat.cleared = true;
      } else {
        triggerGameOver();
      }
    }
  });
}

function updatePlayingState(timestamp, deltaTime) {
  updateDifficulty(deltaTime);
  updateScore(deltaTime);
  updatePlayer(timestamp);
  updateProjectiles(deltaTime);
  updateThreats(deltaTime, timestamp);
  checkProjectileHits(timestamp);
  checkPlayerThreatCollision();
}

function handleKeyDown(event) {
  const key = event.key.toLowerCase();

  if (key === "enter") {
    event.preventDefault();

    if (game.state === "ready" || game.state === "gameOver") {
      restartGame(event.timeStamp);
    }

    return;
  }

  if (key === " ") {
    event.preventDefault();

    if (game.state === "ready") {
      restartGame(event.timeStamp);
    } else if (game.state === "playing") {
      shoot(event.timeStamp);
    }

    return;
  }

  if (key === "arrowleft" || key === "a") {
    event.preventDefault();
    moveLane(-1);
    return;
  }

  if (key === "arrowright" || key === "d") {
    event.preventDefault();
    moveLane(1);
    return;
  }

  if (key === "arrowup" || key === "w") {
    event.preventDefault();
    jump(event.timeStamp);
    return;
  }

  if (key === "arrowdown" || key === "s") {
    event.preventDefault();
    duck(event.timeStamp);
  }
}

function getChangedTouch(event) {
  return event.changedTouches && event.changedTouches.length > 0 ? event.changedTouches[0] : null;
}

function preventTouchScroll(event) {
  if (event.cancelable) {
    event.preventDefault();
  }
}

function handleTouchStart(event) {
  const touch = getChangedTouch(event);

  if (!touch) {
    return;
  }

  preventTouchScroll(event);
  touchGesture.isTracking = true;
  touchGesture.startX = touch.clientX;
  touchGesture.startY = touch.clientY;
  touchGesture.startTime = event.timeStamp;
}

function handleTouchMove(event) {
  if (touchGesture.isTracking) {
    preventTouchScroll(event);
  }
}

function handleTouchEnd(event) {
  const touch = getChangedTouch(event);

  if (!touch || !touchGesture.isTracking) {
    return;
  }

  preventTouchScroll(event);
  touchGesture.isTracking = false;

  const deltaX = touch.clientX - touchGesture.startX;
  const deltaY = touch.clientY - touchGesture.startY;
  const distanceX = Math.abs(deltaX);
  const distanceY = Math.abs(deltaY);
  const gestureDuration = event.timeStamp - touchGesture.startTime;

  // Touch controls mirror keyboard actions: swipe lanes, swipe up/down, tap to start/restart or shoot.
  if (Math.max(distanceX, distanceY) >= TOUCH_SWIPE_MIN_DISTANCE) {
    if (distanceX > distanceY) {
      moveLane(deltaX > 0 ? 1 : -1);
    } else if (deltaY < 0) {
      jump(event.timeStamp);
    } else {
      duck(event.timeStamp);
    }

    return;
  }

  if (Math.max(distanceX, distanceY) <= TOUCH_TAP_MAX_DISTANCE && gestureDuration <= TOUCH_TAP_MAX_DURATION_MS) {
    if (game.state === "ready" || game.state === "gameOver") {
      restartGame(event.timeStamp);
    } else {
      shoot(event.timeStamp);
    }
  }
}

function drawBackground(timestamp) {
  const gradient = context.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
  gradient.addColorStop(0, "#dce9e8");
  gradient.addColorStop(0.48, "#afc7c5");
  gradient.addColorStop(1, "#334442");

  context.fillStyle = gradient;
  context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  const doorWall = context.createLinearGradient(44, 0, 188, 0);
  doorWall.addColorStop(0, "#f5fbf8");
  doorWall.addColorStop(0.64, "#dce8e5");
  doorWall.addColorStop(1, "#9fb6b2");

  context.fillStyle = doorWall;
  context.fillRect(44, 86, 146, 444);

  context.fillStyle = "rgba(30, 55, 52, 0.18)";
  context.fillRect(178, 86, 12, 444);

  context.strokeStyle = "rgba(37, 63, 60, 0.22)";
  context.lineWidth = 2;
  for (let y = 124; y < 510; y += 64) {
    context.beginPath();
    context.moveTo(62, y);
    context.lineTo(178, y);
    context.stroke();
  }

  const chillLinesOffset = game.state === "playing" ? (timestamp * 0.018) % 48 : 0;
  context.strokeStyle = "rgba(255, 255, 255, 0.16)";
  context.lineWidth = 1;
  for (let y = road.horizonY + chillLinesOffset; y < CANVAS_HEIGHT; y += 48) {
    context.beginPath();
    context.moveTo(202, y);
    context.lineTo(CANVAS_WIDTH - 88, y + 10);
    context.stroke();
  }
}

function drawLanes() {
  const leftBottom = getRoadEdgeX(road.bottomY, -1);
  const rightBottom = getRoadEdgeX(road.bottomY, 1);
  const leftTop = getRoadEdgeX(road.horizonY, -1);
  const rightTop = getRoadEdgeX(road.horizonY, 1);

  context.save();
  context.beginPath();
  context.moveTo(leftTop, road.horizonY);
  context.lineTo(rightTop, road.horizonY);
  context.lineTo(rightBottom, road.bottomY);
  context.lineTo(leftBottom, road.bottomY);
  context.closePath();
  const shelfGradient = context.createLinearGradient(0, road.horizonY, 0, road.bottomY);
  shelfGradient.addColorStop(0, "#eef7f3");
  shelfGradient.addColorStop(0.58, "#b8ccc8");
  shelfGradient.addColorStop(1, "#708985");
  context.fillStyle = shelfGradient;
  context.fill();
  context.clip();

  context.strokeStyle = "rgba(55, 80, 76, 0.22)";
  context.lineWidth = 2;
  for (let y = road.horizonY + 34; y < road.bottomY; y += 62) {
    context.beginPath();
    context.moveTo(getRoadEdgeX(y, -1), y);
    context.lineTo(getRoadEdgeX(y, 1), y + 12);
    context.stroke();
  }

  for (let lane = 0; lane < LANE_COUNT; lane += 1) {
    const bottomLeft = getLaneBoundaryX(lane, road.bottomY);
    const bottomRight = getLaneBoundaryX(lane + 1, road.bottomY);
    const topLeft = getLaneBoundaryX(lane, road.horizonY);
    const topRight = getLaneBoundaryX(lane + 1, road.horizonY);

    context.beginPath();
    context.moveTo(topLeft, road.horizonY);
    context.lineTo(topRight, road.horizonY);
    context.lineTo(bottomRight, road.bottomY);
    context.lineTo(bottomLeft, road.bottomY);
    context.closePath();
    context.fillStyle = lane === player.lane && game.state === "playing"
      ? "rgba(220, 48, 36, 0.16)"
      : "rgba(255, 255, 255, 0.08)";
    context.fill();
  }

  context.restore();

  context.lineCap = "round";

  context.beginPath();
  context.moveTo(leftTop, road.horizonY);
  context.lineTo(rightTop, road.horizonY);
  context.lineTo(rightBottom, road.bottomY);
  context.lineTo(leftBottom, road.bottomY);
  context.closePath();
  context.lineWidth = 4;
  context.strokeStyle = "rgba(23, 45, 42, 0.24)";
  context.stroke();

  context.beginPath();
  context.moveTo(leftTop, road.horizonY);
  context.lineTo(leftBottom, road.bottomY);
  context.strokeStyle = "#f5fbf8";
  context.lineWidth = 18;
  context.stroke();

  context.beginPath();
  context.moveTo(leftTop + 10, road.horizonY);
  context.lineTo(leftBottom + 16, road.bottomY);
  context.strokeStyle = "rgba(75, 103, 98, 0.42)";
  context.lineWidth = 4;
  context.stroke();

  context.beginPath();
  context.moveTo(rightTop, road.horizonY);
  context.lineTo(rightBottom, road.bottomY);
  context.strokeStyle = "#d8dedb";
  context.lineWidth = 15;
  context.stroke();

  context.beginPath();
  context.moveTo(rightTop - 16, road.horizonY + 8);
  context.lineTo(rightBottom - 26, road.bottomY - 4);
  context.strokeStyle = "#81938f";
  context.lineWidth = 5;
  context.stroke();

  context.beginPath();
  context.moveTo(rightTop + 18, road.horizonY - 2);
  context.lineTo(rightBottom + 24, road.bottomY + 2);
  context.strokeStyle = "#f6fbf8";
  context.lineWidth = 6;
  context.stroke();

  for (let boundary = 1; boundary < LANE_COUNT; boundary += 1) {
    context.beginPath();
    context.moveTo(getLaneBoundaryX(boundary, road.horizonY), road.horizonY);
    context.lineTo(getLaneBoundaryX(boundary, road.bottomY), road.bottomY);
    context.strokeStyle = "rgba(35, 66, 61, 0.45)";
    context.lineWidth = 3;
    context.setLineDash([16, 14]);
    context.stroke();
  }

  context.setLineDash([]);
  context.lineCap = "butt";
}

function drawRoundedRect(x, y, width, height, radius) {
  const corner = Math.min(radius, width / 2, height / 2);

  context.beginPath();
  context.moveTo(x + corner, y);
  context.lineTo(x + width - corner, y);
  context.quadraticCurveTo(x + width, y, x + width, y + corner);
  context.lineTo(x + width, y + height - corner);
  context.quadraticCurveTo(x + width, y + height, x + width - corner, y + height);
  context.lineTo(x + corner, y + height);
  context.quadraticCurveTo(x, y + height, x, y + height - corner);
  context.lineTo(x, y + corner);
  context.quadraticCurveTo(x, y, x + corner, y);
  context.closePath();
}

function drawEnemy(threat, x, y, width, height) {
  context.save();
  context.shadowColor = "rgba(0, 0, 0, 0.4)";
  context.shadowBlur = 10;
  context.shadowOffsetY = 6;
  context.translate(x, y);
  context.rotate(Math.sin(threat.y * 0.035) * 0.18);

  drawRoundedRect(-width / 2, -height / 2, width, height, 13);
  context.fillStyle = "#c8332d";
  context.fill();

  context.shadowColor = "transparent";
  drawRoundedRect(-width / 2 + 4, -height / 2 + 4, width - 8, 10, 5);
  context.fillStyle = "#e6efec";
  context.fill();

  drawRoundedRect(-width / 2 + 4, height / 2 - 14, width - 8, 10, 5);
  context.fillStyle = "#b8c7c3";
  context.fill();

  context.fillStyle = "#f4d36a";
  context.beginPath();
  context.moveTo(-width / 2 + 7, -height / 2 + 22);
  context.lineTo(width / 2 - 8, -height / 2 + 14);
  context.lineTo(width / 2 - 7, height / 2 - 24);
  context.lineTo(-width / 2 + 7, height / 2 - 14);
  context.closePath();
  context.fill();

  context.fillStyle = "#f9fbf7";
  drawRoundedRect(-width / 2 + 13, -8, width - 26, 18, 7);
  context.fill();

  context.fillStyle = "#1d2423";
  context.font = `${Math.max(10, width * 0.18)}px Arial, sans-serif`;
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillText("SODA", 0, 1);

  context.fillStyle = "#1a1716";
  context.beginPath();
  context.arc(-width * 0.17, -height * 0.2, 3.2, 0, Math.PI * 2);
  context.arc(width * 0.17, -height * 0.2, 3.2, 0, Math.PI * 2);
  context.fill();

  context.strokeStyle = "#1a1716";
  context.lineWidth = 2;
  context.beginPath();
  context.moveTo(-width * 0.2, -height * 0.06);
  context.quadraticCurveTo(0, height * 0.03, width * 0.2, -height * 0.06);
  context.stroke();

  context.strokeStyle = "rgba(255, 255, 255, 0.35)";
  context.lineWidth = 3;
  context.beginPath();
  context.moveTo(width / 2 - 10, -height / 2 + 20);
  context.lineTo(width / 2 - 15, height / 2 - 22);
  context.stroke();
  context.restore();
}

function drawLowObstacle(threat, x, y, width, height) {
  context.save();
  context.globalAlpha = threat.cleared ? 0.5 : 1;
  context.shadowColor = "rgba(0, 0, 0, 0.28)";
  context.shadowBlur = 8;
  context.shadowOffsetY = 5;

  drawRoundedRect(x - width / 2, y - height / 2, width, height, 8);
  context.fillStyle = "#f5d354";
  context.fill();

  context.shadowColor = "transparent";
  context.fillStyle = "#fff0a6";
  context.fillRect(x - width / 2 + 8, y - height / 2 + 7, width - 16, height - 14);

  context.fillStyle = "#f6d45d";
  drawRoundedRect(x - width / 2 + 18, y - height / 2 + 9, width - 36, height - 18, 5);
  context.fill();

  context.strokeStyle = "#c99d26";
  context.lineWidth = 2;
  context.stroke();

  context.fillStyle = "#80571a";
  context.font = `${Math.max(10, height * 0.28)}px Arial, sans-serif`;
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillText("BUTTER", x, y + 1);

  context.strokeStyle = "rgba(255, 255, 255, 0.38)";
  context.lineWidth = 2;
  context.beginPath();
  context.moveTo(x - width / 2 - 16, y + height / 2 - 5);
  context.lineTo(x - width / 2 - 4, y + height / 2 - 5);
  context.moveTo(x - width / 2 - 22, y + height / 2 + 5);
  context.lineTo(x - width / 2 - 6, y + height / 2 + 5);
  context.stroke();
  context.restore();
}

function drawHighObstacle(threat, x, y, width, height) {
  context.save();
  context.globalAlpha = threat.cleared ? 0.45 : 1;
  context.shadowColor = "rgba(0, 0, 0, 0.34)";
  context.shadowBlur = 8;
  context.shadowOffsetY = 4;

  const left = x - width / 2;
  const right = x + width / 2;
  const top = y - height / 2 + 10;
  const bottom = y + height / 2 - 12;

  context.strokeStyle = "#e7efed";
  context.lineWidth = 6;
  context.lineCap = "round";

  context.beginPath();
  context.moveTo(left + 8, top);
  context.lineTo(right - 8, top);
  context.moveTo(left + 8, bottom);
  context.lineTo(right - 8, bottom);
  context.stroke();

  context.shadowColor = "transparent";
  context.strokeStyle = "#738986";
  context.lineWidth = 3;
  for (let bar = 0; bar < 5; bar += 1) {
    const barX = left + 16 + (bar * (width - 32)) / 4;

    context.beginPath();
    context.moveTo(barX, top - 16);
    context.lineTo(barX, bottom + 4);
    context.stroke();
  }

  context.strokeStyle = "#c6d4d1";
  context.lineWidth = 3;
  for (let row = 1; row < 3; row += 1) {
    const rowY = top + (row * (bottom - top)) / 3;

    context.beginPath();
    context.moveTo(left + 12, rowY);
    context.lineTo(right - 12, rowY);
    context.stroke();
  }

  context.fillStyle = "#d8342a";
  context.beginPath();
  context.moveTo(x - 8, bottom + 8);
  context.lineTo(x + 8, bottom + 8);
  context.lineTo(x, bottom + 24);
  context.closePath();
  context.fill();
  context.restore();
}

function getThreatScale(y) {
  const progress = clamp((y - road.horizonY) / (road.bottomY - road.horizonY), 0, 1);
  return 0.66 + progress * 0.4;
}

function drawThreats() {
  threats.forEach((threat) => {
    const scale = getThreatScale(threat.y);
    const x = getLaneCenterX(threat.lane, threat.y);
    const width = threat.width * scale;
    const height = threat.height * scale;

    if (threat.type === "enemy") {
      drawEnemy(threat, x, threat.y, width, height);
    } else if (threat.type === "lowObstacle") {
      drawLowObstacle(threat, x, threat.y, width, height);
    } else {
      drawHighObstacle(threat, x, threat.y, width, height);
    }
  });
}

function drawPlayer() {
  const position = getPlayerPosition();
  const width = PLAYER_WIDTH + player.duckScale * 16;
  const height = PLAYER_HEIGHT - (PLAYER_HEIGHT - DUCK_HEIGHT) * player.duckScale;
  const step = game.state === "playing" ? Math.sin(game.runTimeMs / 95) : 0;
  const lean = player.isJumping ? -0.16 : player.isDucking ? 0.08 : step * 0.05;
  const bodyWidth = width * 0.62;
  const bodyHeight = height * 0.72;
  const neckWidth = bodyWidth * 0.46;
  const capWidth = bodyWidth * 0.58;
  const bodyTop = -height / 2 + height * 0.23;
  const bodyLeft = -bodyWidth / 2;

  context.save();
  context.translate(position.x, position.y);
  context.rotate(lean);
  context.shadowColor = "rgba(0, 0, 0, 0.45)";
  context.shadowBlur = 16;
  context.shadowOffsetY = 10;

  context.strokeStyle = "#8f201a";
  context.lineWidth = Math.max(3, width * 0.07);
  context.lineCap = "round";
  context.beginPath();
  context.moveTo(bodyLeft - 4, bodyTop + bodyHeight * 0.46);
  context.lineTo(bodyLeft - 18, bodyTop + bodyHeight * 0.64 + step * 3);
  context.moveTo(-bodyLeft + 4, bodyTop + bodyHeight * 0.45);
  context.lineTo(-bodyLeft + 17, bodyTop + bodyHeight * 0.34 - step * 3);
  context.stroke();

  context.beginPath();
  context.moveTo(-bodyWidth * 0.23, bodyTop + bodyHeight - 2);
  context.lineTo(-bodyWidth * 0.42, bodyTop + bodyHeight + 13 + step * 4);
  context.moveTo(bodyWidth * 0.23, bodyTop + bodyHeight - 2);
  context.lineTo(bodyWidth * 0.44, bodyTop + bodyHeight + 12 - step * 4);
  context.stroke();

  drawRoundedRect(bodyLeft, bodyTop, bodyWidth, bodyHeight, 14);
  context.fillStyle = "#d8342a";
  context.fill();

  context.shadowColor = "transparent";
  drawRoundedRect(-neckWidth / 2, bodyTop - height * 0.12, neckWidth, height * 0.18, 6);
  context.fillStyle = "#b92c25";
  context.fill();

  drawRoundedRect(-capWidth / 2, bodyTop - height * 0.23, capWidth, height * 0.14, 5);
  context.fillStyle = "#f3d35f";
  context.fill();

  context.fillStyle = "#fff6df";
  drawRoundedRect(-bodyWidth * 0.34, bodyTop + bodyHeight * 0.32, bodyWidth * 0.68, bodyHeight * 0.28, 7);
  context.fill();

  context.fillStyle = "#d8342a";
  context.font = `${Math.max(10, bodyWidth * 0.24)}px Arial, sans-serif`;
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillText("RUN", 0, bodyTop + bodyHeight * 0.46);

  context.fillStyle = "#fff6df";
  context.beginPath();
  context.arc(-bodyWidth * 0.16, bodyTop + bodyHeight * 0.19, 5, 0, Math.PI * 2);
  context.arc(bodyWidth * 0.16, bodyTop + bodyHeight * 0.19, 5, 0, Math.PI * 2);
  context.fill();

  context.fillStyle = "#191211";
  context.beginPath();
  context.arc(-bodyWidth * 0.14, bodyTop + bodyHeight * 0.2, 2.4, 0, Math.PI * 2);
  context.arc(bodyWidth * 0.18, bodyTop + bodyHeight * 0.2, 2.4, 0, Math.PI * 2);
  context.fill();

  context.strokeStyle = "#191211";
  context.lineWidth = 2;
  context.beginPath();
  context.moveTo(-bodyWidth * 0.26, bodyTop + bodyHeight * 0.12);
  context.lineTo(-bodyWidth * 0.06, bodyTop + bodyHeight * 0.09);
  context.moveTo(bodyWidth * 0.07, bodyTop + bodyHeight * 0.09);
  context.lineTo(bodyWidth * 0.28, bodyTop + bodyHeight * 0.12);
  context.stroke();

  context.strokeStyle = "rgba(255, 246, 223, 0.34)";
  context.lineWidth = 3;
  context.beginPath();
  context.moveTo(bodyWidth * 0.25, bodyTop + bodyHeight * 0.18);
  context.lineTo(bodyWidth * 0.2, bodyTop + bodyHeight * 0.72);
  context.stroke();
  context.restore();
}

function drawProjectiles() {
  context.save();
  context.strokeStyle = "#d8342a";
  context.fillStyle = "#f3d35f";
  context.lineWidth = 4;
  context.lineCap = "round";
  context.shadowColor = "rgba(216, 52, 42, 0.5)";
  context.shadowBlur = 12;

  projectiles.forEach((projectile) => {
    const x = getLaneCenterX(projectile.lane, projectile.y);
    context.beginPath();
    context.moveTo(x, projectile.y + 16);
    context.lineTo(x, projectile.y - 14);
    context.stroke();
    context.beginPath();
    context.arc(x, projectile.y - 17, 5, 0, Math.PI * 2);
    context.fill();
  });

  context.restore();
}

function drawScore() {
  if (game.state !== "playing" && game.state !== "gameOver") {
    return;
  }

  context.save();
  drawRoundedRect(20, 18, 156, game.state === "playing" ? 58 : 38, 8);
  context.fillStyle = "rgba(15, 20, 19, 0.62)";
  context.fill();

  context.textAlign = "left";
  context.textBaseline = "top";
  context.font = "700 24px Arial, sans-serif";
  context.fillStyle = "#fff6df";
  context.fillText(`Score ${Math.floor(game.score)}`, 28, 24);

  if (game.state === "playing") {
    context.font = "14px Arial, sans-serif";
    context.fillStyle = "rgba(255, 246, 223, 0.72)";
    context.fillText(`Speed ${game.threatSpeed.toFixed(2)}`, 30, 56);
  }

  context.restore();
}

function drawLeaderboard(x, y) {
  context.save();
  context.textAlign = "left";
  context.textBaseline = "top";

  context.font = "700 18px Arial, sans-serif";
  context.fillStyle = "#f4d36a";
  context.fillText("Local Leaderboard", x, y);

  context.font = "13px Arial, sans-serif";
  context.fillStyle = "rgba(255, 246, 223, 0.64)";
  context.fillText("local scores on this browser", x, y + 24);

  context.font = "16px Arial, sans-serif";
  leaderboardEntries.slice(0, LEADERBOARD_MAX_ENTRIES).forEach((entry, index) => {
    const rowY = y + 52 + index * 24;
    context.fillStyle = entry.name === DEFAULT_PLAYER_NAME ? "#fff6df" : "rgba(255, 246, 223, 0.82)";
    context.fillText(`${index + 1}. ${entry.name}`, x, rowY);
    context.textAlign = "right";
    context.fillText(String(entry.score), x + 280, rowY);
    context.textAlign = "left";
  });

  context.restore();
}

function drawStartOverlay() {
  if (game.state !== "ready") {
    return;
  }

  context.fillStyle = "rgba(13, 11, 9, 0.68)";
  context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  context.fillStyle = "#fff6df";
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.font = "700 42px Arial, sans-serif";
  context.fillText("Kitchen Wars: The Door", CANVAS_WIDTH / 2, 126);

  context.font = "20px Arial, sans-serif";
  context.fillStyle = "#f4d36a";
  context.fillText("Press Enter, Space, or tap Start", CANVAS_WIDTH / 2, 180);

  context.font = "16px Arial, sans-serif";
  context.fillStyle = "rgba(255, 246, 223, 0.82)";
  context.fillText("Move: A/D or Left/Right", CANVAS_WIDTH / 2, 244);
  context.fillText("Jump: W/Up | Duck: S/Down", CANVAS_WIDTH / 2, 274);
  context.fillText("Shoot: Space or tap", CANVAS_WIDTH / 2, 304);

  drawLeaderboard(626, 198);
}

function drawGameOverOverlay() {
  if (game.state !== "gameOver") {
    return;
  }

  context.fillStyle = "rgba(13, 11, 9, 0.72)";
  context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  context.fillStyle = "#fff6df";
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.font = "700 52px Arial, sans-serif";
  context.fillText("Game Over", CANVAS_WIDTH / 2, 162);

  context.font = "20px Arial, sans-serif";
  context.fillStyle = "#f4d36a";
  context.fillText(`Final Score ${game.finalScore}`, CANVAS_WIDTH / 2, 220);

  context.font = "16px Arial, sans-serif";
  context.fillStyle = "rgba(255, 246, 223, 0.82)";
  context.fillText("Press Enter or use Restart", CANVAS_WIDTH / 2, 254);
  context.fillText("Shoot cans. Jump butter. Duck racks.", CANVAS_WIDTH / 2, 284);

  drawLeaderboard(626, 174);
}

function gameLoop(timestamp) {
  const deltaTime = game.lastFrameTime === 0 ? 0 : timestamp - game.lastFrameTime;
  game.lastFrameTime = timestamp;

  if (game.state === "playing") {
    updatePlayingState(timestamp, deltaTime);
  }

  drawBackground(timestamp);
  drawLanes();
  drawThreats();
  drawProjectiles();
  drawPlayer();
  drawScore();
  drawStartOverlay();
  drawGameOverOverlay();

  requestAnimationFrame(gameLoop);
}

window.addEventListener("keydown", handleKeyDown);
canvas.addEventListener("touchstart", handleTouchStart, { passive: false });
canvas.addEventListener("touchmove", handleTouchMove, { passive: false });
canvas.addEventListener("touchend", handleTouchEnd, { passive: false });
startButton.addEventListener("click", () => {
  if (game.state === "ready" || game.state === "gameOver") {
    startGame();
  }
});
leaderboardEntries = loadLeaderboard();
requestAnimationFrame(gameLoop);
