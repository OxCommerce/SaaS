import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface MetricCardProps {
  label: string;
  value: string | number;
  subValue?: string;
  change?: number; // percentage, positive = up, negative = down
  changeLabel?: string;
  icon?: React.ReactNode;
  iconBg?: string;
  prefix?: string;
  suffix?: string;
  loading?: boolean;
  onClick?: () => void;
  className?: string;
}

export function MetricCard({
  label,
  value,
  subValue,
  change,
  changeLabel,
  icon,
  iconBg = 'bg-emerald-50',
  prefix,
  suffix,
  loading = false,
  onClick,
  className = '',
}: MetricCardProps) {
  const hasTrend = change !== undefined && change !== null;
  const isPositive = hasTrend && change! > 0;
  const isNegative = hasTrend && change! < 0;

  return (
    <div
      className={`card p-5 ${onClick ? 'cursor-pointer card-hover' : ''} ${className}`}
      onClick={onClick}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-[#64748B] uppercase tracking-wide mb-2 truncate">
            {label}
          </p>
          {loading ? (
            <div className="h-8 w-32 bg-slate-100 animate-pulse rounded-md" />
          ) : (
            <div className="flex items-baseline gap-1">
              {prefix && <span className="text-sm font-semibold text-[#64748B]">{prefix}</span>}
              <span className="text-2xl font-bold text-[#0F172A] font-display leading-none">
                {typeof value === 'number' ? value.toLocaleString('pt-BR') : value}
              </span>
              {suffix && <span className="text-sm font-semibold text-[#64748B]">{suffix}</span>}
            </div>
          )}
          {subValue && (
            <p className="text-xs text-[#64748B] mt-1 truncate">{subValue}</p>
          )}
          {hasTrend && (
            <div className={`flex items-center gap-1 mt-2 text-xs font-semibold ${
              isPositive ? 'text-green-600' : isNegative ? 'text-red-500' : 'text-slate-500'
            }`}>
              {isPositive ? (
                <TrendingUp className="h-3.5 w-3.5" />
              ) : isNegative ? (
                <TrendingDown className="h-3.5 w-3.5" />
              ) : (
                <Minus className="h-3.5 w-3.5" />
              )}
              <span>
                {isPositive ? '+' : ''}{change!.toFixed(1)}%
                {changeLabel && <span className="text-[#94A3B8] font-normal ml-1">{changeLabel}</span>}
              </span>
            </div>
          )}
        </div>
        {icon && (
          <div className={`h-11 w-11 rounded-xl ${iconBg} flex items-center justify-center flex-shrink-0`}>
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
