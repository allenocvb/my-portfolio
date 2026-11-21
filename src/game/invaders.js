// Canvas Space Invaders where you play as the site's invader.
// Everything runs in one requestAnimationFrame loop with no React re-renders,
// sprites are pre-rendered once per resize, and no objects are allocated per frame
// for particles. Units below are "field units" in a fixed 420×640 playfield that
// gets scaled to fit the screen.

export const FIELD_W = 420;
export const FIELD_H = 640;

const HUD_H = 34;
const GROUND_Y = FIELD_H - 24;
const PX = 3;
const PLAYER_PX = 3.4;
const PLAYER_W = 11 * PLAYER_PX;
const PLAYER_H = 8 * PLAYER_PX;
const PLAYER_Y = GROUND_Y - PLAYER_H - 8;
const PLAYER_SPEED = 240;
const COLS = 8;
const ROWS = 5;
const COL_STEP = 42;
const ROW_STEP = 34;
const ENEMY_W = 11 * PX;
const BULLET_SPEED = 580;
const FIRE_COOLDOWN = 0.3;
const MAX_BULLETS = 2;
const EXTRA_LIFE_EVERY = 2000;
const MAX_LIVES = 5;
const CELL = 4;

// White and purple only.
const COLORS = {
  bg: "#06040a",
  white: "#f7f4fb",
  purple: "#c49ae9",
  violet: "#9b6fd6",
  lilac: "#e4cffa",
  deep: "#7b4ea2",
  dim: "#9a8fab",
};

// The site's invader (public/assets/spaceinvaderalien.png), as a pixel grid.
const PLAYER_ART = [
  "..#.....#..",
  "...#...#...",
  "..#######..",
  ".##.###.##.",
  "###########",
  "#.#######.#",
  "#.#.....#.#",
  "...##.##...",
];

// Original enemy designs: the invader is defending itself from old media.
const ENEMY_ART = {
  ghost: [
    ["...#####...", ".#########.", "##..###..##", "###########", "###########", "#.#.#.#.#.#"],
    ["...#####...", ".#########.", "##..###..##", "###########", "###########", ".#.#.#.#.#."],
  ],
  drone: [
    ["....###....", "..#######..", ".##.#.#.##.", "###########", "..#.....#..", ".#.#...#.#.", "#.........#"],
    ["....###....", "..#######..", ".#.##.##.#.", "###########", "..#.....#..", "..#.#.#.#..", "...#...#..."],
  ],
  tape: [
    ["###########", "#.........#", "#.###.###.#", "#.#.#.#.#.#", "#.###.###.#", "#.........#", "##.#####.##"],
    ["###########", "#.........#", "#..#...#..#", "#.###.###.#", "#..#...#..#", "#.........#", "##.#####.##"],
  ],
  ufo: [
    ["....#####....", "..#########..", ".##.##.##.##.", "#############", "..###...###..", "...#.....#..."],
    ["....#####....", "..#########..", ".#.##.##.##.#", "#############", "..###...###..", "..#.......#.."],
  ],
};

const ROW_TYPES = ["ghost", "drone", "drone", "tape", "tape"];
const ENEMY_INFO = {
  ghost: { color: COLORS.purple, points: 30 },
  drone: { color: COLORS.white, points: 20 },
  tape: { color: COLORS.violet, points: 10 },
};
const UFO_POINTS = [50, 100, 150, 300];

const BUNKER_ART = [
  "...######...",
  "..########..",
  ".##########.",
  "############",
  "############",
  "############",
  "####....####",
  "###......###",
];
const BUNKER_COLS = BUNKER_ART[0].length;
const BUNKER_ROWS = BUNKER_ART.length;
const BUNKER_W = BUNKER_COLS * CELL;
const BUNKER_H = BUNKER_ROWS * CELL;
const BUNKER_Y = PLAYER_Y - 60;

const rand = (min, max) => min + Math.random() * (max - min);
const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
const overlaps = (ax, ay, aw, ah, bx, by, bw, bh) => ax < bx + bw && ax + aw > bx && ay < by + bh && ay + ah > by;

function makeCanvas(width, height) {
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.ceil(width));
  canvas.height = Math.max(1, Math.ceil(height));
  return canvas;
}

