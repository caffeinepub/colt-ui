import React, { useEffect, useRef, useState, useCallback } from 'react';

const W = 480;
const H = 520;
const PADDLE_W = 12;
const PADDLE_H = 80;
const BALL_SIZE = 10;
const PLAYER_X = 20;
const CPU_X = W - 20 - PADDLE_W;
const PADDLE_SPEED = 5;
const BALL_SPEED_INIT = 4;
const CPU_SPEED = 3.2;

type GameState = 'idle' | 'playing' | 'dead';

const ColtPong: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef<GameState>('idle');
  const playerYRef = useRef(H / 2 - PADDLE_H / 2);
  const cpuYRef = useRef(H / 2 - PADDLE_H / 2);
  const ballXRef = useRef(W / 2);
  const ballYRef = useRef(H / 2);
  const ballVxRef = useRef(BALL_SPEED_INIT);
  const ballVyRef = useRef(2);
  const playerScoreRef = useRef(0);
  const cpuScoreRef = useRef(0);
  const keysRef = useRef<Set<string>>(new Set());
  const rafRef = useRef<number>(0);
  const frameRef = useRef(0);
  const mouseYRef = useRef(H / 2);

  const [displayPlayerScore, setDisplayPlayerScore] = useState(0);
  const [displayCpuScore, setDisplayCpuScore] = useState(0);
  const [gameState, setGameState] = useState<GameState>('idle');

  const resetBall = useCallback((dir: number) => {
    ballXRef.current = W / 2;
    ballYRef.current = H / 2;
    const angle = (Math.random() * 0.6 - 0.3);
    ballVxRef.current = BALL_SPEED_INIT * dir;
    ballVyRef.current = BALL_SPEED_INIT * Math.sin(angle);
  }, []);

  const resetGame = useCallback(() => {
    playerYRef.current = H / 2 - PADDLE_H / 2;
    cpuYRef.current = H / 2 - PADDLE_H / 2;
    playerScoreRef.current = 0;
    cpuScoreRef.current = 0;
    frameRef.current = 0;
    setDisplayPlayerScore(0);
    setDisplayCpuScore(0);
    resetBall(1);
  }, [resetBall]);

  const startGame = useCallback(() => {
    if (stateRef.current === 'idle' || stateRef.current === 'dead') {
      resetGame();
      stateRef.current = 'playing';
      setGameState('playing');
    }
  }, [resetGame]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const handleKey = (e: KeyboardEvent) => {
      keysRef.current.add(e.code);
      if (['ArrowUp', 'ArrowDown', 'Space'].includes(e.code)) e.preventDefault();
      if (e.code === 'Space') startGame();
    };
    const handleKeyUp = (e: KeyboardEvent) => keysRef.current.delete(e.code);
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseYRef.current = (e.clientY - rect.top) * (H / rect.height);
    };

    window.addEventListener('keydown', handleKey);
    window.addEventListener('keyup', handleKeyUp);
    canvas.addEventListener('mousemove', handleMouseMove);

    const drawPaddle = (x: number, y: number, color: string, glowColor: string) => {
      ctx.save();
      ctx.shadowColor = glowColor;
      ctx.shadowBlur = 18;
      const grad = ctx.createLinearGradient(x, y, x + PADDLE_W, y);
      grad.addColorStop(0, color);
      grad.addColorStop(1, glowColor);
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.roundRect(x, y, PADDLE_W, PADDLE_H, 4);
      ctx.fill();
      ctx.strokeStyle = glowColor;
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.restore();
    };

    const drawBall = (x: number, y: number) => {
      ctx.save();
      ctx.shadowColor = '#ff00ff';
      ctx.shadowBlur = 20;
      const grad = ctx.createRadialGradient(x, y, 1, x, y, BALL_SIZE);
      grad.addColorStop(0, '#ffffff');
      grad.addColorStop(0.4, '#ff88ff');
      grad.addColorStop(1, '#cc00cc');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(x, y, BALL_SIZE, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    };

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

      // Center line
      ctx.setLineDash([10, 10]);
      ctx.strokeStyle = 'rgba(255, 0, 255, 0.25)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(W / 2, 0);
      ctx.lineTo(W / 2, H);
      ctx.stroke();
      ctx.setLineDash([]);

      if (stateRef.current === 'playing') {
        frameRef.current++;

        // Player movement (keyboard + mouse)
        if (keysRef.current.has('ArrowUp') || keysRef.current.has('KeyW')) {
          playerYRef.current = Math.max(0, playerYRef.current - PADDLE_SPEED);
        }
        if (keysRef.current.has('ArrowDown') || keysRef.current.has('KeyS')) {
          playerYRef.current = Math.min(H - PADDLE_H, playerYRef.current + PADDLE_SPEED);
        }
        // Mouse control
        const targetY = mouseYRef.current - PADDLE_H / 2;
        const diff = targetY - playerYRef.current;
        if (Math.abs(diff) > 1) {
          playerYRef.current += Math.sign(diff) * Math.min(Math.abs(diff), PADDLE_SPEED * 1.5);
          playerYRef.current = Math.max(0, Math.min(H - PADDLE_H, playerYRef.current));
        }

        // CPU AI
        const cpuCenter = cpuYRef.current + PADDLE_H / 2;
        if (cpuCenter < ballYRef.current - 5) {
          cpuYRef.current = Math.min(H - PADDLE_H, cpuYRef.current + CPU_SPEED);
        } else if (cpuCenter > ballYRef.current + 5) {
          cpuYRef.current = Math.max(0, cpuYRef.current - CPU_SPEED);
        }

        // Ball movement
        ballXRef.current += ballVxRef.current;
        ballYRef.current += ballVyRef.current;

        // Top/bottom bounce
        if (ballYRef.current - BALL_SIZE < 0) {
          ballYRef.current = BALL_SIZE;
          ballVyRef.current = Math.abs(ballVyRef.current);
        }
        if (ballYRef.current + BALL_SIZE > H) {
          ballYRef.current = H - BALL_SIZE;
          ballVyRef.current = -Math.abs(ballVyRef.current);
        }

        // Player paddle collision
        if (
          ballXRef.current - BALL_SIZE < PLAYER_X + PADDLE_W &&
          ballXRef.current + BALL_SIZE > PLAYER_X &&
          ballYRef.current > playerYRef.current &&
          ballYRef.current < playerYRef.current + PADDLE_H
        ) {
          ballXRef.current = PLAYER_X + PADDLE_W + BALL_SIZE;
          const hitPos = (ballYRef.current - playerYRef.current) / PADDLE_H - 0.5;
          const speed = Math.sqrt(ballVxRef.current ** 2 + ballVyRef.current ** 2) + 0.15;
          ballVxRef.current = Math.abs(speed * Math.cos(hitPos * 1.2));
          ballVyRef.current = speed * Math.sin(hitPos * 1.2) * 2;
        }

        // CPU paddle collision
        if (
          ballXRef.current + BALL_SIZE > CPU_X &&
          ballXRef.current - BALL_SIZE < CPU_X + PADDLE_W &&
          ballYRef.current > cpuYRef.current &&
          ballYRef.current < cpuYRef.current + PADDLE_H
        ) {
          ballXRef.current = CPU_X - BALL_SIZE;
          const hitPos = (ballYRef.current - cpuYRef.current) / PADDLE_H - 0.5;
          const speed = Math.sqrt(ballVxRef.current ** 2 + ballVyRef.current ** 2) + 0.1;
          ballVxRef.current = -Math.abs(speed * Math.cos(hitPos * 1.2));
          ballVyRef.current = speed * Math.sin(hitPos * 1.2) * 2;
        }

        // Scoring
        if (ballXRef.current < 0) {
          cpuScoreRef.current++;
          setDisplayCpuScore(cpuScoreRef.current);
          resetBall(1);
        }
        if (ballXRef.current > W) {
          playerScoreRef.current++;
          setDisplayPlayerScore(playerScoreRef.current);
          resetBall(-1);
        }

        // Game over at 7
        if (playerScoreRef.current >= 7 || cpuScoreRef.current >= 7) {
          stateRef.current = 'dead';
          setGameState('dead');
        }
      }

      drawPaddle(PLAYER_X, playerYRef.current, '#0088cc', '#00e5ff');
      drawPaddle(CPU_X, cpuYRef.current, '#880044', '#ff00aa');
      drawBall(ballXRef.current, ballYRef.current);

      // Scores
      ctx.font = 'bold 36px Orbitron, monospace';
      ctx.textAlign = 'center';
      ctx.fillStyle = '#00e5ff';
      ctx.shadowColor = '#00e5ff';
      ctx.shadowBlur = 14;
      ctx.fillText(String(playerScoreRef.current), W / 4, 50);
      ctx.fillStyle = '#ff00aa';
      ctx.shadowColor = '#ff00aa';
      ctx.fillText(String(cpuScoreRef.current), (W * 3) / 4, 50);
      ctx.shadowBlur = 0;

      // Labels
      ctx.font = '11px Rajdhani, sans-serif';
      ctx.fillStyle = 'rgba(255,255,255,0.4)';
      ctx.fillText('YOU', W / 4, 68);
      ctx.fillText('CPU', (W * 3) / 4, 68);

      if (stateRef.current === 'idle') {
        ctx.fillStyle = 'rgba(5, 13, 26, 0.8)';
        ctx.fillRect(0, 0, W, H);
        ctx.font = 'bold 24px Orbitron, monospace';
        ctx.textAlign = 'center';
        ctx.fillStyle = '#ff00ff';
        ctx.shadowColor = '#ff00ff';
        ctx.shadowBlur = 22;
        ctx.fillText('COLT PONG', W / 2, H / 2 - 30);
        ctx.shadowBlur = 0;
        ctx.font = '14px Rajdhani, sans-serif';
        ctx.fillStyle = 'rgba(255,255,255,0.7)';
        ctx.fillText('PRESS SPACE / CLICK TO START', W / 2, H / 2 + 10);
        ctx.font = '12px Rajdhani, sans-serif';
        ctx.fillStyle = 'rgba(255,255,255,0.4)';
        ctx.fillText('MOVE MOUSE OR ARROW KEYS to control paddle', W / 2, H / 2 + 35);
      }

      if (stateRef.current === 'dead') {
        ctx.fillStyle = 'rgba(5, 13, 26, 0.85)';
        ctx.fillRect(0, 0, W, H);
        const won = playerScoreRef.current >= 7;
        ctx.font = 'bold 26px Orbitron, monospace';
        ctx.textAlign = 'center';
        ctx.fillStyle = won ? '#00ff88' : '#ff0055';
        ctx.shadowColor = won ? '#00ff88' : '#ff0055';
        ctx.shadowBlur = 22;
        ctx.fillText(won ? 'YOU WIN!' : 'CPU WINS!', W / 2, H / 2 - 30);
        ctx.shadowBlur = 0;
        ctx.font = '14px Rajdhani, sans-serif';
        ctx.fillStyle = 'rgba(255,255,255,0.6)';
        ctx.fillText('PRESS SPACE / CLICK TO RESTART', W / 2, H / 2 + 15);
      }

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('keydown', handleKey);
      window.removeEventListener('keyup', handleKeyUp);
      canvas.removeEventListener('mousemove', handleMouseMove);
    };
  }, [startGame, resetBall]);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex items-center gap-8 font-display text-sm tracking-wider">
        <span className="text-muted-foreground">YOU: <span className="text-neon-cyan">{displayPlayerScore}</span></span>
        <span className="text-muted-foreground">CPU: <span style={{ color: '#ff00aa' }}>{displayCpuScore}</span></span>
      </div>
      <div className="relative" style={{ borderRadius: '8px', overflow: 'hidden' }}>
        <canvas
          ref={canvasRef}
          width={W}
          height={H}
          onClick={startGame}
          tabIndex={0}
          className="block"
          style={{
            border: '1px solid oklch(0.6 0.3 320 / 0.4)',
            boxShadow: '0 0 20px oklch(0.6 0.3 320 / 0.3)',
            maxWidth: '100%',
          }}
        />
      </div>
      <p className="text-xs text-muted-foreground font-body tracking-wider">
        MOUSE / ARROW KEYS to move · First to 7 wins
      </p>
    </div>
  );
};

export default ColtPong;
