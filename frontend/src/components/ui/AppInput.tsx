import React from 'react';

interface AppInputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const AppInput: React.FC<AppInputProps> = ({ className = '', ...props }) => {
  return (
    <input 
      className={`w-full bg-[#0F172A] border border-[#1E293B] rounded-xl px-3.5 py-2.5 text-xs font-sans text-slate-100 placeholder-slate-500 focus:outline-none focus:border-[#06B6D4] focus:ring-1 focus:ring-[#06B6D4]/30 transition-all ${className}`}
      {...props}
    />
  );
};
