import type React from "react";
import { useCallback, useEffect, useRef, useState } from "react";

interface Upgrade {
  id: string;
  name: string;
  description: string;
  baseCost: number;
  cpsPerOwned: number;
  count: number;
  emoji: string;
}

const INITIAL_UPGRADES: Upgrade[] = [
  {
    id: "auto-clicker",
    name: "Auto Clicker",
    description: "Clicks once per second automatically",
    baseCost: 10,
    cpsPerOwned: 1,
    count: 0,
    emoji: "🤖",
  },
  {
    id: "turbo-clicker",
    name: "Turbo Clicker",
    description: "A supercharged auto clicker",
    baseCost: 50,
    cpsPerOwned: 5,
    count: 0,
    emoji: "⚡",
  },
  {
    id: "laser-clicker",
    name: "Laser Clicker",
    description: "A laser that auto-clicks",
    baseCost: 100,
    cpsPerOwned: 10,
    count: 0,
    emoji: "🔴",
  },
  {
    id: "neon-farm",
    name: "Neon Farm",
    description: "Harvests neon energy passively",
    baseCost: 200,
    cpsPerOwned: 20,
    count: 0,
    emoji: "🌱",
  },
  {
    id: "neon-syndicate",
    name: "Neon Syndicate",
    description: "Underground neon org",
    baseCost: 500,
    cpsPerOwned: 50,
    count: 0,
    emoji: "🕶️",
  },
  {
    id: "cyber-mine",
    name: "Cyber Mine",
    description: "Digs deep for Colt Coins",
    baseCost: 1000,
    cpsPerOwned: 100,
    count: 0,
    emoji: "⛏️",
  },
  {
    id: "cyber-dragon",
    name: "Cyber Dragon",
    description: "A digital dragon farms coins",
    baseCost: 2500,
    cpsPerOwned: 250,
    count: 0,
    emoji: "🐉",
  },
  {
    id: "quantum-vault",
    name: "Quantum Vault",
    description: "Stores quantum coin potential",
    baseCost: 5000,
    cpsPerOwned: 500,
    count: 0,
    emoji: "🔮",
  },
  {
    id: "space-station",
    name: "Space Station",
    description: "Orbital coin farm",
    baseCost: 12000,
    cpsPerOwned: 1200,
    count: 0,
    emoji: "🛸",
  },
  {
    id: "matrix-core",
    name: "Matrix Core",
    description: "Simulates infinite coin reality",
    baseCost: 20000,
    cpsPerOwned: 2000,
    count: 0,
    emoji: "🧠",
  },
  {
    id: "time-warp",
    name: "Time Warp",
    description: "Bends time for coins",
    baseCost: 60000,
    cpsPerOwned: 6000,
    count: 0,
    emoji: "⏰",
  },
  {
    id: "dimension-rift",
    name: "Dimension Rift",
    description: "Pulls coins from other dimensions",
    baseCost: 250000,
    cpsPerOwned: 25000,
    count: 0,
    emoji: "🌀",
  },
  {
    id: "double-click",
    name: "Double Click",
    description: "Each click gives 2 coins",
    baseCost: 25,
    cpsPerOwned: 0,
    count: 0,
    emoji: "✌️",
  },
  {
    id: "triple-click",
    name: "Triple Click",
    description: "Each click gives 3 coins",
    baseCost: 100,
    cpsPerOwned: 0,
    count: 0,
    emoji: "🖖",
  },
];

interface Achievement {
  id: string;
  name: string;
  description: string;
  unlocked: boolean;
}

const ACHIEVEMENT_DEFS = [
  {
    id: "first-click",
    name: "First Click",
    description: "Click the colt once",
  },
  {
    id: "getting-started",
    name: "Getting Started",
    description: "Reach 100 coins",
  },
  {
    id: "coin-collector",
    name: "Coin Collector",
    description: "Reach 1,000 coins",
  },
  {
    id: "shop-owner",
    name: "Shop Owner",
    description: "Buy your first upgrade",
  },
  {
    id: "power-buyer",
    name: "Power Buyer",
    description: "Buy 5 upgrades total",
  },
  { id: "cps-king", name: "CPS King", description: "Reach 100 CPS" },
  {
    id: "millionaire",
    name: "Millionaire",
    description: "Earn 1,000,000 coins total",
  },
  {
    id: "speed-demon",
    name: "Speed Demon",
    description: "Click 50 times in one session",
  },
  { id: "shop-namer", name: "Shop Namer", description: "Rename your shop" },
  { id: "legend", name: "Legend", description: "Reach 10,000,000 total coins" },
];

