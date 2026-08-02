import React from 'react';

interface AppPageHeaderProps {
  title: string;
  description?: string;
  rightElement?: React.ReactNode;
  badge?: string;
  badgeColor?: string;
}

export const AppPageHeader: React.FC<AppPageHeaderProps> = ({
  title,
  description,
  rightElement,
  badge,
  badgeColor,
}) => {
  const accent = badgeColor ?? 'var(--theme-accent-start)';

  return (
    <div
      className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 pb-5 mb-6"
      style={{ borderBottom: '1px solid var(--theme-border)' }}
    >
      <div className="space-y-1 text-left">
        <div className="flex items-center gap-3 mb-1">
          {badge && (
            <span
              className="text-[10px] font-mono font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full"
              style={{
                background: `${accent}18`,
                color: accent,
                border: `1px solid ${accent}30`,
              }}
            >
              {badge}
            </span>
          )}
        </div>
        <h1
          className="text-2xl sm:text-3xl font-display font-extrabold tracking-tight leading-tight"
          style={{ color: 'var(--theme-text)' }}
        >
          {title}
        </h1>
        {description && (
          <p
            className="text-sm font-sans leading-relaxed max-w-xl"
            style={{ color: 'var(--theme-text-muted)' }}
          >
            {description}
          </p>
        )}
      </div>

      {rightElement && (
        <div className="flex-shrink-0 flex items-center gap-3">
          {rightElement}
        </div>
      )}
    </div>
  );
};
