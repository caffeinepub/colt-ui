import React, { useEffect, useRef, useState, useCallback } from 'react';

const W = 480;
const H = 520;

type GameState = 'idle' | 'playing' | 'dead';

interface Vec2 { x: number; y: number; }

interface Ship {
  pos: Vec2; vel: Vec2; angle: number; thrusting: boolean;
}

interface Asteroid {
  pos: Vec2; vel: Vec2; radius: number; angle: number; rotSpeed: number; vertices: Vec2[];
}

interface Bullet {
  pos: Vec2; vel: Vec2; life: number;
}

function makeAsteroidVertices(radius: number): Vec2[] {
  const count = 8 + Math.floor(Math.random() * 5);
  return Array.from({ length: count }, (_, i) => {
    const angle = (i / count) * Math.PI * 2;
    const r = radius * (0.7 + Math.random() * 0.5);
    return { x: Math.cos(angle) * r, y: Math.sin(angle) * r };
  });
}

function spawnAsteroid(level: number): Asteroid {
  const side = Math.floor(Math.random() * 4);
  let x = 0, y = 0;
  if (side === 0) { x = Math.random() * W; y = -40; }
  else if (side === 1) { x = W + 40; y = Math.random() * H; }
  else if (side === 2) { x = Math.random() * W; y = H + 40; }
  else { x = -40; y = Math.random() * H; }
  const speed = 0.8 + Math.random() * 0.8 + level * 0.15;
  const angle = Math.random() * Math.PI * 2;
  const radius = 25 + Math.random() * 20;
  return {
    pos: { x, y },
    vel: { x: Math.cos(angle) * speed, y: Math.sin(angle) * speed },
    radius,
    angle: 0,
    rotSpeed: (Math.random() - 0.5) * 0.04,
    vertices: makeAsteroidVertices(radius),
  };
}

