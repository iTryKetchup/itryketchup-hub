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
const AUDIO_BASE_PATH = "assets/audio/";
const LANDING_SQUASH_DURATION_MS = 180;
const PROJECTILE_DESPAWN_MARGIN = 18;
const PROJECTILE_DESPAWN_BURST_LIMIT = 6;
const MAX_PARTICLES = 160;
const PARTICLE_GRAVITY = 0.0014;

const THREAT_TYPES = ["enemy", "lowObstacle", "highObstacle"];
const THREAT_DIMENSIONS = {
  enemy: { width: 54, height: 74 },
  lowObstacle: { width: 86, height: 42 },
  highObstacle: { width: 96, height: 88 },
};

const AUDIO_CLIPS = {
  fridgeHum: {
    file: "ambience-fridge-hum.mp3",
    volume: 0.16,
    loop: true,
  },
  footstep: {
    file: "sfx-footstep-pat.mp3",
    volume: 0.14,
    minIntervalMs: 300,
    stopAfterMs: 180,
  },
  jump: {
    file: "sfx-jump-boing.mp3",
    volume: 0.42,
    minIntervalMs: 260,
  },
  duck: {
    file: "sfx-duck-slide.mp3",
    volume: 0.22,
    minIntervalMs: 260,
    stopAfterMs: 520,
  },
  wireClank: {
    file: "sfx-wire-clank.mp3",
    volume: 0.5,
    minIntervalMs: 160,
  },
  shoot: {
    file: "sfx-shoot-squirt.mp3",
    volume: 0.22,
    minIntervalMs: 120,
    stopAfterMs: 360,
  },
  canThwack: {
    file: "sfx-can-thwack.mp3",
    volume: 0.36,
    minIntervalMs: 180,
    stopAfterMs: 520,
  },
  canHit: {
    file: "sfx-can-hit-thwack.mp3",
    volume: 0.44,
    minIntervalMs: 120,
  },
  gameOver: {
    file: "sfx-gameover-buzzer.mp3",
    volume: 0.44,
    minIntervalMs: 500,
    stopAfterMs: 1300,
  },
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
  jumpProgress: 0,
  duckStartedAt: 0,
  lastLandedAt: -LANDING_SQUASH_DURATION_MS,
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
const particles = [];
const screenShake = {
  startedAt: 0,
  durationMs: 0,
  strength: 0,
};
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

function createAudioManager() {
  const supportsAudio = typeof Audio !== "undefined";
  const clips = new Map();
  const lastPlayedAt = {};
  let isUnlocked = false;

  function getClip(key) {
    const config = AUDIO_CLIPS[key];

    if (!supportsAudio || !config) {
      return null;
    }

    if (!clips.has(key)) {
      const audio = new Audio(`${AUDIO_BASE_PATH}${config.file}`);
      audio.preload = config.loop ? "auto" : "metadata";
      audio.loop = Boolean(config.loop);
      audio.volume = config.volume;
      audio.addEventListener(
        "error",
        () => {
          audio.dataset.unavailable = "true";
        },
        { once: true }
      );
      clips.set(key, audio);
    }

    return clips.get(key);
  }

  function safePlay(audio) {
    if (!audio || audio.dataset.unavailable === "true") {
      return;
    }

    try {
      const playPromise = audio.play();

      if (playPromise && typeof playPromise.catch === "function") {
        playPromise.catch(() => {});
      }
    } catch (error) {
      if (audio.dataset) {
        audio.dataset.unavailable = "true";
      }
    }
  }

  function stopAfter(audio, durationMs) {
    if (!durationMs) {
      return;
    }

    window.setTimeout(() => {
      try {
        audio.pause();
        audio.currentTime = 0;
      } catch (error) {
        // Runtime audio controls can fail on unavailable media; gameplay should keep moving.
      }
    }, durationMs);
  }

  function unlock() {
    if (!supportsAudio) {
      return;
    }

    isUnlocked = true;
  }

  function startAmbience() {
    unlock();

    const audio = getClip("fridgeHum");

    if (!audio) {
      return;
    }

    audio.volume = AUDIO_CLIPS.fridgeHum.volume;
    audio.loop = true;
    safePlay(audio);
  }

  function stopAmbience() {
    const audio = clips.get("fridgeHum");

    if (!audio) {
      return;
    }

    try {
      audio.pause();
      audio.currentTime = 0;
    } catch (error) {
      // Missing or blocked ambience should never affect the game loop.
    }
  }

  function playSfx(key, timestamp = performance.now(), options = {}) {
    const config = AUDIO_CLIPS[key];

    if (!isUnlocked || !config || config.loop) {
      return;
    }

    const minIntervalMs = config.minIntervalMs || 0;
    const lastPlayed = lastPlayedAt[key] ?? Number.NEGATIVE_INFINITY;

    if (timestamp - lastPlayed < minIntervalMs) {
      return;
    }

    const source = getClip(key);

    if (!source || source.dataset.unavailable === "true") {
      return;
    }

    lastPlayedAt[key] = timestamp;

    const audio = source.cloneNode(true);
    audio.volume = clamp(config.volume * (options.volumeMultiplier || 1), 0, 1);
    audio.loop = false;
    audio.addEventListener(
      "error",
      () => {
        source.dataset.unavailable = "true";
      },
      { once: true }
    );

    safePlay(audio);
    stopAfter(audio, options.stopAfterMs || config.stopAfterMs);
  }

  return {
    unlock,
    startAmbience,
    stopAmbience,
    playSfx,
  };
}

const audioManager = createAudioManager();

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

function getProjectileTrackBoundaryY() {
  return road.horizonY + PROJECTILE_DESPAWN_MARGIN;
}

function trimParticles() {
  if (particles.length > MAX_PARTICLES) {
    particles.splice(0, particles.length - MAX_PARTICLES);
  }
}

function addParticle(particle) {
  particles.push({
    age: 0,
    life: 360,
    gravity: PARTICLE_GRAVITY,
    shape: "dot",
    ...particle,
  });
  trimParticles();
}

function spawnKetchupDroplets(x, y, count = 7, direction = -1) {
  for (let index = 0; index < count; index += 1) {
    const spread = (Math.random() - 0.5) * 0.34;
    const speed = 0.08 + Math.random() * 0.22;

    addParticle({
      x,
      y,
      vx: spread,
      vy: direction * speed - Math.random() * 0.08,
      radius: 2 + Math.random() * 2.6,
      life: 280 + Math.random() * 180,
      gravity: 0.0016,
      color: Math.random() > 0.35 ? "#d8342a" : "#a81f1a",
      shape: "drop",
    });
  }
}

function spawnCanBurst(x, y) {
  for (let index = 0; index < 14; index += 1) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 0.11 + Math.random() * 0.28;

    addParticle({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 0.05,
      radius: 2 + Math.random() * 3,
      life: 320 + Math.random() * 180,
      gravity: 0.0009,
      color: Math.random() > 0.45 ? "#d9e1de" : "#f4d36a",
      shape: Math.random() > 0.5 ? "shard" : "puff",
      rotation: Math.random() * Math.PI,
      spin: (Math.random() - 0.5) * 0.02,
    });
  }

  spawnKetchupDroplets(x, y + 4, 5, 1);
}

