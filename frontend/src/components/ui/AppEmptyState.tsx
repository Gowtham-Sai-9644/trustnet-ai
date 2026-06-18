import React from 'react';
import { AppButton } from './AppButton';

interface AppEmptyStateProps {
  title: string;
  description: string;
  icon?: React.ComponentType<any>;
  actionText?: string;
  onAction?: () => void;
  className?: string;
}

export const AppEmptyState: React.FC<AppEmptyStateProps> = ({
  title,
  description,
  icon: Icon,
  actionText,
  onAction,
  className = ''
}) => {
  return (
    <div className={`flex flex-col items-center justify-center text-center p-8 border border-[#1E293B] rounded-2xl bg-[#111827] space-y-4 ${className}`}>
      {Icon && (
        <div className="bg-[#1E293B] p-4 rounded-full border border-slate-700/30">
          <Icon className="w-8 h-8 text-[#06B6D4]" />
        </div>
      )}
      <div className="space-y-1">
        <h4 className="text-sm font-bold text-slate-200">{title}</h4>
        <p className="text-xs text-slate-400 max-w-sm leading-normal">{description}</p>
      </div>
      {actionText && onAction && (
        <AppButton variant="primary" onClick={onAction}>
          {actionText}
        </AppButton>
      )}
    </div>
  );
};