const ColtAsteroids: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef<GameState>('idle');
  const shipRef = useRef<Ship>({ pos: { x: W / 2, y: H / 2 }, vel: { x: 0, y: 0 }, angle: -Math.PI / 2, thrusting: false });
  const asteroidsRef = useRef<Asteroid[]>([]);
  const bulletsRef = useRef<Bullet[]>([]);
  const scoreRef = useRef(0);
  const livesRef = useRef(3);
  const levelRef = useRef(1);
  const keysRef = useRef<Set<string>>(new Set());
  const rafRef = useRef<number>(0);
  const frameRef = useRef(0);
  const invincibleRef = useRef(0);
  const shootCooldownRef = useRef(0);

  const [displayScore, setDisplayScore] = useState(0);
  const [displayLives, setDisplayLives] = useState(3);
  const [gameState, setGameState] = useState<GameState>('idle');
  const [bestScore, setBestScore] = useState(0);

  const resetGame = useCallback(() => {
    shipRef.current = { pos: { x: W / 2, y: H / 2 }, vel: { x: 0, y: 0 }, angle: -Math.PI / 2, thrusting: false };
    asteroidsRef.current = Array.from({ length: 4 }, () => spawnAsteroid(1));
    bulletsRef.current = [];
    scoreRef.current = 0;
    livesRef.current = 3;
    levelRef.current = 1;
    frameRef.current = 0;
    invincibleRef.current = 120;
    shootCooldownRef.current = 0;
    setDisplayScore(0);
    setDisplayLives(3);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const handleKey = (e: KeyboardEvent) => {
      keysRef.current.add(e.code);
      if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'Space'].includes(e.code)) e.preventDefault();
      if (e.code === 'Space') {
        if (stateRef.current === 'idle') {
          resetGame();
          stateRef.current = 'playing';
          setGameState('playing');
        } else if (stateRef.current === 'dead') {
          resetGame();
          stateRef.current = 'playing';
          setGameState('playing');
        }
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => keysRef.current.delete(e.code);

    window.addEventListener('keydown', handleKey);
    window.addEventListener('keyup', handleKeyUp);

    const drawShip = (ship: Ship, alpha: number) => {
      ctx.save();
      ctx.translate(ship.pos.x, ship.pos.y);
      ctx.rotate(ship.angle);
      ctx.globalAlpha = alpha;
      ctx.shadowColor = '#00e5ff';
      ctx.shadowBlur = 14;
      ctx.strokeStyle = '#00e5ff';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(18, 0);
      ctx.lineTo(-12, -10);
      ctx.lineTo(-6, 0);
      ctx.lineTo(-12, 10);
      ctx.closePath();
      ctx.stroke();
      if (ship.thrusting) {
        ctx.shadowColor = '#ff8800';
        ctx.strokeStyle = '#ff8800';
        ctx.beginPath();
        ctx.moveTo(-6, -5);
        ctx.lineTo(-16 - Math.random() * 8, 0);
        ctx.lineTo(-6, 5);
        ctx.stroke();
      }
      ctx.restore();
    };

    const drawAsteroid = (a: Asteroid) => {
      ctx.save();
      ctx.translate(a.pos.x, a.pos.y);
      ctx.rotate(a.angle);
      ctx.shadowColor = '#ff8800';
      ctx.shadowBlur = 10;
      ctx.strokeStyle = '#ff8800';
      ctx.lineWidth = 2;
      ctx.beginPath();
      a.vertices.forEach((v, i) => {
        if (i === 0) ctx.moveTo(v.x, v.y);
        else ctx.lineTo(v.x, v.y);
      });
      ctx.closePath();
      ctx.stroke();
      ctx.fillStyle = 'rgba(255, 136, 0, 0.08)';
      ctx.fill();
      ctx.restore();
    };

    const loop = () => {
      ctx.fillStyle = '#050d1a';
      ctx.fillRect(0, 0, W, H);

      // Stars
      if (frameRef.current % 3 === 0 || frameRef.current < 5) {
        ctx.fillStyle = '#050d1a';
        ctx.fillRect(0, 0, W, H);
      }
      ctx.strokeStyle = 'rgba(0, 229, 255, 0.04)';
      ctx.lineWidth = 1;
      for (let x = 0; x < W; x += 40) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
      }
      for (let y = 0; y < H; y += 40) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
      }

      if (stateRef.current === 'playing') {
        frameRef.current++;
        if (invincibleRef.current > 0) invincibleRef.current--;
        if (shootCooldownRef.current > 0) shootCooldownRef.current--;

        const ship = shipRef.current;
        const TURN = 0.065;
        const THRUST = 0.18;
        const FRICTION = 0.985;

        if (keysRef.current.has('ArrowLeft')) ship.angle -= TURN;
        if (keysRef.current.has('ArrowRight')) ship.angle += TURN;
        ship.thrusting = keysRef.current.has('ArrowUp');
        if (ship.thrusting) {
          ship.vel.x += Math.cos(ship.angle) * THRUST;
          ship.vel.y += Math.sin(ship.angle) * THRUST;
        }
        ship.vel.x *= FRICTION;
        ship.vel.y *= FRICTION;
        ship.pos.x = (ship.pos.x + ship.vel.x + W) % W;
        ship.pos.y = (ship.pos.y + ship.vel.y + H) % H;

        // Shoot
        if (keysRef.current.has('Space') && shootCooldownRef.current === 0) {
          const speed = 9;
          bulletsRef.current.push({
            pos: { x: ship.pos.x + Math.cos(ship.angle) * 18, y: ship.pos.y + Math.sin(ship.angle) * 18 },
            vel: { x: Math.cos(ship.angle) * speed + ship.vel.x, y: Math.sin(ship.angle) * speed + ship.vel.y },
            life: 55,
          });
          shootCooldownRef.current = 12;
        }

        // Update bullets
        bulletsRef.current = bulletsRef.current.filter((b) => b.life > 0);
        bulletsRef.current.forEach((b) => {
          b.pos.x = (b.pos.x + b.vel.x + W) % W;
          b.pos.y = (b.pos.y + b.vel.y + H) % H;
          b.life--;
        });

        // Update asteroids
        asteroidsRef.current.forEach((a) => {
          a.pos.x = (a.pos.x + a.vel.x + W) % W;
          a.pos.y = (a.pos.y + a.vel.y + H) % H;
          a.angle += a.rotSpeed;
        });

        // Bullet-asteroid collision
        const newAsteroids: Asteroid[] = [];
        const hitAsteroidIndices = new Set<number>();
        bulletsRef.current = bulletsRef.current.filter((b) => {
          for (let i = 0; i < asteroidsRef.current.length; i++) {
            if (hitAsteroidIndices.has(i)) continue;
            const a = asteroidsRef.current[i];
            const dx = b.pos.x - a.pos.x;
            const dy = b.pos.y - a.pos.y;
            if (Math.sqrt(dx * dx + dy * dy) < a.radius) {
              hitAsteroidIndices.add(i);
              scoreRef.current += a.radius > 35 ? 20 : a.radius > 20 ? 50 : 100;
              setDisplayScore(scoreRef.current);
              if (a.radius > 18) {
                for (let j = 0; j < 2; j++) {
                  const angle = Math.random() * Math.PI * 2;
                  const speed = a.vel.x * 0.5 + (Math.random() - 0.5) * 2;
                  const newR = a.radius * 0.55;
                  newAsteroids.push({
                    pos: { x: a.pos.x, y: a.pos.y },
                    vel: { x: Math.cos(angle) * Math.abs(speed) + 0.5, y: Math.sin(angle) * Math.abs(speed) + 0.5 },
                    radius: newR,
                    angle: 0,
                    rotSpeed: (Math.random() - 0.5) * 0.06,
                    vertices: makeAsteroidVertices(newR),
                  });
                }
              }
              return false;
            }
          }
          return true;
        });
        asteroidsRef.current = asteroidsRef.current.filter((_, i) => !hitAsteroidIndices.has(i));
        asteroidsRef.current.push(...newAsteroids);

        // Spawn new wave
        if (asteroidsRef.current.length === 0) {
          levelRef.current++;
          const count = 3 + levelRef.current;
          asteroidsRef.current = Array.from({ length: count }, () => spawnAsteroid(levelRef.current));
        }

        // Ship-asteroid collision
        if (invincibleRef.current === 0) {
          for (const a of asteroidsRef.current) {
            const dx = ship.pos.x - a.pos.x;
            const dy = ship.pos.y - a.pos.y;
            if (Math.sqrt(dx * dx + dy * dy) < a.radius + 14) {
              livesRef.current--;
              setDisplayLives(livesRef.current);
              invincibleRef.current = 150;
              ship.vel = { x: 0, y: 0 };
              ship.pos = { x: W / 2, y: H / 2 };
              if (livesRef.current <= 0) {
                stateRef.current = 'dead';
                setGameState('dead');
                setBestScore((prev) => Math.max(prev, scoreRef.current));
              }
              break;
            }
          }
        }
      }

      // Draw asteroids
      asteroidsRef.current.forEach(drawAsteroid);

      // Draw bullets
      bulletsRef.current.forEach((b) => {
        ctx.save();
        ctx.shadowColor = '#00ff88';
        ctx.shadowBlur = 10;
        ctx.fillStyle = '#00ff88';
        ctx.beginPath();
        ctx.arc(b.pos.x, b.pos.y, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      // Draw ship
      if (stateRef.current === 'playing') {
        const alpha = invincibleRef.current > 0 ? (Math.floor(frameRef.current / 6) % 2 === 0 ? 0.3 : 1) : 1;
        drawShip(shipRef.current, alpha);
      }

      // HUD
      ctx.font = 'bold 14px Orbitron, monospace';
      ctx.textAlign = 'left';
      ctx.fillStyle = '#00e5ff';
      ctx.shadowColor = '#00e5ff';
      ctx.shadowBlur = 8;
      ctx.fillText(`SCORE: ${scoreRef.current}`, 10, 25);
      ctx.shadowBlur = 0;
      ctx.textAlign = 'right';
      ctx.fillStyle = '#ff0055';
      ctx.shadowColor = '#ff0055';
      ctx.shadowBlur = 8;
      ctx.fillText(`LIVES: ${'♥'.repeat(Math.max(0, livesRef.current))}`, W - 10, 25);
      ctx.shadowBlur = 0;

      if (stateRef.current === 'idle') {
        ctx.fillStyle = 'rgba(5, 13, 26, 0.82)';
        ctx.fillRect(0, 0, W, H);
        ctx.font = 'bold 20px Orbitron, monospace';
        ctx.textAlign = 'center';
        ctx.fillStyle = '#ff8800';
        ctx.shadowColor = '#ff8800';
        ctx.shadowBlur = 22;
        ctx.fillText('COLT ASTEROIDS', W / 2, H / 2 - 40);
        ctx.shadowBlur = 0;
        ctx.font = '13px Rajdhani, sans-serif';
        ctx.fillStyle = 'rgba(255,255,255,0.7)';
        ctx.fillText('PRESS SPACE TO START', W / 2, H / 2);
        ctx.font = '12px Rajdhani, sans-serif';
        ctx.fillStyle = 'rgba(255,255,255,0.4)';
        ctx.fillText('← → ROTATE · ↑ THRUST · SPACE SHOOT', W / 2, H / 2 + 28);
      }

      if (stateRef.current === 'dead') {
        ctx.fillStyle = 'rgba(5, 13, 26, 0.88)';
        ctx.fillRect(0, 0, W, H);
        ctx.font = 'bold 26px Orbitron, monospace';
        ctx.textAlign = 'center';
        ctx.fillStyle = '#ff0055';
        ctx.shadowColor = '#ff0055';
        ctx.shadowBlur = 22;
        ctx.fillText('GAME OVER', W / 2, H / 2 - 30);
        ctx.shadowBlur = 0;
        ctx.font = '14px Rajdhani, sans-serif';
        ctx.fillStyle = 'rgba(255,255,255,0.6)';
        ctx.fillText('PRESS SPACE TO RESTART', W / 2, H / 2 + 15);
      }

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('keydown', handleKey);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [resetGame]);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex items-center gap-6 font-display text-sm tracking-wider">
        <span className="text-muted-foreground">SCORE: <span style={{ color: '#ff8800' }}>{displayScore}</span></span>
        <span className="text-muted-foreground">LIVES: <span style={{ color: '#ff0055' }}>{'♥'.repeat(Math.max(0, displayLives))}</span></span>
        <span className="text-muted-foreground">BEST: <span className="text-neon-green">{bestScore}</span></span>
      </div>
      <div className="relative" style={{ borderRadius: '8px', overflow: 'hidden' }}>
        <canvas
          ref={canvasRef}
          width={W}
          height={H}
          tabIndex={0}
          className="block"
          style={{
            border: '1px solid oklch(0.7 0.2 50 / 0.4)',
            boxShadow: '0 0 20px oklch(0.7 0.2 50 / 0.3)',
            maxWidth: '100%',
          }}
        />
        {gameState === 'dead' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center" style={{ background: 'rgba(5,13,26,0.88)' }}>
            <p className="font-display text-2xl tracking-widest mb-2" style={{ color: '#ff0055', textShadow: '0 0 20px #ff0055' }}>GAME OVER</p>
            <p className="font-body text-muted-foreground mb-1">Score: <span style={{ color: '#ff8800' }} className="font-bold">{displayScore}</span></p>
            <p className="font-body text-muted-foreground mb-6">Best: <span className="text-neon-green font-bold">{bestScore}</span></p>
            <button
              onClick={() => { resetGame(); stateRef.current = 'playing'; setGameState('playing'); }}
              className="px-6 py-2 font-display text-xs tracking-widest rounded border transition-all"
              style={{ borderColor: '#ff8800', color: '#ff8800', boxShadow: '0 0 10px #ff880044' }}
            >
              RESTART
            </button>
          </div>
        )}
      </div>
      <p className="text-xs text-muted-foreground font-body tracking-wider">
        ← → ROTATE · ↑ THRUST · SPACE SHOOT
      </p>
    </div>
  );
};

export default ColtAsteroids;
