import React, { useEffect, useRef, useState, useCallback } from 'react';

const COLS = 10;
const ROWS = 20;
const CELL = 26;
const W = COLS * CELL;
const H = ROWS * CELL;

type GameState = 'idle' | 'playing' | 'dead';
type Board = (string | null)[][];

const TETROMINOES = [
  { shape: [[1,1,1,1]], color: '#00e5ff' },           // I
  { shape: [[1,1],[1,1]], color: '#ffcc00' },           // O
  { shape: [[0,1,0],[1,1,1]], color: '#aa00ff' },       // T
  { shape: [[1,0,0],[1,1,1]], color: '#ff8800' },       // L
  { shape: [[0,0,1],[1,1,1]], color: '#0055ff' },       // J
  { shape: [[0,1,1],[1,1,0]], color: '#00ff88' },       // S
  { shape: [[1,1,0],[0,1,1]], color: '#ff0055' },       // Z
];

function emptyBoard(): Board {
  return Array.from({ length: ROWS }, () => Array(COLS).fill(null));
}

function rotate(shape: number[][]): number[][] {
  const rows = shape.length;
  const cols = shape[0].length;
  const result: number[][] = Array.from({ length: cols }, () => Array(rows).fill(0));
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      result[c][rows - 1 - r] = shape[r][c];
    }
  }
  return result;
}

interface Piece {
  shape: number[][];
  color: string;
  x: number;
  y: number;
}

function newPiece(): Piece {
  const t = TETROMINOES[Math.floor(Math.random() * TETROMINOES.length)];
  return { shape: t.shape, color: t.color, x: Math.floor(COLS / 2) - Math.floor(t.shape[0].length / 2), y: 0 };
}

function collides(board: Board, piece: Piece, dx = 0, dy = 0, shape?: number[][]): boolean {
  const s = shape || piece.shape;
  for (let r = 0; r < s.length; r++) {
    for (let c = 0; c < s[r].length; c++) {
      if (!s[r][c]) continue;
      const nx = piece.x + c + dx;
      const ny = piece.y + r + dy;
      if (nx < 0 || nx >= COLS || ny >= ROWS) return true;
      if (ny >= 0 && board[ny][nx]) return true;
    }
  }
  return false;
}

