import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  icon?: string;
  variant?: 'primary' | 'secondary' | 'danger';
}

export const Button: React.FC<ButtonProps> = ({
  label,
  icon,
  variant = 'primary',
  className = '',
  ...props
}) => {
  const baseStyle = 'inline-flex items-center justify-center font-semibold rounded-lg transition-colors focus:outline-none';
  
  const variantStyles = {
    primary: 'bg-brand-600 hover:bg-brand-700 text-white shadow-sm',
    secondary: 'border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 shadow-sm',
    danger: 'bg-red-600 hover:bg-red-700 text-white shadow-sm'
  };

  const currentVariant = variantStyles[variant] || variantStyles.primary;

  return (
    <button
      className={`${baseStyle} ${currentVariant} px-3 py-1.5 text-xs ${className}`}
      {...props}
    >
      {icon && (
        <span className="material-symbols-outlined mr-1 text-[16px]">{icon}</span>
      )}
      {label}
    </button>
  );
};
