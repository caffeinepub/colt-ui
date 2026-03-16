import type React from "react";
import { useCallback, useEffect, useState } from "react";

const SYMBOLS = ["🎮", "🕹️", "⚡", "🌈", "👑", "🎆", "💫", "✨"];

interface Card {
  id: number;
  symbol: string;
  flipped: boolean;
  matched: boolean;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function createDeck(): Card[] {
  const pairs = [...SYMBOLS, ...SYMBOLS];
  return shuffle(pairs).map((symbol, idx) => ({
    id: idx,
    symbol,
    flipped: false,
    matched: false,
  }));
}

const ColtMemory: React.FC = () => {
  const [cards, setCards] = useState<Card[]>(createDeck);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [locked, setLocked] = useState(false);
  const [won, setWon] = useState(false);

  const matchedCount = cards.filter((c) => c.matched).length;

  useEffect(() => {
    if (matchedCount === cards.length && cards.length > 0) {
      setWon(true);
    }
  }, [matchedCount, cards.length]);

  const handleFlip = useCallback(
    (id: number) => {
      if (locked) return;
      const card = cards.find((c) => c.id === id);
      if (!card || card.flipped || card.matched) return;
      if (flipped.length === 1 && flipped[0] === id) return;

      const newFlipped = [...flipped, id];
      setCards((prev) =>
        prev.map((c) => (c.id === id ? { ...c, flipped: true } : c)),
      );

      if (newFlipped.length === 2) {
        setMoves((m) => m + 1);
        setLocked(true);
        const [first, second] = newFlipped;
        const c1 = cards.find((c) => c.id === first)!;
        const c2 = { ...card };

        setTimeout(() => {
          if (c1.symbol === c2.symbol) {
            setCards((prev) =>
              prev.map((c) =>
                c.id === first || c.id === second ? { ...c, matched: true } : c,
              ),
            );
          } else {
            setCards((prev) =>
              prev.map((c) =>
                c.id === first || c.id === second
                  ? { ...c, flipped: false }
                  : c,
              ),
            );
          }
          setFlipped([]);
          setLocked(false);
        }, 700);

        setFlipped(newFlipped);
      } else {
        setFlipped(newFlipped);
      }
    },
    [cards, flipped, locked],
  );

  const handleRestart = () => {
    setCards(createDeck());
    setFlipped([]);
    setMoves(0);
    setLocked(false);
    setWon(false);
  };

  return (
    <div
      className="flex flex-col items-center gap-5 py-4 select-none"
      style={{ minWidth: 320 }}
    >
      <div className="flex items-center justify-between w-full max-w-sm">
        <div
          className="text-sm font-bold"
          style={{
            color: "oklch(0.78 0.22 195)",
            textShadow: "0 0 8px oklch(0.78 0.22 195 / 0.6)",
          }}
        >
          COLT MEMORY
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs text-gray-400">
            Moves: <span className="text-white font-bold">{moves}</span>
          </span>
          <span className="text-xs text-gray-400">
            Pairs:{" "}
            <span className="text-neon-green font-bold">
              {matchedCount / 2}/{SYMBOLS.length}
            </span>
          </span>
        </div>
      </div>

      {won && (
        <div
          className="text-center py-3 px-6 rounded-xl font-bold text-sm"
          style={{
            background: "oklch(0.55 0.22 140 / 0.2)",
            border: "1px solid oklch(0.55 0.22 140 / 0.5)",
            color: "oklch(0.78 0.30 140)",
            textShadow: "0 0 10px oklch(0.55 0.22 140 / 0.7)",
          }}
        >
          🎉 You Win! {moves} moves
        </div>
      )}

      <div className="grid grid-cols-4 gap-2">
        {cards.map((card) => (
          <button
            key={card.id}
            type="button"
            onClick={() => handleFlip(card.id)}
            className="w-16 h-16 rounded-xl text-2xl font-bold transition-all duration-200 hover:scale-105 active:scale-95"
            style={{
              background:
                card.flipped || card.matched
                  ? "oklch(0.18 0.08 200 / 0.9)"
                  : "oklch(0.12 0.04 240 / 0.8)",
              border: card.matched
                ? "2px solid oklch(0.55 0.22 140 / 0.8)"
                : card.flipped
                  ? "2px solid oklch(0.78 0.22 195 / 0.8)"
                  : "2px solid oklch(0.78 0.22 195 / 0.2)",
              boxShadow: card.matched
                ? "0 0 10px oklch(0.55 0.22 140 / 0.4)"
                : card.flipped
                  ? "0 0 10px oklch(0.78 0.22 195 / 0.4)"
                  : "none",
              cursor: card.matched ? "default" : "pointer",
              transform:
                card.flipped || card.matched
                  ? "rotateY(0deg)"
                  : "rotateY(0deg)",
            }}
          >
            {card.flipped || card.matched ? card.symbol : "?"}
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={handleRestart}
        className="px-5 py-2 rounded-lg text-xs font-bold tracking-widest transition-all hover:scale-105"
        style={{
          background: "oklch(0.78 0.22 195 / 0.15)",
          border: "1px solid oklch(0.78 0.22 195 / 0.5)",
          color: "oklch(0.78 0.22 195)",
        }}
      >
        NEW GAME
      </button>
    </div>
  );
};

export default ColtMemory;
