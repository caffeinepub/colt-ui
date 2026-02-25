import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import AnimatedBackground from './components/AnimatedBackground';
import CustomCursor from './components/CustomCursor';
import GamesTab from './components/tabs/GamesTab';
import ProxyTab from './components/tabs/ProxyTab';
import MusicTab from './components/tabs/MusicTab';
import MoreTab from './components/tabs/MoreTab';
import ColtAITab from './components/tabs/ColtAITab';
import StoreTab from './components/tabs/StoreTab';
import RainbowCursorTrail from './components/effects/RainbowCursorTrail';
import FireworksOnClick from './components/effects/FireworksOnClick';
import { useGetPreferences, useSavePreferences, useGetPurchasedEffects } from './hooks/useQueries';
import { CursorStyle, BackgroundStyle, FontStyle, TabCloakPreset } from './backend';
import { setTabCloak } from './utils/tabCloak';

const IMAGE_BACKGROUNDS = new Set([
  BackgroundStyle.neonCity,
  BackgroundStyle.spaceNebula,
  BackgroundStyle.cyberForest,
  BackgroundStyle.abstractGlitch,
  BackgroundStyle.darkOcean,
]);

const IMAGE_BG_MAP: Record<string, string> = {
  [BackgroundStyle.neonCity]: '/assets/generated/bg-neon-city.dim_1920x1080.png',
  [BackgroundStyle.spaceNebula]: '/assets/generated/bg-space-nebula.dim_1920x1080.png',
  [BackgroundStyle.cyberForest]: '/assets/generated/bg-cyber-forest.dim_1920x1080.png',
  [BackgroundStyle.abstractGlitch]: '/assets/generated/bg-abstract-glitch.dim_1920x1080.png',
  [BackgroundStyle.darkOcean]: '/assets/generated/bg-dark-ocean.dim_1920x1080.png',
};

const FONT_FAMILY_MAP: Record<FontStyle, string> = {
  [FontStyle.orbitron]: '"Orbitron", sans-serif',
  [FontStyle.pressStart2P]: '"Press Start 2P", cursive',
  [FontStyle.rajdhani]: '"Rajdhani", sans-serif',
  [FontStyle.monospace]: 'monospace',
  [FontStyle.sansSerif]: 'system-ui, -apple-system, sans-serif',
};

function toUtilCloakPreset(preset: TabCloakPreset): 'default' | 'google' | 'clever' | 'googleClassroom' | 'youtube' {
  const map: Record<TabCloakPreset, 'default' | 'google' | 'clever' | 'googleClassroom' | 'youtube'> = {
    [TabCloakPreset.default_]: 'default',
    [TabCloakPreset.google]: 'google',
    [TabCloakPreset.clever]: 'clever',
    [TabCloakPreset.googleClassroom]: 'googleClassroom',
    [TabCloakPreset.youtube]: 'youtube',
  };
  return map[preset] || 'default';
}

