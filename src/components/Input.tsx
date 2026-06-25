import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  fullWidth?: boolean;
}

export const Input: React.FC<InputProps> = ({ label, fullWidth, className = '', ...props }) => {
  return (
    <div className={`flex flex-col gap-1 ${fullWidth ? 'w-full' : ''}`}>
      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide">
        {label}
      </label>
      <input
        className={`w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 placeholder:text-slate-400 bg-white disabled:bg-slate-100 transition-colors ${className}`}
        {...props}
      />
    </div>
  );
};

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: { value: string; label: string }[];
  fullWidth?: boolean;
}

export const Select: React.FC<SelectProps> = ({ label, options, fullWidth, className = '', ...props }) => {
  return (
    <div className={`flex flex-col gap-1 ${fullWidth ? 'w-full' : ''}`}>
      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide">
        {label}
      </label>
      <select
        className={`w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 bg-white disabled:bg-slate-100 transition-colors ${className}`}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
};
