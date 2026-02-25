import React from 'react';
import GlassCard from '../GlassCard';
import { useGetCCoins, useSpendCCoins, useGetPurchasedEffects, useSetPurchasedEffects } from '../../hooks/useQueries';
import { Coins, ShoppingBag, Check, Sparkles } from 'lucide-react';

interface StoreItem {
  id: string;
  name: string;
  description: string;
  price: number;
  icon: string;
  category: string;
}

const STORE_ITEMS: StoreItem[] = [
  { id: 'rainbow-cursor-trail', name: 'Rainbow Cursor Trail', description: 'Leave a colorful rainbow trail wherever your cursor goes!', price: 500, icon: '🌈', category: 'Cursor' },
  { id: 'fireworks-on-click', name: 'Fireworks on Click', description: 'Explosive firework particles burst from every click!', price: 400, icon: '🎆', category: 'Click' },
  { id: 'screen-shake', name: 'Screen Shake', description: 'Subtle screen shake effect on major actions.', price: 300, icon: '📳', category: 'Effect' },
  { id: 'confetti-burst', name: 'Confetti Burst', description: 'Colorful confetti rains down when you switch tabs!', price: 350, icon: '🎊', category: 'Effect' },
  { id: 'neon-pulse-overlay', name: 'Neon Pulse Overlay', description: 'A pulsing neon glow overlay that breathes with the app.', price: 600, icon: '💫', category: 'Visual' },
  { id: 'golden-card-borders', name: 'Golden Card Borders', description: 'All cards get a luxurious golden border glow!', price: 750, icon: '✨', category: 'Visual' },
  { id: 'glitch-text-effect', name: 'Glitch Text Effect', description: 'Headers glitch and flicker with a cyberpunk effect.', price: 450, icon: '⚡', category: 'Text' },
  { id: 'vip-badge', name: 'VIP Badge', description: 'Show off a golden VIP badge next to your name in the header!', price: 1000, icon: '👑', category: 'Badge' },
];

export default function StoreTab() {
  const { data: cCoins = BigInt(0), isLoading: coinsLoading } = useGetCCoins();
  const { data: purchasedEffects = [], isLoading: effectsLoading } = useGetPurchasedEffects();
  const spendCCoins = useSpendCCoins();
  const setPurchasedEffects = useSetPurchasedEffects();

  const coinsNum = Number(cCoins);

  const handleBuy = async (item: StoreItem) => {
    if (coinsNum < item.price) return;
    if (purchasedEffects.includes(item.id)) return;

    const success = await spendCCoins.mutateAsync(BigInt(item.price));
    if (success) {
      const newEffects = [...purchasedEffects, item.id];
      await setPurchasedEffects.mutateAsync(newEffects);
    }
  };

  const isLoading = coinsLoading || effectsLoading;

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto">
      {/* Header */}
      <GlassCard className="p-5">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-yellow-500/20 border border-yellow-500/50 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5 text-yellow-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-yellow-400" style={{ textShadow: '0 0 10px rgba(234,179,8,0.5)' }}>
                C Coin Store
              </h2>
              <p className="text-xs text-gray-400">Spend your C Coins on cool effects!</p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/30 rounded-full px-4 py-2">
            <Coins className="w-5 h-5 text-yellow-400" />
            {isLoading ? (
              <span className="text-yellow-400 font-bold">Loading...</span>
            ) : (
              <span className="text-yellow-400 font-bold text-lg">{coinsNum.toLocaleString()} C</span>
            )}
          </div>
        </div>
      </GlassCard>

      {/* Store Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {STORE_ITEMS.map(item => {
          const owned = purchasedEffects.includes(item.id);
          const canAfford = coinsNum >= item.price;
          const isBuying = spendCCoins.isPending || setPurchasedEffects.isPending;

          return (
            <GlassCard key={item.id} hoverable className="p-4 flex flex-col gap-3">
              <div className="text-3xl text-center">{item.icon}</div>
              <div>
                <div className="flex items-center justify-between gap-1 mb-1">
                  <h3 className="font-bold text-white text-sm">{item.name}</h3>
                  <span className="text-xs text-gray-500 bg-white/5 px-2 py-0.5 rounded-full">{item.category}</span>
                </div>
                <p className="text-xs text-gray-400">{item.description}</p>
              </div>
              <div className="mt-auto flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <Coins className="w-4 h-4 text-yellow-400" />
                  <span className="text-yellow-400 font-bold text-sm">{item.price}</span>
                </div>
                {owned ? (
                  <div className="flex items-center gap-1 bg-neon-green/20 border border-neon-green/40 text-neon-green text-xs px-3 py-1.5 rounded-lg">
                    <Check className="w-3 h-3" />
                    Owned
                  </div>
                ) : (
                  <button
                    onClick={() => handleBuy(item)}
                    disabled={!canAfford || isBuying || isLoading}
                    className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition-all ${
                      canAfford
                        ? 'bg-yellow-500/20 border border-yellow-500/50 text-yellow-400 hover:bg-yellow-500/30 hover:scale-105'
                        : 'bg-white/5 border border-white/10 text-gray-500 cursor-not-allowed'
                    } disabled:opacity-50`}
                  >
                    {isBuying ? (
                      <Sparkles className="w-3 h-3 animate-spin inline" />
                    ) : canAfford ? 'Buy' : 'Need more C'}
                  </button>
                )}
              </div>
            </GlassCard>
          );
        })}
      </div>

      {/* Footer hint */}
      <p className="text-center text-xs text-gray-600">
        💡 Tip: Visit the Music tab to unlock more C Coins!
      </p>
    </div>
  );
}