// Bakes the glow and a subtle VHS red/cyan split into an offscreen sprite once,
// so drawing it each frame is a single drawImage call.
function buildSprite(rows, px, color, k, glow = 6) {
  const pad = 4;
  const w = rows[0].length * px;
  const h = rows.length * px;
  const canvas = makeCanvas((w + pad * 2) * k, (h + pad * 2) * k);
  const g = canvas.getContext("2d");
  g.scale(k, k);
  const paint = (dx, fill, alpha, blur) => {
    g.globalAlpha = alpha;
    g.fillStyle = fill;
    g.shadowColor = fill;
    g.shadowBlur = blur * k;
    rows.forEach((row, y) => {
      for (let x = 0; x < row.length; x++) {
        if (row[x] === "#") g.fillRect(pad + dx + x * px, pad + y * px, px, px);
      }
    });
  };
  g.globalCompositeOperation = "lighter";
  paint(-0.9, COLORS.deep, 0.55, 0);
  paint(0.9, COLORS.lilac, 0.3, 0);
  g.globalCompositeOperation = "source-over";
  paint(0, color, 1, glow);
  return { canvas, pad, w, h, k };
}

function drawSprite(ctx, sprite, x, y) {
  const { canvas, pad, k } = sprite;
  ctx.drawImage(canvas, x - pad, y - pad, canvas.width / k, canvas.height / k);
}

