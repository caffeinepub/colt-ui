import React, { useState, useEffect } from "react";
import {
  BackgroundStyle,
  CursorStyle,
  FontStyle,
  TabCloakPreset,
} from "./backend";
import AnimatedBackground from "./components/AnimatedBackground";
import CustomCursor from "./components/CustomCursor";
import Header from "./components/Header";
import SignInPage from "./components/SignInPage";
import FireworksOnClick from "./components/effects/FireworksOnClick";
import RainbowCursorTrail from "./components/effects/RainbowCursorTrail";
import ColtAITab from "./components/tabs/ColtAITab";
import GamesTab from "./components/tabs/GamesTab";
import MediaTab from "./components/tabs/MediaTab";
import MoreTab from "./components/tabs/MoreTab";
import ProxyTab from "./components/tabs/ProxyTab";
import {
  useGetPreferences,
  useGetPurchasedEffects,
  useSavePreferences,
} from "./hooks/useQueries";
import { setTabCloak } from "./utils/tabCloak";

const IMAGE_BACKGROUNDS = new Set([
  BackgroundStyle.neonCity,
  BackgroundStyle.spaceNebula,
  BackgroundStyle.cyberForest,
  BackgroundStyle.abstractGlitch,
  BackgroundStyle.darkOcean,
]);

const IMAGE_BG_MAP: Record<string, string> = {
  [BackgroundStyle.neonCity]:
    "/assets/generated/bg-neon-city.dim_1920x1080.png",
  [BackgroundStyle.spaceNebula]:
    "/assets/generated/bg-space-nebula.dim_1920x1080.png",
  [BackgroundStyle.cyberForest]:
    "/assets/generated/bg-cyber-forest.dim_1920x1080.png",
  [BackgroundStyle.abstractGlitch]:
    "/assets/generated/bg-abstract-glitch.dim_1920x1080.png",
  [BackgroundStyle.darkOcean]:
    "/assets/generated/bg-dark-ocean.dim_1920x1080.png",
};

const FONT_FAMILY_MAP: Record<FontStyle, string> = {
  [FontStyle.orbitron]: '"Orbitron", sans-serif',
  [FontStyle.pressStart2P]: '"Press Start 2P", cursive',
  [FontStyle.rajdhani]: '"Rajdhani", sans-serif',
  [FontStyle.monospace]: "monospace",
  [FontStyle.sansSerif]: "system-ui, -apple-system, sans-serif",
};

function toUtilCloakPreset(
  preset: TabCloakPreset,
): "default" | "google" | "clever" | "googleClassroom" | "youtube" {
  const map: Record<
    TabCloakPreset,
    "default" | "google" | "clever" | "googleClassroom" | "youtube"
  > = {
    [TabCloakPreset.default_]: "default",
    [TabCloakPreset.google]: "google",
    [TabCloakPreset.clever]: "clever",
    [TabCloakPreset.googleClassroom]: "googleClassroom",
    [TabCloakPreset.youtube]: "youtube",
  };
  return map[preset] || "default";
}

