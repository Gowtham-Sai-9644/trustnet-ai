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
        background: 'var(--theme-card, #0A1728)',
        border: `1px solid ${accentColor ? accentColor + '28' : 'var(--theme-border, #132338)'}`,
        borderRadius: '10px',
        boxShadow: 'none',
      }}
      onMouseEnter={
        hoverable
          ? e => {
              const el = e.currentTarget as HTMLElement;
              el.style.transform = '';
              el.style.boxShadow = 'none';
              if (accentColor) el.style.borderColor = accentColor + '45';
            }
          : undefined
      }
      onMouseLeave={
        hoverable
          ? e => {
              const el = e.currentTarget as HTMLElement;
              el.style.transform = '';
              el.style.boxShadow = 'none';
              el.style.borderColor = accentColor ? accentColor + '28' : 'var(--theme-border, #132338)';
            }
          : undefined
      }
    >
      {/* Optional top accent bar */}
      {accentColor && (
        <div
          className="absolute top-0 left-0 right-0 h-[2px] rounded-t-[10px]"
          style={{ background: `linear-gradient(90deg, ${accentColor}, transparent)` }}
        />
      )}
      {children}
    </div>
  );
};
