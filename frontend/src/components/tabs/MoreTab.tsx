import React, { useState, useEffect, useRef, useCallback } from 'react';
import GlassCard from '../GlassCard';
import { Switch } from '@/components/ui/switch';
import {
  Info,
  Settings,
  Keyboard,
  Maximize,
  Minimize,
  FileText,
  Clock,
  Play,
  Square,
  RotateCcw,
  Save,
  Check,
} from 'lucide-react';
import { useGetPreferences } from '../../hooks/useQueries';
import { useSaveNotepad } from '../../hooks/useQueries';

interface MoreTabProps {
  accentColor: string;
  onAccentColorChange: (color: string) => void;
}

const accentOptions = [
  { label: 'Cyan', value: 'cyan', color: '#00e5ff' },
  { label: 'Green', value: 'green', color: '#00ff88' },
  { label: 'Purple', value: 'purple', color: '#a855f7' },
  { label: 'Pink', value: 'pink', color: '#ff00aa' },
];

const shortcuts = [
  { category: 'Flappy Colt', keys: ['Space', 'Click'], action: 'Flap / Jump' },
  { category: 'Flappy Colt', keys: ['R'], action: 'Restart after game over' },
  { category: 'Neon Snake', keys: ['↑ ↓ ← →'], action: 'Change direction' },
  { category: 'Neon Snake', keys: ['R'], action: 'Restart after game over' },
  { category: 'Navigation', keys: ['Tab'], action: 'Focus next element' },
  { category: 'Navigation', keys: ['Esc'], action: 'Close / Cancel' },
  { category: 'Proxy', keys: ['Enter'], action: 'Load URL' },
];

