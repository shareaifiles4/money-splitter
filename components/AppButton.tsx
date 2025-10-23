
import React from 'react';

interface AppButtonProps {
  onClick: () => void;
  title: string;
  variant?: 'primary' | 'secondary';
  className?: string;
  disabled?: boolean;
}

const AppButton: React.FC<AppButtonProps> = ({ onClick, title, variant = 'primary', className = '', disabled = false }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`w-full rounded-lg px-4 py-3 text-base font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${
      variant === 'primary'
        ? 'bg-emerald-500 text-white hover:bg-emerald-600'
        : 'border border-gray-500 bg-transparent text-gray-700 hover:bg-gray-100'
    } ${className}`}
  >
    {title}
  </button>
);

export default AppButton;
