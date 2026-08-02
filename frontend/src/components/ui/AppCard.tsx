import React from 'react';

interface AppCardProps {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
  onClick?: () => void;
  accentColor?: string;
  glassEffect?: boolean;
}

export const AppCard: React.FC<AppCardProps> = ({
  children,
  className = '',
  hoverable = false,
  onClick,
  accentColor,
  glassEffect = false,
}) => {
  return (
    <div
      onClick={onClick}
      className={`relative overflow-hidden transition-all duration-200 ${
        hoverable ? 'cursor-pointer' : ''
      } ${onClick ? 'cursor-pointer' : ''} ${className}`}
      style={{
        background: glassEffect
          ? 'rgba(19, 28, 46, 0.65)'
          : 'var(--theme-card, #131C2E)',
        backdropFilter: glassEffect ? 'blur(16px)' : undefined,
        WebkitBackdropFilter: glassEffect ? 'blur(16px)' : undefined,
        border: `1px solid ${accentColor ? accentColor + '28' : 'var(--theme-border, #1E293B)'}`,
        borderRadius: '16px',
        boxShadow: hoverable
          ? '0 1px 3px rgba(0,0,0,0.2), 0 1px 2px rgba(0,0,0,0.15)'
          : undefined,
      }}
      onMouseEnter={
        hoverable
          ? e => {
              const el = e.currentTarget as HTMLElement;
              el.style.transform = 'translateY(-2px)';
              el.style.boxShadow = `0 8px 24px rgba(0,0,0,0.35), 0 0 0 1px ${accentColor ?? 'var(--theme-accent-start)'}28`;
              if (accentColor) el.style.borderColor = accentColor + '45';
            }
          : undefined
      }
      onMouseLeave={
        hoverable
          ? e => {
              const el = e.currentTarget as HTMLElement;
              el.style.transform = '';
              el.style.boxShadow = '0 1px 3px rgba(0,0,0,0.2), 0 1px 2px rgba(0,0,0,0.15)';
              el.style.borderColor = accentColor ? accentColor + '28' : 'var(--theme-border, #1E293B)';
            }
          : undefined
      }
    >
      {/* Optional top accent bar */}
      {accentColor && (
        <div
          className="absolute top-0 left-0 right-0 h-[2px] rounded-t-2xl"
          style={{ background: `linear-gradient(90deg, ${accentColor}, transparent)` }}
        />
      )}
      {children}
    </div>
  );
};