export default function App() {
  const [activeTab, setActiveTab] = useState('games');
  const [accentColor, setAccentColor] = useState('cyan');
  const [cursorStyle, setCursorStyle] = useState<CursorStyle>(CursorStyle.neonDot);
  const [backgroundStyle, setBackgroundStyle] = useState<BackgroundStyle>(BackgroundStyle.particleGrid);
  const [fontStyle, setFontStyle] = useState<FontStyle>(FontStyle.orbitron);
  const [cloakPreset, setCloakPreset] = useState<TabCloakPreset>(TabCloakPreset.default_);
  const [prefsLoaded, setPrefsLoaded] = useState(false);

  const { data: preferences } = useGetPreferences();
  const { data: purchasedEffects = [] } = useGetPurchasedEffects();
  const savePreferences = useSavePreferences();

  // Load preferences on mount
  useEffect(() => {
    if (preferences && !prefsLoaded) {
      setAccentColor(preferences.accentColor || 'cyan');
      setCursorStyle(preferences.cursorStyle || CursorStyle.neonDot);
      setBackgroundStyle(preferences.backgroundStyle || BackgroundStyle.particleGrid);
      setFontStyle(preferences.fontStyle || FontStyle.orbitron);
      setCloakPreset(preferences.cloakPreset || TabCloakPreset.default_);
      if (preferences.lastActiveTab) setActiveTab(preferences.lastActiveTab);
      setTabCloak(toUtilCloakPreset(preferences.cloakPreset || TabCloakPreset.default_));
      setPrefsLoaded(true);
    }
  }, [preferences, prefsLoaded]);

  // Apply font globally
  useEffect(() => {
    const fontFamily = FONT_FAMILY_MAP[fontStyle] || FONT_FAMILY_MAP[FontStyle.orbitron];
    document.body.style.fontFamily = fontFamily;
    document.documentElement.setAttribute('data-font', fontStyle);
  }, [fontStyle]);

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

  const isImageBg = IMAGE_BACKGROUNDS.has(backgroundStyle);
  const imageBgUrl = isImageBg ? IMAGE_BG_MAP[backgroundStyle] : null;

  const hasRainbowTrail = purchasedEffects.includes('rainbow-cursor-trail');
  const hasFireworks = purchasedEffects.includes('fireworks-on-click');
  const hasGoldenBorders = purchasedEffects.includes('golden-card-borders');
  const hasGlitchText = purchasedEffects.includes('glitch-text-effect');
  const hasNeonPulse = purchasedEffects.includes('neon-pulse-overlay');
  const hasVipBadge = purchasedEffects.includes('vip-badge');

  return (
    <div
      className={`min-h-screen relative ${hasGoldenBorders ? 'golden-borders' : ''} ${hasGlitchText ? 'glitch-text-active' : ''}`}
      style={{ fontFamily: FONT_FAMILY_MAP[fontStyle] }}
    >
      {/* Background */}
      {isImageBg && imageBgUrl ? (
        <>
          <div
            className="fixed inset-0 w-full h-full"
            style={{
              backgroundImage: `url(${imageBgUrl})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              zIndex: 0,
            }}
          />
          <div
            className="fixed inset-0 w-full h-full"
            style={{ background: 'rgba(0,0,0,0.45)', zIndex: 1 }}
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
            background: 'radial-gradient(ellipse at center, rgba(0,255,255,0.04) 0%, transparent 70%)',
            animation: 'pulse 3s ease-in-out infinite',
          }}
        />
      )}

      {/* Effects */}
      {hasRainbowTrail && <RainbowCursorTrail />}
      {hasFireworks && <FireworksOnClick />}

      {/* Custom Cursor */}
      <CustomCursor cursorStyle={cursorStyle} />

      {/* Main Content */}
      <div className="relative" style={{ zIndex: 10 }}>
        <Header activeTab={activeTab} onTabChange={handleTabChange} vipOwned={hasVipBadge} />

        <main className="max-w-7xl mx-auto px-4 py-6">
          {activeTab === 'games' && <GamesTab />}
          {activeTab === 'proxy' && <ProxyTab />}
          {activeTab === 'music' && <MusicTab />}
          {activeTab === 'colt-ai' && <ColtAITab />}
          {activeTab === 'store' && <StoreTab />}
          {activeTab === 'more' && (
            <MoreTab
              accentColor={accentColor}
              onAccentColorChange={setAccentColor}
              cursorStyle={cursorStyle}
              onCursorStyleChange={setCursorStyle}
              backgroundStyle={backgroundStyle}
              onBackgroundStyleChange={setBackgroundStyle}
              fontStyle={fontStyle}
              onFontStyleChange={setFontStyle}
              cloakPreset={cloakPreset}
              onCloakPresetChange={setCloakPreset}
            />
          )}
        </main>

        <footer className="text-center py-6 text-gray-600 text-xs border-t border-white/5 mt-8">
          <p>
            © {new Date().getFullYear()} COLT UI · Built with{' '}
            <span className="text-neon-pink">♥</span> using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname || 'colt-ui')}`}
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
