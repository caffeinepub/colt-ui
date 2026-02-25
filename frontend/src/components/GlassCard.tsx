import React from 'react';
import { cn } from '@/lib/utils';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
  hoverable?: boolean;
  neonColor?: 'cyan' | 'green' | 'purple' | 'pink';
}

const neonColors = {
  cyan: 'hover:border-neon-cyan hover:shadow-neon',
  green: 'hover:border-neon-green hover:shadow-neon-green',
  purple: 'hover:border-neon-purple hover:shadow-neon-purple',
  pink: 'hover:border-[oklch(0.72_0.22_330)] hover:shadow-[0_0_10px_oklch(0.72_0.22_330)]',
};

const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className,
  style,
  onClick,
  hoverable = false,
  neonColor = 'cyan',
}) => {
  return (
    <div
      onClick={onClick}
      style={style}
      className={cn(
        'glass rounded-lg border border-border/50 transition-all duration-300',
        hoverable && [
          'cursor-pointer',
          neonColors[neonColor],
          'hover:scale-[1.02] hover:bg-white/5',
        ],
        className
      )}
    >
      {children}
    </div>
  );
};

export default GlassCard;
