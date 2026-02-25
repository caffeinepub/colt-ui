import React, { useEffect, useRef, useState, useCallback } from 'react';

const W = 480;
const H = 520;
const LANE_COUNT = 5;
const LANE_W = W / LANE_COUNT;
const PLAYER_W = 36;
const PLAYER_H = 60;
const OBSTACLE_W = 36;
const OBSTACLE_H = 60;

type GameState = 'idle' | 'playing' | 'dead';

interface Obstacle {
  lane: number;
  y: number;
  color: string;
}

const OBS_COLORS = ['#ff0055', '#ff8800', '#aa00ff', '#ff00aa', '#00aaff'];

const ColtRacer: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef<GameState>('idle');
  const playerLaneRef = useRef(2);
  const playerXRef = useRef(LANE_W * 2 + LANE_W / 2 - PLAYER_W / 2);
  const playerAnimXRef = useRef(playerXRef.current);
  const obstaclesRef = useRef<Obstacle[]>([]);
  const scoreRef = useRef(0);
  const speedRef = useRef(4);
  const frameRef = useRef(0);
  const rafRef = useRef<number>(0);
  const roadOffsetRef = useRef(0);
  const keysRef = useRef<Set<string>>(new Set());
  const lastKeyRef = useRef<string>('');
  const keyDebounceRef = useRef(0);

  const [displayScore, setDisplayScore] = useState(0);
  const [gameState, setGameState] = useState<GameState>('idle');
  const [bestScore, setBestScore] = useState(0);

  const resetGame = useCallback(() => {
    playerLaneRef.current = 2;
    playerXRef.current = LANE_W * 2 + LANE_W / 2 - PLAYER_W / 2;
    playerAnimXRef.current = playerXRef.current;
    obstaclesRef.current = [];
    scoreRef.current = 0;
    speedRef.current = 4;
    frameRef.current = 0;
    roadOffsetRef.current = 0;
    keyDebounceRef.current = 0;
    setDisplayScore(0);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const handleKey = (e: KeyboardEvent) => {
      if (['ArrowLeft', 'ArrowRight', 'Space'].includes(e.key)) e.preventDefault();
      keysRef.current.add(e.code);

      if (stateRef.current === 'idle') {
        stateRef.current = 'playing';
        setGameState('playing');
        return;
      }
      if (stateRef.current === 'dead') {
        resetGame();
        stateRef.current = 'playing';
        setGameState('playing');
        return;
      }

      if (stateRef.current === 'playing' && keyDebounceRef.current === 0) {
        if ((e.code === 'ArrowLeft' || e.code === 'KeyA') && playerLaneRef.current > 0) {
          playerLaneRef.current--;
          playerXRef.current = playerLaneRef.current * LANE_W + LANE_W / 2 - PLAYER_W / 2;
          keyDebounceRef.current = 12;
        } else if ((e.code === 'ArrowRight' || e.code === 'KeyD') && playerLaneRef.current < LANE_COUNT - 1) {
          playerLaneRef.current++;
          playerXRef.current = playerLaneRef.current * LANE_W + LANE_W / 2 - PLAYER_W / 2;
          keyDebounceRef.current = 12;
        }
      }
      lastKeyRef.current = e.code;
    };
    const handleKeyUp = (e: KeyboardEvent) => keysRef.current.delete(e.code);

    const handleClick = (e: MouseEvent) => {
      if (stateRef.current === 'idle') {
        stateRef.current = 'playing';
        setGameState('playing');
        return;
      }
      if (stateRef.current === 'dead') {
        resetGame();
        stateRef.current = 'playing';
        setGameState('playing');
        return;
      }
      const rect = canvas.getBoundingClientRect();
      const clickX = (e.clientX - rect.left) * (W / rect.width);
      if (clickX < W / 2 && playerLaneRef.current > 0) {
        playerLaneRef.current--;
        playerXRef.current = playerLaneRef.current * LANE_W + LANE_W / 2 - PLAYER_W / 2;
      } else if (clickX >= W / 2 && playerLaneRef.current < LANE_COUNT - 1) {
        playerLaneRef.current++;
        playerXRef.current = playerLaneRef.current * LANE_W + LANE_W / 2 - PLAYER_W / 2;
      }
    };

    window.addEventListener('keydown', handleKey);
    window.addEventListener('keyup', handleKeyUp);
    canvas.addEventListener('click', handleClick);

    const drawCar = (x: number, y: number, color: string, isPlayer: boolean) => {
      ctx.save();
      ctx.shadowColor = color;
      ctx.shadowBlur = isPlayer ? 20 : 12;

      // Body
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.roundRect(x, y + 10, PLAYER_W, PLAYER_H - 20, 4);
      ctx.fill();

      // Roof
      ctx.fillStyle = isPlayer ? '#001133' : '#110011';
      ctx.beginPath();
      ctx.roundRect(x + 6, y + 18, PLAYER_W - 12, PLAYER_H - 36, 3);
      ctx.fill();

      // Headlights / taillights
      if (isPlayer) {
        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = '#ffffff';
        ctx.shadowBlur = 10;
        ctx.fillRect(x + 4, y + 10, 6, 4);
        ctx.fillRect(x + PLAYER_W - 10, y + 10, 6, 4);
        ctx.fillStyle = '#ff4400';
        ctx.shadowColor = '#ff4400';
        ctx.fillRect(x + 4, y + PLAYER_H - 14, 6, 4);
        ctx.fillRect(x + PLAYER_W - 10, y + PLAYER_H - 14, 6, 4);
      } else {
        ctx.fillStyle = '#ffcc00';
        ctx.shadowColor = '#ffcc00';
        ctx.shadowBlur = 8;
        ctx.fillRect(x + 4, y + PLAYER_H - 14, 6, 4);
        ctx.fillRect(x + PLAYER_W - 10, y + PLAYER_H - 14, 6, 4);
      }

      // Wheels
      ctx.fillStyle = '#111';
      ctx.shadowBlur = 0;
      ctx.fillRect(x - 4, y + 14, 6, 12);
      ctx.fillRect(x + PLAYER_W - 2, y + 14, 6, 12);
      ctx.fillRect(x - 4, y + PLAYER_H - 26, 6, 12);
      ctx.fillRect(x + PLAYER_W - 2, y + PLAYER_H - 26, 6, 12);

      ctx.restore();
    };

    const loop = () => {
      ctx.fillStyle = '#050d1a';
      ctx.fillRect(0, 0, W, H);

      // Road
      ctx.fillStyle = '#0a1020';
      ctx.fillRect(0, 0, W, H);

      // Lane lines
      roadOffsetRef.current = (roadOffsetRef.current + (stateRef.current === 'playing' ? speedRef.current : 0)) % 60;
      for (let lane = 1; lane < LANE_COUNT; lane++) {
        const lx = lane * LANE_W;
        ctx.strokeStyle = lane === 0 || lane === LANE_COUNT ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.15)';
        ctx.lineWidth = lane === 0 || lane === LANE_COUNT ? 3 : 1.5;
        ctx.setLineDash([30, 30]);
        ctx.lineDashOffset = -roadOffsetRef.current;
        ctx.beginPath();
        ctx.moveTo(lx, 0);
        ctx.lineTo(lx, H);
        ctx.stroke();
      }
      ctx.setLineDash([]);
      ctx.lineDashOffset = 0;

      // Road edges
      ctx.strokeStyle = 'rgba(0, 229, 255, 0.5)';
      ctx.lineWidth = 3;
      ctx.shadowColor = '#00e5ff';
      ctx.shadowBlur = 8;
      ctx.beginPath(); ctx.moveTo(2, 0); ctx.lineTo(2, H); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(W - 2, 0); ctx.lineTo(W - 2, H); ctx.stroke();
      ctx.shadowBlur = 0;

      if (stateRef.current === 'playing') {
        frameRef.current++;
        if (keyDebounceRef.current > 0) keyDebounceRef.current--;

        // Animate player X
        const targetX = playerXRef.current;
        const diff = targetX - playerAnimXRef.current;
        playerAnimXRef.current += diff * 0.25;

        // Score
        if (frameRef.current % 6 === 0) {
          scoreRef.current++;
          setDisplayScore(scoreRef.current);
        }

        // Speed increase
        speedRef.current = 4 + Math.floor(scoreRef.current / 100) * 0.5;

        // Spawn obstacles
        const spawnInterval = Math.max(40, 90 - Math.floor(scoreRef.current / 50) * 5);
        if (frameRef.current % spawnInterval === 0) {
          const usedLanes = obstaclesRef.current.filter((o) => o.y < 80).map((o) => o.lane);
          const availableLanes = Array.from({ length: LANE_COUNT }, (_, i) => i).filter((l) => !usedLanes.includes(l));
          if (availableLanes.length > 0) {
            const lane = availableLanes[Math.floor(Math.random() * availableLanes.length)];
            obstaclesRef.current.push({
              lane,
              y: -OBSTACLE_H,
              color: OBS_COLORS[Math.floor(Math.random() * OBS_COLORS.length)],
            });
          }
        }

        // Move obstacles
        obstaclesRef.current = obstaclesRef.current.filter((o) => o.y < H + OBSTACLE_H);
        obstaclesRef.current.forEach((o) => { o.y += speedRef.current; });

        // Collision
        const px = playerAnimXRef.current;
        const py = H - PLAYER_H - 20;
        for (const obs of obstaclesRef.current) {
          const ox = obs.lane * LANE_W + LANE_W / 2 - OBSTACLE_W / 2;
          const oy = obs.y;
          if (
            px + PLAYER_W - 4 > ox + 4 &&
            px + 4 < ox + OBSTACLE_W - 4 &&
            py + PLAYER_H - 4 > oy + 4 &&
            py + 4 < oy + OBSTACLE_H - 4
          ) {
            stateRef.current = 'dead';
            setGameState('dead');
            setBestScore((prev) => Math.max(prev, scoreRef.current));
          }
        }
      }

      // Draw obstacles
      obstaclesRef.current.forEach((obs) => {
        const ox = obs.lane * LANE_W + LANE_W / 2 - OBSTACLE_W / 2;
        drawCar(ox, obs.y, obs.color, false);
      });

      // Draw player
      const playerY = H - PLAYER_H - 20;
      drawCar(playerAnimXRef.current, playerY, '#00e5ff', true);

      // Speed trail
      if (stateRef.current === 'playing') {
        ctx.save();
        ctx.globalAlpha = 0.3;
        ctx.fillStyle = '#00e5ff';
        ctx.fillRect(playerAnimXRef.current + 8, playerY + PLAYER_H, 4, speedRef.current * 3);
        ctx.fillRect(playerAnimXRef.current + PLAYER_W - 12, playerY + PLAYER_H, 4, speedRef.current * 3);
        ctx.restore();
      }

      // HUD
      ctx.font = 'bold 14px Orbitron, monospace';
      ctx.textAlign = 'left';
      ctx.fillStyle = '#00e5ff';
      ctx.shadowColor = '#00e5ff';
      ctx.shadowBlur = 8;
      ctx.fillText(`DIST: ${scoreRef.current}m`, 10, 25);
      ctx.shadowBlur = 0;
      ctx.textAlign = 'right';
      ctx.fillStyle = '#ff8800';
      ctx.shadowColor = '#ff8800';
      ctx.shadowBlur = 8;
      ctx.fillText(`SPEED: ${(speedRef.current * 25).toFixed(0)}km/h`, W - 10, 25);
      ctx.shadowBlur = 0;

      if (stateRef.current === 'idle') {
        ctx.fillStyle = 'rgba(5, 13, 26, 0.82)';
        ctx.fillRect(0, 0, W, H);
        ctx.font = 'bold 22px Orbitron, monospace';
        ctx.textAlign = 'center';
        ctx.fillStyle = '#00e5ff';
        ctx.shadowColor = '#00e5ff';
        ctx.shadowBlur = 22;
        ctx.fillText('COLT RACER', W / 2, H / 2 - 30);
        ctx.shadowBlur = 0;
        ctx.font = '14px Rajdhani, sans-serif';
        ctx.fillStyle = 'rgba(255,255,255,0.7)';
        ctx.fillText('PRESS ANY KEY / CLICK TO START', W / 2, H / 2 + 10);
        ctx.font = '12px Rajdhani, sans-serif';
        ctx.fillStyle = 'rgba(255,255,255,0.4)';
        ctx.fillText('← → ARROW KEYS or CLICK to change lanes', W / 2, H / 2 + 35);
      }

      if (stateRef.current === 'dead') {
        ctx.fillStyle = 'rgba(5, 13, 26, 0.88)';
        ctx.fillRect(0, 0, W, H);
        ctx.font = 'bold 26px Orbitron, monospace';
        ctx.textAlign = 'center';
        ctx.fillStyle = '#ff0055';
        ctx.shadowColor = '#ff0055';
        ctx.shadowBlur = 22;
        ctx.fillText('CRASHED!', W / 2, H / 2 - 30);
        ctx.shadowBlur = 0;
        ctx.font = '14px Rajdhani, sans-serif';
        ctx.fillStyle = 'rgba(255,255,255,0.6)';
        ctx.fillText('PRESS ANY KEY / CLICK TO RESTART', W / 2, H / 2 + 15);
      }

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('keydown', handleKey);
      window.removeEventListener('keyup', handleKeyUp);
      canvas.removeEventListener('click', handleClick);
    };
  }, [resetGame]);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex items-center gap-6 font-display text-sm tracking-wider">
        <span className="text-muted-foreground">DIST: <span className="text-neon-cyan">{displayScore}m</span></span>
        <span className="text-muted-foreground">BEST: <span className="text-neon-green">{bestScore}m</span></span>
      </div>
      <div className="relative" style={{ borderRadius: '8px', overflow: 'hidden' }}>
        <canvas
          ref={canvasRef}
          width={W}
          height={H}
          tabIndex={0}
          className="block"
          style={{
            border: '1px solid oklch(0.78 0.22 195 / 0.4)',
            boxShadow: '0 0 20px oklch(0.78 0.22 195 / 0.3)',
            maxWidth: '100%',
          }}
        />
        {gameState === 'dead' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center" style={{ background: 'rgba(5,13,26,0.88)' }}>
            <p className="font-display text-2xl tracking-widest mb-2" style={{ color: '#ff0055', textShadow: '0 0 20px #ff0055' }}>CRASHED!</p>
            <p className="font-body text-muted-foreground mb-1">Distance: <span className="text-neon-cyan font-bold">{displayScore}m</span></p>
            <p className="font-body text-muted-foreground mb-6">Best: <span className="text-neon-green font-bold">{bestScore}m</span></p>
            <button
              onClick={() => { resetGame(); stateRef.current = 'playing'; setGameState('playing'); }}
              className="px-6 py-2 font-display text-xs tracking-widest rounded border border-neon-cyan text-neon-cyan hover:bg-neon-cyan/10 transition-all"
              style={{ boxShadow: '0 0 10px oklch(0.78 0.22 195 / 0.4)' }}
            >
              RESTART
            </button>
          </div>
        )}
      </div>
      <p className="text-xs text-muted-foreground font-body tracking-wider">
        ← → ARROW KEYS or CLICK LEFT/RIGHT to change lanes
      </p>
    </div>
  );
};

export default ColtRacer;
