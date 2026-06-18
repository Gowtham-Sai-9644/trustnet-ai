import React from 'react';

interface AppCardProps {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
  onClick?: () => void;
}

export const AppCard: React.FC<AppCardProps> = ({ children, className = '', hoverable = false, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className={`bg-[#111827] border border-[#1E293B] rounded-2xl p-5 shadow-sm transition-all duration-200 ${
        hoverable ? 'hover:-translate-y-1 hover:border-[#00E5FF]/40 hover:shadow-lg cursor-pointer' : ''
      } ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      {children}
    </div>
  );
};
