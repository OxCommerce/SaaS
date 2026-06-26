import React from 'react';
import { ChevronRight } from 'lucide-react';

interface SectionHeaderProps {
  label?: string;         // small tag above title
  title: string;
  subtitle?: string;
  align?: 'left' | 'center';
  action?: { label: string; onClick: () => void };
  className?: string;
}

export function SectionHeader({
  label,
  title,
  subtitle,
  align = 'center',
  action,
  className = '',
}: SectionHeaderProps) {
  const alignClass = align === 'center' ? 'text-center items-center' : 'text-left items-start';
  return (
    <div className={`flex flex-col gap-3 ${alignClass} ${className}`}>
      {label && (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-700 uppercase tracking-wide w-fit">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          {label}
        </span>
      )}
      <h2 className="text-2xl sm:text-3xl font-bold text-[#0F172A] font-display leading-tight">
        {title}
      </h2>
      {subtitle && (
        <p className={`text-[#64748B] text-base leading-relaxed ${align === 'center' ? 'max-w-xl mx-auto' : 'max-w-xl'}`}>
          {subtitle}
        </p>
      )}
      {action && (
        <button
          onClick={action.onClick}
          className="inline-flex items-center gap-1 text-sm font-semibold text-emerald-700 hover:text-emerald-800 transition-colors mt-1 cursor-pointer group"
        >
          {action.label}
          <ChevronRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
        </button>
      )}
    </div>
  );
}
