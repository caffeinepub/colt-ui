import { ArrowLeft, Gamepad2, Settings } from "lucide-react";
import type React from "react";
import { useState } from "react";
import GlassCard from "../GlassCard";
import ColtAsteroids from "../games/ColtAsteroids";
import ColtBreakout from "../games/ColtBreakout";
import ColtClicker from "../games/ColtClicker";
import ColtDodge from "../games/ColtDodge";
import ColtMaze from "../games/ColtMaze";
import ColtMemory from "../games/ColtMemory";
import ColtPong from "../games/ColtPong";
import ColtRacer from "../games/ColtRacer";
import ColtSlide from "../games/ColtSlide";
import ColtSpeedType from "../games/ColtSpeedType";
import ColtTetris from "../games/ColtTetris";
import FlappyColt from "../games/FlappyColt";
import SnakeGame from "../games/SnakeGame";

type Difficulty = "easy" | "normal" | "hard";

interface GameEntry {
  id: string;
  name: string;
  description: string;
  emoji: string;
  accentColor: string;
  hasDifficulty: boolean;
  component: React.FC<{ difficulty?: Difficulty }>;
}

const GAMES: GameEntry[] = [
  {
    id: "flappy-colt",
    name: "Flappy Colt",
    description:
      "Dodge the neon pipes in this cyberpunk bird adventure. Tap to flap!",
    emoji: "🐦",
    accentColor: "#00e5ff",
    hasDifficulty: true,
    component: FlappyColt as React.FC<{ difficulty?: Difficulty }>,
  },
  {
    id: "neon-snake",
    name: "Neon Snake",
    description: "Classic snake with a glowing neon twist. Eat, grow, survive!",
    emoji: "🐍",
    accentColor: "#00ff88",
    hasDifficulty: true,
    component: SnakeGame as React.FC<{ difficulty?: Difficulty }>,
  },
  {
    id: "colt-pong",
    name: "Colt Pong",
    description:
      "Classic paddle battle against a CPU opponent. First to 7 wins!",
    emoji: "🏓",
    accentColor: "#ff00ff",
    hasDifficulty: false,
    component: ColtPong as React.FC<{ difficulty?: Difficulty }>,
  },
  {
    id: "colt-tetris",
    name: "Colt Tetris",
    description:
      "Stack glowing neon tetrominoes and clear lines before the stack reaches the top!",
    emoji: "🟪",
    accentColor: "#aa00ff",
    hasDifficulty: false,
    component: ColtTetris as React.FC<{ difficulty?: Difficulty }>,
  },
  {
    id: "colt-breakout",
    name: "Colt Breakout",
    description:
      "Smash through neon brick walls with your paddle and ball. 3 lives!",
    emoji: "🧱",
    accentColor: "#ffcc00",
    hasDifficulty: false,
    component: ColtBreakout as React.FC<{ difficulty?: Difficulty }>,
  },
  {
    id: "colt-asteroids",
    name: "Colt Asteroids",
    description:
      "Pilot your ship through waves of neon asteroids. Shoot to survive!",
    emoji: "🚀",
    accentColor: "#ff8800",
    hasDifficulty: true,
    component: ColtAsteroids as React.FC<{ difficulty?: Difficulty }>,
  },
  {
    id: "colt-racer",
    name: "Colt Racer",
    description:
      "Dodge oncoming traffic at breakneck speed. How far can you go?",
    emoji: "🏎️",
    accentColor: "#00e5ff",
    hasDifficulty: true,
    component: ColtRacer as React.FC<{ difficulty?: Difficulty }>,
  },
  {
    id: "colt-memory",
    name: "Colt Memory",
    description: "Flip cards and find matching emoji pairs. Train your memory!",
    emoji: "🧠",
    accentColor: "#ff00aa",
    hasDifficulty: false,
    component: ColtMemory as React.FC<{ difficulty?: Difficulty }>,
  },
  {
    id: "colt-speed-type",
    name: "Colt Speed Type",
    description:
      "Race against the clock! Type sentences as fast as you can for max WPM.",
    emoji: "⌨️",
    accentColor: "#00ff88",
    hasDifficulty: false,
    component: ColtSpeedType as React.FC<{ difficulty?: Difficulty }>,
  },
  {
    id: "colt-maze",
    name: "Colt Maze",
    description:
      "Navigate through a glowing neon maze. Find the exit with arrow keys!",
    emoji: "🗺️",
    accentColor: "#aa00ff",
    hasDifficulty: false,
    component: ColtMaze as React.FC<{ difficulty?: Difficulty }>,
  },
  {
    id: "colt-dodge",
    name: "Colt Dodge",
    description:
      "Dodge falling neon blocks and survive as long as possible. 3 lives!",
    emoji: "🎯",
    accentColor: "#ff2255",
    hasDifficulty: true,
    component: ColtDodge as React.FC<{ difficulty?: Difficulty }>,
  },
  {
    id: "colt-slide",
    name: "Colt Slide",
    description: "Solve the classic 15-tile sliding puzzle. Click to move!",
    emoji: "🔢",
    accentColor: "#ffcc00",
    hasDifficulty: false,
    component: ColtSlide as React.FC<{ difficulty?: Difficulty }>,
  },
  {
    id: "colt-clicker",
    name: "Colt Clicker",
    description:
      "Click the COLT button to earn Colt Coins! Buy upgrades and go idle. How many can you collect?",
    emoji: "🖱️",
    accentColor: "#ffdd00",
    hasDifficulty: false,
    component: ColtClicker as React.FC<{ difficulty?: Difficulty }>,
  },
];

const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  easy: "😊 Easy",
  normal: "⚔️ Normal",
  hard: "💀 Hard",
};

