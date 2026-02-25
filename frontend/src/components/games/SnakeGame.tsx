import React, { useEffect, useRef, useState, useCallback } from 'react';

const CELL = 20;
const COLS = 24;
const ROWS = 22;
const W = COLS * CELL;
const H = ROWS * CELL;

type Dir = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
type Point = { x: number; y: number };
type GameState = 'idle' | 'playing' | 'dead';

const SnakeGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const snakeRef = useRef<Point[]>([{ x: 12, y: 11 }]);
  const dirRef = useRef<Dir>('RIGHT');
  const nextDirRef = useRef<Dir>('RIGHT');
  const foodRef = useRef<Point>({ x: 18, y: 11 });
  const scoreRef = useRef(0);
  const stateRef = useRef<GameState>('idle');
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const frameRef = useRef(0);

  const [displayScore, setDisplayScore] = useState(0);
  const [gameState, setGameState] = useState<GameState>('idle');
  const [bestScore, setBestScore] = useState(0);

  const randomFood = useCallback((snake: Point[]): Point => {
    let pos: Point;
    do {
      pos = { x: Math.floor(Math.random() * COLS), y: Math.floor(Math.random() * ROWS) };
    } while (snake.some((s) => s.x === pos.x && s.y === pos.y));
    return pos;
  }, []);

  const resetGame = useCallback(() => {
    snakeRef.current = [{ x: 12, y: 11 }];
    dirRef.current = 'RIGHT';
    nextDirRef.current = 'RIGHT';
    foodRef.current = { x: 18, y: 11 };
    scoreRef.current = 0;
    frameRef.current = 0;
    setDisplayScore(0);
  }, []);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    frameRef.current++;

    // Background
    ctx.fillStyle = '#050d1a';
    ctx.fillRect(0, 0, W, H);

    // Grid
    ctx.strokeStyle = 'rgba(0, 229, 255, 0.04)';
    ctx.lineWidth = 1;
    for (let x = 0; x <= W; x += CELL) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
    }
    for (let y = 0; y <= H; y += CELL) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
    }

    // Food
    const food = foodRef.current;
    const pulse = Math.sin(frameRef.current * 0.15) * 0.3 + 0.7;
    ctx.shadowColor = '#00ff88';
    ctx.shadowBlur = 15 * pulse;
    ctx.fillStyle = `rgba(0, 255, 136, ${pulse})`;
    ctx.beginPath();
    ctx.arc(food.x * CELL + CELL / 2, food.y * CELL + CELL / 2, CELL / 2 - 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Snake
    const snake = snakeRef.current;
    snake.forEach((seg, i) => {
      const isHead = i === 0;
      const t = i / snake.length;
      const alpha = 1 - t * 0.5;

      if (isHead) {
        ctx.shadowColor = '#00e5ff';
        ctx.shadowBlur = 12;
        ctx.fillStyle = '#00e5ff';
      } else {
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
        ctx.fillStyle = `rgba(0, 180, 220, ${alpha})`;
      }

      const pad = isHead ? 1 : 2;
      ctx.beginPath();
      ctx.roundRect(
        seg.x * CELL + pad,
        seg.y * CELL + pad,
        CELL - pad * 2,
        CELL - pad * 2,
        isHead ? 4 : 3
      );
      ctx.fill();

      if (isHead) {
        ctx.shadowBlur = 0;
        // Eyes
        ctx.fillStyle = '#001133';
        ctx.beginPath();
        ctx.arc(seg.x * CELL + 6, seg.y * CELL + 6, 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(seg.x * CELL + 14, seg.y * CELL + 6, 2, 0, Math.PI * 2);
        ctx.fill();
      }
    });

    // Score
    ctx.font = 'bold 16px Orbitron, monospace';
    ctx.textAlign = 'left';
    ctx.fillStyle = '#00e5ff';
    ctx.shadowColor = '#00e5ff';
    ctx.shadowBlur = 8;
    ctx.fillText(`SCORE: ${scoreRef.current}`, 10, 20);
    ctx.shadowBlur = 0;

    // Idle
    if (stateRef.current === 'idle') {
      ctx.fillStyle = 'rgba(5, 13, 26, 0.75)';
      ctx.fillRect(0, 0, W, H);
      ctx.font = 'bold 20px Orbitron, monospace';
      ctx.textAlign = 'center';
      ctx.fillStyle = '#00ff88';
      ctx.shadowColor = '#00ff88';
      ctx.shadowBlur = 20;
      ctx.fillText('NEON SNAKE', W / 2, H / 2 - 25);
      ctx.shadowBlur = 0;
      ctx.font = '13px Rajdhani, sans-serif';
      ctx.fillStyle = 'rgba(255,255,255,0.7)';
      ctx.fillText('PRESS ARROW KEYS TO START', W / 2, H / 2 + 10);
    }
  }, []);

  const tick = useCallback(() => {
    if (stateRef.current !== 'playing') return;

    dirRef.current = nextDirRef.current;
    const snake = snakeRef.current;
    const head = snake[0];
    let nx = head.x;
    let ny = head.y;

    if (dirRef.current === 'UP') ny--;
    else if (dirRef.current === 'DOWN') ny++;
    else if (dirRef.current === 'LEFT') nx--;
    else nx++;

    // Wall collision
    if (nx < 0 || nx >= COLS || ny < 0 || ny >= ROWS) {
      stateRef.current = 'dead';
      setGameState('dead');
      setBestScore((prev) => Math.max(prev, scoreRef.current));
      return;
    }

    // Self collision
    if (snake.some((s) => s.x === nx && s.y === ny)) {
      stateRef.current = 'dead';
      setGameState('dead');
      setBestScore((prev) => Math.max(prev, scoreRef.current));
      return;
    }

    const newSnake = [{ x: nx, y: ny }, ...snake];
    const food = foodRef.current;

    if (nx === food.x && ny === food.y) {
      scoreRef.current++;
      setDisplayScore(scoreRef.current);
      foodRef.current = randomFood(newSnake);
    } else {
      newSnake.pop();
    }

    snakeRef.current = newSnake;
    draw();
  }, [draw, randomFood]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleKey = (e: KeyboardEvent) => {
      const dir = dirRef.current;
      if (e.key === 'ArrowUp' && dir !== 'DOWN') {
        e.preventDefault();
        nextDirRef.current = 'UP';
      } else if (e.key === 'ArrowDown' && dir !== 'UP') {
        e.preventDefault();
        nextDirRef.current = 'DOWN';
      } else if (e.key === 'ArrowLeft' && dir !== 'RIGHT') {
        e.preventDefault();
        nextDirRef.current = 'LEFT';
      } else if (e.key === 'ArrowRight' && dir !== 'LEFT') {
        e.preventDefault();
        nextDirRef.current = 'RIGHT';
      }

      if (stateRef.current === 'idle') {
        stateRef.current = 'playing';
        setGameState('playing');
      }
    };

    window.addEventListener('keydown', handleKey);

    // Draw loop for idle animation
    let rafId: number;
    const idleDraw = () => {
      if (stateRef.current === 'idle') {
        draw();
        rafId = requestAnimationFrame(idleDraw);
      }
    };
    rafId = requestAnimationFrame(idleDraw);

    return () => {
      window.removeEventListener('keydown', handleKey);
      cancelAnimationFrame(rafId);
    };
  }, [draw]);

  useEffect(() => {
    if (gameState === 'playing') {
      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = setInterval(tick, 120);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [gameState, tick]);

  const startGame = () => {
    resetGame();
    stateRef.current = 'playing';
    setGameState('playing');
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex items-center gap-6 font-display text-sm tracking-wider">
        <span className="text-muted-foreground">SCORE: <span className="text-neon-green">{displayScore}</span></span>
        <span className="text-muted-foreground">BEST: <span className="text-neon-cyan">{bestScore}</span></span>
      </div>

      <div className="relative" style={{ borderRadius: '8px', overflow: 'hidden' }}>
        <canvas
          ref={canvasRef}
          width={W}
          height={H}
          tabIndex={0}
          className="block"
          style={{
            border: '1px solid oklch(0.82 0.22 145 / 0.4)',
            boxShadow: '0 0 20px oklch(0.82 0.22 145 / 0.3)',
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
            <p className="font-body text-muted-foreground mb-1">Score: <span className="text-neon-green font-bold">{displayScore}</span></p>
            <p className="font-body text-muted-foreground mb-6">Best: <span className="text-neon-cyan font-bold">{bestScore}</span></p>
            <button
              onClick={startGame}
              className="px-6 py-2 font-display text-xs tracking-widest rounded border border-neon-green text-neon-green hover:bg-neon-green/10 transition-all"
              style={{ boxShadow: '0 0 10px oklch(0.82 0.22 145 / 0.4)' }}
            >
              RESTART
            </button>
          </div>
        )}
      </div>

      <p className="text-xs text-muted-foreground font-body tracking-wider">
        ARROW KEYS to move
      </p>
    </div>
  );
};

export default SnakeGame;