// ─── Clock & Stopwatch Widget ────────────────────────────────────────────────
function ClockWidget() {
  const [currentTime, setCurrentTime] = useState(() => new Date());
  const [swRunning, setSwRunning] = useState(false);
  const [swElapsed, setSwElapsed] = useState(0); // ms
  const swStartRef = useRef<number | null>(null);
  const swBaseRef = useRef<number>(0);
  const rafRef = useRef<number | null>(null);

  // Live clock
  useEffect(() => {
    const id = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  // Stopwatch via rAF
  const tick = useCallback(() => {
    if (swStartRef.current !== null) {
      setSwElapsed(swBaseRef.current + (Date.now() - swStartRef.current));
      rafRef.current = requestAnimationFrame(tick);
    }
  }, []);

  const startSw = () => {
    swStartRef.current = Date.now();
    setSwRunning(true);
    rafRef.current = requestAnimationFrame(tick);
  };

  const stopSw = () => {
    if (swStartRef.current !== null) {
      swBaseRef.current += Date.now() - swStartRef.current;
      swStartRef.current = null;
    }
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    setSwRunning(false);
  };

  const resetSw = () => {
    stopSw();
    swBaseRef.current = 0;
    setSwElapsed(0);
  };

  useEffect(() => {
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const pad = (n: number, digits = 2) => String(Math.floor(n)).padStart(digits, '0');
  const totalSec = swElapsed / 1000;
  const swMins = pad(totalSec / 60);
  const swSecs = pad(totalSec % 60);
  const swMs = pad((swElapsed % 1000) / 10);

  const timeStr = currentTime.toLocaleTimeString('en-US', { hour12: false });
  const dateStr = currentTime.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

  return (
    <GlassCard className="p-6">
      <div className="flex items-center gap-3 mb-4">
        <Clock className="text-neon-cyan" size={18} />
        <h3 className="font-display text-sm tracking-widest text-foreground">CLOCK & STOPWATCH</h3>
      </div>

      {/* Live Clock */}
      <div className="text-center mb-5">
        <div
          className="font-display text-4xl tracking-widest neon-text mb-1"
          style={{ textShadow: '0 0 20px oklch(0.78 0.22 195 / 0.8)' }}
        >
          {timeStr}
        </div>
        <div className="text-xs text-muted-foreground font-body tracking-widest uppercase">{dateStr}</div>
      </div>

      {/* Divider */}
      <div className="border-t border-border/30 mb-4" />

      {/* Stopwatch */}
      <div className="text-center mb-4">
        <div className="text-xs text-muted-foreground font-body tracking-widest mb-2">STOPWATCH</div>
        <div
          className="font-display text-3xl tracking-widest mb-4"
          style={{ color: swRunning ? 'oklch(0.82 0.22 145)' : 'oklch(0.78 0.22 195)', textShadow: swRunning ? '0 0 16px oklch(0.82 0.22 145 / 0.7)' : '0 0 16px oklch(0.78 0.22 195 / 0.5)' }}
        >
          {swMins}:{swSecs}<span className="text-lg opacity-70">.{swMs}</span>
        </div>
        <div className="flex justify-center gap-3">
          {!swRunning ? (
            <button
              onClick={startSw}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded font-display text-xs tracking-wider border border-neon-green text-neon-green transition-all hover:bg-neon-green/10"
              style={{ boxShadow: '0 0 8px oklch(0.82 0.22 145 / 0.3)' }}
            >
              <Play size={12} /> START
            </button>
          ) : (
            <button
              onClick={stopSw}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded font-display text-xs tracking-wider border border-neon-cyan text-neon-cyan transition-all hover:bg-neon-cyan/10"
              style={{ boxShadow: '0 0 8px oklch(0.78 0.22 195 / 0.3)' }}
            >
              <Square size={12} /> STOP
            </button>
          )}
          <button
            onClick={resetSw}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded font-display text-xs tracking-wider border border-border/50 text-muted-foreground transition-all hover:border-neon-cyan/50 hover:text-neon-cyan"
          >
            <RotateCcw size={12} /> RESET
          </button>
        </div>
      </div>
    </GlassCard>
  );
}

// ─── Notepad Widget ──────────────────────────────────────────────────────────
function NotepadWidget() {
  const { data: preferences } = useGetPreferences();
  const { mutate: saveNotepad, isPending } = useSaveNotepad();
  const [text, setText] = useState('');
  const [savedIndicator, setSavedIndicator] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load from backend on mount
  useEffect(() => {
    if (preferences && !initialized) {
      setText(preferences.notepad ?? '');
      setInitialized(true);
    }
  }, [preferences, initialized]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setText(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      saveNotepad(val, {
        onSuccess: () => {
          setSavedIndicator(true);
          setTimeout(() => setSavedIndicator(false), 2000);
        },
      });
    }, 800);
  };

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  return (
    <GlassCard className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <FileText className="text-neon-cyan" size={18} />
          <h3 className="font-display text-sm tracking-widest text-foreground">NOTEPAD</h3>
        </div>
        <div className="flex items-center gap-2 h-5">
          {isPending && (
            <span className="text-xs font-body text-muted-foreground tracking-wider flex items-center gap-1">
              <Save size={10} className="animate-pulse" /> SAVING…
            </span>
          )}
          {savedIndicator && !isPending && (
            <span className="text-xs font-body text-neon-green tracking-wider flex items-center gap-1">
              <Check size={10} /> SAVED
            </span>
          )}
        </div>
      </div>
      <textarea
        value={text}
        onChange={handleChange}
        placeholder="Start typing your notes here… they're saved automatically."
        className="w-full h-40 bg-transparent border border-border/40 rounded p-3 text-sm font-body text-foreground placeholder:text-muted-foreground/50 resize-none focus:outline-none focus:border-neon-cyan/60 transition-colors"
        style={{
          background: 'oklch(0.12 0.02 240 / 0.5)',
          boxShadow: 'inset 0 0 12px oklch(0.78 0.22 195 / 0.05)',
        }}
      />
      <p className="text-xs text-muted-foreground font-body mt-2 tracking-wider">
        {text.length} CHARS · AUTO-SAVED TO BACKEND
      </p>
    </GlassCard>
  );
}

// ─── Fullscreen Widget ───────────────────────────────────────────────────────
function FullscreenWidget() {
  const [isFullscreen, setIsFullscreen] = useState(!!document.fullscreenElement);

  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handler);
    return () => document.removeEventListener('fullscreenchange', handler);
  }, []);

  const toggle = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch {
      // Fullscreen not supported or denied
    }
  };

  return (
    <GlassCard className="p-6 flex flex-col items-center justify-center text-center gap-4">
      <div className="flex items-center gap-3 w-full">
        {isFullscreen ? (
          <Minimize className="text-neon-cyan" size={18} />
        ) : (
          <Maximize className="text-neon-cyan" size={18} />
        )}
        <h3 className="font-display text-sm tracking-widest text-foreground">FULLSCREEN</h3>
      </div>
      <div className="w-full flex flex-col items-center gap-3 py-2">
        <div
          className="w-16 h-16 rounded border-2 border-neon-cyan flex items-center justify-center"
          style={{ boxShadow: '0 0 20px oklch(0.78 0.22 195 / 0.3)' }}
        >
          {isFullscreen ? (
            <Minimize size={28} className="text-neon-cyan" />
          ) : (
            <Maximize size={28} className="text-neon-cyan" />
          )}
        </div>
        <p className="text-xs text-muted-foreground font-body tracking-wider">
          {isFullscreen ? 'CURRENTLY IN FULLSCREEN MODE' : 'WINDOWED MODE ACTIVE'}
        </p>
        <button
          onClick={toggle}
          className="px-6 py-2 rounded font-display text-xs tracking-widest border border-neon-cyan text-neon-cyan transition-all hover:bg-neon-cyan/10 active:scale-95"
          style={{ boxShadow: '0 0 12px oklch(0.78 0.22 195 / 0.3)' }}
        >
          {isFullscreen ? 'EXIT FULLSCREEN' : 'ENTER FULLSCREEN'}
        </button>
      </div>
    </GlassCard>
  );
}