export function createInvaders({ canvas, surface, sfx, reducedMotion = false, controlsHint = "", onGameOver, onPauseRequest }) {
  const ctx = canvas.getContext("2d", { alpha: false });
  let k = 1;
  let scale = 1;
  let sprites = null;
  let raf = 0;
  let last = 0;
  let paused = false;
  let destroyed = false;
  let time = 0;

  // Game state.
  let mode = "attract"; // attract | play | over
  let score = 0;
  let highScore = 0;
  let lives = 3;
  let wave = 1;
  let nextLifeAt = EXTRA_LIFE_EVERY;
  let playTime = 0;
  let readyT = 0;
  let respawnT = 0;
  let invulnT = 0;
  let waveT = 0;
  let overT = 0;
  let shakeT = 0;
  let cooldown = 0;
  let enemyFireT = 0;
  let ufoT = 0;
  let animT = 0;
  let animFrame = 0;
  let reportedOver = false;

  const player = { x: FIELD_W / 2, visible: true };
  const bullets = [];
  const bombs = [];
  const popups = [];
  const enemies = [];
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) enemies.push({ row, col, type: ROW_TYPES[row], alive: true });
  }
  const formation = { x: 0, y: 0, dir: 1, alive: 0, total: COLS * ROWS };
  const ufo = { active: false, x: 0, dir: 1, points: 0 };
  const particles = Array.from({ length: 220 }, () => ({ life: 0, x: 0, y: 0, vx: 0, vy: 0, max: 1, color: "#fff" }));
  const stars = Array.from({ length: 70 }, () => ({ x: rand(0, FIELD_W), y: rand(0, FIELD_H), speed: rand(6, 40), size: Math.random() < 0.15 ? 2 : 1 }));
  const bunkers = [0, 1, 2, 3].map((i) => ({
    x: Math.round((FIELD_W * (i + 1)) / 5 - BUNKER_W / 2),
    y: BUNKER_Y,
    cells: new Uint8Array(BUNKER_COLS * BUNKER_ROWS),
    canvas: null,
    dirty: true,
  }));

  // Input.
  const keys = { left: false, right: false, fire: false };
  const touch = { id: null, startX: 0, shipX: 0, firing: false };

  const enemyH = (type) => ENEMY_ART[type][0].length * PX;
  const enemyX = (enemy) => formation.x + enemy.col * COL_STEP;
  const enemyY = (enemy) => formation.y + enemy.row * ROW_STEP;

  function resetBunkers() {
    for (const bunker of bunkers) {
      BUNKER_ART.forEach((row, y) => {
        for (let x = 0; x < BUNKER_COLS; x++) bunker.cells[y * BUNKER_COLS + x] = row[x] === "#" ? 1 : 0;
      });
      bunker.dirty = true;
    }
  }

  function resetFormation() {
    for (const enemy of enemies) enemy.alive = true;
    formation.alive = formation.total;
    formation.dir = 1;
    formation.x = Math.round((FIELD_W - ((COLS - 1) * COL_STEP + ENEMY_W)) / 2);
    formation.y = HUD_H + 40 + Math.min(wave - 1, 6) * 12;
    bombs.length = 0;
    bullets.length = 0;
    ufo.active = false;
    ufoT = rand(14, 22);
    enemyFireT = 1.2;
  }

  function resetGame() {
    score = 0;
    lives = 3;
    wave = 1;
    nextLifeAt = EXTRA_LIFE_EVERY;
    playTime = 0;
    player.x = FIELD_W / 2;
    player.visible = true;
    respawnT = invulnT = waveT = overT = shakeT = cooldown = 0;
    readyT = 1.8;
    popups.length = 0;
    for (const particle of particles) particle.life = 0;
    reportedOver = false;
    resetFormation();
    resetBunkers();
  }

  function burst(x, y, color, count, speed = 120) {
    const n = reducedMotion ? Math.ceil(count / 2) : count;
    let spawned = 0;
    for (const particle of particles) {
      if (particle.life > 0) continue;
      const angle = Math.random() * Math.PI * 2;
      const velocity = rand(speed * 0.25, speed);
      particle.x = x;
      particle.y = y;
      particle.vx = Math.cos(angle) * velocity;
      particle.vy = Math.sin(angle) * velocity;
      particle.max = particle.life = rand(0.35, 0.8);
      particle.color = color;
      if (++spawned >= n) break;
    }
  }

  function addScore(points, x, y) {
    score += points;
    if (x != null) popups.push({ x, y, text: String(points), life: 0.9 });
    if (score >= nextLifeAt) {
      nextLifeAt += EXTRA_LIFE_EVERY;
      if (lives < MAX_LIVES) {
        lives += 1;
        popups.push({ x: player.x, y: PLAYER_Y - 16, text: "1UP", life: 1.2 });
        sfx?.bonus();
      }
    }
  }

  // Erodes bunker cells around an impact. Returns true if the projectile hit something.
  function hitBunker(x, y, w, h, radius) {
    for (const bunker of bunkers) {
      if (!overlaps(x, y, w, h, bunker.x, bunker.y, BUNKER_W, BUNKER_H)) continue;
      const c0 = clamp(Math.floor((x - bunker.x) / CELL), 0, BUNKER_COLS - 1);
      const c1 = clamp(Math.floor((x + w - bunker.x) / CELL), 0, BUNKER_COLS - 1);
      const r0 = clamp(Math.floor((y - bunker.y) / CELL), 0, BUNKER_ROWS - 1);
      const r1 = clamp(Math.floor((y + h - bunker.y) / CELL), 0, BUNKER_ROWS - 1);
      for (let r = r0; r <= r1; r++) {
        for (let c = c0; c <= c1; c++) {
          if (!bunker.cells[r * BUNKER_COLS + c]) continue;
          for (let dy = -radius; dy <= radius; dy++) {
            for (let dx = -radius; dx <= radius; dx++) {
              const rr = r + dy;
              const cc = c + dx;
              if (rr < 0 || cc < 0 || rr >= BUNKER_ROWS || cc >= BUNKER_COLS) continue;
              if (dx * dx + dy * dy <= radius * radius && (dx === 0 && dy === 0 || Math.random() < 0.6)) {
                bunker.cells[rr * BUNKER_COLS + cc] = 0;
              }
            }
          }
          bunker.dirty = true;
          return true;
        }
      }
    }
    return false;
  }

  function killPlayer() {
    lives -= 1;
    burst(player.x, PLAYER_Y + PLAYER_H / 2, COLORS.white, 40, 170);
    burst(player.x, PLAYER_Y + PLAYER_H / 2, COLORS.purple, 20, 110);
    shakeT = reducedMotion ? 0 : 0.35;
    player.visible = false;
    bombs.length = 0;
    sfx?.hurt();
    if (lives <= 0) {
      lives = 0;
      mode = "over";
      overT = 1.2;
    } else {
      respawnT = 1;
    }
  }

  function updateFormation(dt, canFire) {
    let minCol = COLS;
    let maxCol = -1;
    let bottom = 0;
    for (const enemy of enemies) {
      if (!enemy.alive) continue;
      if (enemy.col < minCol) minCol = enemy.col;
      if (enemy.col > maxCol) maxCol = enemy.col;
      bottom = Math.max(bottom, enemyY(enemy) + enemyH(enemy.type));
    }
    if (maxCol < 0) return;

    const base = 20 + Math.min(wave - 1, 8) * 5;
    const thinned = 1 - formation.alive / formation.total;
    const speed = Math.min(190, base * (1 + 3.2 * thinned ** 1.7));
    animT += dt;
    const animEvery = clamp(0.5 * (base / speed), 0.08, 0.5);
    if (animT >= animEvery) {
      animT = 0;
      animFrame ^= 1;
    }

    const dx = speed * formation.dir * dt;
    const left = formation.x + minCol * COL_STEP + dx;
    const right = formation.x + maxCol * COL_STEP + ENEMY_W + dx;
    if (right > FIELD_W - 8 || left < 8) {
      formation.dir *= -1;
      if (mode === "play") formation.y += 12;
    } else {
      formation.x += dx;
    }

    if (mode !== "play") return;

    // Enemies chew through bunkers they march into.
    for (const enemy of enemies) {
      if (!enemy.alive) continue;
      const ey = enemyY(enemy);
      if (ey + enemyH(enemy.type) >= BUNKER_Y) hitBunker(enemyX(enemy), ey, ENEMY_W, enemyH(enemy.type), 0);
    }
    if (bottom >= PLAYER_Y + 4) {
      // Invaded: game over regardless of lives left.
      lives = 1;
      killPlayer();
      return;
    }

    if (!canFire) return;
    enemyFireT -= dt;
    const maxBombs = Math.min(3 + wave, 9);
    if (enemyFireT <= 0 && bombs.length < maxBombs) {
      enemyFireT = Math.max(0.3, 1.1 - (wave - 1) * 0.08) * rand(0.5, 1.4);
      // Lowest enemy in a column: sometimes the column above the player, otherwise random.
      let column = -1;
      if (Math.random() < 0.4) column = clamp(Math.floor((player.x - formation.x) / COL_STEP), minCol, maxCol);
      let shooter = null;
      for (let attempt = 0; attempt < 8 && !shooter; attempt++) {
        const col = column >= 0 && attempt === 0 ? column : Math.floor(rand(minCol, maxCol + 1));
        for (let row = ROWS - 1; row >= 0; row--) {
          const enemy = enemies[row * COLS + col];
          if (enemy?.alive) { shooter = enemy; break; }
        }
      }
      if (shooter) {
        bombs.push({
          x: enemyX(shooter) + ENEMY_W / 2 - 1.5,
          y: enemyY(shooter) + enemyH(shooter.type),
          vy: Math.min(320, 170 + wave * 14) * rand(0.9, 1.15),
          phase: Math.random() * 10,
        });
      }
    }
  }

  function update(dt) {
    time += dt;
    for (const star of stars) {
      star.y += star.speed * dt * (reducedMotion ? 0.2 : 1);
      if (star.y > FIELD_H) { star.y = 0; star.x = rand(0, FIELD_W); }
    }
    for (const particle of particles) {
      if (particle.life <= 0) continue;
      particle.life -= dt;
      particle.x += particle.vx * dt;
      particle.y += particle.vy * dt;
      particle.vx *= 0.96;
      particle.vy *= 0.96;
    }
    for (let i = popups.length - 1; i >= 0; i--) {
      popups[i].life -= dt;
      popups[i].y -= 18 * dt;
      if (popups[i].life <= 0) popups.splice(i, 1);
    }
    if (shakeT > 0) shakeT -= dt;

    if (mode === "attract") {
      updateFormation(dt, false);
      return;
    }
    if (mode === "over") {
      updateFormation(dt, false);
      for (const bomb of bombs) bomb.y += bomb.vy * dt;
      if (overT > 0) {
        overT -= dt;
        if (overT <= 0 && !reportedOver) {
          reportedOver = true;
          sfx?.over();
          onGameOver?.({ score, wave, duration: playTime });
        }
      }
      return;
    }

    playTime += dt;

    // Player movement: keyboard, or relative touch drag.
    if (player.visible) {
      const direction = (keys.right ? 1 : 0) - (keys.left ? 1 : 0);
      player.x += direction * PLAYER_SPEED * dt;
      player.x = clamp(player.x, PLAYER_W / 2 + 6, FIELD_W - PLAYER_W / 2 - 6);
    }

    if (readyT > 0) {
      readyT -= dt;
      updateFormation(dt * 0.4, false);
      return;
    }

    if (waveT > 0) {
      waveT -= dt;
      if (waveT <= 0) resetFormation();
      return;
    }

    if (respawnT > 0) {
      respawnT -= dt;
      if (respawnT <= 0) {
        player.visible = true;
        invulnT = 1.6;
      }
    }
    if (invulnT > 0) invulnT -= dt;

    // Firing.
    cooldown -= dt;
    if (player.visible && (keys.fire || touch.firing) && cooldown <= 0 && bullets.length < MAX_BULLETS) {
      bullets.push({ x: player.x - 1.25, y: PLAYER_Y - 10 });
      cooldown = FIRE_COOLDOWN;
      sfx?.shoot();
    }

    updateFormation(dt, player.visible);
    if (mode !== "play") return;

    // UFO.
    if (!ufo.active) {
      ufoT -= dt;
      if (ufoT <= 0 && formation.alive > 6) {
        ufo.active = true;
        ufo.dir = Math.random() < 0.5 ? 1 : -1;
        ufo.x = ufo.dir > 0 ? -40 : FIELD_W + 40;
        ufo.points = UFO_POINTS[Math.floor(Math.random() * UFO_POINTS.length)];
        sfx?.ufo();
      }
    } else {
      ufo.x += ufo.dir * 85 * dt;
      if (ufo.x < -50 || ufo.x > FIELD_W + 50) {
        ufo.active = false;
        ufoT = rand(16, 26);
      }
    }

    // Player bullets.
    for (let i = bullets.length - 1; i >= 0; i--) {
      const bullet = bullets[i];
      bullet.y -= BULLET_SPEED * dt;
      let hit = bullet.y < HUD_H;
      if (!hit && hitBunker(bullet.x, bullet.y, 2.5, 12, 1)) hit = true;
      if (!hit && ufo.active && overlaps(bullet.x, bullet.y, 2.5, 12, ufo.x - 19.5, HUD_H + 8, 39, 18)) {
        hit = true;
        ufo.active = false;
        ufoT = rand(16, 26);
        addScore(ufo.points, ufo.x, HUD_H + 14);
        burst(ufo.x, HUD_H + 17, COLORS.lilac, 30, 150);
        sfx?.bonus();
      }
      if (!hit) {
        for (const enemy of enemies) {
          if (!enemy.alive) continue;
          const ex = enemyX(enemy);
          const ey = enemyY(enemy);
          if (overlaps(bullet.x, bullet.y, 2.5, 12, ex, ey, ENEMY_W, enemyH(enemy.type))) {
            enemy.alive = false;
            formation.alive -= 1;
            hit = true;
            const info = ENEMY_INFO[enemy.type];
            addScore(info.points);
            burst(ex + ENEMY_W / 2, ey + enemyH(enemy.type) / 2, info.color, 16);
            sfx?.hit();
            break;
          }
        }
      }
      if (!hit) {
        for (let j = bombs.length - 1; j >= 0; j--) {
          const bomb = bombs[j];
          if (overlaps(bullet.x - 2, bullet.y, 6.5, 12, bomb.x - 1, bomb.y, 5, 10)) {
            bombs.splice(j, 1);
            burst(bomb.x, bomb.y + 5, COLORS.white, 6, 70);
            hit = true;
            break;
          }
        }
      }
      if (hit) bullets.splice(i, 1);
    }

    // Enemy bombs.
    for (let i = bombs.length - 1; i >= 0; i--) {
      const bomb = bombs[i];
      bomb.y += bomb.vy * dt;
      let gone = bomb.y > GROUND_Y - 10;
      if (gone) burst(bomb.x + 1.5, GROUND_Y - 2, COLORS.lilac, 5, 50);
      if (!gone && hitBunker(bomb.x, bomb.y, 3, 10, 2)) gone = true;
      if (!gone && player.visible && invulnT <= 0) {
        // A slightly forgiving hitbox feels fairer, especially on touch.
        const hw = PLAYER_W * 0.36;
        if (overlaps(bomb.x, bomb.y, 3, 10, player.x - hw, PLAYER_Y + 4, hw * 2, PLAYER_H - 6)) {
          bombs.splice(i, 1);
          killPlayer();
          return;
        }
      }
      if (gone) bombs.splice(i, 1);
    }

    if (formation.alive <= 0 && waveT <= 0) {
      wave += 1;
      waveT = 1.6;
      bombs.length = 0;
      bullets.length = 0;
      resetBunkers();
      sfx?.wave();
    }
  }

  function bunkerCanvas(bunker) {
    if (!bunker.canvas || bunker.dirty) {
      if (!bunker.canvas) bunker.canvas = makeCanvas(BUNKER_W * k, BUNKER_H * k);
      const g = bunker.canvas.getContext("2d");
      g.setTransform(k, 0, 0, k, 0, 0);
      g.clearRect(0, 0, BUNKER_W, BUNKER_H);
      g.fillStyle = COLORS.deep;
      for (let r = 0; r < BUNKER_ROWS; r++) {
        for (let c = 0; c < BUNKER_COLS; c++) {
          if (bunker.cells[r * BUNKER_COLS + c]) g.fillRect(c * CELL, r * CELL, CELL, CELL);
        }
      }
      bunker.dirty = false;
    }
    return bunker.canvas;
  }

  const pad = (value, length) => String(value).padStart(length, "0");

  function render() {
    if (!sprites) return;
    let sx = 0;
    let sy = 0;
    if (shakeT > 0) {
      sx = rand(-3, 3) * shakeT * 3;
      sy = rand(-3, 3) * shakeT * 3;
    }
    ctx.setTransform(k, 0, 0, k, 0, 0);
    ctx.fillStyle = COLORS.bg;
    ctx.fillRect(0, 0, FIELD_W, FIELD_H);
    ctx.setTransform(k, 0, 0, k, sx * k, sy * k);

    ctx.fillStyle = COLORS.white;
    for (const star of stars) {
      ctx.globalAlpha = 0.15 + star.speed / 60;
      ctx.fillRect(star.x, star.y, star.size, star.size);
    }
    ctx.globalAlpha = 1;

    // Ground.
    ctx.fillStyle = COLORS.purple;
    ctx.globalAlpha = 0.6;
    ctx.fillRect(0, GROUND_Y, FIELD_W, 1.5);
    ctx.globalAlpha = 1;

    for (const bunker of bunkers) {
      ctx.drawImage(bunkerCanvas(bunker), bunker.x, bunker.y, BUNKER_W, BUNKER_H);
    }

    const showEnemies = !(waveT > 0 && formation.alive <= 0);
    if (showEnemies) {
      for (const enemy of enemies) {
        if (!enemy.alive) continue;
        drawSprite(ctx, sprites[enemy.type][animFrame], enemyX(enemy), enemyY(enemy));
      }
    }

    if (ufo.active) drawSprite(ctx, sprites.ufo[Math.floor(time * 6) % 2], ufo.x - 19.5, HUD_H + 8);

    // Player, with the same gentle bob as the GIF on the eject screen.
    const blinking = invulnT > 0 && Math.floor(time * 14) % 2 === 0;
    if (player.visible && mode !== "over" && !blinking) {
      const bob = reducedMotion ? 0 : Math.round(Math.sin(time * 5) * 1.5);
      drawSprite(ctx, sprites.player, player.x - PLAYER_W / 2, PLAYER_Y + bob);
    }

    ctx.fillStyle = COLORS.white;
    for (const bullet of bullets) {
      ctx.globalAlpha = 0.3;
      ctx.fillRect(bullet.x, bullet.y + 8, 2.5, 12);
      ctx.globalAlpha = 1;
      ctx.fillRect(bullet.x, bullet.y, 2.5, 12);
    }

    ctx.fillStyle = COLORS.lilac;
    for (const bomb of bombs) {
      const zig = Math.floor((time * 20 + bomb.phase) % 2) ? 1.5 : -1.5;
      ctx.fillRect(bomb.x + zig, bomb.y, 3, 3.5);
      ctx.fillRect(bomb.x - zig, bomb.y + 3.5, 3, 3.5);
      ctx.fillRect(bomb.x + zig, bomb.y + 7, 3, 3);
    }

    for (const particle of particles) {
      if (particle.life <= 0) continue;
      ctx.globalAlpha = particle.life / particle.max;
      ctx.fillStyle = particle.color;
      ctx.fillRect(particle.x - 1, particle.y - 1, 2.5, 2.5);
    }
    ctx.globalAlpha = 1;

    // HUD.
    ctx.setTransform(k, 0, 0, k, 0, 0);
    ctx.font = "14px VCR, ui-monospace, monospace";
    ctx.textBaseline = "middle";
    ctx.fillStyle = COLORS.white;
    ctx.textAlign = "left";
    ctx.fillText(`SCORE ${pad(score, 6)}`, 10, HUD_H / 2);
    ctx.textAlign = "center";
    ctx.fillStyle = COLORS.dim;
    ctx.fillText(`HI ${pad(Math.max(highScore, score), 6)}`, FIELD_W / 2 + 10, HUD_H / 2);
    ctx.textAlign = "right";
    for (let i = 0; i < Math.min(lives, MAX_LIVES); i++) {
      drawSprite(ctx, sprites.life, FIELD_W - 12 - (i + 1) * 20, HUD_H / 2 - 6);
    }
    ctx.fillStyle = COLORS.purple;
    ctx.globalAlpha = 0.35;
    ctx.fillRect(0, HUD_H, FIELD_W, 1);
    ctx.globalAlpha = 1;

    ctx.fillStyle = COLORS.lilac;
    ctx.textAlign = "center";
    ctx.font = "12px VCR, ui-monospace, monospace";
    for (const popup of popups) {
      ctx.globalAlpha = clamp(popup.life * 2, 0, 1);
      ctx.fillText(popup.text, popup.x, popup.y);
    }
    ctx.globalAlpha = 1;

    let banner = "";
    if (mode === "play" && readyT > 0) banner = wave === 1 ? "GET READY" : `WAVE ${wave}`;
    if (mode === "play" && waveT > 0) banner = `WAVE ${wave}`;
    if (mode === "over" && overT > 0) banner = "GAME OVER";
    if (banner) {
      ctx.textAlign = "center";
      ctx.font = "24px VCR, ui-monospace, monospace";
      ctx.fillStyle = COLORS.deep;
      ctx.globalAlpha = 0.8;
      ctx.fillText(banner, FIELD_W / 2 - 1.5, FIELD_H / 2 + 20);
      ctx.fillStyle = COLORS.purple;
      ctx.fillText(banner, FIELD_W / 2 + 1.5, FIELD_H / 2 + 20);
      ctx.globalAlpha = 1;
      ctx.fillStyle = COLORS.white;
      ctx.fillText(banner, FIELD_W / 2, FIELD_H / 2 + 20);
      if (controlsHint && mode === "play" && readyT > 0 && wave === 1) {
        ctx.font = "12px VCR, ui-monospace, monospace";
        ctx.fillStyle = COLORS.dim;
        ctx.fillText(controlsHint, FIELD_W / 2, FIELD_H / 2 + 50);
      }
    }
  }

  function frame(now) {
    if (destroyed || paused) return;
    raf = requestAnimationFrame(frame);
    let dt = Math.min(0.1, (now - last) / 1000 || 0);
    last = now;
    // Variable timestep in small slices: smooth on 60/120/144 Hz displays, no tunnelling.
    while (dt > 0) {
      const step = Math.min(dt, 1 / 90);
      update(step);
      dt -= step;
    }
    render();
  }

  function loop() {
    cancelAnimationFrame(raf);
    last = performance.now();
    raf = requestAnimationFrame(frame);
  }

  // Keyboard.
  const KEYMAP = {
    a: "left", arrowleft: "left",
    d: "right", arrowright: "right",
    " ": "fire", spacebar: "fire", w: "fire", arrowup: "fire",
  };
  const onKey = (down) => (event) => {
    const key = event.key.toLowerCase();
    if (mode !== "play" || paused) return;
    if (down && (key === "escape" || key === "p")) {
      event.preventDefault();
      onPauseRequest?.();
      return;
    }
    const action = KEYMAP[key];
    if (!action || event.metaKey || event.ctrlKey || event.altKey) return;
    event.preventDefault();
    keys[action] = down;
  };
  const onKeyDown = onKey(true);
  const onKeyUp = onKey(false);
  const clearKeys = () => { keys.left = keys.right = keys.fire = false; touch.firing = false; touch.id = null; };

  // Touch / pointer: drag anywhere to move (relative, so your thumb never hides the ship) and hold to fire.
  const onPointerDown = (event) => {
    if (mode !== "play" || paused || touch.id !== null) return;
    if (event.target.closest?.("button, a, [data-no-drag]")) return;
    if (event.pointerType === "mouse" && event.button !== 0) return;
    touch.id = event.pointerId;
    touch.startX = event.clientX;
    touch.shipX = player.x;
    touch.firing = true;
    try { surface.setPointerCapture?.(event.pointerId); } catch { /* capture is a nice-to-have */ }
    sfx?.unlock();
  };
  const onPointerMove = (event) => {
    if (event.pointerId !== touch.id) return;
    const sensitivity = event.pointerType === "touch" ? 1.35 : 1;
    player.x = clamp(touch.shipX + ((event.clientX - touch.startX) / scale) * sensitivity, PLAYER_W / 2 + 6, FIELD_W - PLAYER_W / 2 - 6);
  };
  const onPointerUp = (event) => {
    if (event.pointerId !== touch.id) return;
    touch.id = null;
    touch.firing = false;
  };
  const onBlur = () => {
    clearKeys();
    if (mode === "play" && !paused) onPauseRequest?.();
  };
  const onVisibility = () => { if (document.hidden) onBlur(); };

  window.addEventListener("keydown", onKeyDown);
  window.addEventListener("keyup", onKeyUp);
  window.addEventListener("blur", onBlur);
  document.addEventListener("visibilitychange", onVisibility);
  surface.addEventListener("pointerdown", onPointerDown);
  surface.addEventListener("pointermove", onPointerMove);
  surface.addEventListener("pointerup", onPointerUp);
  surface.addEventListener("pointercancel", onPointerUp);

  resetFormation();
  resetBunkers();
  loop();

  return {
    resize(availableWidth, availableHeight) {
      scale = Math.max(0.3, Math.min(availableWidth / FIELD_W, availableHeight / FIELD_H));
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      k = scale * dpr;
      const cssW = Math.floor(FIELD_W * scale);
      const cssH = Math.floor(FIELD_H * scale);
      canvas.style.width = `${cssW}px`;
      canvas.style.height = `${cssH}px`;
      canvas.width = Math.round(cssW * dpr);
      canvas.height = Math.round(cssH * dpr);
      k = canvas.width / FIELD_W;
      ctx.imageSmoothingEnabled = false;
      sprites = {
        player: buildSprite(PLAYER_ART, PLAYER_PX, COLORS.white, k, 8),
        life: buildSprite(PLAYER_ART, 1.5, COLORS.white, k, 0),
        ufo: ENEMY_ART.ufo.map((art) => buildSprite(art, PX, COLORS.lilac, k, 10)),
      };
      for (const type of Object.keys(ENEMY_INFO)) {
        sprites[type] = ENEMY_ART[type].map((art) => buildSprite(art, PX, ENEMY_INFO[type].color, k));
      }
      for (const bunker of bunkers) bunker.canvas = null;
      render();
      return { width: cssW, height: cssH };
    },
    start() {
      sfx?.unlock();
      clearKeys();
      resetGame();
      mode = "play";
      paused = false;
      loop();
    },
    pause() {
      if (paused) return;
      paused = true;
      clearKeys();
      cancelAnimationFrame(raf);
    },
    resume() {
      if (!paused) return;
      paused = false;
      loop();
    },
    redraw: render,
    setHighScore(value) { highScore = Math.max(highScore, Number(value) || 0); },
    get mode() { return mode; },
    destroy() {
      destroyed = true;
      cancelAnimationFrame(raf);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("blur", onBlur);
      document.removeEventListener("visibilitychange", onVisibility);
      surface.removeEventListener("pointerdown", onPointerDown);
      surface.removeEventListener("pointermove", onPointerMove);
      surface.removeEventListener("pointerup", onPointerUp);
      surface.removeEventListener("pointercancel", onPointerUp);
    },
  };
}
