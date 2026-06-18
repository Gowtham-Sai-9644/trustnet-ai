import React from 'react';
import { X } from 'lucide-react';
import { AppCard } from './AppCard';
import { AppButton } from './AppButton';

interface AppModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

export const AppModal: React.FC<AppModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  className = ''
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#070B14]/80 backdrop-blur-sm">
      <div className="absolute inset-0" onClick={onClose} />
      <AppCard className={`relative z-10 w-full max-w-lg shadow-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto ${className}`}>
        <div className="flex justify-between items-center border-b border-[#1E293B] pb-3">
          <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider">{title}</h3>
          <button 
            onClick={onClose} 
            className="text-slate-500 hover:text-slate-300 transition-colors p-1 rounded-lg hover:bg-[#1E293B]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="text-xs text-slate-300 leading-relaxed font-sans">
          {children}
        </div>
        {footer ? (
          <div className="flex justify-end space-x-3 border-t border-[#1E293B] pt-3">
            {footer}
          </div>
        ) : (
          <div className="flex justify-end space-x-3 border-t border-[#1E293B] pt-3">
            <AppButton variant="secondary" onClick={onClose}>Close</AppButton>
          </div>
        )}
      </AppCard>
    </div>
  );
};