const ColtTetris: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const boardRef = useRef<Board>(emptyBoard());
  const pieceRef = useRef<Piece>(newPiece());
  const nextPieceRef = useRef<Piece>(newPiece());
  const scoreRef = useRef(0);
  const linesRef = useRef(0);
  const stateRef = useRef<GameState>('idle');
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const rafRef = useRef<number>(0);
  const frameRef = useRef(0);

  const [displayScore, setDisplayScore] = useState(0);
  const [displayLines, setDisplayLines] = useState(0);
  const [gameState, setGameState] = useState<GameState>('idle');
  const [bestScore, setBestScore] = useState(0);

  const getSpeed = () => Math.max(100, 500 - Math.floor(linesRef.current / 5) * 40);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    frameRef.current++;

    ctx.fillStyle = '#050d1a';
    ctx.fillRect(0, 0, W, H);

    // Grid
    ctx.strokeStyle = 'rgba(0, 229, 255, 0.05)';
    ctx.lineWidth = 1;
    for (let x = 0; x <= W; x += CELL) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
    }
    for (let y = 0; y <= H; y += CELL) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
    }

    // Board cells
    const board = boardRef.current;
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        if (board[r][c]) {
          const color = board[r][c]!;
          ctx.save();
          ctx.shadowColor = color;
          ctx.shadowBlur = 8;
          ctx.fillStyle = color;
          ctx.fillRect(c * CELL + 1, r * CELL + 1, CELL - 2, CELL - 2);
          ctx.strokeStyle = 'rgba(255,255,255,0.3)';
          ctx.lineWidth = 1;
          ctx.strokeRect(c * CELL + 1, r * CELL + 1, CELL - 2, CELL - 2);
          ctx.restore();
        }
      }
    }

    // Ghost piece
    const piece = pieceRef.current;
    if (stateRef.current === 'playing') {
      let ghostY = 0;
      while (!collides(board, piece, 0, ghostY + 1)) ghostY++;
      piece.shape.forEach((row, r) => {
        row.forEach((cell, c) => {
          if (cell) {
            ctx.fillStyle = `${piece.color}33`;
            ctx.strokeStyle = `${piece.color}66`;
            ctx.lineWidth = 1;
            ctx.fillRect((piece.x + c) * CELL + 1, (piece.y + r + ghostY) * CELL + 1, CELL - 2, CELL - 2);
            ctx.strokeRect((piece.x + c) * CELL + 1, (piece.y + r + ghostY) * CELL + 1, CELL - 2, CELL - 2);
          }
        });
      });
    }

    // Active piece
    piece.shape.forEach((row, r) => {
      row.forEach((cell, c) => {
        if (cell) {
          ctx.save();
          ctx.shadowColor = piece.color;
          ctx.shadowBlur = 14;
          ctx.fillStyle = piece.color;
          ctx.fillRect((piece.x + c) * CELL + 1, (piece.y + r) * CELL + 1, CELL - 2, CELL - 2);
          ctx.strokeStyle = 'rgba(255,255,255,0.5)';
          ctx.lineWidth = 1.5;
          ctx.strokeRect((piece.x + c) * CELL + 1, (piece.y + r) * CELL + 1, CELL - 2, CELL - 2);
          ctx.restore();
        }
      });
    });

    // Border glow
    ctx.strokeStyle = 'rgba(0, 229, 255, 0.3)';
    ctx.lineWidth = 2;
    ctx.shadowColor = '#00e5ff';
    ctx.shadowBlur = 8;
    ctx.strokeRect(1, 1, W - 2, H - 2);
    ctx.shadowBlur = 0;

    if (stateRef.current === 'idle') {
      ctx.fillStyle = 'rgba(5, 13, 26, 0.82)';
      ctx.fillRect(0, 0, W, H);
      ctx.font = 'bold 22px Orbitron, monospace';
      ctx.textAlign = 'center';
      ctx.fillStyle = '#aa00ff';
      ctx.shadowColor = '#aa00ff';
      ctx.shadowBlur = 22;
      ctx.fillText('COLT TETRIS', W / 2, H / 2 - 30);
      ctx.shadowBlur = 0;
      ctx.font = '13px Rajdhani, sans-serif';
      ctx.fillStyle = 'rgba(255,255,255,0.7)';
      ctx.fillText('PRESS ARROW KEYS TO START', W / 2, H / 2 + 10);
    }
  }, []);

  const lockPiece = useCallback(() => {
    const board = boardRef.current;
    const piece = pieceRef.current;
    piece.shape.forEach((row, r) => {
      row.forEach((cell, c) => {
        if (cell) {
          const ny = piece.y + r;
          if (ny >= 0) board[ny][piece.x + c] = piece.color;
        }
      });
    });

    // Clear lines
    let cleared = 0;
    for (let r = ROWS - 1; r >= 0; r--) {
      if (board[r].every((c) => c !== null)) {
        board.splice(r, 1);
        board.unshift(Array(COLS).fill(null));
        cleared++;
        r++;
      }
    }
    if (cleared > 0) {
      const points = [0, 100, 300, 500, 800][cleared] || 800;
      scoreRef.current += points;
      linesRef.current += cleared;
      setDisplayScore(scoreRef.current);
      setDisplayLines(linesRef.current);
    }

    // Next piece
    pieceRef.current = nextPieceRef.current;
    nextPieceRef.current = newPiece();

    if (collides(board, pieceRef.current)) {
      stateRef.current = 'dead';
      setGameState('dead');
      setBestScore((prev) => Math.max(prev, scoreRef.current));
    }
  }, []);

  const tick = useCallback(() => {
    if (stateRef.current !== 'playing') return;
    const piece = pieceRef.current;
    if (!collides(boardRef.current, piece, 0, 1)) {
      piece.y++;
    } else {
      lockPiece();
    }
    draw();
  }, [draw, lockPiece]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (['ArrowLeft', 'ArrowRight', 'ArrowDown', 'ArrowUp', 'Space'].includes(e.key)) {
        e.preventDefault();
      }

      if (stateRef.current === 'idle') {
        stateRef.current = 'playing';
        setGameState('playing');
        return;
      }
      if (stateRef.current !== 'playing') return;

      const piece = pieceRef.current;
      const board = boardRef.current;

      if (e.key === 'ArrowLeft' && !collides(board, piece, -1, 0)) {
        piece.x--;
      } else if (e.key === 'ArrowRight' && !collides(board, piece, 1, 0)) {
        piece.x++;
      } else if (e.key === 'ArrowDown') {
        if (!collides(board, piece, 0, 1)) piece.y++;
        else lockPiece();
      } else if (e.key === 'ArrowUp' || e.key === 'z' || e.key === 'Z') {
        const rotated = rotate(piece.shape);
        if (!collides(board, piece, 0, 0, rotated)) {
          piece.shape = rotated;
        } else if (!collides(board, piece, 1, 0, rotated)) {
          piece.shape = rotated; piece.x++;
        } else if (!collides(board, piece, -1, 0, rotated)) {
          piece.shape = rotated; piece.x--;
        }
      } else if (e.key === ' ') {
        // Hard drop
        while (!collides(board, piece, 0, 1)) piece.y++;
        lockPiece();
      }
      draw();
    };

    window.addEventListener('keydown', handleKey);

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
  }, [draw, lockPiece]);

  useEffect(() => {
    if (gameState === 'playing') {
      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = setInterval(tick, getSpeed());
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [gameState, tick, displayLines]);

  const handleRestart = useCallback(() => {
    boardRef.current = emptyBoard();
    pieceRef.current = newPiece();
    nextPieceRef.current = newPiece();
    scoreRef.current = 0;
    linesRef.current = 0;
    frameRef.current = 0;
    setDisplayScore(0);
    setDisplayLines(0);
    stateRef.current = 'playing';
    setGameState('playing');
  }, []);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex items-center gap-6 font-display text-sm tracking-wider">
        <span className="text-muted-foreground">SCORE: <span style={{ color: '#aa00ff' }}>{displayScore}</span></span>
        <span className="text-muted-foreground">LINES: <span className="text-neon-cyan">{displayLines}</span></span>
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
            border: '1px solid oklch(0.5 0.3 300 / 0.4)',
            boxShadow: '0 0 20px oklch(0.5 0.3 300 / 0.3)',
            maxWidth: '100%',
          }}
        />
        {gameState === 'dead' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center" style={{ background: 'rgba(5,13,26,0.88)' }}>
            <p className="font-display text-2xl tracking-widest mb-2" style={{ color: '#ff0055', textShadow: '0 0 20px #ff0055' }}>GAME OVER</p>
            <p className="font-body text-muted-foreground mb-1">Score: <span style={{ color: '#aa00ff' }} className="font-bold">{displayScore}</span></p>
            <p className="font-body text-muted-foreground mb-6">Best: <span className="text-neon-green font-bold">{bestScore}</span></p>
            <button
              onClick={handleRestart}
              className="px-6 py-2 font-display text-xs tracking-widest rounded border transition-all"
              style={{ borderColor: '#aa00ff', color: '#aa00ff', boxShadow: '0 0 10px #aa00ff44' }}
            >
              RESTART
            </button>
          </div>
        )}
      </div>
      <p className="text-xs text-muted-foreground font-body tracking-wider">
        ← → MOVE · ↑ ROTATE · ↓ SOFT DROP · SPACE HARD DROP
      </p>
    </div>
  );
};

export default ColtTetris;