function spawnBoundaryMist(projectile) {
  const boundaryY = getProjectileTrackBoundaryY();
  const x = getLaneCenterX(projectile.lane, boundaryY);

  for (let index = 0; index < PROJECTILE_DESPAWN_BURST_LIMIT; index += 1) {
    addParticle({
      x,
      y: boundaryY,
      vx: (Math.random() - 0.5) * 0.18,
      vy: 0.02 + Math.random() * 0.14,
      radius: 1.8 + Math.random() * 2.2,
      life: 220 + Math.random() * 120,
      gravity: 0.0007,
      color: index % 2 === 0 ? "#d8342a" : "#fff6df",
      shape: "drop",
    });
  }
}

function triggerShake(strength, durationMs, timestamp = performance.now()) {
  screenShake.startedAt = timestamp;
  screenShake.durationMs = durationMs;
  screenShake.strength = Math.max(screenShake.strength, strength);
}

function getScreenShakeOffset(timestamp) {
  const elapsed = timestamp - screenShake.startedAt;

  if (elapsed < 0 || elapsed >= screenShake.durationMs) {
    screenShake.strength = 0;
    return { x: 0, y: 0 };
  }

  const fade = 1 - elapsed / screenShake.durationMs;
  const intensity = screenShake.strength * fade;

  return {
    x: (Math.random() - 0.5) * intensity,
    y: (Math.random() - 0.5) * intensity,
  };
}

