import type React from "react";
import { useCallback, useEffect, useRef, useState } from "react";

type MazeDef = {
  label: string;
  layout: number[][];
  start: { x: number; y: number };
  exit: { x: number; y: number };
};

const MAZES: MazeDef[] = [
  {
    label: "Maze 1",
    layout: [
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 2, 0, 1, 0, 0, 0, 1, 0, 1],
      [1, 0, 0, 1, 0, 1, 0, 1, 0, 1],
      [1, 0, 1, 1, 0, 1, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 1, 1, 1, 0, 1],
      [1, 1, 1, 1, 0, 0, 0, 1, 0, 1],
      [1, 0, 0, 0, 0, 1, 0, 0, 0, 1],
      [1, 0, 1, 1, 1, 1, 0, 1, 1, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 3, 1],
    ],
    start: { x: 1, y: 1 },
    exit: { x: 8, y: 9 },
  },
  {
    label: "Maze 2",
    layout: [
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 2, 1, 0, 0, 0, 1, 0, 0, 1],
      [1, 0, 1, 0, 1, 0, 1, 0, 1, 1],
      [1, 0, 0, 0, 1, 0, 0, 0, 1, 1],
      [1, 1, 1, 0, 1, 1, 1, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 1, 1, 0, 1],
      [1, 0, 1, 1, 1, 0, 0, 0, 0, 1],
      [1, 0, 1, 0, 0, 0, 1, 1, 0, 1],
      [1, 0, 0, 0, 1, 0, 0, 0, 3, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    ],
    start: { x: 1, y: 1 },
    exit: { x: 8, y: 8 },
  },
  {
    label: "Maze 3",
    layout: [
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 2, 0, 0, 0, 1, 0, 0, 0, 1],
      [1, 1, 1, 1, 0, 1, 0, 1, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 1, 0, 1],
      [1, 0, 1, 1, 1, 1, 0, 1, 0, 1],
      [1, 0, 1, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 1, 0, 1, 1, 1, 1, 0, 1],
      [1, 0, 0, 0, 1, 0, 0, 0, 0, 1],
      [1, 1, 1, 0, 0, 0, 1, 1, 3, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    ],
    start: { x: 1, y: 1 },
    exit: { x: 8, y: 8 },
  },
  {
    label: "Maze 4",
    layout: [
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 2, 0, 0, 1, 0, 0, 0, 0, 1],
      [1, 1, 1, 0, 1, 0, 1, 1, 0, 1],
      [1, 0, 0, 0, 0, 0, 1, 0, 0, 1],
      [1, 0, 1, 1, 1, 0, 1, 0, 1, 1],
      [1, 0, 0, 0, 1, 0, 0, 0, 1, 1],
      [1, 1, 1, 0, 1, 1, 1, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 1, 1],
      [1, 0, 1, 1, 1, 1, 1, 0, 3, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    ],
    start: { x: 1, y: 1 },
    exit: { x: 8, y: 8 },
  },
  {
    label: "Maze 5",
    layout: [
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 2, 1, 0, 0, 0, 0, 1, 0, 1],
      [1, 0, 1, 0, 1, 1, 0, 1, 0, 1],
      [1, 0, 0, 0, 1, 0, 0, 0, 0, 1],
      [1, 1, 1, 0, 1, 0, 1, 1, 0, 1],
      [1, 0, 0, 0, 0, 0, 1, 0, 0, 1],
      [1, 0, 1, 1, 1, 0, 0, 0, 1, 1],
      [1, 0, 1, 0, 0, 0, 1, 0, 0, 1],
      [1, 0, 0, 0, 1, 0, 0, 0, 3, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    ],
    start: { x: 1, y: 1 },
    exit: { x: 8, y: 8 },
  },
];

const CELL = 38;

const D_PAD_KEYS = [
  { label: "", key: "" },
  { label: "↑", key: "ArrowUp" },
  { label: "", key: "" },
  { label: "←", key: "ArrowLeft" },
  { label: "↓", key: "ArrowDown" },
  { label: "→", key: "ArrowRight" },
];

