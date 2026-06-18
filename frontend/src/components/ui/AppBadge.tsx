import React from 'react';

type BadgeColor = 'success' | 'warning' | 'danger' | 'info' | 'muted';

interface AppBadgeProps {
  children: React.ReactNode;
  color?: BadgeColor;
  className?: string;
}

export const AppBadge: React.FC<AppBadgeProps> = ({ children, color = 'info', className = '' }) => {
  const colors = {
    success: 'bg-[#22C55E]/10 text-[#22C55E] border-[#22C55E]/20',
    warning: 'bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/20',
    danger: 'bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/20',
    info: 'bg-[#06B6D4]/10 text-[#06B6D4] border-[#06B6D4]/20',
    muted: 'bg-[#1E293B] text-slate-400 border-[#1E293B]'
  };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded font-mono text-[9px] font-bold border uppercase tracking-wider ${colors[color]} ${className}`}>
      {children}
    </span>
  );
};