function resetPlayerState() {
  player.lane = STARTING_LANE;
  player.jumpStartedAt = 0;
  player.jumpProgress = 0;
  player.duckStartedAt = 0;
  player.lastLandedAt = -LANDING_SQUASH_DURATION_MS;
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
  particles.length = 0;
  threatSpawnBag.length = 0;
  screenShake.startedAt = 0;
  screenShake.durationMs = 0;
  screenShake.strength = 0;
}

function restartGame(timestamp = performance.now()) {
  resetRunState(timestamp);
  audioManager.startAmbience();

  setStartButton("Restart", false);
  startButton.blur();
}

function startGame() {
  restartGame(performance.now());
}

function triggerGameOver(cause = "general", timestamp = performance.now()) {
  if (game.state !== "playing") {
    return;
  }

  if (cause === "highObstacle") {
    audioManager.playSfx("wireClank", timestamp);
  } else if (cause === "enemy" || cause === "lowObstacle") {
    audioManager.playSfx("canThwack", timestamp);
  }

  audioManager.playSfx("gameOver", timestamp);
  audioManager.stopAmbience();
  triggerShake(7.5, 280, timestamp);

  game.finalScore = Math.floor(game.score);
  recordFinalScore(game.finalScore);
  game.state = "gameOver";
  game.nextSpawnAt = Number.POSITIVE_INFINITY;
  setStartButton("Restart", true);
}

function moveLane(direction, timestamp = performance.now()) {
  if (game.state !== "playing") {
    return;
  }

  const nextLane = clamp(player.lane + direction, 0, LANE_COUNT - 1);

  if (nextLane !== player.lane) {
    player.lane = nextLane;
    audioManager.playSfx("footstep", timestamp);
  }
}

function jump(timestamp) {
  if (game.state !== "playing" || player.isJumping) {
    return;
  }

  player.isJumping = true;
  player.jumpStartedAt = timestamp;
  player.jumpProgress = 0;
  audioManager.playSfx("jump", timestamp);
}

function duck(timestamp) {
  if (game.state !== "playing" || player.isDucking) {
    return;
  }

  player.isDucking = true;
  player.duckStartedAt = timestamp;
  audioManager.playSfx("duck", timestamp);
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
  audioManager.playSfx("shoot", timestamp);
  spawnKetchupDroplets(position.x, position.y - 52, 8, -1);
  triggerShake(1.6, 90, timestamp);
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
    player.jumpProgress = jumpProgress;
    player.yOffset = -Math.sin(jumpProgress * Math.PI) * JUMP_HEIGHT;

    if (jumpProgress >= 1) {
      player.isJumping = false;
      player.jumpProgress = 0;
      player.yOffset = 0;
      player.lastLandedAt = timestamp;

      const position = getPlayerPosition();
      spawnKetchupDroplets(position.x, PLAYER_BASE_Y + 24, 6, -1);
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
}

function cleanupProjectiles() {
  const boundaryY = getProjectileTrackBoundaryY();

  for (let index = projectiles.length - 1; index >= 0; index -= 1) {
    const projectile = projectiles[index];

    if (projectile.y <= boundaryY) {
      spawnBoundaryMist(projectile);
      projectiles.splice(index, 1);
    }
  }
}

function updateParticles(deltaTime) {
  for (let index = particles.length - 1; index >= 0; index -= 1) {
    const particle = particles[index];

    particle.age += deltaTime;
    particle.vy += particle.gravity * deltaTime;
    particle.x += particle.vx * deltaTime;
    particle.y += particle.vy * deltaTime;

    if (particle.spin) {
      particle.rotation += particle.spin * deltaTime;
    }

    if (particle.age >= particle.life) {
      particles.splice(index, 1);
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
        const hitX = getLaneCenterX(threat.lane, threat.y);
        spawnCanBurst(hitX, threat.y);
        audioManager.playSfx("canHit", timestamp);
        triggerShake(3.2, 140, timestamp);
        threats.splice(threatIndex, 1);
        projectiles.splice(projectileIndex, 1);
        game.score += ENEMY_HIT_BONUS;
        scheduleNextThreat(timestamp);
        break;
      }
    }
  }
}