export default function App() {
  const [username, setUsername] = useState<string | null>(() =>
    localStorage.getItem("colt_username"),
  );
  const [activeTab, setActiveTab] = useState("games");
  const [accentColor, setAccentColor] = useState("cyan");
  const [cursorStyle, setCursorStyle] = useState<CursorStyle>(
    CursorStyle.neonDot,
  );
  const [backgroundStyle, setBackgroundStyle] = useState<BackgroundStyle>(
    BackgroundStyle.particleGrid,
  );
  const [fontStyle, setFontStyle] = useState<FontStyle>(FontStyle.orbitron);
  const [cloakPreset, setCloakPreset] = useState<TabCloakPreset>(
    TabCloakPreset.default_,
  );
  const [prefsLoaded, setPrefsLoaded] = useState(false);

  const [theme, setTheme] = useState<string>(
    () => localStorage.getItem("colt_theme") || "neon",
  );
  const [cursorStyleExt, setCursorStyleExt] = useState<CursorStyle | string>(
    () => {
      return localStorage.getItem("colt_cursor_ext") || CursorStyle.neonDot;
    },
  );

  const [activeEffects, setActiveEffects] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem("colt_effects");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const { data: preferences } = useGetPreferences();
  const { data: purchasedEffects = [] } = useGetPurchasedEffects();
  const savePreferences = useSavePreferences();

  // Sync backend effects into local state once on load
  useEffect(() => {
    if (purchasedEffects && purchasedEffects.length > 0) {
      setActiveEffects((prev) => {
        const merged = Array.from(new Set([...prev, ...purchasedEffects]));
        localStorage.setItem("colt_effects", JSON.stringify(merged));
        return merged;
      });
    }
  }, [purchasedEffects]);

  // Load preferences on mount
  useEffect(() => {
    if (preferences && !prefsLoaded) {
      setAccentColor(preferences.accentColor || "cyan");
      setCursorStyle(preferences.cursorStyle || CursorStyle.neonDot);
      setBackgroundStyle(
        preferences.backgroundStyle || BackgroundStyle.particleGrid,
      );
      setFontStyle(preferences.fontStyle || FontStyle.orbitron);
      setCloakPreset(preferences.cloakPreset || TabCloakPreset.default_);
      if (
        preferences.lastActiveTab &&
        preferences.lastActiveTab !== "music" &&
        preferences.lastActiveTab !== "store"
      ) {
        setActiveTab(preferences.lastActiveTab);
      }
      setTabCloak(
        toUtilCloakPreset(preferences.cloakPreset || TabCloakPreset.default_),
      );
      setPrefsLoaded(true);
    }
  }, [preferences, prefsLoaded]);

  // Apply theme globally
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("colt_theme", theme);
  }, [theme]);

  // Apply font globally
  useEffect(() => {
    const fontFamily =
      FONT_FAMILY_MAP[fontStyle] || FONT_FAMILY_MAP[FontStyle.orbitron];
    document.body.style.fontFamily = fontFamily;
    document.documentElement.setAttribute("data-font", fontStyle);
  }, [fontStyle]);

  // Apply accent color globally as CSS variables
  useEffect(() => {
    const ACCENT_HEX_MAP: Record<
      string,
      { h: number; c: number; hex: string }
    > = {
      cyan: { h: 195, c: 0.22, hex: "#00e5ff" },
      green: { h: 145, c: 0.22, hex: "#00ff88" },
      purple: { h: 290, c: 0.26, hex: "#aa00ff" },
      pink: { h: 330, c: 0.28, hex: "#ff00aa" },
      orange: { h: 50, c: 0.22, hex: "#ff8800" },
      red: { h: 25, c: 0.26, hex: "#ff2255" },
      blue: { h: 250, c: 0.24, hex: "#0088ff" },
      yellow: { h: 80, c: 0.22, hex: "#ffdd00" },
    };
    const a = ACCENT_HEX_MAP[accentColor] ?? ACCENT_HEX_MAP.cyan;
    const root = document.documentElement;
    root.style.setProperty("--accent-color-hex", a.hex);
    root.style.setProperty("--neon-cyan", a.hex);
    // Update neon-text glow and scrollbar to match accent
    root.style.setProperty("--accent-h", String(a.h));
    root.style.setProperty("--accent-c", String(a.c));
    // Patch dynamic CSS for scrollbar and neon elements
    let styleEl = document.getElementById(
      "colt-accent-style",
    ) as HTMLStyleElement | null;
    if (!styleEl) {
      styleEl = document.createElement("style");
      styleEl.id = "colt-accent-style";
      document.head.appendChild(styleEl);
    }
    styleEl.textContent = `
      ::-webkit-scrollbar-thumb { background: ${a.hex}4d !important; }
      ::-webkit-scrollbar-thumb:hover { background: ${a.hex}80 !important; }
      .text-neon-cyan { color: ${a.hex} !important; }
      .border-neon-cyan\\/60 { border-color: ${a.hex}99 !important; }
      .border-neon-cyan\\/40 { border-color: ${a.hex}66 !important; }
      .bg-neon-cyan\\/10 { background-color: ${a.hex}1a !important; }
      .bg-neon-cyan\\/20 { background-color: ${a.hex}33 !important; }
      .bg-neon-cyan\\/30 { background-color: ${a.hex}4d !important; }
      .hover\\:bg-neon-cyan\\/30:hover { background-color: ${a.hex}4d !important; }
      .ring-neon-cyan\\/40 { --tw-ring-color: ${a.hex}66 !important; }
      .neon-text { text-shadow: 0 0 10px ${a.hex}, 0 0 20px ${a.hex} !important; }
      .accent-neon-cyan { accent-color: ${a.hex} !important; }
    `;
  }, [accentColor]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    savePreferences.mutate({
      lastActiveTab: tab,
      accentColor,
      cursorStyle,
      backgroundStyle,
      fontStyle,
      cloakPreset,
    });
  };

  const handleSignIn = (name: string) => {
    setUsername(name);
  };

  const isImageBg = IMAGE_BACKGROUNDS.has(backgroundStyle);
  const imageBgUrl = isImageBg ? IMAGE_BG_MAP[backgroundStyle] : null;

  const hasRainbowTrail = activeEffects.includes("rainbow-cursor-trail");
  const hasFireworks = activeEffects.includes("fireworks-on-click");
  const hasGoldenBorders = activeEffects.includes("golden-card-borders");
  const hasGlitchText = activeEffects.includes("glitch-text-effect");
  const hasNeonPulse = activeEffects.includes("neon-pulse-overlay");
  const hasVipBadge = activeEffects.includes("vip-badge");

  // Show sign-in page if no username yet
  if (!username) {
    return <SignInPage onComplete={handleSignIn} />;
  }

  return (
    <div
      className={`min-h-screen relative ${hasGoldenBorders ? "golden-borders" : ""} ${hasGlitchText ? "glitch-text-active" : ""}`}
      style={{ fontFamily: FONT_FAMILY_MAP[fontStyle] }}
    >
      {/* Background */}
      {isImageBg && imageBgUrl ? (
        <>
          <div
            className="fixed inset-0 w-full h-full"
            style={{
              backgroundImage: `url(${imageBgUrl})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              zIndex: 0,
            }}
          />
          <div
            className="fixed inset-0 w-full h-full"
            style={{ background: "rgba(0,0,0,0.45)", zIndex: 1 }}
          />
        </>
      ) : (
        <AnimatedBackground backgroundStyle={backgroundStyle} />
      )}

      {/* Neon Pulse Overlay */}
      {hasNeonPulse && (
        <div
          className="fixed inset-0 pointer-events-none"
          style={{
            zIndex: 2,
            background:
              "radial-gradient(ellipse at center, rgba(0,255,255,0.04) 0%, transparent 70%)",
            animation: "pulse 3s ease-in-out infinite",
          }}
        />
      )}

      {/* Effects */}
      {hasRainbowTrail && <RainbowCursorTrail />}
      {hasFireworks && <FireworksOnClick />}

      {/* Custom Cursor — uses extended style if set, otherwise backend style */}
      <CustomCursor cursorStyle={cursorStyleExt as CursorStyle} />

      {/* Main Content */}
      <div className="relative" style={{ zIndex: 10 }}>
        <Header
          activeTab={activeTab}
          onTabChange={handleTabChange}
          vipOwned={hasVipBadge}
          username={username}
        />

        <main className="max-w-7xl mx-auto px-4 py-6">
          {activeTab === "games" && <GamesTab />}
          {activeTab === "proxy" && <ProxyTab />}
          {activeTab === "media" && <MediaTab />}
          {activeTab === "colt-ai" && <ColtAITab />}
          {activeTab === "more" && (
            <MoreTab
              accentColor={accentColor}
              onAccentColorChange={setAccentColor}
              cursorStyle={cursorStyleExt}
              onCursorStyleChange={(style: CursorStyle | string) => {
                setCursorStyleExt(style);
                localStorage.setItem("colt_cursor_ext", String(style));
                // Also sync backend cursor style for known values
                if (Object.values(CursorStyle).includes(style as CursorStyle)) {
                  setCursorStyle(style as CursorStyle);
                }
              }}
              backgroundStyle={backgroundStyle}
              onBackgroundStyleChange={setBackgroundStyle}
              fontStyle={fontStyle}
              onFontStyleChange={setFontStyle}
              cloakPreset={cloakPreset}
              onCloakPresetChange={setCloakPreset}
              activeEffects={activeEffects}
              onToggleEffect={(id: string) => {
                setActiveEffects((prev) => {
                  const next = prev.includes(id)
                    ? prev.filter((e) => e !== id)
                    : [...prev, id];
                  localStorage.setItem("colt_effects", JSON.stringify(next));
                  return next;
                });
              }}
              theme={theme}
              onThemeChange={(t: string) => setTheme(t)}
            />
          )}
        </main>

        <footer className="text-center py-6 text-gray-600 text-xs border-t border-white/5 mt-8">
          <p>
            © {new Date().getFullYear()} COLT UI · Built with{" "}
            <span className="text-neon-pink">♥</span> using{" "}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname || "colt-ui")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-neon-cyan hover:underline"
            >
              caffeine.ai
            </a>
          </p>
        </footer>
      </div>
    </div>
  );
}
