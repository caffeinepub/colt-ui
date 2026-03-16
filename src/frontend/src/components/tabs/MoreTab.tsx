import React, { useState, useEffect } from "react";
import {
  BackgroundStyle,
  CursorStyle,
  FontStyle,
  TabCloakPreset,
} from "../../backend";
import {
  useGetPreferences,
  useGetPurchasedEffects,
  useSaveNotepad,
  useSavePreferences,
  useSetPurchasedEffects,
} from "../../hooks/useQueries";
import {
  type TabCloakPreset as CloakPresetType,
  setTabCloak,
} from "../../utils/tabCloak";
import GlassCard from "../GlassCard";

interface MoreTabProps {
  accentColor: string;
  onAccentColorChange: (color: string) => void;
  cursorStyle: CursorStyle | string;
  onCursorStyleChange: (style: CursorStyle | string) => void;
  backgroundStyle: BackgroundStyle;
  onBackgroundStyleChange: (style: BackgroundStyle) => void;
  fontStyle: FontStyle;
  onFontStyleChange: (style: FontStyle) => void;
  cloakPreset: TabCloakPreset;
  onCloakPresetChange: (preset: TabCloakPreset) => void;
  activeEffects?: string[];
  onToggleEffect?: (id: string) => void;
  theme?: string;
  onThemeChange?: (theme: string) => void;
}

const ACCENT_COLORS = [
  { label: "Cyan", value: "cyan", hex: "#00e5ff" },
  { label: "Green", value: "green", hex: "#00ff88" },
  { label: "Purple", value: "purple", hex: "#aa00ff" },
  { label: "Pink", value: "pink", hex: "#ff00aa" },
  { label: "Orange", value: "orange", hex: "#ff8800" },
  { label: "Red", value: "red", hex: "#ff2255" },
  { label: "Blue", value: "blue", hex: "#0088ff" },
  { label: "Yellow", value: "yellow", hex: "#ffdd00" },
];

const CURSOR_OPTIONS: Array<{ label: string; value: CursorStyle | string }> = [
  { label: "Neon Dot", value: CursorStyle.neonDot },
  { label: "Crosshair", value: CursorStyle.crosshair },
  { label: "Ring Pulse", value: CursorStyle.ringPulse },
  { label: "Star Burst", value: CursorStyle.starBurst },
  { label: "Arrow Glow", value: CursorStyle.arrowGlow },
  { label: "Galaxy Swirl", value: "galaxySwirl" },
  { label: "Neon Snake", value: "neonSnake" },
  { label: "Pixel Block", value: "pixelBlock" },
  { label: "Laser Beam", value: "laserBeam" },
];

const THEME_OPTIONS = [
  { label: "🌀 Neon", value: "neon", description: "Default cyan neon glow" },
  { label: "⬜ Minimal", value: "minimal", description: "Clean, no glows" },
  { label: "🟩 Retro", value: "retro", description: "Green-on-black CRT" },
  { label: "🌸 Pastel", value: "pastel", description: "Soft, gentle colors" },
  {
    label: "🔮 Cyberpunk",
    value: "cyberpunk",
    description: "Magenta & yellow",
  },
];

const BACKGROUND_OPTIONS = [
  {
    label: "Particle Grid",
    value: BackgroundStyle.particleGrid,
    isImage: false,
  },
  { label: "Neon Rain", value: BackgroundStyle.neonRain, isImage: false },
  { label: "Matrix Code", value: BackgroundStyle.matrixCode, isImage: false },
  { label: "Starfield", value: BackgroundStyle.starfield, isImage: false },
  { label: "Solid Dark", value: BackgroundStyle.solidDark, isImage: false },
  { label: "Cyber Hex", value: BackgroundStyle.cyberHexGrid, isImage: false },
  {
    label: "Neon City",
    value: BackgroundStyle.neonCity,
    isImage: true,
    img: "/assets/generated/bg-neon-city.dim_1920x1080.png",
  },
  {
    label: "Space Nebula",
    value: BackgroundStyle.spaceNebula,
    isImage: true,
    img: "/assets/generated/bg-space-nebula.dim_1920x1080.png",
  },
  {
    label: "Cyber Forest",
    value: BackgroundStyle.cyberForest,
    isImage: true,
    img: "/assets/generated/bg-cyber-forest.dim_1920x1080.png",
  },
  {
    label: "Abstract Glitch",
    value: BackgroundStyle.abstractGlitch,
    isImage: true,
    img: "/assets/generated/bg-abstract-glitch.dim_1920x1080.png",
  },
  {
    label: "Dark Ocean",
    value: BackgroundStyle.darkOcean,
    isImage: true,
    img: "/assets/generated/bg-dark-ocean.dim_1920x1080.png",
  },
];