function getUpgradeCost(upgrade: Upgrade): number {
  return Math.floor(upgrade.baseCost * 1.15 ** upgrade.count);
}

interface FloatingCoin {
  id: number;
  x: number;
  y: number;
}

function loadAchievements(): Achievement[] {
  const stored = localStorage.getItem("colt_achievements");
  const unlocked: string[] = stored ? JSON.parse(stored) : [];
  return ACHIEVEMENT_DEFS.map((a) => ({
    ...a,
    unlocked: unlocked.includes(a.id),
  }));
}

function saveAchievements(achievements: Achievement[]) {
  const unlocked = achievements.filter((a) => a.unlocked).map((a) => a.id);
  localStorage.setItem("colt_achievements", JSON.stringify(unlocked));
}

export default function ColtClicker() {
  const [coins, setCoins] = useState(0);
  const [totalCoins, setTotalCoins] = useState(0);
  const [totalEverEarned, setTotalEverEarned] = useState(0);
  const [totalClicks, setTotalClicks] = useState(0);
  const [totalUpgradesBought, setTotalUpgradesBought] = useState(0);
  const [upgrades, setUpgrades] = useState<Upgrade[]>(INITIAL_UPGRADES);
  const [isClickAnimating, setIsClickAnimating] = useState(false);
  const [isFlashing, setIsFlashing] = useState(false);
  const [floatingCoins, setFloatingCoins] = useState<FloatingCoin[]>([]);
  const [shopName, setShopName] = useState(
    () => localStorage.getItem("colt_shop_name") ?? "Colt's Shop",
  );
  const [isEditingName, setIsEditingName] = useState(false);
  const [editNameVal, setEditNameVal] = useState("");
  const [achievements, setAchievements] =
    useState<Achievement[]>(loadAchievements);
  const [showAchievements, setShowAchievements] = useState(false);
  const floatingIdRef = useRef(0);
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const cps = upgrades
    .filter((u) => u.cpsPerOwned > 0)
    .reduce((sum, u) => sum + u.cpsPerOwned * u.count, 0);

  const clickMultiplier = upgrades.reduce((mult, u) => {
    if (u.id === "triple-click" && u.count > 0) return 3;
    if (u.id === "double-click" && u.count > 0) return Math.max(mult, 2);
    return mult;
  }, 1);

  // Achievement checker
  const checkAchievements = useCallback(
    (params: {
      clicks: number;
      everEarned: number;
      upgradesBought: number;
      currentCps: number;
      shopRenamed: boolean;
    }) => {
      setAchievements((prev) => {
        let changed = false;
        const next = prev.map((a) => {
          if (a.unlocked) return a;
          let unlock = false;
          if (a.id === "first-click" && params.clicks >= 1) unlock = true;
          if (a.id === "getting-started" && params.everEarned >= 100)
            unlock = true;
          if (a.id === "coin-collector" && params.everEarned >= 1000)
            unlock = true;
          if (a.id === "shop-owner" && params.upgradesBought >= 1)
            unlock = true;
          if (a.id === "power-buyer" && params.upgradesBought >= 5)
            unlock = true;
          if (a.id === "cps-king" && params.currentCps >= 100) unlock = true;
          if (a.id === "millionaire" && params.everEarned >= 1_000_000)
            unlock = true;
          if (a.id === "speed-demon" && params.clicks >= 50) unlock = true;
          if (a.id === "shop-namer" && params.shopRenamed) unlock = true;
          if (a.id === "legend" && params.everEarned >= 10_000_000)
            unlock = true;
          if (unlock) {
            changed = true;
            return { ...a, unlocked: true };
          }
          return a;
        });
        if (changed) saveAchievements(next);
        return changed ? next : prev;
      });
    },
    [],
  );

  useEffect(() => {
    tickRef.current = setInterval(() => {
      if (cps > 0) {
        const earned = cps / 10;
        setCoins((prev) => prev + earned);
        setTotalCoins((prev) => prev + earned);
        setTotalEverEarned((prev) => {
          const next = prev + earned;
          checkAchievements({
            clicks: totalClicks,
            everEarned: next,
            upgradesBought: totalUpgradesBought,
            currentCps: cps,
            shopRenamed: shopName !== "Colt's Shop",
          });
          return next;
        });
      }
    }, 100);
    return () => {
      if (tickRef.current) clearInterval(tickRef.current);
    };
  }, [cps, totalClicks, totalUpgradesBought, shopName, checkAchievements]);

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      const earned = clickMultiplier;
      setCoins((prev) => prev + earned);
      setTotalCoins((prev) => prev + earned);
      setTotalEverEarned((prev) => prev + earned);
      const newClicks = totalClicks + 1;
      setTotalClicks(newClicks);
      setIsClickAnimating(true);
      setIsFlashing(true);
      setTimeout(() => setIsClickAnimating(false), 200);
      setTimeout(() => setIsFlashing(false), 300);

      checkAchievements({
        clicks: newClicks,
        everEarned: totalEverEarned + earned,
        upgradesBought: totalUpgradesBought,
        currentCps: cps,
        shopRenamed: shopName !== "Colt's Shop",
      });

      const rect = buttonRef.current?.getBoundingClientRect();
      if (rect) {
        const id = ++floatingIdRef.current;
        const x = e.clientX - rect.left + (Math.random() - 0.5) * 30;
        const y = e.clientY - rect.top - 10;
        setFloatingCoins((prev) => [...prev, { id, x, y }]);
        setTimeout(() => {
          setFloatingCoins((prev) => prev.filter((c) => c.id !== id));
        }, 900);
      }
    },
    [
      clickMultiplier,
      totalClicks,
      totalEverEarned,
      totalUpgradesBought,
      cps,
      shopName,
      checkAchievements,
    ],
  );

  const handleBuy = (upgradeId: string) => {
    setUpgrades((prev) =>
      prev.map((u) => {
        if (u.id !== upgradeId) return u;
        const cost = getUpgradeCost(u);
        if (coins < cost) return u;
        setCoins((c) => c - cost);
        const newBought = totalUpgradesBought + 1;
        setTotalUpgradesBought(newBought);
        checkAchievements({
          clicks: totalClicks,
          everEarned: totalEverEarned,
          upgradesBought: newBought,
          currentCps: cps,
          shopRenamed: shopName !== "Colt's Shop",
        });
        return { ...u, count: u.count + 1 };
      }),
    );
  };

  const handleRenameShop = () => {
    const trimmed = editNameVal.trim();
    if (!trimmed) return;
    setShopName(trimmed);
    localStorage.setItem("colt_shop_name", trimmed);
    setIsEditingName(false);
    checkAchievements({
      clicks: totalClicks,
      everEarned: totalEverEarned,
      upgradesBought: totalUpgradesBought,
      currentCps: cps,
      shopRenamed: true,
    });
  };

  const formatCoins = (n: number): string => {
    if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(2)}B`;
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(2)}M`;
    if (n >= 1_000) return `${(n / 1_000).toFixed(2)}K`;
    return Math.floor(n).toString();
  };

  const totalCps = upgrades.reduce(
    (sum, u) => sum + u.cpsPerOwned * u.count,
    0,
  );

  const unlockedCount = achievements.filter((a) => a.unlocked).length;

  return (
    <div
      className="w-full max-w-4xl mx-auto flex flex-col lg:flex-row gap-4"
      style={{ minHeight: "500px" }}
    >
      {/* ── Left: Clicker ── */}
      <div className="flex-1 flex flex-col items-center justify-center gap-6 p-6">
        {/* Coin counter */}
        <div className="text-center">
          <div
            className={`font-bold text-5xl transition-all duration-200 ${isFlashing ? "coin-flash" : ""}`}
            data-ocid="coltclicker.card"
            style={{
              color: "#ffdd00",
              textShadow: "0 0 20px #ffdd00, 0 0 40px #ffdd0088",
            }}
          >
            {formatCoins(coins)}
          </div>
          <div className="text-sm text-yellow-300/70 mt-1">Colt Coins</div>
        </div>

        {/* Stats row */}
        <div className="flex gap-6 text-xs text-gray-400">
          <div className="text-center">
            <div className="font-bold text-yellow-400">
              {formatCoins(totalCps)}/sec
            </div>
            <div>per second</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-yellow-400">{clickMultiplier}</div>
            <div>per click</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-yellow-400">
              {formatCoins(totalCoins)}
            </div>
            <div>all time</div>
          </div>
        </div>

        {/* Big COLT button */}
        <div className="relative">
          <button
            ref={buttonRef}
            type="button"
            data-ocid="coltclicker.primary_button"
            onClick={handleClick}
            className={`relative select-none transition-transform duration-100 active:scale-90 ${isClickAnimating ? "colt-click" : ""}`}
            style={{
              width: "180px",
              height: "180px",
              borderRadius: "50%",
              background:
                "radial-gradient(circle at 35% 35%, #ffd700, #ff8800, #ff4400)",
              border: "4px solid #ffdd00",
              boxShadow: `
                0 0 30px #ffdd0088,
                0 0 60px #ff880044,
                inset 0 0 30px rgba(255,255,255,0.1)
              `,
              fontSize: "3rem",
              fontWeight: 900,
              color: "#fff",
              textShadow:
                "0 0 10px rgba(255,255,255,0.8), 2px 2px 4px rgba(0,0,0,0.5)",
              cursor: "none",
            }}
          >
            COLT
          </button>

          {/* Floating +N indicators */}
          {floatingCoins.map((fc) => (
            <div
              key={fc.id}
              className="absolute pointer-events-none font-bold text-yellow-300 text-lg"
              style={{
                left: fc.x,
                top: fc.y,
                animation: "float-up 0.9s ease-out forwards",
                textShadow: "0 0 8px #ffdd00",
                zIndex: 10,
              }}
            >
              +{clickMultiplier}
            </div>
          ))}
        </div>

        <p className="text-xs text-gray-600">
          Click the button to earn Colt Coins!
        </p>

        {/* Achievements toggle */}
        <button
          type="button"
          data-ocid="coltclicker.toggle"
          onClick={() => setShowAchievements((v) => !v)}
          className="px-4 py-2 rounded-xl text-xs font-bold border border-yellow-500/30 bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20 transition-all"
        >
          🏆 Achievements ({unlockedCount}/{achievements.length})
          {showAchievements ? " ▲" : " ▼"}
        </button>

        {/* Achievements panel */}
        {showAchievements && (
          <div className="w-full max-w-sm flex flex-col gap-2">
            {achievements.map((ach) => (
              <div
                key={ach.id}
                data-ocid="coltclicker.item.1"
                className={`flex items-center gap-3 p-2 rounded-lg border text-xs transition-all ${
                  ach.unlocked
                    ? "border-yellow-400/50 bg-yellow-400/10"
                    : "border-white/5 bg-white/3 opacity-50"
                }`}
              >
                <span className="text-lg">{ach.unlocked ? "🏆" : "🔒"}</span>
                <div>
                  <div
                    className={`font-bold ${
                      ach.unlocked ? "text-yellow-300" : "text-gray-500"
                    }`}
                    style={
                      ach.unlocked ? { textShadow: "0 0 8px #ffdd0088" } : {}
                    }
                  >
                    {ach.unlocked ? ach.name : "???"}
                  </div>
                  <div className="text-gray-500">
                    {ach.unlocked ? ach.description : "Keep playing to unlock"}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Right: Upgrades ── */}
      <div
        className="lg:w-72 flex flex-col gap-2 p-4 overflow-y-auto"
        style={{ maxHeight: "600px" }}
      >
        {/* Shop Name */}
        <div className="text-center mb-1">
          {isEditingName ? (
            <div className="flex gap-1">
              <input
                type="text"
                data-ocid="coltclicker.input"
                value={editNameVal}
                onChange={(e) => setEditNameVal(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleRenameShop()}
                className="flex-1 bg-black/40 border border-yellow-500/40 rounded-lg px-2 py-1 text-xs text-yellow-300 outline-none"
                maxLength={30}
              />
              <button
                type="button"
                data-ocid="coltclicker.save_button"
                onClick={handleRenameShop}
                className="px-2 py-1 rounded-lg bg-yellow-500/20 border border-yellow-500/40 text-yellow-400 text-xs"
              >
                ✓
              </button>
              <button
                type="button"
                data-ocid="coltclicker.cancel_button"
                onClick={() => setIsEditingName(false)}
                className="px-2 py-1 rounded-lg bg-white/5 border border-white/10 text-gray-400 text-xs"
              >
                ✕
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2">
              <span
                className="font-bold text-sm"
                style={{ color: "#ffdd00", textShadow: "0 0 10px #ffdd0066" }}
              >
                🏪 {shopName}
              </span>
              <button
                type="button"
                data-ocid="coltclicker.edit_button"
                onClick={() => {
                  setEditNameVal(shopName);
                  setIsEditingName(true);
                }}
                className="text-gray-500 hover:text-yellow-400 transition-colors text-xs"
                title="Rename shop"
              >
                ✏️
              </button>
            </div>
          )}
        </div>

        <h3
          className="font-bold text-base text-center mb-2"
          style={{ color: "#ffdd00", textShadow: "0 0 10px #ffdd0066" }}
        >
          ⬆️ UPGRADES
        </h3>
        {upgrades.map((u) => {
          const cost = getUpgradeCost(u);
          const canAfford = coins >= cost;
          const isClickUpgrade =
            u.id === "double-click" || u.id === "triple-click";
          const maxedClick =
            (u.id === "double-click" &&
              clickMultiplier >= 2 &&
              upgrades.find((x) => x.id === "triple-click")?.count === 0) ||
            (u.id === "triple-click" && clickMultiplier >= 3);
          const alreadyActive = isClickUpgrade && u.count > 0;

          return (
            <button
              key={u.id}
              type="button"
              data-ocid="coltclicker.secondary_button"
              onClick={() => handleBuy(u.id)}
              disabled={!canAfford || maxedClick}
              className={`p-3 rounded-xl border text-left transition-all hover:scale-[1.02] disabled:opacity-40 disabled:cursor-not-allowed ${
                canAfford && !maxedClick
                  ? "border-yellow-500/60 bg-yellow-500/10 hover:bg-yellow-500/20"
                  : "border-white/10 bg-white/5"
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{u.emoji}</span>
                  <div>
                    <div
                      className={`text-xs font-semibold ${
                        canAfford && !maxedClick
                          ? "text-yellow-300"
                          : "text-gray-400"
                      }`}
                    >
                      {u.name}
                    </div>
                    {u.cpsPerOwned > 0 && (
                      <div className="text-xs text-gray-500">
                        {u.cpsPerOwned} CPS each
                      </div>
                    )}
                    {isClickUpgrade && (
                      <div className="text-xs text-gray-500">
                        {alreadyActive ? "✓ Active" : `${u.description}`}
                      </div>
                    )}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div
                    className={`text-xs font-bold ${
                      canAfford && !maxedClick
                        ? "text-yellow-400"
                        : "text-gray-500"
                    }`}
                  >
                    {maxedClick ? "MAX" : `${formatCoins(cost)}🪙`}
                  </div>
                  {u.count > 0 && (
                    <div className="text-xs text-gray-500">×{u.count}</div>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Float-up animation style */}
      <style>{`
        @keyframes float-up {
          0% { opacity: 1; transform: translateY(0) scale(1); }
          100% { opacity: 0; transform: translateY(-60px) scale(1.3); }
        }
      `}</style>
    </div>
  );
}
