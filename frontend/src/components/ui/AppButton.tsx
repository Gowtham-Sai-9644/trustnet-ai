import React from 'react';

interface AppButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  children: React.ReactNode;
  className?: string;
}

export const AppButton: React.FC<AppButtonProps> = ({ variant = 'primary', children, className = '', ...props }) => {
  const baseStyle = "px-4 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all active:scale-[0.98] hover:scale-[1.01] flex items-center justify-center space-x-1.5 shadow-sm cursor-pointer disabled:opacity-50 disabled:pointer-events-none";
  const variants = {
    primary: "bg-[#06B6D4] hover:bg-[#06B6D4]/90 text-slate-900",
    secondary: "bg-[#0F172A] hover:bg-[#1E293B] border border-[#1E293B] text-slate-200",
    danger: "bg-[#EF4444] hover:bg-[#EF4444]/90 text-slate-100"
  };
  return (
    <button className={`${baseStyle} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};