function checkPlayerThreatCollision(timestamp = performance.now()) {
  threats.forEach((threat) => {
    if (game.state !== "playing" || threat.cleared || threat.lane !== player.lane || !isThreatInPlayerZone(threat)) {
      return;
    }

    if (threat.type === "enemy") {
      const hitX = getLaneCenterX(threat.lane, threat.y);
      spawnCanBurst(hitX, threat.y);
      triggerGameOver("enemy", timestamp);
      return;
    }

    if (threat.type === "lowObstacle") {
      if (isPlayerClearingLowObstacle()) {
        threat.cleared = true;
      } else {
        spawnKetchupDroplets(getLaneCenterX(threat.lane, threat.y), threat.y, 8, -1);
        triggerGameOver("lowObstacle", timestamp);
      }

      return;
    }

    if (threat.type === "highObstacle") {
      if (isPlayerClearingHighObstacle()) {
        threat.cleared = true;
      } else {
        triggerGameOver("highObstacle", timestamp);
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
  cleanupProjectiles();
  checkPlayerThreatCollision(timestamp);
}

function handleKeyDown(event) {
  const key = event.key.toLowerCase();
  audioManager.unlock();

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
    moveLane(-1, event.timeStamp);
    return;
  }

  if (key === "arrowright" || key === "d") {
    event.preventDefault();
    moveLane(1, event.timeStamp);
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

  audioManager.unlock();
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
      moveLane(deltaX > 0 ? 1 : -1, event.timeStamp);
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

function drawIceDispenser(x, y, width, height) {
  context.save();
  context.shadowColor = "rgba(20, 30, 28, 0.18)";
  context.shadowBlur = 16;
  context.shadowOffsetY = 8;

  drawRoundedRect(x, y, width, height, 14);
  context.fillStyle = "#d4e2df";
  context.fill();

  context.shadowColor = "transparent";
  drawRoundedRect(x + 13, y + 14, width - 26, height - 28, 9);
  context.fillStyle = "#879b98";
  context.fill();

  drawRoundedRect(x + 35, y + 34, width - 70, 46, 7);
  context.fillStyle = "#243432";
  context.fill();

  context.fillStyle = "#a9c3bf";
  context.fillRect(x + 48, y + 52, width - 96, 6);
  context.fillRect(x + width / 2 - 5, y + 58, 10, 32);

  context.fillStyle = "#e9f5f0";
  context.beginPath();
  context.arc(x + width / 2, y + 110, 15, 0, Math.PI * 2);
  context.fill();

  context.strokeStyle = "rgba(255, 255, 255, 0.45)";
  context.lineWidth = 2;
  context.beginPath();
  context.moveTo(x + 20, y + 22);
  context.lineTo(x + width - 24, y + 22);
  context.stroke();
  context.restore();
}

function drawStickyNote(x, y, width, height, rotation) {
  context.save();
  context.translate(x + width / 2, y + height / 2);
  context.rotate(rotation);
  context.shadowColor = "rgba(27, 34, 31, 0.2)";
  context.shadowBlur = 10;
  context.shadowOffsetY = 6;

  drawRoundedRect(-width / 2, -height / 2, width, height, 6);
  context.fillStyle = "#f4d36a";
  context.fill();

  context.shadowColor = "transparent";
  context.strokeStyle = "rgba(97, 76, 21, 0.24)";
  context.lineWidth = 2;
  context.beginPath();
  context.moveTo(-width * 0.3, -height * 0.08);
  context.lineTo(width * 0.24, -height * 0.12);
  context.moveTo(-width * 0.22, height * 0.12);
  context.lineTo(width * 0.3, height * 0.08);
  context.stroke();

  context.fillStyle = "#8f201a";
  context.font = "700 13px Arial, sans-serif";
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillText("milk?", 0, height * 0.28);
  context.restore();
}

function drawChildDrawing(x, y, width, height, rotation) {
  context.save();
  context.translate(x + width / 2, y + height / 2);
  context.rotate(rotation);
  context.shadowColor = "rgba(27, 34, 31, 0.18)";
  context.shadowBlur = 9;
  context.shadowOffsetY = 5;

  drawRoundedRect(-width / 2, -height / 2, width, height, 4);
  context.fillStyle = "#fff6df";
  context.fill();

  context.shadowColor = "transparent";
  context.strokeStyle = "#5aa7b1";
  context.lineWidth = 2;
  context.beginPath();
  context.moveTo(-width * 0.36, height * 0.22);
  context.lineTo(-width * 0.08, -height * 0.16);
  context.lineTo(width * 0.18, height * 0.22);
  context.stroke();

  context.strokeStyle = "#d8342a";
  context.beginPath();
  context.arc(width * 0.22, -height * 0.18, 12, 0, Math.PI * 2);
  context.stroke();

  context.fillStyle = "#f4d36a";
  context.beginPath();
  context.arc(-width * 0.28, -height * 0.24, 6, 0, Math.PI * 2);
  context.fill();
  context.restore();
}

function drawFridgeMagnet(x, y, width, height, label, color, rotation = 0) {
  context.save();
  context.translate(x + width / 2, y + height / 2);
  context.rotate(rotation);
  context.shadowColor = "rgba(18, 27, 25, 0.24)";
  context.shadowBlur = 10;
  context.shadowOffsetY = 5;

  drawRoundedRect(-width / 2, -height / 2, width, height, 9);
  context.fillStyle = color;
  context.fill();

  context.shadowColor = "transparent";
  context.strokeStyle = "rgba(255, 255, 255, 0.48)";
  context.lineWidth = 2;
  context.stroke();

  context.fillStyle = "#fff6df";
  context.font = "700 12px Arial, sans-serif";
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillText(label, 0, 1);
  context.restore();
}

function drawBackground(timestamp) {
  const gradient = context.createLinearGradient(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  gradient.addColorStop(0, "#f7fbf7");
  gradient.addColorStop(0.42, "#d7e3df");
  gradient.addColorStop(1, "#829995");

  context.fillStyle = gradient;
  context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  context.save();
  context.globalAlpha = 0.28;
  for (let x = -6; x < CANVAS_WIDTH; x += 14) {
    context.strokeStyle = x % 28 === 0 ? "#ffffff" : "#a3b8b4";
    context.lineWidth = 1;
    context.beginPath();
    context.moveTo(x, 0);
    context.lineTo(x + 34, CANVAS_HEIGHT);
    context.stroke();
  }
  context.restore();

  const chillLinesOffset = game.state === "playing" ? (timestamp * 0.018) % 58 : 0;
  context.strokeStyle = "rgba(255, 255, 255, 0.24)";
  context.lineWidth = 1;
  for (let y = 72 + chillLinesOffset; y < CANVAS_HEIGHT; y += 58) {
    context.beginPath();
    context.moveTo(38, y);
    context.lineTo(CANVAS_WIDTH - 46, y + 8);
    context.stroke();
  }

  context.fillStyle = "rgba(30, 55, 52, 0.14)";
  context.fillRect(198, 78, 8, 452);
  context.fillRect(CANVAS_WIDTH - 218, 78, 8, 452);

  context.strokeStyle = "rgba(36, 62, 58, 0.22)";
  context.lineWidth = 2;
  context.beginPath();
  context.moveTo(44, 80);
  context.lineTo(44, 530);
  context.moveTo(CANVAS_WIDTH - 44, 80);
  context.lineTo(CANVAS_WIDTH - 44, 530);
  context.stroke();

  drawStickyNote(72, 116, 92, 68, -0.08);
  drawChildDrawing(78, 320, 104, 88, 0.06);
  drawIceDispenser(724, 96, 148, 146);
  drawFridgeMagnet(696, 308, 132, 34, "iTryKetchup", "#d8342a", -0.04);
  drawFridgeMagnet(114, 238, 58, 28, "YUM", "#5aa7b1", 0.1);
}

function drawLanes() {
  const leftBottom = getRoadEdgeX(road.bottomY, -1);
  const rightBottom = getRoadEdgeX(road.bottomY, 1);
  const leftTop = getRoadEdgeX(road.horizonY, -1);
  const rightTop = getRoadEdgeX(road.horizonY, 1);

  context.setLineDash([]);
  context.save();
  context.beginPath();
  context.moveTo(leftTop, road.horizonY);
  context.lineTo(rightTop, road.horizonY);
  context.lineTo(rightBottom, road.bottomY);
  context.lineTo(leftBottom, road.bottomY);
  context.closePath();

  const doorGradient = context.createLinearGradient(0, road.horizonY, 0, road.bottomY);
  doorGradient.addColorStop(0, "#fbfff9");
  doorGradient.addColorStop(0.46, "#e3eee9");
  doorGradient.addColorStop(1, "#a9beb9");
  context.fillStyle = doorGradient;
  context.fill();
  context.clip();

  for (let stripe = 0; stripe <= 18; stripe += 1) {
    const progress = stripe / 18;
    const topX = leftTop + (rightTop - leftTop) * progress;
    const bottomX = leftBottom + (rightBottom - leftBottom) * progress;
    context.strokeStyle = stripe % 2 === 0 ? "rgba(255, 255, 255, 0.28)" : "rgba(92, 116, 111, 0.12)";
    context.lineWidth = stripe % 2 === 0 ? 1 : 2;
    context.beginPath();
    context.moveTo(topX, road.horizonY);
    context.lineTo(bottomX, road.bottomY);
    context.stroke();
  }

  context.strokeStyle = "rgba(93, 119, 114, 0.2)";
  context.lineWidth = 3;
  for (let y = road.horizonY + 46; y < road.bottomY; y += 74) {
    context.beginPath();
    context.moveTo(getRoadEdgeX(y, -1), y);
    context.lineTo(getRoadEdgeX(y, 1), y + 6);
    context.stroke();

    context.strokeStyle = "rgba(255, 255, 255, 0.35)";
    context.lineWidth = 1;
    context.beginPath();
    context.moveTo(getRoadEdgeX(y + 7, -1), y + 7);
    context.lineTo(getRoadEdgeX(y + 7, 1), y + 12);
    context.stroke();
    context.strokeStyle = "rgba(93, 119, 114, 0.2)";
    context.lineWidth = 3;
  }

  for (let streak = 0; streak < 18; streak += 1) {
    const y = road.horizonY + 26 + ((streak * 47) % 310);
    const leftX = getRoadEdgeX(y, -1);
    const rightX = getRoadEdgeX(y, 1);
    const progress = ((streak * 29) % 100) / 100;
    const x = leftX + (rightX - leftX) * progress;
    const length = 16 + ((streak * 11) % 34);

    context.strokeStyle = streak % 3 === 0 ? "rgba(255, 255, 255, 0.46)" : "rgba(118, 146, 140, 0.22)";
    context.lineWidth = streak % 4 === 0 ? 2 : 1;
    context.beginPath();
    context.moveTo(x, y);
    context.lineTo(x + 3, Math.min(y + length, road.bottomY));
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
      ? "rgba(216, 52, 42, 0.13)"
      : "rgba(255, 255, 255, 0.055)";
    context.fill();
  }

  context.restore();

  context.lineCap = "round";
  context.lineJoin = "round";

  context.beginPath();
  context.moveTo(leftTop, road.horizonY);
  context.lineTo(rightTop, road.horizonY);
  context.lineTo(rightBottom, road.bottomY);
  context.lineTo(leftBottom, road.bottomY);
  context.closePath();
  context.lineWidth = 6;
  context.strokeStyle = "rgba(33, 58, 54, 0.26)";
  context.stroke();

  context.beginPath();
  context.moveTo(leftTop, road.horizonY);
  context.lineTo(leftBottom, road.bottomY);
  context.strokeStyle = "#fbfff9";
  context.lineWidth = 18;
  context.stroke();

  context.beginPath();
  context.moveTo(rightTop, road.horizonY);
  context.lineTo(rightBottom, road.bottomY);
  context.strokeStyle = "#d6e2de";
  context.lineWidth = 18;
  context.stroke();

  for (let boundary = 1; boundary < LANE_COUNT; boundary += 1) {
    const topX = getLaneBoundaryX(boundary, road.horizonY);
    const bottomX = getLaneBoundaryX(boundary, road.bottomY);

    context.beginPath();
    context.moveTo(topX, road.horizonY + 2);
    context.lineTo(bottomX, road.bottomY - 2);
    context.strokeStyle = "rgba(54, 85, 79, 0.28)";
    context.lineWidth = 13;
    context.stroke();

    context.beginPath();
    context.moveTo(topX - 3, road.horizonY + 4);
    context.lineTo(bottomX - 8, road.bottomY - 4);
    context.strokeStyle = "rgba(255, 255, 255, 0.55)";
    context.lineWidth = 3;
    context.stroke();

    context.beginPath();
    context.moveTo(topX + 4, road.horizonY + 6);
    context.lineTo(bottomX + 8, road.bottomY - 2);
    context.strokeStyle = "rgba(57, 88, 82, 0.2)";
    context.lineWidth = 4;
    context.stroke();
  }

  context.beginPath();
  context.moveTo(leftTop, road.horizonY);
  context.lineTo(rightTop, road.horizonY);
  context.strokeStyle = "rgba(255, 255, 255, 0.68)";
  context.lineWidth = 9;
  context.stroke();

  context.lineCap = "butt";
  context.lineJoin = "miter";
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

function drawGroundShadow(x, y, width, height, alpha = 0.22) {
  context.save();
  context.fillStyle = `rgba(20, 28, 25, ${alpha})`;
  context.beginPath();
  context.ellipse(x, y, width / 2, height / 2, 0, 0, Math.PI * 2);
  context.fill();
  context.restore();
}

function drawParticles() {
  particles.forEach((particle) => {
    const fade = clamp(1 - particle.age / particle.life, 0, 1);
    const radius = particle.radius * (0.68 + fade * 0.32);

    context.save();
    context.globalAlpha = fade;
    context.fillStyle = particle.color;
    context.translate(particle.x, particle.y);

    if (particle.shape === "shard") {
      context.rotate(particle.rotation || 0);
      drawRoundedRect(-radius * 1.6, -radius * 0.42, radius * 3.2, radius * 0.84, 1);
      context.fill();
    } else if (particle.shape === "puff") {
      context.globalAlpha = fade * 0.44;
      context.beginPath();
      context.ellipse(0, 0, radius * 1.6, radius, 0, 0, Math.PI * 2);
      context.fill();
    } else {
      context.beginPath();
      context.ellipse(0, 0, radius * 0.82, radius * 1.18, 0, 0, Math.PI * 2);
      context.fill();
    }

    context.restore();
  });
}

function drawEnemy(threat, x, y, width, height) {
  context.save();
  context.translate(x, y);
  context.rotate(Math.sin(threat.y * 0.035) * 0.18);

  context.strokeStyle = "rgba(255, 255, 255, 0.5)";
  context.lineWidth = 2;
  context.lineCap = "round";
  context.beginPath();
  context.moveTo(-width * 0.42, -height * 0.78);
  context.lineTo(-width * 0.28, -height * 0.56);
  context.moveTo(width * 0.34, -height * 0.72);
  context.lineTo(width * 0.22, -height * 0.5);
  context.stroke();

  context.shadowColor = "rgba(0, 0, 0, 0.4)";
  context.shadowBlur = 10;
  context.shadowOffsetY = 6;
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

  context.fillStyle = "rgba(246, 212, 93, 0.22)";
  drawRoundedRect(x - width / 2 + 10, y - height / 2 - 28, width - 20, 18, 8);
  context.fill();

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

  context.fillStyle = "#f6fbf8";
  context.strokeStyle = "#8aa09c";
  context.lineWidth = 2;
  [-0.34, 0.34].forEach((offset) => {
    context.beginPath();
    context.arc(x + width * offset, top - 14, Math.max(5, width * 0.06), 0, Math.PI * 2);
    context.fill();
    context.stroke();
  });
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
    const shadowAlpha = threat.cleared ? 0.08 : 0.2;

    drawGroundShadow(x + width * 0.08, threat.y + height * 0.5 + 8, width * 0.9, Math.max(10, height * 0.16), shadowAlpha);

    if (threat.type === "enemy") {
      drawEnemy(threat, x, threat.y, width, height);
    } else if (threat.type === "lowObstacle") {
      drawLowObstacle(threat, x, threat.y, width, height);
    } else {
      drawHighObstacle(threat, x, threat.y, width, height);
    }
  });
}

function drawPlayer(timestamp = performance.now()) {
  const position = getPlayerPosition();
  const width = PLAYER_WIDTH + player.duckScale * 16;
  const height = PLAYER_HEIGHT - (PLAYER_HEIGHT - DUCK_HEIGHT) * player.duckScale;
  const step = game.state === "playing" ? Math.sin(game.runTimeMs / 95) : 0;
  const lean = player.isJumping ? -0.16 : player.isDucking ? 0.08 : step * 0.05;
  const jumpStretch = player.isJumping ? Math.sin(player.jumpProgress * Math.PI) : 0;
  const landingSquash = clamp(1 - (timestamp - player.lastLandedAt) / LANDING_SQUASH_DURATION_MS, 0, 1);
  const visualScaleX = 1 - jumpStretch * 0.08 + landingSquash * 0.16 + player.duckScale * 0.12;
  const visualScaleY = 1 + jumpStretch * 0.14 - landingSquash * 0.12 - player.duckScale * 0.08;
  const airAmount = clamp(-player.yOffset / JUMP_HEIGHT, 0, 1);
  const bodyWidth = width * 0.62;
  const bodyHeight = height * 0.72;
  const neckWidth = bodyWidth * 0.46;
  const capWidth = bodyWidth * 0.58;
  const bodyTop = -height / 2 + height * 0.23;
  const bodyLeft = -bodyWidth / 2;

  drawGroundShadow(
    position.x + 5,
    PLAYER_BASE_Y + 50,
    width * (0.82 - airAmount * 0.28),
    Math.max(8, 18 * (1 - airAmount * 0.52)),
    0.24 * (1 - airAmount * 0.36)
  );

  context.save();
  context.translate(position.x, position.y);
  context.scale(visualScaleX, visualScaleY);
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

  updateParticles(deltaTime);

  drawBackground(timestamp);
  const shakeOffset = getScreenShakeOffset(timestamp);
  context.save();
  context.translate(shakeOffset.x, shakeOffset.y);
  drawLanes();
  drawThreats();
  drawProjectiles();
  drawParticles();
  drawPlayer(timestamp);
  context.restore();
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
  audioManager.unlock();

  if (game.state === "ready" || game.state === "gameOver") {
    startGame();
  }
});
leaderboardEntries = loadLeaderboard();
requestAnimationFrame(gameLoop);
