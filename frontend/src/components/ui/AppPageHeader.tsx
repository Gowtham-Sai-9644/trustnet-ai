import React from 'react';

interface AppPageHeaderProps {
  title: string;
  description?: string;
  rightElement?: React.ReactNode;
}

export const AppPageHeader: React.FC<AppPageHeaderProps> = ({ title, description, rightElement }) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-[#1E293B] pb-4 mb-6">
      <div className="space-y-1 text-left">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-100 font-sans">
          {title}
        </h1>
        {description && (
          <p className="text-slate-400 text-xs font-sans">
            {description}
          </p>
        )}
      </div>
      {rightElement && (
        <div className="flex-shrink-0 flex items-center space-x-3">
          {rightElement}
        </div>
      )}
    </div>
  );
};