const ColtMaze: React.FC = () => {
  const [mazeIndex, setMazeIndex] = useState(0);
  const maze = MAZES[mazeIndex];
  const [pos, setPos] = useState(maze.start);
  const [won, setWon] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const drawMaze = useCallback(
    (
      playerPos: { x: number; y: number },
      layout: number[][],
      exit: { x: number; y: number },
    ) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      layout.forEach((row, ry) => {
        row.forEach((cell, rx) => {
          const x = rx * CELL;
          const y = ry * CELL;
          const isExit = rx === exit.x && ry === exit.y;
          const isPlayer = playerPos.x === rx && playerPos.y === ry;

          if (cell === 1) {
            ctx.fillStyle = "#1a1f35";
            ctx.fillRect(x, y, CELL, CELL);
          } else {
            ctx.fillStyle = "rgba(10,14,30,0.5)";
            ctx.fillRect(x, y, CELL, CELL);
          }

          if (isExit) {
            ctx.fillStyle = "rgba(0,200,80,0.35)";
            ctx.fillRect(x, y, CELL, CELL);
            ctx.strokeStyle = "rgba(0,220,80,0.8)";
            ctx.lineWidth = 2;
            ctx.strokeRect(x + 1, y + 1, CELL - 2, CELL - 2);
            ctx.font = "18px serif";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText("🚪", x + CELL / 2, y + CELL / 2);
          }

          if (isPlayer) {
            ctx.beginPath();
            ctx.arc(x + CELL / 2, y + CELL / 2, 10, 0, Math.PI * 2);
            ctx.fillStyle = "oklch(0.78 0.22 195)";
            ctx.shadowColor = "cyan";
            ctx.shadowBlur = 14;
            ctx.fill();
            ctx.shadowBlur = 0;
          }
        });
      });
    },
    [],
  );

  useEffect(() => {
    drawMaze(pos, maze.layout, maze.exit);
  }, [pos, maze, drawMaze]);

  const move = useCallback(
    (dx: number, dy: number) => {
      if (won) return;
      setPos((prev) => {
        const nx = prev.x + dx;
        const ny = prev.y + dy;
        if (
          ny < 0 ||
          ny >= maze.layout.length ||
          nx < 0 ||
          nx >= maze.layout[0].length
        )
          return prev;
        if (maze.layout[ny][nx] === 1) return prev;
        if (nx === maze.exit.x && ny === maze.exit.y) setWon(true);
        return { x: nx, y: ny };
      });
    },
    [won, maze],
  );

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      const dirs: Record<string, [number, number]> = {
        ArrowUp: [0, -1],
        ArrowDown: [0, 1],
        ArrowLeft: [-1, 0],
        ArrowRight: [1, 0],
      };
      const dir = dirs[e.key];
      if (dir) {
        e.preventDefault();
        move(dir[0], dir[1]);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [move]);

  const handleRestart = () => {
    setPos(maze.start);
    setWon(false);
  };

  const goToMaze = (idx: number) => {
    const newMaze = MAZES[idx];
    setMazeIndex(idx);
    setPos(newMaze.start);
    setWon(false);
  };

  const handleNextMaze = () => {
    const next = (mazeIndex + 1) % MAZES.length;
    goToMaze(next);
  };

  return (
    <div className="flex flex-col items-center gap-4 py-4">
      <div
        className="text-sm font-bold"
        style={{
          color: "oklch(0.78 0.22 195)",
          textShadow: "0 0 8px oklch(0.78 0.22 195 / 0.6)",
        }}
      >
        COLT MAZE
      </div>

      {/* Maze selector */}
      <div className="flex items-center gap-2 flex-wrap justify-center">
        {MAZES.map((m, i) => (
          <button
            key={m.label}
            type="button"
            data-ocid="maze.tab"
            onClick={() => goToMaze(i)}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
              i === mazeIndex
                ? "bg-neon-cyan/20 border border-neon-cyan/60 text-neon-cyan"
                : "bg-white/5 border border-white/10 text-gray-400 hover:border-white/30 hover:text-white"
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>

      <p className="text-xs text-gray-400">
        Maze <span className="text-neon-cyan font-bold">{mazeIndex + 1}</span>/
        {MAZES.length} — Arrow keys or D-pad to reach the{" "}
        <span className="text-neon-green font-bold">green exit</span>
      </p>

      {won && (
        <div
          className="flex flex-col items-center gap-3 py-3 px-5 rounded-xl font-bold text-sm"
          style={{
            background: "oklch(0.55 0.22 140 / 0.2)",
            border: "1px solid oklch(0.55 0.22 140 / 0.5)",
            color: "oklch(0.78 0.30 140)",
          }}
        >
          <span>🎉 You escaped the maze!</span>
          {mazeIndex < MAZES.length - 1 && (
            <button
              type="button"
              data-ocid="maze.primary_button"
              onClick={handleNextMaze}
              className="px-4 py-1.5 rounded-lg text-xs font-bold tracking-widest transition-all hover:scale-105"
              style={{
                background: "oklch(0.55 0.22 140 / 0.3)",
                border: "1px solid oklch(0.55 0.22 140 / 0.7)",
                color: "oklch(0.85 0.28 140)",
              }}
            >
              Next Maze →
            </button>
          )}
          {mazeIndex === MAZES.length - 1 && (
            <span className="text-xs opacity-70">🏆 All mazes complete!</span>
          )}
        </div>
      )}

      <canvas
        ref={canvasRef}
        width={maze.layout[0].length * CELL}
        height={maze.layout.length * CELL}
        style={{
          borderRadius: 8,
          border: "1px solid oklch(0.78 0.22 195 / 0.25)",
          display: "block",
        }}
      />

      <div className="flex items-center gap-4">
        <button
          type="button"
          data-ocid="maze.secondary_button"
          onClick={handleRestart}
          className="px-5 py-2 rounded-lg text-xs font-bold tracking-widest transition-all hover:scale-105"
          style={{
            background: "oklch(0.78 0.22 195 / 0.15)",
            border: "1px solid oklch(0.78 0.22 195 / 0.5)",
            color: "oklch(0.78 0.22 195)",
          }}
        >
          RESTART
        </button>

        {/* D-pad */}
        <div className="grid grid-cols-3 gap-1">
          {D_PAD_KEYS.map((btn) => (
            <button
              key={`dpad-${btn.label || btn.key}`}
              type="button"
              onClick={() => {
                const dirMap: Record<string, [number, number]> = {
                  ArrowUp: [0, -1],
                  ArrowDown: [0, 1],
                  ArrowLeft: [-1, 0],
                  ArrowRight: [1, 0],
                };
                const dir = dirMap[btn.key];
                if (dir) move(dir[0], dir[1]);
              }}
              disabled={!btn.key}
              className={`w-8 h-8 rounded text-xs font-bold transition-all ${
                btn.key
                  ? "bg-white/10 hover:bg-white/20 border border-white/20 text-white hover:scale-110"
                  : "invisible"
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ColtMaze;