const DIFFICULTY_COLORS: Record<Difficulty, string> = {
  easy: "#00ff88",
  normal: "#00e5ff",
  hard: "#ff2255",
};

const GamesTab: React.FC = () => {
  const [activeGame, setActiveGame] = useState<GameEntry | null>(null);
  const [gameSettings, setGameSettings] = useState<Record<string, Difficulty>>(
    {},
  );
  const [openSettingsFor, setOpenSettingsFor] = useState<string | null>(null);

  if (activeGame) {
    const GameComponent = activeGame.component;
    const diff = gameSettings[activeGame.id] ?? "normal";
    return (
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            data-ocid="games.back.button"
            onClick={() => setActiveGame(null)}
            className="flex items-center gap-2 px-3 py-1.5 rounded font-display text-xs tracking-widest border border-white/10 text-muted-foreground hover:text-foreground hover:border-white/30 transition-all"
          >
            <ArrowLeft size={14} />
            BACK
          </button>
          <span
            className="font-display text-sm tracking-widest"
            style={{
              color: activeGame.accentColor,
              textShadow: `0 0 10px ${activeGame.accentColor}88`,
            }}
          >
            {activeGame.emoji} {activeGame.name.toUpperCase()}
          </span>
          {activeGame.hasDifficulty && (
            <span
              className="text-xs px-2 py-0.5 rounded-full font-bold border"
              style={{
                color: DIFFICULTY_COLORS[diff],
                borderColor: `${DIFFICULTY_COLORS[diff]}55`,
                background: `${DIFFICULTY_COLORS[diff]}11`,
              }}
            >
              {DIFFICULTY_LABELS[diff]}
            </span>
          )}
        </div>
        <div className="flex justify-center">
          <GameComponent difficulty={diff} />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <Gamepad2 size={20} className="text-neon-cyan" />
        <h2 className="font-display text-lg tracking-widest text-foreground">
          ARCADE
        </h2>
        <span className="text-xs text-muted-foreground font-body ml-1">
          — {GAMES.length} games available
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {GAMES.map((game) => {
          const diff = gameSettings[game.id] ?? "normal";
          const isSettingsOpen = openSettingsFor === game.id;
          return (
            <GlassCard
              key={game.id}
              hoverable
              neonColor="cyan"
              className="p-5 flex flex-col gap-3 group transition-all duration-200 relative"
            >
              <button
                type="button"
                className="flex items-center gap-3 cursor-pointer w-full text-left bg-transparent border-0 p-0"
                onClick={() => {
                  setActiveGame(game);
                }}
                style={{ cursor: "none" }}
              >
                <span className="text-3xl">{game.emoji}</span>
                <div>
                  <h3
                    className="font-display text-sm tracking-wider"
                    style={{
                      color: game.accentColor,
                      textShadow: `0 0 8px ${game.accentColor}66`,
                    }}
                  >
                    {game.name.toUpperCase()}
                  </h3>
                  <div
                    className="h-0.5 w-0 group-hover:w-full transition-all duration-300 mt-0.5 rounded-full"
                    style={{
                      background: game.accentColor,
                      boxShadow: `0 0 6px ${game.accentColor}`,
                    }}
                  />
                </div>
              </button>
              <p className="text-xs text-muted-foreground font-body leading-relaxed">
                {game.description}
              </p>

              <div className="flex items-center justify-between mt-auto gap-2">
                <button
                  type="button"
                  data-ocid="games.primary_button"
                  onClick={() => {
                    setActiveGame(game);
                  }}
                  className="text-xs font-display tracking-widest px-3 py-1 rounded-lg border transition-all hover:scale-105"
                  style={{
                    color: game.accentColor,
                    borderColor: `${game.accentColor}44`,
                    background: `${game.accentColor}11`,
                    cursor: "none",
                  }}
                >
                  PLAY →
                </button>

                {game.hasDifficulty && (
                  <div className="relative">
                    <button
                      type="button"
                      data-ocid="games.secondary_button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenSettingsFor(isSettingsOpen ? null : game.id);
                      }}
                      className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs border border-white/10 text-gray-400 hover:border-white/30 hover:text-white transition-all"
                      style={{ cursor: "none" }}
                      title="Game settings"
                    >
                      <Settings size={11} />
                      <span
                        style={{
                          color: DIFFICULTY_COLORS[diff],
                          textShadow: `0 0 6px ${DIFFICULTY_COLORS[diff]}88`,
                        }}
                      >
                        {diff.toUpperCase()}
                      </span>
                    </button>

                    {isSettingsOpen && (
                      <div
                        className="absolute bottom-full mb-1 right-0 z-50 bg-[#0a0a1a] border border-white/20 rounded-xl p-2 flex flex-col gap-1 shadow-xl"
                        data-ocid="games.dropdown_menu"
                      >
                        <p className="text-xs text-gray-400 px-2 pb-1 border-b border-white/10">
                          Difficulty
                        </p>
                        {(["easy", "normal", "hard"] as Difficulty[]).map(
                          (d) => (
                            <button
                              key={d}
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setGameSettings((prev) => ({
                                  ...prev,
                                  [game.id]: d,
                                }));
                                setOpenSettingsFor(null);
                              }}
                              className={`px-3 py-1.5 rounded-lg text-xs font-bold text-left transition-all hover:scale-[1.03] ${
                                diff === d ? "bg-white/10" : "hover:bg-white/5"
                              }`}
                              style={{
                                color: DIFFICULTY_COLORS[d],
                                cursor: "none",
                              }}
                            >
                              {DIFFICULTY_LABELS[d]}
                            </button>
                          ),
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </GlassCard>
          );
        })}
      </div>
    </div>
  );
};

export default GamesTab;
