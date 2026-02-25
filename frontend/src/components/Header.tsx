import React from 'react';

interface HeaderProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const tabs = [
  { id: 'games', label: 'GAMES', icon: '🎮' },
  { id: 'proxy', label: 'PROXY', icon: '🌐' },
  { id: 'music', label: 'MUSIC', icon: '🎵' },
  { id: 'more', label: 'MORE', icon: '⚡' },
];

const Header: React.FC<HeaderProps> = ({ activeTab, onTabChange }) => {
  return (
    <header className="relative z-50 glass border-b border-border/50">
      <div className="flex items-center justify-between px-6 py-3">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-8 h-8 rounded border border-neon-cyan flex items-center justify-center"
              style={{ boxShadow: '0 0 10px oklch(0.78 0.22 195), inset 0 0 10px oklch(0.78 0.22 195 / 0.1)' }}>
              <span className="text-neon-cyan font-display text-xs font-bold">C</span>
            </div>
          </div>
          <div>
            <h1 className="font-display text-xl font-bold tracking-widest neon-text">
              COLT UI
            </h1>
            <p className="text-xs text-muted-foreground tracking-wider font-body" style={{ fontSize: '9px' }}>
              ENTERTAINMENT HUB
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`
                relative px-5 py-2 font-display text-xs tracking-widest transition-all duration-300
                ${activeTab === tab.id
                  ? 'text-neon-cyan'
                  : 'text-muted-foreground hover:text-foreground'
                }
              `}
            >
              <span className="hidden sm:inline mr-1">{tab.icon}</span>
              {tab.label}
              {activeTab === tab.id && (
                <span
                  className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full"
                  style={{
                    background: 'oklch(0.78 0.22 195)',
                    boxShadow: '0 0 8px oklch(0.78 0.22 195)',
                  }}
                />
              )}
            </button>
          ))}
        </nav>

        {/* Status indicator */}
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-neon-green animate-pulse-neon"
            style={{ boxShadow: '0 0 6px oklch(0.82 0.22 145)' }} />
          <span className="text-xs text-muted-foreground font-body tracking-wider hidden sm:block">ONLINE</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
