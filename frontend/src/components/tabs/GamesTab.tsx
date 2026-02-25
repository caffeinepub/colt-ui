import React, { useState } from 'react';
import GlassCard from '../GlassCard';
import FlappyColt from '../games/FlappyColt';
import SnakeGame from '../games/SnakeGame';
import ColtPong from '../games/ColtPong';
import ColtTetris from '../games/ColtTetris';
import ColtBreakout from '../games/ColtBreakout';
import ColtAsteroids from '../games/ColtAsteroids';
import ColtRacer from '../games/ColtRacer';
import { ArrowLeft, Gamepad2 } from 'lucide-react';

interface GameEntry {
  id: string;
  name: string;
  description: string;
  emoji: string;
  accentColor: string;
  component: React.FC;
}

const GAMES: GameEntry[] = [
  {
    id: 'flappy-colt',
    name: 'Flappy Colt',
    description: 'Dodge the neon pipes in this cyberpunk bird adventure. Tap to flap!',
    emoji: '🐦',
    accentColor: '#00e5ff',
    component: FlappyColt,
  },
  {
    id: 'neon-snake',
    name: 'Neon Snake',
    description: 'Classic snake with a glowing neon twist. Eat, grow, survive!',
    emoji: '🐍',
    accentColor: '#00ff88',
    component: SnakeGame,
  },
  {
    id: 'colt-pong',
    name: 'Colt Pong',
    description: 'Classic paddle battle against a CPU opponent. First to 7 wins!',
    emoji: '🏓',
    accentColor: '#ff00ff',
    component: ColtPong,
  },
  {
    id: 'colt-tetris',
    name: 'Colt Tetris',
    description: 'Stack glowing neon tetrominoes and clear lines before the stack reaches the top!',
    emoji: '🟪',
    accentColor: '#aa00ff',
    component: ColtTetris,
  },
  {
    id: 'colt-breakout',
    name: 'Colt Breakout',
    description: 'Smash through neon brick walls with your paddle and ball. 3 lives!',
    emoji: '🧱',
    accentColor: '#ffcc00',
    component: ColtBreakout,
  },
  {
    id: 'colt-asteroids',
    name: 'Colt Asteroids',
    description: 'Pilot your ship through waves of neon asteroids. Shoot to survive!',
    emoji: '🚀',
    accentColor: '#ff8800',
    component: ColtAsteroids,
  },
  {
    id: 'colt-racer',
    name: 'Colt Racer',
    description: 'Dodge oncoming traffic at breakneck speed. How far can you go?',
    emoji: '🏎️',
    accentColor: '#00e5ff',
    component: ColtRacer,
  },
];

const GamesTab: React.FC = () => {
  const [activeGame, setActiveGame] = useState<GameEntry | null>(null);

  if (activeGame) {
    const GameComponent = activeGame.component;
    return (
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveGame(null)}
            className="flex items-center gap-2 px-3 py-1.5 rounded font-display text-xs tracking-widest border border-white/10 text-muted-foreground hover:text-foreground hover:border-white/30 transition-all"
          >
            <ArrowLeft size={14} />
            BACK
          </button>
          <span
            className="font-display text-sm tracking-widest"
            style={{ color: activeGame.accentColor, textShadow: `0 0 10px ${activeGame.accentColor}88` }}
          >
            {activeGame.emoji} {activeGame.name.toUpperCase()}
          </span>
        </div>
        <div className="flex justify-center">
          <GameComponent />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <Gamepad2 size={20} className="text-neon-cyan" />
        <h2 className="font-display text-lg tracking-widest text-foreground">ARCADE</h2>
        <span className="text-xs text-muted-foreground font-body ml-1">— {GAMES.length} games available</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {GAMES.map((game) => (
          <GlassCard
            key={game.id}
            hoverable
            neonColor="cyan"
            className="cursor-pointer p-5 flex flex-col gap-3 group transition-all duration-200"
            onClick={() => setActiveGame(game)}
          >
            <div className="flex items-center gap-3">
              <span className="text-3xl">{game.emoji}</span>
              <div>
                <h3
                  className="font-display text-sm tracking-wider"
                  style={{ color: game.accentColor, textShadow: `0 0 8px ${game.accentColor}66` }}
                >
                  {game.name.toUpperCase()}
                </h3>
                <div
                  className="h-0.5 w-0 group-hover:w-full transition-all duration-300 mt-0.5 rounded-full"
                  style={{ background: game.accentColor, boxShadow: `0 0 6px ${game.accentColor}` }}
                />
              </div>
            </div>
            <p className="text-xs text-muted-foreground font-body leading-relaxed">
              {game.description}
            </p>
            <div className="flex items-center justify-end mt-auto">
              <span
                className="text-xs font-display tracking-widest opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ color: game.accentColor }}
              >
                PLAY →
              </span>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
};

export default GamesTab;
