import React from 'react';

interface FormInputProps {
  label?: string;
  error?: string;
  hint?: string;
  icon?: React.ReactNode;
  iconRight?: React.ReactNode;
  onIconRightClick?: () => void;
  required?: boolean;
  id?: string;
  className?: string;
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  [key: string]: any; // allow extra HTML input attributes
}

export function FormInput({
  label,
  error,
  hint,
  icon,
  iconRight,
  onIconRightClick,
  required,
  className = '',
  id,
  ...props
}: FormInputProps) {
  const inputId = id ?? `input-${label?.toLowerCase().replace(/\s+/g, '-')}`;
  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label
          htmlFor={inputId}
          className="block text-xs font-semibold text-[#475569] mb-1.5 uppercase tracking-wide"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        {icon && (
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#94A3B8]">
            {icon}
          </span>
        )}
        <input
          id={inputId}
          className={`form-input ${icon ? 'pl-10' : ''} ${iconRight ? 'pr-10' : ''} ${
            error ? 'border-red-400 focus:!border-red-400 focus:!shadow-[0_0_0_3px_rgb(220_38_38_/_0.10)]' : ''
          }`}
          {...props}
        />
        {iconRight && (
          <button
            type="button"
            onClick={onIconRightClick}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#94A3B8] hover:text-[#475569] transition-colors cursor-pointer"
          >
            {iconRight}
          </button>
        )}
      </div>
      {error && (
        <p className="mt-1.5 text-xs text-red-500 font-medium">{error}</p>
      )}
      {hint && !error && (
        <p className="mt-1.5 text-xs text-[#94A3B8]">{hint}</p>
      )}
    </div>
  );
}

interface FormSelectProps {
  label?: string;
  error?: string;
  hint?: string;
  options: { value: string; label: string }[];
  placeholder?: string;
  required?: boolean;
  id?: string;
  className?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  disabled?: boolean;
  [key: string]: any;
}

export function FormSelect({
  label,
  error,
  hint,
  options,
  placeholder,
  required,
  className = '',
  id,
  ...props
}: FormSelectProps) {
  const selectId = id ?? `select-${label?.toLowerCase().replace(/\s+/g, '-')}`;
  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label
          htmlFor={selectId}
          className="block text-xs font-semibold text-[#475569] mb-1.5 uppercase tracking-wide"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <select
        id={selectId}
        className={`form-input appearance-none bg-[url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='%2394A3B8'%3E%3Cpath fill-rule='evenodd' d='M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z' clip-rule='evenodd'/%3E%3C/svg%3E")] bg-no-repeat bg-right-3 bg-[length:16px_16px] pr-9 ${
          error ? 'border-red-400 focus:!border-red-400' : ''
        }`}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-1.5 text-xs text-red-500 font-medium">{error}</p>}
      {hint && !error && <p className="mt-1.5 text-xs text-[#94A3B8]">{hint}</p>}
    </div>
  );
}
