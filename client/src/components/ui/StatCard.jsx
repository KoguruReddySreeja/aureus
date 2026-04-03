import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import GlowCard from './GlowCard.jsx';

export default function StatCard({ title, value, icon: Icon, trend, trendValue, primary }) {
  const trendColor = trend === 'positive' ? 'text-success' : trend === 'negative' ? 'text-danger' : 'text-text-muted';
  const TrendIcon = trend === 'positive' ? TrendingUp : trend === 'negative' ? TrendingDown : Minus;

  return (
    <GlowCard
      className={`rounded-xl border border-border bg-surface p-5 transition-colors duration-200 hover:border-elevated-2 hover:bg-surface-2 ${
        primary ? 'border-l-4 border-l-accent shadow-[0_0_20px_rgba(47,129,247,0.08)]' : ''
      }`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {Icon && <Icon className="w-4 h-4 text-text-secondary" />}
          <span className="text-sm text-text-secondary">{title}</span>
        </div>
        <div className={`flex items-center gap-1 ${trendColor}`}>
          <TrendIcon className="w-3.5 h-3.5" />
        </div>
      </div>
      <div className="font-mono text-2xl font-semibold text-text-primary mb-1">
        {value}
      </div>
      {trendValue !== undefined && (
        <div className={`flex items-center gap-1 text-xs ${trendColor}`}>
          <span>{trend === 'positive' ? '↑' : trend === 'negative' ? '↓' : '—'} {trendValue} vs last mo.</span>
        </div>
      )}
    </GlowCard>
  );
}