const FONT_OPTIONS = [
  {
    label: "Orbitron",
    value: FontStyle.orbitron,
    fontFamily: "Orbitron, sans-serif",
  },
  {
    label: "Press Start 2P",
    value: FontStyle.pressStart2P,
    fontFamily: '"Press Start 2P", cursive',
  },
  {
    label: "Rajdhani",
    value: FontStyle.rajdhani,
    fontFamily: "Rajdhani, sans-serif",
  },
  { label: "Monospace", value: FontStyle.monospace, fontFamily: "monospace" },
  {
    label: "Sans-Serif",
    value: FontStyle.sansSerif,
    fontFamily: "system-ui, -apple-system, sans-serif",
  },
];

const CLOAK_OPTIONS: Array<{
  label: string;
  value: TabCloakPreset;
  emoji: string;
}> = [
  { label: "Default / Colt UI", value: TabCloakPreset.default_, emoji: "🎮" },
  { label: "Google", value: TabCloakPreset.google, emoji: "🔍" },
  { label: "Clever.com", value: TabCloakPreset.clever, emoji: "📚" },
  {
    label: "Google Classroom",
    value: TabCloakPreset.googleClassroom,
    emoji: "🏫",
  },
  { label: "YouTube", value: TabCloakPreset.youtube, emoji: "▶️" },
];

interface StoreItem {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
}

const STORE_ITEMS: StoreItem[] = [
  {
    id: "rainbow-cursor-trail",
    name: "Rainbow Cursor Trail",
    icon: "🌈",
    description: "Leave a colorful rainbow trail wherever your cursor goes!",
    category: "Cursor",
  },
  {
    id: "fireworks-on-click",
    name: "Fireworks on Click",
    icon: "🎆",
    description: "Explosive firework particles burst from every click!",
    category: "Click",
  },
  {
    id: "screen-shake",
    name: "Screen Shake",
    icon: "📳",
    description: "Subtle screen shake effect on major actions.",
    category: "Effect",
  },
  {
    id: "confetti-burst",
    name: "Confetti Burst",
    icon: "🎊",
    description: "Colorful confetti rains down when you switch tabs!",
    category: "Effect",
  },
  {
    id: "neon-pulse-overlay",
    name: "Neon Pulse Overlay",
    icon: "💫",
    description: "A pulsing neon glow overlay that breathes with the app.",
    category: "Visual",
  },
  {
    id: "golden-card-borders",
    name: "Golden Card Borders",
    icon: "✨",
    description: "All cards get a luxurious golden border glow!",
    category: "Visual",
  },
  {
    id: "glitch-text-effect",
    name: "Glitch Text Effect",
    icon: "⚡",
    description: "Headers glitch and flicker with a cyberpunk effect.",
    category: "Text",
  },
  {
    id: "vip-badge",
    name: "VIP Badge",
    icon: "👑",
    description: "Show off a golden VIP badge next to your name in the header!",
    category: "Badge",
  },
];

const ANIM_SPEED_OPTIONS = [
  { label: "Off", value: "off", duration: "0s" },
  { label: "Slow", value: "slow", duration: "2s" },
  { label: "Normal", value: "normal", duration: "1s" },
  { label: "Fast", value: "fast", duration: "0.5s" },
];

// Map backend TabCloakPreset to utility type
function toUtilPreset(preset: TabCloakPreset): CloakPresetType {
  const map: Record<TabCloakPreset, CloakPresetType> = {
    [TabCloakPreset.default_]: "default",
    [TabCloakPreset.google]: "google",
    [TabCloakPreset.clever]: "clever",
    [TabCloakPreset.googleClassroom]: "googleClassroom",
    [TabCloakPreset.youtube]: "youtube",
  };
  return map[preset] || "default";
}