// ─── Keyboard Shortcuts Widget ───────────────────────────────────────────────
function KeyboardShortcutsWidget() {
  const categories = Array.from(new Set(shortcuts.map((s) => s.category)));

  return (
    <GlassCard className="p-6">
      <div className="flex items-center gap-3 mb-4">
        <Keyboard className="text-neon-cyan" size={18} />
        <h3 className="font-display text-sm tracking-widest text-foreground">KEYBOARD SHORTCUTS</h3>
      </div>
      <div className="space-y-4">
        {categories.map((cat) => (
          <div key={cat}>
            <p className="text-xs text-muted-foreground font-body tracking-widest mb-2 uppercase">{cat}</p>
            <div className="space-y-1.5">
              {shortcuts
                .filter((s) => s.category === cat)
                .map((s, i) => (
                  <div key={i} className="flex items-center justify-between gap-4">
                    <span className="text-xs font-body text-foreground/80">{s.action}</span>
                    <div className="flex gap-1 shrink-0">
                      {s.keys.map((k) => (
                        <kbd
                          key={k}
                          className="px-2 py-0.5 rounded text-xs font-display tracking-wider border border-neon-cyan/40 text-neon-cyan"
                          style={{
                            background: 'oklch(0.78 0.22 195 / 0.08)',
                            boxShadow: '0 0 6px oklch(0.78 0.22 195 / 0.15)',
                          }}
                        >
                          {k}
                        </kbd>
                      ))}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </GlassCard>
  );
}

// ─── Main MoreTab ────────────────────────────────────────────────────────────
const MoreTab: React.FC<MoreTabProps> = ({ accentColor, onAccentColorChange }) => {
  const [particlesEnabled, setParticlesEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [glowEnabled, setGlowEnabled] = useState(true);

  return (
    <div className="animate-fade-in-up space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* About */}
        <GlassCard className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <Info className="text-neon-cyan" size={18} />
            <h3 className="font-display text-sm tracking-widest text-foreground">ABOUT COLT UI</h3>
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div
                className="w-8 h-8 rounded border border-neon-cyan flex items-center justify-center"
                style={{ boxShadow: '0 0 8px oklch(0.78 0.22 195 / 0.5)' }}
              >
                <span className="font-display text-xs text-neon-cyan font-bold">C</span>
              </div>
              <span className="font-display text-base tracking-widest neon-text">COLT UI</span>
            </div>
            <p className="text-sm text-muted-foreground font-body leading-relaxed">
              Colt UI is a next-generation entertainment hub built for the modern web. Browse the internet, play games, listen to music, and more — all in one sleek, neon-powered interface.
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              {['Games', 'Proxy', 'Music', 'Dark Theme', 'Custom Cursor'].map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 text-xs font-body rounded glass border border-border/50 text-muted-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>
            <div className="pt-2 border-t border-border/30">
              <p className="text-xs text-muted-foreground font-body">Version 1.0.0 · Built on ICP</p>
            </div>
          </div>
        </GlassCard>

        {/* Settings */}
        <GlassCard className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <Settings className="text-neon-cyan" size={18} />
            <h3 className="font-display text-sm tracking-widest text-foreground">SETTINGS</h3>
          </div>
          <div className="space-y-4">
            {/* Accent Color */}
            <div>
              <p className="text-xs text-muted-foreground font-body tracking-wider mb-2">ACCENT COLOR</p>
              <div className="flex gap-2">
                {accentOptions.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => onAccentColorChange(opt.value)}
                    className="w-8 h-8 rounded-full border-2 transition-all duration-200"
                    style={{
                      background: opt.color,
                      borderColor: accentColor === opt.value ? opt.color : 'transparent',
                      boxShadow: accentColor === opt.value ? `0 0 10px ${opt.color}` : 'none',
                      transform: accentColor === opt.value ? 'scale(1.2)' : 'scale(1)',
                    }}
                    title={opt.label}
                  />
                ))}
              </div>
            </div>

            {/* Toggles */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-body text-foreground">Particle Effects</p>
                  <p className="text-xs text-muted-foreground font-body">Animated background particles</p>
                </div>
                <Switch checked={particlesEnabled} onCheckedChange={setParticlesEnabled} />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-body text-foreground">Neon Glow</p>
                  <p className="text-xs text-muted-foreground font-body">UI glow effects</p>
                </div>
                <Switch checked={glowEnabled} onCheckedChange={setGlowEnabled} />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-body text-foreground">Sound Effects</p>
                  <p className="text-xs text-muted-foreground font-body">UI interaction sounds</p>
                </div>
                <Switch checked={soundEnabled} onCheckedChange={setSoundEnabled} />
              </div>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* New Feature Widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ClockWidget />
        <NotepadWidget />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <KeyboardShortcutsWidget />
        <FullscreenWidget />
      </div>
    </div>
  );
};

export default MoreTab;
