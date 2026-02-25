import React, { useState, useEffect, useCallback } from 'react';
import AnimatedBackground from './components/AnimatedBackground';
import CustomCursor from './components/CustomCursor';
import Header from './components/Header';
import GamesTab from './components/tabs/GamesTab';
import ProxyTab from './components/tabs/ProxyTab';
import MusicTab from './components/tabs/MusicTab';
import MoreTab from './components/tabs/MoreTab';
import { useGetPreferences, useSavePreferences } from './hooks/useQueries';

type TabId = 'games' | 'proxy' | 'music' | 'more';

const accentColorMap: Record<string, string> = {
  cyan: 'oklch(0.78 0.22 195)',
  green: 'oklch(0.82 0.22 145)',
  purple: 'oklch(0.72 0.22 290)',
  pink: 'oklch(0.72 0.22 330)',
};

function App() {
  const [activeTab, setActiveTab] = useState<TabId>('games');
  const [accentColor, setAccentColor] = useState('cyan');
  const [prefsLoaded, setPrefsLoaded] = useState(false);
  const [tabKey, setTabKey] = useState(0);

  const { data: preferences } = useGetPreferences();
  const { mutate: savePreferences } = useSavePreferences();

  // Load preferences from backend
  useEffect(() => {
    if (preferences && !prefsLoaded) {
      if (preferences.lastActiveTab) {
        setActiveTab(preferences.lastActiveTab as TabId);
      }
      if (preferences.accentColor) {
        setAccentColor(preferences.accentColor);
      }
      setPrefsLoaded(true);
    }
  }, [preferences, prefsLoaded]);

  // Apply accent color to CSS variables
  useEffect(() => {
    const color = accentColorMap[accentColor] || accentColorMap.cyan;
    document.documentElement.style.setProperty('--neon-cyan', color);
    document.documentElement.style.setProperty('--primary', color.replace('oklch(', '').replace(')', ''));
    document.documentElement.style.setProperty('--ring', color.replace('oklch(', '').replace(')', ''));
  }, [accentColor]);

  const handleTabChange = useCallback((tab: string) => {
    setActiveTab(tab as TabId);
    setTabKey((k) => k + 1);
    savePreferences({ lastActiveTab: tab, accentColor });
  }, [accentColor, savePreferences]);

  const handleAccentColorChange = useCallback((color: string) => {
    setAccentColor(color);
    savePreferences({ lastActiveTab: activeTab, accentColor: color });
  }, [activeTab, savePreferences]);

  const renderTab = () => {
    switch (activeTab) {
      case 'games':
        return <GamesTab />;
      case 'proxy':
        return <ProxyTab />;
      case 'music':
        return <MusicTab />;
      case 'more':
        return (
          <MoreTab
            accentColor={accentColor}
            onAccentColorChange={handleAccentColorChange}
          />
        );
      default:
        return <GamesTab />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Animated Background */}
      <AnimatedBackground />

      {/* Custom Cursor */}
      <CustomCursor />

      {/* Scan line effect */}
      <div
        className="fixed inset-0 pointer-events-none z-10"
        style={{
          background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px)',
        }}
      />

      {/* Header */}
      <Header activeTab={activeTab} onTabChange={handleTabChange} />

      {/* Main Content */}
      <main className="flex-1 relative z-20 overflow-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 h-full">
          <div key={tabKey} className="tab-content-enter h-full">
            {renderTab()}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-20 glass border-t border-border/30 py-3 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <p className="text-xs text-muted-foreground font-body tracking-wider">
            © {new Date().getFullYear()} COLT UI · ALL RIGHTS RESERVED
          </p>
          <p className="text-xs text-muted-foreground font-body">
            Built with{' '}
            <span className="text-neon-cyan" style={{ textShadow: '0 0 6px oklch(0.78 0.22 195)' }}>♥</span>
            {' '}using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== 'undefined' ? window.location.hostname : 'colt-ui')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-neon-cyan hover:underline transition-colors"
              style={{ textShadow: '0 0 6px oklch(0.78 0.22 195)' }}
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