function applyThemeStyles(theme: string) {
  const root = document.documentElement;
  const body = document.body;
  if (theme === "neon") {
    root.style.setProperty("--bg-override", "#0a0a0f");
    root.style.setProperty("--neon-cyan", "0.78 0.22 195");
    root.style.setProperty("--neon-pink", "0.65 0.28 330");
    body.style.backgroundColor = "#0a0a0f";
    body.style.color = "#e0e0ff";
    body.style.removeProperty("text-shadow");
  } else if (theme === "minimal") {
    root.style.setProperty("--bg-override", "#111111");
    root.style.setProperty("--neon-cyan", "0.7 0.05 195");
    root.style.setProperty("--neon-pink", "0.7 0.05 330");
    body.style.backgroundColor = "#111111";
    body.style.color = "#cccccc";
    body.style.textShadow = "none";
  } else if (theme === "retro") {
    root.style.setProperty("--bg-override", "#0d1b0d");
    root.style.setProperty("--neon-cyan", "0.8 0.28 145");
    root.style.setProperty("--neon-pink", "0.7 0.22 38");
    body.style.backgroundColor = "#0d1b0d";
    body.style.color = "#00ff41";
    body.style.removeProperty("text-shadow");
  } else if (theme === "pastel") {
    root.style.setProperty("--bg-override", "#1a1a2e");
    root.style.setProperty("--neon-cyan", "0.77 0.10 210");
    root.style.setProperty("--neon-pink", "0.82 0.10 350");
    body.style.backgroundColor = "#1a1a2e";
    body.style.color = "#b8c8d8";
    body.style.removeProperty("text-shadow");
  } else if (theme === "cyberpunk") {
    root.style.setProperty("--bg-override", "#0f000f");
    root.style.setProperty("--neon-cyan", "0.60 0.28 330");
    root.style.setProperty("--neon-pink", "0.95 0.20 100");
    body.style.backgroundColor = "#0f000f";
    body.style.color = "#ff00ff";
    body.style.removeProperty("text-shadow");
  }
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
  activeEffects: activeEffectsProp,
  onToggleEffect: onToggleEffectProp,
  theme = "neon",
  onThemeChange,
}: MoreTabProps) {
  const [notepad, setNotepad] = useState("");
  const [time, setTime] = useState(new Date());
  const [stopwatch, setStopwatch] = useState(0);
  const [swRunning, setSwRunning] = useState(false);
  const swRef = React.useRef<ReturnType<typeof setInterval> | null>(null);

  // Glow + anim speed from localStorage
  const [glowIntensity, setGlowIntensity] = useState<number>(() => {
    return Number(localStorage.getItem("colt_glow") ?? 50);
  });
  const [animSpeed, setAnimSpeed] = useState<string>(() => {
    return localStorage.getItem("colt_anim_speed") ?? "normal";
  });

  const { data: preferences } = useGetPreferences();
  const savePreferences = useSavePreferences();
  const saveNotepad = useSaveNotepad();

  // Effects hooks (used as fallback if no prop provided)
  const { data: purchasedEffects = [], isLoading: effectsLoading } =
    useGetPurchasedEffects();
  const setPurchasedEffects = useSetPurchasedEffects();

  // Use prop-based effects (from App.tsx localStorage state) if provided, else backend data
  const effectsList = activeEffectsProp ?? purchasedEffects;

  useEffect(() => {
    if (preferences?.notepad) setNotepad(preferences.notepad);
  }, [preferences?.notepad]);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (swRunning) {
      swRef.current = setInterval(() => setStopwatch((s) => s + 1), 1000);
    } else {
      if (swRef.current) clearInterval(swRef.current);
    }
    return () => {
      if (swRef.current) clearInterval(swRef.current);
    };
  }, [swRunning]);

  // Apply theme styles on mount and when theme changes
  useEffect(() => {
    applyThemeStyles(theme);
  }, [theme]);

  // Apply glow intensity
  useEffect(() => {
    const val = (glowIntensity / 50).toFixed(2); // 0-2
    document.documentElement.style.setProperty("--glow-intensity", val);
    localStorage.setItem("colt_glow", String(glowIntensity));
  }, [glowIntensity]);

  // Apply anim speed
  useEffect(() => {
    const opt = ANIM_SPEED_OPTIONS.find((o) => o.value === animSpeed);
    document.documentElement.style.setProperty(
      "--anim-speed",
      opt?.duration ?? "1s",
    );
    localStorage.setItem("colt_anim_speed", animSpeed);
  }, [animSpeed]);

  // Resolve cursorStyle to a backend-safe CursorStyle (fallback to neonDot for custom styles)
  const safeCursorStyle = Object.values(CursorStyle).includes(
    cursorStyle as CursorStyle,
  )
    ? (cursorStyle as CursorStyle)
    : CursorStyle.neonDot;

  const handleSaveAll = () => {
    savePreferences.mutate({
      lastActiveTab: "more",
      accentColor,
      cursorStyle: safeCursorStyle,
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
      lastActiveTab: "more",
      accentColor,
      cursorStyle: safeCursorStyle,
      backgroundStyle,
      fontStyle,
      cloakPreset: preset,
    });
  };

  const formatStopwatch = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  };

  const handleToggleEffect = (itemId: string) => {
    if (onToggleEffectProp) {
      // Use the fast localStorage-backed toggle from App.tsx
      onToggleEffectProp(itemId);
    } else {
      // Fallback: use backend mutation
      const isOn = purchasedEffects.includes(itemId);
      const newEffects = isOn
        ? purchasedEffects.filter((e: string) => e !== itemId)
        : [...purchasedEffects, itemId];
      setPurchasedEffects.mutate(newEffects);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* About */}
      <GlassCard className="p-5">
        <h3 className="text-neon-cyan font-bold text-lg mb-3 neon-text">
          About COLT UI
        </h3>
        <p className="text-gray-300 text-sm leading-relaxed mb-2">
          COLT UI is your all-in-one browser hub — games, proxy, AI tutor, and
          more.
        </p>
        <p className="text-gray-500 text-xs">
          Version 15.0 · Built for students
        </p>
      </GlassCard>

      {/* Accent Color — now with 8 colors */}
      <GlassCard className="p-5">
        <h3 className="text-neon-cyan font-bold text-lg mb-3 neon-text">
          Accent Color
        </h3>
        <div className="flex gap-3 flex-wrap">
          {ACCENT_COLORS.map((c) => (
            <button
              key={c.value}
              type="button"
              onClick={() => {
                onAccentColorChange(c.value);
                handleSaveAll();
              }}
              className={`w-10 h-10 rounded-full border-2 transition-all hover:scale-110 ${
                accentColor === c.value
                  ? "border-white scale-110"
                  : "border-transparent"
              }`}
              style={{
                background: c.hex,
                boxShadow:
                  accentColor === c.value ? `0 0 10px ${c.hex}` : "none",
              }}
              title={c.label}
            />
          ))}
        </div>
      </GlassCard>

      {/* Glow Intensity */}
      <GlassCard className="p-5">
        <h3 className="text-neon-cyan font-bold text-lg mb-1 neon-text">
          Glow Intensity
        </h3>
        <p className="text-xs text-gray-500 mb-4">
          Adjust how intense the neon glow effects are
        </p>
        <div className="flex items-center gap-4">
          <span className="text-xs text-gray-400 w-6">0</span>
          <input
            type="range"
            min={0}
            max={100}
            value={glowIntensity}
            onChange={(e) => setGlowIntensity(Number(e.target.value))}
            className="flex-1 accent-neon-cyan"
          />
          <span className="text-xs text-gray-400 w-8 text-right">100</span>
        </div>
        <div className="mt-2 text-center">
          <span
            className="text-sm font-bold"
            style={{
              color: "oklch(0.78 0.22 195)",
              textShadow: `0 0 ${glowIntensity / 5}px oklch(0.78 0.22 195 / 0.8)`,
            }}
          >
            {glowIntensity}% Glow
          </span>
        </div>
      </GlassCard>

      {/* Animation Speed */}
      <GlassCard className="p-5">
        <h3 className="text-neon-cyan font-bold text-lg mb-1 neon-text">
          Animation Speed
        </h3>
        <p className="text-xs text-gray-500 mb-4">
          Control how fast UI animations play
        </p>
        <div className="grid grid-cols-4 gap-2">
          {ANIM_SPEED_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setAnimSpeed(opt.value)}
              className={`p-2 rounded-lg text-xs border transition-all hover:scale-105 ${
                animSpeed === opt.value
                  ? "border-neon-cyan/60 bg-neon-cyan/10 text-neon-cyan"
                  : "border-white/10 bg-white/5 text-gray-400 hover:border-white/30"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </GlassCard>

      {/* Cursor Style */}
      <GlassCard className="p-5">
        <h3 className="text-neon-cyan font-bold text-lg mb-3 neon-text">
          Cursor Style
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {CURSOR_OPTIONS.map((opt) => (
            <button
              key={String(opt.value)}
              type="button"
              data-ocid="more.cursor.toggle"
              onClick={() => {
                onCursorStyleChange(opt.value);
                handleSaveAll();
              }}
              className={`p-2 rounded-lg text-xs border transition-all hover:scale-105 ${
                cursorStyle === opt.value
                  ? "border-neon-cyan/60 bg-neon-cyan/10 text-neon-cyan"
                  : "border-white/10 bg-white/5 text-gray-400 hover:border-white/30"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </GlassCard>

      {/* Website Theme */}
      <GlassCard className="p-5">
        <h3 className="text-neon-cyan font-bold text-lg mb-1 neon-text">
          Website Theme
        </h3>
        <p className="text-xs text-gray-500 mb-4">
          Change the overall visual style of Colt UI
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {THEME_OPTIONS.map((t) => (
            <button
              key={t.value}
              type="button"
              data-ocid="more.theme.toggle"
              onClick={() => {
                if (onThemeChange) onThemeChange(t.value);
                localStorage.setItem("colt_theme", t.value);
                document.documentElement.setAttribute("data-theme", t.value);
                applyThemeStyles(t.value);
              }}
              className={`p-3 rounded-lg text-xs border transition-all hover:scale-105 text-left flex flex-col gap-1 ${
                theme === t.value
                  ? "border-neon-cyan/60 bg-neon-cyan/10 text-neon-cyan"
                  : "border-white/10 bg-white/5 text-gray-300 hover:border-white/30"
              }`}
            >
              <span className="font-semibold">{t.label}</span>
              <span className="text-gray-500 text-xs">{t.description}</span>
            </button>
          ))}
        </div>
      </GlassCard>

      {/* Background Style */}
      <GlassCard className="p-5">
        <h3 className="text-neon-cyan font-bold text-lg mb-3 neon-text">
          Background
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {BACKGROUND_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => {
                onBackgroundStyleChange(opt.value);
                handleSaveAll();
              }}
              className={`rounded-lg text-xs border transition-all hover:scale-105 overflow-hidden ${
                backgroundStyle === opt.value
                  ? "border-neon-cyan/60 ring-1 ring-neon-cyan/40"
                  : "border-white/10 hover:border-white/30"
              }`}
            >
              {opt.isImage && opt.img ? (
                <div className="relative">
                  <img
                    src={opt.img}
                    alt={opt.label}
                    className="w-full h-12 object-cover"
                  />
                  <div className="absolute inset-0 bg-black/30 flex items-end justify-center pb-1">
                    <span
                      className={`text-xs font-semibold ${backgroundStyle === opt.value ? "text-neon-cyan" : "text-white"}`}
                    >
                      {opt.label}
                    </span>
                  </div>
                </div>
              ) : (
                <div
                  className={`p-2 bg-white/5 ${backgroundStyle === opt.value ? "text-neon-cyan" : "text-gray-400"}`}
                >
                  {opt.label}
                </div>
              )}
            </button>
          ))}
        </div>
      </GlassCard>

      {/* Font Style */}
      <GlassCard className="p-5">
        <h3 className="text-neon-cyan font-bold text-lg mb-3 neon-text">
          Font Style
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {FONT_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => {
                onFontStyleChange(opt.value);
                handleSaveAll();
              }}
              className={`p-3 rounded-lg text-sm border transition-all hover:scale-105 text-left ${
                fontStyle === opt.value
                  ? "border-neon-cyan/60 bg-neon-cyan/10 text-neon-cyan"
                  : "border-white/10 bg-white/5 text-gray-300 hover:border-white/30"
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
        <h3 className="text-neon-cyan font-bold text-lg mb-1 neon-text">
          Tab Cloaking
        </h3>
        <p className="text-xs text-gray-500 mb-3">
          Disguise this tab as another website
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {CLOAK_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => handleCloakChange(opt.value)}
              className={`p-3 rounded-lg text-sm border transition-all hover:scale-105 text-left flex items-center gap-2 ${
                cloakPreset === opt.value
                  ? "border-neon-cyan/60 bg-neon-cyan/10 text-neon-cyan"
                  : "border-white/10 bg-white/5 text-gray-300 hover:border-white/30"
              }`}
            >
              <span className="text-lg">{opt.emoji}</span>
              <span className="text-xs">{opt.label}</span>
            </button>
          ))}
        </div>
      </GlassCard>

      {/* Effects Customization — full width */}
      <div className="lg:col-span-2">
        <GlassCard className="p-5">
          <h3 className="text-neon-cyan font-bold text-lg mb-1 neon-text">
            Visual Effects
          </h3>
          <p className="text-xs text-gray-500 mb-4">
            Toggle effects on or off — all free!
          </p>
          {effectsLoading ? (
            <p className="text-gray-500 text-sm">Loading effects...</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {STORE_ITEMS.map((item) => {
                const isOn = effectsList.includes(item.id);
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleToggleEffect(item.id)}
                    className={`p-4 rounded-xl border transition-all hover:scale-105 text-left flex flex-col gap-2 ${
                      isOn
                        ? "border-neon-cyan/60 bg-neon-cyan/10"
                        : "border-white/10 bg-white/5 hover:border-white/30"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-2xl">{item.icon}</span>
                      <span
                        className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                          isOn
                            ? "bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/40"
                            : "bg-white/10 text-gray-500 border border-white/10"
                        }`}
                      >
                        {isOn ? "ON" : "OFF"}
                      </span>
                    </div>
                    <div>
                      <p
                        className={`font-semibold text-sm ${isOn ? "text-neon-cyan" : "text-white"}`}
                      >
                        {item.name}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {item.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </GlassCard>
      </div>

      {/* Clock & Stopwatch */}
      <GlassCard className="p-5">
        <h3 className="text-neon-cyan font-bold text-lg mb-3 neon-text">
          Clock & Stopwatch
        </h3>
        <div className="text-3xl font-bold text-white mb-4 font-mono">
          {time.toLocaleTimeString()}
        </div>
        <div className="text-2xl font-bold text-neon-green mb-3 font-mono">
          {formatStopwatch(stopwatch)}
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setSwRunning(!swRunning)}
            className="px-4 py-2 rounded-lg bg-neon-green/20 border border-neon-green/40 text-neon-green text-sm hover:bg-neon-green/30 transition-colors"
          >
            {swRunning ? "Pause" : "Start"}
          </button>
          <button
            type="button"
            onClick={() => {
              setStopwatch(0);
              setSwRunning(false);
            }}
            className="px-4 py-2 rounded-lg bg-white/5 border border-white/20 text-gray-400 text-sm hover:bg-white/10 transition-colors"
          >
            Reset
          </button>
        </div>
      </GlassCard>

      {/* Notepad */}
      <GlassCard className="p-5">
        <h3 className="text-neon-cyan font-bold text-lg mb-3 neon-text">
          Notepad
        </h3>
        <textarea
          value={notepad}
          onChange={(e) => setNotepad(e.target.value)}
          placeholder="Type your notes here..."
          className="w-full h-32 bg-white/5 border border-white/10 rounded-lg p-3 text-gray-300 text-sm resize-none focus:outline-none focus:border-neon-cyan/40"
        />
        <button
          type="button"
          onClick={handleNotepadSave}
          disabled={saveNotepad.isPending}
          className="mt-2 px-4 py-2 rounded-lg bg-neon-cyan/20 border border-neon-cyan/40 text-neon-cyan text-sm hover:bg-neon-cyan/30 transition-colors disabled:opacity-50"
        >
          {saveNotepad.isPending ? "Saving..." : "Save Notes"}
        </button>
      </GlassCard>

      {/* Keyboard Shortcuts */}
      <GlassCard className="p-5">
        <h3 className="text-neon-cyan font-bold text-lg mb-3 neon-text">
          Keyboard Shortcuts
        </h3>
        <div className="space-y-2 text-sm">
          {[
            ["F11", "Toggle Fullscreen"],
            ["Esc", "Exit Fullscreen / Close Game"],
            ["Arrow Keys", "Game Controls"],
            ["Space", "Jump / Hard Drop"],
          ].map(([key, desc]) => (
            <div key={key} className="flex items-center justify-between">
              <span className="text-gray-400">{desc}</span>
              <kbd className="bg-white/10 border border-white/20 rounded px-2 py-0.5 text-xs text-gray-300 font-mono">
                {key}
              </kbd>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Display */}
      <GlassCard className="p-5">
        <h3 className="text-neon-cyan font-bold text-lg mb-3 neon-text">
          Display
        </h3>
        <button
          type="button"
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
