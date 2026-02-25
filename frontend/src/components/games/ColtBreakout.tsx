import React, { useEffect, useRef, useState, useCallback } from 'react';

const W = 480;
const H = 520;
const PADDLE_W = 80;
const PADDLE_H = 12;
const PADDLE_Y = H - 40;
const BALL_R = 8;
const BRICK_COLS = 10;
const BRICK_ROWS = 6;
const BRICK_W = (W - 20) / BRICK_COLS;
const BRICK_H = 22;
const BRICK_PAD = 3;
const BRICK_TOP = 60;

type GameState = 'idle' | 'playing' | 'dead' | 'win';

const BRICK_COLORS = [
  '#ff0055', '#ff4400', '#ff8800', '#ffcc00', '#00ff88', '#00e5ff',
];

interface Brick {
  x: number; y: number; alive: boolean; color: string;
}

function makeBricks(): Brick[] {
  const bricks: Brick[] = [];
  for (let r = 0; r < BRICK_ROWS; r++) {
    for (let c = 0; c < BRICK_COLS; c++) {
      bricks.push({
        x: 10 + c * BRICK_W,
        y: BRICK_TOP + r * (BRICK_H + BRICK_PAD),
        alive: true,
        color: BRICK_COLORS[r % BRICK_COLORS.length],
      });
    }
  }
  return bricks;
}

