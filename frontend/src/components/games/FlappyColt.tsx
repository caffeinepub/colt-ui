import React, { useEffect, useRef, useState, useCallback } from 'react';

interface Pipe {
  x: number;
  topHeight: number;
  passed: boolean;
}

const CANVAS_W = 480;
const CANVAS_H = 520;
const BIRD_X = 80;
const BIRD_SIZE = 28;
const PIPE_WIDTH = 52;
const PIPE_GAP = 155;
const GRAVITY = 0.45;
const FLAP_FORCE = -8.5;
const PIPE_SPEED = 2.8;
const PIPE_INTERVAL = 200;

type GameState = 'idle' | 'playing' | 'dead';

const FlappyColt: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef<GameState>('idle');
  const birdYRef = useRef(CANVAS_H / 2);
  const birdVelRef = useRef(0);
  const pipesRef = useRef<Pipe[]>([]);
  const scoreRef = useRef(0);
  const frameRef = useRef(0);
  const rafRef = useRef<number>(0);
  const birdRotRef = useRef(0);

  const [displayScore, setDisplayScore] = useState(0);
  const [gameState, setGameState] = useState<GameState>('idle');
  const [bestScore, setBestScore] = useState(0);

  const resetGame = useCallback(() => {
    birdYRef.current = CANVAS_H / 2;
    birdVelRef.current = 0;
    pipesRef.current = [];
    scoreRef.current = 0;
    frameRef.current = 0;
    birdRotRef.current = 0;
    setDisplayScore(0);
  }, []);

  const flap = useCallback(() => {
    if (stateRef.current === 'idle') {
      stateRef.current = 'playing';
      setGameState('playing');
      birdVelRef.current = FLAP_FORCE;
    } else if (stateRef.current === 'playing') {
      birdVelRef.current = FLAP_FORCE;
    } else if (stateRef.current === 'dead') {
      resetGame();
      stateRef.current = 'playing';
      setGameState('playing');
      birdVelRef.current = FLAP_FORCE;
    }
  }, [resetGame]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const handleKey = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'ArrowUp') {
        e.preventDefault();
        flap();
      }
    };
    window.addEventListener('keydown', handleKey);

    const drawBird = (x: number, y: number, rot: number) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rot);

      // Body
      const bodyGrad = ctx.createRadialGradient(-2, -2, 2, 0, 0, BIRD_SIZE / 2);
      bodyGrad.addColorStop(0, '#00ffff');
      bodyGrad.addColorStop(0.6, '#0088cc');
      bodyGrad.addColorStop(1, '#004488');
      ctx.beginPath();
      ctx.arc(0, 0, BIRD_SIZE / 2, 0, Math.PI * 2);
      ctx.fillStyle = bodyGrad;
      ctx.fill();

      // Glow
      ctx.shadowColor = '#00e5ff';
      ctx.shadowBlur = 15;
      ctx.beginPath();
      ctx.arc(0, 0, BIRD_SIZE / 2, 0, Math.PI * 2);
      ctx.strokeStyle = '#00e5ff';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Eye
      ctx.beginPath();
      ctx.arc(6, -4, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#fff';
      ctx.fill();
      ctx.beginPath();
      ctx.arc(7, -4, 2, 0, Math.PI * 2);
      ctx.fillStyle = '#001133';
      ctx.fill();

      // Wing
      ctx.beginPath();
      ctx.ellipse(-4, 4, 8, 4, -0.3, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0, 200, 255, 0.7)';
      ctx.fill();

      // Beak
      ctx.beginPath();
      ctx.moveTo(12, -2);
      ctx.lineTo(20, 0);
      ctx.lineTo(12, 3);
      ctx.closePath();
      ctx.fillStyle = '#ffcc00';
      ctx.fill();

      ctx.restore();
    };

    const drawPipe = (pipe: Pipe) => {
      const topY = 0;
      const topH = pipe.topHeight;
      const botY = pipe.topHeight + PIPE_GAP;
      const botH = CANVAS_H - botY;

      // Top pipe
      const topGrad = ctx.createLinearGradient(pipe.x, 0, pipe.x + PIPE_WIDTH, 0);
      topGrad.addColorStop(0, '#004422');
      topGrad.addColorStop(0.4, '#00aa44');
      topGrad.addColorStop(1, '#002211');
      ctx.fillStyle = topGrad;
      ctx.fillRect(pipe.x, topY, PIPE_WIDTH, topH);

      // Top pipe cap
      ctx.fillStyle = '#00cc55';
      ctx.shadowColor = '#00ff88';
      ctx.shadowBlur = 8;
      ctx.fillRect(pipe.x - 4, topH - 20, PIPE_WIDTH + 8, 20);
      ctx.shadowBlur = 0;

      // Bottom pipe
      ctx.fillStyle = topGrad;
      ctx.fillRect(pipe.x, botY, PIPE_WIDTH, botH);

      // Bottom pipe cap
      ctx.fillStyle = '#00cc55';
      ctx.shadowColor = '#00ff88';
      ctx.shadowBlur = 8;
      ctx.fillRect(pipe.x - 4, botY, PIPE_WIDTH + 8, 20);
      ctx.shadowBlur = 0;

      // Pipe borders
      ctx.strokeStyle = 'rgba(0, 255, 136, 0.4)';
      ctx.lineWidth = 1;
      ctx.strokeRect(pipe.x, topY, PIPE_WIDTH, topH);
      ctx.strokeRect(pipe.x, botY, PIPE_WIDTH, botH);
    };

    const loop = () => {
      // Background
      ctx.fillStyle = '#050d1a';
      ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

      // Grid
      ctx.strokeStyle = 'rgba(0, 229, 255, 0.04)';
      ctx.lineWidth = 1;
      const offset = (frameRef.current * 1.5) % 40;
      for (let x = -offset; x < CANVAS_W; x += 40) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, CANVAS_H); ctx.stroke();
      }
      for (let y = 0; y < CANVAS_H; y += 40) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(CANVAS_W, y); ctx.stroke();
      }

      if (stateRef.current === 'playing') {
        frameRef.current++;

        // Physics
        birdVelRef.current += GRAVITY;
        birdYRef.current += birdVelRef.current;
        birdRotRef.current = Math.max(-0.5, Math.min(1.2, birdVelRef.current * 0.06));

        // Spawn pipes
        if (frameRef.current % PIPE_INTERVAL === 0) {
          const minH = 60;
          const maxH = CANVAS_H - PIPE_GAP - 60;
          pipesRef.current.push({
            x: CANVAS_W + 10,
            topHeight: Math.random() * (maxH - minH) + minH,
            passed: false,
          });
        }

        // Move pipes
        pipesRef.current = pipesRef.current.filter((p) => p.x > -PIPE_WIDTH - 10);
        pipesRef.current.forEach((p) => {
          p.x -= PIPE_SPEED;
          if (!p.passed && p.x + PIPE_WIDTH < BIRD_X) {
            p.passed = true;
            scoreRef.current++;
            setDisplayScore(scoreRef.current);
          }
        });

        // Collision
        const bx = BIRD_X;
        const by = birdYRef.current;
        const br = BIRD_SIZE / 2 - 4;

        if (by + br > CANVAS_H || by - br < 0) {
          stateRef.current = 'dead';
          setGameState('dead');
          setBestScore((prev) => Math.max(prev, scoreRef.current));
        }

        for (const p of pipesRef.current) {
          const inX = bx + br > p.x && bx - br < p.x + PIPE_WIDTH;
          const inTopY = by - br < p.topHeight;
          const inBotY = by + br > p.topHeight + PIPE_GAP;
          if (inX && (inTopY || inBotY)) {
            stateRef.current = 'dead';
            setGameState('dead');
            setBestScore((prev) => Math.max(prev, scoreRef.current));
          }
        }
      }

      // Draw pipes
      pipesRef.current.forEach(drawPipe);

      // Ground line
      ctx.strokeStyle = 'rgba(0, 229, 255, 0.3)';
      ctx.lineWidth = 2;
      ctx.shadowColor = '#00e5ff';
      ctx.shadowBlur = 6;
      ctx.beginPath();
      ctx.moveTo(0, CANVAS_H - 2);
      ctx.lineTo(CANVAS_W, CANVAS_H - 2);
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Draw bird
      drawBird(BIRD_X, birdYRef.current, birdRotRef.current);

      // Score display
      ctx.font = 'bold 28px Orbitron, monospace';
      ctx.textAlign = 'center';
      ctx.fillStyle = '#00e5ff';
      ctx.shadowColor = '#00e5ff';
      ctx.shadowBlur = 12;
      ctx.fillText(String(scoreRef.current), CANVAS_W / 2, 50);
      ctx.shadowBlur = 0;

      // Idle screen
      if (stateRef.current === 'idle') {
        ctx.fillStyle = 'rgba(5, 13, 26, 0.7)';
        ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
        ctx.font = 'bold 22px Orbitron, monospace';
        ctx.textAlign = 'center';
        ctx.fillStyle = '#00e5ff';
        ctx.shadowColor = '#00e5ff';
        ctx.shadowBlur = 20;
        ctx.fillText('FLAPPY COLT', CANVAS_W / 2, CANVAS_H / 2 - 30);
        ctx.shadowBlur = 0;
        ctx.font = '14px Rajdhani, sans-serif';
        ctx.fillStyle = 'rgba(255,255,255,0.7)';
        ctx.fillText('PRESS SPACE / CLICK TO START', CANVAS_W / 2, CANVAS_H / 2 + 10);
      }

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('keydown', handleKey);
    };
  }, [flap]);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex items-center gap-6 font-display text-sm tracking-wider">
        <span className="text-muted-foreground">SCORE: <span className="text-neon-cyan">{displayScore}</span></span>
        <span className="text-muted-foreground">BEST: <span className="text-neon-green">{bestScore}</span></span>
      </div>

      <div className="relative" style={{ borderRadius: '8px', overflow: 'hidden' }}>
        <canvas
          ref={canvasRef}
          width={CANVAS_W}
          height={CANVAS_H}
          onClick={flap}
          tabIndex={0}
          className="block"
          style={{
            border: '1px solid oklch(0.78 0.22 195 / 0.4)',
            boxShadow: '0 0 20px oklch(0.78 0.22 195 / 0.3)',
            maxWidth: '100%',
          }}
        />
        {gameState === 'dead' && (
          <div
            className="absolute inset-0 flex flex-col items-center justify-center"
            style={{ background: 'rgba(5, 13, 26, 0.85)' }}
          >
            <p className="font-display text-2xl text-destructive tracking-widest mb-2"
              style={{ textShadow: '0 0 20px oklch(0.65 0.25 25)' }}>
              GAME OVER
            </p>
            <p className="font-body text-muted-foreground mb-1">Score: <span className="text-neon-cyan font-bold">{displayScore}</span></p>
            <p className="font-body text-muted-foreground mb-6">Best: <span className="text-neon-green font-bold">{bestScore}</span></p>
            <button
              onClick={flap}
              className="px-6 py-2 font-display text-xs tracking-widest rounded border border-neon-cyan text-neon-cyan hover:bg-neon-cyan/10 transition-all"
              style={{ boxShadow: '0 0 10px oklch(0.78 0.22 195 / 0.4)' }}
            >
              RESTART
            </button>
          </div>
        )}
      </div>

      <p className="text-xs text-muted-foreground font-body tracking-wider">
        SPACE / CLICK / TAP to flap
      </p>
    </div>
  );
};

export default FlappyColt;
