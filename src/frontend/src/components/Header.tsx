import React from "react";

interface HeaderProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  vipOwned?: boolean;
  username?: string;
}

const TABS = [
  { id: "games", label: "🎮 Games" },
  { id: "proxy", label: "🌐 Proxy" },
  { id: "media", label: "📺 Media" },
  { id: "colt-ai", label: "🤖 Colt AI" },
  { id: "more", label: "⚙️ More" },
];

export default function Header({
  activeTab,
  onTabChange,
  vipOwned,
  username,
}: HeaderProps) {
  return (
    <header className="glass-card border-b border-white/10 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          {/* Logo */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <div
              className="w-[42px] h-[42px] rounded-full flex items-center justify-center font-black text-xl text-neon-cyan border-2 border-neon-cyan/60"
              style={{
                boxShadow:
                  "0 0 12px rgba(0,255,255,0.4), inset 0 0 8px rgba(0,255,255,0.1)",
              }}
            >
              C
            </div>
            <div className="flex items-center gap-2">
              <span className="text-white font-bold text-lg tracking-widest">
                COLT UI
              </span>
              {vipOwned && (
                <span
                  className="text-xs px-2 py-0.5 rounded-full font-bold"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(234,179,8,0.3), rgba(251,191,36,0.2))",
                    border: "1px solid rgba(234,179,8,0.5)",
                    color: "#fbbf24",
                    textShadow: "0 0 8px rgba(234,179,8,0.6)",
                  }}
                >
                  👑 VIP
                </span>
              )}
            </div>
          </div>

          {/* Tabs */}
          <nav className="flex items-center gap-1 flex-wrap">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => onTabChange(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all hover:scale-105 ${
                  activeTab === tab.id
                    ? "bg-neon-cyan/20 border border-neon-cyan/50 text-neon-cyan"
                    : "text-gray-400 hover:text-white hover:bg-white/10 border border-transparent"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>

          {/* Status with username */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="w-2 h-2 rounded-full bg-neon-green animate-pulse" />
            {username ? (
              <span className="text-xs text-gray-300">
                <span className="text-white font-semibold">{username}</span>
                <span className="text-gray-500"> · Online</span>
              </span>
            ) : (
              <span className="text-xs text-gray-400">Online</span>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
