import React from 'react';
import { AppCard } from './AppCard';

interface AppMetricCardProps {
  title: string;
  value: string | number;
  changeText?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  sparklineType?: 'up' | 'down' | 'flat' | 'growth';
  icon: React.ComponentType<any>;
  iconColor?: string;
  insightText?: string;
}

export const AppMetricCard: React.FC<AppMetricCardProps> = ({
  title,
  value,
  changeText,
  changeType = 'neutral',
  sparklineType = 'flat',
  icon: Icon,
  iconColor = 'text-[#06B6D4]',
  insightText
}) => {
  const getSparklinePath = () => {
    switch(sparklineType) {
      case 'up': return "M0 15 Q 10 5, 20 12 T 40 4 T 50 2";
      case 'down': return "M0 8 Q 10 16, 20 10 T 40 14 T 50 6";
      case 'growth': return "M0 16 Q 15 12, 25 15 T 50 5";
      case 'flat':
      default: return "M0 18 L 10 14 L 20 15 L 30 11 L 40 8 L 50 4";
    }
  };

  const getSparklineColor = () => {
    if (changeType === 'positive') return 'text-[#22C55E]';
    if (changeType === 'negative') return 'text-[#EF4444]';
    return 'text-[#06B6D4]';
  };

  return (
    <AppCard hoverable className="flex items-center justify-between p-5 relative overflow-hidden group">
      <div className="space-y-1.5 flex-1 min-w-0 pr-2">
        <span className="text-[10px] font-sans font-semibold text-slate-500 uppercase tracking-wider block truncate">{title}</span>
        <h3 className="text-2xl font-bold font-mono text-slate-100">{value}</h3>
        <div className="flex items-center space-x-3 pt-1">
          {changeText && (
            <span className={`text-[10px] font-mono font-medium ${
              changeType === 'positive' ? 'text-[#22C55E]' : changeType === 'negative' ? 'text-[#EF4444]' : 'text-slate-400'
            }`}>
              {changeText}
            </span>
          )}
          <svg className={`w-14 h-5 ${getSparklineColor()}`} viewBox="0 0 50 20">
            <path d={getSparklinePath()} fill="none" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        </div>
        {insightText && (
          <span className="text-[9px] text-slate-500 block truncate font-sans">{insightText}</span>
        )}
      </div>
      <div className="bg-slate-800/40 p-2.5 rounded-xl border border-slate-700/30 flex-shrink-0 transition-colors group-hover:border-[#06B6D4]/30">
        <Icon className={`w-5 h-5 ${iconColor}`} />
      </div>
    </AppCard>
  );
};
