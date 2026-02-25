import React, { useState, useEffect } from 'react';
import GlassCard from '../GlassCard';
import { useSavePreferences, useSaveNotepad, useGetPreferences } from '../../hooks/useQueries';
import { CursorStyle, BackgroundStyle, FontStyle, TabCloakPreset } from '../../backend';
import { setTabCloak, CLOAK_PRESETS, TabCloakPreset as CloakPresetType } from '../../utils/tabCloak';

interface MoreTabProps {
  accentColor: string;
  onAccentColorChange: (color: string) => void;
  cursorStyle: CursorStyle;
  onCursorStyleChange: (style: CursorStyle) => void;
  backgroundStyle: BackgroundStyle;
  onBackgroundStyleChange: (style: BackgroundStyle) => void;
  fontStyle: FontStyle;
  onFontStyleChange: (style: FontStyle) => void;
  cloakPreset: TabCloakPreset;
  onCloakPresetChange: (preset: TabCloakPreset) => void;
}

const ACCENT_COLORS = [
  { label: 'Cyan', value: 'cyan', class: 'bg-neon-cyan' },
  { label: 'Green', value: 'green', class: 'bg-neon-green' },
  { label: 'Purple', value: 'purple', class: 'bg-neon-purple' },
  { label: 'Pink', value: 'pink', class: 'bg-neon-pink' },
];

const CURSOR_OPTIONS = [
  { label: 'Neon Dot', value: CursorStyle.neonDot },
  { label: 'Crosshair', value: CursorStyle.crosshair },
  { label: 'Ring Pulse', value: CursorStyle.ringPulse },
  { label: 'Star Burst', value: CursorStyle.starBurst },
  { label: 'Arrow Glow', value: CursorStyle.arrowGlow },
];

const BACKGROUND_OPTIONS = [
  { label: 'Particle Grid', value: BackgroundStyle.particleGrid, isImage: false },
  { label: 'Neon Rain', value: BackgroundStyle.neonRain, isImage: false },
  { label: 'Matrix Code', value: BackgroundStyle.matrixCode, isImage: false },
  { label: 'Starfield', value: BackgroundStyle.starfield, isImage: false },
  { label: 'Solid Dark', value: BackgroundStyle.solidDark, isImage: false },
  { label: 'Cyber Hex', value: BackgroundStyle.cyberHexGrid, isImage: false },
  { label: 'Neon City', value: BackgroundStyle.neonCity, isImage: true, img: '/assets/generated/bg-neon-city.dim_1920x1080.png' },
  { label: 'Space Nebula', value: BackgroundStyle.spaceNebula, isImage: true, img: '/assets/generated/bg-space-nebula.dim_1920x1080.png' },
  { label: 'Cyber Forest', value: BackgroundStyle.cyberForest, isImage: true, img: '/assets/generated/bg-cyber-forest.dim_1920x1080.png' },
  { label: 'Abstract Glitch', value: BackgroundStyle.abstractGlitch, isImage: true, img: '/assets/generated/bg-abstract-glitch.dim_1920x1080.png' },
  { label: 'Dark Ocean', value: BackgroundStyle.darkOcean, isImage: true, img: '/assets/generated/bg-dark-ocean.dim_1920x1080.png' },
];

const FONT_OPTIONS = [
  { label: 'Orbitron', value: FontStyle.orbitron, fontFamily: 'Orbitron, sans-serif' },
  { label: 'Press Start 2P', value: FontStyle.pressStart2P, fontFamily: '"Press Start 2P", cursive' },
  { label: 'Rajdhani', value: FontStyle.rajdhani, fontFamily: 'Rajdhani, sans-serif' },
  { label: 'Monospace', value: FontStyle.monospace, fontFamily: 'monospace' },
  { label: 'Sans-Serif', value: FontStyle.sansSerif, fontFamily: 'system-ui, -apple-system, sans-serif' },
];

const CLOAK_OPTIONS: Array<{ label: string; value: TabCloakPreset; emoji: string }> = [
  { label: 'Default / Colt UI', value: TabCloakPreset.default_, emoji: '🎮' },
  { label: 'Google', value: TabCloakPreset.google, emoji: '🔍' },
  { label: 'Clever.com', value: TabCloakPreset.clever, emoji: '📚' },
  { label: 'Google Classroom', value: TabCloakPreset.googleClassroom, emoji: '🏫' },
  { label: 'YouTube', value: TabCloakPreset.youtube, emoji: '▶️' },
];

// Map backend TabCloakPreset to utility type
function toUtilPreset(preset: TabCloakPreset): CloakPresetType {
  const map: Record<TabCloakPreset, CloakPresetType> = {
    [TabCloakPreset.default_]: 'default',
    [TabCloakPreset.google]: 'google',
    [TabCloakPreset.clever]: 'clever',
    [TabCloakPreset.googleClassroom]: 'googleClassroom',
    [TabCloakPreset.youtube]: 'youtube',
  };
  return map[preset] || 'default';
}

