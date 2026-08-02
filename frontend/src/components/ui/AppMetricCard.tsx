import React from 'react';

interface AppMetricCardProps {
  title: string;
  value: string | number;
  changeText?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  sparklineType?: 'up' | 'down' | 'flat' | 'growth';
  icon: React.ComponentType<any>;
  iconColor?: string;
  insightText?: string;
  accentColor?: string;
}

export const AppMetricCard: React.FC<AppMetricCardProps> = ({
  title,
  value,
  changeText,
  changeType = 'neutral',
  sparklineType = 'flat',
  icon: Icon,
  iconColor,
  insightText,
  accentColor,
}) => {
  const accent = accentColor ?? 'var(--theme-accent-start)';

  const getSparklinePath = () => {
    switch (sparklineType) {
      case 'up':     return 'M0 16 Q 10 10, 20 13 T 40 6 T 50 2';
      case 'down':   return 'M0 4 Q 10 12, 20 8 T 40 14 T 50 18';
      case 'growth': return 'M0 18 Q 15 14, 25 16 T 50 4';
      default:       return 'M0 14 L 10 11 L 20 13 L 30 9 L 40 7 L 50 4';
    }
  };

  const trendColor =
    changeType === 'positive' ? '#10B981'
    : changeType === 'negative' ? '#EF4444'
    : 'var(--theme-text-muted)';

  return (
    <div
      className="relative overflow-hidden group cursor-pointer transition-all duration-200 rounded-2xl p-5"
      style={{
        background: 'var(--theme-card)',
        border: `1px solid var(--theme-border)`,
        boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
      }}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLElement;
        el.style.transform = 'translateY(-2px)';
        el.style.boxShadow = `0 8px 24px rgba(0,0,0,0.3), 0 0 0 1px ${accent}30`;
        el.style.borderColor = `${accent}40`;
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLElement;
        el.style.transform = '';
        el.style.boxShadow = '0 1px 3px rgba(0,0,0,0.2)';
        el.style.borderColor = 'var(--theme-border)';
      }}
    >
      {/* Top accent gradient line */}
      <div
        className="absolute top-0 left-0 right-0 h-[1.5px] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: `linear-gradient(90deg, ${accent}, transparent)` }}
      />

      {/* Background glow blob */}
      <div
        className="absolute -top-8 -right-8 w-28 h-28 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ background: `radial-gradient(circle, ${accent}12, transparent 70%)` }}
      />

      <div className="flex items-start justify-between mb-3">
        {/* Icon badge */}
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{
            background: `${accent}15`,
            border: `1px solid ${accent}25`,
          }}
        >
          <Icon
            className="w-5 h-5"
            style={{ color: iconColor ?? accent }}
          />
        </div>

        {/* Sparkline */}
        <svg
          className="w-16 h-7 opacity-60 group-hover:opacity-100 transition-opacity"
          viewBox="0 0 50 20"
          style={{ color: trendColor }}
        >
          <path
            d={getSparklinePath()}
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      <div className="space-y-0.5">
        <span
          className="text-[11px] font-bold uppercase tracking-[0.08em] block"
          style={{ color: 'var(--theme-text-muted)' }}
        >
          {title}
        </span>
        <h3
          className="text-3xl font-bold font-mono leading-none"
          style={{ color: 'var(--theme-text)', fontVariantNumeric: 'tabular-nums' }}
        >
          {value}
        </h3>
      </div>

      {(changeText || insightText) && (
        <div className="mt-3 pt-3 flex items-center gap-2" style={{ borderTop: '1px solid var(--theme-border)' }}>
          {changeText && (
            <span
              className="text-[11px] font-mono font-bold flex items-center gap-1"
              style={{ color: trendColor }}
            >
              {changeType === 'positive' ? '▲' : changeType === 'negative' ? '▼' : '→'}
              {changeText}
            </span>
          )}
          {insightText && (
            <span
              className="text-[11px] truncate font-sans font-medium"
              style={{ color: 'var(--theme-text-muted)' }}
            >
              {insightText}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
