import React from 'react';

interface AppSkeletonProps {
  variant?: 'text' | 'rect' | 'circle' | 'card';
  className?: string;
}

export const AppSkeleton: React.FC<AppSkeletonProps> = ({ variant = 'text', className = '' }) => {
  const baseStyle = "animate-pulse bg-[#1E293B]/60";
  const styles = {
    text: "h-3 rounded w-3/4",
    rect: "h-20 rounded-xl w-full",
    circle: "h-10 w-10 rounded-full",
    card: "p-5 border border-[#1E293B] rounded-2xl bg-[#111827] space-y-3"
  };

  if (variant === 'card') {
    return (
      <div className={`${styles.card} ${className}`}>
        <div className="h-4 bg-[#1E293B]/70 rounded w-1/3 animate-pulse" />
        <div className="h-8 bg-[#1E293B]/50 rounded w-1/2 animate-pulse" />
        <div className="h-3.5 bg-[#1E293B]/40 rounded w-full animate-pulse" />
      </div>
    );
  }

  return (
    <div className={`${baseStyle} ${styles[variant]} ${className}`} />
  );
};
