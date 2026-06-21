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
    { name: "Captain Ketchup (fake)", score: 900 },
    { name: "Professor Pickle (fake)", score: 720 },
    { name: "Samurai Sauce (fake)", score: 560 },
    { name: "Can Crusher (fake)", score: 430 },
    { name: "The Fridge (fake)", score: 300 },
  ];
}

function normalizeLeaderboard(entries) {
  const normalizedEntries = Array.isArray(entries) ? entries : [];

  return normalizedEntries
    .map((entry) => ({
      name: typeof entry.name === "string" && entry.name.trim() !== "" ? entry.name.trim() : DEFAULT_PLAYER_NAME,
      score: Number.isFinite(Number(entry.score)) ? Math.max(0, Math.floor(Number(entry.score))) : 0,
    }))
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
          return normalizedLeaderboard;
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

function drawBackground(timestamp) {
  const gradient = context.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
  gradient.addColorStop(0, "#17110f");
  gradient.addColorStop(0.55, "#211a17");
  gradient.addColorStop(1, "#0f0d0b");

  context.fillStyle = gradient;
  context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  const glow = context.createRadialGradient(
    CANVAS_WIDTH / 2,
    road.horizonY + 18,
    20,
    CANVAS_WIDTH / 2,
    road.horizonY + 18,
    280
  );
  glow.addColorStop(0, "rgba(255, 205, 88, 0.18)");
  glow.addColorStop(1, "rgba(255, 205, 88, 0)");

  context.fillStyle = glow;
  context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  context.strokeStyle = "rgba(255, 255, 255, 0.07)";
  context.lineWidth = 1;

  const scrollOffset = game.state === "playing" ? (timestamp * 0.035) % 38 : 0;
  for (let y = road.horizonY + scrollOffset; y < CANVAS_HEIGHT; y += 38) {
    context.beginPath();
    context.moveTo(0, y);
    context.lineTo(CANVAS_WIDTH, y);
    context.stroke();
  }
}

function drawLanes() {
  const leftBottom = getRoadEdgeX(road.bottomY, -1);
  const rightBottom = getRoadEdgeX(road.bottomY, 1);
  const leftTop = getRoadEdgeX(road.horizonY, -1);
  const rightTop = getRoadEdgeX(road.horizonY, 1);

  context.beginPath();
  context.moveTo(leftTop, road.horizonY);
  context.lineTo(rightTop, road.horizonY);
  context.lineTo(rightBottom, road.bottomY);
  context.lineTo(leftBottom, road.bottomY);
  context.closePath();
  context.fillStyle = "#2b2a24";
  context.fill();

  context.lineWidth = 4;
  context.strokeStyle = "#f6d366";
  context.stroke();

  for (let boundary = 1; boundary < LANE_COUNT; boundary += 1) {
    context.beginPath();
    context.moveTo(getLaneBoundaryX(boundary, road.horizonY), road.horizonY);
    context.lineTo(getLaneBoundaryX(boundary, road.bottomY), road.bottomY);
    context.strokeStyle = "rgba(255, 255, 255, 0.54)";
    context.lineWidth = 3;
    context.setLineDash([18, 16]);
    context.stroke();
  }

  context.setLineDash([]);

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
      ? "rgba(220, 48, 36, 0.12)"
      : "rgba(255, 255, 255, 0.02)";
    context.fill();
  }
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

  drawRoundedRect(x - width / 2, y - height / 2, width, height, 14);
  context.fillStyle = "#2f9ac6";
  context.fill();

  context.shadowColor = "transparent";
  drawRoundedRect(x - width / 2 + 6, y - height / 2 + 5, width - 12, 16, 8);
  context.fillStyle = "#bceaf2";
  context.fill();

  context.fillStyle = "#fff6df";
  context.fillRect(x - width / 2 + 14, y - 5, width - 28, 9);
  context.restore();
}

function drawLowObstacle(threat, x, y, width, height) {
  context.save();
  drawRoundedRect(x - width / 2, y - height / 2, width, height, 8);
  context.fillStyle = threat.cleared ? "rgba(93, 178, 93, 0.5)" : "#5db25d";
  context.fill();

  context.fillStyle = "rgba(255, 246, 223, 0.42)";
  context.fillRect(x - width / 2 + 10, y - height / 2 + 9, width - 20, 8);
  context.restore();
}

function drawHighObstacle(threat, x, y, width, height) {
  context.save();
  drawRoundedRect(x - width / 2, y - height / 2, width, height, 8);
  context.fillStyle = threat.cleared ? "rgba(127, 102, 219, 0.45)" : "#7f66db";
  context.fill();

  context.fillStyle = "rgba(255, 246, 223, 0.5)";
  context.fillRect(x - width / 2 + 12, y - height / 2 + 12, width - 24, 10);
  context.fillRect(x - width / 2 + 12, y + height / 2 - 22, width - 24, 10);
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
  const x = position.x - width / 2;
  const y = position.y - height / 2;

  context.save();
  context.shadowColor = "rgba(0, 0, 0, 0.45)";
  context.shadowBlur = 16;
  context.shadowOffsetY = 10;

  drawRoundedRect(x, y, width, height, 12);
  context.fillStyle = "#d8342a";
  context.fill();

  context.shadowColor = "transparent";
  drawRoundedRect(x + 14, y - 16 + player.duckScale * 14, width - 28, 24, 9);
  context.fillStyle = "#f3d35f";
  context.fill();

  context.fillStyle = "rgba(255, 255, 255, 0.82)";
  context.fillRect(x + 18, y + 18, width - 36, Math.max(8, 12 - player.duckScale * 3));
  context.restore();
}

function drawProjectiles() {
  context.save();
  context.strokeStyle = "#f3d35f";
  context.fillStyle = "#fff6df";
  context.lineWidth = 4;
  context.lineCap = "round";
  context.shadowColor = "rgba(243, 211, 95, 0.55)";
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
  context.fillText("fake seeds + this browser", x, y + 24);

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
  context.font = "700 46px Arial, sans-serif";
  context.fillText("Kitchen Wars: The Door", CANVAS_WIDTH / 2, 198);

  context.font = "20px Arial, sans-serif";
  context.fillStyle = "#f4d36a";
  context.fillText("Press Enter or Space", CANVAS_WIDTH / 2, 246);

  context.font = "16px Arial, sans-serif";
  context.fillStyle = "rgba(255, 246, 223, 0.82)";
  context.fillText("Move: A/D or Left/Right", CANVAS_WIDTH / 2, 284);
  context.fillText("Jump: W or Up | Duck: S or Down | Shoot: Space", CANVAS_WIDTH / 2, 314);

  drawLeaderboard(626, 174);
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
  context.fillText("Shoot cans, jump low boxes, duck high bars.", CANVAS_WIDTH / 2, 284);

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
startButton.addEventListener("click", () => {
  if (game.state === "ready" || game.state === "gameOver") {
    startGame();
  }
});
leaderboardEntries = loadLeaderboard();
requestAnimationFrame(gameLoop);
