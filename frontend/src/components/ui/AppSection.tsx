import React from 'react';

interface AppSectionProps {
  children: React.ReactNode;
  className?: string;
}

export const AppSection: React.FC<AppSectionProps> = ({ children, className = '' }) => {
  return (
    <section className={`space-y-4 py-4 ${className}`}>
      {children}
    </section>
  );
};
