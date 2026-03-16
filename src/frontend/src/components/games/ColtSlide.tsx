import type React from "react";
import { useCallback, useState } from "react";

const SIZE = 4;
const TOTAL = SIZE * SIZE;

function isSolvable(tiles: number[]): boolean {
  let inversions = 0;
  const flat = tiles.filter((t) => t !== 0);
  for (let i = 0; i < flat.length; i++) {
    for (let j = i + 1; j < flat.length; j++) {
      if (flat[i] > flat[j]) inversions++;
    }
  }
  const blankRow = Math.floor(tiles.indexOf(0) / SIZE);
  const rowFromBottom = SIZE - blankRow;
  if (SIZE % 2 === 1) return inversions % 2 === 0;
  if (rowFromBottom % 2 === 0) return inversions % 2 === 1;
  return inversions % 2 === 0;
}

function createSolvedBoard(): number[] {
  return [...Array(TOTAL - 1).keys()].map((i) => i + 1).concat(0);
}

function shuffleBoard(): number[] {
  let tiles = createSolvedBoard();
  do {
    tiles = [...tiles];
    for (let i = tiles.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [tiles[i], tiles[j]] = [tiles[j], tiles[i]];
    }
  } while (!isSolvable(tiles) || isSolved(tiles));
  return tiles;
}

function isSolved(tiles: number[]): boolean {
  for (let i = 0; i < TOTAL - 1; i++) {
    if (tiles[i] !== i + 1) return false;
  }
  return tiles[TOTAL - 1] === 0;
}

const ColtSlide: React.FC = () => {
  const [tiles, setTiles] = useState<number[]>(shuffleBoard);
  const [moves, setMoves] = useState(0);
  const [won, setWon] = useState(false);

  const handleClick = useCallback(
    (idx: number) => {
      if (won) return;
      const blankIdx = tiles.indexOf(0);
      const row = Math.floor(idx / SIZE);
      const col = idx % SIZE;
      const bRow = Math.floor(blankIdx / SIZE);
      const bCol = blankIdx % SIZE;

      const adjacent =
        (Math.abs(row - bRow) === 1 && col === bCol) ||
        (Math.abs(col - bCol) === 1 && row === bRow);

      if (!adjacent) return;

      const newTiles = [...tiles];
      [newTiles[idx], newTiles[blankIdx]] = [newTiles[blankIdx], newTiles[idx]];
      setTiles(newTiles);
      setMoves((m) => m + 1);
      if (isSolved(newTiles)) setWon(true);
    },
    [tiles, won],
  );

  const handleShuffle = () => {
    setTiles(shuffleBoard());
    setMoves(0);
    setWon(false);
  };

  return (
    <div className="flex flex-col items-center gap-5 py-4 select-none">
      <div
        className="flex items-center justify-between w-full"
        style={{ maxWidth: 240 }}
      >
        <div
          className="text-sm font-bold"
          style={{
            color: "oklch(0.78 0.22 195)",
            textShadow: "0 0 8px oklch(0.78 0.22 195 / 0.6)",
          }}
        >
          COLT SLIDE
        </div>
        <span className="text-xs text-gray-400">
          Moves: <span className="text-white font-bold">{moves}</span>
        </span>
      </div>

      {won && (
        <div
          className="py-2 px-5 rounded-xl font-bold text-sm"
          style={{
            background: "oklch(0.55 0.22 140 / 0.2)",
            border: "1px solid oklch(0.55 0.22 140 / 0.5)",
            color: "oklch(0.78 0.30 140)",
          }}
        >
          🎉 Solved in {moves} moves!
        </div>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${SIZE}, 56px)`,
          gap: 6,
          padding: 8,
          background: "oklch(0.08 0.03 240 / 0.8)",
          borderRadius: 12,
          border: "1px solid oklch(0.78 0.22 195 / 0.2)",
        }}
      >
        {tiles.map((tile, idx) => {
          const row = Math.floor(idx / SIZE);
          const col = idx % SIZE;
          return (
            <button
              key={`cell-r${row}c${col}`}
              type="button"
              onClick={() => handleClick(idx)}
              disabled={tile === 0}
              className="transition-all duration-150"
              style={{
                width: 56,
                height: 56,
                borderRadius: 8,
                background:
                  tile === 0
                    ? "transparent"
                    : won
                      ? "oklch(0.45 0.20 140 / 0.4)"
                      : "oklch(0.18 0.08 200 / 0.9)",
                border:
                  tile === 0
                    ? "none"
                    : won
                      ? "2px solid oklch(0.55 0.22 140 / 0.8)"
                      : "2px solid oklch(0.78 0.22 195 / 0.4)",
                color: won ? "oklch(0.78 0.30 140)" : "oklch(0.92 0.05 200)",
                fontSize: 18,
                fontWeight: 700,
                cursor: tile === 0 ? "default" : "pointer",
                boxShadow: tile !== 0 ? "0 2px 8px rgba(0,0,0,0.4)" : "none",
                transform: tile === 0 ? "none" : "scale(1)",
              }}
            >
              {tile !== 0 ? tile : ""}
            </button>
          );
        })}
      </div>

      <button
        type="button"
        onClick={handleShuffle}
        className="px-5 py-2 rounded-lg text-xs font-bold tracking-widest transition-all hover:scale-105"
        style={{
          background: "oklch(0.78 0.22 195 / 0.15)",
          border: "1px solid oklch(0.78 0.22 195 / 0.5)",
          color: "oklch(0.78 0.22 195)",
        }}
      >
        SHUFFLE
      </button>
      <p className="text-xs text-gray-500">
        Click tiles adjacent to the empty space to slide them
      </p>
    </div>
  );
};

export default ColtSlide;
