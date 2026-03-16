import type React from "react";
import { useCallback, useEffect, useRef, useState } from "react";

const W = 360;
const H = 500;
const PLAYER_W = 44;
const PLAYER_H = 20;
const PLAYER_Y = H - 60;
const BLOCK_W = 44;
const BLOCK_H = 20;
const INITIAL_SPEED = 3;
const SPEED_INCREMENT = 0.003;
const SPAWN_INTERVAL = 80; // frames

interface Block {
  x: number;
  y: number;
  color: string;
}

const BLOCK_COLORS = ["#ff2255", "#ff8800", "#ffdd00", "#aa00ff", "#ff00aa"];

const ColtDodge: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef({
    playerX: W / 2 - PLAYER_W / 2,
    blocks: [] as Block[],
    score: 0,
    lives: 3,
    gameOver: false,
    running: false,
    speed: INITIAL_SPEED,
    frame: 0,
    leftDown: false,
    rightDown: false,
    animFrame: 0,
  });
  const [displayScore, setDisplayScore] = useState(0);
  const [displayLives, setDisplayLives] = useState(3);
  const [gameState, setGameState] = useState<"idle" | "running" | "over">(
    "idle",
  );

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const s = stateRef.current;

    ctx.clearRect(0, 0, W, H);

    // Background
    ctx.fillStyle = "#060b1a";
    ctx.fillRect(0, 0, W, H);

    // Grid lines
    ctx.strokeStyle = "rgba(0,200,255,0.04)";
    ctx.lineWidth = 1;
    for (let x = 0; x < W; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, H);
      ctx.stroke();
    }
    for (let y = 0; y < H; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(W, y);
      ctx.stroke();
    }

    // Player
    ctx.fillStyle = "#00e5ff";
    ctx.shadowColor = "#00e5ff";
    ctx.shadowBlur = 16;
    ctx.fillRect(s.playerX, PLAYER_Y, PLAYER_W, PLAYER_H);
    ctx.shadowBlur = 0;

    // Player thruster
    ctx.fillStyle = "rgba(0,150,255,0.5)";
    ctx.fillRect(s.playerX + 10, PLAYER_Y + PLAYER_H, 6, 8);
    ctx.fillRect(s.playerX + PLAYER_W - 16, PLAYER_Y + PLAYER_H, 6, 8);

    // Blocks
    for (const b of s.blocks) {
      ctx.fillStyle = b.color;
      ctx.shadowColor = b.color;
      ctx.shadowBlur = 10;
      ctx.fillRect(b.x, b.y, BLOCK_W, BLOCK_H);
      ctx.shadowBlur = 0;
    }

    // Lives
    ctx.fillStyle = "#00e5ff";
    ctx.font = "bold 13px monospace";
    ctx.textAlign = "left";
    ctx.fillText(`Lives: ${"♥".repeat(s.lives)}`, 10, 22);

    // Score
    ctx.textAlign = "right";
    ctx.fillText(`Score: ${s.score}`, W - 10, 22);
  }, []);

  const tick = useCallback(() => {
    const s = stateRef.current;
    if (!s.running) return;

    // Move player
    const speed = 5;
    if (s.leftDown) s.playerX = Math.max(0, s.playerX - speed);
    if (s.rightDown) s.playerX = Math.min(W - PLAYER_W, s.playerX + speed);

    // Spawn blocks
    if (s.frame % SPAWN_INTERVAL === 0) {
      const x = Math.floor(Math.random() * (W - BLOCK_W));
      const color =
        BLOCK_COLORS[Math.floor(Math.random() * BLOCK_COLORS.length)];
      s.blocks.push({ x, y: -BLOCK_H, color });
    }

    // Move blocks
    s.speed += SPEED_INCREMENT;
    s.blocks = s.blocks
      .map((b) => ({ ...b, y: b.y + s.speed }))
      .filter((b) => b.y < H);

    // Collision
    const px = s.playerX;
    const py = PLAYER_Y;
    for (const b of s.blocks) {
      if (
        b.x < px + PLAYER_W &&
        b.x + BLOCK_W > px &&
        b.y < py + PLAYER_H &&
        b.y + BLOCK_H > py
      ) {
        s.lives--;
        s.blocks = s.blocks.filter((bl) => bl !== b);
        setDisplayLives(s.lives);
        if (s.lives <= 0) {
          s.running = false;
          s.gameOver = true;
          setGameState("over");
          draw();
          return;
        }
        break;
      }
    }

    s.score = Math.floor(s.frame / 60);
    s.frame++;
    setDisplayScore(s.score);

    draw();
    s.animFrame = requestAnimationFrame(tick);
  }, [draw]);

  const startGame = () => {
    const s = stateRef.current;
    if (s.animFrame) cancelAnimationFrame(s.animFrame);
    s.playerX = W / 2 - PLAYER_W / 2;
    s.blocks = [];
    s.score = 0;
    s.lives = 3;
    s.gameOver = false;
    s.running = true;
    s.speed = INITIAL_SPEED;
    s.frame = 0;
    s.leftDown = false;
    s.rightDown = false;
    setDisplayScore(0);
    setDisplayLives(3);
    setGameState("running");
    s.animFrame = requestAnimationFrame(tick);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        stateRef.current.leftDown = true;
        e.preventDefault();
      }
      if (e.key === "ArrowRight") {
        stateRef.current.rightDown = true;
        e.preventDefault();
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") stateRef.current.leftDown = false;
      if (e.key === "ArrowRight") stateRef.current.rightDown = false;
    };
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      cancelAnimationFrame(stateRef.current.animFrame);
    };
  }, []);

  useEffect(() => {
    draw();
  }, [draw]);

  return (
    <div className="flex flex-col items-center gap-4 py-4">
      <div
        className="flex items-center justify-between w-full"
        style={{ maxWidth: W }}
      >
        <div
          className="text-sm font-bold"
          style={{
            color: "oklch(0.78 0.22 195)",
            textShadow: "0 0 8px oklch(0.78 0.22 195 / 0.6)",
          }}
        >
          COLT DODGE
        </div>
        <div className="flex gap-4 text-xs text-gray-400">
          <span>
            Lives:{" "}
            <span className="text-red-400 font-bold">
              {"♥".repeat(displayLives)}
            </span>
          </span>
          <span>
            Score: <span className="text-white font-bold">{displayScore}</span>
          </span>
        </div>
      </div>

      <canvas
        ref={canvasRef}
        width={W}
        height={H}
        style={{
          border: "1px solid oklch(0.78 0.22 195 / 0.3)",
          borderRadius: 8,
          display: "block",
        }}
      />

      {(gameState === "idle" || gameState === "over") && (
        <div className="flex flex-col items-center gap-3">
          {gameState === "over" && (
            <div className="text-center">
              <div className="text-lg font-bold text-red-400 mb-1">
                GAME OVER
              </div>
              <div className="text-sm text-gray-400">
                Score:{" "}
                <span className="text-white font-bold">{displayScore}</span>
              </div>
            </div>
          )}
          <button
            type="button"
            onClick={startGame}
            className="px-6 py-3 rounded-xl font-bold text-sm tracking-widest transition-all hover:scale-105"
            style={{
              background: "oklch(0.78 0.22 195 / 0.18)",
              border: "1.5px solid oklch(0.78 0.22 195 / 0.6)",
              color: "oklch(0.78 0.22 195)",
              boxShadow: "0 0 16px oklch(0.78 0.22 195 / 0.2)",
            }}
          >
            {gameState === "over" ? "PLAY AGAIN" : "START GAME"}
          </button>
        </div>
      )}

      {gameState === "running" && (
        <div className="flex gap-3">
          <button
            type="button"
            onPointerDown={() => {
              stateRef.current.leftDown = true;
            }}
            onPointerUp={() => {
              stateRef.current.leftDown = false;
            }}
            onPointerLeave={() => {
              stateRef.current.leftDown = false;
            }}
            className="w-12 h-12 rounded-lg bg-white/10 border border-white/20 text-white font-bold text-lg hover:bg-white/20 transition-all active:scale-90"
          >
            ←
          </button>
          <button
            type="button"
            onPointerDown={() => {
              stateRef.current.rightDown = true;
            }}
            onPointerUp={() => {
              stateRef.current.rightDown = false;
            }}
            onPointerLeave={() => {
              stateRef.current.rightDown = false;
            }}
            className="w-12 h-12 rounded-lg bg-white/10 border border-white/20 text-white font-bold text-lg hover:bg-white/20 transition-all active:scale-90"
          >
            →
          </button>
        </div>
      )}

      <p className="text-xs text-gray-500">
        Use ← → arrow keys to dodge blocks
      </p>
    </div>
  );
};

export default ColtDodge;