export default function MoreTab({
  accentColor,
  onAccentColorChange,
  cursorStyle,
  onCursorStyleChange,
  backgroundStyle,
  onBackgroundStyleChange,
  fontStyle,
  onFontStyleChange,
  cloakPreset,
  onCloakPresetChange,
}: MoreTabProps) {
  const [notepad, setNotepad] = useState('');
  const [time, setTime] = useState(new Date());
  const [stopwatch, setStopwatch] = useState(0);
  const [swRunning, setSwRunning] = useState(false);
  const swRef = React.useRef<ReturnType<typeof setInterval> | null>(null);

  const { data: preferences } = useGetPreferences();
  const savePreferences = useSavePreferences();
  const saveNotepad = useSaveNotepad();

  useEffect(() => {
    if (preferences?.notepad) setNotepad(preferences.notepad);
  }, [preferences?.notepad]);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (swRunning) {
      swRef.current = setInterval(() => setStopwatch(s => s + 1), 1000);
    } else {
      if (swRef.current) clearInterval(swRef.current);
    }
    return () => { if (swRef.current) clearInterval(swRef.current); };
  }, [swRunning]);

  const handleSaveAll = () => {
    savePreferences.mutate({
      lastActiveTab: 'more',
      accentColor,
      cursorStyle,
      backgroundStyle,
      fontStyle,
      cloakPreset,
    });
  };

  const handleNotepadSave = () => {
    saveNotepad.mutate(notepad);
  };

  const handleCloakChange = (preset: TabCloakPreset) => {
    onCloakPresetChange(preset);
    setTabCloak(toUtilPreset(preset));
    savePreferences.mutate({
      lastActiveTab: 'more',
      accentColor,
      cursorStyle,
      backgroundStyle,
      fontStyle,
      cloakPreset: preset,
    });
  };

  const formatStopwatch = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* About */}
      <GlassCard className="p-5">
        <h3 className="text-neon-cyan font-bold text-lg mb-3 neon-text">About COLT UI</h3>
        <p className="text-gray-300 text-sm leading-relaxed mb-2">
          COLT UI is your all-in-one browser hub — games, proxy, music, AI tutor, and more.
        </p>
        <p className="text-gray-500 text-xs">Version 6.0 · Built for students</p>
      </GlassCard>

      {/* Accent Color */}
      <GlassCard className="p-5">
        <h3 className="text-neon-cyan font-bold text-lg mb-3 neon-text">Accent Color</h3>
        <div className="flex gap-3 flex-wrap">
          {ACCENT_COLORS.map(c => (
            <button
              key={c.value}
              onClick={() => { onAccentColorChange(c.value); handleSaveAll(); }}
              className={`w-10 h-10 rounded-full ${c.class} border-2 transition-all hover:scale-110 ${
                accentColor === c.value ? 'border-white scale-110' : 'border-transparent'
              }`}
              title={c.label}
            />
          ))}
        </div>
      </GlassCard>

      {/* Cursor Style */}
      <GlassCard className="p-5">
        <h3 className="text-neon-cyan font-bold text-lg mb-3 neon-text">Cursor Style</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {CURSOR_OPTIONS.map(opt => (
            <button
              key={opt.value}
              onClick={() => { onCursorStyleChange(opt.value); handleSaveAll(); }}
              className={`p-2 rounded-lg text-xs border transition-all hover:scale-105 ${
                cursorStyle === opt.value
                  ? 'border-neon-cyan/60 bg-neon-cyan/10 text-neon-cyan'
                  : 'border-white/10 bg-white/5 text-gray-400 hover:border-white/30'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </GlassCard>

      {/* Background Style */}
      <GlassCard className="p-5">
        <h3 className="text-neon-cyan font-bold text-lg mb-3 neon-text">Background</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {BACKGROUND_OPTIONS.map(opt => (
            <button
              key={opt.value}
              onClick={() => { onBackgroundStyleChange(opt.value); handleSaveAll(); }}
              className={`rounded-lg text-xs border transition-all hover:scale-105 overflow-hidden ${
                backgroundStyle === opt.value
                  ? 'border-neon-cyan/60 ring-1 ring-neon-cyan/40'
                  : 'border-white/10 hover:border-white/30'
              }`}
            >
              {opt.isImage && opt.img ? (
                <div className="relative">
                  <img src={opt.img} alt={opt.label} className="w-full h-12 object-cover" />
                  <div className="absolute inset-0 bg-black/30 flex items-end justify-center pb-1">
                    <span className={`text-xs font-semibold ${backgroundStyle === opt.value ? 'text-neon-cyan' : 'text-white'}`}>
                      {opt.label}
                    </span>
                  </div>
                </div>
              ) : (
                <div className={`p-2 bg-white/5 ${backgroundStyle === opt.value ? 'text-neon-cyan' : 'text-gray-400'}`}>
                  {opt.label}
                </div>
              )}
            </button>
          ))}
        </div>
      </GlassCard>

      {/* Font Style */}
      <GlassCard className="p-5">
        <h3 className="text-neon-cyan font-bold text-lg mb-3 neon-text">Font Style</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {FONT_OPTIONS.map(opt => (
            <button
              key={opt.value}
              onClick={() => { onFontStyleChange(opt.value); handleSaveAll(); }}
              className={`p-3 rounded-lg text-sm border transition-all hover:scale-105 text-left ${
                fontStyle === opt.value
                  ? 'border-neon-cyan/60 bg-neon-cyan/10 text-neon-cyan'
                  : 'border-white/10 bg-white/5 text-gray-300 hover:border-white/30'
              }`}
              style={{ fontFamily: opt.fontFamily }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </GlassCard>

      {/* Tab Cloaking */}
      <GlassCard className="p-5">
        <h3 className="text-neon-cyan font-bold text-lg mb-1 neon-text">Tab Cloaking</h3>
        <p className="text-xs text-gray-500 mb-3">Disguise this tab as another website</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {CLOAK_OPTIONS.map(opt => (
            <button
              key={opt.value}
              onClick={() => handleCloakChange(opt.value)}
              className={`p-3 rounded-lg text-sm border transition-all hover:scale-105 text-left flex items-center gap-2 ${
                cloakPreset === opt.value
                  ? 'border-neon-cyan/60 bg-neon-cyan/10 text-neon-cyan'
                  : 'border-white/10 bg-white/5 text-gray-300 hover:border-white/30'
              }`}
            >
              <span className="text-lg">{opt.emoji}</span>
              <span className="text-xs">{opt.label}</span>
            </button>
          ))}
        </div>
      </GlassCard>

      {/* Clock & Stopwatch */}
      <GlassCard className="p-5">
        <h3 className="text-neon-cyan font-bold text-lg mb-3 neon-text">Clock & Stopwatch</h3>
        <div className="text-3xl font-bold text-white mb-4 font-mono">
          {time.toLocaleTimeString()}
        </div>
        <div className="text-2xl font-bold text-neon-green mb-3 font-mono">
          {formatStopwatch(stopwatch)}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setSwRunning(!swRunning)}
            className="px-4 py-2 rounded-lg bg-neon-green/20 border border-neon-green/40 text-neon-green text-sm hover:bg-neon-green/30 transition-colors"
          >
            {swRunning ? 'Pause' : 'Start'}
          </button>
          <button
            onClick={() => { setStopwatch(0); setSwRunning(false); }}
            className="px-4 py-2 rounded-lg bg-white/5 border border-white/20 text-gray-400 text-sm hover:bg-white/10 transition-colors"
          >
            Reset
          </button>
        </div>
      </GlassCard>

      {/* Notepad */}
      <GlassCard className="p-5">
        <h3 className="text-neon-cyan font-bold text-lg mb-3 neon-text">Notepad</h3>
        <textarea
          value={notepad}
          onChange={e => setNotepad(e.target.value)}
          placeholder="Type your notes here..."
          className="w-full h-32 bg-white/5 border border-white/10 rounded-lg p-3 text-gray-300 text-sm resize-none focus:outline-none focus:border-neon-cyan/40"
        />
        <button
          onClick={handleNotepadSave}
          disabled={saveNotepad.isPending}
          className="mt-2 px-4 py-2 rounded-lg bg-neon-cyan/20 border border-neon-cyan/40 text-neon-cyan text-sm hover:bg-neon-cyan/30 transition-colors disabled:opacity-50"
        >
          {saveNotepad.isPending ? 'Saving...' : 'Save Notes'}
        </button>
      </GlassCard>

      {/* Keyboard Shortcuts */}
      <GlassCard className="p-5">
        <h3 className="text-neon-cyan font-bold text-lg mb-3 neon-text">Keyboard Shortcuts</h3>
        <div className="space-y-2 text-sm">
          {[
            ['F11', 'Toggle Fullscreen'],
            ['Esc', 'Exit Fullscreen / Close Game'],
            ['Arrow Keys', 'Game Controls'],
            ['Space', 'Jump / Hard Drop'],
          ].map(([key, desc]) => (
            <div key={key} className="flex items-center justify-between">
              <span className="text-gray-400">{desc}</span>
              <kbd className="bg-white/10 border border-white/20 rounded px-2 py-0.5 text-xs text-gray-300 font-mono">{key}</kbd>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Fullscreen */}
      <GlassCard className="p-5">
        <h3 className="text-neon-cyan font-bold text-lg mb-3 neon-text">Display</h3>
        <button
          onClick={() => {
            if (!document.fullscreenElement) {
              document.documentElement.requestFullscreen();
            } else {
              document.exitFullscreen();
            }
          }}
          className="px-4 py-2 rounded-lg bg-neon-purple/20 border border-neon-purple/40 text-neon-purple text-sm hover:bg-neon-purple/30 transition-colors"
        >
          Toggle Fullscreen
        </button>
      </GlassCard>
    </div>
  );
}