const ColtBreakout: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef<GameState>('idle');
  const paddleXRef = useRef(W / 2 - PADDLE_W / 2);
  const ballXRef = useRef(W / 2);
  const ballYRef = useRef(PADDLE_Y - BALL_R - 2);
  const ballVxRef = useRef(3.5);
  const ballVyRef = useRef(-4);
  const bricksRef = useRef<Brick[]>(makeBricks());
  const scoreRef = useRef(0);
  const livesRef = useRef(3);
  const rafRef = useRef<number>(0);
  const frameRef = useRef(0);
  const mouseXRef = useRef(W / 2);
  const keysRef = useRef<Set<string>>(new Set());
  const ballAttachedRef = useRef(true);

  const [displayScore, setDisplayScore] = useState(0);
  const [displayLives, setDisplayLives] = useState(3);
  const [gameState, setGameState] = useState<GameState>('idle');
  const [bestScore, setBestScore] = useState(0);

  const resetBall = useCallback(() => {
    ballXRef.current = paddleXRef.current + PADDLE_W / 2;
    ballYRef.current = PADDLE_Y - BALL_R - 2;
    ballVxRef.current = (Math.random() > 0.5 ? 1 : -1) * 3.5;
    ballVyRef.current = -4;
    ballAttachedRef.current = true;
  }, []);

  const resetGame = useCallback(() => {
    paddleXRef.current = W / 2 - PADDLE_W / 2;
    bricksRef.current = makeBricks();
    scoreRef.current = 0;
    livesRef.current = 3;
    frameRef.current = 0;
    setDisplayScore(0);
    setDisplayLives(3);
    resetBall();
  }, [resetBall]);

  const launch = useCallback(() => {
    if (ballAttachedRef.current) {
      ballAttachedRef.current = false;
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const handleKey = (e: KeyboardEvent) => {
      keysRef.current.add(e.code);
      if (['ArrowLeft', 'ArrowRight', 'Space'].includes(e.code)) e.preventDefault();
      if (e.code === 'Space') {
        if (stateRef.current === 'idle') {
          stateRef.current = 'playing';
          setGameState('playing');
        } else if (stateRef.current === 'playing') {
          launch();
        } else if (stateRef.current === 'dead' || stateRef.current === 'win') {
          resetGame();
          stateRef.current = 'playing';
          setGameState('playing');
        }
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => keysRef.current.delete(e.code);
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseXRef.current = (e.clientX - rect.left) * (W / rect.width);
    };
    const handleClick = () => {
      if (stateRef.current === 'idle') {
        stateRef.current = 'playing';
        setGameState('playing');
      } else if (stateRef.current === 'playing') {
        launch();
      } else if (stateRef.current === 'dead' || stateRef.current === 'win') {
        resetGame();
        stateRef.current = 'playing';
        setGameState('playing');
      }
    };

    window.addEventListener('keydown', handleKey);
    window.addEventListener('keyup', handleKeyUp);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('click', handleClick);

    const loop = () => {
      ctx.fillStyle = '#050d1a';
      ctx.fillRect(0, 0, W, H);

      // Grid
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

        // Paddle movement
        const targetX = mouseXRef.current - PADDLE_W / 2;
        const diff = targetX - paddleXRef.current;
        paddleXRef.current += Math.sign(diff) * Math.min(Math.abs(diff), 8);
        paddleXRef.current = Math.max(0, Math.min(W - PADDLE_W, paddleXRef.current));

        if (keysRef.current.has('ArrowLeft')) paddleXRef.current = Math.max(0, paddleXRef.current - 7);
        if (keysRef.current.has('ArrowRight')) paddleXRef.current = Math.min(W - PADDLE_W, paddleXRef.current + 7);

        if (ballAttachedRef.current) {
          ballXRef.current = paddleXRef.current + PADDLE_W / 2;
          ballYRef.current = PADDLE_Y - BALL_R - 2;
        } else {
          // Ball movement
          ballXRef.current += ballVxRef.current;
          ballYRef.current += ballVyRef.current;

          // Wall bounces
          if (ballXRef.current - BALL_R < 0) { ballXRef.current = BALL_R; ballVxRef.current = Math.abs(ballVxRef.current); }
          if (ballXRef.current + BALL_R > W) { ballXRef.current = W - BALL_R; ballVxRef.current = -Math.abs(ballVxRef.current); }
          if (ballYRef.current - BALL_R < 0) { ballYRef.current = BALL_R; ballVyRef.current = Math.abs(ballVyRef.current); }

          // Paddle collision
          if (
            ballYRef.current + BALL_R >= PADDLE_Y &&
            ballYRef.current - BALL_R <= PADDLE_Y + PADDLE_H &&
            ballXRef.current >= paddleXRef.current &&
            ballXRef.current <= paddleXRef.current + PADDLE_W
          ) {
            ballYRef.current = PADDLE_Y - BALL_R;
            const hitPos = (ballXRef.current - paddleXRef.current) / PADDLE_W - 0.5;
            const speed = Math.sqrt(ballVxRef.current ** 2 + ballVyRef.current ** 2);
            ballVxRef.current = speed * hitPos * 2.5;
            ballVyRef.current = -Math.abs(ballVyRef.current);
          }

          // Brick collision
          for (const brick of bricksRef.current) {
            if (!brick.alive) continue;
            if (
              ballXRef.current + BALL_R > brick.x &&
              ballXRef.current - BALL_R < brick.x + BRICK_W - BRICK_PAD &&
              ballYRef.current + BALL_R > brick.y &&
              ballYRef.current - BALL_R < brick.y + BRICK_H
            ) {
              brick.alive = false;
              scoreRef.current += 10;
              setDisplayScore(scoreRef.current);
              // Determine bounce direction
              const overlapLeft = ballXRef.current + BALL_R - brick.x;
              const overlapRight = brick.x + BRICK_W - BRICK_PAD - (ballXRef.current - BALL_R);
              const overlapTop = ballYRef.current + BALL_R - brick.y;
              const overlapBottom = brick.y + BRICK_H - (ballYRef.current - BALL_R);
              const minOverlap = Math.min(overlapLeft, overlapRight, overlapTop, overlapBottom);
              if (minOverlap === overlapTop || minOverlap === overlapBottom) {
                ballVyRef.current *= -1;
              } else {
                ballVxRef.current *= -1;
              }
              break;
            }
          }

          // Ball lost
          if (ballYRef.current - BALL_R > H) {
            livesRef.current--;
            setDisplayLives(livesRef.current);
            if (livesRef.current <= 0) {
              stateRef.current = 'dead';
              setGameState('dead');
              setBestScore((prev) => Math.max(prev, scoreRef.current));
            } else {
              resetBall();
            }
          }

          // Win check
          if (bricksRef.current.every((b) => !b.alive)) {
            stateRef.current = 'win';
            setGameState('win');
            setBestScore((prev) => Math.max(prev, scoreRef.current));
          }
        }
      }

      // Draw bricks
      bricksRef.current.forEach((brick) => {
        if (!brick.alive) return;
        ctx.save();
        ctx.shadowColor = brick.color;
        ctx.shadowBlur = 10;
        ctx.fillStyle = brick.color + 'cc';
        ctx.fillRect(brick.x, brick.y, BRICK_W - BRICK_PAD, BRICK_H);
        ctx.strokeStyle = brick.color;
        ctx.lineWidth = 1.5;
        ctx.strokeRect(brick.x, brick.y, BRICK_W - BRICK_PAD, BRICK_H);
        ctx.restore();
      });

      // Draw paddle
      ctx.save();
      ctx.shadowColor = '#00e5ff';
      ctx.shadowBlur = 16;
      const pGrad = ctx.createLinearGradient(paddleXRef.current, PADDLE_Y, paddleXRef.current + PADDLE_W, PADDLE_Y);
      pGrad.addColorStop(0, '#0088cc');
      pGrad.addColorStop(0.5, '#00e5ff');
      pGrad.addColorStop(1, '#0088cc');
      ctx.fillStyle = pGrad;
      ctx.beginPath();
      ctx.roundRect(paddleXRef.current, PADDLE_Y, PADDLE_W, PADDLE_H, 6);
      ctx.fill();
      ctx.strokeStyle = '#00e5ff';
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.restore();

      // Draw ball
      ctx.save();
      ctx.shadowColor = '#ffcc00';
      ctx.shadowBlur = 18;
      const bGrad = ctx.createRadialGradient(ballXRef.current, ballYRef.current, 1, ballXRef.current, ballYRef.current, BALL_R);
      bGrad.addColorStop(0, '#ffffff');
      bGrad.addColorStop(0.5, '#ffcc00');
      bGrad.addColorStop(1, '#ff8800');
      ctx.fillStyle = bGrad;
      ctx.beginPath();
      ctx.arc(ballXRef.current, ballYRef.current, BALL_R, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // HUD
      ctx.font = 'bold 14px Orbitron, monospace';
      ctx.textAlign = 'left';
      ctx.fillStyle = '#ffcc00';
      ctx.shadowColor = '#ffcc00';
      ctx.shadowBlur = 8;
      ctx.fillText(`SCORE: ${scoreRef.current}`, 10, 30);
      ctx.shadowBlur = 0;
      ctx.textAlign = 'right';
      ctx.fillStyle = '#ff0055';
      ctx.shadowColor = '#ff0055';
      ctx.shadowBlur = 8;
      ctx.fillText(`LIVES: ${'♥'.repeat(Math.max(0, livesRef.current))}`, W - 10, 30);
      ctx.shadowBlur = 0;

      if (stateRef.current === 'idle') {
        ctx.fillStyle = 'rgba(5, 13, 26, 0.82)';
        ctx.fillRect(0, 0, W, H);
        ctx.font = 'bold 22px Orbitron, monospace';
        ctx.textAlign = 'center';
        ctx.fillStyle = '#ffcc00';
        ctx.shadowColor = '#ffcc00';
        ctx.shadowBlur = 22;
        ctx.fillText('COLT BREAKOUT', W / 2, H / 2 - 30);
        ctx.shadowBlur = 0;
        ctx.font = '14px Rajdhani, sans-serif';
        ctx.fillStyle = 'rgba(255,255,255,0.7)';
        ctx.fillText('PRESS SPACE / CLICK TO START', W / 2, H / 2 + 10);
        ctx.font = '12px Rajdhani, sans-serif';
        ctx.fillStyle = 'rgba(255,255,255,0.4)';
        ctx.fillText('MOUSE / ARROW KEYS to move · SPACE to launch', W / 2, H / 2 + 35);
      }

      if (stateRef.current === 'win') {
        ctx.fillStyle = 'rgba(5, 13, 26, 0.88)';
        ctx.fillRect(0, 0, W, H);
        ctx.font = 'bold 26px Orbitron, monospace';
        ctx.textAlign = 'center';
        ctx.fillStyle = '#00ff88';
        ctx.shadowColor = '#00ff88';
        ctx.shadowBlur = 22;
        ctx.fillText('YOU WIN!', W / 2, H / 2 - 30);
        ctx.shadowBlur = 0;
        ctx.font = '14px Rajdhani, sans-serif';
        ctx.fillStyle = 'rgba(255,255,255,0.6)';
        ctx.fillText('CLICK / SPACE TO PLAY AGAIN', W / 2, H / 2 + 15);
      }

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('keydown', handleKey);
      window.removeEventListener('keyup', handleKeyUp);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('click', handleClick);
    };
  }, [launch, resetBall, resetGame]);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex items-center gap-6 font-display text-sm tracking-wider">
        <span className="text-muted-foreground">SCORE: <span style={{ color: '#ffcc00' }}>{displayScore}</span></span>
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
            border: '1px solid oklch(0.85 0.2 85 / 0.4)',
            boxShadow: '0 0 20px oklch(0.85 0.2 85 / 0.3)',
            maxWidth: '100%',
          }}
        />
        {(gameState === 'dead') && (
          <div className="absolute inset-0 flex flex-col items-center justify-center" style={{ background: 'rgba(5,13,26,0.88)' }}>
            <p className="font-display text-2xl tracking-widest mb-2" style={{ color: '#ff0055', textShadow: '0 0 20px #ff0055' }}>GAME OVER</p>
            <p className="font-body text-muted-foreground mb-1">Score: <span style={{ color: '#ffcc00' }} className="font-bold">{displayScore}</span></p>
            <p className="font-body text-muted-foreground mb-6">Best: <span className="text-neon-green font-bold">{bestScore}</span></p>
            <button
              onClick={() => { resetGame(); stateRef.current = 'playing'; setGameState('playing'); }}
              className="px-6 py-2 font-display text-xs tracking-widest rounded border transition-all"
              style={{ borderColor: '#ffcc00', color: '#ffcc00', boxShadow: '0 0 10px #ffcc0044' }}
            >
              RESTART
            </button>
          </div>
        )}
      </div>
      <p className="text-xs text-muted-foreground font-body tracking-wider">
        MOUSE / ← → to move · SPACE / CLICK to launch ball
      </p>
    </div>
  );
};

export default ColtBreakout;
